export type KeyboardShortcut = {
  description: string;
  enabled: boolean;
  id: string;
  keys: string[];
};

export const getShortcutKeyLabel = (key: string): string => {
  if (key === "Meta") {
    return "Cmd";
  }

  if (key === "Control") {
    return "Ctrl";
  }

  if (key === "ArrowUp") {
    return "Up";
  }

  if (key === "ArrowDown") {
    return "Down";
  }

  if (key === "ArrowLeft") {
    return "Left";
  }

  if (key === "ArrowRight") {
    return "Right";
  }

  if (key === "Enter") {
    return "Enter";
  }

  if (key === "Escape") {
    return "Esc";
  }

  if (key === " ") {
    return "Space";
  }

  return key;
};
