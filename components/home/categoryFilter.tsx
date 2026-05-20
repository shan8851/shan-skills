"use client";

import {
  allCategoriesFilterValue,
  getCategoryDisplay,
  getCategoryFilterLabel,
  type CategoryFilterValue,
} from "@/lib/skills/skillCategories";

export type CategoryFilterOption = {
  count: number;
  value: CategoryFilterValue;
};

type CategoryFilterProps = {
  options: CategoryFilterOption[];
  selectedCategory: CategoryFilterValue;
  setSelectedCategory: (category: CategoryFilterValue) => void;
};

const optionKeyHint = (index: number): string => {
  return index === 0 ? "0" : String(index);
};

export const CategoryFilter = ({
  options,
  selectedCategory,
  setSelectedCategory,
}: CategoryFilterProps) => {
  return (
    <div className="mt-3 border border-(--ui-border) bg-black/20 p-2">
      <div className="mb-2 flex items-center justify-between gap-3 text-xs tracking-[0.16em] text-(--text-dim) uppercase">
        <span className="font-display">Category</span>
        <span className="font-display hidden sm:inline">
          [ ] cycle · 0-9 jump
        </span>
      </div>
      <div className="flex flex-wrap gap-2.5" aria-label="Skill categories">
        {options.map((option, index) => {
          const isSelected = option.value === selectedCategory;
          const display =
            option.value === allCategoriesFilterValue
              ? {
                  className:
                    "border-(--accent)/60 bg-(--selection-bg) text-(--accent-bright)",
                  text: getCategoryFilterLabel(option.value),
                }
              : getCategoryDisplay(option.value);

          return (
            <button
              aria-pressed={isSelected}
              className={`font-display glow-hover flex min-h-9 items-center gap-2.5 border px-3 py-1.5 text-sm tracking-[0.1em] uppercase transition-colors ${
                isSelected
                  ? "border-(--accent) bg-(--selection-bg) text-(--accent-bright)"
                  : display.className
              }`}
              key={option.value}
              onClick={() => {
                setSelectedCategory(option.value);
              }}
              type="button"
            >
              <span className="text-xs text-(--text-dim)">
                {optionKeyHint(index)}
              </span>
              <span>{display.text}</span>
              <span className="border-l border-current/30 pl-2.5 text-xs opacity-75">
                {option.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
