import React from "react";

type Props = {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
};

// Notion-style tag/badge — uses inline styles for CSS variable colors
export function NotionBadge({ children, style, className = "" }: Props) {
  return (
    <span
      className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-normal whitespace-nowrap ${className}`}
      style={style}
    >
      {children}
    </span>
  );
}
