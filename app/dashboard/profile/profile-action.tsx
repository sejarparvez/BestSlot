'use client';

import type { User } from 'better-auth';
import { Edit2, Lock, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProfileActionsProps {
  user: User;
}

// biome-ignore lint/correctness/noUnusedFunctionParameters: error
export function ProfileActions({ user }: ProfileActionsProps) {
  return (
    <div className='space-y-4'>
      <h2 className='text-lg font-semibold'>Settings</h2>

      {/* Edit Profile Button */}
      <Button
        variant='outline'
        className='w-full justify-start h-auto p-4 space-x-3 bg-transparent'
      >
        <Edit2 className='w-5 h-5 text-accent shrink-0' />
        <div className='text-left flex-1'>
          <p className='font-medium'>Edit Profile</p>
          <p className='text-xs text-muted-foreground'>
            Update your name and information
          </p>
        </div>
      </Button>

      {/* Change Password Button */}
      <Button
        variant='outline'
        className='w-full justify-start h-auto p-4 space-x-3 bg-transparent'
      >
        <Lock className='w-5 h-5 text-accent shrink-0' />
        <div className='text-left flex-1'>
          <p className='font-medium'>Change Password</p>
          <p className='text-xs text-muted-foreground'>
            Keep your account secure
          </p>
        </div>
      </Button>

      {/* Logout Button */}
      <Button
        variant='outline'
        className='w-full justify-start h-auto p-4 space-x-3 text-destructive hover:text-destructive bg-transparent'
      >
        <LogOut className='w-5 h-5 shrink-0' />
        <div className='text-left flex-1'>
          <p className='font-medium'>Sign Out</p>
          <p className='text-xs text-muted-foreground'>
            Logout from your account
          </p>
        </div>
      </Button>
    </div>
  );
}
