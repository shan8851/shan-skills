"use client";

import { KeyHint } from "@/components/keyboard/keyHint";
import type { KeyboardShortcut } from "@/lib/keyboard/shortcutTypes";

type KeyboardHintsProps = {
  className?: string;
  shortcuts: KeyboardShortcut[];
};

export const KeyboardHints = ({ className, shortcuts }: KeyboardHintsProps) => {
  return (
    <div
      className={`border border-[var(--ui-border)] bg-[var(--panel-bg-muted)]/70 px-3 py-2 ${
        className ?? ""
      }`}
    >
      <div className="flex flex-wrap gap-2">
        {shortcuts.map((shortcut) => {
          return <KeyHint key={shortcut.id} shortcut={shortcut} />;
        })}
      </div>
    </div>
  );
};
