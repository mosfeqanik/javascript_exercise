import { notFound } from 'next/navigation';
import { api } from '@/lib/api';
import TaskForm from '@/components/TaskForm';

export const dynamic = 'force-dynamic';

// Server loads the existing task, then hands it to the client-side form.
export default async function EditTaskPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const task = await api.get(id).catch(() => null);
  if (!task) notFound();

  return (
    <>
      <h1>Edit task</h1>
      <TaskForm task={task} />
    </>
  );
}
