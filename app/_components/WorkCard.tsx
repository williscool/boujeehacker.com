export interface WorkItem {
  title: string;
  outcome: string;
  url: string;
}

export default function WorkCard({ item }: { item: WorkItem }) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener"
      className="group block border-t border-border py-5 no-underline transition-colors duration-[var(--transition-duration)] hover:bg-surface/50"
    >
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="font-display text-xl text-text m-0">{item.title}</h3>
        <span
          aria-hidden
          className="text-text-muted transition-transform duration-[var(--transition-duration)] group-hover:translate-x-1 group-hover:text-link-hover"
        >
          →
        </span>
      </div>
      <p className="mt-1 text-text-muted text-base">{item.outcome}</p>
    </a>
  );
}
