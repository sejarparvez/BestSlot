import Ably from 'ably';
import type { ConversationDisplay } from '@/hooks/use-conversations';
import { prisma } from '@/lib/prisma';

if (!process.env.ABLY_API_KEY) {
  throw new Error('ABLY_API_KEY environment variable not set');
}

export const ably = new Ably.Rest({ key: process.env.ABLY_API_KEY });

/**
 * Fetches the full conversation details and publishes them to the relevant agent(s).
 * @param conversationId The ID of the conversation that was updated.
 */
export async function publishConversationUpdate(conversationId: string) {
  const updatedConversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: {
      user: {
        select: { id: true, name: true, image: true },
      },
      assignedTo: {
        select: { id: true, name: true, image: true },
      },
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
      _count: {
        select: {
          messages: {
            where: { isRead: false },
          },
        },
      },
    },
  });

  if (!updatedConversation) return;

  // The client expects a specific shape, so we ensure the payload matches.
  const payload: ConversationDisplay =
    updatedConversation as unknown as ConversationDisplay;

  if (updatedConversation.assignedToId) {
    // Notify the assigned agent
    const agentChannel = ably.channels.get(
      `agent:${updatedConversation.assignedToId}`,
    );
    await agentChannel.publish('new-conversation-update', payload);
  } else {
    // Notify all active admins about the unassigned conversation
    const admins = await prisma.user.findMany({
      where: { role: 'ADMIN', isActive: true },
      select: { id: true },
    });
    for (const admin of admins) {
      const agentChannel = ably.channels.get(`agent:${admin.id}`);
      await agentChannel.publish('new-conversation-update', payload);
    }
  }
}
