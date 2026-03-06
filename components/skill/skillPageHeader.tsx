import Link from "next/link";

import { TerminalPanel } from "@/components/ui/terminalPanel";

type SkillPageHeaderProps = {
  skillName: string;
};

export const SkillPageHeader = ({ skillName }: SkillPageHeaderProps) => {
  return (
    <TerminalPanel className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
      <div className="terminal-fade-in">
        <p className="font-display text-xs tracking-[0.15em] text-(--text-dim) uppercase">
          Skill
        </p>
        <h1 className="glow-accent font-display text-lg tracking-[0.08em] text-(--accent-bright) uppercase">
          {skillName}
        </h1>
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
