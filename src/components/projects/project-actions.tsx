"use client";

import { useState, useTransition } from "react";
import { ProjectForm } from "@/components/projects/project-form";
import { Modal } from "@/components/ui/modal";
import { deleteProject } from "@/lib/actions/projects";
import type { Project } from "@/lib/types";

const buttonClass =
  "rounded-md px-2 py-1 text-xs font-medium text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50";

export function ProjectActions({ project }: { project: Project }) {
  const [editing, setEditing] = useState(false);
  const [, startTransition] = useTransition();

  const handleDelete = () => {
    if (
      window.confirm(
        `Delete project "${project.name}" and all of its todos? This cannot be undone.`,
      )
    ) {
      startTransition(async () => {
        await deleteProject(project.id);
      });
    }
  };

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => setEditing(true)}
        className={buttonClass}
      >
        Edit
      </button>
      <button
        type="button"
        onClick={handleDelete}
        className={`${buttonClass} hover:text-red-600 dark:hover:text-red-400`}
      >
        Delete
      </button>
      <Modal
        open={editing}
        onClose={() => setEditing(false)}
        title="Edit project"
      >
        <ProjectForm project={project} onDone={() => setEditing(false)} />
      </Modal>
    </div>
  );
}
