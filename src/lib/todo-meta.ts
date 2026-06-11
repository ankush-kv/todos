import type { TodoPriority } from "@/lib/types";

export const PRIORITY_LABEL: Record<TodoPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

export const PRIORITY_BADGE: Record<TodoPriority, string> = {
  high: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
  medium: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  low: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
};

export const PRIORITY_DOT: Record<TodoPriority, string> = {
  high: "bg-rose-500",
  medium: "bg-amber-500",
  low: "bg-sky-500",
};

export type DateFilter = "all" | "overdue" | "today" | "week" | "none";

// Local YYYY-MM-DD for today (matches the format of <input type="date">).
export function todayISO(): string {
  const d = new Date();
  const month = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}

export function addDaysISO(iso: string, days: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, m - 1, d + days);
  const month = `${dt.getMonth() + 1}`.padStart(2, "0");
  const day = `${dt.getDate()}`.padStart(2, "0");
  return `${dt.getFullYear()}-${month}-${day}`;
}

export function isOverdue(dueDate: string | null, today: string): boolean {
  return dueDate !== null && dueDate < today;
}

export function matchesDateFilter(
  dueDate: string | null,
  filter: DateFilter,
  today: string,
): boolean {
  switch (filter) {
    case "all":
      return true;
    case "none":
      return dueDate === null;
    case "overdue":
      return dueDate !== null && dueDate < today;
    case "today":
      return dueDate === today;
    case "week":
      return (
        dueDate !== null && dueDate >= today && dueDate <= addDaysISO(today, 7)
      );
  }
}

export function formatDueDate(dueDate: string): string {
  const [y, m, d] = dueDate.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}
