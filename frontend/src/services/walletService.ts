// Wallet Service for Top-up and Balance Management
export interface WalletBalance {
  userId: string;
  balance: number;
  currency: string;
  lastUpdated: string;
}

export interface TopUpRequest {
  userId: string;
  amount: number;
  paymentMethod: string;
}

export interface TopUpResponse {
  success: boolean;
  topUpId: string;
  paymentId: string;
  paymentUrl?: string;
  virtualAccount?: string;
  qrisCode?: string;
  expiryTime: string;
  instructions: string[];
  error?: string;
}

export interface WalletTransaction {
  id: string;
  userId: string;
  type: 'top_up' | 'payment' | 'refund';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  description: string;
  createdAt: string;
  completedAt?: string;
  paymentId?: string;
}

export interface WalletPaymentRequest {
  userId: string;
  orderId: string;
  amount: number;
  description: string;
}

export class WalletService {
  private static instance: WalletService;
  private baseURL = process.env.NODE_ENV === 'production' 
    ? 'https://api.siroypaintshop.com/api' 
    : 'http://localhost:5000/api';

  static getInstance(): WalletService {
    if (!WalletService.instance) {
      WalletService.instance = new WalletService();
    }
    return WalletService.instance;
  }

  async getBalance(userId: string): Promise<WalletBalance> {
    try {
      const wallets = JSON.parse(localStorage.getItem('wallets') || '{}');
      const wallet = wallets[userId];

      if (!wallet) {
        // Create new wallet with zero balance
        const newWallet: WalletBalance = {
          userId,
          balance: 0,
          currency: 'IDR',
          lastUpdated: new Date().toISOString()
        };
        wallets[userId] = newWallet;
        localStorage.setItem('wallets', JSON.stringify(wallets));
        return newWallet;
      }

      return wallet;
    } catch (error) {
      throw new Error('Failed to get wallet balance');
    }
  }

  async topUp(request: TopUpRequest): Promise<TopUpResponse> {
    try {
      const { paymentService } = await import('./paymentService');
      
      const topUpId = `TOPUP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Create payment for top-up
      const paymentRequest = {
        orderId: topUpId,
        amount: request.amount,
        customerName: 'User', // In production, get from user profile
        customerEmail: 'user@example.com', // In production, get from user profile
        customerPhone: '+62812345678', // In production, get from user profile
        paymentMethod: request.paymentMethod
      };

      const paymentResponse = await paymentService.createPayment(paymentRequest);

      if (!paymentResponse.success) {
        return {
          success: false,
          topUpId: '',
          paymentId: '',
          expiryTime: '',
          instructions: [],
          error: paymentResponse.error
        };
      }

      // Store top-up transaction
      const transactions = JSON.parse(localStorage.getItem('wallet_transactions') || '{}');
      const transaction: WalletTransaction = {
        id: topUpId,
        userId: request.userId,
        type: 'top_up',
        amount: request.amount,
        status: 'pending',
        description: `Top-up saldo sebesar Rp ${request.amount.toLocaleString('id-ID')}`,
        createdAt: new Date().toISOString(),
        paymentId: paymentResponse.paymentId
      };

      transactions[topUpId] = transaction;
      localStorage.setItem('wallet_transactions', JSON.stringify(transactions));

      return {
        success: true,
        topUpId,
        paymentId: paymentResponse.paymentId,
        paymentUrl: paymentResponse.paymentUrl,
        virtualAccount: paymentResponse.virtualAccount,
        qrisCode: paymentResponse.qrisCode,
        expiryTime: paymentResponse.expiryTime,
        instructions: paymentResponse.instructions
      };
    } catch (error) {
      return {
        success: false,
        topUpId: '',
        paymentId: '',
        expiryTime: '',
        instructions: [],
        error: error instanceof Error ? error.message : 'Top-up failed'
      };
    }
  }

  async processTopUpPayment(topUpId: string): Promise<boolean> {
    try {
      const transactions = JSON.parse(localStorage.getItem('wallet_transactions') || '{}');
      const transaction = transactions[topUpId];

      if (!transaction || transaction.type !== 'top_up') {
        throw new Error('Top-up transaction not found');
      }

      if (transaction.status !== 'pending') {
        return transaction.status === 'completed';
      }

      // Check payment status
      const { paymentService } = await import('./paymentService');
      const paymentStatus = await paymentService.checkPaymentStatus(transaction.paymentId!);

      if (paymentStatus.status === 'paid') {
        // Add balance to wallet
        await this.addBalance(transaction.userId, transaction.amount);
        
        // Update transaction status
        transaction.status = 'completed';
        transaction.completedAt = new Date().toISOString();
        transactions[topUpId] = transaction;
        localStorage.setItem('wallet_transactions', JSON.stringify(transactions));

        return true;
      }

      return false;
    } catch (error) {
      console.error('Failed to process top-up payment:', error);
      return false;
    }
  }

  async payWithWallet(request: WalletPaymentRequest): Promise<boolean> {
    try {
      const balance = await this.getBalance(request.userId);

      if (balance.balance < request.amount) {
        throw new Error('Insufficient wallet balance');
      }

      // Deduct balance
      await this.deductBalance(request.userId, request.amount);

      // Create transaction record
      const transactions = JSON.parse(localStorage.getItem('wallet_transactions') || '{}');
      const transactionId = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const transaction: WalletTransaction = {
        id: transactionId,
        userId: request.userId,
        type: 'payment',
        amount: -request.amount, // Negative for deduction
        status: 'completed',
        description: request.description,
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString()
      };

      transactions[transactionId] = transaction;
      localStorage.setItem('wallet_transactions', JSON.stringify(transactions));

      return true;
    } catch (error) {
      console.error('Wallet payment failed:', error);
      return false;
    }
  }

  async addBalance(userId: string, amount: number): Promise<void> {
    const wallets = JSON.parse(localStorage.getItem('wallets') || '{}');
    const wallet = wallets[userId] || {
      userId,
      balance: 0,
      currency: 'IDR',
      lastUpdated: new Date().toISOString()
    };

    wallet.balance += amount;
    wallet.lastUpdated = new Date().toISOString();
    wallets[userId] = wallet;
    localStorage.setItem('wallets', JSON.stringify(wallets));
  }

  async deductBalance(userId: string, amount: number): Promise<void> {
    const wallets = JSON.parse(localStorage.getItem('wallets') || '{}');
    const wallet = wallets[userId];

    if (!wallet || wallet.balance < amount) {
      throw new Error('Insufficient balance');
    }

    wallet.balance -= amount;
    wallet.lastUpdated = new Date().toISOString();
    wallets[userId] = wallet;
    localStorage.setItem('wallets', JSON.stringify(wallets));
  }

  async getTransactionHistory(userId: string): Promise<WalletTransaction[]> {
    try {
      const transactions = JSON.parse(localStorage.getItem('wallet_transactions') || '{}');
      return Object.values(transactions)
        .filter((t: any): t is WalletTransaction => t && t.userId === userId)
        .sort((a: WalletTransaction, b: WalletTransaction) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
      console.error('Failed to get transaction history:', error);
      return [];
    }
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  }
}

export const walletService = WalletService.getInstance();
