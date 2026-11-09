import Link from 'next/link';
import { notFound } from 'next/navigation';
import { api } from '@/lib/api';
import TaskActions from '@/components/TaskActions';

export const dynamic = 'force-dynamic';

// Dynamic route: /tasks/123 -> params.id === "123"
export default async function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const task = await api.get(id).catch((e) => (e.status === 404 || e.status === 400 ? null : Promise.reject(e)));
  if (!task) notFound();

  return (
    <div className="card">
      <h1 className={task.completed ? 'done' : ''}>{task.title}</h1>
      <p>{task.description || <span className="muted">No description</span>}</p>
      <p className="muted">
        Status: {task.completed ? 'Completed' : 'Open'} · Created {new Date(task.createdAt).toLocaleString()}
      </p>
      <div className="row">
        <Link href="/tasks">← Back</Link>
        <TaskActions task={task} redirectAfterDelete="/tasks" />
      </div>
    </div>
  );
}
