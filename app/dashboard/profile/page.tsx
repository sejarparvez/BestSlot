import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import Header from '@/components/layout/header';
import { auth } from '@/lib/auth';
import { ProfileActions } from './profile-action';
import { ProfileHeader } from './profile-header';
import { ProfileInfo } from './profile-info';

export default async function Profile() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/auth/login');
  }

  return (
    <main className='min-h-screen bg-background'>
      <Header />
      <div className='container mx-auto max-w-3xl mt-12 px-4 py-12 space-y-8'>
        {/* Profile Header with Avatar and Basic Info */}
        <ProfileHeader user={session.user} />

        {/* Profile Information Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <ProfileInfo user={session.user} />
          <ProfileActions user={session.user} />
        </div>
      </div>
    </main>
  );
}
