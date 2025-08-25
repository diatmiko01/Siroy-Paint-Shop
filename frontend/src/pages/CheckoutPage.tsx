import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CreditCard, Loader2, Wallet, Plus, MapPin, Edit } from 'lucide-react';
import { useWallet } from '@/components/context/WalletContext';
import { paymentService, PAYMENT_METHODS } from '@/services/paymentService';
import { addressService, Address } from '@/services/addressService';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { balance, payWithWallet } = useWallet();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [useManualAddress, setUseManualAddress] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: ''
  });

  useEffect(() => {
    const dummyItems: CartItem[] = [
      { id: 1, name: 'PPG Deltron DG Performance Clear Coat', price: 850000, quantity: 2, image: '/api/placeholder/100/100' },
      { id: 2, name: 'Sikkens Autocryl 2K Base Coat - Pearl White', price: 650000, quantity: 1, image: '/api/placeholder/100/100' },
    ];
    setCartItems(dummyItems);
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      const data = await addressService.getAddresses();
      setAddresses(data);
      
      // Auto-select default address if available
      const defaultAddress = data.find(addr => addr.isDefault);
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id);
        setCustomerInfo(prev => ({
          ...prev,
          name: defaultAddress.name,
          phone: defaultAddress.phone,
          address: `${defaultAddress.address}, ${defaultAddress.city}, ${defaultAddress.province} ${defaultAddress.postalCode}`,
          city: defaultAddress.city,
          postalCode: defaultAddress.postalCode
        }));
      }
    } catch (error) {
      console.error('Error loading addresses:', error);
    }
  };

  const handleAddressSelect = (addressId: string) => {
    setSelectedAddressId(addressId);
    const selectedAddress = addresses.find(addr => addr.id === addressId);
    if (selectedAddress) {
      setCustomerInfo(prev => ({
        ...prev,
        name: selectedAddress.name,
        phone: selectedAddress.phone,
        address: `${selectedAddress.address}, ${selectedAddress.city}, ${selectedAddress.province} ${selectedAddress.postalCode}`,
        city: selectedAddress.city,
        postalCode: selectedAddress.postalCode
      }));
      setUseManualAddress(false);
    }
  };

  const handleManualAddressToggle = () => {
    setUseManualAddress(!useManualAddress);
    if (!useManualAddress) {
      setSelectedAddressId('');
      setCustomerInfo(prev => ({
        ...prev,
        address: '',
        city: '',
        postalCode: ''
      }));
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = 25000;
  const total = subtotal + shippingCost;

  const formatPrice = (price: number) => new Intl.NumberFormat('id-ID', { 
    style: 'currency', 
    currency: 'IDR', 
    minimumFractionDigits: 0 
  }).format(price);

  const handlePayWithWallet = async () => {
    if (!balance || balance.balance < total) {
      alert('Insufficient wallet balance. Please top-up your wallet first.');
      return;
    }

    setIsLoading(true);
    try {
      const orderId = `SROY-${Date.now()}`;
      const success = await payWithWallet(
        orderId, 
        total, 
        `Payment for order ${orderId}`
      );

      if (success) {
        const orderDetails = {
          orderId,
          items: cartItems,
          total,
          paymentMethod: 'wallet',
          date: new Date().toLocaleDateString('id-ID', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })
        };
        localStorage.setItem('lastOrder', JSON.stringify(orderDetails));
        navigate(`/order-status/${orderId}`);
      } else {
        alert('Payment failed. Please try again.');
      }
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayWithGateway = async () => {
    if (!selectedPaymentMethod) {
      alert('Please select a payment method');
      return;
    }

    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      alert('Please fill in all required customer information');
      return;
    }

    setIsLoading(true);
    try {
      const orderId = `SROY-${Date.now()}`;
      
      const paymentRequest = {
        orderId,
        amount: total,
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone,
        paymentMethod: selectedPaymentMethod
      };

      const paymentResponse = await paymentService.createPayment(paymentRequest);

      if (paymentResponse.success) {
        const orderDetails = {
          orderId,
          items: cartItems,
          total,
          paymentMethod: selectedPaymentMethod,
          paymentId: paymentResponse.paymentId,
          virtualAccount: paymentResponse.virtualAccount,
          qrisCode: paymentResponse.qrisCode,
          instructions: paymentResponse.instructions,
          date: new Date().toLocaleDateString('id-ID', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })
        };
        localStorage.setItem('lastOrder', JSON.stringify(orderDetails));
        navigate(`/order-status/${orderId}`);
      } else {
        alert(`Payment creation failed: ${paymentResponse.error}`);
      }
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button variant="ghost" onClick={() => navigate('/cart')} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Keranjang
        </Button>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Side: Customer Info & Payment Methods */}
          <div className="space-y-6">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle>Informasi Pelanggan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Lengkap *</Label>
                  <Input 
                    id="name" 
                    placeholder="John Doe"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input 
                    id="email" 
                    type="email"
                    placeholder="john@example.com"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Nomor Telepon *</Label>
                  <Input 
                    id="phone" 
                    type="tel" 
                    placeholder="+62 812-3456-7890"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Alamat Lengkap</Label>
                  <Input 
                    id="address" 
                    placeholder="Jl. Jend. Sudirman No. 123"
                    value={customerInfo.address}
                    onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Kota</Label>
                    <Input 
                      id="city" 
                      placeholder="Jakarta"
                      value={customerInfo.city}
                      onChange={(e) => setCustomerInfo({...customerInfo, city: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postal-code">Kode Pos</Label>
                    <Input 
                      id="postal-code" 
                      placeholder="12345"
                      value={customerInfo.postalCode}
                      onChange={(e) => setCustomerInfo({...customerInfo, postalCode: e.target.value})}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <MapPin className="mr-2 h-5 w-5" />
                    Alamat Pengiriman
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/profile/shipping-address')}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Kelola Alamat
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {addresses.length > 0 && !useManualAddress ? (
                  <div className="space-y-3">
                    <Label>Pilih Alamat Tersimpan</Label>
                    <Select value={selectedAddressId} onValueChange={handleAddressSelect}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih alamat pengiriman" />
                      </SelectTrigger>
                      <SelectContent>
                        {addresses.map((address) => (
                          <SelectItem key={address.id} value={address.id}>
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{address.name}</span>
                                {address.isDefault && (
                                  <Badge variant="secondary" className="text-xs">Default</Badge>
                                )}
                                <Badge variant="outline" className="text-xs">{address.label}</Badge>
                              </div>
                              <span className="text-sm text-gray-500 truncate">
                                {address.address}, {address.city}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    {selectedAddressId && (
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        {(() => {
                          const selectedAddress = addresses.find(addr => addr.id === selectedAddressId);
                          return selectedAddress ? (
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{selectedAddress.name}</span>
                                <span className="text-sm text-gray-600">({selectedAddress.phone})</span>
                              </div>
                              <p className="text-sm text-gray-700">{selectedAddress.address}</p>
                              <p className="text-sm text-gray-600">
                                {selectedAddress.city}, {selectedAddress.province} {selectedAddress.postalCode}
                              </p>
                            </div>
                          ) : null;
                        })()}
                      </div>
                    )}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleManualAddressToggle}
                      className="w-full"
                    >
                      Gunakan Alamat Lain
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {addresses.length > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleManualAddressToggle}
                        className="w-full"
                      >
                        Gunakan Alamat Tersimpan
                      </Button>
                    )}
                    
                    <div className="space-y-2">
                      <Label>Alamat Manual</Label>
                      <Input
                        placeholder="Masukkan alamat lengkap"
                        value={useManualAddress ? customerInfo.address : ''}
                        onChange={(e) => useManualAddress && setCustomerInfo({...customerInfo, address: e.target.value})}
                        disabled={!useManualAddress && addresses.length > 0}
                      />
                    </div>
                    
                    {addresses.length === 0 && (
                      <div className="text-center py-4">
                        <p className="text-sm text-gray-500 mb-3">
                          Belum ada alamat tersimpan
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate('/profile/shipping-address/add')}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Tambah Alamat Baru
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card>
              <CardHeader>
                <CardTitle>Metode Pembayaran</CardTitle>
                <CardDescription>Pilih metode pembayaran yang Anda inginkan</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Wallet Payment Option */}
                <div className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  selectedPaymentMethod === 'wallet' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedPaymentMethod('wallet')}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Wallet className="h-6 w-6 text-blue-600" />
                      <div>
                        <p className="font-medium">Siroy Wallet</p>
                        <p className="text-sm text-gray-500">
                          Saldo: {balance ? formatPrice(balance.balance) : formatPrice(0)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">Instan</Badge>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate('/top-up');
                        }}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Top-up
                      </Button>
                    </div>
                  </div>
                  {balance && balance.balance < total && (
                    <p className="text-sm text-red-600 mt-2">
                      Saldo tidak mencukupi. Silakan top-up terlebih dahulu.
                    </p>
                  )}
                </div>

                {/* Other Payment Methods */}
                {PAYMENT_METHODS.map((method) => (
                  <div
                    key={method.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedPaymentMethod === method.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedPaymentMethod(method.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{method.icon}</span>
                        <div>
                          <p className="font-medium">{method.name}</p>
                          <p className="text-sm text-gray-500">{method.description}</p>
                        </div>
                      </div>
                      <Badge variant="secondary">{method.processingTime}</Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Side: Order Summary */}
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Ringkasan Pesanan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                      <div className="flex items-center">
                        <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-md mr-3" />
                        <div>
                          <p className="font-medium line-clamp-1">{item.name}</p>
                          <p className="text-gray-500">x{item.quantity}</p>
                        </div>
                      </div>
                      <p>{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
                <Separator />
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pengiriman</span>
                    <span>{formatPrice(shippingCost)}</span>
                  </div>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>

                {selectedPaymentMethod === 'wallet' ? (
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700" 
                    size="lg"
                    onClick={handlePayWithWallet}
                    disabled={isLoading || !balance || balance.balance < total}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Memproses...
                      </>
                    ) : (
                      <>
                        <Wallet className="mr-2 h-5 w-5" />
                        Bayar dengan Wallet ({formatPrice(total)})
                      </>
                    )}
                  </Button>
                ) : (
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700" 
                    size="lg"
                    onClick={handlePayWithGateway}
                    disabled={isLoading || !selectedPaymentMethod}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Memproses...
                      </>
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-5 w-5" />
                        Bayar Sekarang ({formatPrice(total)})
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
