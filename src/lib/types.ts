export type TodoStatus = "todo" | "in_progress" | "completed";

export type Project = {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  createdAt: Date;
};

export type ProjectWithCount = Project & { todoCount: number };

export type Todo = {
  id: string;
  projectId: string;
  userId: string;
  title: string;
  description: string | null;
  status: TodoStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type ActionState = {
  error?: string;
  success?: string;
} | null;
