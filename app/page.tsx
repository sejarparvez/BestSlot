import { AppSidebar } from '@/components/app-sidebar';
import Header from '@/components/layout/header';

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export default function Page() {
  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as React.CSSProperties
      }
    >
      <Header sidebarOpen />
      <AppSidebar />
      <SidebarInset className='pt-20'>
        <div className='flex flex-1 flex-col'>
          <h1 className='text-5xl font-extrabold text-primary'>Hello World!</h1>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
