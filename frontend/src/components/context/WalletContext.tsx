import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { walletService, WalletBalance, WalletTransaction } from '@/services/walletService';

interface WalletContextType {
  balance: WalletBalance | null;
  transactions: WalletTransaction[];
  isLoading: boolean;
  refreshBalance: () => Promise<void>;
  refreshTransactions: () => Promise<void>;
  topUp: (amount: number, paymentMethod: string) => Promise<any>;
  payWithWallet: (orderId: string, amount: number, description: string) => Promise<boolean>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [balance, setBalance] = useState<WalletBalance | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock user ID - in production, this would come from authentication
  const userId = 'user-123';

  const refreshBalance = async () => {
    try {
      setIsLoading(true);
      const walletBalance = await walletService.getBalance(userId);
      setBalance(walletBalance);
    } catch (error) {
      console.error('Failed to refresh balance:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshTransactions = async () => {
    try {
      const history = await walletService.getTransactionHistory(userId);
      setTransactions(history);
    } catch (error) {
      console.error('Failed to refresh transactions:', error);
    }
  };

  const topUp = async (amount: number, paymentMethod: string) => {
    try {
      setIsLoading(true);
      const response = await walletService.topUp({
        userId,
        amount,
        paymentMethod
      });
      
      if (response.success) {
        await refreshTransactions();
      }
      
      return response;
    } catch (error) {
      console.error('Top-up failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const payWithWallet = async (orderId: string, amount: number, description: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const success = await walletService.payWithWallet({
        userId,
        orderId,
        amount,
        description
      });
      
      if (success) {
        await refreshBalance();
        await refreshTransactions();
      }
      
      return success;
    } catch (error) {
      console.error('Wallet payment failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize wallet data on mount
  useEffect(() => {
    refreshBalance();
    refreshTransactions();
  }, []);

  return (
    <WalletContext.Provider value={{
      balance,
      transactions,
      isLoading,
      refreshBalance,
      refreshTransactions,
      topUp,
      payWithWallet
    }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
