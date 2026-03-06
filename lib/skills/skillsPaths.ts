import { join } from "node:path";

export const generatedSkillsDirectoryName = "generated";
export const generatedSkillsFilename = "skillsData.json";
export const generatedSkillsOutputDirectoryPath = join(
  process.cwd(),
  generatedSkillsDirectoryName,
);
export const generatedSkillsDataPath = join(
  generatedSkillsOutputDirectoryPath,
  generatedSkillsFilename,
);

export const sourceRepositoryOwner = "shan8851";
export const sourceRepositoryName = "agent-skills";
export const sourceRepositoryBranch = "main";
export const sourceSkillsRootPath = "skills";
export const sourceRepositoryCheckoutDirectoryName = "source-repo";
export const sourceSkillDocumentName = "SKILL.md";
export const sourceMarkdownFileExtension = ".md";
export const sourceRepositoryUrl = `https://github.com/${sourceRepositoryOwner}/${sourceRepositoryName}.git`;
