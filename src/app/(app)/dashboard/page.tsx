import Link from "next/link";
import { NewProjectButton } from "@/components/projects/new-project-button";
import { ProjectActions } from "@/components/projects/project-actions";
import { createClient } from "@/lib/supabase/server";
import type { Project } from "@/lib/types";

type ProjectRow = Project & { todos: { count: number }[] };

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select("*, todos(count)")
    .order("created_at", { ascending: false });

  const projects = (data ?? []) as ProjectRow[];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {projects.length === 0
              ? "No projects yet."
              : `${projects.length} project${projects.length === 1 ? "" : "s"}`}
          </p>
        </div>
        <NewProjectButton />
      </div>

      {projects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 p-12 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
          Create your first project to start adding todos.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="flex items-start justify-between gap-2">
                <Link
                  href={`/projects/${project.id}`}
                  className="text-base font-semibold text-zinc-900 hover:underline dark:text-zinc-50"
                >
                  {project.name}
                </Link>
                <ProjectActions project={project} />
              </div>
              {project.description ? (
                <p className="line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400">
                  {project.description}
                </p>
              ) : null}
              <p className="mt-auto text-xs text-zinc-400 dark:text-zinc-500">
                {project.todos[0]?.count ?? 0} todo
                {(project.todos[0]?.count ?? 0) === 1 ? "" : "s"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
