import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Star, 
  Truck, 
  Shield, 
  Headphones, 
  Search, 
  Home, 
  LayoutGrid, 
  ShoppingCart, 
  User, 
  Menu, 
  X,
  ArrowRight,
  Palette,
  Droplets,
  Sparkles,
  Award,
  Users,
  CheckCircle,
  ShoppingBag
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { useCart } from '@/components/context/CartContext';

export default function Index() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { cartItemCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Prevent body scroll when menu is open on mobile
  useEffect(() => {
    if (isMobile && isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobile, isMenuOpen]);
  
  // Data for categories and products
  const categories = [
    { name: 'Base Coat', icon: '🎨', count: '150+ Products', color: 'from-[#338aca] to-[#26b7cd]' },
    { name: 'Color Paint', icon: '🌈', count: '500+ Colors', color: 'from-[#26b7cd] to-[#61bdaf]' },
    { name: 'Clear Coat', icon: '✨', count: '80+ Products', color: 'from-[#61bdaf] to-[#338aca]' },
    { name: 'Thinner', icon: '🧪', count: '60+ Products', color: 'from-[#2b2c68] to-[#338aca]' },
    { name: 'Equipment', icon: '🔧', count: '200+ Products', color: 'from-[#191834] to-[#2b2c68]' },
    { name: 'Accessories', icon: '📦', count: '300+ Products', color: 'from-[#338aca] to-[#191834]' }
  ];

  const featuredProducts = [
    { 
      id: 1, 
      name: 'PPG Deltron DG Performance Clear Coat', 
      price: 'Rp 850.000', 
      originalPrice: 'Rp 950.000', 
      rating: 4.8, 
      reviews: 124, 
      image: 'https://www.nonpaints.com/media/catalog/product/cache/c1e5b90302e0ac154d65d18958beb758/a/u/autolak_in_blik_2k-1.jpg', 
      badge: 'Best Seller',
      gradient: 'from-[#338aca] to-[#26b7cd]'
    },
    { 
      id: 2, 
      name: 'Sikkens Autocryl 2K Base Coat', 
      price: 'Rp 650.000', 
      rating: 4.9, 
      reviews: 89, 
      image: 'https://www.nonpaints.com/media/catalog/product/cache/c1e5b90302e0ac154d65d18958beb758/a/u/autolak_in_blik_2k-1.jpg', 
      badge: 'Premium',
      gradient: 'from-[#26b7cd] to-[#61bdaf]'
    },
    { 
      id: 3, 
      name: 'BASF R-M Agilis Primer Surfacer', 
      price: 'Rp 425.000', 
      originalPrice: 'Rp 475.000', 
      rating: 4.7, 
      reviews: 203, 
      image: 'https://www.nonpaints.com/media/catalog/product/cache/c1e5b90302e0ac154d65d18958beb758/a/u/autolak_in_blik_2k-1.jpg', 
      badge: 'Promo',
      gradient: 'from-[#61bdaf] to-[#338aca]'
    },
    { 
      id: 4, 
      name: 'Nippon Paint Thinner Standard Grade', 
      price: 'Rp 125.000', 
      rating: 4.6, 
      reviews: 156, 
      image: 'https://www.nonpaints.com/media/catalog/product/cache/c1e5b90302e0ac154d65d18958beb758/a/u/autolak_in_blik_2k-1.jpg', 
      badge: 'Popular',
      gradient: 'from-[#2b2c68] to-[#338aca]'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      
      {/* Mobile Header with Hamburger Menu */}
      {isMobile && (
        <header className="sticky top-0 z-50 glass-dark border-b border-white/10 lg:hidden">
          
          {/* Mobile Menu Dropdown */}
          {isMenuOpen && (
            <div ref={menuRef} className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md rounded-b-2xl shadow-2xl border border-gray-200">
              <div className="p-4 space-y-2">
                <Button variant="ghost" className="w-full justify-start text-gray-700 hover:bg-blue-50 hover:text-blue-600" onClick={() => { navigate('/'); setIsMenuOpen(false); }}>
                  <Home className="h-5 w-5 mr-3" /> Home
                </Button>
                <Button variant="ghost" className="w-full justify-start text-gray-700 hover:bg-blue-50 hover:text-blue-600" onClick={() => { navigate('/catalog'); setIsMenuOpen(false); }}>
                  <LayoutGrid className="h-5 w-5 mr-3" /> Catalog
                </Button>
                <Button variant="ghost" className="w-full justify-start text-gray-700 hover:bg-blue-50 hover:text-blue-600" onClick={() => { navigate('/calculator'); setIsMenuOpen(false); }}>
                  <Palette className="h-5 w-5 mr-3" /> Calculator
                </Button>
                <Button variant="ghost" className="w-full justify-start text-gray-700 hover:bg-blue-50 hover:text-blue-600" onClick={() => { navigate('/profile'); setIsMenuOpen(false); }}>
                  <User className="h-5 w-5 mr-3" /> Account
                </Button>
              </div>
            </div>
          )}
        </header>
      )}
      
      {/* Hero Section - Modern Design */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 gradient-hero"></div>
        <div className="absolute inset-0 paint-pattern opacity-10"></div>
        <div className="absolute inset-0 paint-drops opacity-20"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-[#61bdaf] to-[#26b7cd] rounded-full opacity-20 animate-float"></div>
        <div className="absolute bottom-32 right-16 w-16 h-16 bg-gradient-to-r from-[#338aca] to-[#2b2c68] rounded-full opacity-30 animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/3 right-20 w-12 h-12 bg-gradient-to-r from-[#26b7cd] to-[#61bdaf] rounded-full opacity-25 animate-float" style={{animationDelay: '2s'}}></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in">
            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Professional
              <span className="block bg-gradient-to-r from-[#61bdaf] to-[#26b7cd] bg-clip-text text-transparent">
                Car Paint
              </span>
              Solutions
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed">
              Premium quality automotive paints with cutting-edge technology. 
              Transform your vehicle with our professional-grade solutions.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12 animate-slide-up">
              <Button 
                size="lg" 
                onClick={() => navigate('/catalog')}
                className="px-8 py-4 bg-gradient-to-r from-[#61bdaf] to-[#26b7cd] hover:from-[#26b7cd] hover:to-[#338aca] text-white rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover-lift text-lg font-semibold"
              >
                <Palette className="mr-3 h-6 w-6" />
                Explore Products
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => navigate('/calculator')}
                className="px-8 py-4 border-2 border-white/30 text-dark-grey-blue hover:bg-white/10 rounded-2xl backdrop-blur-sm transition-all duration-300 hover-lift text-lg font-semibold"
              >
                <Droplets className="mr-3 h-6 w-6" />
                Paint Calculator
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto animate-scale-in">
              {[
                { number: '1000+', label: 'Premium Products', icon: Award },
                { number: '50K+', label: 'Happy Customers', icon: Users },
                { number: '99%', label: 'Quality Guarantee', icon: CheckCircle },
                { number: '24/7', label: 'Expert Support', icon: Headphones }
              ].map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 mx-auto mb-4 bg-white/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <stat.icon className="h-8 w-8 text-[#61bdaf]" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
                  <div className="text-gray-300 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Categories Section - Modern Cards */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#191834] to-[#338aca] bg-clip-text text-transparent mb-6">
              Premium Categories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our comprehensive range of professional automotive paint solutions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <Card 
                key={index} 
                className="group cursor-pointer hover-lift bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-3xl overflow-hidden animate-slide-up"
                style={{animationDelay: `${index * 0.1}s`}}
                onClick={() => navigate('/catalog')}
              >
                <CardContent className="p-8 text-center relative">
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                  <div className="relative z-10">
                    <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">
                      {category.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-[#338aca] transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-gray-600 mb-4">{category.count}</p>
                    <div className={`w-16 h-1 bg-gradient-to-r ${category.color} mx-auto rounded-full group-hover:w-24 transition-all duration-300`}></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products - Modern Grid */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-16 animate-fade-in">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#191834] to-[#338aca] bg-clip-text text-transparent mb-4">
                Featured Products
              </h2>
              <p className="text-xl text-gray-600">Premium quality paints trusted by professionals</p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => navigate('/catalog')}
              className="hidden md:flex px-6 py-3 border-2 border-[#338aca] text-[#338aca] hover:bg-[#338aca] hover:text-white rounded-2xl transition-all duration-300 hover-lift"
            >
              View All Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product, index) => (
              <Card 
                key={product.id} 
                className="group cursor-pointer hover-lift bg-white border-0 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-3xl overflow-hidden animate-slide-up"
                style={{animationDelay: `${index * 0.1}s`}}
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${product.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
                    {product.badge && (
                      <Badge className={`absolute top-4 left-4 bg-gradient-to-r ${product.gradient} text-white border-0 px-3 py-1 rounded-full font-semibold animate-scale-in`}>
                        {product.badge}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-3 line-clamp-2 group-hover:text-[#338aca] transition-colors">
                      {product.name}
                    </h3>
                    
                    <div className="flex items-center mb-4">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm ml-1 font-semibold">{product.rating}</span>
                      <span className="text-xs text-gray-500 ml-1">({product.reviews} reviews)</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <span className={`font-bold text-xl bg-gradient-to-r ${product.gradient} bg-clip-text text-transparent`}>
                          {product.price}
                        </span>
                        {product.originalPrice && (
                          <div className="text-sm text-gray-500 line-through">
                            {product.originalPrice}
                          </div>
                        )}
                      </div>
                      <Button 
                        size="sm"
                        className={`bg-gradient-to-r ${product.gradient} hover:shadow-lg transition-all duration-300 rounded-xl px-4 py-2 text-white border-0`}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-r from-[#191834] via-[#2b2c68] to-[#338aca] relative overflow-hidden">
        <div className="absolute inset-0 paint-pattern opacity-10"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Why Choose SiroyAuto?
            </h2>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Professional excellence meets innovative technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Truck,
                title: 'Safe Delivery',
                description: 'Specialized packaging for chemical products with professional handling',
                gradient: 'from-[#61bdaf] to-[#26b7cd]'
              },
              {
                icon: Shield,
                title: 'Original Products',
                description: '100% authentic from authorized distributors with certificates',
                gradient: 'from-[#26b7cd] to-[#338aca]'
              },
              {
                icon: Headphones,
                title: 'Expert Consultation',
                description: 'Professional team ready to help you choose the right products',
                gradient: 'from-[#338aca] to-[#61bdaf]'
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="text-center group animate-slide-up hover-lift"
                style={{animationDelay: `${index * 0.2}s`}}
              >
                <div className={`w-20 h-20 rounded-3xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-2xl`}>
                  <feature.icon className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-[#61bdaf] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comprehensive Footer */}
      <footer className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            {/* Logo Section */}
            <div className="lg:col-span-1">
              <div className="flex items-center mb-6">
                <div className="w-10 h-13 bg-white rounded flex items-center justify-center mr-3">
                  <img src="https://github.com/diatmiko01/Siroy-Paint-Shop/blob/main/Untitled%20design.png?raw=true" alt="Logo" />
                </div>
                <span className="text-xl font-bold">SiroyAuto</span>
              </div>
            </div>

            {/* Company Section */}
            <div>
              <h3 className="text-lg font-semibold mb-6 text-gray-300">Company</h3>
              <ul className="space-y-3">
                <li><button onClick={() => navigate('/about')} className="text-gray-400 hover:text-white transition-colors text-left">About</button></li>
                <li><button onClick={() => navigate('/careers')} className="text-gray-400 hover:text-white transition-colors text-left">Careers</button></li>
                <li><button onClick={() => navigate('/investors')} className="text-gray-400 hover:text-white transition-colors text-left">Investors</button></li>
                <li><button onClick={() => navigate('/press')} className="text-gray-400 hover:text-white transition-colors text-left">Press and Media</button></li>
                <li><button onClick={() => navigate('/partners')} className="text-gray-400 hover:text-white transition-colors text-left">Partners</button></li>
                <li><button onClick={() => navigate('/affiliates')} className="text-gray-400 hover:text-white transition-colors text-left">Affiliates</button></li>
                <li><button onClick={() => navigate('/legal')} className="text-gray-400 hover:text-white transition-colors text-left">Legal</button></li>
                <li><button onClick={() => navigate('/service-status')} className="text-gray-400 hover:text-white transition-colors text-left">Service status</button></li>
              </ul>
            </div>

            {/* Support Section */}
            <div>
              <h3 className="text-lg font-semibold mb-6 text-gray-300">Support</h3>
              <ul className="space-y-3">
                <li><button onClick={() => navigate('/merchant-support')} className="text-gray-400 hover:text-white transition-colors text-left">Merchant Support</button></li>
                <li><button onClick={() => navigate('/help-center')} className="text-gray-400 hover:text-white transition-colors text-left">Help Center</button></li>
                <li><button onClick={() => navigate('/hire-partner')} className="text-gray-400 hover:text-white transition-colors text-left">Hire a Partner</button></li>
                <li><button onClick={() => navigate('/academy')} className="text-gray-400 hover:text-white transition-colors text-left">SiroyAuto Academy</button></li>
                <li><button onClick={() => navigate('/community')} className="text-gray-400 hover:text-white transition-colors text-left">Community</button></li>
              </ul>
            </div>

            {/* Developers Section */}
            <div>
              <h3 className="text-lg font-semibold mb-6 text-gray-300">Payment Support</h3>
              <ul className="space-y-3">
                <li><button onClick={() => navigate('/developers')} className="text-gray-400 hover:text-white transition-colors text-left">Bank Account</button></li>
                <li><button onClick={() => navigate('/api-docs')} className="text-gray-400 hover:text-white transition-colors text-left">e-Wallet</button></li>
                <li><button onClick={() => navigate('/dev-degree')} className="text-gray-400 hover:text-white transition-colors text-left">Qris</button></li>
              </ul>
            </div>

            {/* Products Section */}
            <div>
              <h3 className="text-lg font-semibold mb-6 text-gray-300">Products</h3>
              <ul className="space-y-3">
                <li><button onClick={() => navigate('/catalog')} className="text-gray-400 hover:text-white transition-colors text-left">Shop</button></li>
                <li><button onClick={() => navigate('/premium')} className="text-gray-400 hover:text-white transition-colors text-left">SiroyAuto Plus</button></li>
                <li><button onClick={() => navigate('/enterprise')} className="text-gray-400 hover:text-white transition-colors text-left">SiroyAuto for Enterprise</button></li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col lg:flex-row justify-between items-center">
              {/* Left side - Country and Language */}
              <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-400">🇮🇩 Indonesia</span>
                  <span className="text-gray-600">|</span>
                  <button className="text-sm text-gray-400 hover:text-white">English ▼</button>
                </div>
              </div>

              {/* Center - Legal Links */}
              <div className="flex flex-wrap justify-center space-x-6 mb-4 lg:mb-0">
                <button onClick={() => navigate('/terms')} className="text-sm text-gray-400 hover:text-white">Terms of service</button>
                <button onClick={() => navigate('/privacy')} className="text-sm text-gray-400 hover:text-white">Privacy policy</button>
                <button onClick={() => navigate('/sitemap')} className="text-sm text-gray-400 hover:text-white">Sitemap</button>
                <button onClick={() => navigate('/privacy-choices')} className="text-sm text-gray-400 hover:text-white">Privacy Choices</button>
              </div>

              {/* Right side - Social Media Icons */}
              <div className="flex space-x-4">
                <button onClick={() => window.open('https://facebook.com', '_blank')} className="w-8 h-8 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors">
                  <span className="text-sm">f</span>
                </button>
                <button onClick={() => window.open('https://twitter.com', '_blank')} className="w-8 h-8 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors">
                  <span className="text-sm">𝕏</span>
                </button>
                <button onClick={() => window.open('https://youtube.com', '_blank')} className="w-8 h-8 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors">
                  <span className="text-sm">▶</span>
                </button>
                <button onClick={() => window.open('https://instagram.com', '_blank')} className="w-8 h-8 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors">
                  <span className="text-sm">📷</span>
                </button>
                <button onClick={() => window.open('https://tiktok.com', '_blank')} className="w-8 h-8 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors">
                  <span className="text-sm">🎵</span>
                </button>
                <button onClick={() => window.open('https://linkedin.com', '_blank')} className="w-8 h-8 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors">
                  <span className="text-sm">in</span>
                </button>
                <button onClick={() => window.open('https://pinterest.com', '_blank')} className="w-8 h-8 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors">
                  <span className="text-sm">📌</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-300 px-4 py-3 z-50 shadow-lg">
          <div className="flex justify-around items-center">
            <button onClick={() => navigate('/')} className="flex flex-col items-center p-2 text-gray-700 hover:text-blue-600 transition-colors">
              <Home className="h-6 w-6" />
              <span className="text-xs mt-1 font-medium">Home</span>
            </button>
            <button onClick={() => navigate('/catalog')} className="flex flex-col items-center p-2 text-gray-700 hover:text-blue-600 transition-colors">
              <ShoppingBag className="h-6 w-6" />
              <span className="text-xs mt-1 font-medium">Catalog</span>
            </button>
            <button onClick={() => navigate('/cart')} className="flex flex-col items-center p-2 text-gray-700 hover:text-blue-600 transition-colors relative">
              <ShoppingCart className="h-6 w-6" />
              <span className="text-xs mt-1 font-medium">Cart</span>
              {cartItemCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-md">
                  {cartItemCount}
                </div>
              )}
            </button>
            <button onClick={() => navigate('/profile')} className="flex flex-col items-center p-2 text-gray-700 hover:text-blue-600 transition-colors">
              <User className="h-6 w-6" />
              <span className="text-xs mt-1 font-medium">Profile</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
