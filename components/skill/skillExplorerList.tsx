"use client";

import { TerminalPanel } from "@/components/ui/terminalPanel";
import {
  TREE_ROW_INDENT_BASE_PX,
  TREE_ROW_INDENT_STEP_PX,
} from "@/lib/ui/uiConstants";
import type { ExplorerVisibleRow } from "@/lib/skills/resourceTree";

type SkillExplorerListProps = {
  activeFilePath: string;
  collapsedDirectoryPaths: Set<string>;
  selectedRowIndex: number;
  visibleRows: ExplorerVisibleRow[];
  onSelectNode: (row: ExplorerVisibleRow) => void;
};

const getTreeRowPaddingLeft = (depth: number): string => {
  return `${depth * TREE_ROW_INDENT_STEP_PX + TREE_ROW_INDENT_BASE_PX}px`;
};

export const SkillExplorerList = ({
  activeFilePath,
  collapsedDirectoryPaths,
  selectedRowIndex,
  visibleRows,
  onSelectNode,
}: SkillExplorerListProps) => {
  return (
    <TerminalPanel headerLabel="Files">
      <ul className="p-2">
        {visibleRows.map((row, index) => {
          const isSelected = index === selectedRowIndex;
          const isActiveFile =
            row.node.type === "file" && row.node.fullPath === activeFilePath;

          return (
            <li
              key={row.node.id}
              ref={
                isSelected
                  ? (element) => {
                      element?.scrollIntoView({
                        block: "nearest",
                        behavior: "smooth",
                      });
                    }
                  : undefined
              }
            >
              <button
                className={`skill-row flex w-full items-center gap-2 px-2 py-1.5 text-left text-sm ${
                  isSelected
                    ? "skill-row-selected bg-(--selection-bg) text-(--accent-bright)"
                    : "text-foreground hover:bg-(--panel-bg-muted)"
                }`}
                onClick={() => {
                  onSelectNode(row);
                }}
                style={{ paddingLeft: getTreeRowPaddingLeft(row.depth) }}
                type="button"
              >
                <span className="w-4 text-center text-(--text-dim)">
                  {row.node.type === "directory"
                    ? collapsedDirectoryPaths.has(row.node.fullPath)
                      ? ">"
                      : "v"
                    : "-"}
                </span>
                <span className="truncate">{row.node.displayName}</span>
                {isActiveFile ? (
                  <span className="ml-auto text-[10px] tracking-wide text-(--accent) uppercase">
                    active
                  </span>
                ) : null}
              </button>
            </li>
          );
        })}
      </ul>
    </TerminalPanel>
  );
};
