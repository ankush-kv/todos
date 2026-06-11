"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { projects, todos } from "@/lib/db/schema";
import type { ActionState, TodoStatus } from "@/lib/types";

const STATUSES: TodoStatus[] = ["todo", "in_progress", "completed"];

function parseStatus(value: unknown): TodoStatus {
  const status = String(value ?? "");
  return STATUSES.includes(status as TodoStatus)
    ? (status as TodoStatus)
    : "todo";
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
    return { error: "Project not found." };
  }

  await db.insert(todos).values({
    projectId,
    userId: user.id,
    title,
    description: String(formData.get("description") ?? "").trim() || null,
    status: parseStatus(formData.get("status")),
  });

  revalidatePath(`/projects/${projectId}`);
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

  await db
    .update(todos)
    .set({
      title,
      description: String(formData.get("description") ?? "").trim() || null,
      status: parseStatus(formData.get("status")),
      updatedAt: new Date(),
    })
    .where(and(eq(todos.id, id), eq(todos.userId, user.id)));

  revalidatePath(`/projects/${projectId}`);
  return { success: "Todo updated." };
}

export async function updateTodoStatus(
  id: string,
  projectId: string,
  status: TodoStatus,
) {
  const user = await requireUser();
  await db
    .update(todos)
    .set({ status, updatedAt: new Date() })
    .where(and(eq(todos.id, id), eq(todos.userId, user.id)));

  revalidatePath(`/projects/${projectId}`);
}

export async function deleteTodo(id: string, projectId: string) {
  const user = await requireUser();
  await db
    .delete(todos)
    .where(and(eq(todos.id, id), eq(todos.userId, user.id)));

  revalidatePath(`/projects/${projectId}`);
}
