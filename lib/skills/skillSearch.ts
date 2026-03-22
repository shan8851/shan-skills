import type { Skill } from "@/lib/skills/skillsSchema";

export type SkillSummary = Pick<
  Skill,
  "description" | "name" | "slug" | "category" | "clawhubUrl"
>;

export const filterSkillsByQuery = (
  skills: SkillSummary[],
  searchQuery: string,
): SkillSummary[] => {
  const normalizedQuery = searchQuery.trim().toLowerCase();

  if (normalizedQuery.length === 0) {
    return skills;
  }

  return skills.filter((skill) => {
    const categoryLabel = skill.category === "cli-tool" ? "cli tool" : "workflow";
    const searchableText =
      `${skill.slug} ${skill.name} ${skill.description} ${categoryLabel}`.toLowerCase();
    return searchableText.includes(normalizedQuery);
  });
};
