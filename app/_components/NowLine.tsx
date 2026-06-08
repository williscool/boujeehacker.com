import ReactMarkdown from "react-markdown";
import MarkdownLinkInBlank from "./MarkdownLinkInBlank";

export default function NowLine({ markdown }: { markdown: string }) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-3">
      <span className="text-xs uppercase tracking-wide text-text-muted font-medium">
        Now
      </span>
      <div className="text-text [&_p]:m-0">
        <ReactMarkdown components={{ a: MarkdownLinkInBlank }}>
          {markdown}
        </ReactMarkdown>
      </div>
    </div>
  );
}
