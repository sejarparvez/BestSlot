import Header from '@/components/layout/header';
import { AppSidebar } from '@/components/layout/header/app-sidebar';

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import PageContent from './page-content';

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
        <PageContent />
      </SidebarInset>
    </SidebarProvider>
  );
}
