import ReactMarkdown from "react-markdown";
import MarkdownLinkInBlank from "./MarkdownLinkInBlank";

export default function IdentityLine({ markdown }: { markdown: string }) {
  return (
    <div className="font-display text-3xl sm:text-4xl leading-snug text-text [&_p]:m-0 [&_strong]:font-normal">
      <ReactMarkdown
        components={{
          a: (props) => (
            <MarkdownLinkInBlank
              {...props}
              className="underline decoration-1 underline-offset-[4px] decoration-border hover:text-link-hover hover:decoration-link-hover"
            />
          ),
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
