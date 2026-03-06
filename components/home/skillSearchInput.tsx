"use client";

import type { RefObject } from "react";

type SkillSearchInputProps = {
  inputRef: RefObject<HTMLInputElement | null>;
  searchQuery: string;
  setSearchQuery: (searchQuery: string) => void;
};

export const SkillSearchInput = ({
  inputRef,
  searchQuery,
  setSearchQuery,
}: SkillSearchInputProps) => {
  return (
    <input
      className="terminal-input w-full border border-(--ui-border) bg-black/30 px-3 py-2 text-sm font-(--font-terminal-mono) text-foreground ring-0 outline-none placeholder:text-(--text-dim) focus:border-(--accent)"
      id="skills-search"
      onChange={(event) => {
        setSearchQuery(event.target.value);
      }}
      placeholder="Type a skill, slug, or description..."
      ref={inputRef}
      type="text"
      value={searchQuery}
    />
  );
};
