"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { KeyboardHelpModal } from "@/components/keyboard/keyboardHelpModal";
import { KeyboardHints } from "@/components/keyboard/keyboardHints";
import { SiteFooter } from "@/components/site/siteFooter";
import { SkillExplorerList } from "@/components/skill/skillExplorerList";
import { SkillMarkdownPreview } from "@/components/skill/skillMarkdownPreview";
import { SkillPageHeader } from "@/components/skill/skillPageHeader";
import { useClipboardStatus } from "@/hooks/useClipboardStatus";
import { useSkillExplorerState } from "@/hooks/useSkillExplorerState";
import { useWindowKeydown } from "@/hooks/useWindowKeydown";
import { isTypingElement } from "@/lib/keyboard/keyboardGuards";
import { createSkillShortcuts } from "@/lib/keyboard/shortcutPresets";
import type { Skill } from "@/lib/skills/skillsSchema";
import { createAnimationDelayStyle } from "@/lib/ui/motion";
import {
  COPY_FEEDBACK_RESET_MS,
  TERMINAL_FADE_DELAYS_MS,
} from "@/lib/ui/uiConstants";

type SkillPageClientProps = {
  skill: Skill;
};

export const SkillPageClient = ({ skill }: SkillPageClientProps) => {
  const router = useRouter();
  const [isKeyboardHelpOpen, setIsKeyboardHelpOpen] = useState(false);
  const {
    activeFileNode,
    collapsedDirectoryPaths,
    moveSelection,
    openSelectedRow,
    selectNode,
    selectedRow,
    selectedRowIndex,
    setDirectoryCollapsed,
    visibleRows,
  } = useSkillExplorerState(skill);
  const { copiedValue: copiedFilePath, copyText } = useClipboardStatus(
    COPY_FEEDBACK_RESET_MS,
  );

  const skillShortcuts = useMemo(() => {
    return createSkillShortcuts({
      canCopyActiveFile: true,
      hasSelectedDirectory: selectedRow?.node.type === "directory",
      hasVisibleRows: visibleRows.length > 0,
    });
  }, [selectedRow, visibleRows.length]);

  const handleFileCopy = async (): Promise<void> => {
    await copyText(activeFileNode.fullPath, activeFileNode.markdown);
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
    const isPlainKeyboardShortcut =
      !event.metaKey && !event.ctrlKey && !event.altKey;

    if (!isTyping && isPlainKeyboardShortcut && event.key === "?") {
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
      moveSelection(1);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      moveSelection(-1);
      return;
    }

    const node = selectedRow?.node;

    if (event.key === "ArrowRight" && node?.type === "directory") {
      event.preventDefault();
      setDirectoryCollapsed(node.fullPath, false);
      return;
    }

    if (event.key === "ArrowLeft" && node?.type === "directory") {
      event.preventDefault();
      setDirectoryCollapsed(node.fullPath, true);
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      openSelectedRow();
      return;
    }

    if (event.key.toLowerCase() === "c") {
      event.preventDefault();
      void handleFileCopy();
    }
  });

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-8 md:px-6">
        <SkillPageHeader skillName={skill.name} />

        <div
          className="terminal-fade-in"
          style={createAnimationDelayStyle(TERMINAL_FADE_DELAYS_MS.skillHints)}
        >
          <KeyboardHints shortcuts={skillShortcuts} />
        </div>

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(260px,340px)_minmax(0,1fr)]">
          <div
            className="terminal-fade-in"
            style={createAnimationDelayStyle(
              TERMINAL_FADE_DELAYS_MS.skillExplorer,
            )}
          >
            <SkillExplorerList
              activeFilePath={activeFileNode.fullPath}
              collapsedDirectoryPaths={collapsedDirectoryPaths}
              selectedRowIndex={selectedRowIndex}
              visibleRows={visibleRows}
              onSelectNode={(row) => {
                selectNode(row.node);
              }}
            />
          </div>

          <div
            className="terminal-fade-in"
            style={createAnimationDelayStyle(
              TERMINAL_FADE_DELAYS_MS.skillPreview,
            )}
          >
            <SkillMarkdownPreview
              copiedFilePath={copiedFilePath}
              filePath={activeFileNode.fullPath}
              markdown={activeFileNode.markdown}
              onCopy={() => {
                void handleFileCopy();
              }}
              title={activeFileNode.title}
            />
          </div>
        </section>
      </main>

      <div
        className="terminal-fade-in"
        style={createAnimationDelayStyle(TERMINAL_FADE_DELAYS_MS.skillFooter)}
      >
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
