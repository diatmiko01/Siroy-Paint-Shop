# Siroy Paint Shop - Backend API

A comprehensive Node.js/Express backend API for the Siroy Paint Shop e-commerce platform with integrated Indonesian payment gateways.

## Features

- 🔐 **Authentication & Authorization** - JWT-based auth system
- 💳 **Payment Integration** - BCA, Mandiri, BNI Virtual Accounts + QRIS
- 💰 **Wallet System** - Top-up and balance management
- 📦 **Order Management** - Complete order lifecycle
- 🎨 **Product Catalog** - Paint products with detailed specifications
- 🔔 **Webhook Handling** - Real-time payment notifications
- 🛡️ **Security** - Rate limiting, input validation, CORS protection

## Quick Start

### Prerequisites
- Node.js 16+ 
- MongoDB (optional - currently using mock data)
- Payment gateway credentials (for production)

### Installation

1. **Install dependencies**
```bash
cd backend
npm install
```

2. **Environment setup**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Start development server**
```bash
npm run dev
```

The API will be available at `http://localhost:5000`

## API Endpoints

### Authentication
```
POST /api/auth/register     - User registration
POST /api/auth/login        - User login
GET  /api/auth/profile      - Get user profile
PUT  /api/auth/profile      - Update user profile
POST /api/auth/change-password - Change password
```

### Products
```
GET  /api/products          - Get all products (with filters)
GET  /api/products/:id      - Get single product
GET  /api/products/categories - Get product categories
GET  /api/products/brands   - Get product brands
```

### Orders
```
POST /api/orders            - Create new order
GET  /api/orders/:orderId   - Get order details
PATCH /api/orders/:orderId/status - Update order status
GET  /api/orders/user/:userId - Get user orders
POST /api/orders/:orderId/cancel - Cancel order
```

### Payments
```
POST /api/payments/virtual-account - Create VA payment
POST /api/payments/qris     - Create QRIS payment
GET  /api/payments/status/:paymentId - Check payment status
```

### Wallet
```
GET  /api/wallet/balance/:userId - Get wallet balance
POST /api/wallet/top-up     - Create top-up transaction
POST /api/wallet/payment    - Process wallet payment
GET  /api/wallet/transactions/:userId - Get transaction history
```

### Webhooks
```
POST /api/webhooks/bca      - BCA payment webhook
POST /api/webhooks/mandiri  - Mandiri payment webhook
POST /api/webhooks/bni      - BNI payment webhook
POST /api/webhooks/qris     - QRIS payment webhook
POST /api/webhooks/test     - Test webhook endpoint
```

## Payment Gateway Integration

### Supported Banks
- **BCA** - Virtual Account & Mobile Banking
- **Mandiri** - Virtual Account & Livin' by Mandiri
- **BNI** - Virtual Account & BNI Mobile Banking
- **QRIS** - Universal QR Code payments

### Webhook Security
All webhooks are secured with HMAC-SHA256 signature verification:
```javascript
const signature = crypto
  .createHmac('sha256', webhookSecret)
  .update(payload)
  .digest('hex');
```

## Environment Variables

Key environment variables (see `.env.example`):

```bash
# Server
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb://localhost:27017/siroy-paint-shop

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d

# Payment Gateways
BCA_API_KEY=your-bca-api-key
MANDIRI_API_KEY=your-mandiri-api-key
BNI_API_KEY=your-bni-api-key
QRIS_API_KEY=your-qris-api-key

# Webhooks
PAYMENT_WEBHOOK_SECRET=your-webhook-secret
```

## Security Features

- **Rate Limiting** - 100 requests per 15 minutes per IP
- **CORS Protection** - Configured for frontend domain
- **Input Validation** - Express-validator for all inputs
- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcrypt with configurable rounds
- **Webhook Verification** - HMAC signature validation

## Development

### Project Structure
```
backend/
├── routes/           # API route handlers
│   ├── auth.js      # Authentication routes
│   ├── products.js  # Product management
│   ├── orders.js    # Order management
│   ├── payments.js  # Payment processing
│   ├── wallet.js    # Wallet operations
│   └── webhooks.js  # Payment webhooks
├── server.js        # Express server setup
├── package.json     # Dependencies
└── .env.example     # Environment template
```

### Available Scripts
```bash
npm start          # Production server
npm run dev        # Development with nodemon
npm test           # Run tests (when implemented)
```

### Testing Webhooks
Use the test endpoint for development:
```bash
curl -X POST http://localhost:5000/api/webhooks/test \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

## Production Deployment

### Database Setup
1. Set up MongoDB instance
2. Update `MONGODB_URI` in environment
3. Implement proper database models

### Payment Gateway Setup
1. Register with Indonesian payment providers
2. Obtain API credentials and webhook secrets
3. Configure production endpoints
4. Set up webhook URLs in provider dashboards

### Security Checklist
- [ ] Use strong JWT secrets
- [ ] Enable HTTPS in production
- [ ] Set up proper CORS origins
- [ ] Configure rate limiting
- [ ] Set up monitoring and logging
- [ ] Implement proper error handling

## API Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [ ... ] // Validation errors if applicable
}
```

## Support

For technical support or questions about the API:
- Check the documentation above
- Review the code comments in route files
- Test endpoints using the provided examples

---

**Siroy Paint Shop Backend API** - Professional e-commerce solution for automotive paint retail.
