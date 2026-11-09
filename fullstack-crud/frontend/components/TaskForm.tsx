'use client';
// Client Component: needs state + event handlers, so it runs in the browser.

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, type Task } from '@/lib/api';

export default function TaskForm({ task }: { task?: Task }) {
  const router = useRouter();
  const isEdit = Boolean(task);

  const [title, setTitle] = useState(task?.title ?? '');
  const [description, setDescription] = useState(task?.description ?? '');
  const [completed, setCompleted] = useState(task?.completed ?? false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const data = { title, description, completed };
      const saved = isEdit ? await api.update(task!.id, data) : await api.create(data);
      router.push(`/tasks/${saved.id}`);
      router.refresh(); // re-run server components so lists show fresh data
    } catch (err) {
      setError((err as Error).message);
      setSaving(false);
    }
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <label>
        Title
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required maxLength={200} />
      </label>
      <label>
        Description
        <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
      </label>
      <label>
        <input type="checkbox" checked={completed} onChange={(e) => setCompleted(e.target.checked)} /> Completed
      </label>
      {error && <p className="error">{error}</p>}
      <div className="actions">
        <button type="submit" disabled={saving}>{saving ? 'Saving…' : isEdit ? 'Update' : 'Create'}</button>
        <button type="button" className="btn-secondary" onClick={() => router.back()}>Cancel</button>
      </div>
    </form>
  );
}
