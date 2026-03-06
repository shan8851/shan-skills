import { readFile } from "node:fs/promises";

import {
  generatedSkillsDataSchema,
  type GeneratedSkillsData,
  type Skill,
} from "@/lib/skills/skillsSchema";
import { generatedSkillsDataPath } from "@/lib/skills/skillsPaths";

let cachedDataPromise: Promise<GeneratedSkillsData> | null = null;

const parseGeneratedData = (rawJson: string): GeneratedSkillsData => {
  const parsedJson: unknown = JSON.parse(rawJson);
  return generatedSkillsDataSchema.parse(parsedJson);
};

const readGeneratedSkillsData = async (): Promise<GeneratedSkillsData> => {
  try {
    const rawJson = await readFile(generatedSkillsDataPath, "utf8");
    return parseGeneratedData(rawJson);
  } catch (error: unknown) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      throw new Error(
        "generated/skillsData.json is missing. Run `npm run skills:sync` before starting dev/build.",
      );
    }

    throw error;
  }
};

export const getSkillsData = async (): Promise<GeneratedSkillsData> => {
  if (cachedDataPromise === null) {
    cachedDataPromise = readGeneratedSkillsData().catch((error: unknown) => {
      cachedDataPromise = null;
      throw error;
    });
  }

  return cachedDataPromise;
};

export const getAllSkills = async (): Promise<Skill[]> => {
  const data = await getSkillsData();
  return data.skills;
};

export const getSkillBySlug = async (slug: string): Promise<Skill | null> => {
  const skills = await getAllSkills();
  return skills.find((skill) => skill.slug === slug) ?? null;
};
