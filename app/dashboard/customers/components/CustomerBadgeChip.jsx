"use client";

import React from "react";
import { BADGE_STYLES, getBadgeLabel, getBadgeTitle } from "../badgeConfig";

export default function CustomerBadgeChip({ badge, className = "" }) {
  const title = getBadgeTitle(badge);
  if (!title) return null;

  const style = BADGE_STYLES[title] || { bg: "#e2e3e5", color: "#41464b", border: "#adb5bd" };

  return (
    <span
      className={className}
      style={{
        display: "inline-block",
        padding: "2px 8px",
        borderRadius: "12px",
        fontSize: "11px",
        fontWeight: 700,
        letterSpacing: "0.2px",
        background: style.bg,
        color: style.color,
        border: `1px solid ${style.border}`,
        whiteSpace: "nowrap",
        verticalAlign: "middle",
      }}
    >
      {getBadgeLabel(badge)}
    </span>
  );
}
