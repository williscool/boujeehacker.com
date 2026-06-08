import type { ReactNode } from "react";

export default function Prose({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`prose-root max-w-[var(--measure)] text-text leading-relaxed ${className}`}
    >
      {children}
      <style>{`
        .prose-root > * + * { margin-top: 1.1em; }
        .prose-root h2 { font-size: var(--text-2xl); margin-top: 2em; }
        .prose-root h3 { font-size: var(--text-xl); margin-top: 1.6em; }
        .prose-root ul, .prose-root ol { padding-left: 1.4em; }
        .prose-root ul { list-style: disc; }
        .prose-root ol { list-style: decimal; }
        .prose-root li + li { margin-top: 0.4em; }
        .prose-root code {
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 0.92em;
          background: var(--color-surface);
          padding: 0.1em 0.35em;
          border-radius: 3px;
        }
        .prose-root blockquote {
          border-left: 2px solid var(--color-border);
          padding-left: 1em;
          color: var(--color-text-muted);
        }
      `}</style>
    </div>
  );
}
