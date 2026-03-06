"use client";

import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";

import { HomeHero } from "@/components/home/homeHero";
import { SkillList } from "@/components/home/skillList";
import { SkillSearchInput } from "@/components/home/skillSearchInput";
import { KeyboardHelpModal } from "@/components/keyboard/keyboardHelpModal";
import { KeyboardHints } from "@/components/keyboard/keyboardHints";
import { SiteFooter } from "@/components/site/siteFooter";
import { TerminalPanel } from "@/components/ui/terminalPanel";
import { useWindowKeydown } from "@/hooks/useWindowKeydown";
import { isTypingElement } from "@/lib/keyboard/keyboardGuards";
import { createHomeShortcuts } from "@/lib/keyboard/shortcutPresets";
import {
  filterSkillsByQuery,
  type SkillSummary,
} from "@/lib/skills/skillSearch";
import { getSelectedIndex, getWrappedIndex } from "@/lib/ui/listNavigation";
import { createAnimationDelayStyle } from "@/lib/ui/motion";
import { TERMINAL_FADE_DELAYS_MS } from "@/lib/ui/uiConstants";

type HomePageClientProps = {
  skills: SkillSummary[];
};

export const HomePageClient = ({ skills }: HomePageClientProps) => {
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkillSlug, setSelectedSkillSlug] = useState(
    skills[0]?.slug ?? "",
  );
  const [isKeyboardHelpOpen, setIsKeyboardHelpOpen] = useState(false);

  const filteredSkills = useMemo(() => {
    return filterSkillsByQuery(skills, searchQuery);
  }, [searchQuery, skills]);

  const homeShortcuts = useMemo(() => {
    return createHomeShortcuts({
      hasFilteredSkills: filteredSkills.length > 0,
    });
  }, [filteredSkills.length]);

  const selectedIndex = useMemo(() => {
    return getSelectedIndex(
      filteredSkills,
      (skill) => skill.slug === selectedSkillSlug,
    );
  }, [filteredSkills, selectedSkillSlug]);

  useWindowKeydown((event) => {
    if (isKeyboardHelpOpen) {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsKeyboardHelpOpen(false);
      }

      return;
    }

    const isTyping = isTypingElement(event.target);
    const lowerKey = event.key.toLowerCase();
    const isPlainKeyboardShortcut =
      !event.metaKey && !event.ctrlKey && !event.altKey;

    if ((event.metaKey || event.ctrlKey) && lowerKey === "k") {
      event.preventDefault();
      searchInputRef.current?.focus();
      searchInputRef.current?.select();
      return;
    }

    if (!isTyping && isPlainKeyboardShortcut && event.key === "/") {
      event.preventDefault();
      searchInputRef.current?.focus();
      return;
    }

    if (!isTyping && isPlainKeyboardShortcut && event.key === "?") {
      event.preventDefault();
      setIsKeyboardHelpOpen(true);
      return;
    }

    if (isTyping || filteredSkills.length === 0) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      const nextSkill =
        filteredSkills[
          getWrappedIndex(selectedIndex + 1, filteredSkills.length)
        ];

      if (nextSkill !== undefined) {
        setSelectedSkillSlug(nextSkill.slug);
      }

      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      const nextSkill =
        filteredSkills[
          getWrappedIndex(selectedIndex - 1, filteredSkills.length)
        ];

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
  });

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-10 md:px-6">
        <HomeHero />

        <TerminalPanel className="p-4 md:p-6" headerLabel="Search Skills">
          <div
            className="terminal-fade-in"
            style={createAnimationDelayStyle(
              TERMINAL_FADE_DELAYS_MS.homeSearch,
            )}
          >
            <SkillSearchInput
              inputRef={searchInputRef}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
            <KeyboardHints className="mt-3" shortcuts={homeShortcuts} />
            <SkillList
              filteredSkills={filteredSkills}
              selectedIndex={selectedIndex}
            />
          </div>
        </TerminalPanel>
      </main>

      <div
        className="terminal-fade-in"
        style={createAnimationDelayStyle(TERMINAL_FADE_DELAYS_MS.homeFooter)}
      >
        <SiteFooter />
      </div>

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
