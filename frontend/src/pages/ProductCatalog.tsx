import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Search, Filter, Star, ShoppingCart, Grid, List } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { products, getPrimaryImage, Product } from '@/products';

export default function ProductCatalog() {
  const navigate = useNavigate();
  
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedFinishes, setSelectedFinishes] = useState<string[]>([]);
  const [selectedCarBrands, setSelectedCarBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [minRating, setMinRating] = useState(0);
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const brands = [...new Set(products.map(p => p.brand))];
  const types = [...new Set(products.map(p => p.type))];
  const finishes = [...new Set(products.map(p => p.finish).filter(f => f !== 'N/A'))];
  const carBrands = [...new Set(products.flatMap(p => p.compatibleCars))];

  useEffect(() => {
    const filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (product.colorCode && product.colorCode.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(product.type);
      const matchesFinish = selectedFinishes.length === 0 || selectedFinishes.includes(product.finish);
      const matchesCarBrand = selectedCarBrands.length === 0 || 
                             product.compatibleCars.some(car => selectedCarBrands.includes(car));
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      const matchesRating = product.rating >= minRating;
      const matchesStock = !showInStockOnly || product.inStock;

      return matchesSearch && matchesBrand && matchesType && matchesFinish && 
             matchesCarBrand && matchesPrice && matchesRating && matchesStock;
    });

    // Sort products
    switch (sortBy) {
      case 'price_low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // Keep original order for relevance
        break;
    }

    setFilteredProducts(filtered);
  }, [products, searchQuery, selectedBrands, selectedTypes, selectedFinishes, selectedCarBrands, 
      priceRange, minRating, showInStockOnly, sortBy]);

  const handleBrandChange = (brand: string, checked: boolean) => {
    if (checked) {
      setSelectedBrands([...selectedBrands, brand]);
    } else {
      setSelectedBrands(selectedBrands.filter(b => b !== brand));
    }
  };

  const handleTypeChange = (type: string, checked: boolean) => {
    if (checked) {
      setSelectedTypes([...selectedTypes, type]);
    } else {
      setSelectedTypes(selectedTypes.filter(t => t !== type));
    }
  };

  const handleFinishChange = (finish: string, checked: boolean) => {
    if (checked) {
      setSelectedFinishes([...selectedFinishes, finish]);
    } else {
      setSelectedFinishes(selectedFinishes.filter(f => f !== finish));
    }
  };

  const handleCarBrandChange = (carBrand: string, checked: boolean) => {
    if (checked) {
      setSelectedCarBrands([...selectedCarBrands, carBrand]);
    } else {
      setSelectedCarBrands(selectedCarBrands.filter(cb => cb !== carBrand));
    }
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedBrands([]);
    setSelectedTypes([]);
    setSelectedFinishes([]);
    setSelectedCarBrands([]);
    setPriceRange([0, 1000000]);
    setMinRating(0);
    setShowInStockOnly(false);
    setSortBy('relevance');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  Filter
                </h3>
                <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                  Clear All
                </Button>
              </div>

              <div className="space-y-6">
                {/* Brand Filter */}
                <div>
                  <h4 className="font-medium mb-3">Merek</h4>
                  <div className="space-y-2">
                    {brands.map(brand => (
                      <div key={brand} className="flex items-center space-x-2">
                        <Checkbox
                          id={`brand-${brand}`}
                          checked={selectedBrands.includes(brand)}
                          onCheckedChange={(checked) => handleBrandChange(brand, checked as boolean)}
                        />
                        <label htmlFor={`brand-${brand}`} className="text-sm">{brand}</label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Type Filter */}
                <div>
                  <h4 className="font-medium mb-3">Tipe Produk</h4>
                  <div className="space-y-2">
                    {types.map(type => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={`type-${type}`}
                          checked={selectedTypes.includes(type)}
                          onCheckedChange={(checked) => handleTypeChange(type, checked as boolean)}
                        />
                        <label htmlFor={`type-${type}`} className="text-sm">{type}</label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Finish Filter */}
                <div>
                  <h4 className="font-medium mb-3">Hasil Akhir</h4>
                  <div className="space-y-2">
                    {finishes.map(finish => (
                      <div key={finish} className="flex items-center space-x-2">
                        <Checkbox
                          id={`finish-${finish}`}
                          checked={selectedFinishes.includes(finish)}
                          onCheckedChange={(checked) => handleFinishChange(finish, checked as boolean)}
                        />
                        <label htmlFor={`finish-${finish}`} className="text-sm">{finish}</label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Car Brand Filter */}
                <div>
                  <h4 className="font-medium mb-3">Merek Mobil</h4>
                  <div className="space-y-2">
                    {carBrands.map(carBrand => (
                      <div key={carBrand} className="flex items-center space-x-2">
                        <Checkbox
                          id={`car-${carBrand}`}
                          checked={selectedCarBrands.includes(carBrand)}
                          onCheckedChange={(checked) => handleCarBrandChange(carBrand, checked as boolean)}
                        />
                        <label htmlFor={`car-${carBrand}`} className="text-sm">{carBrand}</label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h4 className="font-medium mb-3">Rentang Harga</h4>
                  <div className="px-2">
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={1000000}
                      step={10000}
                      className="mb-4"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{formatPrice(priceRange[0])}</span>
                      <span>{formatPrice(priceRange[1])}</span>
                    </div>
                  </div>
                </div>

                {/* Rating Filter */}
                <div>
                  <h4 className="font-medium mb-3">Rating Minimum</h4>
                  <Select value={minRating.toString()} onValueChange={(value) => setMinRating(Number(value))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Semua Rating</SelectItem>
                      <SelectItem value="3">3+ Bintang</SelectItem>
                      <SelectItem value="4">4+ Bintang</SelectItem>
                      <SelectItem value="4.5">4.5+ Bintang</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Stock Filter */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="in-stock"
                    checked={showInStockOnly}
                    onCheckedChange={(checked) => setShowInStockOnly(checked as boolean)}
                  />
                  <label htmlFor="in-stock" className="text-sm">Hanya yang tersedia</label>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Controls */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    {filteredProducts.length} produk ditemukan
                  </span>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Paling Relevan</SelectItem>
                    <SelectItem value="price_low">Harga Terendah</SelectItem>
                    <SelectItem value="price_high">Harga Tertinggi</SelectItem>
                    <SelectItem value="rating">Rating Tertinggi</SelectItem>
                    <SelectItem value="name">Nama A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Products */}
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6' 
              : 'space-y-4'
            }>
              {filteredProducts.map((product) => (
                <Card key={product.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className={viewMode === 'grid' ? 'p-0' : 'p-4'}>
                    {viewMode === 'grid' ? (
                      <>
                        <div className="relative">
                          <img
                            src={getPrimaryImage(product)}
                            alt={product.name}
                            className="w-full h-80 object-cover rounded-t-lg"
                          />
                          {product.badge && (
                            <Badge className="absolute top-2 left-2 bg-blue-600">{product.badge}</Badge>
                          )}
                          {!product.inStock && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-t-lg flex items-center justify-center">
                              <span className="text-white font-semibold">Stok Habis</span>
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="outline" className="text-xs">{product.brand}</Badge>
                            <Badge variant="secondary" className="text-xs">{product.type}</Badge>
                          </div>
                          <h3 className="font-semibold text-sm mb-2 line-clamp-2">{product.name}</h3>
                          {product.colorCode && (
                            <p className="text-xs text-gray-500 mb-2">Kode: {product.colorCode}</p>
                          )}
                          <div className="flex items-center mb-2">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm ml-1">{product.rating}</span>
                            <span className="text-xs text-gray-500 ml-1">({product.reviews})</span>
                          </div>
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <span className="font-bold text-lg text-blue-600">{formatPrice(product.price)}</span>
                              {product.originalPrice && (
                                <span className="text-sm text-gray-500 line-through ml-2">
                                  {formatPrice(product.originalPrice)}
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-gray-500">{product.sizes[0]?.size}</span>
                          </div>
                          <Button 
                            className="w-full bg-blue-600 hover:bg-blue-700" 
                            size="sm"
                            disabled={!product.inStock}
                            onClick={() => navigate(`/product/${product.id}`)}
                          >
                            {product.inStock ? 'Lihat Detail' : 'Stok Habis'}
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="flex space-x-4">
                        <div className="relative flex-shrink-0">
                          <img
                            src={getPrimaryImage(product)}
                            alt={product.name}
                            className="w-24 h-24 object-cover rounded-lg"
                          />
                          {product.badge && (
                            <Badge className="absolute -top-1 -right-1 bg-blue-600 text-xs">{product.badge}</Badge>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <Badge variant="outline" className="text-xs">{product.brand}</Badge>
                                <Badge variant="secondary" className="text-xs">{product.type}</Badge>
                                <Badge variant="outline" className="text-xs">{product.sizes[0]?.size}</Badge>
                              </div>
                              <h3 className="font-semibold mb-1">{product.name}</h3>
                              {product.colorCode && (
                                <p className="text-sm text-gray-500 mb-1">Kode: {product.colorCode}</p>
                              )}
                              <div className="flex items-center mb-2">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm ml-1">{product.rating}</span>
                                <span className="text-xs text-gray-500 ml-1">({product.reviews})</span>
                                <span className={`ml-4 text-sm ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                                  {product.inStock ? 'Tersedia' : 'Stok Habis'}
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="mb-2">
                                <span className="font-bold text-lg text-blue-600">{formatPrice(product.price)}</span>
                                {product.originalPrice && (
                                  <div className="text-sm text-gray-500 line-through">
                                    {formatPrice(product.originalPrice)}
                                  </div>
                                )}
                              </div>
                              <Button 
                                className="bg-blue-600 hover:bg-blue-700" 
                                size="sm"
                                disabled={!product.inStock}
                                onClick={() => navigate(`/product/${product.id}`)}
                              >
                                {product.inStock ? 'Lihat Detail' : 'Stok Habis'}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500 mb-4">
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">Tidak ada produk ditemukan</h3>
                  <p>Coba ubah filter atau kata kunci pencarian Anda</p>
                </div>
                <Button variant="outline" onClick={clearAllFilters}>
                  Reset Filter
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
