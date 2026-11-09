import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="card">
      <h2>Not found</h2>
      <Link href="/tasks">Back to tasks</Link>
    </div>
  );
}
