import Link from 'next/link';

import { SidebarTrigger } from '@/components/ui/sidebar';

export default function HeaderClient({
  sidebarOpen = false,
}: {
  sidebarOpen?: boolean;
}) {
  return (
    <div className='flex items-center'>
      {/* Logo */}
      <Link href='/' className='flex items-center gap-1.5'>
        {sidebarOpen && <SidebarTrigger className='-ml-1' />}

        <h1 className='text-2xl font-bold tracking-tight md:text-2xl'>
          <span className='from-primary to-primary/70 bg-linear-to-r bg-clip-text text-transparent'>
            Best
          </span>
          <span className='font-medium'>Slot</span>
        </h1>
      </Link>
    </div>
  );
}
