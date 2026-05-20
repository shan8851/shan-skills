import type { SkillSummary } from "@/lib/skills/skillSearch";

export const allCategoriesFilterValue = "all" as const;

export type CategoryFilterValue =
  | typeof allCategoriesFilterValue
  | SkillSummary["category"];

type CategoryDisplay = {
  className: string;
  text: string;
};

const categoryDisplays: Record<string, CategoryDisplay> = {
  "cli-tools": {
    text: "CLI TOOLS",
    className: "border-cyan-700/50 bg-cyan-950/40 text-cyan-400",
  },
  "software-engineering": {
    text: "SOFTWARE ENGINEERING",
    className: "border-amber-700/50 bg-amber-950/40 text-amber-400",
  },
  workflow: {
    text: "WORKFLOW",
    className: "border-violet-700/50 bg-violet-950/40 text-violet-400",
  },
};

export const getCategoryDisplay = (category: string): CategoryDisplay => {
  return (
    categoryDisplays[category] ?? {
      text: category.replace(/-/g, " ").toUpperCase(),
      className: "border-zinc-700/50 bg-zinc-950/40 text-zinc-300",
    }
  );
};

export const getSkillCategories = (skills: SkillSummary[]): string[] => {
  return Array.from(new Set(skills.map((skill) => skill.category))).sort(
    (a, b) =>
      getCategoryDisplay(a).text.localeCompare(
        getCategoryDisplay(b).text,
        "en",
        {
          sensitivity: "base",
        },
      ),
  );
};

export const getCategoryFilterLabel = (
  category: CategoryFilterValue,
): string => {
  if (category === allCategoriesFilterValue) {
    return "ALL";
  }

  return getCategoryDisplay(category).text;
};
