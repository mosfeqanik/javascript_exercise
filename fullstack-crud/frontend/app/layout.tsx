import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = { title: 'Tasks CRUD', description: 'Next.js + NestJS + PostgreSQL' };

// Root layout wraps every route (shared header/nav).
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header>
          <Link href="/tasks">Tasks</Link>
          <Link href="/tasks/new">+ New Task</Link>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
