import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Package } from 'lucide-react';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface OrderDetails {
  orderId: string;
  items: CartItem[];
  total: number;
  date: string;
}

export default function OrderStatusPage() {
  const navigate = useNavigate();
  const { orderId } = useParams(); // Mengambil orderId dari URL
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);

  useEffect(() => {
    // Ambil detail pesanan dari localStorage
    const storedOrder = localStorage.getItem('lastOrder');
    if (storedOrder) {
      const parsedOrder = JSON.parse(storedOrder);
      // Pastikan orderId dari URL cocok dengan yang disimpan
      if (parsedOrder.orderId === orderId) {
        setOrderDetails(parsedOrder);
      }
    }
  }, [orderId]);

  const formatPrice = (price: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-center p-4">
        <div>
          <h2 className="text-xl font-semibold">Memuat Detail Pesanan...</h2>
          <p className="text-gray-600 mt-2">Atau pesanan tidak ditemukan.</p>
          <Button onClick={() => navigate('/')} className="mt-4">Kembali ke Beranda</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl text-center shadow-lg">
        <CardHeader className="bg-green-50 rounded-t-lg p-6">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <CardTitle className="text-2xl text-green-700">Terima Kasih Atas Pesanan Anda!</CardTitle>
          <p className="text-gray-600 mt-2">Pembayaran telah berhasil dan pesanan Anda sedang diproses.</p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-left space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Nomor Pesanan:</span>
              <span className="font-mono bg-gray-100 p-1 rounded">{orderDetails.orderId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold">Tanggal Pesanan:</span>
              <span>{orderDetails.date}</span>
            </div>
             <div className="flex justify-between items-center">
              <span className="font-semibold">Status Pesanan:</span>
              <span className="flex items-center text-blue-600 font-medium"><Package className="mr-2 h-4 w-4"/> Sedang Disiapkan</span>
            </div>
          </div>
          <Separator className="my-6" />
          <div>
            <h3 className="text-lg font-semibold text-left mb-4">Ringkasan Pembelian</h3>
            <div className="space-y-2 text-sm text-left">
              {orderDetails.items.map(item => (
                 <div key={item.id} className="flex justify-between items-center">
                    <span>{item.name} (x{item.quantity})</span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
              ))}
            </div>
            <Separator className="my-4"/>
             <div className="flex justify-between font-bold text-lg text-left">
              <span>Total Pembayaran</span>
              <span>{formatPrice(orderDetails.total)}</span>
            </div>
          </div>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => navigate('/')} className="w-full sm:w-auto">Lanjut Belanja</Button>
            <Button onClick={() => navigate('/profile/order-history')} variant="outline" className="w-full sm:w-auto">Lihat Riwayat Pesanan</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}