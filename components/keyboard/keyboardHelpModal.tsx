"use client";

import { TerminalPanel } from "@/components/ui/terminalPanel";
import type { KeyboardShortcut } from "@/lib/keyboard/shortcutTypes";
import { getShortcutKeyLabel } from "@/lib/keyboard/shortcutTypes";
import { createAnimationDurationStyle } from "@/lib/ui/motion";
import { MODAL_FADE_DURATION_MS } from "@/lib/ui/uiConstants";

type KeyboardHelpModalProps = {
  onClose: () => void;
  shortcuts: KeyboardShortcut[];
};

const renderShortcutKeys = (shortcut: KeyboardShortcut): string => {
  return shortcut.keys.map((key) => getShortcutKeyLabel(key)).join(" + ");
};

export const KeyboardHelpModal = ({
  onClose,
  shortcuts,
}: KeyboardHelpModalProps) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="terminal-fade-in w-full max-w-2xl"
        onClick={(event) => {
          event.stopPropagation();
        }}
        aria-modal="true"
        role="dialog"
        style={createAnimationDurationStyle(MODAL_FADE_DURATION_MS)}
      >
        <TerminalPanel headerLabel="Keyboard Controls">
          <div className="flex items-center justify-between border-b border-(--ui-border) px-4 py-3">
            <h2 className="glow-heading-sm font-display text-lg tracking-[0.2em] text-foreground uppercase">
              Keyboard Controls
            </h2>
            <button
              aria-label="Close keyboard help"
              className="glow-hover border border-(--ui-border) px-2 py-1 text-xs text-foreground hover:border-(--accent) hover:text-(--accent)"
              onClick={onClose}
              type="button"
            >
              ESC
            </button>
          </div>
          <div className="max-h-[70vh] overflow-auto p-4">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="text-left text-(--text-dim)">
                  <th className="border-b border-(--ui-border) px-2 py-2">
                    Keys
                  </th>
                  <th className="border-b border-(--ui-border) px-2 py-2">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {shortcuts.map((shortcut) => {
                  return (
                    <tr
                      key={shortcut.id}
                      className={
                        shortcut.enabled
                          ? "text-foreground"
                          : "text-(--text-dim)"
                      }
                    >
                      <td className="font-display border-b border-(--ui-border-muted) px-2 py-2 tracking-wide">
                        {renderShortcutKeys(shortcut)}
                      </td>
                      <td className="border-b border-(--ui-border-muted) px-2 py-2">
                        {shortcut.description}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </TerminalPanel>
      </div>
    </div>
  );
};
