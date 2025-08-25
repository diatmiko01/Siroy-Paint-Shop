import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft, Truck, CreditCard, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';

interface CartItem {
  id: number;
  name: string;
  brand: string;
  size: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  image: string;
  inStock: boolean;
}

export default function ShoppingCartPage() {
  const navigate = useNavigate();
  
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      name: 'PPG Deltron DG Performance Clear Coat',
      brand: 'PPG',
      size: '1L',
      price: 850000,
      originalPrice: 950000,
      quantity: 2,
      image: '/api/placeholder/100/100',
      inStock: true
    },
    {
      id: 2,
      name: 'Sikkens Autocryl 2K Base Coat - Pearl White',
      brand: 'Sikkens',
      size: '500ml',
      price: 650000,
      quantity: 1,
      image: '/api/placeholder/100/100',
      inStock: true
    },
    {
      id: 3,
      name: 'BASF R-M Agilis Primer Surfacer',
      brand: 'BASF',
      size: '1L',
      price: 425000,
      originalPrice: 475000,
      quantity: 1,
      image: '/api/placeholder/100/100',
      inStock: false
    }
  ]);

  const [promoCode, setPromoCode] = useState('');
  const [selectedItems, setSelectedItems] = useState<number[]>([1, 2]);
  const [shippingMethod, setShippingMethod] = useState('regular');

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id);
      return;
    }
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: Math.max(0, newQuantity) } : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
    setSelectedItems(selected => selected.filter(itemId => itemId !== id));
  };

  const toggleSelectItem = (id: number) => {
    setSelectedItems(selected =>
      selected.includes(id)
        ? selected.filter(itemId => itemId !== id)
        : [...selected, id]
    );
  };

  const selectAllItems = () => {
    const allAvailableIds = cartItems.filter(item => item.inStock).map(item => item.id);
    setSelectedItems(allAvailableIds);
  };

  const deselectAllItems = () => {
    setSelectedItems([]);
  };

  const selectedCartItems = cartItems.filter(item => selectedItems.includes(item.id) && item.inStock);
  const subtotal = selectedCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const savings = selectedCartItems.reduce((sum, item) => {
    if (item.originalPrice) {
      return sum + ((item.originalPrice - item.price) * item.quantity);
    }
    return sum;
  }, 0);

  const shippingOptions = [
    { value: 'regular', label: 'Regular (7-14 hari)', price: 25000 },
    { value: 'express', label: 'Express (3-5 hari)', price: 45000 },
    { value: 'same_day', label: 'Same Day (Jakarta only)', price: 75000 },
    { value: 'cargo', label: 'Cargo Khusus Cairan', price: 35000 }
  ];

  const selectedShipping = shippingOptions.find(option => option.value === shippingMethod);
  const shippingCost = selectedShipping?.price || 0;
  
  const promoDiscount = promoCode === 'WELCOME10' ? subtotal * 0.1 : 0;
  const total = subtotal + shippingCost - promoDiscount;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const applyPromoCode = () => {
    // Simple promo code validation
    if (promoCode === 'WELCOME10') {
      alert('Kode promo berhasil diterapkan! Diskon 10%');
    } else if (promoCode) {
      alert('Kode promo tidak valid');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          {/* Bagian Kiri: Judul */}
          <div className="flex items-center">
            <ShoppingCart className="h-8 w-8 text-blue-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">Keranjang Belanja</h2>
            <Badge variant="secondary" className="ml-4">
              {cartItems.length} item
            </Badge>
          </div>
          {/* Bagian Kanan: Tombol Kembali */}
          <div>
            <Button variant="outline" onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Beranda
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Items di Keranjang</CardTitle>
                  <div className="flex items-center space-x-2 text-sm">
                    <Button variant="ghost" size="sm" onClick={selectAllItems}>
                      Pilih Semua
                    </Button>
                    <Button variant="ghost" size="sm" onClick={deselectAllItems}>
                      Batal Pilih
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Keranjang Kosong</h3>
                    <p className="text-gray-600 mb-6">Belum ada produk di keranjang Anda</p>
                    <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => navigate('/catalog')}>
                      Mulai Belanja
                    </Button>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div key={item.id} className={`border rounded-lg p-4 ${!item.inStock ? 'bg-gray-50 opacity-75' : ''}`}>
                      <div className="flex items-start space-x-4">
                        <Checkbox
                          checked={selectedItems.includes(item.id) && item.inStock}
                          onCheckedChange={() => toggleSelectItem(item.id)}
                          disabled={!item.inStock}
                        />
                        
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                              <div className="flex items-center space-x-2 mb-2">
                                <Badge variant="outline" className="text-xs">{item.brand}</Badge>
                                <Badge variant="secondary" className="text-xs">{item.size}</Badge>
                                {!item.inStock && (
                                  <Badge variant="destructive" className="text-xs">Stok Habis</Badge>
                                )}
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="font-bold text-blue-600">{formatPrice(item.price)}</span>
                                {item.originalPrice && (
                                  <span className="text-sm text-gray-500 line-through">
                                    {formatPrice(item.originalPrice)}
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(item.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                disabled={!item.inStock}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <Input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                                className="w-16 text-center"
                                min="1"
                                disabled={!item.inStock}
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                disabled={!item.inStock}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="text-right">
                              <span className="font-semibold">
                                {formatPrice(item.price * item.quantity)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Ringkasan Pesanan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Promo Code */}
                <div>
                  <label className="block text-sm font-medium mb-2">Kode Promo</label>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Masukkan kode promo"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                    />
                    <Button variant="outline" onClick={applyPromoCode}>
                      <Tag className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Coba: WELCOME10</p>
                </div>

                <Separator />

                {/* Shipping */}
                <div>
                  <label className="block text-sm font-medium mb-2">Metode Pengiriman</label>
                  <Select value={shippingMethod} onValueChange={setShippingMethod}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {shippingOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex justify-between items-center w-full">
                            <span>{option.label}</span>
                            <span className="ml-2">{formatPrice(option.price)}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal ({selectedCartItems.length} item)</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  
                  {savings > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Hemat</span>
                      <span>-{formatPrice(savings)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-sm">
                    <span>Ongkir</span>
                    <span>{formatPrice(shippingCost)}</span>
                  </div>
                  
                  {promoDiscount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Diskon Promo</span>
                      <span>-{formatPrice(promoDiscount)}</span>
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span className="text-blue-600">{formatPrice(total)}</span>
                  </div>
                </div>

                <Separator />

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700" 
                    size="lg"
                    disabled={selectedItems.length === 0}
                    onClick={() => navigate('/checkout')}
                  >
                    <CreditCard className="h-5 w-5 mr-2" />
                    Checkout ({selectedItems.length} item)
                  </Button>
                  
                  <Button variant="outline" className="w-full">
                    <Truck className="h-5 w-5 mr-2" />
                    Cek Ongkir
                  </Button>
                </div>

                {/* Trust Indicators */}
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <h4 className="font-medium text-sm">Keamanan Transaksi</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Pembayaran 100% aman</li>
                    <li>• Garansi uang kembali</li>
                    <li>• Pengiriman asuransi</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recommended Products */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Mungkin Anda Tertarik</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <img
                    src={`/api/placeholder/200/200`}
                    alt={`Recommended Product ${i}`}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                  <h4 className="font-semibold text-sm mb-2">Produk Rekomendasi {i}</h4>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-blue-600">Rp 250.000</span>
                    <Button size="sm" variant="outline">
                      Tambah
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}