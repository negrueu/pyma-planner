import React from "react";

type Props = {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
};

// Notion-identical tag — small, compact, 3px radius
export function NotionBadge({ children, style, className = "" }: Props) {
  return (
    <span
      className={`inline-flex items-center px-[6px] py-[1px] rounded-[3px] text-[12px] leading-[18px] font-normal break-words ${className}`}
      style={{ ...style, maxWidth: "100%", wordBreak: "break-word" }}
    >
      {children}
    </span>
  );
}
