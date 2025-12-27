'use client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { signOut } from '@/lib/auth-client';
import { cn, getInitials } from '@/lib/utils';
import { useUserProfile } from '@/services/user/profile';
import {
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle2,
  Fingerprint,
  Lock,
  LogOut,
  ShieldCheck,
  User,
  Wallet,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function MyAccountPage() {
  const { isPending, data, isError } = useUserProfile();
  const router = useRouter();

  if (isPending) return <MyAccountSkeleton />;

  if (isError || !data) {
    return (
      <div className='flex h-40 items-center justify-center text-destructive font-medium'>
        Error loading profile. Please try again later.
      </div>
    );
  }

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/');
        },
      },
    });
  };

  return (
    <div className='px-4'>
      <Card className='overflow-hidden border-none shadow-md '>
        <CardContent className='grid grid-cols-1 md:grid-cols-3 gap-0 p-0'>
          {/* --- Column 1: Profile & Status --- */}
          <div className='p-6 space-y-6 border-r'>
            <div className='flex items-center gap-4'>
              <Avatar className='h-16 w-16 border-2 border-primary/10 shadow-sm'>
                <AvatarImage
                  src={data.image || undefined}
                  alt={data.name || 'User'}
                />
                <AvatarFallback className='bg-primary/5 text-primary text-lg font-bold'>
                  {getInitials(data.name || '')}
                </AvatarFallback>
              </Avatar>
              <div className='flex-1 min-w-0'>
                <div className='flex items-center gap-1.5 mb-0.5'>
                  <h2 className='text-lg font-bold leading-none truncate uppercase tracking-tight'>
                    {data.name}
                  </h2>
                  {data.emailVerified && (
                    <CheckCircle2 className='size-4 text-emerald-500 shrink-0' />
                  )}
                </div>
                <p className='text-sm text-muted-foreground truncate'>
                  {data.email}
                </p>
              </div>
            </div>

            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <h3 className='text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]'>
                  Activity Overview
                </h3>
                <Badge
                  variant='outline'
                  className='text-[10px] font-bold h-5 px-1.5 py-0 uppercase'
                >
                  Pending
                </Badge>
              </div>

              <div className='grid grid-cols-2 gap-3 md:grid-cols-1'>
                <StatCard
                  label='Deposits'
                  count={data.pendingDeposits}
                  icon={<ArrowDownLeft className='size-3.5 text-emerald-500' />}
                  activeColor='border-l-emerald-500 bg-emerald-50/50 dark:bg-emerald-500/5'
                />
                <StatCard
                  label='Withdrawals'
                  count={data.pendingWithdrawals}
                  icon={<ArrowUpRight className='size-3.5 text-orange-500' />}
                  activeColor='border-l-orange-500 bg-orange-50/50 dark:bg-orange-500/5'
                />
              </div>
            </div>
          </div>

          {/* --- Column 2: Financial Summary --- */}
          <div className='p-6 border-r border-slate-200 dark:border-slate-800 space-y-6'>
            <div className='flex items-center justify-between'>
              <h3 className='text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]'>
                Wallet Balance
              </h3>
              <Badge className='bg-emerald-500/10 text-emerald-600 border-none hover:bg-emerald-500/20'>
                Active
              </Badge>
            </div>

            <div className='space-y-1'>
              <p className='text-4xl font-black tracking-tighter'>
                {data.wallet.currency === 'BDT' ? '৳' : '$'}{' '}
                {data.wallet.balance}
              </p>
              <div className='flex items-center gap-1 text-xs font-medium text-emerald-500'>
                <ArrowUpRight className='size-3' />
                <span>+12.5% this month</span>
              </div>
            </div>

            <div className='pt-4 space-y-3'>
              <div className='flex justify-between items-center text-sm'>
                <span className='text-muted-foreground'>Total Deposit</span>
                <span className='font-bold'>৳ {data.totalDeposited}</span>
              </div>
              <div className='flex justify-between items-center text-sm'>
                <span className='text-muted-foreground'>Total Withdraw</span>
                <span className='font-bold'>
                  ৳ {data.totalWithdrawals || 0}
                </span>
              </div>
            </div>

            <div className='grid grid-cols-2 gap-2 pt-2'>
              <Link href='/dashboard/deposit'>
                <Button className='w-full'>Deposit</Button>
              </Link>
              <Link href='/dashboard/withdraw'>
                <Button variant='outline' className='w-full'>
                  Withdraw
                </Button>
              </Link>
            </div>
          </div>

          {/* --- Column 3: Actions & Security (Matching Image) --- */}
          <div className='p-6 space-y-6'>
            <h3 className='text-sm font-bold text-foreground/80'>
              Actions & Security
            </h3>

            <div className='space-y-5'>
              <Dialog>
                <form>
                  <DialogTrigger asChild>
                    <div>
                      <ActionItem
                        icon={<User className='text-white size-5' />}
                        iconBg='bg-yellow-400 '
                        title='Personal Information'
                        description='Complete your profile to improve security.'
                        isVerified
                      />
                    </div>
                  </DialogTrigger>
                  <DialogContent className='sm:max-w-[425px]'>
                    <DialogHeader>
                      <DialogTitle>Edit profile</DialogTitle>
                      <DialogDescription>
                        Make changes to your profile here. Click save when
                        you&apos;re done.
                      </DialogDescription>
                    </DialogHeader>
                    <div className='grid gap-4'>
                      <div className='grid gap-3'>
                        <Label htmlFor='name-1'>Name</Label>
                        <Input
                          id='name-1'
                          name='name'
                          defaultValue='Pedro Duarte'
                        />
                      </div>
                      <div className='grid gap-3'>
                        <Label htmlFor='username-1'>Username</Label>
                        <Input
                          id='username-1'
                          name='username'
                          defaultValue='@peduarte'
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant='outline'>Cancel</Button>
                      </DialogClose>
                      <Button type='submit'>Save changes</Button>
                    </DialogFooter>
                  </DialogContent>
                </form>
              </Dialog>

              <ActionItem
                icon={<Lock className='text-white size-5' />}
                iconBg='bg-cyan-400 '
                title='Login Password'
                description='Recommended password with symbols.'
                isVerified
              />
              <ActionItem
                icon={<Wallet className='text-white size-5' />}
                iconBg='bg-pink-500 '
                title='Bind E-wallet'
                description='Bind E-wallet for withdrawal.'
                isVerified
              />
              <ActionItem
                icon={<ShieldCheck className='text-white size-5' />}
                iconBg='bg-amber-600/80 '
                title='Transaction Password'
                description='Used to verify your identity.'
                isVerified
              />
              <ActionItem
                icon={<Fingerprint className='text-white size-5' />}
                iconBg='bg-emerald-500 '
                title='Flex 2-FA'
                description='Extra layer of account protection.'
                isVerified
              />

              {/* Trigger the Logout Dialog using the ActionItem */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <div>
                    <ActionItem
                      icon={<LogOut className='text-white size-5' />}
                      iconBg='bg-red-500'
                      title='Sign Out'
                      description='Sign out safely from session.'
                    />
                  </div>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you sure you want to sign out?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      You will need to sign in again to access your dashboard
                      and wallet.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleSignOut}
                      className='bg-red-500 hover:bg-red-600'
                    >
                      Sign Out
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ActionItem({
  icon,
  iconBg,
  title,
  description,
}: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  description: string;
  isVerified?: boolean;
  hideCheck?: boolean;
}) {
  return (
    <div className='flex items-start gap-4 group cursor-pointer'>
      <div
        className={cn(
          'flex items-center justify-center size-10 rounded-full shrink-0 shadow-lg transition-transform group-hover:scale-110',
          iconBg,
        )}
      >
        {icon}
      </div>
      <div className='flex-1 min-w-0 border-b  pb-3'>
        <div className='flex items-center gap-2'>
          <h4 className='text-sm font-bold '>{title}</h4>
        </div>
        <p className='text-xs text-muted-foreground line-clamp-1'>
          {description}
        </p>
      </div>
    </div>
  );
}

