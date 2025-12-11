import {
  BarChart3,
  Dices,
  Flame,
  Gamepad2,
  Gift,
  Heart,
  Radio,
  Sticker,
  Target,
  Trophy,
  Users,
  Zap,
} from 'lucide-react';
import type React from 'react';
import { Sidebar, SidebarContent, SidebarRail } from '@/components/ui/sidebar';

const menuItems = [
  { icon: Flame, label: 'Hot Games', url: '#' },
  { icon: Users, label: 'Invite Friends', url: '#' },
  { icon: Heart, label: 'Favorites', url: '#' },
  { icon: Gift, label: 'Promotion', url: '#' },
  { icon: Gamepad2, label: 'Slots', url: '#' },
  { icon: Trophy, label: 'Reward Center', url: '#' },
  { icon: Radio, label: 'Live', url: '#' },
  { icon: BarChart3, label: 'Manual Rebate', url: '#' },
  { icon: Zap, label: 'Sports', url: '#' },
  { icon: Sticker, label: 'Vip', url: '#' },
  { icon: Dices, label: 'E-Sports', url: '#' },
  { icon: Target, label: 'Mission', url: '#' },
  { icon: Sticker, label: 'Poker', url: '#' },
  { icon: Dices, label: 'English', url: '#' },
  { icon: Target, label: 'Fish', url: '#' },
  { icon: Target, label: 'App Download', url: '#' },
  { icon: Target, label: 'Lottery', url: '#' },
  { icon: Target, label: 'Customer Service', url: '#' },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props} className='mt-20 h-[calc(100vh-5rem)]'>
      <SidebarContent className='p-4'>
        <div className='grid grid-cols-2 gap-3'>
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.label}
                href={item.url}
                className='flex flex-col items-center justify-center gap-2 p-3 md:p-4 rounded-lg bg-card border border-border hover:bg-accent hover:text-accent-foreground transition-all duration-200 group'
              >
                <Icon className='w-6 h-6 transition-colors' />
                <span className='text-xs font-semibold text-center leading-tight'>
                  {item.label}
                </span>
              </a>
            );
          })}
        </div>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
