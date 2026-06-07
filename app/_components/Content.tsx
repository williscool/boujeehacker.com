interface HTMLContentProps {
  content: string;
  className?: string;
}

export default function HTMLContent({ content, className }: HTMLContentProps) {
  return (
    <div className={className} dangerouslySetInnerHTML={{ __html: content }} />
  );
}
