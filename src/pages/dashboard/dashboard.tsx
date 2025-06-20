import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, ShoppingCart, Users, TrendingUp, Shield, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth-store';

export const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {user ? `${user.full_name}, TestBlok.uz ga xush kelibsiz!` : 'TestBlok.uz ga xush kelibsiz!'}
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Sifatli ta'lim materiallari bilan o'z bilimlaringizni yaxshilang va 
          imtihonlarga yaxshiroq tayyorgarlik ko'ring.
        </p>
        {user && (
          <div className="mt-4 flex justify-center items-center space-x-4">
            <span className="text-sm text-gray-500">
              Rol: {user.role === 'admin' ? 'Administrator' : 'O\'quvchi'}
            </span>
            <span className="text-sm text-gray-500">
              Email: {user.email}
            </span>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mavjud bloklar</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">10+</div>
            <p className="text-xs text-muted-foreground">
              Turli fanlar bo'yicha
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faol o'quvchilar</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1000+</div>
            <p className="text-xs text-muted-foreground">
              Muvaffaqiyatli natijalar
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">O'rtacha ball</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">
              O'quvchilar natijasi
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ShoppingCart className="h-5 w-5 text-blue-600" />
              <span>O'quv bloklarini ko'rish</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Turli fanlar bo'yicha tayyorlangan o'quv bloklarini ko'ring va 
              o'zingizga mosini tanlang.
            </p>
            <Link to="/blocks">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Bloklarni ko'rish
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-green-600" />
              <span>Ta'lim materiallari</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Sifatli ta'lim materiallari, testlar va amaliy mashqlar 
              bilan bilimlaringizni mustahkamlang.
            </p>
            <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
              Ko'proq ma'lumot
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Admin Actions */}
      {user?.role === 'admin' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-purple-50 to-purple-100">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-purple-600" />
                <span>Admin paneli</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Bloklarni boshqarish, foydalanuvchilarni ko'rish va 
                tizim sozlamalarini o'zgartirish.
              </p>
              <Link to="/admin/blocks">
                <Button className="bg-purple-600 hover:bg-purple-700">
                  Admin paneliga o'tish
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-50 to-orange-100">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5 text-orange-600" />
                <span>Foydalanuvchilarni boshqarish</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Foydalanuvchilarni ko'rish, ularning blok ruxsatlarini 
                boshqarish va tizim sozlamalarini o'zgartirish.
              </p>
              <Link to="/admin/users">
                <Button className="bg-orange-600 hover:bg-orange-700">
                  Foydalanuvchilarni ko'rish
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Features */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">
          Nima uchun TestBlok.uz?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Sifatli materiallar</h3>
            <p className="text-sm text-gray-600">
              Mutaxassislar tomonidan tayyorlangan zamonaviy ta'lim materiallari
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Tezkor natijalar</h3>
            <p className="text-sm text-gray-600">
              Tizimli yondashuv bilan tez va samarali natijalar
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">24/7 qo'llab-quvvatlash</h3>
            <p className="text-sm text-gray-600">
              Har qanday savollaringiz bo'yicha yordam beramiz
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 