import Link from "next/link";

import { TerminalPanel } from "@/components/ui/terminalPanel";

type SkillPageHeaderProps = {
  skillName: string;
  category: string;
  clawhubUrl?: string;
};

const categoryLabel = (
  category: SkillPageHeaderProps["category"],
): { text: string; className: string } => {
  if (category === "software-engineering") {
    return {
      text: "SOFTWARE ENGINEERING",
      className: "border-amber-700/50 bg-amber-950/40 text-amber-400",
    };
  }

  if (category === "cli-tools") {
    return {
      text: "CLI TOOLS",
      className: "border-cyan-700/50 bg-cyan-950/40 text-cyan-400",
    };
  }

  return {
    text: "WORKFLOW",
    className: "border-violet-700/50 bg-violet-950/40 text-violet-400",
  };
};

export const SkillPageHeader = ({
  skillName,
  category,
  clawhubUrl,
}: SkillPageHeaderProps) => {
  const badge = categoryLabel(category);

  return (
    <TerminalPanel className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
      <div className="terminal-fade-in">
        <p className="font-display text-xs tracking-[0.15em] text-(--text-dim) uppercase">
          Skill
        </p>
        <div className="flex items-center gap-3">
          <h1 className="glow-accent font-display text-lg tracking-[0.08em] text-(--accent-bright) uppercase">
            {skillName}
          </h1>
          <span
            className={`font-display shrink-0 border px-1.5 py-0.5 text-[10px] leading-none tracking-[0.1em] ${badge.className}`}
          >
            {badge.text}
          </span>
          {clawhubUrl ? (
            <a
              href={clawhubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 text-sm opacity-70 transition-opacity hover:opacity-100"
              title="View on ClawHub"
            >
              🦞
            </a>
          ) : null}
        </div>
      </div>
      <Link
        className="glow-hover border border-(--ui-border) px-3 py-1 text-xs text-foreground transition-colors hover:border-(--accent) hover:text-(--accent-bright)"
        href="/"
      >
        Back to list
      </Link>
    </TerminalPanel>
  );
};
