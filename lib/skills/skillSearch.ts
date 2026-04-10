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
    const categoryLabels: Record<string, string> = {
      "workflow": "workflow",
      "software-engineering": "software engineering",
      "cli-tools": "cli tools",
    };
    const categoryLabel = categoryLabels[skill.category ?? ""] ?? skill.category ?? "";
    const searchableText =
      `${skill.slug} ${skill.name} ${skill.description} ${categoryLabel}`.toLowerCase();
    return searchableText.includes(normalizedQuery);
  });
};
