"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { TerminalPanel } from "@/components/ui/terminalPanel";
import { skillMarkdownComponents } from "@/lib/markdown/skillMarkdownComponents";

type SkillMarkdownPreviewProps = {
  copiedFilePath: string | null;
  filePath: string;
  markdown: string;
  onCopy: () => void;
  title: string;
};

export const SkillMarkdownPreview = ({
  copiedFilePath,
  filePath,
  markdown,
  onCopy,
  title,
}: SkillMarkdownPreviewProps) => {
  return (
    <TerminalPanel headerLabel="Preview">
      <div className="flex items-center justify-between border-b border-(--ui-border) px-3 py-2">
        <div>
          <p className="font-display text-xs tracking-[0.15em] text-(--text-dim) uppercase">
            {title}
          </p>
          <p className="mt-0.5 text-xs font-(--font-terminal-mono) text-foreground">
            {filePath}
          </p>
        </div>
        <button
          className="glow-hover border border-(--ui-border) px-3 py-1 text-xs text-foreground transition-colors hover:border-(--accent) hover:text-(--accent-bright)"
          onClick={onCopy}
          type="button"
        >
          {copiedFilePath === filePath ? "Copied" : "Copy Raw"}
        </button>
      </div>
      <div className="prose prose-invert max-w-none px-4 py-4 text-sm leading-relaxed text-foreground">
        <ReactMarkdown
          components={skillMarkdownComponents}
          remarkPlugins={[remarkGfm]}
        >
          {markdown}
        </ReactMarkdown>
      </div>
    </TerminalPanel>
  );
};
