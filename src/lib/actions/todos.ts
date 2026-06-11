"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { projects, todos } from "@/lib/db/schema";
import type { ActionState, TodoPriority, TodoStatus } from "@/lib/types";

const STATUSES: TodoStatus[] = ["todo", "in_progress", "completed"];
const PRIORITIES: TodoPriority[] = ["low", "medium", "high"];

function parseStatus(value: unknown): TodoStatus {
  const status = String(value ?? "");
  return STATUSES.includes(status as TodoStatus)
    ? (status as TodoStatus)
    : "todo";
}

function parsePriority(value: unknown): TodoPriority {
  const priority = String(value ?? "");
  return PRIORITIES.includes(priority as TodoPriority)
    ? (priority as TodoPriority)
    : "medium";
}

function parseDueDate(value: unknown): string | null {
  const due = String(value ?? "").trim();
  // <input type="date"> yields an empty string when cleared.
  return /^\d{4}-\d{2}-\d{2}$/.test(due) ? due : null;
}

// Confirms the project exists and belongs to the user before mutating its todos.
async function assertProjectOwner(
  projectId: string,
  userId: string,
): Promise<boolean> {
  const project = await db.query.projects.findFirst({
    where: and(eq(projects.id, projectId), eq(projects.userId, userId)),
    columns: { id: true },
  });
  return Boolean(project);
}

export async function createTodo(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const projectId = String(formData.get("project_id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  if (!title) {
    return { error: "Title is required." };
  }
  if (!(await assertProjectOwner(projectId, user.id))) {
    return { error: "Select a valid project." };
  }

  await db.insert(todos).values({
    projectId,
    userId: user.id,
    title,
    description: String(formData.get("description") ?? "").trim() || null,
    status: parseStatus(formData.get("status")),
    priority: parsePriority(formData.get("priority")),
    dueDate: parseDueDate(formData.get("due_date")),
  });

  revalidatePath("/");
  return { success: "Todo created." };
}

export async function updateTodo(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  const projectId = String(formData.get("project_id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  if (!title) {
    return { error: "Title is required." };
  }
  if (!(await assertProjectOwner(projectId, user.id))) {
    return { error: "Select a valid project." };
  }

  await db
    .update(todos)
    .set({
      projectId,
      title,
      description: String(formData.get("description") ?? "").trim() || null,
      status: parseStatus(formData.get("status")),
      priority: parsePriority(formData.get("priority")),
      dueDate: parseDueDate(formData.get("due_date")),
      updatedAt: new Date(),
    })
    .where(and(eq(todos.id, id), eq(todos.userId, user.id)));

  revalidatePath("/");
  return { success: "Todo updated." };
}

export async function updateTodoStatus(id: string, status: TodoStatus) {
  const user = await requireUser();
  await db
    .update(todos)
    .set({ status, updatedAt: new Date() })
    .where(and(eq(todos.id, id), eq(todos.userId, user.id)));

  revalidatePath("/");
}

export async function deleteTodo(id: string) {
  const user = await requireUser();
  await db
    .delete(todos)
    .where(and(eq(todos.id, id), eq(todos.userId, user.id)));

  revalidatePath("/");
}
