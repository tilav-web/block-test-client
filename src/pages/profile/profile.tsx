import { useAuth } from '@/hooks/useAuth';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Mail, Phone, Lock } from 'lucide-react';
import { useState } from 'react';
import { authService } from '@/services/auth.service';

export default function Profile() {
  const { user } = useAuth();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("Barcha maydonlarni to'ldiring");
      return;
    }
    if (newPassword.length < 6) {
      setError("Yangi parol kamida 6 ta belgidan iborat bo'lishi kerak");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Yangi parollar mos emas");
      return;
    }
    setLoading(true);
    try {
      const res = await authService.changePassword({ oldPassword, newPassword, confirmPassword });
      setSuccess(res?.message || "Parol muvaffaqiyatli o'zgartirildi");
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      let message = "Xatolik yuz berdi. Iltimos, qayta urinib ko'ring.";
      if (err && typeof err === 'object') {
        // Check for AxiosError structure
        const maybeAxiosErr = err as { response?: { data?: { message?: string } }, message?: string };
        if (maybeAxiosErr.response && maybeAxiosErr.response.data && typeof maybeAxiosErr.response.data.message === 'string') {
          message = maybeAxiosErr.response.data.message;
        } else if (typeof maybeAxiosErr.message === 'string') {
          message = maybeAxiosErr.message;
        }
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center text-gray-500">Foydalanuvchi ma'lumotlari topilmadi.</div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-emerald-50 py-8 px-2">
      <Card className="w-full max-w-md mx-auto shadow-lg rounded-xl p-0 sm:p-0">
        <CardHeader className="flex flex-col items-center gap-2 pb-2 pt-6">
          <div className="bg-gradient-to-r from-blue-600 to-emerald-600 p-4 rounded-full mb-2">
            <User className="h-10 w-10 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-center break-words">{user.full_name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 mt-2 px-4 pb-6">
          <div className="flex items-center gap-3 text-gray-700 break-all">
            <Mail className="h-5 w-5 text-blue-600" />
            <span>{user.email}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-700 break-all">
            <Phone className="h-5 w-5 text-green-600" />
            <span>{user.phone}</span>
          </div>

          <form className="space-y-4 mt-6" onSubmit={handleChangePassword}>
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-gray-500" />
              <span className="font-semibold">Parolni o'zgartirish</span>
            </div>
            <div className="space-y-2">
              <input
                type="password"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Joriy parol"
                value={oldPassword}
                onChange={e => setOldPassword(e.target.value)}
                autoComplete="current-password"
                disabled={loading}
              />
              <input
                type="password"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Yangi parol"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                autoComplete="new-password"
                disabled={loading}
              />
              <input
                type="password"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Yangi parolni tasdiqlang"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                disabled={loading}
              />
            </div>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            {success && <div className="text-green-600 text-sm">{success}</div>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Yuklanmoqda..." : "Parolni o'zgartirish"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
