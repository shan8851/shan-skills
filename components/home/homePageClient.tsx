"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { KeyboardHelpModal } from "@/components/keyboard/keyboardHelpModal";
import { KeyboardHints } from "@/components/keyboard/keyboardHints";
import { SiteFooter } from "@/components/site/siteFooter";
import { isTypingElement } from "@/lib/keyboard/keyboardGuards";
import type { KeyboardShortcut } from "@/lib/keyboard/shortcutTypes";
import type { Skill } from "@/lib/skills/skillsSchema";

type HomePageClientProps = {
  skills: Array<Pick<Skill, "description" | "name" | "slug">>;
};

const asciiBannerMobile = String.raw`
███████╗██╗  ██╗ █████╗ ███╗   ██╗
██╔════╝██║  ██║██╔══██╗████╗  ██║
███████╗███████║███████║██╔██╗ ██║
╚════██║██╔══██║██╔══██║██║╚██╗██║
███████║██║  ██║██║  ██║██║ ╚████║
╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝

███████╗██╗  ██╗██╗██╗     ██╗     ███████╗
██╔════╝██║ ██╔╝██║██║     ██║     ██╔════╝
███████╗█████╔╝ ██║██║     ██║     ███████╗
╚════██║██╔═██╗ ██║██║     ██║     ╚════██║
███████║██║  ██╗██║███████╗███████╗███████║
╚══════╝╚═╝  ╚═╝╚═╝╚══════╝╚══════╝╚══════╝
`;

const asciiBannerDesktop = String.raw`
███████╗██╗  ██╗ █████╗ ███╗   ██╗      ███████╗██╗  ██╗██╗██╗     ██╗     ███████╗
██╔════╝██║  ██║██╔══██╗████╗  ██║      ██╔════╝██║ ██╔╝██║██║     ██║     ██╔════╝
███████╗███████║███████║██╔██╗ ██║█████╗███████╗█████╔╝ ██║██║     ██║     ███████╗
╚════██║██╔══██║██╔══██║██║╚██╗██║╚════╝╚════██║██╔═██╗ ██║██║     ██║     ╚════██║
███████║██║  ██║██║  ██║██║ ╚████║      ███████║██║  ██╗██║███████╗███████╗███████║
╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝      ╚══════╝╚═╝  ╚═╝╚═╝╚══════╝╚══════╝╚══════╝
`;

const clampIndex = (value: number, itemCount: number): number => {
  if (itemCount <= 0) {
    return 0;
  }

  if (value < 0) {
    return itemCount - 1;
  }

  if (value >= itemCount) {
    return 0;
  }

  return value;
};

