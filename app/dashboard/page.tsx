import { headers } from 'next/headers';
import { auth } from '@/lib/auth';

export default async function ServerComponent() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return <div>Not authenticated</div>;
  }

  if (session.user.role === 'ADMIN') {
    return (
      <div>
        <h1>Admin Dashboard</h1>
      </div>
    );
  }

  return (
    <div>
      <h1>Welcome {session.user.name}</h1>
    </div>
  );
}
