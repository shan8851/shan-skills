import type { Skill } from "@/lib/skills/skillsSchema";

export type SkillSummary = Pick<Skill, "description" | "name" | "slug">;

export const filterSkillsByQuery = (
  skills: SkillSummary[],
  searchQuery: string,
): SkillSummary[] => {
  const normalizedQuery = searchQuery.trim().toLowerCase();

  if (normalizedQuery.length === 0) {
    return skills;
  }

  return skills.filter((skill) => {
    const searchableText =
      `${skill.slug} ${skill.name} ${skill.description}`.toLowerCase();
    return searchableText.includes(normalizedQuery);
  });
};
