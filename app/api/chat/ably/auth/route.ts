import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { ably } from '@/lib/ably';
import { auth } from '@/lib/auth';

/**
 * GET /api/chat/ably/auth
 * Authenticates the client with Ably to receive a token.
 * This is called by the client-side Ably SDK.
 */
export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // The clientId should be unique for each user. We use their userId.
    const tokenRequest = await ably.auth.createTokenRequest({
      clientId: session.user.id,
    });

    return NextResponse.json(tokenRequest);
  } catch (error) {
    console.error('ABLY_AUTH_ERROR:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
