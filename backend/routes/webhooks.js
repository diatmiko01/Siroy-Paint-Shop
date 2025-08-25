const express = require('express');
const router = express.Router();
const crypto = require('crypto');

// Webhook handlers for payment gateways
const WebhookService = {
  // BCA webhook handler
  async handleBCAWebhook(req, res) {
    try {
      const signature = req.headers['x-bca-signature'];
      const payload = JSON.stringify(req.body);
      
      // Verify webhook signature
      if (!verifyWebhookSignature(payload, signature, process.env.BCA_WEBHOOK_SECRET)) {
        return res.status(401).json({ error: 'Invalid signature' });
      }

      const { virtual_account, amount, transaction_id, status, timestamp } = req.body;

      console.log('BCA Webhook received:', {
        virtual_account,
        amount,
        transaction_id,
        status,
        timestamp
      });

      // Process payment notification
      await processPaymentNotification({
        gateway: 'bca',
        transactionId: transaction_id,
        virtualAccount: virtual_account,
        amount,
        status,
        timestamp
      });

      res.json({ success: true, message: 'Webhook processed' });

    } catch (error) {
      console.error('BCA Webhook Error:', error);
      res.status(500).json({ error: 'Webhook processing failed' });
    }
  },

  // Mandiri webhook handler
  async handleMandiriWebhook(req, res) {
    try {
      const signature = req.headers['x-mandiri-signature'];
      const payload = JSON.stringify(req.body);
      
      if (!verifyWebhookSignature(payload, signature, process.env.MANDIRI_WEBHOOK_SECRET)) {
        return res.status(401).json({ error: 'Invalid signature' });
      }

      const { bill_no, amount, transaction_id, payment_status, payment_time } = req.body;

      console.log('Mandiri Webhook received:', {
        bill_no,
        amount,
        transaction_id,
        payment_status,
        payment_time
      });

      await processPaymentNotification({
        gateway: 'mandiri',
        transactionId: transaction_id,
        virtualAccount: bill_no,
        amount,
        status: payment_status,
        timestamp: payment_time
      });

      res.json({ success: true, message: 'Webhook processed' });

    } catch (error) {
      console.error('Mandiri Webhook Error:', error);
      res.status(500).json({ error: 'Webhook processing failed' });
    }
  },

  // BNI webhook handler
  async handleBNIWebhook(req, res) {
    try {
      const signature = req.headers['x-bni-signature'];
      const payload = JSON.stringify(req.body);
      
      if (!verifyWebhookSignature(payload, signature, process.env.BNI_WEBHOOK_SECRET)) {
        return res.status(401).json({ error: 'Invalid signature' });
      }

      const { virtual_account, amount, trx_id, payment_flag, datetime_payment } = req.body;

      console.log('BNI Webhook received:', {
        virtual_account,
        amount,
        trx_id,
        payment_flag,
        datetime_payment
      });

      await processPaymentNotification({
        gateway: 'bni',
        transactionId: trx_id,
        virtualAccount: virtual_account,
        amount,
        status: payment_flag === 'Y' ? 'paid' : 'failed',
        timestamp: datetime_payment
      });

      res.json({ success: true, message: 'Webhook processed' });

    } catch (error) {
      console.error('BNI Webhook Error:', error);
      res.status(500).json({ error: 'Webhook processing failed' });
    }
  },

  // QRIS webhook handler
  async handleQRISWebhook(req, res) {
    try {
      const signature = req.headers['x-qris-signature'];
      const payload = JSON.stringify(req.body);
      
      if (!verifyWebhookSignature(payload, signature, process.env.QRIS_WEBHOOK_SECRET)) {
        return res.status(401).json({ error: 'Invalid signature' });
      }

      const { merchant_id, qr_id, amount, transaction_id, status, payment_time } = req.body;

      console.log('QRIS Webhook received:', {
        merchant_id,
        qr_id,
        amount,
        transaction_id,
        status,
        payment_time
      });

      await processPaymentNotification({
        gateway: 'qris',
        transactionId: transaction_id,
        qrId: qr_id,
        amount,
        status,
        timestamp: payment_time
      });

      res.json({ success: true, message: 'Webhook processed' });

    } catch (error) {
      console.error('QRIS Webhook Error:', error);
      res.status(500).json({ error: 'Webhook processing failed' });
    }
  }
};

// Helper functions
function verifyWebhookSignature(payload, signature, secret) {
  if (!signature || !secret) return false;
  
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(expectedSignature, 'hex')
  );
}

async function processPaymentNotification(data) {
  try {
    const { gateway, transactionId, amount, status, timestamp } = data;

    console.log(`Processing ${gateway} payment notification:`, data);

    // In production, update database
    // 1. Find the payment/order by transaction ID
    // 2. Update payment status
    // 3. Update order status if payment is successful
    // 4. Send notification to customer
    // 5. Update wallet balance if it's a top-up

    // Example logic:
    if (status === 'paid' || status === 'success') {
      // Payment successful
      console.log(`Payment ${transactionId} completed successfully`);
      
      // Update order status to 'processing'
      // Send confirmation email/SMS
      // If it's a wallet top-up, add balance to user's wallet
      
    } else if (status === 'failed' || status === 'expired') {
      // Payment failed or expired
      console.log(`Payment ${transactionId} failed or expired`);
      
      // Update order status to 'payment_failed'
      // Send notification to customer
    }

    // Log the transaction for audit purposes
    console.log(`Payment notification processed: ${transactionId} - ${status}`);

  } catch (error) {
    console.error('Error processing payment notification:', error);
    throw error;
  }
}

// Webhook routes
router.post('/bca', express.raw({ type: 'application/json' }), WebhookService.handleBCAWebhook);
router.post('/mandiri', express.raw({ type: 'application/json' }), WebhookService.handleMandiriWebhook);
router.post('/bni', express.raw({ type: 'application/json' }), WebhookService.handleBNIWebhook);
router.post('/qris', express.raw({ type: 'application/json' }), WebhookService.handleQRISWebhook);

// Test webhook endpoint for development
router.post('/test', (req, res) => {
  console.log('Test webhook received:', req.body);
  res.json({ success: true, message: 'Test webhook received' });
});

module.exports = router;
