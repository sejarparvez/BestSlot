import { DeleteImage } from '@/cloudinary/delete-image';
import { ably } from '@/lib/ably';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';

export async function DELETE(
  _req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ messageId: string }>;
  },
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    const user = session?.user;

    if (user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { messageId } = await params;

    const message = await prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }

    console.log(message);

    if (message.publicId) {
      await DeleteImage(message.publicId);
    }

    await prisma.message.delete({
      where: { id: messageId },
    });

    const channel = ably.channels.get(`chat:${message.conversationId}`);
    await channel.publish('message-deleted', { messageId });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE_MESSAGE_ERROR:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
