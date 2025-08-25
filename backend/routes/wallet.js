const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

// Wallet service handlers
const WalletService = {
  // Get wallet balance
  async getBalance(req, res) {
    try {
      const { userId } = req.params;

      // In production, fetch from database
      // const wallet = await Wallet.findOne({ userId });
      
      // Simulate wallet data
      const walletData = {
        userId,
        balance: 500000, // Default balance for demo
        currency: 'IDR',
        lastUpdated: new Date()
      };

      res.json({
        success: true,
        data: walletData
      });

    } catch (error) {
      console.error('Get Balance Error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to get wallet balance' 
      });
    }
  },

  // Create top-up transaction
  async createTopUp(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { userId, amount, paymentMethod } = req.body;

      // Create top-up transaction
      const topUpData = {
        transactionId: `TOPUP-${Date.now()}`,
        userId,
        amount,
        paymentMethod,
        status: 'pending',
        createdAt: new Date(),
        expiryTime: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      };

      // Generate payment details based on method
      let paymentDetails = {};
      
      if (paymentMethod.type === 'virtual_account') {
        paymentDetails = {
          virtualAccount: generateVirtualAccount(paymentMethod.bank),
          bank: paymentMethod.bank,
          instructions: getPaymentInstructions(paymentMethod.bank)
        };
      } else if (paymentMethod.type === 'qris') {
        paymentDetails = {
          qrCode: generateQRCode(amount, topUpData.transactionId),
          expiryTime: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes for QRIS
        };
      }

      res.json({
        success: true,
        data: {
          ...topUpData,
          paymentDetails
        },
        message: 'Top-up transaction created successfully'
      });

    } catch (error) {
      console.error('Create Top-up Error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to create top-up transaction' 
      });
    }
  },

  // Process wallet payment (deduct from balance)
  async processPayment(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { userId, amount, orderId } = req.body;

      // In production, check actual balance from database
      const currentBalance = 500000; // Demo balance

      if (currentBalance < amount) {
        return res.status(400).json({
          success: false,
          message: 'Insufficient wallet balance',
          data: { currentBalance, requiredAmount: amount }
        });
      }

      // Process payment
      const paymentData = {
        transactionId: `WALLET-${Date.now()}`,
        userId,
        orderId,
        amount,
        type: 'payment',
        status: 'completed',
        newBalance: currentBalance - amount,
        createdAt: new Date()
      };

      // In production, update database
      // await Wallet.updateOne({ userId }, { $inc: { balance: -amount } });
      // await Transaction.create(paymentData);

      res.json({
        success: true,
        data: paymentData,
        message: 'Payment processed successfully'
      });

    } catch (error) {
      console.error('Process Payment Error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to process wallet payment' 
      });
    }
  },

  // Get transaction history
  async getTransactionHistory(req, res) {
    try {
      const { userId } = req.params;
      const { page = 1, limit = 10 } = req.query;

      // Simulate transaction history
      const transactions = [
        {
          transactionId: 'TOPUP-1703123456789',
          type: 'top_up',
          amount: 1000000,
          status: 'completed',
          createdAt: new Date(Date.now() - 86400000), // 1 day ago
          description: 'Top-up via BCA Virtual Account'
        },
        {
          transactionId: 'WALLET-1703123456788',
          type: 'payment',
          amount: -250000,
          status: 'completed',
          createdAt: new Date(Date.now() - 172800000), // 2 days ago
          description: 'Payment for Order #SROY-123456'
        },
        {
          transactionId: 'TOPUP-1703123456787',
          type: 'top_up',
          amount: 500000,
          status: 'completed',
          createdAt: new Date(Date.now() - 259200000), // 3 days ago
          description: 'Top-up via QRIS'
        }
      ];

      res.json({
        success: true,
        data: {
          transactions,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: transactions.length,
            totalPages: Math.ceil(transactions.length / limit)
          }
        }
      });

    } catch (error) {
      console.error('Get Transaction History Error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to get transaction history' 
      });
    }
  }
};

// Helper functions (same as in payments.js)
function generateVirtualAccount(bank) {
  const bankCodes = {
    'bca': '014',
    'mandiri': '008',
    'bni': '009'
  };
  
  const bankCode = bankCodes[bank] || '014';
  const randomNumber = Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
  return `${bankCode}${randomNumber}`;
}

function generateQRCode(amount, transactionId) {
  return `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==`;
}

function getPaymentInstructions(bank) {
  const instructions = {
    'bca': [
      'Buka aplikasi BCA Mobile atau kunjungi ATM BCA',
      'Pilih menu Transfer > Virtual Account',
      'Masukkan nomor Virtual Account',
      'Masukkan jumlah yang harus dibayar',
      'Ikuti instruksi untuk menyelesaikan pembayaran'
    ],
    'mandiri': [
      'Buka aplikasi Livin by Mandiri atau kunjungi ATM Mandiri',
      'Pilih menu Bayar > Virtual Account',
      'Masukkan nomor Virtual Account',
      'Masukkan jumlah yang harus dibayar',
      'Ikuti instruksi untuk menyelesaikan pembayaran'
    ],
    'bni': [
      'Buka aplikasi BNI Mobile Banking atau kunjungi ATM BNI',
      'Pilih menu Transfer > Virtual Account Billing',
      'Masukkan nomor Virtual Account',
      'Masukkan jumlah yang harus dibayar',
      'Ikuti instruksi untuk menyelesaikan pembayaran'
    ]
  };
  
  return instructions[bank] || instructions['bca'];
}

// Routes with validation
router.get('/balance/:userId', WalletService.getBalance);

router.post('/top-up', [
  body('userId').notEmpty().withMessage('User ID is required'),
  body('amount').isNumeric().withMessage('Amount must be a number'),
  body('paymentMethod.type').isIn(['virtual_account', 'qris']).withMessage('Invalid payment method'),
], WalletService.createTopUp);

router.post('/payment', [
  body('userId').notEmpty().withMessage('User ID is required'),
  body('amount').isNumeric().withMessage('Amount must be a number'),
  body('orderId').notEmpty().withMessage('Order ID is required')
], WalletService.processPayment);

router.get('/transactions/:userId', WalletService.getTransactionHistory);

module.exports = router;
