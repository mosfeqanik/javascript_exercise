'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { api, type Task } from '@/lib/api';

// Toggle / Edit / Delete buttons shown next to a task.
export default function TaskActions({ task, redirectAfterDelete }: { task: Task; redirectAfterDelete?: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handleToggle() {
    setBusy(true);
    try {
      await api.update(task.id, { completed: !task.completed });
      router.refresh(); // re-fetch server component data
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!confirm(`Delete "${task.title}"?`)) return;
    setBusy(true);
    try {
      await api.remove(task.id);
      if (redirectAfterDelete) router.push(redirectAfterDelete);
      router.refresh();
    } catch (err) {
      alert((err as Error).message);
      setBusy(false);
    }
  }

  return (
    <div className="actions">
      <button className="btn-secondary" disabled={busy} onClick={handleToggle}>
        {task.completed ? 'Undo' : 'Done'}
      </button>
      <Link className="btn" href={`/tasks/${task.id}/edit`}>Edit</Link>
      <button className="btn-danger" disabled={busy} onClick={handleDelete}>Delete</button>
    </div>
  );
}
