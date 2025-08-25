const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

// Order service handlers
const OrderService = {
  // Create new order
  async createOrder(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { items, customerInfo, shippingAddress, paymentMethod, totalAmount } = req.body;

      // Generate order ID
      const orderId = `SROY-${Date.now()}`;

      // Create order data
      const orderData = {
        orderId,
        items,
        customerInfo,
        shippingAddress,
        paymentMethod,
        totalAmount,
        status: 'pending_payment',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // In production, save to database
      // await Order.create(orderData);

      res.json({
        success: true,
        data: orderData,
        message: 'Order created successfully'
      });

    } catch (error) {
      console.error('Create Order Error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to create order' 
      });
    }
  },

  // Get order by ID
  async getOrder(req, res) {
    try {
      const { orderId } = req.params;

      // Simulate order data
      const orderData = {
        orderId,
        items: [
          {
            id: 1,
            name: 'PPG Deltron DG Performance Clear Coat',
            price: 850000,
            quantity: 2,
            image: '/api/placeholder/100/100'
          },
          {
            id: 2,
            name: 'Sikkens Autocryl 2K Base Coat - Pearl White',
            price: 650000,
            quantity: 1,
            image: '/api/placeholder/100/100'
          }
        ],
        customerInfo: {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+62812345678'
        },
        shippingAddress: {
          street: 'Jl. Sudirman No. 123',
          city: 'Jakarta',
          postalCode: '12345',
          country: 'Indonesia'
        },
        totalAmount: 2350000,
        status: 'processing',
        createdAt: new Date(Date.now() - 86400000), // 1 day ago
        updatedAt: new Date()
      };

      res.json({
        success: true,
        data: orderData
      });

    } catch (error) {
      console.error('Get Order Error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to get order' 
      });
    }
  },

  // Update order status
  async updateOrderStatus(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { orderId } = req.params;
      const { status, notes } = req.body;

      // In production, update database
      // await Order.updateOne({ orderId }, { status, notes, updatedAt: new Date() });

      const updatedOrder = {
        orderId,
        status,
        notes,
        updatedAt: new Date()
      };

      res.json({
        success: true,
        data: updatedOrder,
        message: 'Order status updated successfully'
      });

    } catch (error) {
      console.error('Update Order Status Error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to update order status' 
      });
    }
  },

  // Get user orders
  async getUserOrders(req, res) {
    try {
      const { userId } = req.params;
      const { page = 1, limit = 10, status } = req.query;

      // Simulate user orders
      let orders = [
        {
          orderId: 'SROY-1703123456789',
          totalAmount: 2350000,
          status: 'delivered',
          itemCount: 3,
          createdAt: new Date(Date.now() - 86400000 * 7), // 7 days ago
          deliveredAt: new Date(Date.now() - 86400000 * 2) // 2 days ago
        },
        {
          orderId: 'SROY-1703123456788',
          totalAmount: 1250000,
          status: 'processing',
          itemCount: 2,
          createdAt: new Date(Date.now() - 86400000 * 3), // 3 days ago
        },
        {
          orderId: 'SROY-1703123456787',
          totalAmount: 850000,
          status: 'shipped',
          itemCount: 1,
          createdAt: new Date(Date.now() - 86400000 * 5), // 5 days ago
          shippedAt: new Date(Date.now() - 86400000 * 1) // 1 day ago
        }
      ];

      // Filter by status if provided
      if (status) {
        orders = orders.filter(order => order.status === status);
      }

      res.json({
        success: true,
        data: {
          orders,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: orders.length,
            totalPages: Math.ceil(orders.length / limit)
          }
        }
      });

    } catch (error) {
      console.error('Get User Orders Error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to get user orders' 
      });
    }
  },

  // Cancel order
  async cancelOrder(req, res) {
    try {
      const { orderId } = req.params;
      const { reason } = req.body;

      // Check if order can be cancelled (only pending/processing orders)
      // In production, check from database
      const orderStatus = 'processing'; // Simulate current status

      if (!['pending_payment', 'processing'].includes(orderStatus)) {
        return res.status(400).json({
          success: false,
          message: 'Order cannot be cancelled at this stage'
        });
      }

      // Process cancellation
      const cancelledOrder = {
        orderId,
        status: 'cancelled',
        cancelReason: reason,
        cancelledAt: new Date(),
        refundStatus: 'processing' // If payment was made
      };

      // In production, update database and process refund if needed
      // await Order.updateOne({ orderId }, cancelledOrder);

      res.json({
        success: true,
        data: cancelledOrder,
        message: 'Order cancelled successfully'
      });

    } catch (error) {
      console.error('Cancel Order Error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to cancel order' 
      });
    }
  }
};

// Routes with validation
router.post('/', [
  body('items').isArray().withMessage('Items must be an array'),
  body('customerInfo.name').notEmpty().withMessage('Customer name is required'),
  body('customerInfo.email').isEmail().withMessage('Valid email is required'),
  body('customerInfo.phone').notEmpty().withMessage('Phone number is required'),
  body('shippingAddress.street').notEmpty().withMessage('Street address is required'),
  body('shippingAddress.city').notEmpty().withMessage('City is required'),
  body('totalAmount').isNumeric().withMessage('Total amount must be a number')
], OrderService.createOrder);

router.get('/:orderId', OrderService.getOrder);

router.patch('/:orderId/status', [
  body('status').isIn(['pending_payment', 'processing', 'shipped', 'delivered', 'cancelled'])
    .withMessage('Invalid status')
], OrderService.updateOrderStatus);

router.get('/user/:userId', OrderService.getUserOrders);

router.post('/:orderId/cancel', [
  body('reason').notEmpty().withMessage('Cancellation reason is required')
], OrderService.cancelOrder);

module.exports = router;
