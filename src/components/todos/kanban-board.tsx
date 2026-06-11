"use client";

import { useMemo, useOptimistic, useState, useTransition } from "react";
import { TodoForm } from "@/components/todos/todo-form";
import { Modal } from "@/components/ui/modal";
import { deleteTodo, updateTodoStatus } from "@/lib/actions/todos";
import {
  formatDueDate,
  isOverdue,
  PRIORITY_BADGE,
  PRIORITY_LABEL,
  todayISO,
} from "@/lib/todo-meta";
import type { Project, Todo, TodoStatus } from "@/lib/types";

const COLUMNS: { status: TodoStatus; title: string; dot: string }[] = [
  { status: "todo", title: "Todo", dot: "bg-zinc-400" },
  { status: "in_progress", title: "In progress", dot: "bg-amber-400" },
  { status: "completed", title: "Completed", dot: "bg-green-500" },
];

export function KanbanBoard({
  todos,
  projects,
}: {
  todos: Todo[];
  projects: Project[];
}) {
  const [optimisticTodos, applyStatus] = useOptimistic(
    todos,
    (state, { id, status }: { id: string; status: TodoStatus }) =>
      state.map((todo) => (todo.id === id ? { ...todo, status } : todo)),
  );
  const [, startTransition] = useTransition();
  const [creatingIn, setCreatingIn] = useState<TodoStatus | null>(null);
  const [editing, setEditing] = useState<Todo | null>(null);
  const [dragOver, setDragOver] = useState<TodoStatus | null>(null);

  const today = todayISO();
  const projectNames = useMemo(
    () => new Map(projects.map((project) => [project.id, project.name])),
    [projects],
  );

  const moveTodo = (id: string, status: TodoStatus) => {
    startTransition(async () => {
      applyStatus({ id, status });
      await updateTodoStatus(id, status);
    });
  };

  const removeTodo = (todo: Todo) => {
    if (window.confirm(`Delete todo "${todo.title}"?`)) {
      startTransition(async () => {
        await deleteTodo(todo.id);
      });
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {COLUMNS.map((column) => {
          const columnTodos = optimisticTodos.filter(
            (todo) => todo.status === column.status,
          );

          return (
            <section
              key={column.status}
              aria-label={column.title}
              onDragOver={(event) => {
                event.preventDefault();
                setDragOver(column.status);
              }}
              onDragLeave={() => setDragOver(null)}
              onDrop={(event) => {
                event.preventDefault();
                setDragOver(null);
                const id = event.dataTransfer.getData("text/plain");
                if (id) {
                  moveTodo(id, column.status);
                }
              }}
              className={`flex flex-col gap-3 rounded-2xl border p-4 transition-colors ${
                dragOver === column.status
                  ? "border-zinc-400 bg-zinc-100 dark:border-zinc-500 dark:bg-zinc-800"
                  : "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`size-2 rounded-full ${column.dot}`} />
                  <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                    {column.title}
                  </h2>
                  <span className="text-xs text-zinc-400 dark:text-zinc-500">
                    {columnTodos.length}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setCreatingIn(column.status)}
                  aria-label={`Add todo to ${column.title}`}
                  className="rounded-md px-2 py-0.5 text-sm font-medium text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
                >
                  +
                </button>
              </div>

              <div className="flex min-h-24 flex-col gap-2">
                {columnTodos.map((todo) => {
                  const overdue =
                    todo.status !== "completed" &&
                    isOverdue(todo.dueDate, today);

                  return (
                    <article
                      key={todo.id}
                      draggable
                      onDragStart={(event) => {
                        event.dataTransfer.setData("text/plain", todo.id);
                        event.dataTransfer.effectAllowed = "move";
                      }}
                      className="group cursor-grab rounded-xl border border-zinc-200 bg-zinc-50 p-3 active:cursor-grabbing dark:border-zinc-700 dark:bg-zinc-800"
                    >
                      <div className="flex items-start gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            moveTodo(
                              todo.id,
                              todo.status === "completed"
                                ? "todo"
                                : "completed",
                            )
                          }
                          aria-label={
                            todo.status === "completed"
                              ? "Mark as not completed"
                              : "Mark as completed"
                          }
                          className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors ${
                            todo.status === "completed"
                              ? "border-green-500 bg-green-500 text-white"
                              : "border-zinc-400 hover:border-green-500 dark:border-zinc-500"
                          }`}
                        >
                          {todo.status === "completed" ? (
                            <svg
                              aria-hidden="true"
                              width="10"
                              height="10"
                              viewBox="0 0 10 10"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.5"
                            >
                              <path d="M2 5l2 2 4-4" />
                            </svg>
                          ) : null}
                        </button>
                        <div className="min-w-0 flex-1">
                          <p
                            className={`text-sm font-medium ${
                              todo.status === "completed"
                                ? "text-zinc-400 line-through dark:text-zinc-500"
                                : "text-zinc-900 dark:text-zinc-50"
                            }`}
                          >
                            {todo.title}
                          </p>
                          {todo.description ? (
                            <p className="mt-1 line-clamp-3 text-xs text-zinc-500 dark:text-zinc-400">
                              {todo.description}
                            </p>
                          ) : null}
                          <div className="mt-2 flex flex-wrap items-center gap-1.5">
                            <span className="rounded-md bg-zinc-200 px-1.5 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300">
                              {projectNames.get(todo.projectId) ?? "Project"}
                            </span>
                            <span
                              className={`rounded-md px-1.5 py-0.5 text-xs font-medium ${PRIORITY_BADGE[todo.priority]}`}
                            >
                              {PRIORITY_LABEL[todo.priority]}
                            </span>
                            {todo.dueDate ? (
                              <span
                                className={`rounded-md px-1.5 py-0.5 text-xs font-medium ${
                                  overdue
                                    ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                                    : "bg-zinc-200 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300"
                                }`}
                              >
                                {formatDueDate(todo.dueDate)}
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 flex justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={() => setEditing(todo)}
                          className="rounded-md px-2 py-0.5 text-xs font-medium text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-50"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => removeTodo(todo)}
                          className="rounded-md px-2 py-0.5 text-xs font-medium text-zinc-500 hover:bg-zinc-200 hover:text-red-600 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-red-400"
                        >
                          Delete
                        </button>
                      </div>
                    </article>
                  );
                })}
                {columnTodos.length === 0 ? (
                  <p className="rounded-xl border border-dashed border-zinc-200 p-3 text-center text-xs text-zinc-400 dark:border-zinc-700 dark:text-zinc-500">
                    Drop todos here
                  </p>
                ) : null}
              </div>
            </section>
          );
        })}
      </div>

      <Modal
        open={creatingIn !== null}
        onClose={() => setCreatingIn(null)}
        title="New todo"
      >
        <TodoForm
          projects={projects}
          defaultStatus={creatingIn ?? "todo"}
          onDone={() => setCreatingIn(null)}
        />
      </Modal>

      <Modal
        open={editing !== null}
        onClose={() => setEditing(null)}
        title="Edit todo"
      >
        {editing ? (
          <TodoForm
            projects={projects}
            todo={editing}
            onDone={() => setEditing(null)}
          />
        ) : null}
      </Modal>
    </>
  );
}
