export type TodoStatus = "todo" | "in_progress" | "completed";

export type Project = {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  created_at: string;
};

export type Todo = {
  id: string;
  project_id: string;
  user_id: string;
  title: string;
  description: string | null;
  status: TodoStatus;
  created_at: string;
  updated_at: string;
};

export type ActionState = {
  error?: string;
  success?: string;
} | null;
