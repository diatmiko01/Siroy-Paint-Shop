const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

// Payment service handlers
const PaymentService = {
  // Create Virtual Account payment
  async createVirtualAccount(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { amount, bank, orderId, customerInfo } = req.body;

      // Simulate payment gateway API call
      const paymentData = {
        paymentId: `VA-${Date.now()}`,
        virtualAccount: generateVirtualAccount(bank),
        amount,
        bank,
        orderId,
        status: 'pending',
        expiryTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        instructions: getPaymentInstructions(bank),
        createdAt: new Date()
      };

      // In production, save to database
      // await Payment.create(paymentData);

      res.json({
        success: true,
        data: paymentData,
        message: 'Virtual Account created successfully'
      });

    } catch (error) {
      console.error('Create VA Error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to create Virtual Account' 
      });
    }
  },

  // Create QRIS payment
  async createQRIS(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { amount, orderId, customerInfo } = req.body;

      // Simulate QRIS generation
      const qrisData = {
        paymentId: `QRIS-${Date.now()}`,
        qrCode: generateQRCode(amount, orderId),
        amount,
        orderId,
        status: 'pending',
        expiryTime: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
        createdAt: new Date()
      };

      res.json({
        success: true,
        data: qrisData,
        message: 'QRIS payment created successfully'
      });

    } catch (error) {
      console.error('Create QRIS Error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to create QRIS payment' 
      });
    }
  },

  // Check payment status
  async checkPaymentStatus(req, res) {
    try {
      const { paymentId } = req.params;

      // Simulate payment status check
      // In production, query from database and/or payment gateway
      const paymentStatus = {
        paymentId,
        status: Math.random() > 0.5 ? 'paid' : 'pending', // Random for demo
        paidAt: new Date(),
        amount: 1000000,
        orderId: 'SROY-123456789'
      };

      res.json({
        success: true,
        data: paymentStatus
      });

    } catch (error) {
      console.error('Check Payment Status Error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to check payment status' 
      });
    }
  }
};

// Helper functions
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

function generateQRCode(amount, orderId) {
  // In production, this would generate actual QR code data
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
router.post('/virtual-account', [
  body('amount').isNumeric().withMessage('Amount must be a number'),
  body('bank').isIn(['bca', 'mandiri', 'bni']).withMessage('Invalid bank'),
  body('orderId').notEmpty().withMessage('Order ID is required'),
  body('customerInfo.name').notEmpty().withMessage('Customer name is required'),
  body('customerInfo.email').isEmail().withMessage('Valid email is required')
], PaymentService.createVirtualAccount);

router.post('/qris', [
  body('amount').isNumeric().withMessage('Amount must be a number'),
  body('orderId').notEmpty().withMessage('Order ID is required'),
  body('customerInfo.name').notEmpty().withMessage('Customer name is required'),
  body('customerInfo.email').isEmail().withMessage('Valid email is required')
], PaymentService.createQRIS);

router.get('/status/:paymentId', PaymentService.checkPaymentStatus);

module.exports = router;
