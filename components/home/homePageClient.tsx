"use client";

import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";

import {
  CategoryFilter,
  type CategoryFilterOption,
} from "@/components/home/categoryFilter";
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
  allCategoriesFilterValue,
  getSkillCategories,
  type CategoryFilterValue,
} from "@/lib/skills/skillCategories";
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
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilterValue>(
    allCategoriesFilterValue,
  );
  const [selectedSkillSlug, setSelectedSkillSlug] = useState(
    skills[0]?.slug ?? "",
  );
  const [isKeyboardHelpOpen, setIsKeyboardHelpOpen] = useState(false);

  const categories = useMemo(() => getSkillCategories(skills), [skills]);

  const categoryOptions = useMemo<CategoryFilterOption[]>(() => {
    return [
      { count: skills.length, value: allCategoriesFilterValue },
      ...categories.map((category) => ({
        count: skills.filter((skill) => skill.category === category).length,
        value: category,
      })),
    ];
  }, [categories, skills]);

  const skillsInSelectedCategory = useMemo(() => {
    if (selectedCategory === allCategoriesFilterValue) {
      return skills;
    }

    return skills.filter((skill) => skill.category === selectedCategory);
  }, [selectedCategory, skills]);

  const filteredSkills = useMemo(() => {
    return filterSkillsByQuery(skillsInSelectedCategory, searchQuery);
  }, [searchQuery, skillsInSelectedCategory]);

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

  const selectCategoryByOffset = (offset: number) => {
    const selectedCategoryIndex = categoryOptions.findIndex(
      (option) => option.value === selectedCategory,
    );
    const nextCategory =
      categoryOptions[
        getWrappedIndex(selectedCategoryIndex + offset, categoryOptions.length)
      ];

    if (nextCategory !== undefined) {
      setSelectedCategory(nextCategory.value);
    }
  };

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

    if (!isTyping && isPlainKeyboardShortcut && event.key === "[") {
      event.preventDefault();
      selectCategoryByOffset(-1);
      return;
    }

    if (!isTyping && isPlainKeyboardShortcut && event.key === "]") {
      event.preventDefault();
      selectCategoryByOffset(1);
      return;
    }

    if (!isTyping && isPlainKeyboardShortcut && /^\d$/.test(event.key)) {
      const optionIndex = Number(event.key);
      const nextCategory = categoryOptions[optionIndex];

      if (nextCategory !== undefined) {
        event.preventDefault();
        setSelectedCategory(nextCategory.value);
      }

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
            <CategoryFilter
              options={categoryOptions}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
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
