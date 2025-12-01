'use client';

import type { User } from 'better-auth';
import { Calendar, Mail, Shield } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface ProfileInfoProps {
  user: User;
}

export function ProfileInfo({ user }: ProfileInfoProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className='space-y-4'>
      <h2 className='text-lg font-semibold'>Account Details</h2>

      {/* Email Card */}
      <Card className='p-4 space-y-2'>
        <div className='flex items-center gap-3'>
          <Mail className='w-5 h-5 text-accent' />
          <div className='flex-1'>
            <p className='text-sm text-muted-foreground'>Email Address</p>
            <p className='font-medium text-foreground break-all'>
              {user.email}
            </p>
          </div>
        </div>
      </Card>

      {/* Account Status Card */}
      <Card className='p-4 space-y-2'>
        <div className='flex items-center gap-3'>
          <Shield className='w-5 h-5 text-accent' />
          <div className='flex-1'>
            <p className='text-sm text-muted-foreground'>Account Status</p>
            <p className='font-medium text-foreground'>Active</p>
          </div>
        </div>
      </Card>

      {/* Member Since Card */}
      <Card className='p-4 space-y-2'>
        <div className='flex items-center gap-3'>
          <Calendar className='w-5 h-5 text-accent' />
          <div className='flex-1'>
            <p className='text-sm text-muted-foreground'>Member Since</p>
            <p className='font-medium text-foreground'>
              {formatDate(user.createdAt)}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
