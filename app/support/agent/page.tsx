import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getInitials } from '@/lib/utils';
import { format, isThisWeek, isToday, isYesterday } from 'date-fns';
import { ChevronLeft, MessageCircle, Search } from 'lucide-react';
import { headers } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';

interface User {
  id: string;
  name: string;
  image: string | null;
}

interface MessageForPreview {
  id: string;
  senderId: string;
  content: string;
  createdAt: Date;
}

interface ConversationDisplay {
  id: string;
  userId: string;
  user: User;
  assignedToId: string | null;
  assignedTo: User | null;
  lastMessageAt: Date;
  status: string;
  priority: string;
  messages: MessageForPreview[];
}

export default async function ChatIndexPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (
    !session ||
    !session.user ||
    !session.user.id ||
    !session.user.role ||
    session.user.role !== 'ADMIN'
  ) {
    redirect('/api/auth/signin');
  }

  const currentUserId = session.user.id;

  let conversations: ConversationDisplay[] = [];
  let error: string | null = null;

  try {
    conversations = (await prisma.conversation.findMany({
      where: {
        // Show all open and in-progress conversations
        status: {
          in: ['OPEN', 'IN_PROGRESS'],
        },
        // Alternative filters you can use:
        // Show only conversations assigned to current admin:
        // assignedToId: currentUserId,

        // Show only unassigned conversations:
        // assignedToId: null,

        // Show all conversations (remove status filter):
        // (no where clause needed)
      },
      include: {
        user: {
          select: { id: true, name: true, image: true },
        },
        assignedTo: {
          select: { id: true, name: true, image: true },
        },
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
          select: { id: true, senderId: true, content: true, createdAt: true },
        },
      },
      orderBy: {
        lastMessageAt: 'desc',
      },
    })) as ConversationDisplay[];
    // biome-ignore lint: error
  } catch (err) {
    error = 'Failed to fetch conversations. Please try again later.';
  }

  const getRecipient = (conv: ConversationDisplay) => {
    return conv.user; // Always return the user who started the conversation
  };

  const formatTime = (date: Date) => {
    if (isToday(date)) {
      return format(date, 'HH:mm');
    } else if (isYesterday(date)) {
      return 'Yesterday';
    } else if (isThisWeek(date)) {
      return format(date, 'EEE');
    } else {
      return format(date, 'MMM d');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return 'bg-red-500';
      case 'HIGH':
        return 'bg-orange-500';
      case 'NORMAL':
        return 'bg-blue-500';
      case 'LOW':
        return 'bg-gray-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <div className='container mx-auto flex h-full flex-col'>
      {/* Mobile Header */}
      <div className='border-border/40 bg-background/95 supports-backdrop-filter:bg-background/60 border-b backdrop-blur lg:hidden'>
        <div className='flex items-center justify-between px-4 py-3'>
          <div className='flex items-center gap-2'>
            <Link href='/'>
              <Button size='icon' variant='outline'>
                <ChevronLeft className='h-4 w-4' />
              </Button>
            </Link>

            <h1 className='text-foreground text-lg font-semibold'>
              Support Messages
            </h1>
          </div>
        </div>

        <div className='px-4 pb-3'>
          <div className='relative'>
            <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
            <Input
              placeholder='Search conversations...'
              className='bg-muted/50 focus-visible:ring-ring h-9 border-0 pl-9 focus-visible:ring-1'
            />
          </div>
        </div>
      </div>

      {/* Desktop Welcome Message */}
      <div className='hidden h-full flex-col items-center justify-center lg:flex'>
        <div className='mx-auto max-w-md space-y-4 p-8 text-center'>
          <div className='mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-purple-600 shadow-lg'>
            <MessageCircle className='h-10 w-10 text-white' />
          </div>
          <div className='space-y-2'>
            <h2 className='text-foreground text-2xl font-bold'>Support Chat</h2>
            <p className='text-muted-foreground'>
              Select a conversation from the sidebar to start helping users, or
              wait for new support requests.
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Conversation List */}
      <div className='flex-1 overflow-hidden lg:hidden'>
        <ScrollArea className='h-full'>
          {error && (
            <div className='border-destructive/20 bg-destructive/10 mx-4 mb-4 rounded-lg border p-3'>
              <p className='text-destructive text-sm'>{error}</p>
            </div>
          )}

          {conversations.length === 0 ? (
            <div className='flex h-64 flex-col items-center justify-center p-6 text-center'>
              <div className='mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-purple-600 shadow-lg'>
                <MessageCircle className='h-8 w-8 text-white' />
              </div>
              <h3 className='text-foreground mb-2 text-lg font-semibold'>
                No active conversations
              </h3>
              <p className='text-muted-foreground mb-4 text-sm'>
                All support requests have been resolved
              </p>
            </div>
          ) : (
            <div className='flex flex-col gap-1 p-2'>
              {conversations.map((conv) => {
                const recipient = getRecipient(conv);
                const lastMessage = conv.messages[0];
                const isAssignedToMe = conv.assignedToId === currentUserId;
                const isUnassigned = !conv.assignedToId;
                const hasUnread =
                  lastMessage && lastMessage.senderId !== currentUserId;

                return (
                  <Link key={conv.id} href={`/chat/${conv.id}`}>
                    <div className='hover:bg-muted/50 rounded-lg p-3 transition-colors'>
                      <div className='flex items-start space-x-3'>
                        <div className='relative'>
                          <Avatar className='border-background h-12 w-12 border-2 shadow-sm'>
                            <AvatarImage
                              src={recipient.image || undefined}
                              alt={recipient.name || 'User'}
                            />
                            <AvatarFallback className='bg-linear-to-br from-blue-500 to-purple-600 font-semibold text-white'>
                              {getInitials(recipient.name || 'U')}
                            </AvatarFallback>
                          </Avatar>
                          {/* Assignment indicator */}
                          {isAssignedToMe && (
                            <div className='absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-background' />
                          )}
                          {isUnassigned && (
                            <div className='absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-yellow-500 border-2 border-background' />
                          )}
                        </div>

                        <div className='min-w-0 flex-1'>
                          <div className='mb-1 flex items-center justify-between gap-2'>
                            <div className='flex items-center gap-2 min-w-0'>
                              <h3 className='text-foreground truncate font-semibold'>
                                {recipient.name || 'Unknown User'}
                              </h3>
                              {/* Priority indicator */}
                              {conv.priority !== 'NORMAL' && (
                                <span
                                  className={`${getPriorityColor(conv.priority)} h-2 w-2 rounded-full shrink-0`}
                                />
                              )}
                            </div>
                            <div className='flex items-center space-x-2 shrink-0'>
                              <span className='text-muted-foreground text-xs'>
                                {formatTime(conv.lastMessageAt)}
                              </span>
                              {hasUnread && (
                                <div className='h-2 w-2 rounded-full bg-blue-500' />
                              )}
                            </div>
                          </div>

                          <div className='flex items-center justify-between gap-2'>
                            {lastMessage && (
                              <p className='text-muted-foreground line-clamp-1 truncate text-sm flex-1'>
                                {lastMessage.senderId === currentUserId && (
                                  <span className='text-muted-foreground/70'>
                                    You:{' '}
                                  </span>
                                )}
                                {lastMessage.content}
                              </p>
                            )}

                            {/* Assignment badge */}
                            {conv.assignedTo && (
                              <span className='text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground ml-2 shrink-0'>
                                {conv.assignedTo.name}
                              </span>
                            )}
                            {isUnassigned && (
                              <span className='text-xs bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 px-2 py-0.5 rounded-full ml-2 shrink-0'>
                                Unassigned
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}
