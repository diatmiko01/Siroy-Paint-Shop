import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, User, Mail, Phone, Lock, Camera } from 'lucide-react';

interface UserProfile {
  name: string;
  email: string;
  phone?: string;
}

export default function AccountInformationPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setName(userData.name || '');
      setEmail(userData.email || '');
      setPhone(userData.phone || '');
      setProfilePicture(`https://api.dicebear.com/7.x/initials/svg?seed=${userData.name}`);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Simulasi upload: Tampilkan gambar yang dipilih secara lokal
      setProfilePicture(URL.createObjectURL(file));
    }
  };

  const handleSaveChanges = () => {
    // Di aplikasi nyata, ini akan mengirim data ke server
    alert('Perubahan berhasil disimpan! (Simulasi)');
    const updatedUserData = { ...user, name, email, phone };
    localStorage.setItem('user', JSON.stringify(updatedUserData));
  };
  
  const handleChangePassword = () => {
     if (newPassword !== confirmNewPassword) {
      alert('Password baru dan konfirmasi tidak cocok!');
      return;
    }
    if (!newPassword) {
      alert('Password baru tidak boleh kosong!');
      return;
    }
    alert('Password berhasil diubah! (Simulasi)');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" onClick={() => navigate('/profile')} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Profil
        </Button>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Informasi Akun</CardTitle>
            <CardDescription>Kelola detail akun, informasi pribadi, dan keamanan Anda.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Bagian Foto Profil */}
            <div className="flex items-center space-x-6">
              <div className="relative">
                <Avatar className="w-24 h-24 border-4 border-white shadow-md">
                  <AvatarImage src={profilePicture || ''} alt={user.name} />
                  <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <Button 
                  size="icon" 
                  className="absolute bottom-0 right-0 rounded-full h-8 w-8"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="h-4 w-4" />
                </Button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/png, image/jpeg"
                  onChange={handleProfilePictureChange}
                />
              </div>
              <div>
                <h3 className="text-xl font-bold">{user.name}</h3>
                <p className="text-gray-500">{user.email}</p>
                <Button variant="outline" size="sm" className="mt-2" onClick={() => fileInputRef.current?.click()}>
                  Ubah Foto
                </Button>
              </div>
            </div>

            <Separator />

            {/* Bagian Data Diri */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Data Diri</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Lengkap</Label>
                  <Input id="name" value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Alamat Email</Label>
                  <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Nomor Telepon</Label>
                  <Input id="phone" type="tel" placeholder="+62 812-3456-7890" value={phone} onChange={e => setPhone(e.target.value)} />
                </div>
              </div>
            </div>

            <Separator />
            
            {/* Bagian Ganti Password */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Ubah Password</h3>
              <div className="space-y-2">
                <Label htmlFor="current-password">Password Saat Ini</Label>
                <Input id="current-password" type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">Password Baru</Label>
                  <Input id="new-password" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-new-password">Konfirmasi Password Baru</Label>
                  <Input id="confirm-new-password" type="password" value={confirmNewPassword} onChange={e => setConfirmNewPassword(e.target.value)} />
                </div>
              </div>
               <Button variant="outline" onClick={handleChangePassword} className="mt-2">
                 Ubah Password
               </Button>
            </div>
            
            <Separator />

            <div className="flex justify-end">
              <Button onClick={handleSaveChanges}>Simpan Perubahan</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}