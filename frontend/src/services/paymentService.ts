// Payment Service for Indonesian Banks and QRIS
export interface PaymentMethod {
  id: string;
  name: string;
  type: 'bank_transfer' | 'qris' | 'virtual_account';
  bankCode?: string;
  icon: string;
  description: string;
  processingTime: string;
  fee: number;
}

export interface PaymentRequest {
  orderId: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  paymentMethod: string;
}

export interface PaymentResponse {
  success: boolean;
  paymentId: string;
  paymentUrl?: string;
  virtualAccount?: string;
  qrisCode?: string;
  expiryTime: string;
  instructions: string[];
  error?: string;
}

export interface PaymentStatus {
  paymentId: string;
  status: 'pending' | 'paid' | 'expired' | 'failed';
  paidAt?: string;
  amount: number;
}

// Available payment methods
export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'bca_va',
    name: 'BCA Virtual Account',
    type: 'virtual_account',
    bankCode: 'BCA',
    icon: '🏦',
    description: 'Transfer melalui ATM, Mobile Banking, atau Internet Banking BCA',
    processingTime: 'Instan',
    fee: 0
  },
  {
    id: 'mandiri_va',
    name: 'Mandiri Virtual Account',
    type: 'virtual_account',
    bankCode: 'MANDIRI',
    icon: '🏛️',
    description: 'Transfer melalui ATM, Livin by Mandiri, atau Internet Banking',
    processingTime: 'Instan',
    fee: 0
  },
  {
    id: 'bni_va',
    name: 'BNI Virtual Account',
    type: 'virtual_account',
    bankCode: 'BNI',
    icon: '🏢',
    description: 'Transfer melalui ATM, BNI Mobile Banking, atau Internet Banking',
    processingTime: 'Instan',
    fee: 0
  },
  {
    id: 'qris',
    name: 'QRIS',
    type: 'qris',
    icon: '📱',
    description: 'Bayar dengan scan QR Code menggunakan aplikasi e-wallet atau mobile banking',
    processingTime: 'Instan',
    fee: 0
  }
];

// Mock payment service - In production, this would integrate with real payment gateway
export class PaymentService {
  private static instance: PaymentService;
  private baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://api.siroypaintshop.com/api' 
    : 'http://localhost:5000/api';

  static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService();
    }
    return PaymentService.instance;
  }

  async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      // In production, this would call real payment gateway API
      // For now, we'll simulate the response
      const paymentMethod = PAYMENT_METHODS.find(m => m.id === request.paymentMethod);
      
      if (!paymentMethod) {
        throw new Error('Invalid payment method');
      }

      const paymentId = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const expiryTime = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours

      let response: PaymentResponse = {
        success: true,
        paymentId,
        expiryTime,
        instructions: []
      };

      switch (paymentMethod.type) {
        case 'virtual_account':
          const vaNumber = this.generateVirtualAccount(paymentMethod.bankCode!, request.orderId);
          response.virtualAccount = vaNumber;
          response.instructions = [
            `Transfer ke nomor Virtual Account: ${vaNumber}`,
            `Jumlah: Rp ${request.amount.toLocaleString('id-ID')}`,
            `Atas nama: ${request.customerName}`,
            'Transfer harus sesuai dengan jumlah yang tertera',
            'Pembayaran akan dikonfirmasi otomatis setelah transfer berhasil'
          ];
          break;

        case 'qris':
          response.qrisCode = this.generateQRISCode(request.orderId, request.amount);
          response.instructions = [
            'Scan QR Code menggunakan aplikasi e-wallet atau mobile banking',
            'Pastikan jumlah pembayaran sesuai',
            'Konfirmasi pembayaran di aplikasi Anda',
            'Pembayaran akan dikonfirmasi otomatis'
          ];
          break;
      }

      // Store payment in localStorage for demo purposes
      const payments = JSON.parse(localStorage.getItem('payments') || '{}');
      payments[paymentId] = {
        ...request,
        paymentId,
        status: 'pending',
        createdAt: new Date().toISOString(),
        expiryTime
      };
      localStorage.setItem('payments', JSON.stringify(payments));

      return response;
    } catch (error) {
      return {
        success: false,
        paymentId: '',
        expiryTime: '',
        instructions: [],
        error: error instanceof Error ? error.message : 'Payment creation failed'
      };
    }
  }

  async checkPaymentStatus(paymentId: string): Promise<PaymentStatus> {
    try {
      // In production, this would call real payment gateway API
      const payments = JSON.parse(localStorage.getItem('payments') || '{}');
      const payment = payments[paymentId];

      if (!payment) {
        throw new Error('Payment not found');
      }

      // Simulate random payment status for demo
      const now = new Date();
      const expiry = new Date(payment.expiryTime);
      
      if (now > expiry) {
        payment.status = 'expired';
      } else {
        // 30% chance of being paid for demo purposes
        if (Math.random() < 0.3 && payment.status === 'pending') {
          payment.status = 'paid';
          payment.paidAt = new Date().toISOString();
        }
      }

      payments[paymentId] = payment;
      localStorage.setItem('payments', JSON.stringify(payments));

      return {
        paymentId,
        status: payment.status,
        paidAt: payment.paidAt,
        amount: payment.amount
      };
    } catch (error) {
      throw new Error('Failed to check payment status');
    }
  }

  private generateVirtualAccount(bankCode: string, orderId: string): string {
    const prefix = {
      'BCA': '70012',
      'MANDIRI': '88808',
      'BNI': '98808'
    }[bankCode] || '12345';

    const orderNumber = orderId.replace(/[^0-9]/g, '').slice(-8).padStart(8, '0');
    return prefix + orderNumber;
  }

  private generateQRISCode(orderId: string, amount: number): string {
    // In production, this would generate actual QRIS code
    // For demo, we return a base64 encoded string representing QR code data
    const qrData = {
      merchant: 'SIROY_PAINT_SHOP',
      orderId,
      amount,
      timestamp: Date.now()
    };
    return btoa(JSON.stringify(qrData));
  }

  getPaymentMethods(): PaymentMethod[] {
    return PAYMENT_METHODS;
  }
}

export const paymentService = PaymentService.getInstance();
