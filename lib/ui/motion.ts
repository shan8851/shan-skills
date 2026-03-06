import type { CSSProperties } from "react";

export const createAnimationDelayStyle = (delayMs: number): CSSProperties => {
  return { animationDelay: `${delayMs}ms` };
};

export const createAnimationDurationStyle = (
  durationMs: number,
): CSSProperties => {
  return { animationDuration: `${durationMs}ms` };
};