function StatCard({
  label,
  count,
  icon,
  activeColor,
}: {
  label: string;
  count: number;
  icon: React.ReactNode;
  activeColor: string;
}) {
  const hasItems = count > 0;
  return (
    <div
      className={cn(
        'flex flex-col p-3 rounded-md border transition-all',
        hasItems ? cn('border-l-4', activeColor) : 'opacity-60 grayscale-[0.5]',
      )}
    >
      <div className='flex items-center gap-2 mb-1'>
        {icon}
        <span className='text-[11px] font-bold uppercase tracking-wider'>
          {label}
        </span>
      </div>
      <div className='flex items-baseline justify-between'>
        <span className='text-2xl font-bold tracking-tight'>{count}</span>
        <span className='text-[10px] text-muted-foreground font-medium italic'>
          {hasItems ? 'Processing...' : 'Clear'}
        </span>
      </div>
    </div>
  );
}

function MyAccountSkeleton() {
  return (
    <div className='px-4'>
      <Card className='overflow-hidden'>
        <CardContent className='grid grid-cols-1 md:grid-cols-3 gap-0 p-0'>
          <div className='p-6 space-y-6 border-r'>
            <div className='flex items-center gap-4'>
              <Skeleton className='h-16 w-16 rounded-full' />
              <div className='space-y-2 flex-1'>
                <Skeleton className='h-5 w-3/4' />
                <Skeleton className='h-4 w-1/2' />
              </div>
            </div>
            <div className='space-y-3'>
              <Skeleton className='h-20 w-full rounded-md' />
              <Skeleton className='h-20 w-full rounded-md' />
            </div>
          </div>
          <div className='p-6 border-r'>
            <Skeleton className='h-full w-full min-h-[300px]' />
          </div>
          <div className='p-6'>
            <Skeleton className='h-full w-full min-h-[300px]' />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
