import type { ResourceDocument, Skill } from "@/lib/skills/skillsSchema";

type ResourceTreeBuilderNode = {
  directories: Record<string, ResourceTreeBuilderNode>;
  files: ResourceDocument[];
  fullPath: string;
  name: string;
};

export type SkillExplorerFileNode = {
  displayName: string;
  fullPath: string;
  id: string;
  markdown: string;
  title: string;
  type: "file";
};

export type SkillExplorerDirectoryNode = {
  children: SkillExplorerNode[];
  displayName: string;
  fullPath: string;
  id: string;
  type: "directory";
};

export type SkillExplorerNode =
  | SkillExplorerFileNode
  | SkillExplorerDirectoryNode;

export type ExplorerVisibleRow = {
  depth: number;
  node: SkillExplorerNode;
};

const createResourceTreeBuilderNode = (
  name: string,
  fullPath: string,
): ResourceTreeBuilderNode => {
  return {
    name,
    fullPath,
    directories: {},
    files: [],
  };
};

const insertResourceDocument = (
  node: ResourceTreeBuilderNode,
  segments: string[],
  document: ResourceDocument,
  parentPath: string,
): ResourceTreeBuilderNode => {
  if (segments.length === 1) {
    return {
      ...node,
      files: [...node.files, document],
    };
  }

  const [directoryName, ...remainingSegments] = segments;
  const childPath = `${parentPath}/${directoryName}`;
  const existingChild =
    node.directories[directoryName] ??
    createResourceTreeBuilderNode(directoryName, childPath);
  const updatedChild = insertResourceDocument(
    existingChild,
    remainingSegments,
    document,
    childPath,
  );

  return {
    ...node,
    directories: {
      ...node.directories,
      [directoryName]: updatedChild,
    },
  };
};

const sortNodesByDisplayName = <T extends { displayName: string }>(
  nodes: T[],
): T[] => {
  return [...nodes].sort((left, right) =>
    left.displayName.localeCompare(right.displayName, "en", {
      sensitivity: "base",
    }),
  );
};

const getFilenameFromRelativePath = (relativePath: string): string => {
  const segments = relativePath
    .split("/")
    .filter((segment) => segment.length > 0);
  return segments[segments.length - 1] ?? relativePath;
};

const buildExplorerChildren = (
  builderNode: ResourceTreeBuilderNode,
): SkillExplorerNode[] => {
  const directoryNodes = Object.values(builderNode.directories).map(
    (childDirectory) => {
      return {
        children: buildExplorerChildren(childDirectory),
        displayName: childDirectory.name,
        fullPath: childDirectory.fullPath,
        id: `dir:${childDirectory.fullPath}`,
        type: "directory",
      } satisfies SkillExplorerDirectoryNode;
    },
  );

  const fileNodes = builderNode.files.map((document) => {
    const displayName = getFilenameFromRelativePath(document.relativePath);

    return {
      displayName,
      fullPath: document.relativePath,
      id: document.id,
      markdown: document.markdown,
      title: document.title,
      type: "file",
    } satisfies SkillExplorerFileNode;
  });

  return [
    ...sortNodesByDisplayName(directoryNodes),
    ...sortNodesByDisplayName(fileNodes),
  ];
};

const buildResourceNodes = (
  resourceDocuments: ResourceDocument[],
): SkillExplorerNode[] => {
  const rootNode = resourceDocuments.reduce<ResourceTreeBuilderNode>(
    (currentRootNode, document) => {
      const segments = document.relativePath
        .split("/")
        .filter((segment) => segment.length > 0);

      if (segments.length === 0) {
        return currentRootNode;
      }

      return insertResourceDocument(currentRootNode, segments, document, "");
    },
    createResourceTreeBuilderNode("root", ""),
  );

  return buildExplorerChildren(rootNode);
};

export const buildSkillExplorerNodes = (skill: Skill): SkillExplorerNode[] => {
  const skillFileNode: SkillExplorerFileNode = {
    displayName: "SKILL.md",
    fullPath: "SKILL.md",
    id: `${skill.slug}:SKILL.md`,
    markdown: skill.skillMarkdown,
    title: `${skill.slug} Skill`,
    type: "file",
  };

  const resourceNodes = buildResourceNodes(skill.resourceDocuments);
  return [skillFileNode, ...resourceNodes];
};

export const flattenExplorerRows = (
  nodes: SkillExplorerNode[],
  collapsedDirectoryPaths: Set<string>,
  depth = 0,
): ExplorerVisibleRow[] => {
  return nodes.flatMap((node) => {
    const currentRow: ExplorerVisibleRow = {
      depth,
      node,
    };

    if (node.type !== "directory") {
      return [currentRow];
    }

    if (collapsedDirectoryPaths.has(node.fullPath)) {
      return [currentRow];
    }

    const childRows = flattenExplorerRows(
      node.children,
      collapsedDirectoryPaths,
      depth + 1,
    );
    return [currentRow, ...childRows];
  });
};
