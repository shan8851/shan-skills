import type { Components } from "react-markdown";

export const skillMarkdownComponents: Components = {
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
      <h2 className="glow-heading-sm font-display mt-3 text-xl tracking-[0.08em] text-[var(--accent-bright)] uppercase">
        {children}
      </h2>
    );
  },
  h2: ({ children }) => {
    return (
      <h3 className="glow-heading-sm font-display mt-4 text-lg tracking-[0.08em] text-[var(--accent-bright)] uppercase">
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
};
