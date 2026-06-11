"use client";

import { useMemo, useState } from "react";
import { ProjectActions } from "@/components/projects/project-actions";
import { ProjectForm } from "@/components/projects/project-form";
import { KanbanBoard } from "@/components/todos/kanban-board";
import { TodoForm } from "@/components/todos/todo-form";
import { Modal } from "@/components/ui/modal";
import {
  type DateFilter,
  matchesDateFilter,
  PRIORITY_DOT,
  PRIORITY_LABEL,
  todayISO,
} from "@/lib/todo-meta";
import type { Project, Todo, TodoPriority } from "@/lib/types";

type ProjectFilter = string | "all";
type PriorityFilter = TodoPriority | "all";
type AddTarget = "project" | "task" | null;

const DATE_OPTIONS: { value: DateFilter; label: string }[] = [
  { value: "all", label: "All dates" },
  { value: "overdue", label: "Overdue" },
  { value: "today", label: "Due today" },
  { value: "week", label: "This week" },
  { value: "none", label: "No due date" },
];

const PRIORITY_OPTIONS: PriorityFilter[] = ["all", "high", "medium", "low"];

const filterClass = (active: boolean) =>
  `flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-sm transition-colors ${
    active
      ? "bg-zinc-900 font-medium text-white dark:bg-zinc-50 dark:text-zinc-900"
      : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
  }`;

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full ${filterClass(active)}`}
    >
      {children}
    </button>
  );
}

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <h3 className="px-2.5 pb-1 text-xs font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
        {title}
      </h3>
      {children}
    </div>
  );
}

export function HomeBoard({
  projects,
  todos,
}: {
  projects: Project[];
  todos: Todo[];
}) {
  const [projectFilter, setProjectFilter] = useState<ProjectFilter>("all");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("all");
  const [menuOpen, setMenuOpen] = useState(false);
  const [addTarget, setAddTarget] = useState<AddTarget>(null);

  const today = todayISO();

  const filtered = useMemo(
    () =>
      todos.filter(
        (todo) =>
          (projectFilter === "all" || todo.projectId === projectFilter) &&
          (priorityFilter === "all" || todo.priority === priorityFilter) &&
          matchesDateFilter(todo.dueDate, dateFilter, today),
      ),
    [todos, projectFilter, priorityFilter, dateFilter, today],
  );

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
      <aside className="flex shrink-0 flex-col gap-5 lg:w-56">
        <FilterSection title="Project">
          <FilterButton
            active={projectFilter === "all"}
            onClick={() => setProjectFilter("all")}
          >
            All projects
          </FilterButton>
          {projects.map((project) => (
            <div key={project.id} className="group flex items-center gap-1">
              <button
                type="button"
                onClick={() => setProjectFilter(project.id)}
                className={`min-w-0 flex-1 ${filterClass(projectFilter === project.id)}`}
              >
                <span className="truncate">{project.name}</span>
              </button>
              <div className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100">
                <ProjectActions project={project} />
              </div>
            </div>
          ))}
        </FilterSection>

        <FilterSection title="Due date">
          {DATE_OPTIONS.map((option) => (
            <FilterButton
              key={option.value}
              active={dateFilter === option.value}
              onClick={() => setDateFilter(option.value)}
            >
              {option.label}
            </FilterButton>
          ))}
        </FilterSection>

        <FilterSection title="Priority">
          {PRIORITY_OPTIONS.map((option) => (
            <FilterButton
              key={option}
              active={priorityFilter === option}
              onClick={() => setPriorityFilter(option)}
            >
              {option === "all" ? (
                "All priorities"
              ) : (
                <>
                  <span
                    className={`size-2 rounded-full ${PRIORITY_DOT[option]}`}
                  />
                  {PRIORITY_LABEL[option]}
                </>
              )}
            </FilterButton>
          ))}
        </FilterSection>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col gap-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              All tasks
            </h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {filtered.length} task{filtered.length === 1 ? "" : "s"}
            </p>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="flex h-10 items-center gap-1.5 rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-300"
            >
              + Add
              <span aria-hidden="true" className="text-xs">
                ▾
              </span>
            </button>
            {menuOpen ? (
              <>
                <button
                  type="button"
                  aria-label="Close menu"
                  tabIndex={-1}
                  className="fixed inset-0 z-10 cursor-default"
                  onClick={() => setMenuOpen(false)}
                />
                <div className="absolute right-0 z-20 mt-2 w-44 overflow-hidden rounded-xl border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      setAddTarget("project");
                    }}
                    className="block w-full px-4 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  >
                    Add project
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      setAddTarget("task");
                    }}
                    className="block w-full px-4 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  >
                    Add task
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </div>

        <KanbanBoard todos={filtered} projects={projects} />
      </div>

      <Modal
        open={addTarget === "project"}
        onClose={() => setAddTarget(null)}
        title="New project"
      >
        <ProjectForm onDone={() => setAddTarget(null)} />
      </Modal>

      <Modal
        open={addTarget === "task"}
        onClose={() => setAddTarget(null)}
        title="New task"
      >
        <TodoForm
          projects={projects}
          defaultProjectId={projectFilter === "all" ? undefined : projectFilter}
          onDone={() => setAddTarget(null)}
        />
      </Modal>
    </div>
  );
}
