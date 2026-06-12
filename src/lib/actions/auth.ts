"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { createSession, destroySession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import type { ActionState } from "@/lib/types";

function normalizeEmail(value: FormDataEntryValue | null): string {
  return String(value ?? "")
    .trim()
    .toLowerCase();
}

export async function login(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const email = normalizeEmail(formData.get("email"));
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  try {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      return { error: "Invalid email or password." };
    }

    await createSession({ id: user.id, email: user.email });
    revalidatePath("/", "layout");
    redirect("/");
  } catch (error: unknown) {
    // redirect() works by throwing a special error — let it propagate.
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }
    console.error("[login] Unhandled error:", error);
    return { error: "Something went wrong. Please try again." };
  }
}

export async function register(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const email = normalizeEmail(formData.get("email"));
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  const existing = await db.query.users.findFirst({
    where: eq(users.email, email),
  });
  if (existing) {
    return { error: "An account with this email already exists." };
  }

  const passwordHash = await hashPassword(password);
  const [user] = await db
    .insert(users)
    .values({ email, passwordHash })
    .returning({ id: users.id, email: users.email });

  await createSession({ id: user.id, email: user.email });
  revalidatePath("/", "layout");
  redirect("/");
}

export async function signOut() {
  await destroySession();
  revalidatePath("/", "layout");
  redirect("/login");
}
