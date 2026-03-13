// ─────────────────────────────────────────────────────────────
//  api.ts  –  All communication with the Flask backend lives here.
//
//  Base URL: the Flask dev server running on port 5000.
//  If you ever deploy, change this one constant and everything
//  else will update automatically.
// ─────────────────────────────────────────────────────────────

const BASE_URL = "https://psychic-space-train-v6xv4xrj9qp5cwg6x-5000.app.github.dev/";

// ── The shape of a Task as it comes back from the backend ──────
// The backend uses `priority` (1‑5) instead of `activeCrescents`.
// We rename it here so the rest of the frontend doesn't have to
// know about the difference.
export type Task = {
  id: number;
  title: string;
  description: string;
  date: string;
  activeCrescents: number;    // mapped from backend `priority`
  variant?: "small" | "wide";
  completed?: boolean;
  completedOn?: string;
  summary?: string[];
  volunteersNeeded?: number;
  tag?:string;
};

// Internal helper — maps the raw backend object to our Task shape.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapTask(raw: any): Task {
  return {
    id: raw.id,
    title: raw.title,
    description: raw.description,
    date: raw.date,
    activeCrescents: raw.priority ?? 0,  // backend calls it "priority"
    variant: raw.variant,
    completed: raw.completed,
    completedOn: raw.completedOn,
    summary: raw.summary,
    volunteersNeeded: raw.volunteersNeeded,
    tag:raw.tag,
  };
}

// ── GET /todos ─────────────────────────────────────────────────
// Fetches all tasks from the backend.
// Returns an array of Task objects.
export async function getAllTasks(): Promise<Task[]> {
  const response = await fetch(`${BASE_URL}/todos`);
  if (!response.ok) throw new Error("Failed to fetch tasks");
  const data = await response.json();
  return data.map(mapTask);
}

// ── POST /todos ────────────────────────────────────────────────
// Creates a new task.  The backend only needs the `description`;
// Gemini AI will generate the title, date, crescents, etc.
// Returns the newly-created Task.
export async function createTask(description: string): Promise<Task> {
  const response = await fetch(`${BASE_URL}/todos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ description }),
  });
  if (!response.ok) throw new Error("Failed to create task");
  const data = await response.json();
  return mapTask(data);
}

// ── PUT /todos/:id ─────────────────────────────────────────────
// Updates an existing task.
// Pass the task id and an object containing whatever fields you
// want to change (e.g. { completed: true } or the full task).
// Returns the updated Task.
export async function updateTask(
  id: number,
  updates: Partial<Omit<Task, "id">>
): Promise<Task> {
  // Re‑map activeCrescents → priority for the backend
  const body: Record<string, unknown> = { ...updates };
  if ("activeCrescents" in body) {
    body.priority = body.activeCrescents;
    delete body.activeCrescents;
  }

  const response = await fetch(`${BASE_URL}/todos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error("Failed to update task");
  const data = await response.json();
  return mapTask(data);
}

// ── DELETE /todos/:id ──────────────────────────────────────────
// Deletes a task by id.
// Returns true on success.
export async function deleteTask(id: number): Promise<boolean> {
  const response = await fetch(`${BASE_URL}/todos/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete task");
  return true;
}

// ── PUT /todos/:id/complete ──────────────────────────────────
// Specifically marks a task as complete using the new dedicated route.
export async function completeTask(id: number): Promise<Task> {
  const response = await fetch(`${BASE_URL}/todos/${id}/complete`, { method: "PUT" });
  if (!response.ok) throw new Error("Failed to complete task");
  return mapTask(await response.json());
}