// Tiny typed client for the NestJS API. Used by both server and client components.
export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

export type Task = {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
};

export type TaskInput = Pick<Task, 'title' | 'description' | 'completed'>;

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    cache: 'no-store', // always fresh data (no Next.js fetch caching)
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const msg = Array.isArray(body.message) ? body.message.join(', ') : body.message;
    const err = new Error(msg ?? `Request failed: ${res.status}`) as Error & { status?: number };
    err.status = res.status;
    throw err;
  }
  return (res.status === 204 ? undefined : await res.json()) as T;
}

export const api = {
  list: () => request<Task[]>('/tasks'),
  get: (id: number | string) => request<Task>(`/tasks/${id}`),
  create: (data: TaskInput) =>
    request<Task>('/tasks', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: Partial<TaskInput>) =>
    request<Task>(`/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  remove: (id: number) => request<void>(`/tasks/${id}`, { method: 'DELETE' }),
};
