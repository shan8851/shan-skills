"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { KeyboardHelpModal } from "@/components/keyboard/keyboardHelpModal";
import { KeyboardHints } from "@/components/keyboard/keyboardHints";
import { SiteFooter } from "@/components/site/siteFooter";
import { TerminalPanel } from "@/components/ui/terminalPanel";
import { isTypingElement } from "@/lib/keyboard/keyboardGuards";
import type { KeyboardShortcut } from "@/lib/keyboard/shortcutTypes";
import {
  buildSkillExplorerNodes,
  flattenExplorerRows,
  type SkillExplorerFileNode,
} from "@/lib/skills/resourceTree";
import type { Skill } from "@/lib/skills/skillsSchema";

type SkillPageClientProps = {
  skill: Skill;
};

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

const getFirstFileNode = (skill: Skill): SkillExplorerFileNode => {
  return {
    displayName: "SKILL.md",
    fullPath: "SKILL.md",
    id: `${skill.slug}:SKILL.md`,
    markdown: skill.skillMarkdown,
    title: `${skill.slug} Skill`,
    type: "file",
  };
};

export const SkillPageClient = ({ skill }: SkillPageClientProps) => {
  const router = useRouter();
  const explorerNodes = useMemo(() => buildSkillExplorerNodes(skill), [skill]);

  const [collapsedDirectoryPaths, setCollapsedDirectoryPaths] = useState<Set<string>>(new Set());
  const [selectedNodePath, setSelectedNodePath] = useState("SKILL.md");
  const [activeFilePath, setActiveFilePath] = useState("SKILL.md");
  const [copiedFilePath, setCopiedFilePath] = useState<string | null>(null);
  const [isKeyboardHelpOpen, setIsKeyboardHelpOpen] = useState(false);

  const allRows = useMemo(() => {
    return flattenExplorerRows(explorerNodes, new Set<string>());
  }, [explorerNodes]);

  const visibleRows = useMemo(() => {
    return flattenExplorerRows(explorerNodes, collapsedDirectoryPaths);
  }, [collapsedDirectoryPaths, explorerNodes]);

  const selectedRowIndex = useMemo(() => {
    const matchedIndex = visibleRows.findIndex((row) => row.node.fullPath === selectedNodePath);

    if (matchedIndex >= 0) {
      return matchedIndex;
    }

    return 0;
  }, [selectedNodePath, visibleRows]);

  const activeFileNode = useMemo(() => {
    const flattenedFiles = allRows
      .map((row) => row.node)
      .filter((node): node is SkillExplorerFileNode => node.type === "file");

    const selectedFile = flattenedFiles.find((fileNode) => fileNode.fullPath === activeFilePath);

    if (selectedFile !== undefined) {
      return selectedFile;
    }

    return getFirstFileNode(skill);
  }, [activeFilePath, allRows, skill]);

  const selectedRow = visibleRows[selectedRowIndex];

  const skillShortcuts = useMemo<KeyboardShortcut[]>(() => {
    const isDirectorySelected = selectedRow?.node.type === "directory";

    return [
      {
        id: "move-selection",
        keys: ["ArrowUp", "ArrowDown"],
        description: "Move selection",
        enabled: visibleRows.length > 0,
      },
      {
        id: "collapse-or-expand",
        keys: ["ArrowLeft", "ArrowRight"],
        description: "Collapse / expand folder",
        enabled: isDirectorySelected,
      },
      {
        id: "open-file",
        keys: ["Enter"],
        description: "Open selected file",
        enabled: selectedRow !== undefined,
      },
      {
        id: "copy-file",
        keys: ["C"],
        description: "Copy active file",
        enabled: activeFileNode !== undefined,
      },
      {
        id: "back-to-list",
        keys: ["Backspace"],
        description: "Back to list",
        enabled: true,
      },
      {
        id: "open-help",
        keys: ["?"],
        description: "Keyboard help",
        enabled: true,
      },
    ];
  }, [activeFileNode, selectedRow, visibleRows.length]);

  useEffect(() => {
    if (copiedFilePath === null) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setCopiedFilePath(null);
    }, 1200);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [copiedFilePath]);

  useEffect(() => {
    const toggleDirectory = (directoryPath: string, shouldCollapse: boolean) => {
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

    const openSelectedRow = () => {
      const node = selectedRow?.node;

      if (node === undefined) {
        return;
      }

      if (node.type === "directory") {
        const isCollapsed = collapsedDirectoryPaths.has(node.fullPath);
        toggleDirectory(node.fullPath, !isCollapsed);
        return;
      }

      setActiveFilePath(node.fullPath);
    };

    const copyActiveFile = async () => {
      if (activeFileNode === undefined) {
        return;
      }

      try {
        await navigator.clipboard.writeText(activeFileNode.markdown);
        setCopiedFilePath(activeFileNode.fullPath);
      } catch {
        setCopiedFilePath(null);
      }
    };

    const handleKeydown = (event: KeyboardEvent) => {
      if (isKeyboardHelpOpen) {
        if (event.key === "Escape") {
          event.preventDefault();
          setIsKeyboardHelpOpen(false);
        }

        return;
      }

      const isTyping = isTypingElement(event.target);

      if (!isTyping && !event.metaKey && !event.ctrlKey && !event.altKey && event.key === "?") {
        event.preventDefault();
        setIsKeyboardHelpOpen(true);
        return;
      }

      if (!isTyping && event.key === "Backspace") {
        event.preventDefault();
        router.push("/");
        return;
      }

      if (isTyping || visibleRows.length === 0) {
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        const nextIndex = clampIndex(selectedRowIndex + 1, visibleRows.length);
        const nextRow = visibleRows[nextIndex];

        if (nextRow !== undefined) {
          setSelectedNodePath(nextRow.node.fullPath);

          if (nextRow.node.type === "file") {
            setActiveFilePath(nextRow.node.fullPath);
          }
        }
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        const nextIndex = clampIndex(selectedRowIndex - 1, visibleRows.length);
        const nextRow = visibleRows[nextIndex];

        if (nextRow !== undefined) {
          setSelectedNodePath(nextRow.node.fullPath);

          if (nextRow.node.type === "file") {
            setActiveFilePath(nextRow.node.fullPath);
          }
        }
        return;
      }

      const node = selectedRow?.node;

      if (event.key === "ArrowRight" && node?.type === "directory") {
        event.preventDefault();
        toggleDirectory(node.fullPath, false);
        return;
      }

      if (event.key === "ArrowLeft" && node?.type === "directory") {
        event.preventDefault();
        toggleDirectory(node.fullPath, true);
        return;
      }

      if (event.key === "Enter") {
        event.preventDefault();
        openSelectedRow();
        return;
      }

      if (event.key.toLowerCase() === "c") {
        event.preventDefault();
        void copyActiveFile();
      }
    };

    window.addEventListener("keydown", handleKeydown);

    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [
    activeFileNode,
    collapsedDirectoryPaths,
    isKeyboardHelpOpen,
    router,
    selectedRow,
    selectedRowIndex,
    visibleRows,
  ]);

  const handleFileCopy = async () => {
    if (activeFileNode === undefined) {
      return;
    }

    try {
      await navigator.clipboard.writeText(activeFileNode.markdown);
      setCopiedFilePath(activeFileNode.fullPath);
    } catch {
      setCopiedFilePath(null);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[var(--terminal-bg)] text-[var(--text-main)]">
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-8 md:px-6">
        <TerminalPanel className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="terminal-fade-in">
            <p className="font-display text-xs uppercase tracking-[0.15em] text-[var(--text-dim)]">
              Skill
            </p>
            <h1 className="glow-accent font-display text-lg uppercase tracking-[0.08em] text-[var(--accent-bright)]">
              {skill.name}
            </h1>
          </div>
          <Link
            className="glow-hover border border-[var(--ui-border)] px-3 py-1 text-xs text-[var(--text-main)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent-bright)]"
            href="/"
          >
            Back to list
          </Link>
        </TerminalPanel>

        <div className="terminal-fade-in" style={{ animationDelay: "100ms" }}>
          <KeyboardHints shortcuts={skillShortcuts} />
        </div>

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(260px,340px)_minmax(0,1fr)]">
          <div className="terminal-fade-in" style={{ animationDelay: "180ms" }}>
            <TerminalPanel headerLabel="Files">
              <ul className="p-2">
                {visibleRows.map((row, index) => {
                  const isSelected = index === selectedRowIndex;
                  const isActiveFile =
                    row.node.type === "file" && row.node.fullPath === activeFileNode.fullPath;

                  return (
                    <li
                      key={row.node.id}
                      ref={isSelected ? (element) => { element?.scrollIntoView({ block: "nearest", behavior: "smooth" }); } : undefined}
                    >
                      <button
                        className={`skill-row flex w-full items-center gap-2 px-2 py-1.5 text-left text-sm ${
                          isSelected
                            ? "skill-row-selected bg-[var(--selection-bg)] text-[var(--accent-bright)]"
                            : "text-[var(--text-main)] hover:bg-[var(--panel-bg-muted)]"
                        }`}
                        onClick={() => {
                          setSelectedNodePath(row.node.fullPath);

                          if (row.node.type === "file") {
                            setActiveFilePath(row.node.fullPath);
                          }
                        }}
                        style={{ paddingLeft: `${row.depth * 16 + 8}px` }}
                        type="button"
                      >
                        <span className="w-4 text-center text-[var(--text-dim)]">
                          {row.node.type === "directory"
                            ? collapsedDirectoryPaths.has(row.node.fullPath)
                              ? ">"
                              : "v"
                            : "-"}
                        </span>
                        <span className="truncate">{row.node.displayName}</span>
                        {isActiveFile ? (
                          <span className="ml-auto text-[10px] uppercase tracking-wide text-[var(--accent)]">
                            active
                          </span>
                        ) : null}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </TerminalPanel>
          </div>

          <div className="terminal-fade-in" style={{ animationDelay: "260ms" }}>
            <TerminalPanel headerLabel="Preview">
              <div className="flex items-center justify-between border-b border-[var(--ui-border)] px-3 py-2">
                <div>
                  <p className="font-display text-xs uppercase tracking-[0.15em] text-[var(--text-dim)]">
                    {activeFileNode.title}
                  </p>
                  <p className="mt-0.5 font-[var(--font-terminal-mono)] text-xs text-[var(--text-main)]">
                    {activeFileNode.fullPath}
                  </p>
                </div>
                <button
                  className="glow-hover border border-[var(--ui-border)] px-3 py-1 text-xs text-[var(--text-main)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent-bright)]"
                  onClick={() => {
                    void handleFileCopy();
                  }}
                  type="button"
                >
                  {copiedFilePath === activeFileNode.fullPath ? "Copied" : "Copy Raw"}
                </button>
              </div>
              <div className="prose prose-invert max-w-none px-4 py-4 text-sm leading-relaxed text-[var(--text-main)]">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    a: ({ children, href }) => {
                      return (
                        <a
                          className="glow-hover text-[var(--accent)] underline decoration-[var(--accent)]/50 underline-offset-4"
                          href={href}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          {children}
                        </a>
                      );
                    },
                    code: ({ children }) => {
                      return (
                        <code className="bg-black/40 px-1 py-0.5 text-[var(--accent)]">
                          {children}
                        </code>
                      );
                    },
                    h1: ({ children }) => {
                      return (
                        <h2 className="glow-heading-sm mt-3 font-display text-xl uppercase tracking-[0.08em] text-[var(--accent-bright)]">
                          {children}
                        </h2>
                      );
                    },
                    h2: ({ children }) => {
                      return (
                        <h3 className="glow-heading-sm mt-4 font-display text-lg uppercase tracking-[0.08em] text-[var(--accent-bright)]">
                          {children}
                        </h3>
                      );
                    },
                    li: ({ children }) => {
                      return <li className="my-1">{children}</li>;
                    },
                    p: ({ children }) => {
                      return <p className="my-2">{children}</p>;
                    },
                  }}
                >
                  {activeFileNode.markdown}
                </ReactMarkdown>
              </div>
            </TerminalPanel>
          </div>
        </section>
      </main>

      <div className="terminal-fade-in" style={{ animationDelay: "340ms" }}>
        <SiteFooter />
      </div>

      {isKeyboardHelpOpen ? (
        <KeyboardHelpModal
          onClose={() => {
            setIsKeyboardHelpOpen(false);
          }}
          shortcuts={skillShortcuts}
        />
      ) : null}
    </div>
  );
};
