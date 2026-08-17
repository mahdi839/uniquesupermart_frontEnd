export const CUSTOMER_BADGES = [
  { title: "black_list_customer", label: "Black List Customer" },
  { title: "very_annoying_customer", label: "Very Annoying Customer" },
  { title: "tester", label: "Tester" },
  { title: "owner", label: "Owner" },
  { title: "silver_customer", label: "Silver Customer" },
  { title: "golden_customer", label: "Golden Customer" },
];

export const BADGE_STYLES = {
  black_list_customer: { bg: "#212529", color: "#fff", border: "#000" },
  very_annoying_customer: { bg: "#f8d7da", color: "#842029", border: "#dc3545" },
  tester: { bg: "#e2d9f3", color: "#432874", border: "#6f42c1" },
  owner: { bg: "#cfe2ff", color: "#084298", border: "#0d6efd" },
  silver_customer: { bg: "#e9ecef", color: "#495057", border: "#adb5bd" },
  golden_customer: { bg: "#fff3cd", color: "#856404", border: "#ffc107" },
};

export function getBadgeLabel(badge) {
  if (!badge) return "";
  if (typeof badge === "string") {
    return CUSTOMER_BADGES.find((item) => item.title === badge)?.label || badge;
  }
  return badge.label || getBadgeLabel(badge.title);
}

export function getBadgeTitle(badge) {
  if (!badge) return "";
  if (typeof badge === "string") return badge;
  return badge.title || "";
}
