'use client';

import { ArrowLeft, MoreVertical, Phone, Video } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { ConversationWithDetails } from '@/hooks/use-chat-data'; // Import the type
import { usePresenceStore } from '@/lib/store/presenceStore';
import { getInitials } from '@/lib/utils';
import { UserContext } from './user-context';

interface ChatHeaderProps {
  conversation: ConversationWithDetails | null; // Use the correct type
  onBack: () => void;
}

export function ChatHeader({ conversation, onBack }: ChatHeaderProps) {
  const { getUserById } = usePresenceStore();
  const otherUser = conversation?.user; // Change to conversation.user
  const isOtherUserOnline =
    otherUser && getUserById(otherUser?.id)?.status === 'online';
  console.log(otherUser);

  return (
    <div className='border-border/40 bg-background/95 supports-backdrop-filter:bg-background/60 flex-none border-b backdrop-blur'>
      <div className='flex items-center justify-between p-4'>
        <div className='flex items-center gap-3'>
          <Button
            variant='ghost'
            size='sm'
            onClick={onBack}
            className='hover:bg-accent rounded-full p-2 lg:hidden'
          >
            <ArrowLeft className='h-5 w-5' />
          </Button>

          <div className='flex items-center gap-3'>
            <div className='relative'>
              <Avatar className='border-background h-10 w-10 border-2 shadow-lg'>
                <AvatarImage src={otherUser?.image || undefined} />
                <AvatarFallback className='bg-linear-to-br from-blue-500 to-purple-600 text-xs font-medium text-white'>
                  {getInitials(otherUser?.name)}
                </AvatarFallback>
              </Avatar>
            </div>

            <div>
              <h2 className='text-foreground font-semibold'>
                {otherUser?.name || 'Unknown User'}
              </h2>
              <div className='flex items-center text-sm'>
                {getUserById(otherUser?.id as string) ? ( // Check if otherUser is found in presence
                  isOtherUserOnline ? (
                    <>
                      <div className='mr-2 h-2 w-2 rounded-full bg-emerald-500' />
                      <span className='text-emerald-600 dark:text-emerald-400'>
                        Online
                      </span>
                    </>
                  ) : (
                    <>
                      <div className='mr-2 h-2 w-2 rounded-full bg-gray-500' />
                      <span className='text-gray-600 dark:text-gray-400'>
                        Offline
                      </span>
                    </>
                  ) // If user is not in presence, assume offline or unknown
                ) : (
                  <>
                    <div className='mr-2 h-2 w-2 rounded-full bg-gray-500' />
                    <span className='text-gray-600 dark:text-gray-400'>
                      Offline
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className='flex items-center gap-1'>
          {/* Desktop buttons */}
          <div className='hidden items-center gap-1 lg:flex'>
            <Button
              variant='ghost'
              size='sm'
              className='hover:bg-accent rounded-full p-2'
            >
              <Phone className='h-5 w-5' />
            </Button>
            <Button
              variant='ghost'
              size='sm'
              className='hover:bg-accent rounded-full p-2'
            >
              <Video className='h-5 w-5' />
            </Button>
            <Button
              variant='ghost'
              size='sm'
              className='hover:bg-accent rounded-full p-2'
            >
              <MoreVertical className='h-5 w-5' />
            </Button>
          </div>

          {/* Mobile drawer */}
          <div className='lg:hidden'>
            <Drawer>
              <DrawerTrigger asChild>
                <Button
                  variant='ghost'
                  size='sm'
                  className='hover:bg-accent rounded-full p-2'
                >
                  <MoreVertical className='h-5 w-5' />
                </Button>
              </DrawerTrigger>
              <DrawerContent className='h-[90vh]'>
                <ScrollArea className='h-full'>
                  <DrawerHeader>
                    <DrawerTitle>Details & Actions</DrawerTitle>
                  </DrawerHeader>
                  <div className='space-y-4 p-4'>
                    <div className='grid grid-cols-2 gap-4'>
                      <Button
                        variant='outline'
                        size='lg'
                        className='h-24 flex-col'
                      >
                        <Phone className='mb-1 h-6 w-6' />
                        <span>Voice Call</span>
                      </Button>
                      <Button
                        variant='outline'
                        size='lg'
                        className='h-24 flex-col'
                      >
                        <Video className='mb-1 h-6 w-6' />
                        <span>Video Call</span>
                      </Button>
                    </div>
                    <div>
                      <div className='my-4 border-b border-border'>
                        <h2 className='pb-2 text-lg font-semibold'>
                          Customer Profile
                        </h2>
                      </div>
                      <UserContext />
                    </div>
                  </div>
                </ScrollArea>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </div>
    </div>
  );
}
