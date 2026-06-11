import { and, asc, eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectActions } from "@/components/projects/project-actions";
import { KanbanBoard } from "@/components/todos/kanban-board";
import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { projects, todos } from "@/lib/db/schema";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser();

  const project = await db.query.projects.findFirst({
    where: and(eq(projects.id, id), eq(projects.userId, user.id)),
  });

  if (!project) {
    notFound();
  }

  const projectTodos = await db.query.todos.findMany({
    where: and(eq(todos.projectId, id), eq(todos.userId, user.id)),
    orderBy: asc(todos.createdAt),
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href="/dashboard"
          className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          ← Back to dashboard
        </Link>
        <div className="mt-2 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              {project.name}
            </h1>
            {project.description ? (
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                {project.description}
              </p>
            ) : null}
          </div>
          <ProjectActions project={project} />
        </div>
      </div>

      <KanbanBoard todos={projectTodos} projectId={id} />
    </div>
  );
}
