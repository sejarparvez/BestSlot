import type { Message } from '@/lib/generated/prisma/client';
import type Ably from 'ably';
import { useCallback, useEffect, useRef, useState } from 'react';

// Define the extended message type
type MessageWithSender = Message & {
  sender: {
    id: string;
    name: string | null;
    image: string | null;
    role: string;
  };
};

interface UseChatMessagesProps {
  conversationId: string;
  session: any; // Recommendation: Replace with your actual Session type
  ably: Ably.Realtime | null;
  isConnected: boolean;
  initialMessages: MessageWithSender[];
}

export function useChatMessages({
  conversationId,
  session,
  ably,
  isConnected,
  initialMessages,
}: UseChatMessagesProps) {
  const [messages, setMessages] =
    useState<MessageWithSender[]>(initialMessages);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Sync initial messages safely.
  // We use the length and the ID of the last message as a heuristic to avoid
  // infinite loops caused by referential instability of the initialMessages array.
  const syncKey = `${initialMessages.length}-${initialMessages[initialMessages.length - 1]?.id}`;
  useEffect(() => {
    setMessages(initialMessages);
  }, [syncKey]);

  // 2. Ably Subscription Effect
  useEffect(() => {
    if (!ably || !isConnected || !conversationId) return;

    const channel = ably.channels.get(`chat:${conversationId}`);

    const handleNewMessage = (message: Ably.Message) => {
      const incomingMessage = message.data as MessageWithSender;

      // Use functional update to access current state without adding 'messages' to dependencies
      setMessages((prev) => {
        const exists = prev.some((m) => m.id === incomingMessage.id);
        if (exists) return prev;
        return [...prev, incomingMessage];
      });
    };

    const handleTyping = (message: Ably.Message) => {
      const { userId, isTyping: typingStatus } = message.data;

      // Ignore our own typing events
      if (userId === session?.user?.id) return;

      setIsTyping(typingStatus);

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Auto-clear typing indicator if the user stops sending events
      if (typingStatus) {
        typingTimeoutRef.current = setTimeout(() => {
          setIsTyping(false);
        }, 3000);
      }
    };

    channel.subscribe('new-message', handleNewMessage);
    channel.subscribe('typing', handleTyping);

    return () => {
      channel.unsubscribe('new-message', handleNewMessage);
      channel.unsubscribe('typing', handleTyping);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
    // messages is removed from here to prevent re-subscribing on every single message
  }, [ably, isConnected, conversationId, session?.user?.id]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || !conversationId || !session?.user) {
        return;
      }

      setIsLoading(true);
      setError(null);

      const optimisticId = window.crypto.randomUUID();
      const optimisticMessage: MessageWithSender = {
        id: optimisticId,
        content: content,
        createdAt: new Date(),
        updatedAt: new Date(),
        conversationId: conversationId,
        senderId: session.user.id,
        isRead: false,
        readAt: null,
        type: 'TEXT',
        fileUrl: null,
        fileName: null,
        fileSize: null,
        sender: {
          id: session.user.id,
          name: session.user.name,
          image: session.user.image,
          role: 'ADMIN',
        },
      };

      // Apply optimistic update
      setMessages((prev) => [...prev, optimisticMessage]);

      try {
        const response = await fetch(
          `/api/chat/conversations/${conversationId}/messages`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content }),
          },
        );

        if (!response.ok) throw new Error('Failed to send');
      } catch (e) {
        setError('Failed to send message.');
        // Remove the optimistic message on failure
        setMessages((prev) => prev.filter((m) => m.id !== optimisticId));
      } finally {
        setIsLoading(false);
      }
    },
    [
      conversationId,
      session?.user?.id,
      session?.user?.name,
      session?.user?.image,
    ],
  );

  const retryMessage = useCallback(async (messageId: string) => {
    // Logic for retrying would go here
    console.log(`Retrying message ${messageId}`);
  }, []);

  return {
    messages,
    isTyping,
    sendMessage,
    retryMessage,
    isLoading,
    error,
  };
}
