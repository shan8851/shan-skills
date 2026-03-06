import { useMemo, useState } from "react";

import { getSelectedIndex, getWrappedIndex } from "@/lib/ui/listNavigation";
import {
  buildSkillExplorerNodes,
  flattenExplorerRows,
  type ExplorerVisibleRow,
  type SkillExplorerFileNode,
  type SkillExplorerNode,
} from "@/lib/skills/resourceTree";
import type { Skill } from "@/lib/skills/skillsSchema";

type SkillExplorerState = {
  activeFileNode: SkillExplorerFileNode;
  collapsedDirectoryPaths: Set<string>;
  selectedRow: ExplorerVisibleRow | undefined;
  selectedRowIndex: number;
  visibleRows: ExplorerVisibleRow[];
  moveSelection: (offset: -1 | 1) => void;
  openSelectedRow: () => void;
  selectNode: (node: SkillExplorerNode) => void;
  setDirectoryCollapsed: (
    directoryPath: string,
    shouldCollapse: boolean,
  ) => void;
};

const skillRootFilePath = "SKILL.md";

const createRootSkillFileNode = (skill: Skill): SkillExplorerFileNode => {
  return {
    displayName: skillRootFilePath,
    fullPath: skillRootFilePath,
    id: `${skill.slug}:${skillRootFilePath}`,
    markdown: skill.skillMarkdown,
    title: `${skill.slug} Skill`,
    type: "file",
  };
};

const getFileNodes = (rows: ExplorerVisibleRow[]): SkillExplorerFileNode[] => {
  return rows
    .map((row) => row.node)
    .filter((node): node is SkillExplorerFileNode => node.type === "file");
};

export const useSkillExplorerState = (skill: Skill): SkillExplorerState => {
  const explorerNodes = useMemo(() => buildSkillExplorerNodes(skill), [skill]);
  const [collapsedDirectoryPaths, setCollapsedDirectoryPaths] = useState<
    Set<string>
  >(new Set());
  const [selectedNodePath, setSelectedNodePath] = useState(skillRootFilePath);
  const [activeFilePath, setActiveFilePath] = useState(skillRootFilePath);

  const allRows = useMemo(() => {
    return flattenExplorerRows(explorerNodes, new Set<string>());
  }, [explorerNodes]);

  const visibleRows = useMemo(() => {
    return flattenExplorerRows(explorerNodes, collapsedDirectoryPaths);
  }, [collapsedDirectoryPaths, explorerNodes]);

  const selectedRowIndex = useMemo(() => {
    return getSelectedIndex(
      visibleRows,
      (row) => row.node.fullPath === selectedNodePath,
    );
  }, [selectedNodePath, visibleRows]);

  const activeFileNode = useMemo(() => {
    const flattenedFileNodes = getFileNodes(allRows);
    const selectedFileNode = flattenedFileNodes.find(
      (fileNode) => fileNode.fullPath === activeFilePath,
    );

    return selectedFileNode ?? createRootSkillFileNode(skill);
  }, [activeFilePath, allRows, skill]);

  const selectedRow = visibleRows[selectedRowIndex];

  const selectNode = (node: SkillExplorerNode): void => {
    setSelectedNodePath(node.fullPath);

    if (node.type === "file") {
      setActiveFilePath(node.fullPath);
    }
  };

  const setDirectoryCollapsed = (
    directoryPath: string,
    shouldCollapse: boolean,
  ): void => {
    setCollapsedDirectoryPaths((previousPaths) => {
      const nextPaths = new Set(previousPaths);

      if (shouldCollapse) {
        nextPaths.add(directoryPath);
        return nextPaths;
      }

      nextPaths.delete(directoryPath);
      return nextPaths;
    });
  };

  const openSelectedRow = (): void => {
    const node = selectedRow?.node;

    if (node === undefined) {
      return;
    }

    if (node.type === "directory") {
      const isCollapsed = collapsedDirectoryPaths.has(node.fullPath);
      setDirectoryCollapsed(node.fullPath, !isCollapsed);
      return;
    }

    setActiveFilePath(node.fullPath);
  };

  const moveSelection = (offset: -1 | 1): void => {
    if (visibleRows.length === 0) {
      return;
    }

    const nextIndex = getWrappedIndex(
      selectedRowIndex + offset,
      visibleRows.length,
    );
    const nextRow = visibleRows[nextIndex];

    if (nextRow !== undefined) {
      selectNode(nextRow.node);
    }
  };

  return {
    activeFileNode,
    collapsedDirectoryPaths,
    selectedRow,
    selectedRowIndex,
    visibleRows,
    moveSelection,
    openSelectedRow,
    selectNode,
    setDirectoryCollapsed,
  };
};
