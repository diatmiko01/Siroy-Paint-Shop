# 🎨 Siroy Paint Shop - E-Commerce Platform

A complete e-commerce solution for automotive paint retail with integrated Indonesian payment gateways, built with React, TypeScript, and Node.js.

![Siroy Paint Shop](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![React](https://img.shields.io/badge/React-18.3.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue)
![Node.js](https://img.shields.io/badge/Node.js-16%2B-green)
![Payment](https://img.shields.io/badge/Payment-Indonesian%20Banks-orange)

## 🚀 Features

### 💳 Payment Integration
- **BCA Virtual Account** - Transfer via ATM, Mobile Banking, Internet Banking
- **Mandiri Virtual Account** - Livin' by Mandiri integration
- **BNI Virtual Account** - BNI Mobile Banking support
- **QRIS** - Universal QR Code payments for all e-wallets

### 💰 Wallet System
- **Top-up Balance** - Add funds using any payment method
- **Instant Payments** - Pay with wallet balance for faster checkout
- **Transaction History** - Complete record of all wallet activities
- **Balance Management** - Real-time balance updates

### 🛒 E-Commerce Features
- **Product Catalog** - Automotive paint products with detailed specifications
- **Shopping Cart** - Add, remove, and manage cart items
- **Order Management** - Complete order lifecycle tracking
- **User Profiles** - Account management and order history
- **Responsive Design** - Mobile-first approach with Tailwind CSS

### 🔐 Security & API
- **JWT Authentication** - Secure user sessions
- **Rate Limiting** - API protection against abuse
- **Input Validation** - Comprehensive data validation
- **CORS Protection** - Cross-origin request security
- **Webhook Verification** - Secure payment notifications

## 🏗️ Architecture

### Frontend (React + TypeScript)
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Shadcn/ui components
│   ├── layout/         # Layout components
│   └── context/        # React contexts (Cart, Wallet)
├── pages/              # Application pages
├── services/           # API services (Payment, Wallet)
└── hooks/              # Custom React hooks
```

### Backend (Node.js + Express)
```
backend/
├── routes/             # API route handlers
│   ├── auth.js        # Authentication endpoints
│   ├── products.js    # Product management
│   ├── orders.js      # Order processing
│   ├── payments.js    # Payment gateway integration
│   ├── wallet.js      # Wallet operations
│   └── webhooks.js    # Payment webhooks
├── server.js          # Express server setup
└── .env.example       # Environment configuration
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd siroy-paint-shop
```

2. **Install frontend dependencies**
```bash
npm install
```

3. **Install backend dependencies**
```bash
cd backend
npm install
```

4. **Environment setup**
```bash
# Copy environment template
cp backend/.env.example backend/.env

# Edit .env with your configuration
# Add your payment gateway credentials
```

5. **Start development servers**

Frontend (React):
```bash
npm run dev
# Runs on http://localhost:3000
```

Backend (Node.js):
```bash
cd backend
npm run dev
# Runs on http://localhost:5000
```

## 🔧 Configuration

### Environment Variables

Create `backend/.env` with the following variables:

```bash
# Server Configuration
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# Database (Optional - currently using mock data)
MONGODB_URI=mongodb://localhost:27017/siroy-paint-shop

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d

# Payment Gateway APIs
BCA_API_KEY=your-bca-api-key
BCA_API_SECRET=your-bca-api-secret
MANDIRI_API_KEY=your-mandiri-api-key
MANDIRI_API_SECRET=your-mandiri-api-secret
BNI_API_KEY=your-bni-api-key
BNI_API_SECRET=your-bni-api-secret
QRIS_API_KEY=your-qris-api-key
QRIS_API_SECRET=your-qris-api-secret

# Webhook Security
PAYMENT_WEBHOOK_SECRET=your-webhook-secret-key
```

## 📱 Usage

### Customer Flow
1. **Browse Products** - View automotive paint catalog
2. **Add to Cart** - Select products and quantities
3. **Checkout** - Choose payment method (Bank Transfer, QRIS, or Wallet)
4. **Payment** - Complete payment via chosen method
5. **Order Tracking** - Monitor order status and delivery

### Payment Methods

#### Virtual Account (Bank Transfer)
- Generate unique VA number for each transaction
- Support for BCA, Mandiri, and BNI
- Automatic payment confirmation via webhooks

#### QRIS (QR Code)
- Universal QR code for all Indonesian e-wallets
- Instant payment confirmation
- Support for GoPay, OVO, DANA, LinkAja, and more

#### Wallet Payment
- Top-up wallet using any payment method
- Instant checkout with wallet balance
- Transaction history and balance management

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Products
- `GET /api/products` - Get products with filtering
- `GET /api/products/:id` - Get single product
- `GET /api/products/categories` - Get categories

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:orderId` - Get order details
- `GET /api/orders/user/:userId` - Get user orders

### Payments
- `POST /api/payments/virtual-account` - Create VA payment
- `POST /api/payments/qris` - Create QRIS payment
- `GET /api/payments/status/:paymentId` - Check payment status

### Wallet
- `GET /api/wallet/balance/:userId` - Get wallet balance
- `POST /api/wallet/top-up` - Create top-up transaction
- `POST /api/wallet/payment` - Process wallet payment

### Webhooks
- `POST /api/webhooks/bca` - BCA payment webhook
- `POST /api/webhooks/mandiri` - Mandiri payment webhook
- `POST /api/webhooks/bni` - BNI payment webhook
- `POST /api/webhooks/qris` - QRIS payment webhook

## 🛡️ Security Features

- **Rate Limiting** - 100 requests per 15 minutes per IP
- **CORS Protection** - Configured for specific origins
- **Input Validation** - Express-validator for all inputs
- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt with configurable rounds
- **Webhook Verification** - HMAC-SHA256 signature validation

## 🚀 Production Deployment

### Frontend Deployment (Vercel/Netlify)
```bash
npm run build
# Deploy dist/ folder to your hosting provider
```

### Backend Deployment (Railway/Heroku/VPS)
```bash
cd backend
npm start
# Configure environment variables on your hosting platform
```

### Database Setup
1. Set up MongoDB Atlas or PostgreSQL instance
2. Update `MONGODB_URI` in environment variables
3. Implement database models and connections

### Payment Gateway Setup
1. Register with Indonesian payment providers:
   - **BCA**: Apply for BCA API access
   - **Mandiri**: Register for Mandiri API
   - **BNI**: Apply for BNI API integration
   - **QRIS**: Register with QRIS providers (Nobu, LinkAja, etc.)

2. Configure webhook URLs in provider dashboards
3. Add API credentials to environment variables

## 📊 Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Shadcn/ui** - UI components
- **React Router** - Navigation
- **React Query** - Data fetching

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **express-validator** - Input validation
- **cors** - Cross-origin requests
- **express-rate-limit** - Rate limiting

### Payment Integration
- **BCA API** - Virtual Account
- **Mandiri API** - Virtual Account
- **BNI API** - Virtual Account
- **QRIS** - QR Code payments

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For technical support or questions:
- 📧 Email: support@siroypaintshop.com
- 📱 WhatsApp: +62 812-3456-7890
- 🌐 Website: https://siroypaintshop.com

---

**Siroy Paint Shop** - Professional automotive paint e-commerce solution for the Indonesian market 🇮🇩

Made with ❤️ by the Siroy Team
