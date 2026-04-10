import { execFile } from "node:child_process";
import {
  mkdir,
  mkdtemp,
  readdir,
  readFile,
  rm,
  writeFile,
} from "node:fs/promises";
import { basename, join, relative } from "node:path";
import { tmpdir } from "node:os";
import { promisify } from "node:util";

import matter from "gray-matter";

import {
  generatedSkillsDataSchema,
  skillSourceFrontmatterSchema,
  type GeneratedSkillsData,
  type ResourceDocument,
  type Skill,
} from "@/lib/skills/skillsSchema";
import {
  generatedSkillsDataPath,
  generatedSkillsOutputDirectoryPath,
  sourceMarkdownFileExtension,
  sourceRepositoryBranch,
  sourceRepositoryCheckoutDirectoryName,
  sourceRepositoryName,
  sourceRepositoryOwner,
  sourceRepositoryUrl,
  sourceSkillDocumentName,
  sourceSkillsRootPath,
} from "@/lib/skills/skillsPaths";

const execFileAsync = promisify(execFile);

const writeStatusLine = (message: string): void => {
  process.stdout.write(`${message}\n`);
};

const buildResourceTitle = (relativePath: string): string => {
  const filename = basename(relativePath, sourceMarkdownFileExtension);

  return filename
    .split(/[-_]/g)
    .filter((segment) => segment.length > 0)
    .map((segment) => segment[0].toUpperCase() + segment.slice(1))
    .join(" ");
};

const normalizeRelativePath = (value: string): string => {
  return value.replace(/\\/g, "/");
};

const listMarkdownFilePaths = async (
  directoryPath: string,
): Promise<string[]> => {
  const entries = await readdir(directoryPath, { withFileTypes: true });

  const filePaths = await Promise.all(
    entries.map(async (entry) => {
      const absolutePath = join(directoryPath, entry.name);

      if (entry.isDirectory()) {
        return listMarkdownFilePaths(absolutePath);
      }

      if (entry.isFile() && entry.name.endsWith(sourceMarkdownFileExtension)) {
        return [absolutePath];
      }

      return [];
    }),
  );

  return filePaths.flat().sort((left, right) => left.localeCompare(right));
};

const getSkillSlugs = async (
  repositoryRootDirectory: string,
): Promise<Array<{ category: string; slug: string }>> => {
  const skillsDirectoryPath = join(
    repositoryRootDirectory,
    sourceSkillsRootPath,
  );
  const categoryEntries = await readdir(skillsDirectoryPath, {
    withFileTypes: true,
  });

  const skillEntries: Array<{ category: string; slug: string }> = [];

  for (const categoryEntry of categoryEntries) {
    if (!categoryEntry.isDirectory()) continue;

    const category = categoryEntry.name;
    const categoryPath = join(skillsDirectoryPath, category);
    const slugEntries = await readdir(categoryPath, { withFileTypes: true });

    for (const slugEntry of slugEntries) {
      if (slugEntry.isDirectory()) {
        skillEntries.push({ category, slug: slugEntry.name });
      }
    }
  }

  if (skillEntries.length === 0) {
    throw new Error("No skill directories found in source repository");
  }

  return skillEntries.sort((left, right) => {
    const categoryCompare = left.category.localeCompare(right.category);
    if (categoryCompare !== 0) return categoryCompare;
    return left.slug.localeCompare(right.slug);
  });
};

const parseSourceSkillDocument = (
  skillSlug: string,
  rawSkillMarkdown: string,
): {
  description: string;
  clawhubUrl?: string;
  markdownBody: string;
} => {
  const parsedSkillDocument = matter(rawSkillMarkdown);
  const parsedFrontmatter = skillSourceFrontmatterSchema.parse(
    parsedSkillDocument.data,
  );
  const sourceSkillIdentifier = parsedFrontmatter.name;

  if (sourceSkillIdentifier !== skillSlug) {
    throw new Error(
      `Frontmatter name mismatch for '${skillSlug}'. Expected '${skillSlug}', found '${sourceSkillIdentifier}'.`,
    );
  }

  return {
    description: parsedFrontmatter.description,
    clawhubUrl: parsedFrontmatter.clawhubUrl,
    markdownBody: parsedSkillDocument.content,
  };
};

