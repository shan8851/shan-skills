import { execFile } from "node:child_process";
import { mkdir, mkdtemp, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { basename, join, relative } from "node:path";
import { tmpdir } from "node:os";
import { promisify } from "node:util";

import matter from "gray-matter";

import {
  generatedSkillsDataSchema,
  skillFrontmatterSchema,
  type GeneratedSkillsData,
  type ResourceDocument,
  type Skill,
} from "../lib/skills/skillsSchema";

const sourceOwner = "shan8851";
const sourceRepo = "agent-skills";
const sourceBranch = "main";
const sourceSkillsRootPath = "skills";

const sourceRepositoryUrl = `https://github.com/${sourceOwner}/${sourceRepo}.git`;
const outputFilePath = join(process.cwd(), "generated", "skillsData.json");
const markdownExtension = ".md";

const execFileAsync = promisify(execFile);

const printLine = (message: string): void => {
  process.stdout.write(`${message}\n`);
};

const toResourceTitle = (relativePath: string): string => {
  const filename = basename(relativePath, markdownExtension);
  return filename
    .split(/[-_]/g)
    .filter((segment) => segment.length > 0)
    .map((segment) => segment[0].toUpperCase() + segment.slice(1))
    .join(" ");
};

const parseSkillFrontmatter = (
  skillSlug: string,
  rawSkillMarkdown: string,
): { description: string; markdownBody: string } => {
  const parsedMarkdown = matter(rawSkillMarkdown);
  const parsedFrontmatter = skillFrontmatterSchema.parse(parsedMarkdown.data);

  if (parsedFrontmatter.name !== skillSlug) {
    throw new Error(
      `Frontmatter name mismatch for '${skillSlug}'. Expected '${skillSlug}', found '${parsedFrontmatter.name}'.`,
    );
  }

  return {
    description: parsedFrontmatter.description,
    markdownBody: parsedMarkdown.content,
  };
};

const normalizeRelativePath = (value: string): string => {
  return value.replace(/\\/g, "/");
};

const listMarkdownFilesRecursively = async (directoryPath: string): Promise<string[]> => {
  const entries = await readdir(directoryPath, { withFileTypes: true });

  const filePaths = await Promise.all(
    entries.map(async (entry) => {
      const absolutePath = join(directoryPath, entry.name);

      if (entry.isDirectory()) {
        return listMarkdownFilesRecursively(absolutePath);
      }

      if (entry.isFile() && entry.name.endsWith(markdownExtension)) {
        return [absolutePath];
      }

      return [];
    }),
  );

  return filePaths.flat().sort((left, right) => left.localeCompare(right));
};

const getSkillSlugs = async (repositoryRootDirectory: string): Promise<string[]> => {
  const skillsDirectoryPath = join(repositoryRootDirectory, sourceSkillsRootPath);
  const entries = await readdir(skillsDirectoryPath, { withFileTypes: true });

  const skillSlugs = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right));

  if (skillSlugs.length === 0) {
    throw new Error("No skill directories found in source repository");
  }

  return skillSlugs;
};

const buildResourceDocuments = async (
  skillSlug: string,
  skillDirectoryPath: string,
  markdownAbsolutePaths: string[],
): Promise<ResourceDocument[]> => {
  const skillFilePath = join(skillDirectoryPath, "SKILL.md");

  const resourcePaths = markdownAbsolutePaths.filter((absolutePath) => absolutePath !== skillFilePath);

  const resourceDocuments = await Promise.all(
    resourcePaths.map(async (resourcePath) => {
      const markdown = await readFile(resourcePath, "utf8");
      const relativePath = normalizeRelativePath(relative(skillDirectoryPath, resourcePath));

      return {
        id: `${skillSlug}:${relativePath}`,
        title: toResourceTitle(relativePath),
        relativePath,
        markdown,
      } satisfies ResourceDocument;
    }),
  );

  return resourceDocuments;
};

const buildSkill = async (repositoryRootDirectory: string, skillSlug: string): Promise<Skill> => {
  const skillDirectoryPath = join(repositoryRootDirectory, sourceSkillsRootPath, skillSlug);
  const markdownAbsolutePaths = await listMarkdownFilesRecursively(skillDirectoryPath);
  const skillFilePath = join(skillDirectoryPath, "SKILL.md");

  if (!markdownAbsolutePaths.includes(skillFilePath)) {
    throw new Error(`Missing SKILL.md in '${sourceSkillsRootPath}/${skillSlug}'`);
  }

  const rawSkillMarkdown = await readFile(skillFilePath, "utf8");
  const parsedSkill = parseSkillFrontmatter(skillSlug, rawSkillMarkdown);
  const resourceDocuments = await buildResourceDocuments(
    skillSlug,
    skillDirectoryPath,
    markdownAbsolutePaths,
  );

  return {
    slug: skillSlug,
    name: skillSlug,
    description: parsedSkill.description,
    skillMarkdown: parsedSkill.markdownBody,
    resourceDocuments,
  };
};

const ensureUniqueSkillSlugs = (skills: Skill[]): void => {
  const slugSet = new Set<string>();

  skills.forEach((skill) => {
    if (slugSet.has(skill.slug)) {
      throw new Error(`Duplicate skill slug found: '${skill.slug}'`);
    }

    slugSet.add(skill.slug);
  });
};

const cloneSourceRepository = async (): Promise<{
  cleanupDirectory: string;
  repositoryRootDirectory: string;
}> => {
  const cleanupDirectory = await mkdtemp(join(tmpdir(), "shan-skills-sync-"));
  const repositoryRootDirectory = join(cleanupDirectory, "source-repo");

  await execFileAsync("git", [
    "clone",
    "--depth",
    "1",
    "--branch",
    sourceBranch,
    sourceRepositoryUrl,
    repositoryRootDirectory,
  ]);

  return {
    cleanupDirectory,
    repositoryRootDirectory,
  };
};

const buildGeneratedData = async (): Promise<GeneratedSkillsData> => {
  const { cleanupDirectory, repositoryRootDirectory } = await cloneSourceRepository();

  try {
    const skillSlugs = await getSkillSlugs(repositoryRootDirectory);
    const skills = await Promise.all(
      skillSlugs.map((skillSlug) => buildSkill(repositoryRootDirectory, skillSlug)),
    );

    ensureUniqueSkillSlugs(skills);

    const sortedSkills = [...skills].sort((left, right) =>
      left.name.localeCompare(right.name, "en", { sensitivity: "base" }),
    );

    return {
      generatedAt: new Date().toISOString(),
      source: {
        owner: sourceOwner,
        repo: sourceRepo,
        branch: sourceBranch,
        skillsRootPath: sourceSkillsRootPath,
      },
      skills: sortedSkills,
    };
  } finally {
    await rm(cleanupDirectory, { recursive: true, force: true });
  }
};

const run = async (): Promise<void> => {
  printLine("[skills:sync] Fetching skill content from GitHub...");

  const generatedData = await buildGeneratedData();
  const validatedData = generatedSkillsDataSchema.parse(generatedData);

  await mkdir(join(process.cwd(), "generated"), { recursive: true });
  await writeFile(outputFilePath, `${JSON.stringify(validatedData, null, 2)}\n`, "utf8");

  printLine(
    `[skills:sync] Synced ${validatedData.skills.length} skills to generated/skillsData.json`,
  );
};

run().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Unknown error";
  process.stderr.write(`[skills:sync] Failed: ${message}\n`);
  process.exitCode = 1;
});
