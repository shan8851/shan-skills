import type { KeyboardShortcut } from "@/lib/keyboard/shortcutTypes";

type HomeShortcutOptions = {
  hasFilteredSkills: boolean;
};

type SkillShortcutOptions = {
  canCopyActiveFile: boolean;
  hasSelectedDirectory: boolean;
  hasVisibleRows: boolean;
};

export const createHomeShortcuts = ({
  hasFilteredSkills,
}: HomeShortcutOptions): KeyboardShortcut[] => {
  return [
    {
      id: "focus-search",
      keys: ["Cmd/Ctrl", "K"],
      description: "Focus search",
      enabled: true,
    },
    {
      id: "focus-search-slash",
      keys: ["/"],
      description: "Focus search",
      enabled: true,
    },
    {
      id: "move-selection",
      keys: ["ArrowUp", "ArrowDown"],
      description: "Move selection",
      enabled: hasFilteredSkills,
    },
    {
      id: "open-skill",
      keys: ["Enter"],
      description: "Open selected skill",
      enabled: hasFilteredSkills,
    },
    {
      id: "open-help",
      keys: ["?"],
      description: "Keyboard help",
      enabled: true,
    },
  ];
};

export const createSkillShortcuts = ({
  canCopyActiveFile,
  hasSelectedDirectory,
  hasVisibleRows,
}: SkillShortcutOptions): KeyboardShortcut[] => {
  return [
    {
      id: "move-selection",
      keys: ["ArrowUp", "ArrowDown"],
      description: "Move selection",
      enabled: hasVisibleRows,
    },
    {
      id: "collapse-or-expand",
      keys: ["ArrowLeft", "ArrowRight"],
      description: "Collapse / expand folder",
      enabled: hasSelectedDirectory,
    },
    {
      id: "open-file",
      keys: ["Enter"],
      description: "Open selected file",
      enabled: hasVisibleRows,
    },
    {
      id: "copy-file",
      keys: ["C"],
      description: "Copy active file",
      enabled: canCopyActiveFile,
    },
    {
      id: "back-to-list",
      keys: ["Backspace"],
      description: "Back to list",
      enabled: true,
    },
    {
      id: "open-help",
      keys: ["?"],
      description: "Keyboard help",
      enabled: true,
    },
  ];
};
