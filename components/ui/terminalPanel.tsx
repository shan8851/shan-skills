import type { ReactNode } from "react";

type TerminalPanelProps = {
  children: ReactNode;
  className?: string;
  headerLabel?: string;
};

export const TerminalPanel = ({ children, className, headerLabel }: TerminalPanelProps) => {
  return (
    <div className="panel-glow relative border border-[var(--ui-border)] bg-[var(--panel-bg)]">
      <span className="pointer-events-none absolute -top-[1px] -left-[1px] select-none text-[10px] leading-none text-[var(--ui-border)]">
        {"╔"}
      </span>
      <span className="pointer-events-none absolute -top-[1px] -right-[1px] select-none text-[10px] leading-none text-[var(--ui-border)]">
        {"╗"}
      </span>
      <span className="pointer-events-none absolute -bottom-[1px] -left-[1px] select-none text-[10px] leading-none text-[var(--ui-border)]">
        {"╚"}
      </span>
      <span className="pointer-events-none absolute -bottom-[1px] -right-[1px] select-none text-[10px] leading-none text-[var(--ui-border)]">
        {"╝"}
      </span>

      {headerLabel !== undefined ? (
        <div className="flex items-center gap-2 overflow-hidden border-b border-[var(--ui-border)] px-3 py-2 font-display text-xs uppercase tracking-[0.15em] text-[var(--text-dim)]">
          <span className="text-[var(--ui-border)]">{"╠═"}</span>
          <span className="shrink-0">{headerLabel}</span>
          <span className="overflow-hidden text-[var(--ui-border)]">{"═".repeat(60)}{"╣"}</span>
        </div>
      ) : null}

      <div className={className}>{children}</div>
    </div>
  );
};
