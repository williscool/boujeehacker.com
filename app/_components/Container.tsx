import type { ReactNode } from "react";

type Width = "default" | "narrow" | "wide";

const widthClass: Record<Width, string> = {
  narrow: "max-w-[640px]",
  default: "max-w-[820px]",
  wide: "max-w-[var(--container-width)]",
};

export default function Container({
  children,
  width = "default",
  className = "",
}: {
  children: ReactNode;
  width?: Width;
  className?: string;
}) {
  return (
    <div
      className={`mx-auto w-full px-[var(--spacing-container)] ${widthClass[width]} ${className}`}
    >
      {children}
    </div>
  );
}
