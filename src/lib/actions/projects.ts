"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";
import type { ActionState } from "@/lib/types";

export async function createProject(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) {
    return { error: "Project name is required." };
  }

  await db.insert(projects).values({
    userId: user.id,
    name,
    description: String(formData.get("description") ?? "").trim() || null,
  });

  revalidatePath("/");
  return { success: "Project created." };
}

export async function updateProject(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  if (!name) {
    return { error: "Project name is required." };
  }

  await db
    .update(projects)
    .set({
      name,
      description: String(formData.get("description") ?? "").trim() || null,
    })
    .where(and(eq(projects.id, id), eq(projects.userId, user.id)));

  revalidatePath("/");
  return { success: "Project updated." };
}

export async function deleteProject(id: string) {
  const user = await requireUser();
  await db
    .delete(projects)
    .where(and(eq(projects.id, id), eq(projects.userId, user.id)));

  revalidatePath("/");
}
