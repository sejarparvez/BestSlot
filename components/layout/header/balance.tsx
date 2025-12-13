'use client';

import { IconRefresh } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useSession } from '@/lib/auth-client';
import { useUserBalance } from '@/services/user/wallet'; // Assuming this hook fetches the data structure above

// Helper function to format the balance as currency based on the API response
// Add :number and :string type annotations
// Helper function to format the balance as currency based on the API response
// Add :number and :string type annotations
const formatBalance = (amount: number, currencyCode: string): string => {
  if (typeof amount !== 'number') {
    return 'N/A';
  }

  // 1. Format the number using Intl.NumberFormat
  const formattedString = new Intl.NumberFormat('en-US', {
    style: 'currency',
    // Always use BDT here since the symbol replacement logic below depends on it
    currency: 'BDT',
    minimumFractionDigits: 2,
  }).format(amount);

  // 2. Check if the currency code is BDT (case-insensitive)
  if (currencyCode.toUpperCase() === 'BDT') {
    // 3. Replace the common currency markers (like BDT or the generic $) with the Taka sign (৳)
    // The specific characters to replace depend on the locale, but a general approach works well.
    // We look for 'BDT' or a common, non-Taka symbol like '$' or 'TSh' etc., and replace it.
    // Since we forced 'BDT' in the formatter, we can look for that.

    // NOTE: Different environments might render BDT as 'BDT' or 'Tk' or '$'
    // A simple replacement that works in many modern browsers is to replace the BDT code.

    // This looks for the literal "BDT" and replaces it with the symbol
    // It also handles cases where a space is included (e.g., "BDT 1,000.00")
    return formattedString.replace('BDT', '৳').trim();

    // If the above replacement doesn't work (e.g., if the formatter uses a different symbol),
    // a more aggressive, but sometimes necessary, approach is to use the specific locale ('bn-BD'):
    // return new Intl.NumberFormat('bn-BD', { style: 'currency', currency: 'BDT' }).format(amount);
    // However, sticking with 'en-US' for number formatting (commas/periods) and custom symbol replacement is often cleaner for international apps.
  }

  // For any other currency, return the standard formatted string
  return formattedString;
};

// ----------------------------------------------------
// A. The Component that fetches and displays the balance (BalanceContent)
// ----------------------------------------------------
function BalanceContent() {
  // Call the hook safely here, as this component is only mounted when a user exists.
  const {
    data: balanceData,
    isPending: isBalancePending,
    isFetching,
    error,
    refetch,
  } = useUserBalance();

  // Handle Loading State
  if (isBalancePending) {
    return (
      <div className='p-2 border rounded-lg'>
        <Skeleton className='h-6 w-20 rounded-md' />
      </div>
    );
  }

  // Handle Error State
  if (error) {
    console.error('Failed to fetch user balance:', error);
    return <div className='text-red-500'>Error fetching balance.</div>;
  }

  // 1. Destructure the exact fields from the API response
  const { balance, lockedBalance, currency } = balanceData || {};

  // Handle No Data / Invalid Data
  // Check if the primary balance field is present and a number
  if (typeof balance !== 'number' || !currency) {
    return <div className='text-yellow-600'>Balance data is incomplete.</div>;
  }

  // Display the Formatted Balance
  return (
    <Button variant='outline' size='default' onClick={() => refetch()}>
      <div className='flex justify-between items-center gap-2'>
        {/* Use the dynamically fetched balance and currency */}
        <span className='md:text-md font-bold text-primary'>
          {formatBalance(balance, currency)}
        </span>
        <IconRefresh className={isFetching ? 'animate-spin' : ''} />
      </div>

      {/* Optionally display locked balance */}
      {typeof lockedBalance === 'number' && lockedBalance > 0 && (
        <div className='flex justify-between text-sm text-gray-500 border-t pt-2 mt-2'>
          <span>Locked:</span>
          <span>{formatBalance(lockedBalance, currency)}</span>
        </div>
      )}
    </Button>
  );
}

// ----------------------------------------------------
// B. The Top-Level Gatekeeper Component (Balance)
// ----------------------------------------------------
export default function Balance() {
  // Call useSession unconditionally
  const { data: session, isPending } = useSession();

  // Handle Session Loading
  if (isPending) {
    // Show a minimal loader while checking session
    return null;
  }

  // Gatekeeper: Only proceed to fetch/render if user is authenticated
  if (!session?.user) {
    return null;
  }

  // User is authenticated, proceed to fetch the balance
  return <BalanceContent />;
}
