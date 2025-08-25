import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layout & Context
import MainLayout from './components/layout/MainLayout';
import { CartProvider } from './components/context/CartContext';
import { WalletProvider } from './components/context/WalletContext';

// Pages
import Index from './pages/Index';
import ProductCatalog from './pages/ProductCatalog';
import ProductDetail from './pages/ProductDetail';
import PaintCalculator from './pages/PaintCalculator';
import ShoppingCart from './pages/ShoppingCart';
import NotFound from './pages/NotFound';
import LiveChat from './pages/LiveChat';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AccountInformationPage from './pages/AccountInformationPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderStatusPage from './pages/OrderStatusPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import TopUpPage from './pages/TopUpPage';
import ShippingAddressPage from './pages/ShippingAddressPage';
import AddEditAddressPage from './pages/AddEditAddressPage';

// Create query client instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        {/* CartProvider and WalletProvider wrap all routes */}
        <CartProvider>
          <WalletProvider>
            <Routes>
              {/* Routes using MainLayout (with header, login & cart) */}
              <Route element={<MainLayout />}>
                <Route path="/" element={<Index />} />
                <Route path="/catalog" element={<ProductCatalog />} />
                <Route path="/cart" element={<ShoppingCart />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/calculator" element={<PaintCalculator />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/profile/account-info" element={<AccountInformationPage />} />
                <Route path="/profile/order-history" element={<OrderHistoryPage />} />
                <Route path="/profile/shipping-address" element={<ShippingAddressPage />} />
                <Route path="/profile/shipping-address/add" element={<AddEditAddressPage />} />
                <Route path="/profile/shipping-address/edit/:id" element={<AddEditAddressPage />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
              </Route>
              
              {/* Routes NOT using MainLayout */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/live-chat" element={<LiveChat />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/top-up" element={<TopUpPage />} />
              <Route path="/order-status/:orderId" element={<OrderStatusPage />} />
              
              {/* Catch-all route for 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </WalletProvider>
        </CartProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
