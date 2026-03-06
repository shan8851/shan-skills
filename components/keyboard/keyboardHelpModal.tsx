"use client";

import type { KeyboardShortcut } from "@/lib/keyboard/shortcutTypes";
import { getShortcutKeyLabel } from "@/lib/keyboard/shortcutTypes";

type KeyboardHelpModalProps = {
  onClose: () => void;
  shortcuts: KeyboardShortcut[];
};

const renderShortcutKeys = (shortcut: KeyboardShortcut): string => {
  return shortcut.keys.map((key) => getShortcutKeyLabel(key)).join(" + ");
};

export const KeyboardHelpModal = ({ onClose, shortcuts }: KeyboardHelpModalProps) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-2xl border border-[var(--ui-border)] bg-[var(--panel-bg)] shadow-[0_0_20px_rgba(0,0,0,0.5)]"
        onClick={(event) => {
          event.stopPropagation();
        }}
        aria-modal="true"
        role="dialog"
      >
        <div className="flex items-center justify-between border-b border-[var(--ui-border)] px-4 py-3">
          <h2 className="font-display text-lg uppercase tracking-[0.2em] text-[var(--text-main)]">
            Keyboard Controls
          </h2>
          <button
            aria-label="Close keyboard help"
            className="rounded border border-[var(--ui-border)] px-2 py-1 text-xs text-[var(--text-main)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
            onClick={onClose}
            type="button"
          >
            ESC
          </button>
        </div>
        <div className="max-h-[70vh] overflow-auto p-4">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="text-left text-[var(--text-dim)]">
                <th className="border-b border-[var(--ui-border)] px-2 py-2">Keys</th>
                <th className="border-b border-[var(--ui-border)] px-2 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {shortcuts.map((shortcut) => {
                return (
                  <tr
                    key={shortcut.id}
                    className={shortcut.enabled ? "text-[var(--text-main)]" : "text-[var(--text-dim)]"}
                  >
                    <td className="border-b border-[var(--ui-border-muted)] px-2 py-2 font-display tracking-wide">
                      {renderShortcutKeys(shortcut)}
                    </td>
                    <td className="border-b border-[var(--ui-border-muted)] px-2 py-2">
                      {shortcut.description}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
