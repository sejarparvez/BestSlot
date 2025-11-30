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
  { icon: Flame, label: 'HOT GAMES', url: '#' },
  { icon: Users, label: 'INVITE FRIENDS', url: '#' },
  { icon: Heart, label: 'FAVORITES', url: '#' },
  { icon: Gift, label: 'PROMOTION', url: '#' },
  { icon: Gamepad2, label: 'SLOTS', url: '#' },
  { icon: Trophy, label: 'REWARD CENTER', url: '#' },
  { icon: Radio, label: 'LIVE', url: '#' },
  { icon: BarChart3, label: 'MANUAL REBATE', url: '#' },
  { icon: Zap, label: 'SPORTS', url: '#' },
  { icon: Sticker, label: 'VIP', url: '#' },
  { icon: Dices, label: 'E-SPORTS', url: '#' },
  { icon: Target, label: 'MISSION', url: '#' },
  { icon: Sticker, label: 'POKER', url: '#' },
  { icon: Dices, label: 'ENGLISH', url: '#' },
  { icon: Target, label: 'FISH', url: '#' },
  { icon: Target, label: 'APP DOWNLOAD', url: '#' },
  { icon: Target, label: 'LOTTERY', url: '#' },
  { icon: Target, label: 'CUSTOMER SERVICE', url: '#' },
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
                className='flex flex-col items-center justify-center gap-2 p-4 rounded-lg bg-card border border-border hover:bg-accent hover:text-accent-foreground transition-all duration-200 group'
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
