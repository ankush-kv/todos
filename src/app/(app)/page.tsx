import { asc, eq } from "drizzle-orm";
import { HomeBoard } from "@/components/board/home-board";
import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { projects, todos } from "@/lib/db/schema";

export default async function HomePage() {
  const user = await requireUser();

  const [userProjects, userTodos] = await Promise.all([
    db.query.projects.findMany({
      where: eq(projects.userId, user.id),
      orderBy: asc(projects.name),
    }),
    db.query.todos.findMany({
      where: eq(todos.userId, user.id),
      orderBy: [asc(todos.dueDate), asc(todos.createdAt)],
    }),
  ]);

  return <HomeBoard projects={userProjects} todos={userTodos} />;
}
