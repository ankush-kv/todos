"use client";

import { useActionState, useEffect } from "react";
import { FormMessage } from "@/components/ui/form-message";
import { Input, Label, Textarea } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { createTodo, updateTodo } from "@/lib/actions/todos";
import type { Project, Todo, TodoStatus } from "@/lib/types";

const selectClass =
  "h-10 rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50";

export function TodoForm({
  projects,
  todo,
  defaultStatus = "todo",
  defaultProjectId,
  onDone,
}: {
  projects: Project[];
  todo?: Todo;
  defaultStatus?: TodoStatus;
  defaultProjectId?: string;
  onDone: () => void;
}) {
  const [state, formAction] = useActionState(
    todo ? updateTodo : createTodo,
    null,
  );

  useEffect(() => {
    if (state?.success) {
      onDone();
    }
  }, [state, onDone]);

  if (projects.length === 0) {
    return (
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        Create a project first, then you can add tasks to it.
      </p>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <FormMessage state={state} />
      {todo ? <input type="hidden" name="id" value={todo.id} /> : null}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          required
          defaultValue={todo?.title ?? ""}
          placeholder="What needs to be done?"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="project_id">Project</Label>
        <select
          id="project_id"
          name="project_id"
          defaultValue={todo?.projectId ?? defaultProjectId ?? projects[0].id}
          className={selectClass}
        >
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={todo?.description ?? ""}
          placeholder="Add more details (optional)"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            name="status"
            defaultValue={todo?.status ?? defaultStatus}
            className={selectClass}
          >
            <option value="todo">Todo</option>
            <option value="in_progress">In progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="priority">Priority</Label>
          <select
            id="priority"
            name="priority"
            defaultValue={todo?.priority ?? "medium"}
            className={selectClass}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="due_date">Due date</Label>
        <Input
          id="due_date"
          name="due_date"
          type="date"
          defaultValue={todo?.dueDate ?? ""}
        />
      </div>
      <SubmitButton>{todo ? "Save changes" : "Create todo"}</SubmitButton>
    </form>
  );
}
