import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // 1. Fetch User Info, Wallet, and Pending Counts
    const userWithCounts = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        email: true,
        image: true,
        createdAt: true,
        emailVerified: true,
        wallet: {
          select: {
            balance: true,
            currency: true,
          },
        },
        _count: {
          select: {
            depositRequests: { where: { status: 'PENDING' } },
            withdrawalRequests: { where: { status: 'PENDING' } },
          },
        },
      },
    });

    if (!userWithCounts) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 2. Aggregate Transaction Totals (Deposits and Withdrawals)
    // We filter by 'COMPLETED' so pending/failed transactions don't inflate totals
    const financialTotals = await prisma.transaction.groupBy({
      by: ['type'],
      where: {
        userId: userId,
        status: 'COMPLETED',
      },
      _sum: {
        amount: true,
      },
    });

    // Helper to extract sum from the groupBy array
    const getSum = (type: 'DEPOSIT' | 'WITHDRAWAL') => {
      const record = financialTotals.find((t) => t.type === type);
      return record?._sum?.amount ? Number(record._sum.amount) : 0;
    };

    // 3. Construct flattened response
    const { _count, ...userInfo } = userWithCounts;

    return NextResponse.json({
      ...userInfo,
      pendingDeposits: _count.depositRequests,
      pendingWithdrawals: _count.withdrawalRequests,
      totalDeposited: getSum('DEPOSIT'),
      totalWithdrawn: getSum('WITHDRAWAL'),
    });
  } catch (error) {
    console.error('FETCH_USER_ERROR:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
