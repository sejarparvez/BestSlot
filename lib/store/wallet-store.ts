import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface WalletState {
  // For optimistic updates only
  optimisticBalance: number | null;
  setOptimisticBalance: (balance: number | null) => void;
  reset: () => void;
}

export const useWalletStore = create<WalletState>()(
  devtools((set) => ({
    optimisticBalance: null,
    setOptimisticBalance: (balance) => set({ optimisticBalance: balance }),
    reset: () => set({ optimisticBalance: null }),
  })),
);
