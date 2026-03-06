import Link from "next/link";

export const SiteFooter = () => {
  return (
    <footer className="border-t border-[var(--ui-border)] bg-[var(--terminal-bg)] px-4 py-4">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 text-sm text-[var(--text-dim)] md:flex-row md:items-center md:justify-between">
        <p>
          Spotted an issue or think I should add skills?{" "}
          <Link
            className="text-[var(--accent)] underline decoration-[var(--accent)]/40 underline-offset-4 transition-colors hover:text-[var(--accent-bright)]"
            href="https://github.com/shan8851/agent-skills/pulls"
            rel="noopener noreferrer"
            target="_blank"
          >
            Open a PR.
          </Link>
        </p>
        <div className="flex items-center gap-4">
          <Link
            className="text-[var(--text-main)] transition-colors hover:text-[var(--accent-bright)]"
            href="https://github.com/shan8851/agent-skills"
            rel="noopener noreferrer"
            target="_blank"
          >
            skills-repo
          </Link>
          <Link
            className="text-[var(--text-main)] transition-colors hover:text-[var(--accent-bright)]"
            href="https://x.com/shan8851"
            rel="noopener noreferrer"
            target="_blank"
          >
            @shan8851
          </Link>
        </div>
      </div>
    </footer>
  );
};
