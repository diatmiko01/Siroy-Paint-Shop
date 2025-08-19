import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Star, ShoppingCart, Heart, Share2, Truck, Shield, MessageCircle, ChevronLeft, Plus, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Review {
  id: number;
  user: string;
  rating: number;
  date: string;
  comment: string;
  images?: string[];
  verified: boolean;
}

interface QA {
  id: number;
  question: string;
  answer: string;
  date: string;
  helpful: number;
}

export default function ProductDetail() {
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState('1L');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const product = {
    id: 1,
    name: 'PPG Deltron DG Performance Clear Coat',
    brand: 'PPG',
    type: 'Clear Coat',
    finish: 'Glossy',
    price: 850000,
    originalPrice: 950000,
    rating: 4.8,
    reviews: 124,
    badge: 'Best Seller',
    inStock: true,
    images: [
      '/api/placeholder/600/600',
      '/api/placeholder/600/600',
      '/api/placeholder/600/600',
      '/api/placeholder/600/600'
    ],
    sizes: [
      { size: '500ml', price: 450000, stock: 15 },
      { size: '1L', price: 850000, originalPrice: 950000, stock: 8 },
      { size: '4L', price: 3200000, originalPrice: 3600000, stock: 3 }
    ],
    description: 'PPG Deltron DG Performance Clear Coat adalah lapisan pelindung premium yang memberikan kilap superior dan perlindungan jangka panjang. Diformulasikan khusus untuk aplikasi automotive professional dengan teknologi advanced UV protection.',
    specifications: {
      'Jenis': 'Clear Coat 2K',
      'Teknologi': 'Polyurethane',
      'Kilap': 'High Gloss (>90)',
      'Rasio Campuran': '2:1 (Clear:Hardener)',
      'Pot Life': '4-6 jam (20°C)',
      'Drying Time': '30-45 menit',
      'Curing Time': '24 jam full cure',
      'Coverage': '12-14 m²/L',
      'VOC Content': '<420 g/L',
      'Aplikasi': 'Spray Gun 1.3-1.4mm'
    },
    features: [
      'Ketahanan UV superior hingga 10 tahun',
      'Scratch resistance tinggi',
      'Chemical resistance excellent',
      'Easy polishing untuk maintenance',
      'Kompatibel dengan semua base coat',
      'Low VOC formula ramah lingkungan'
    ],
    compatibleCars: ['Toyota', 'Honda', 'Suzuki', 'Daihatsu', 'Mitsubishi', 'BMW', 'Mercedes', 'Audi'],
    usage: [
      'Pastikan permukaan bersih dan kering',
      'Campurkan clear coat dengan hardener (2:1)',
      'Tambahkan thinner jika perlu (maksimal 10%)',
      'Aplikasikan 2-3 lapis tipis',
      'Jarak semprot 15-20cm',
      'Flash time antar lapis 5-10 menit'
    ]
  };

  const reviews: Review[] = [
    {
      id: 1,
      user: 'Bengkel Pro Auto',
      rating: 5,
      date: '2024-01-15',
      comment: 'Hasil sangat memuaskan! Kilap bertahan lama dan mudah di-polish. Sudah pakai untuk 20+ mobil customer, semuanya puas.',
      images: ['/api/placeholder/100/100', '/api/placeholder/100/100'],
      verified: true
    },
    {
      id: 2,
      user: 'Agus Modifikator',
      rating: 5,
      date: '2024-01-10',
      comment: 'Clear coat terbaik yang pernah saya pakai. Scratch resistance-nya luar biasa. Worth the price!',
      verified: true
    },
    {
      id: 3,
      user: 'DIY Enthusiast',
      rating: 4,
      date: '2024-01-08',
      comment: 'Bagus tapi agak tricky untuk pemula. Perlu teknik yang tepat, tapi hasilnya professional banget.',
      verified: true
    }
  ];

  const qas: QA[] = [
    {
      id: 1,
      question: 'Apakah bisa diaplikasikan manual tanpa spray gun?',
      answer: 'Untuk hasil terbaik, sangat disarankan menggunakan spray gun. Aplikasi manual dengan kuas akan menghasilkan texture yang kurang halus.',
      date: '2024-01-12',
      helpful: 15
    },
    {
      id: 2,
      question: 'Berapa lama masa simpan produk ini?',
      answer: 'Masa simpan hingga 2 tahun jika disimpan di tempat sejuk dan kering, kemasan tertutup rapat.',
      date: '2024-01-10',
      helpful: 8
    }
  ];

  const selectedSizeData = product.sizes.find(s => s.size === selectedSize);
  const currentPrice = selectedSizeData?.price || product.price;
  const currentOriginalPrice = selectedSizeData?.originalPrice;
  const currentStock = selectedSizeData?.stock || 0;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= currentStock) {
      setQuantity(newQuantity);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button variant="ghost" size="sm" className="mr-4" onClick={() => navigate(-1)}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Kembali
              </Button>
              <h1 className="text-2xl font-bold text-gray-900 cursor-pointer" onClick={() => navigate('/')}>SiroyAuto</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">Login</Button>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => navigate('/cart')}>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Cart (0)
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <div className="relative mb-4">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg"
              />
              {product.badge && (
                <Badge className="absolute top-4 left-4 bg-blue-600">{product.badge}</Badge>
              )}
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  className={`w-full h-20 object-cover rounded-lg cursor-pointer border-2 transition-colors ${
                    selectedImage === index ? 'border-blue-600' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedImage(index)}
                />
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Badge variant="outline">{product.brand}</Badge>
                <Badge variant="secondary">{product.type}</Badge>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-4">{product.name}</h1>

            <div className="flex items-center mb-6">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-600">
                {product.rating} ({product.reviews} ulasan)
              </span>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline space-x-2 mb-2">
                <span className="text-3xl font-bold text-blue-600">{formatPrice(currentPrice)}</span>
                {currentOriginalPrice && (
                  <span className="text-lg text-gray-500 line-through">{formatPrice(currentOriginalPrice)}</span>
                )}
                {currentOriginalPrice && (
                  <Badge className="bg-red-500">
                    -{Math.round(((currentOriginalPrice - currentPrice) / currentOriginalPrice) * 100)}%
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-600">Harga sudah termasuk PPN</p>
            </div>

            {/* Size Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-3">Ukuran Kemasan</label>
              <div className="grid grid-cols-3 gap-3">
                {product.sizes.map((size) => (
                  <Button
                    key={size.size}
                    variant={selectedSize === size.size ? 'default' : 'outline'}
                    className="h-auto p-3 flex flex-col"
                    onClick={() => {
                      setSelectedSize(size.size);
                      setQuantity(1);
                    }}
                  >
                    <span className="font-semibold">{size.size}</span>
                    <span className="text-xs">Stok: {size.stock}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-3">Jumlah</label>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (val >= 1 && val <= currentStock) {
                      setQuantity(val);
                    }
                  }}
                  className="w-20 text-center"
                  min="1"
                  max={currentStock}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= currentStock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <span className="text-sm text-gray-600">dari {currentStock} tersedia</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 mb-6">
              <Button className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Tambah ke Keranjang - {formatPrice(currentPrice * quantity)}
              </Button>
              <Button variant="outline" className="w-full" size="lg">
                Beli Sekarang
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <Truck className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <p className="text-xs text-gray-600">Pengiriman Aman</p>
              </div>
              <div className="text-center">
                <Shield className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <p className="text-xs text-gray-600">Produk Original</p>
              </div>
              <div className="text-center">
                <MessageCircle className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <p className="text-xs text-gray-600">Konsultasi Gratis</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-12">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="description">Deskripsi</TabsTrigger>
              <TabsTrigger value="specifications">Spesifikasi</TabsTrigger>
              <TabsTrigger value="usage">Cara Pakai</TabsTrigger>
              <TabsTrigger value="reviews">Ulasan ({product.reviews})</TabsTrigger>
              <TabsTrigger value="qa">Q&A ({qas.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <p className="text-gray-700 mb-6">{product.description}</p>
                  
                  <h3 className="font-semibold text-lg mb-4">Keunggulan Utama:</h3>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Separator className="my-6" />
                  
                  <h3 className="font-semibold text-lg mb-4">Kompatibilitas Merek Mobil:</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.compatibleCars.map((car) => (
                      <Badge key={car} variant="secondary">{car}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="specifications" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium text-gray-700">{key}</span>
                        <span className="text-gray-900">{value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="usage" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">Petunjuk Aplikasi:</h3>
                  <ol className="space-y-3">
                    {product.usage.map((step, index) => (
                      <li key={index} className="flex items-start">
                        <span className="bg-blue-600 text-white text-sm rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                          {index + 1}
                        </span>
                        <span className="text-gray-700">{step}</span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              <div className="space-y-6">
                {reviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center mb-2">
                            <span className="font-semibold">{review.user}</span>
                            {review.verified && (
                              <Badge variant="secondary" className="ml-2 text-xs">Verified</Badge>
                            )}
                          </div>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                                }`}
                              />
                            ))}
                            <span className="ml-2 text-sm text-gray-600">{review.date}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-4">{review.comment}</p>
                      {review.images && (
                        <div className="flex space-x-2">
                          {review.images.map((image, index) => (
                            <img
                              key={index}
                              src={image}
                              alt={`Review ${index + 1}`}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="qa" className="mt-6">
              <div className="space-y-6">
                {qas.map((qa) => (
                  <Card key={qa.id}>
                    <CardContent className="p-6">
                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Q: {qa.question}</h4>
                        <p className="text-gray-700 mb-3">A: {qa.answer}</p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>{qa.date}</span>
                          <span>{qa.helpful} orang merasa ini membantu</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                <Card>
                  <CardHeader>
                    <CardTitle>Punya Pertanyaan?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Textarea placeholder="Tulis pertanyaan Anda di sini..." />
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        Kirim Pertanyaan
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}