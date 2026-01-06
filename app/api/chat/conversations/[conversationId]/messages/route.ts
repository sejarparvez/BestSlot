import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { ably, publishConversationUpdate } from '@/lib/ably';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * Publishes the unread message count for a given user to their notification channel.
 * @param userId The ID of the user to notify.
 */
async function publishUnreadCountForUser(userId: string) {
  const unreadCount = await prisma.message.count({
    where: {
      isRead: false,
      senderId: {
        not: userId, // Message was not sent by the user
      },
      conversation: {
        // Conversation is one the user is part of
        OR: [{ userId: userId }, { assignedToId: userId }],
      },
    },
  });

  const notificationChannel = ably.channels.get(`notifications:${userId}`);
  await notificationChannel.publish('unread-count', { count: unreadCount });
}

/**
 * POST /api/chat/conversations/[conversationId]/messages
 * Sends a new message in a conversation.
 */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ conversationId: string }> },
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    const sender = session?.user;

    if (!sender?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { conversationId } = await params;
    const {
      content,
      type = 'TEXT',
      fileUrl,
      publicId,
      optimisticId,
    } = await req.json();

    if (!content && type === 'TEXT') {
      return NextResponse.json(
        { error: 'Message content is required for text messages' },
        { status: 400 },
      );
    }

    if (!fileUrl && type === 'IMAGE') {
      return NextResponse.json(
        { error: 'File URL is required for image messages' },
        { status: 400 },
      );
    }

    // 1. Verify that the user is part of the conversation (or is an admin)
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      select: { userId: true, status: true, assignedToId: true },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 },
      );
    }

    if (sender.role !== 'ADMIN' && conversation.userId !== sender.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (
      conversation.status === 'CLOSED' ||
      conversation.status === 'RESOLVED'
    ) {
      return NextResponse.json(
        { error: 'This conversation is closed.' },
        { status: 403 },
      );
    }

    // 2. Create the message in the database
    const newMessage = await prisma.message.create({
      data: {
        content,
        type,
        fileUrl,
        publicId,
        conversationId,
        senderId: sender.id,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true,
            role: true,
          },
        },
      },
    });

    // 3. Update the lastMessageAt timestamp on the conversation
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { lastMessageAt: new Date() },
    });

    // 4. Publish the message to the Ably channel, including optimisticId if present
    const channel = ably.channels.get(`chat:${conversationId}`);
    await channel.publish('new-message', { ...newMessage, optimisticId });

    // 5. Publish unread count and sidebar updates
    if (sender.role === 'ADMIN') {
      // Admin is sending, so notify the user who started the conversation
      await publishUnreadCountForUser(conversation.userId);
      // Also notify the sending admin so their other sessions update
      await publishConversationUpdate(conversationId);
    } else {
      // User is sending. Notify the assigned admin, or all admins if unassigned.
      if (conversation.assignedToId) {
        await publishUnreadCountForUser(conversation.assignedToId);
      } else {
        const admins = await prisma.user.findMany({
          where: { role: 'ADMIN', isActive: true },
          select: { id: true },
        });
        for (const admin of admins) {
          await publishUnreadCountForUser(admin.id);
        }
      }
      await publishConversationUpdate(conversationId);
    }

    return NextResponse.json(newMessage);
  } catch (error) {
    console.error('SEND_MESSAGE_ERROR:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
