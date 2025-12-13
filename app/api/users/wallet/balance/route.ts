import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const wallet = await prisma.wallet.findUnique({
      where: { userId: session.user.id },
      select: {
        balance: true,
        lockedBalance: true,
        currency: true,
        updatedAt: true,
      },
    });

    if (!wallet) {
      // Create wallet if doesn't exist
      const newWallet = await prisma.wallet.create({
        data: {
          userId: session.user.id,
          balance: 0,
          lockedBalance: 0,
        },
        select: {
          balance: true,
          lockedBalance: true,
          currency: true,
          updatedAt: true,
        },
      });

      return NextResponse.json({
        balance: Number(newWallet.balance),
        lockedBalance: Number(newWallet.lockedBalance),
        currency: newWallet.currency,
        updatedAt: newWallet.updatedAt,
      });
    }

    return NextResponse.json({
      balance: Number(wallet.balance),
      lockedBalance: Number(wallet.lockedBalance),
      currency: wallet.currency,
      updatedAt: wallet.updatedAt,
    });
  } catch (error) {
    console.error('Error fetching wallet balance:', error);
    return NextResponse.json(
      { error: 'Failed to fetch balance' },
      { status: 500 },
    );
  }
}
