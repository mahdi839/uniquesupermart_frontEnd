"use client";

export default function useFormatDate() {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      timeZone: "Asia/Dhaka",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Date and time as separate strings so narrow layouts can put them on their
  // own lines instead of overflowing a single nowrap row.
  const formatDateParts = (dateString) => {
    if (!dateString) return { date: "N/A", time: "" };

    const date = new Date(dateString);
    const options = { timeZone: "Asia/Dhaka" };

    return {
      date: date.toLocaleDateString("en-US", {
        ...options,
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        ...options,
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  return { formatDate, formatDateParts };
}
