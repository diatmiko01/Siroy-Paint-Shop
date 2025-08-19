import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, Car, Palette, ShoppingCart, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CalculationResult {
  primer: number;
  baseCoat: number;
  clearCoat: number;
  thinner: number;
  hardener: number;
  totalCost: number;
  coverage: string;
}

interface CarModel {
  brand: string;
  model: string;
  surfaceArea: number; // in square meters
}

export default function PaintCalculator() {
  const navigate = useNavigate();
  const [selectedCar, setSelectedCar] = useState<string>('');
  const [paintType, setPaintType] = useState<string>('');
  const [workType, setWorkType] = useState<string>('');
  const [customLength, setCustomLength] = useState<string>('');
  const [customWidth, setCustomWidth] = useState<string>('');
  const [customHeight, setCustomHeight] = useState<string>('');
  const [result, setResult] = useState<CalculationResult | null>(null);

  const carModels: CarModel[] = [
    { brand: 'Toyota', model: 'Avanza', surfaceArea: 32 },
    { brand: 'Toyota', model: 'Innova', surfaceArea: 38 },
    { brand: 'Toyota', model: 'Camry', surfaceArea: 36 },
    { brand: 'Honda', model: 'Brio', surfaceArea: 28 },
    { brand: 'Honda', model: 'Jazz', surfaceArea: 30 },
    { brand: 'Honda', model: 'Civic', surfaceArea: 34 },
    { brand: 'Honda', model: 'CR-V', surfaceArea: 40 },
    { brand: 'Suzuki', model: 'Ertiga', surfaceArea: 35 },
    { brand: 'Daihatsu', model: 'Xenia', surfaceArea: 32 },
    { brand: 'Mitsubishi', model: 'Pajero', surfaceArea: 45 },
    { brand: 'BMW', model: '3 Series', surfaceArea: 36 },
    { brand: 'Mercedes', model: 'C-Class', surfaceArea: 37 },
  ];

  const paintTypes = [
    { value: 'pu', label: 'PU (Polyurethane) - Premium', coverage: 12, costMultiplier: 1.5 },
    { value: 'nc', label: 'NC (Nitrocellulose) - Standard', coverage: 10, costMultiplier: 1.0 },
    { value: 'acrylic', label: 'Acrylic - Economy', coverage: 8, costMultiplier: 0.8 },
  ];

  const workTypes = [
    { value: 'full_body', label: 'Full Body', areaMultiplier: 1.0 },
    { value: 'half_body', label: 'Half Body', areaMultiplier: 0.5 },
    { value: 'panel', label: 'Panel (1-2 panel)', areaMultiplier: 0.15 },
    { value: 'touch_up', label: 'Touch Up', areaMultiplier: 0.05 },
    { value: 'bumper', label: 'Bumper', areaMultiplier: 0.1 },
    { value: 'hood', label: 'Hood/Kap Mesin', areaMultiplier: 0.12 },
    { value: 'door', label: 'Pintu (per piece)', areaMultiplier: 0.08 },
  ];

  const calculatePaint = () => {
    let surfaceArea = 0;

    // Calculate surface area
    if (selectedCar && selectedCar !== 'custom') {
      const car = carModels.find(c => `${c.brand}-${c.model}` === selectedCar);
      surfaceArea = car ? car.surfaceArea : 0;
    } else if (customLength && customWidth && customHeight) {
      // Simple calculation for custom dimensions (approximation)
      const l = parseFloat(customLength);
      const w = parseFloat(customWidth);
      const h = parseFloat(customHeight);
      surfaceArea = 2 * (l * w + l * h + w * h) * 0.7; // 0.7 factor for car shape approximation
    }

    if (!surfaceArea || !paintType || !workType) {
      alert('Mohon lengkapi semua field yang diperlukan');
      return;
    }

    const selectedPaintType = paintTypes.find(p => p.value === paintType);
    const selectedWorkType = workTypes.find(w => w.value === workType);

    if (!selectedPaintType || !selectedWorkType) return;

    // Calculate actual coverage area
    const coverageArea = surfaceArea * selectedWorkType.areaMultiplier;

    // Calculate paint quantities (in liters)
    const primerNeeded = Math.ceil((coverageArea / selectedPaintType.coverage) * 1.2 * 100) / 100; // 20% extra
    const baseCoatNeeded = Math.ceil((coverageArea / selectedPaintType.coverage) * 100) / 100;
    const clearCoatNeeded = Math.ceil((coverageArea / selectedPaintType.coverage) * 1.1 * 100) / 100; // 10% extra
    const thinnerNeeded = Math.ceil((baseCoatNeeded * 0.3) * 100) / 100; // 30% of base coat
    const hardenerNeeded = Math.ceil((clearCoatNeeded * 0.25) * 100) / 100; // 25% of clear coat

    // Calculate costs (approximate prices in IDR)
    const basePrices = {
      primer: 300000, // per liter
      baseCoat: 600000, // per liter
      clearCoat: 800000, // per liter
      thinner: 120000, // per liter
      hardener: 200000, // per liter
    };

    const totalCost = 
      (primerNeeded * basePrices.primer +
       baseCoatNeeded * basePrices.baseCoat +
       clearCoatNeeded * basePrices.clearCoat +
       thinnerNeeded * basePrices.thinner +
       hardenerNeeded * basePrices.hardener) * selectedPaintType.costMultiplier;

    setResult({
      primer: primerNeeded,
      baseCoat: baseCoatNeeded,
      clearCoat: clearCoatNeeded,
      thinner: thinnerNeeded,
      hardener: hardenerNeeded,
      totalCost: Math.round(totalCost),
      coverage: `${coverageArea.toFixed(1)} m²`
    });
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
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
              <h1 className="text-2xl font-bold text-gray-900">SiroyAuto</h1>
              <span className="ml-2 text-sm text-gray-500">Professional Paint</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={() => navigate('/catalog')}>Kembali ke Katalog</Button>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => navigate('/cart')}>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Cart (0)
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calculator className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Kalkulator Kebutuhan Cat</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hitung dengan akurat jumlah cat yang Anda butuhkan berdasarkan jenis mobil dan tipe pekerjaan
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Car className="h-5 w-5 mr-2" />
                Parameter Perhitungan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs defaultValue="car-model" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="car-model">Model Mobil</TabsTrigger>
                  <TabsTrigger value="custom">Dimensi Custom</TabsTrigger>
                </TabsList>
                
                <TabsContent value="car-model" className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Pilih Model Mobil</label>
                    <Select value={selectedCar} onValueChange={setSelectedCar}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih model mobil..." />
                      </SelectTrigger>
                      <SelectContent>
                        {carModels.map((car) => (
                          <SelectItem key={`${car.brand}-${car.model}`} value={`${car.brand}-${car.model}`}>
                            {car.brand} {car.model} ({car.surfaceArea}m²)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>
                
                <TabsContent value="custom" className="space-y-4">
                  <div className="text-sm text-gray-600 mb-4">
                    Masukkan dimensi kendaraan dalam meter untuk perhitungan custom
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Panjang (m)</label>
                      <Input
                        type="number"
                        placeholder="4.5"
                        value={customLength}
                        onChange={(e) => {
                          setCustomLength(e.target.value);
                          setSelectedCar('custom');
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Lebar (m)</label>
                      <Input
                        type="number"
                        placeholder="1.8"
                        value={customWidth}
                        onChange={(e) => {
                          setCustomWidth(e.target.value);
                          setSelectedCar('custom');
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Tinggi (m)</label>
                      <Input
                        type="number"
                        placeholder="1.6"
                        value={customHeight}
                        onChange={(e) => {
                          setCustomHeight(e.target.value);
                          setSelectedCar('custom');
                        }}
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div>
                <label className="block text-sm font-medium mb-2">Jenis Cat</label>
                <Select value={paintType} onValueChange={setPaintType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis cat..." />
                  </SelectTrigger>
                  <SelectContent>
                    {paintTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Jenis Pekerjaan</label>
                <Select value={workType} onValueChange={setWorkType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis pekerjaan..." />
                  </SelectTrigger>
                  <SelectContent>
                    {workTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={calculatePaint} className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
                <Calculator className="h-5 w-5 mr-2" />
                Hitung Kebutuhan Cat
              </Button>

              {/* Info Box */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Tips Perhitungan:</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>Hasil sudah termasuk safety margin untuk memastikan cat tidak kurang</li>
                      <li>Harga estimasi berdasarkan rata-rata harga pasar saat ini</li>
                      <li>Untuk hasil terbaik, gunakan rasio campuran sesuai petunjuk produk</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="h-5 w-5 mr-2" />
                Hasil Perhitungan
              </CardTitle>
            </CardHeader>
            <CardContent>
              {result ? (
                <div className="space-y-6">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-green-800 mb-2">Area Coverage: {result.coverage}</h3>
                    <p className="text-sm text-green-700">
                      Estimasi biaya total: <span className="font-bold text-lg">{formatPrice(result.totalCost)}</span>
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Kebutuhan Material:</h4>
                    
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <span className="font-medium">Primer</span>
                          <p className="text-sm text-gray-600">Cat dasar</p>
                        </div>
                        <Badge variant="secondary">{result.primer}L</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <span className="font-medium">Base Coat</span>
                          <p className="text-sm text-gray-600">Cat warna</p>
                        </div>
                        <Badge variant="secondary">{result.baseCoat}L</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <span className="font-medium">Clear Coat</span>
                          <p className="text-sm text-gray-600">Cat pelindung</p>
                        </div>
                        <Badge variant="secondary">{result.clearCoat}L</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <span className="font-medium">Thinner</span>
                          <p className="text-sm text-gray-600">Pengencer</p>
                        </div>
                        <Badge variant="secondary">{result.thinner}L</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <span className="font-medium">Hardener</span>
                          <p className="text-sm text-gray-600">Pengeras</p>
                        </div>
                        <Badge variant="secondary">{result.hardener}L</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700" size="lg" onClick={() => navigate('/catalog')}>
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Beli Paket Lengkap
                    </Button>
                    <p className="text-xs text-gray-500 text-center mt-2">
                      Paket sudah disesuaikan dengan kebutuhan perhitungan Anda
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <Calculator className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">Siap untuk Menghitung</h3>
                    <p>Lengkapi parameter di sebelah kiri untuk melihat hasil perhitungan</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Additional Info */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Car className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Akurasi Tinggi</h3>
              <p className="text-sm text-gray-600">
                Perhitungan berdasarkan data teknis dan pengalaman professional painter
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Palette className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Safety Margin</h3>
              <p className="text-sm text-gray-600">
                Termasuk cadangan material untuk memastikan pekerjaan tidak terhambat
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Paket Lengkap</h3>
              <p className="text-sm text-gray-600">
                Langsung pesan semua material yang dibutuhkan dalam satu paket
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}