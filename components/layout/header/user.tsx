'use client';

import type { User } from 'better-auth';
import {
  Bell,
  LayoutDashboard,
  MessageSquare,
  Moon,
  Settings,
  Sun,
  UserIcon,
  Wallet,
} from 'lucide-react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import * as React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { useSession } from '@/lib/auth-client';
import { cn, getInitials } from '@/lib/utils';
import { useNotifications } from '@/services/common/notifications';
import { useUserBalance } from '@/services/user/wallet';
import { SignOut } from './logout';

function BalanceMenuItem() {
  const { data: balanceData, isPending } = useUserBalance();

  if (isPending) {
    return (
      <div className='flex w-full items-center justify-between'>
        <div className='flex items-center gap-2'>
          <Wallet className='h-4 w-4 text-muted-foreground' />
          <span>Balance</span>
        </div>
        <Skeleton className='h-4 w-12' />
      </div>
    );
  }

  const currency = balanceData?.currency === 'BDT' ? '৳' : '$';
  const balance = balanceData?.balance?.toFixed(2) ?? '0.00';

  return (
    <div className='flex w-full items-center justify-between'>
      <div className='flex items-center gap-2'>
        <Wallet className='h-4 w-4 text-muted-foreground' />
        <span>Balance</span>
      </div>
      <span className='font-semibold'>
        {currency} {balance}
      </span>
    </div>
  );
}

function ThemeToggleMenuItem() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenuItem
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      {theme === 'dark' ? (
        <Sun className='mr-2 h-4 w-4' />
      ) : (
        <Moon className='mr-2 h-4 w-4' />
      )}
      <span>Toggle Theme</span>
    </DropdownMenuItem>
  );
}

const LoggedInUserAvatar = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<'div'> & { user: User }
>(({ user, className, ...props }, ref) => {
  const { data: notifications } = useNotifications();
  const unreadCount =
    notifications?.filter((n: { isRead: boolean }) => !n.isRead).length ?? 0;

  return (
    <div className={cn('relative', className)} ref={ref} {...props}>
      <Avatar className='border-primary/20 hover:border-primary/40 h-9 w-9 cursor-pointer border-2 transition-all'>
        <AvatarImage
          src={user.image ?? undefined}
          alt={user.name || 'User avatar'}
        />
        <AvatarFallback className='bg-primary/10 text-primary'>
          {getInitials(user.name)}
        </AvatarFallback>
      </Avatar>
      {unreadCount > 0 && (
        <Badge
          variant='destructive'
          className='absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full p-0 text-xs shadow-sm'
        >
          {unreadCount > 9 ? '9+' : unreadCount}
        </Badge>
      )}
    </div>
  );
});
LoggedInUserAvatar.displayName = 'LoggedInUserAvatar';

export default function UserDropDown() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div>
        <Skeleton className='h-9 w-9 rounded-full' />
      </div>
    );
  }

  if (!session?.user) {
    return (
      <>
        {/* Desktop buttons */}
        <div className='hidden items-center gap-2 md:flex'>
          <Link href='/auth/signin'>
            <Button variant='outline'>Sign In</Button>
          </Link>
          <Link href='/auth/signup'>
            <Button>Sign Up</Button>
          </Link>
        </div>

        {/* Mobile dropdown */}
        <div className='md:hidden'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' size='icon' className='rounded-full'>
                <UserIcon className='h-5 w-5' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-48' align='end' forceMount>
              <DropdownMenuItem asChild>
                <Link href='/auth/signin' className='w-full'>
                  Sign In
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href='/auth/signup' className='w-full'>
                  Sign Up
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <ThemeToggleMenuItem />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </>
    );
  }

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <LoggedInUserAvatar user={session.user} />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className='w-56'
          align='end'
          forceMount
          sideOffset={8}
        >
          <DropdownMenuLabel className='font-normal'>
            <div className='flex flex-col space-y-1'>
              <p className='text-sm leading-none font-medium'>
                {session.user.name}
              </p>
              <p className='text-muted-foreground text-xs leading-none'>
                {session.user.email}
              </p>
            </div>
          </DropdownMenuLabel>

          {/* Mobile Only Section */}
          <div className='md:hidden'>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <BalanceMenuItem />
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href='/notifications'
                className='flex w-full items-center gap-2'
              >
                <Bell className='h-4 w-4' />
                <span>Notifications</span>
              </Link>
            </DropdownMenuItem>
            <ThemeToggleMenuItem />
          </div>

          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link
              href='/dashboard'
              className='flex w-full cursor-pointer items-center'
            >
              <LayoutDashboard className='text-primary/70 mr-2 h-4 w-4' />
              Dashboard
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link
              href='/chat'
              className='flex w-full cursor-pointer items-center justify-between'
            >
              <div className='flex items-center gap-2'>
                <MessageSquare className='text-primary/70 mr-2 h-4 w-4' />
                Messages
              </div>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href='/dashboard/profile/edit-profile'
              className='flex w-full cursor-pointer items-center'
            >
              <Settings className='text-primary/70 mr-2 h-4 w-4' />
              Edit Account
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href='/dashboard/profile'
              className='flex w-full cursor-pointer items-center'
            >
              <UserIcon className='text-primary/70 mr-2 h-4 w-4' />
              Account Details
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <SignOut />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
