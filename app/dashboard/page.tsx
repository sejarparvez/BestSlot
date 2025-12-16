import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { ChartAreaInteractive } from './chart-area-interactive';
import data from './data.json';
import { DataTable } from './data-table';
import { SectionCards } from './section-cards';

export default async function Dashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/auth/login');
  }
  if (session.user.role === 'ADMIN') {
    return (
      <div className='px-4 md:px-6 py-4'>
        <h1>Admin Dashboard</h1>
      </div>
    );
  }
  return (
    <div className='flex flex-1 flex-col'>
      <div className='@container/main flex flex-1 flex-col gap-2'>
        <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
          <SectionCards />
          <div className='px-4 lg:px-6'>
            <ChartAreaInteractive />
          </div>
          <DataTable data={data} />
        </div>
      </div>
    </div>
  );
}
