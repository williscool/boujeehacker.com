import type { ReactNode } from "react";

type ProseProps = {
  className?: string;
} & (
  | { children: ReactNode; html?: never }
  | { html: string; children?: never }
);

const proseStyles = `
  .prose-root > * + * { margin-top: 1.1em; }
  .prose-root > h2 { font-size: var(--text-2xl); margin-top: 2em; }
  .prose-root > h3 { font-size: var(--text-xl); margin-top: 1.6em; }
  .prose-root > * + h2 { margin-top: 2em; }
  .prose-root > * + h3 { margin-top: 1.6em; }
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
  .prose-root hr {
    border: 0;
    border-top: 1px solid var(--color-border);
    margin: 2em 0;
  }
`;

export default function Prose(props: ProseProps) {
  const className = `prose-root max-w-[var(--measure)] text-text leading-relaxed ${props.className ?? ""}`;

  if ("html" in props && props.html !== undefined) {
    return (
      <>
        <div className={className} dangerouslySetInnerHTML={{ __html: props.html }} />
        <style>{proseStyles}</style>
      </>
    );
  }

  return (
    <div className={className}>
      {props.children}
      <style>{proseStyles}</style>
    </div>
  );
}
