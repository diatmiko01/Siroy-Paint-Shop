import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Plus, MapPin, Phone, Edit, Trash2, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { addressService, Address } from '@/services/addressService';

export default function ShippingAddressPage() {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      setLoading(true);
      const data = await addressService.getAddresses();
      setAddresses(data);
    } catch (error) {
      console.error('Error loading addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefault = async (addressId: string) => {
    try {
      await addressService.setDefaultAddress(addressId);
      // Update local state
      setAddresses(prev => prev.map(addr => ({
        ...addr,
        isDefault: addr.id === addressId
      })));
    } catch (error) {
      console.error('Error setting default address:', error);
    }
  };

  const handleDeleteAddress = async () => {
    if (!addressToDelete) return;
    
    try {
      await addressService.deleteAddress(addressToDelete);
      setAddresses(prev => prev.filter(addr => addr.id !== addressToDelete));
      setDeleteDialogOpen(false);
      setAddressToDelete(null);
    } catch (error) {
      console.error('Error deleting address:', error);
    }
  };

  const openDeleteDialog = (addressId: string) => {
    setAddressToDelete(addressId);
    setDeleteDialogOpen(true);
  };

  const getLabelColor = (label: string) => {
    switch (label.toLowerCase()) {
      case 'utama':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'rumah':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'kantor':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'alamat toko':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'alamat pengembangan':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat alamat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button variant="ghost" onClick={() => navigate('/profile')} className="mr-4">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Alamat Saya</h1>
          </div>
          <Button 
            onClick={() => navigate('/profile/shipping-address/add')}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            Tambah Alamat Baru
          </Button>
        </div>

        {/* Address List */}
        <div className="space-y-4">
          {addresses.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada alamat tersimpan</h3>
                <p className="text-gray-500 mb-4">Tambahkan alamat pengiriman untuk mempermudah proses checkout</p>
                <Button 
                  onClick={() => navigate('/profile/shipping-address/add')}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Alamat Pertama
                </Button>
              </CardContent>
            </Card>
          ) : (
            addresses.map((address) => (
              <Card key={address.id} className="relative">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      {/* Name and Phone */}
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="font-semibold text-gray-900">{address.name}</h3>
                        <Separator orientation="vertical" className="h-4" />
                        <div className="flex items-center text-gray-600">
                          <Phone className="h-4 w-4 mr-1" />
                          <span className="text-sm">{address.phone}</span>
                        </div>
                      </div>

                      {/* Address */}
                      <p className="text-gray-700 mb-3 leading-relaxed">
                        {address.address}
                      </p>
                      <p className="text-gray-600 text-sm mb-3">
                        {address.city}, {address.province}, {address.postalCode}
                      </p>

                      {/* Labels */}
                      <div className="flex items-center gap-2 mb-4">
                        <Badge 
                          variant="outline" 
                          className={`${getLabelColor(address.label)} font-medium`}
                        >
                          {address.label}
                        </Badge>
                        {address.isDefault && (
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                            Default
                          </Badge>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/profile/shipping-address/edit/${address.id}`)}
                          className="text-blue-600 border-blue-200 hover:bg-blue-50"
                        >
                          Ubah
                        </Button>
                        {!address.isDefault && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSetDefault(address.id)}
                            className="text-gray-600 border-gray-200 hover:bg-gray-50"
                          >
                            Atur sebagai utama
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* More Options */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => navigate(`/profile/shipping-address/edit/${address.id}`)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        {!address.isDefault && (
                          <DropdownMenuItem
                            onClick={() => openDeleteDialog(address.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Hapus
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Hapus Alamat</AlertDialogTitle>
              <AlertDialogDescription>
                Apakah Anda yakin ingin menghapus alamat ini? Tindakan ini tidak dapat dibatalkan.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteAddress}
                className="bg-red-600 hover:bg-red-700"
              >
                Hapus
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
