import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectActions } from "@/components/projects/project-actions";
import { KanbanBoard } from "@/components/todos/kanban-board";
import { createClient } from "@/lib/supabase/server";
import type { Project, Todo } from "@/lib/types";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single<Project>();

  if (!project) {
    notFound();
  }

  const { data: todos } = await supabase
    .from("todos")
    .select("*")
    .eq("project_id", id)
    .order("created_at", { ascending: true })
    .returns<Todo[]>();

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

      <KanbanBoard todos={todos ?? []} projectId={id} />
    </div>
  );
}
