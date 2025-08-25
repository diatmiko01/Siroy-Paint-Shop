import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  ShoppingCart, 
  Headphones, 
  User, 
  LogOut, 
  Home, 
  Package, 
  Calculator,
  Menu,
  X,
  Palette
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWallet } from '../context/WalletContext';

// User profile interface
interface UserProfile {
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItemCount } = useCart();
  const { balance } = useWallet();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Load user data from localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    alert('You have been logged out.');
    navigate('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Modern Header with Glass Effect */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'glass-dark shadow-2xl backdrop-blur-xl' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Modern Logo with Custom Image */}
            <div 
              className="flex items-center cursor-pointer group animate-fade-in" 
              onClick={() => navigate('/')}
            >
              <div className="relative mr-3">
                {/* Custom Logo Image */}
                <div className="w-12 h-12 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <img 
                    src="https://raw.githubusercontent.com/diatmiko01/Siroy-Paint-Shop/refs/heads/main/Untitled%20design.png"
                    alt="Siroy Paint Shop Logo"
                    className="w-10 h-10 object-contain rounded-lg"
                    onError={(e) => {
                      // Fallback to a simple paint icon if image fails to load
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  {/* Fallback SVG Icon (hidden by default) */}
                  <div className="hidden w-10 h-10 bg-gradient-to-r from-[#338aca] to-[#26b7cd] rounded-lg flex items-center justify-center">
                    <Palette className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-[#26b7cd] to-[#61bdaf] rounded-full animate-pulse-slow"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800 dark:text-white">
                  Siroy Paint Shop
                </h1>
                <span className="text-xs text-gray-500 hidden sm:block font-medium">Professional Paint Solutions</span>
              </div>
            </div>

            {/* Modern Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-xl mx-8 animate-slide-up">
              <form onSubmit={handleSearch} className="relative w-full group">
                <div className="absolute inset-0 bg-gradient-to-r from-[#338aca] to-[#26b7cd] rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#338aca] transition-colors" />
                  <Input
                    placeholder="Search premium car paints, color codes, brands..."
                    className="pl-12 pr-4 h-12 w-full bg-white/80 backdrop-blur-sm border-0 rounded-2xl shadow-lg focus:shadow-xl transition-all duration-300 text-gray-700 placeholder:text-gray-400"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </form>
            </div>

            {/* Modern Navigation - Desktop - All buttons in one row */}
            <nav className="hidden lg:flex items-center space-x-3 animate-fade-in">
              {/* Main Navigation Buttons */}
              {[
                { path: '/', icon: Home, label: 'Home' },
                { path: '/catalog', icon: Package, label: 'Catalog' },
                { path: '/calculator', icon: Calculator, label: 'Calculator' }
              ].map(({ path, icon: Icon, label }) => (
                <Button
                  key={path}
                  onClick={() => navigate(path)}
                  className={`relative px-3 py-2 rounded-xl font-medium transition-all duration-300 hover-lift whitespace-nowrap text-sm ${
                    isActivePath(path)
                      ? 'bg-gradient-to-r from-[#338aca] to-[#26b7cd] text-white shadow-lg'
                      : 'bg-gradient-to-r from-[#338aca] to-[#26b7cd] text-white shadow-lg hover:from-[#2b2c68] hover:to-[#338aca]'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {label}
                  {isActivePath(path) && (
                    <div className="absolute inset-0 bg-gradient-to-r from-[#338aca] to-[#26b7cd] rounded-xl blur opacity-30 -z-10"></div>
                  )}
                </Button>
              ))}

              {/* Support Button */}
              <Button
                onClick={() => navigate('/live-chat')}
                className={`relative px-3 py-2 rounded-xl font-medium transition-all duration-300 hover-lift whitespace-nowrap text-sm ${
                  isActivePath('/live-chat')
                    ? 'bg-gradient-to-r from-[#338aca] to-[#26b7cd] text-white shadow-lg'
                    : 'bg-gradient-to-r from-[#338aca] to-[#26b7cd] text-white shadow-lg hover:from-[#2b2c68] hover:to-[#338aca]'
                }`}
              >
                <Headphones className="h-4 w-4 mr-2" />
                Support
                {isActivePath('/live-chat') && (
                  <div className="absolute inset-0 bg-gradient-to-r from-[#338aca] to-[#26b7cd] rounded-xl blur opacity-30 -z-10"></div>
                )}
              </Button>

              {/* Cart Button */}
              <Button
                onClick={() => navigate('/cart')}
                className={`relative px-3 py-2 rounded-xl font-medium transition-all duration-300 hover-lift whitespace-nowrap text-sm ${
                  isActivePath('/cart')
                    ? 'bg-gradient-to-r from-[#338aca] to-[#26b7cd] text-white shadow-lg'
                    : 'bg-gradient-to-r from-[#338aca] to-[#26b7cd] text-white shadow-lg hover:from-[#2b2c68] hover:to-[#338aca]'
                }`}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Cart
                {cartItemCount > 0 && (
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-[#61bdaf] to-[#26b7cd] text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold animate-scale-in shadow-lg">
                    {cartItemCount}
                  </div>
                )}
                {isActivePath('/cart') && (
                  <div className="absolute inset-0 bg-gradient-to-r from-[#338aca] to-[#26b7cd] rounded-xl blur opacity-30 -z-10"></div>
                )}
              </Button>
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center ml-8 animate-fade-in">
              {/* Login/User Menu */}
              {user ? (
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/profile')}
                    className="hidden sm:flex px-4 py-2 rounded-xl text-gray-600 hover:text-[#338aca] hover:bg-white/50 transition-all duration-300"
                  >
                    <User className="h-4 w-4 mr-2" />
                    {user.name}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="p-2 rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50 transition-all duration-300"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => navigate('/login')}
                  className="px-3 py-2 bg-gradient-to-r from-[#2b2c68] to-[#191834] hover:from-[#338aca] hover:to-[#2b2c68] text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover-lift font-medium text-sm whitespace-nowrap"
                >
                  Login
                </Button>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-gray-600 hover:text-[#338aca] hover:bg-white/50 transition-all duration-300"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Modern Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden glass rounded-2xl m-4 p-6 animate-slide-up">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative mb-6">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search paints..."
                  className="pl-12 pr-4 h-12 w-full bg-white/80 border-0 rounded-xl"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>

              {/* Mobile Navigation */}
              <div className="space-y-3">
                {[
                  { path: '/', icon: Home, label: 'Home' },
                  { path: '/catalog', icon: Package, label: 'Catalog' },
                  { path: '/calculator', icon: Calculator, label: 'Calculator' },
                  { path: '/live-chat', icon: Headphones, label: 'Support' }
                ].map(({ path, icon: Icon, label }) => (
                  <Button
                    key={path}
                    variant="ghost"
                    className={`w-full justify-start p-4 rounded-xl transition-all duration-300 ${
                      isActivePath(path)
                        ? 'bg-gradient-to-r from-[#338aca] to-[#26b7cd] text-white'
                        : 'bg-gradient-to-r from-[#338aca] to-[#26b7cd] text-white'
                    }`}
                    onClick={() => {
                      navigate(path);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {label}
                  </Button>
                ))}
                {user && (
                  <Button
                    variant="ghost"
                    className="w-full justify-start p-4 rounded-xl text-gray-600 hover:bg-white/50 transition-all duration-300"
                    onClick={() => {
                      navigate('/profile');
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <User className="h-5 w-5 mr-3" />
                    Profile
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content with Top Padding */}
      <main className="pt-20">
        <Outlet />
      </main>
    </div>
  );
}
