import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from '@/components/ui/checkbox';
import { Mail, Lock, LogIn, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Store user data and token
        const userData = {
          ...data.data.user,
          token: data.data.token
        };
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', data.data.token);

        // Navigate based on user role
        if (userData.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/profile');
        }
      } else {
        // Handle API error response
        setError(data.message || 'Login gagal. Silakan coba lagi.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Terjadi kesalahan koneksi. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
  {/* Logo SiroyAuto */}
  <div 
    className="flex items-center justify-center cursor-pointer mb-4" 
    onClick={() => navigate('/')}
  >
    <h1 className="text-2xl font-bold text-gray-900">SiroyAuto</h1>
    <span className="ml-2 text-sm text-gray-500">Professional Paint</span>
  </div>

  {/* Teks Deskripsi */}
  <div className="text-center">
    <CardTitle className="text-2xl">Selamat Datang Kembali!</CardTitle>
    <CardDescription>
      Masukkan email dan password Anda untuk melanjutkan.
      <br />
      <span className="text-xs text-blue-600">(User: user@siroyauto.com | Admin: admin@siroyauto.com)</span>
    </CardDescription>
  </div>
</CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="contoh@email.com"
                  required
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>
            {error && (
              <p className="text-sm text-red-600 text-center">{error}</p>
            )}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember-me" disabled={isLoading} />
                <label
                  htmlFor="remember-me"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Ingat saya
                </label>
              </div>
              <a href="#" className="text-sm text-blue-600 hover:underline">
                Lupa password?
              </a>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <LogIn className="mr-2 h-4 w-4" />
              )}
              {isLoading ? 'Memproses...' : 'Login'}
            </Button>
            <p className="text-sm text-center text-gray-600">
              Belum punya akun?{' '}
              <span onClick={() => navigate('/register')} className="text-blue-600 font-semibold hover:underline cursor-pointer">
                Daftar di sini
              </span>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}