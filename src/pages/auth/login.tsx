import { toastError, toastSuccess } from '@/common/utils/toast-actions';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth-store';
import { Mail, Lock, Eye, AlertCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export const Login = () => {
  const navigate = useNavigate();
  const { isLoading, handleAuth } = useAuthStore();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await authService.login(formData);
      handleAuth(response.user);
      toastSuccess("Tizimga kirish muvaffaqiyatli amalga oshirildi");
      navigate("/");
    } catch (error) {
      console.error(error);
      toastError("Xatolik yuz berdi");
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Tizimga kirish</h2>
        <p className="mt-2 text-gray-600">Hisobingizga kiring va testlarni yechishni boshlang</p>
      </div>

      {/* Registration info */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-green-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-green-800 mb-1">
              Yangi foydalanuvchi?
            </p>
            <p className="text-sm text-green-700">
              Ro'yxatdan o'ting va birinchi testni bepul ishlang!
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email manzil
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              value={formData.email}
              onChange={handleChange}
              type="email"
              name="email"
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="email@example.com"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Parol
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              value={formData.password}
              onChange={handleChange}
              type="password"
              name="password"
              className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Parolingizni kiriting"
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-emerald-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="h-5 w-5 animate-spin mr-2" />}
          Kirish
        </button>
      </form>

      <div className="text-center">
        <p className="text-gray-600">
          Hisobingiz yo'qmi?{' '}
          <Link to="/auth/register"
            className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
          >
            Ro'yxatdan o'ting
          </Link>
        </p>
      </div>
    </div>
  );
};