import { Outlet } from "react-router-dom";
import { BookOpen, Users, Trophy, Zap } from "lucide-react";

export const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      <div className="min-h-screen flex">
        {/* Left Side - Auth Form */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full">
            <Outlet />
          </div>
        </div>

        {/* Right Side - Platform Info */}
        <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-blue-600 to-emerald-600 items-center justify-center p-12">
          <div className="max-w-lg text-white">
            {/* Logo and Title */}
            <div className="flex items-center space-x-3 mb-8">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                <BookOpen className="h-10 w-10 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">TestBlok.uz</h1>
                <p className="text-blue-100">Abituriyentlar uchun onlayn test platformasi</p>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-6 mb-8">
              <div className="flex items-start space-x-4">
                <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Professional testlar</h3>
                  <p className="text-blue-100">
                    Texnika va tibbiyot yo'nalishlari bo'yicha mukammal testlar
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Birinchi test - bepul!</h3>
                  <p className="text-blue-100">
                    Har bir foydalanuvchi birinchi testni bepul ishlay oladi
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Tahlil va natijalar</h3>
                  <p className="text-blue-100">
                    Har bir fandan batafsil tahlil va statistika
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Reyting tizimi</h3>
                  <p className="text-blue-100">
                    O'zingizni boshqalar bilan solishtiring va rivojlaning
                  </p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 p-6 bg-white/10 backdrop-blur-sm rounded-xl">
              <div className="text-center">
                <div className="text-2xl font-bold">1247+</div>
                <div className="text-sm text-blue-100">Abituriyentlar</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">3891+</div>
                <div className="text-sm text-blue-100">Bajarilgan testlar</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">98%</div>
                <div className="text-sm text-blue-100">Mamnunlik darajasi</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};