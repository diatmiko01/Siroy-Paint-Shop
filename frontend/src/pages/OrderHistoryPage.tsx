import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Package, FileText, ShoppingBag } from 'lucide-react';

// Tipe data untuk satu item dalam pesanan
interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

// Tipe data untuk satu pesanan
interface Order {
  id: string;
  date: string;
  status: 'Selesai' | 'Dikirim' | 'Dibatalkan' | 'Menunggu Pembayaran';
  total: number;
  items: OrderItem[];
}

export default function OrderHistoryPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // Simulasi pengambilan data riwayat pesanan.
    // Di aplikasi nyata, data ini akan diambil dari server/backend.
    const dummyOrders: Order[] = [
      {
        id: 'SROY-1692525600123',
        date: '19 Agustus 2025',
        status: 'Selesai',
        total: 2375000,
        items: [
          { id: 1, name: 'PPG Deltron DG Performance Clear Coat', price: 850000, quantity: 2 },
          { id: 2, name: 'Sikkens Autocryl 2K Base Coat - Pearl White', price: 650000, quantity: 1 },
        ]
      },
      {
        id: 'SROY-1692439200456',
        date: '18 Agustus 2025',
        status: 'Dikirim',
        total: 125000,
        items: [
          { id: 4, name: 'Nippon Paint Thinner Standard Grade', price: 125000, quantity: 1 },
        ]
      },
      {
        id: 'SROY-1692352800789',
        date: '17 Agustus 2025',
        status: 'Dibatalkan',
        total: 580000,
        items: [
          { id: 5, name: 'Sikkens Autocryl 2K Base - Midnight Black', price: 580000, quantity: 1 },
        ]
      }
    ];
    setOrders(dummyOrders);
  }, []);

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'Selesai': return <Badge className="bg-green-100 text-green-800">Selesai</Badge>;
      case 'Dikirim': return <Badge className="bg-blue-100 text-blue-800">Dikirim</Badge>;
      case 'Dibatalkan': return <Badge variant="destructive">Dibatalkan</Badge>;
      case 'Menunggu Pembayaran': return <Badge variant="secondary">Menunggu Pembayaran</Badge>;
      default: return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const formatPrice = (price: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" onClick={() => navigate('/profile')} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Profil
        </Button>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <ShoppingBag className="mr-3 h-6 w-6" />
              Riwayat Pesanan
            </CardTitle>
            <CardDescription>Lihat semua transaksi dan status pesanan Anda di sini.</CardDescription>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <p>Anda belum memiliki riwayat pesanan.</p>
                <Button onClick={() => navigate('/catalog')} className="mt-4">Mulai Belanja</Button>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <Card key={order.id} className="overflow-hidden">
                    <CardHeader className="bg-gray-50 flex flex-row items-center justify-between p-4 border-b">
                      <div>
                        <p className="font-semibold">Nomor Pesanan</p>
                        <p className="text-sm font-mono text-gray-600">{order.id}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-right">Tanggal</p>
                        <p className="text-sm text-gray-600">{order.date}</p>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <p className="font-semibold">Status</p>
                          {getStatusBadge(order.status)}
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">Total Belanja</p>
                          <p className="font-bold text-blue-600">{formatPrice(order.total)}</p>
                        </div>
                      </div>
                      <Separator className="my-4" />
                      <div className="text-sm space-y-2">
                        <p className="font-semibold mb-2">Item yang dibeli:</p>
                        {order.items.map(item => (
                          <div key={item.id} className="flex justify-between">
                            <span className="text-gray-700">{item.name} (x{item.quantity})</span>
                            <span className="text-gray-500">{formatPrice(item.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <div className="bg-gray-50 p-4 border-t flex justify-end space-x-2">
                       <Button variant="outline" size="sm">
                        <FileText className="mr-2 h-4 w-4" /> Lihat Invoice
                      </Button>
                      <Button size="sm" onClick={() => navigate('/catalog')}>
                        <Package className="mr-2 h-4 w-4" /> Beli Lagi
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}