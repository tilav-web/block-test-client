import React from "react";
import { User, BookOpen, ShoppingCart, Trophy, BarChart } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/useAuth";

const Header: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white shadow-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-8 w-full">
            <Link to="/" className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-emerald-600 p-2 rounded-lg">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                  BlokTest.uz
                </h1>
                <p className="text-xs text-gray-500 -mt-1">
                  Abiturentlikdan talabalik sari yo'l
                </p>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive("/")
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                Bosh sahifa
              </Link>
              <Link
                to="/blocks"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1 ${
                  isActive("/blocks")
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <ShoppingCart className="h-4 w-4" />
                <span>Bloklar</span>
              </Link>
              <Link
                to="/result/quiz"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1 ${
                  isActive("/result/quiz")
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <Trophy className="h-4 w-4" />
                <span>Natijalar</span>
              </Link>
              <Link
                to="/ratings/quiz"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1 ${
                  isActive("/ratings/quiz")
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <BarChart className="h-4 w-4" />
                <span>Reyting</span>
              </Link>
            </nav>

            {/* User Menu (Desktop) */}
            {user && (
              <Link to={"/profile"} className="block ml-auto">
                <div className="hidden md:flex items-center space-x-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg">
                      <User className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700 line-clamp-1">
                        {user.full_name}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* Mobile Menu Trigger */}
            <div className="md:hidden ml-auto">
              <Sheet>
                <SheetTrigger asChild>
                  <button className="p-2 rounded-md hover:bg-gray-100 transition-colors cursor-pointer">
                    <div className="md:flex items-center space-x-4 ml-auto">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg">
                          <User className="h-4 w-4 text-gray-600" />
                          <span className="text-sm font-medium text-gray-700 line-clamp-1">
                            {user?.full_name}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                </SheetTrigger>
                <SheetContent side="right" className="p-0 w-64">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center space-x-3 px-4 py-4 border-b">
                      <div className="bg-gradient-to-r from-blue-600 to-emerald-600 p-2 rounded-lg">
                        <BookOpen className="h-7 w-7 text-white" />
                      </div>
                      <div>
                        <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                          BlokTest.uz
                        </h1>
                      </div>
                    </div>
                    <nav className="flex flex-col gap-1 px-4 py-4">
                      <Link
                        to="/"
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          isActive("/")
                            ? "bg-blue-100 text-blue-700"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        }`}
                      >
                        Bosh sahifa
                      </Link>
                      <Link
                        to="/blocks"
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1 ${
                          isActive("/blocks")
                            ? "bg-blue-100 text-blue-700"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        }`}
                      >
                        <ShoppingCart className="h-4 w-4" />
                        <span>Bloklar</span>
                      </Link>
                      <Link
                        to="/result/quiz"
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1 ${
                          isActive("/result/quiz")
                            ? "bg-blue-100 text-blue-700"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        }`}
                      >
                        <Trophy className="h-4 w-4" />
                        <span>Natijalar</span>
                      </Link>
                      <Link
                        to="/ratings/quiz"
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1 ${
                          isActive("/ratings/quiz")
                            ? "bg-blue-100 text-blue-700"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        }`}
                      >
                        <BarChart className="h-4 w-4" />
                        <span>Reyting</span>
                      </Link>
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
