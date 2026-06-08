import ReactMarkdown from "react-markdown";
import MarkdownLinkInBlank from "./MarkdownLinkInBlank";

export default function IdentityLine({ markdown }: { markdown: string }) {
  return (
    <div className="font-display text-3xl sm:text-4xl leading-snug text-text [&_p]:m-0 [&_strong]:font-normal [&_a]:underline [&_a]:decoration-1 [&_a]:underline-offset-[4px] [&_a]:decoration-border hover:[&_a:hover]:text-link-hover hover:[&_a:hover]:decoration-link-hover">
      <ReactMarkdown components={{ a: MarkdownLinkInBlank }}>
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
