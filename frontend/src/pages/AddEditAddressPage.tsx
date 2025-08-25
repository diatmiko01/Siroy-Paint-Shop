import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Loader2, MapPin } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addressService, Address, CreateAddressRequest } from '@/services/addressService';

const ADDRESS_LABELS = [
  { value: 'Rumah', label: 'Rumah' },
  { value: 'Kantor', label: 'Kantor' },
  { value: 'Apartemen', label: 'Apartemen' },
  { value: 'Kos', label: 'Kos' },
  { value: 'Lainnya', label: 'Lainnya' },
];

const PROVINCES = [
  'DKI Jakarta',
  'Jawa Barat',
  'Jawa Tengah',
  'DI Yogyakarta',
  'Jawa Timur',
  'Banten',
  'Bali',
  'Sumatera Utara',
  'Sumatera Barat',
  'Sumatera Selatan',
  'Kalimantan Barat',
  'Kalimantan Timur',
  'Sulawesi Selatan',
  'Sulawesi Utara',
];

export default function AddEditAddressPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<CreateAddressRequest>({
    name: '',
    phone: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    label: 'Rumah',
    isDefault: false,
  });

  useEffect(() => {
    if (isEdit && id) {
      loadAddress(id);
    }
  }, [isEdit, id]);

  const loadAddress = async (addressId: string) => {
    try {
      setLoading(true);
      const addresses = await addressService.getAddresses();
      const address = addresses.find(addr => addr.id === addressId);
      
      if (address) {
        setFormData({
          name: address.name,
          phone: address.phone,
          address: address.address,
          city: address.city,
          province: address.province,
          postalCode: address.postalCode,
          label: address.label,
          isDefault: address.isDefault,
        });
      } else {
        navigate('/profile/shipping-address');
      }
    } catch (error) {
      console.error('Error loading address:', error);
      navigate('/profile/shipping-address');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof CreateAddressRequest, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = (): boolean => {
    const requiredFields: (keyof CreateAddressRequest)[] = [
      'name', 'phone', 'address', 'city', 'province', 'postalCode', 'label'
    ];

    for (const field of requiredFields) {
      if (!formData[field] || (typeof formData[field] === 'string' && !formData[field].trim())) {
        return false;
      }
    }

    // Validate phone number format
    const phoneRegex = /^(\+62|62|0)[0-9]{9,13}$/;
    if (!phoneRegex.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
      alert('Format nomor telepon tidak valid');
      return false;
    }

    // Validate postal code
    const postalCodeRegex = /^[0-9]{5}$/;
    if (!postalCodeRegex.test(formData.postalCode)) {
      alert('Kode pos harus 5 digit angka');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      
      if (isEdit && id) {
        await addressService.updateAddress({ ...formData, id });
      } else {
        await addressService.createAddress(formData);
      }

      navigate('/profile/shipping-address');
    } catch (error) {
      console.error('Error saving address:', error);
      alert('Gagal menyimpan alamat. Silakan coba lagi.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data alamat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => navigate('/profile/shipping-address')} className="mr-4">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEdit ? 'Edit Alamat' : 'Tambah Alamat Baru'}
          </h1>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="mr-2 h-5 w-5" />
              Informasi Alamat
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Informasi Kontak</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Lengkap *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Masukkan nama lengkap"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Nomor Telepon *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+62 812-3456-7890"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Alamat Lengkap</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Alamat *</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Jl. Jend. Sudirman No. 123, RT/RW 01/02, Kelurahan..."
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="province">Provinsi *</Label>
                    <Select
                      value={formData.province}
                      onValueChange={(value) => handleInputChange('province', value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih provinsi" />
                      </SelectTrigger>
                      <SelectContent>
                        {PROVINCES.map((province) => (
                          <SelectItem key={province} value={province}>
                            {province}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">Kota/Kabupaten *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="Jakarta Selatan"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postalCode">Kode Pos *</Label>
                  <Input
                    id="postalCode"
                    value={formData.postalCode}
                    onChange={(e) => handleInputChange('postalCode', e.target.value)}
                    placeholder="12345"
                    maxLength={5}
                    required
                  />
                </div>
              </div>

              {/* Address Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Pengaturan Alamat</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="label">Label Alamat *</Label>
                  <Select
                    value={formData.label}
                    onValueChange={(value) => handleInputChange('label', value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih label alamat" />
                    </SelectTrigger>
                    <SelectContent>
                      {ADDRESS_LABELS.map((label) => (
                        <SelectItem key={label.value} value={label.value}>
                          {label.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <Label htmlFor="isDefault" className="text-base font-medium">
                      Jadikan alamat utama
                    </Label>
                    <p className="text-sm text-gray-500">
                      Alamat ini akan dipilih secara otomatis saat checkout
                    </p>
                  </div>
                  <Switch
                    id="isDefault"
                    checked={formData.isDefault}
                    onCheckedChange={(checked) => handleInputChange('isDefault', checked)}
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/profile/shipping-address')}
                  className="flex-1"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-red-500 hover:bg-red-600"
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    isEdit ? 'Simpan Perubahan' : 'Tambah Alamat'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