const buildResourceDocuments = async (
  skillSlug: string,
  skillDirectoryPath: string,
  markdownFilePaths: string[],
): Promise<ResourceDocument[]> => {
  const skillDocumentPath = join(skillDirectoryPath, sourceSkillDocumentName);
  const resourceMarkdownPaths = markdownFilePaths.filter(
    (absolutePath) => absolutePath !== skillDocumentPath,
  );

  return Promise.all(
    resourceMarkdownPaths.map(async (resourcePath) => {
      const markdown = await readFile(resourcePath, "utf8");
      const relativePath = normalizeRelativePath(
        relative(skillDirectoryPath, resourcePath),
      );

      return {
        id: `${skillSlug}:${relativePath}`,
        title: buildResourceTitle(relativePath),
        relativePath,
        markdown,
      } satisfies ResourceDocument;
    }),
  );
};

const buildSkillRecord = async (
  repositoryRootDirectory: string,
  skillSlug: string,
  category: string,
): Promise<Skill> => {
  const skillDirectoryPath = join(
    repositoryRootDirectory,
    sourceSkillsRootPath,
    category,
    skillSlug,
  );
  const markdownFilePaths = await listMarkdownFilePaths(skillDirectoryPath);
  const skillDocumentPath = join(skillDirectoryPath, sourceSkillDocumentName);

  if (!markdownFilePaths.includes(skillDocumentPath)) {
    throw new Error(
      `Missing ${sourceSkillDocumentName} in '${sourceSkillsRootPath}/${category}/${skillSlug}'`,
    );
  }

  const rawSkillMarkdown = await readFile(skillDocumentPath, "utf8");
  const parsedSkillDocument = parseSourceSkillDocument(
    skillSlug,
    rawSkillMarkdown,
  );
  const resourceDocuments = await buildResourceDocuments(
    skillSlug,
    skillDirectoryPath,
    markdownFilePaths,
  );

  return {
    slug: skillSlug,
    name: skillSlug,
    description: parsedSkillDocument.description,
    category,
    clawhubUrl: parsedSkillDocument.clawhubUrl,
    skillMarkdown: parsedSkillDocument.markdownBody,
    resourceDocuments,
  };
};

const assertUniqueSkillSlugs = (skills: Skill[]): void => {
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
  const repositoryRootDirectory = join(
    cleanupDirectory,
    sourceRepositoryCheckoutDirectoryName,
  );

  await execFileAsync("git", [
    "clone",
    "--depth",
    "1",
    "--branch",
    sourceRepositoryBranch,
    sourceRepositoryUrl,
    repositoryRootDirectory,
  ]);

  return {
    cleanupDirectory,
    repositoryRootDirectory,
  };
};

export const buildGeneratedSkillsData =
  async (): Promise<GeneratedSkillsData> => {
    const { cleanupDirectory, repositoryRootDirectory } =
      await cloneSourceRepository();

    try {
      const skillEntries = await getSkillSlugs(repositoryRootDirectory);
      const skills = await Promise.all(
        skillEntries.map(({ category, slug }) =>
          buildSkillRecord(repositoryRootDirectory, slug, category),
        ),
      );

      assertUniqueSkillSlugs(skills);

      const sortedSkills = [...skills].sort((left, right) =>
        left.slug.localeCompare(right.slug, "en", { sensitivity: "base" }),
      );

      return {
        generatedAt: new Date().toISOString(),
        source: {
          owner: sourceRepositoryOwner,
          repo: sourceRepositoryName,
          branch: sourceRepositoryBranch,
          skillsRootPath: sourceSkillsRootPath,
        },
        skills: sortedSkills,
      };
    } finally {
      await rm(cleanupDirectory, { recursive: true, force: true });
    }
  };

export const writeGeneratedSkillsData = async (
  generatedData: GeneratedSkillsData,
): Promise<GeneratedSkillsData> => {
  const validatedData = generatedSkillsDataSchema.parse(generatedData);

  await mkdir(generatedSkillsOutputDirectoryPath, { recursive: true });
  await writeFile(
    generatedSkillsDataPath,
    `${JSON.stringify(validatedData, null, 2)}\n`,
    "utf8",
  );

  return validatedData;
};

export const runSkillsSync = async (): Promise<void> => {
  writeStatusLine("[skills:sync] Fetching skill content from GitHub...");

  const generatedData = await buildGeneratedSkillsData();
  const validatedData = await writeGeneratedSkillsData(generatedData);

  writeStatusLine(
    `[skills:sync] Synced ${validatedData.skills.length} skills to ${generatedSkillsDataPath}`,
  );
};
