"use client";

import { useState } from "react";
import { ProjectForm } from "@/components/projects/project-form";
import { Modal } from "@/components/ui/modal";

export function NewProjectButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-10 items-center gap-2 rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        + New project
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="New project">
        <ProjectForm onDone={() => setOpen(false)} />
      </Modal>
    </>
  );
}
