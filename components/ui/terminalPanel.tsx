import type { ReactNode } from "react";

import { TERMINAL_HEADER_RAIL_REPEAT_COUNT } from "@/lib/ui/uiConstants";

type TerminalPanelProps = {
  children: ReactNode;
  className?: string;
  headerLabel?: string;
};

export const TerminalPanel = ({
  children,
  className,
  headerLabel,
}: TerminalPanelProps) => {
  return (
    <div className="panel-glow relative border border-[var(--ui-border)] bg-[var(--panel-bg)]">
      <span className="pointer-events-none absolute -top-[1px] -left-[1px] text-[10px] leading-none text-[var(--ui-border)] select-none">
        {"╔"}
      </span>
      <span className="pointer-events-none absolute -top-[1px] -right-[1px] text-[10px] leading-none text-[var(--ui-border)] select-none">
        {"╗"}
      </span>
      <span className="pointer-events-none absolute -bottom-[1px] -left-[1px] text-[10px] leading-none text-[var(--ui-border)] select-none">
        {"╚"}
      </span>
      <span className="pointer-events-none absolute -right-[1px] -bottom-[1px] text-[10px] leading-none text-[var(--ui-border)] select-none">
        {"╝"}
      </span>

      {headerLabel !== undefined ? (
        <div className="font-display flex items-center gap-2 overflow-hidden border-b border-[var(--ui-border)] px-3 py-2 text-xs tracking-[0.15em] text-[var(--text-dim)] uppercase">
          <span className="text-[var(--ui-border)]">{"╠═"}</span>
          <span className="shrink-0">{headerLabel}</span>
          <span className="overflow-hidden text-[var(--ui-border)]">
            {"═".repeat(TERMINAL_HEADER_RAIL_REPEAT_COUNT)}
            {"╣"}
          </span>
        </div>
      ) : null}

      <div className={className}>{children}</div>
    </div>
  );
};
