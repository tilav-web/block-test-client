import React, { useState, useEffect } from "react";
import { toastError } from "@/common/utils/toast-actions";
import { blockService, type Block } from "@/services/block.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/ui/pagination";
import {
  ShoppingCart,
  ExternalLink,
  BookOpen,
  Users,
  Clock,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export const PublicBlocksPage: React.FC = () => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6); // 6 blocks per page (2 rows of 3)

  // Get user from auth store
  const { user } = useAuth();

  // Fetch blocks on component mount
  useEffect(() => {
    fetchBlocks();
  }, []);

  const fetchBlocks = async () => {
    try {
      setIsLoading(true);
      const data = await blockService.getAll();
      setBlocks(data);
    } catch (error: unknown) {
      console.error("Error fetching blocks:", error);
      const apiError = error as ApiError;
      toastError(
        apiError.response?.data?.message ||
          "Bloklarni yuklashda xatolik yuz berdi"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const hasBlockAccess = (blockId: string) => {
    if (
      !user ||
      !user.accessible_blocks ||
      user.accessible_blocks.length === 0
    ) {
      return false;
    }

    return user.accessible_blocks.includes(blockId);
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString("uz-UZ", {
      style: "currency",
      currency: "UZS",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  // Pagination calculations
  const totalPages = Math.ceil(blocks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBlocks = blocks.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          O'quv bloklari
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Sifatli ta'lim materiallari bilan o'z bilimlaringizni yaxshilang. Har
          bir blok maxsus tanlangan fanlar va amaliy mashqlar bilan
          to'ldirilgan.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 p-6 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-600 mb-2">
            {blocks.length}
          </div>
          <div className="text-gray-600">Mavjud bloklar</div>
        </div>
        <div className="bg-green-50 p-6 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-600 mb-2">
            {user?.accessible_blocks?.length || 0}
          </div>
          <div className="text-gray-600">Sizning bloklaringiz</div>
        </div>
        <div className="bg-purple-50 p-6 rounded-lg text-center">
          <div className="text-2xl font-bold text-purple-600 mb-2">
            {formatPrice(blocks.reduce((sum, block) => sum + block.price, 0))}
          </div>
          <div className="text-gray-600">Jami qiymat</div>
        </div>
      </div>

      {/* Blocks Grid */}
      {blocks.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Hali bloklar mavjud emas
          </h3>
          <p className="text-gray-500">
            Tez orada yangi o'quv materiallari qo'shiladi.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {currentBlocks.map((block) => (
              <Card
                key={block._id}
                className={`hover:shadow-lg transition-shadow duration-300 ${
                  hasBlockAccess(block._id)
                    ? "border-green-200 bg-green-50"
                    : ""
                }`}
              >
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-xl font-semibold text-gray-900 line-clamp-2">
                      {block.name}
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="flex-shrink-0">
                        {block.mandatory?.length || 0} fan
                      </Badge>
                      {hasBlockAccess(block._id) && (
                        <Badge
                          variant="default"
                          className="bg-green-600 text-white"
                        >
                          Ruxsat berilgan
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    {formatPrice(block.price)}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Subjects Info */}
                  <div className="space-y-3">
                    {block.main && (
                      <div className="flex items-center text-sm">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                        <span className="font-medium">Asosiy fan:</span>
                        <span className="ml-2 text-gray-600">
                          {block.main.name}
                        </span>
                      </div>
                    )}

                    {block.addition && (
                      <div className="flex items-center text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span className="font-medium">Qo'shimcha fan:</span>
                        <span className="ml-2 text-gray-600">
                          {block.addition.name}
                        </span>
                      </div>
                    )}

                    {block.mandatory && block.mandatory.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                          <span className="font-medium">Majburiy fanlar:</span>
                        </div>
                        <div className="flex flex-wrap gap-1 ml-4">
                          {block.mandatory.slice(0, 3).map((subject) => (
                            <Badge
                              key={subject._id}
                              variant="outline"
                              className="text-xs"
                            >
                              {subject.name}
                            </Badge>
                          ))}
                          {block.mandatory.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{block.mandatory.length - 3} boshqa
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Features */}
                  <div className="flex items-center justify-between text-sm text-gray-500 pt-2 border-t">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>24/7 qo'llab-quvvatlash</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      <span>1000+ o'quvchi</span>
                    </div>
                  </div>

                  {/* Purchase Button */}
                  {hasBlockAccess(block._id) ? (
                    <div className="flex items-center justify-center">
                      <Link
                        to={`/quiz/${block._id}`}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-1 rounded py-2 px-3"
                      >
                        <BookOpen className="h-4 w-4" />
                        Boshlash
                      </Link>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Link
                        to={"https://t.me/Tolov_admini_btu"}
                        className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-1 rounded py-2 px-3"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Sotib olish
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                itemsPerPage={itemsPerPage}
                totalItems={blocks.length}
              />
            </div>
          )}
        </>
      )}

      {/* Footer Info */}
      <div className="mt-12 text-center">
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Bloklar haqida
          </h3>
          <p className="text-gray-600 mb-4">
            {user?.accessible_blocks && user.accessible_blocks.length > 0
              ? `Sizda ${user.accessible_blocks.length} ta blokka ruxsat berilgan. "Boshlash" tugmasi orqali o'qishni boshlashingiz mumkin.`
              : "Sotib olish uchun yuqoridagi \"Sotib olish\" tugmasini bosing. Siz Telegram orqali bizning qo'llab-quvvatlash xizmatimizga yo'naltirilasiz."}
          </p>
          <div className="flex justify-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Ruxsat berilgan bloklar
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              Xavfsiz to'lov
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
              Kafolatli xizmat
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicBlocksPage;
