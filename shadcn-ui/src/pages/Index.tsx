import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, ShoppingCart, Star, Truck, Shield, Headphones } from 'lucide-react';

export default function Index() {
  const categories = [
    { name: 'Cat Dasar (Primer)', icon: '🎨', count: '150+ Produk' },
    { name: 'Cat Warna (Base Coat)', icon: '🌈', count: '500+ Warna' },
    { name: 'Clear Coat', icon: '✨', count: '80+ Produk' },
    { name: 'Thinner & Hardener', icon: '🧪', count: '60+ Produk' },
    { name: 'Peralatan Semprot', icon: '🔧', count: '200+ Produk' },
    { name: 'Aksesoris', icon: '📦', count: '300+ Produk' }
  ];

  const featuredProducts = [
    {
      id: 1,
      name: 'PPG Deltron DG Performance Clear Coat',
      price: 'Rp 850.000',
      originalPrice: 'Rp 950.000',
      rating: 4.8,
      reviews: 124,
      image: '/api/placeholder/300/300',
      badge: 'Best Seller'
    },
    {
      id: 2,
      name: 'Sikkens Autocryl 2K Base Coat - Pearl White',
      price: 'Rp 650.000',
      rating: 4.9,
      reviews: 89,
      image: '/api/placeholder/300/300',
      badge: 'Premium'
    },
    {
      id: 3,
      name: 'BASF R-M Agilis Primer Surfacer',
      price: 'Rp 425.000',
      originalPrice: 'Rp 475.000',
      rating: 4.7,
      reviews: 203,
      image: '/api/placeholder/300/300',
      badge: 'Promo'
    },
    {
      id: 4,
      name: 'Nippon Paint Thinner Standard Grade',
      price: 'Rp 125.000',
      rating: 4.6,
      reviews: 156,
      image: '/api/placeholder/300/300',
      badge: 'Popular'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">SiroyAuto</h1>
              <span className="ml-2 text-sm text-gray-500">Professional Paint</span>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Cari cat mobil, kode warna, atau merek..."
                  className="pl-10 pr-4 w-full"
                />
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Headphones className="h-4 w-4 mr-2" />
                Live Chat
              </Button>
              <Button variant="outline" size="sm">
                Login
              </Button>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Cart (0)
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-4">
                Solusi Lengkap Cat Mobil Professional
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Dari primer hingga clear coat, temukan semua kebutuhan cat mobil berkualitas tinggi dengan harga terbaik
              </p>
              <div className="flex space-x-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  Jelajahi Produk
                </Button>
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-gray-900">
                  Kalkulator Cat
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-lg p-6 shadow-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🔥 Flash Sale Hari Ini</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">PPG Clear Coat Premium</span>
                    <Badge className="bg-red-500">-20%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Sikkens Base Coat Metallic</span>
                    <Badge className="bg-red-500">-15%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">BASF Primer Complete Set</span>
                    <Badge className="bg-red-500">-25%</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Kategori Produk Unggulan</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-3">{category.icon}</div>
                  <h3 className="font-semibold text-sm mb-2">{category.name}</h3>
                  <p className="text-xs text-gray-500">{category.count}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Produk Terlaris</h2>
            <Button variant="outline">Lihat Semua</Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <Badge className="absolute top-2 left-2 bg-blue-600">{product.badge}</Badge>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-sm mb-2 line-clamp-2">{product.name}</h3>
                    <div className="flex items-center mb-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm ml-1">{product.rating}</span>
                      <span className="text-xs text-gray-500 ml-1">({product.reviews})</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-lg text-blue-600">{product.price}</span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-500 line-through ml-2">
                            {product.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>
                    <Button className="w-full mt-3 bg-blue-600 hover:bg-blue-700" size="sm">
                      Tambah ke Keranjang
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Pengiriman Aman</h3>
              <p className="text-gray-600">Khusus cairan & bahan kimia dengan packaging profesional</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Produk Original</h3>
              <p className="text-gray-600">100% original dari distributor resmi dengan sertifikat</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Headphones className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Konsultasi Gratis</h3>
              <p className="text-gray-600">Tim expert siap membantu pemilihan produk yang tepat</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Dapatkan Update Terbaru</h2>
          <p className="text-gray-300 mb-8">
            Tips, tutorial, dan promo eksklusif langsung ke email Anda
          </p>
          <div className="max-w-md mx-auto flex space-x-4">
            <Input
              placeholder="Masukkan email Anda"
              className="flex-1 bg-white text-gray-900"
            />
            <Button className="bg-blue-600 hover:bg-blue-700">
              Subscribe
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">SiroyAuto</h3>
              <p className="text-gray-300 text-sm">
                Platform e-commerce terpercaya untuk semua kebutuhan cat mobil dan perlengkapan otomotif.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Produk</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>Cat Dasar</li>
                <li>Cat Warna</li>
                <li>Clear Coat</li>
                <li>Peralatan</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Layanan</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>Konsultasi Gratis</li>
                <li>Color Matching</li>
                <li>Kalkulator Cat</li>
                <li>Training Workshop</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Dukungan</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>Live Chat</li>
                <li>FAQ</li>
                <li>Panduan Teknis</li>
                <li>Hubungi Kami</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-300">
            <p>&copy; 2024 SiroyAuto. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}