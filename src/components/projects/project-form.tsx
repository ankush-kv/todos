"use client";

import { useActionState, useEffect } from "react";
import { FormMessage } from "@/components/ui/form-message";
import { Input, Label, Textarea } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { createProject, updateProject } from "@/lib/actions/projects";
import type { Project } from "@/lib/types";

export function ProjectForm({
  project,
  onDone,
}: {
  project?: Project;
  onDone: () => void;
}) {
  const [state, formAction] = useActionState(
    project ? updateProject : createProject,
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
      {project ? <input type="hidden" name="id" value={project.id} /> : null}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          required
          defaultValue={project?.name ?? ""}
          placeholder="My project"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={project?.description ?? ""}
          placeholder="What is this project about? (optional)"
        />
      </div>
      <SubmitButton>{project ? "Save changes" : "Create project"}</SubmitButton>
    </form>
  );
}
