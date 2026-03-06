"use client";

import { getShortcutKeyLabel, type KeyboardShortcut } from "@/lib/keyboard/shortcutTypes";

type KeyHintProps = {
  shortcut: KeyboardShortcut;
};

export const KeyHint = ({ shortcut }: KeyHintProps) => {
  return (
    <div
      className={`flex items-center gap-2 px-1 py-1 text-xs ${
        shortcut.enabled ? "text-[var(--text-main)]" : "text-[var(--text-dim)]"
      }`}
    >
      <div className="flex items-center gap-1">
        {shortcut.keys.map((key, index) => {
          const keyLabel = getShortcutKeyLabel(key);

          return (
            <div key={`${shortcut.id}-${key}-${index}`} className="flex items-center gap-1">
              {index > 0 ? <span className="text-[var(--text-dim)]">+</span> : null}
              <kbd className="rounded border border-[var(--ui-border)] bg-black/40 px-1.5 py-0.5 text-[10px] uppercase tracking-wide">
                {keyLabel}
              </kbd>
            </div>
          );
        })}
      </div>
      <span className="whitespace-nowrap">{shortcut.description}</span>
    </div>
  );
};
