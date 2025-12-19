'use client';

import { ChevronRight, Home } from 'lucide-react'; // Modern icons
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';

export default function BreadCrumb() {
  const pathname = usePathname();
  const pathArray = pathname.split('/').filter((path) => path);

  // Helper to format text (e.g., 'user-settings' -> 'User Settings')
  const formatSegment = (path: string) =>
    decodeURIComponent(path)
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <header className=' flex h-14 shrink-0 items-center gap-2  bg-background/80 backdrop-blur-md transition-all px-4'>
      <div className='flex items-center gap-2'>
        <SidebarTrigger className='-ml-1 hover:bg-accent hover:text-accent-foreground transition-colors' />
        <Separator orientation='vertical' className='mr-2 h-4 opacity-50' />

        <Breadcrumb>
          <BreadcrumbList>
            {/* Home Icon Link */}
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  href='/'
                  className='flex items-center hover:text-primary transition-colors'
                >
                  <Home className='h-4 w-4' />
                  <span className='sr-only'>Home</span>
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            {pathArray.map((path, index) => {
              const href = `/${pathArray.slice(0, index + 1).join('/')}`;
              const isLast = index === pathArray.length - 1;

              return (
                <React.Fragment key={href}>
                  <BreadcrumbSeparator>
                    <ChevronRight className='h-3.5 w-3.5 opacity-60' />
                  </BreadcrumbSeparator>

                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage className='font-semibold text-foreground tracking-tight'>
                        {formatSegment(path)}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link
                          href={href}
                          className='hover:text-primary transition-colors capitalize'
                        >
                          {formatSegment(path)}
                        </Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </React.Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
}
