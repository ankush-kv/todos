"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActionState, TodoStatus } from "@/lib/types";

const STATUSES: TodoStatus[] = ["todo", "in_progress", "completed"];

function parseStatus(value: unknown): TodoStatus {
  const status = String(value ?? "");
  return STATUSES.includes(status as TodoStatus)
    ? (status as TodoStatus)
    : "todo";
}

export async function createTodo(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const projectId = String(formData.get("project_id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  if (!title) {
    return { error: "Title is required." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("todos").insert({
    project_id: projectId,
    title,
    description: String(formData.get("description") ?? "").trim() || null,
    status: parseStatus(formData.get("status")),
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/projects/${projectId}`);
  return { success: "Todo created." };
}

export async function updateTodo(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = String(formData.get("id") ?? "");
  const projectId = String(formData.get("project_id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  if (!title) {
    return { error: "Title is required." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("todos")
    .update({
      title,
      description: String(formData.get("description") ?? "").trim() || null,
      status: parseStatus(formData.get("status")),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/projects/${projectId}`);
  return { success: "Todo updated." };
}

export async function updateTodoStatus(
  id: string,
  projectId: string,
  status: TodoStatus,
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("todos")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/projects/${projectId}`);
}

export async function deleteTodo(id: string, projectId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("todos").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/projects/${projectId}`);
}
