import ReactMarkdown from "react-markdown";
import MarkdownLinkInBlank from "./MarkdownLinkInBlank";

export default function NowLine({ markdown }: { markdown: string }) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-3">
      <span className="text-xs uppercase tracking-wide text-text-muted font-medium">
        Now
      </span>
      <div className="text-text [&_p]:m-0 [&_a]:underline [&_a]:decoration-1 [&_a]:underline-offset-[3px] [&_a]:decoration-border hover:[&_a:hover]:text-link-hover hover:[&_a:hover]:decoration-link-hover">
        <ReactMarkdown components={{ a: MarkdownLinkInBlank }}>
          {markdown}
        </ReactMarkdown>
      </div>
    </div>
  );
}
