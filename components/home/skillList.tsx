"use client";

import { useRouter } from "next/navigation";

import type { SkillSummary } from "@/lib/skills/skillSearch";

type SkillListProps = {
  filteredSkills: SkillSummary[];
  selectedIndex: number;
};

const categoryLabel = (
  category: SkillSummary["category"],
): { text: string; className: string } => {
  if (category === "software-engineering") {
    return {
      text: "SOFTWARE ENGINEERING",
      className:
        "border-amber-700/50 bg-amber-950/40 text-amber-400",
    };
  }

  if (category === "cli-tools") {
    return {
      text: "CLI TOOLS",
      className:
        "border-cyan-700/50 bg-cyan-950/40 text-cyan-400",
    };
  }

  return {
    text: "WORKFLOW",
    className:
      "border-violet-700/50 bg-violet-950/40 text-violet-400",
  };
};

export const SkillList = ({
  filteredSkills,
  selectedIndex,
}: SkillListProps) => {
  const router = useRouter();

  return (
    <div className="mt-4 overflow-hidden border border-(--ui-border)">
      <div className="font-display grid grid-cols-[minmax(0,1fr)_auto] border-b border-(--ui-border) bg-(--panel-bg-muted) px-3 py-2 text-xs tracking-[0.15em] text-(--text-dim) uppercase">
        <span>Skill</span>
        <span>Slug</span>
      </div>

      {filteredSkills.length > 0 ? (
        <ul aria-label="Skills list">
          {filteredSkills.map((skill, index) => {
            const isSelected = index === selectedIndex;
            const badge = categoryLabel(skill.category);

            return (
              <li
                key={skill.slug}
                ref={
                  isSelected
                    ? (element) => {
                        element?.scrollIntoView({
                          block: "nearest",
                          behavior: "smooth",
                        });
                      }
                    : undefined
                }
              >
                <button
                  className={`skill-row grid w-full cursor-pointer grid-cols-[minmax(0,1fr)_auto] gap-4 border-b border-(--ui-border-muted) px-3 py-3 text-left last:border-b-0 ${
                    isSelected
                      ? "skill-row-selected bg-(--selection-bg) text-(--accent-bright)"
                      : "bg-transparent text-foreground hover:bg-(--panel-bg-muted)"
                  }`}
                  onClick={() => {
                    router.push(`/skills/${skill.slug}`);
                  }}
                  type="button"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-display truncate text-sm tracking-[0.06em] uppercase">
                        {skill.name}
                      </p>
                      <span
                        className={`font-display shrink-0 border px-1.5 py-0.5 text-[10px] leading-none tracking-[0.1em] ${badge.className}`}
                      >
                        {badge.text}
                      </span>
                      {skill.clawhubUrl ? (
                        <a
                          href={skill.clawhubUrl}
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 text-sm opacity-70 transition-opacity hover:opacity-100"
                          title="View on ClawHub"
                        >
                          🦞
                        </a>
                      ) : null}
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs text-(--text-dim)">
                      {skill.description}
                    </p>
                  </div>
                  <span className="font-display self-start border border-(--ui-border) bg-black/25 px-2 py-1 text-xs tracking-wide text-(--text-dim)">
                    {skill.slug}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="px-3 py-8 text-sm text-(--text-dim)">
          No skills matched your query.
        </div>
      )}
    </div>
  );
};
