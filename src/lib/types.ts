export type TodoStatus = "todo" | "in_progress" | "completed";

export type TodoPriority = "low" | "medium" | "high";

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
  priority: TodoPriority;
  dueDate: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type ActionState = {
  error?: string;
  success?: string;
} | null;