export const HomePageClient = ({ skills }: HomePageClientProps) => {
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkillSlug, setSelectedSkillSlug] = useState(skills[0]?.slug ?? "");
  const [isKeyboardHelpOpen, setIsKeyboardHelpOpen] = useState(false);

  const filteredSkills = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (normalizedQuery.length === 0) {
      return skills;
    }

    return skills.filter((skill) => {
      const searchableText = `${skill.slug} ${skill.name} ${skill.description}`.toLowerCase();
      return searchableText.includes(normalizedQuery);
    });
  }, [searchQuery, skills]);

  const homeShortcuts = useMemo<KeyboardShortcut[]>(() => {
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
        enabled: filteredSkills.length > 0,
      },
      {
        id: "open-skill",
        keys: ["Enter"],
        description: "Open selected skill",
        enabled: filteredSkills.length > 0,
      },
      {
        id: "open-help",
        keys: ["?"],
        description: "Keyboard help",
        enabled: true,
      },
    ];
  }, [filteredSkills.length]);

  const selectedIndex = useMemo(() => {
    const selectedIndexInFilteredList = filteredSkills.findIndex(
      (skill) => skill.slug === selectedSkillSlug,
    );

    if (selectedIndexInFilteredList >= 0) {
      return selectedIndexInFilteredList;
    }

    return 0;
  }, [filteredSkills, selectedSkillSlug]);

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (isKeyboardHelpOpen) {
        if (event.key === "Escape") {
          event.preventDefault();
          setIsKeyboardHelpOpen(false);
        }

        return;
      }

      const isTyping = isTypingElement(event.target);
      const lowerKey = event.key.toLowerCase();

      if ((event.metaKey || event.ctrlKey) && lowerKey === "k") {
        event.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
        return;
      }

      if (!isTyping && !event.metaKey && !event.ctrlKey && !event.altKey && event.key === "/") {
        event.preventDefault();
        searchInputRef.current?.focus();
        return;
      }

      if (!isTyping && !event.metaKey && !event.ctrlKey && !event.altKey && event.key === "?") {
        event.preventDefault();
        setIsKeyboardHelpOpen(true);
        return;
      }

      if (isTyping || filteredSkills.length === 0) {
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        const nextIndex = clampIndex(selectedIndex + 1, filteredSkills.length);
        const nextSkill = filteredSkills[nextIndex];

        if (nextSkill !== undefined) {
          setSelectedSkillSlug(nextSkill.slug);
        }
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        const nextIndex = clampIndex(selectedIndex - 1, filteredSkills.length);
        const nextSkill = filteredSkills[nextIndex];

        if (nextSkill !== undefined) {
          setSelectedSkillSlug(nextSkill.slug);
        }
        return;
      }

      if (event.key === "Enter") {
        event.preventDefault();
        const selectedSkill = filteredSkills[selectedIndex];

        if (selectedSkill !== undefined) {
          router.push(`/skills/${selectedSkill.slug}`);
        }
      }
    };

    window.addEventListener("keydown", handleKeydown);

    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [filteredSkills, isKeyboardHelpOpen, router, selectedIndex]);

  return (
    <div className="flex min-h-screen flex-col bg-[var(--terminal-bg)] text-[var(--text-main)]">
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-10 md:px-6">
        <section className="rounded-lg border border-[var(--ui-border)] bg-[var(--panel-bg)] p-4 shadow-[0_0_30px_rgba(0,0,0,0.35)] md:p-6">
          <pre className="overflow-x-auto whitespace-pre font-[var(--font-terminal-mono)] text-[8px] leading-[1.08] text-[var(--accent)] sm:text-[9px] md:hidden">
            {asciiBannerMobile}
          </pre>
          <pre className="hidden overflow-x-auto whitespace-pre font-[var(--font-terminal-mono)] text-[9px] leading-[1.08] text-[var(--accent)] md:block lg:text-[10px]">
            {asciiBannerDesktop}
          </pre>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[var(--text-dim)]">
            A terminal-style catalog of the custom skills I use with coding agents.
            Browse, search, and inspect every skill reference file with keyboard-first controls.
          </p>
        </section>

        <section className="rounded-lg border border-[var(--ui-border)] bg-[var(--panel-bg)] p-4 md:p-6">
          <label
            className="mb-2 block font-display text-xs uppercase tracking-[0.15em] text-[var(--text-dim)]"
            htmlFor="skills-search"
          >
            Search Skills
          </label>
          <input
            className="w-full rounded-md border border-[var(--ui-border)] bg-black/30 px-3 py-2 font-[var(--font-terminal-mono)] text-sm text-[var(--text-main)] outline-none ring-0 placeholder:text-[var(--text-dim)] focus:border-[var(--accent)]"
            id="skills-search"
            onChange={(event) => {
              setSearchQuery(event.target.value);
            }}
            placeholder="Type a skill, slug, or description..."
            ref={searchInputRef}
            type="text"
            value={searchQuery}
          />

          <KeyboardHints className="mt-3" shortcuts={homeShortcuts} />

          <div className="mt-4 overflow-hidden rounded-md border border-[var(--ui-border)]">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] border-b border-[var(--ui-border)] bg-[var(--panel-bg-muted)] px-3 py-2 font-display text-xs uppercase tracking-[0.15em] text-[var(--text-dim)]">
              <span>Skill</span>
              <span>Slug</span>
            </div>

            {filteredSkills.length > 0 ? (
              <ul aria-label="Skills list">
                {filteredSkills.map((skill, index) => {
                  const isSelected = index === selectedIndex;

                  return (
                    <li key={skill.slug}>
                      <button
                        className={`grid w-full grid-cols-[minmax(0,1fr)_auto] gap-4 border-b border-[var(--ui-border-muted)] px-3 py-3 text-left transition-colors last:border-b-0 ${
                          isSelected
                            ? "bg-[var(--selection-bg)] text-[var(--accent-bright)]"
                            : "bg-transparent text-[var(--text-main)] hover:bg-[var(--panel-bg-muted)]"
                        }`}
                        onClick={() => {
                          router.push(`/skills/${skill.slug}`);
                        }}
                        onMouseEnter={() => {
                          setSelectedSkillSlug(skill.slug);
                        }}
                        type="button"
                      >
                        <div className="min-w-0">
                          <p className="truncate font-display text-sm uppercase tracking-[0.06em]">
                            {skill.name}
                          </p>
                          <p className="mt-1 line-clamp-2 text-xs text-[var(--text-dim)]">
                            {skill.description}
                          </p>
                        </div>
                        <span className="self-start rounded border border-[var(--ui-border)] bg-black/25 px-2 py-1 font-display text-xs tracking-wide text-[var(--text-dim)]">
                          {skill.slug}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="px-3 py-8 text-sm text-[var(--text-dim)]">
                No skills matched your query.
              </div>
            )}
          </div>
        </section>
      </main>

      <SiteFooter />

      {isKeyboardHelpOpen ? (
        <KeyboardHelpModal
          onClose={() => {
            setIsKeyboardHelpOpen(false);
          }}
          shortcuts={homeShortcuts}
        />
      ) : null}
    </div>
  );
};
