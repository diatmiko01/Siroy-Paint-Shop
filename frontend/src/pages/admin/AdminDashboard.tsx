import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { LogOut, Users, Package, BarChart } from 'lucide-react';

interface AdminProfile {
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState<AdminProfile | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      // PENTING: Periksa apakah peran pengguna adalah 'admin'
      if (userData.role === 'admin') {
        setAdmin(userData);
      } else {
        // Jika bukan admin, tendang ke halaman profil biasa
        navigate('/profile');
      }
    } else {
      // Jika tidak ada data user (belum login), tendang ke halaman login
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    alert('Admin telah logout.');
    navigate('/');
  };

  if (!admin) {
    return null; // Tampilkan loading screen jika diperlukan
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-500">Selamat datang, {admin.name}</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Quick Stats Cards */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pengguna</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,254</div>
              <p className="text-xs text-muted-foreground">+20.1% dari bulan lalu</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Produk</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">842</div>
              <p className="text-xs text-muted-foreground">+10 produk baru minggu ini</p>
            </CardContent>
          </Card>
           <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Penjualan</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Rp 152.750.000</div>
              <p className="text-xs text-muted-foreground">+12.5% dari bulan lalu</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Recent Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Pengguna Terbaru</CardTitle>
            <CardDescription>Daftar 5 pengguna yang baru saja mendaftar.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pengguna</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Tanggal Daftar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Data Dummy */}
                <TableRow>
                  <TableCell>
                    <div className="font-medium">User SiroyAuto</div>
                    <div className="text-sm text-muted-foreground">user@siroyauto.com</div>
                  </TableCell>
                  <TableCell><Badge>Aktif</Badge></TableCell>
                  <TableCell className="text-right">20 Agu 2025</TableCell>
                </TableRow>
                {/* Tambahkan baris lain jika perlu */}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}