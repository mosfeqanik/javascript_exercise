import Link from 'next/link';
import { api } from '@/lib/api';
import TaskActions from '@/components/TaskActions';

// Server Component: runs on the Next.js server, fetches from NestJS, sends HTML.
// dynamic = always render on request (data changes often, so no static build).
export const dynamic = 'force-dynamic';

export default async function TasksPage() {
  const tasks = await api.list();

  return (
    <>
      <h1>Tasks ({tasks.length})</h1>
      {tasks.length === 0 && <p className="muted">No tasks yet. Create one!</p>}
      {tasks.map((t) => (
        <div key={t.id} className="card row">
          <Link href={`/tasks/${t.id}`} className={t.completed ? 'done' : ''}>
            {t.title}
          </Link>
          <TaskActions task={t} />
        </div>
      ))}
    </>
  );
}
