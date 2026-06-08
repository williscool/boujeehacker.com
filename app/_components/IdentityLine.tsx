import ReactMarkdown from "react-markdown";
import MarkdownLinkInBlank from "./MarkdownLinkInBlank";

export default function IdentityLine({ markdown }: { markdown: string }) {
  return (
    <div className="font-display text-3xl sm:text-4xl leading-snug text-text [&_p]:m-0 [&_strong]:font-normal">
      <ReactMarkdown components={{ a: MarkdownLinkInBlank }}>
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
