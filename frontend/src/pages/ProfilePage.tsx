import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, ShoppingBag, MapPin, Bell, LogOut,Home } from 'lucide-react';

interface UserProfile {
  name: string;
  email: string;
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    // Ambil data pengguna dari localStorage untuk simulasi
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // Jika tidak ada data user (belum login), tendang ke halaman login
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    // Hapus data pengguna dari localStorage
    localStorage.removeItem('user');
    alert('Anda telah logout.');
    navigate('/');
  };

  if (!user) {
    // Tampilkan loading atau null selagi memeriksa data pengguna
    return null; 
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader className="text-center bg-gray-100 p-8 rounded-t-lg">
            <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-white shadow-lg">
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} />
              <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-3xl">{user.name}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Menu Akun */}
              <div className="space-y-4">
                {/* Tombol Kembali ke Beranda yang sudah diperbaiki */}
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-base p-6 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800"
                  onClick={() => navigate('/')}
                >
                  <Home className="mr-3 h-5 w-5" /> Kembali ke Beranda
                </Button>
                
                {/* Tombol-tombol lainnya */}
                <Button variant="outline" className="w-full justify-start text-base p-6" onClick={() => navigate('/profile/account-info')}>
                  <User className="mr-3 h-5 w-5" /> Informasi Akun
                </Button>
                <Button variant="outline" className="w-full justify-start text-base p-6" onClick={() => navigate('/profile/order-history')}>
                  <ShoppingBag className="mr-3 h-5 w-5" /> Riwayat Pesanan
                </Button>
                <Button variant="outline" className="w-full justify-start text-base p-6" onClick={() => navigate('/profile/shipping-address')}>
                  <MapPin className="mr-3 h-5 w-5" /> Alamat Pengiriman
                </Button>
                <Button variant="outline" className="w-full justify-start text-base p-6">
                  <Bell className="mr-3 h-5 w-5" /> Pengaturan Notifikasi
                </Button>
              </div>
              {/* Tombol Logout dan Bantuan */}
              <div className="flex flex-col justify-between p-6 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-semibold mb-2">Butuh Bantuan?</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Tim support kami siap membantu Anda setiap saat.
                  </p>
                  <Button className="w-full" onClick={() => navigate('/live-chat')}>Hubungi Live Chat</Button>
                </div>
                <Button variant="destructive" className="w-full mt-6" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}