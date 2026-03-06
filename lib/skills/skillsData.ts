import { readFile } from "node:fs/promises";
import { join } from "node:path";

import {
  generatedSkillsDataSchema,
  type GeneratedSkillsData,
  type Skill,
} from "@/lib/skills/skillsSchema";

const generatedDataPath = join(process.cwd(), "generated", "skillsData.json");

let cachedDataPromise: Promise<GeneratedSkillsData> | null = null;

const parseGeneratedData = (rawJson: string): GeneratedSkillsData => {
  const parsedJson: unknown = JSON.parse(rawJson);
  return generatedSkillsDataSchema.parse(parsedJson);
};

export const getSkillsData = async (): Promise<GeneratedSkillsData> => {
  if (cachedDataPromise === null) {
    cachedDataPromise = readFile(generatedDataPath, "utf8")
      .then(parseGeneratedData)
      .catch((error: unknown) => {
        cachedDataPromise = null;

        if (error instanceof Error && "code" in error && error.code === "ENOENT") {
          throw new Error(
            "generated/skillsData.json is missing. Run `npm run skills:sync` before starting dev/build.",
          );
        }

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
