"use client";

import { useActionState, useEffect } from "react";
import { FormMessage } from "@/components/ui/form-message";
import { Input, Label, Textarea } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { createTodo, updateTodo } from "@/lib/actions/todos";
import type { Todo, TodoStatus } from "@/lib/types";

export function TodoForm({
  projectId,
  todo,
  defaultStatus = "todo",
  onDone,
}: {
  projectId: string;
  todo?: Todo;
  defaultStatus?: TodoStatus;
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

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <FormMessage state={state} />
      <input type="hidden" name="project_id" value={projectId} />
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
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={todo?.description ?? ""}
          placeholder="Add more details (optional)"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="status">Status</Label>
        <select
          id="status"
          name="status"
          defaultValue={todo?.status ?? defaultStatus}
          className="h-10 rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
        >
          <option value="todo">Todo</option>
          <option value="in_progress">In progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      <SubmitButton>{todo ? "Save changes" : "Create todo"}</SubmitButton>
    </form>
  );
}
