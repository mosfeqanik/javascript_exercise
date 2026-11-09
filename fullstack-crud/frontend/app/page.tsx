import { redirect } from 'next/navigation';

// "/" -> "/tasks"
export default function Home() {
  redirect('/tasks');
}
