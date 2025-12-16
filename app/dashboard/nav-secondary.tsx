'use client';

import type { Icon } from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type * as React from 'react';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

// Define the structure for Nav Item, consistent with NavMain
interface NavItem {
  title: string;
  url: string;
  // Use a more flexible type for the icon component
  icon: Icon | React.ElementType;
}

export function NavSecondary({
  items,
  ...props
}: {
  // Use the defined NavItem interface for the items array
  items: NavItem[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const pathname = usePathname();
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                data-state={pathname === item.url ? 'active' : 'inactive'}
                className='data-[state=active]:bg-primary/10'
              >
                <Link href={item.url}>
                  {/* Render the icon component */}
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
