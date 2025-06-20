import React, { useState, useEffect } from 'react';
import { toastSuccess, toastError } from '@/common/utils/toast-actions';
import { authService, type User } from '@/services/auth.service';
import { blockService, type Block } from '@/services/block.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination } from '@/components/ui/pagination';
import { Search, User as UserIcon, Mail, Phone, Check, X, Eye, Key } from 'lucide-react';

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [showBlockAccess, setShowBlockAccess] = useState(false);
  const [userBlockAccess, setUserBlockAccess] = useState<string[]>([]);
  const [isLoadingAccess, setIsLoadingAccess] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // 10 users per page

  useEffect(() => {
      fetchUsers();
      fetchBlocks();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const data = await authService.getAllUsers();
      setUsers(data);
    } catch (error: unknown) {
      console.error('Error fetching users:', error);
      const apiError = error as ApiError;
      toastError(apiError.response?.data?.message || 'Foydalanuvchilarni yuklashda xatolik yuz berdi');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBlocks = async () => {
    try {
      const data = await blockService.getAll();
      setBlocks(data);
    } catch (error) {
      console.error('Error fetching blocks:', error);
    }
  };

  const fetchUserBlockAccess = async (userId: string) => {
    try {
      setIsLoadingAccess(true);
      const data = await authService.getUserBlockAccess(userId);
      setUserBlockAccess(data);
    } catch (error) {
      console.error('Error fetching user block access:', error);
      toastError('Foydalanuvchi blok ruxsatlarini yuklashda xatolik yuz berdi');
    } finally {
      setIsLoadingAccess(false);
    }
  };

  const handleGrantAccess = async (userId: string, blockId: string) => {
    try {
      await authService.grantBlockAccess(userId, blockId);
      toastSuccess('Blok ruxsati muvaffaqiyatli berildi');
      // Refresh user block access
      if (selectedUser) {
        fetchUserBlockAccess(selectedUser._id);
      }
    } catch (error: unknown) {
      console.error('Error granting block access:', error);
      const apiError = error as ApiError;
      toastError(apiError.response?.data?.message || 'Blok ruxsati berishda xatolik yuz berdi');
    }
  };

  const handleRevokeAccess = async (userId: string, blockId: string) => {
    try {
      await authService.revokeBlockAccess(userId, blockId);
      toastSuccess('Blok ruxsati muvaffaqiyatli olib tashlandi');
      // Refresh user block access
      if (selectedUser) {
        fetchUserBlockAccess(selectedUser._id);
      }
    } catch (error: unknown) {
      console.error('Error revoking block access:', error);
      const apiError = error as ApiError;
      toastError(apiError.response?.data?.message || 'Blok ruxsati olib tashlashda xatolik yuz berdi');
    }
  };

  const handleViewUserDetails = (user: User) => {
    setSelectedUser(user);
    setShowUserDetails(true);
  };

  const handleViewBlockAccess = async (user: User) => {
    setSelectedUser(user);
    setShowBlockAccess(true);
    await fetchUserBlockAccess(user._id);
  };

  // Ensure users is always an array
  const safeUsers = Array.isArray(users) ? users : [];
  
  const filteredUsers = safeUsers.filter(user =>
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone.includes(searchTerm)
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('uz-UZ', {
      style: 'currency',
      currency: 'UZS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Foydalanuvchilarni boshqarish
        </h1>
        <p className="text-gray-600">
          Foydalanuvchilarni ko'ring va ularning blok ruxsatlarini boshqaring
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Foydalanuvchi nomi, email yoki telefon bo'yicha qidiring..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{safeUsers.length}</div>
            <div className="text-sm text-gray-600">Jami foydalanuvchilar</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {safeUsers.filter(u => u.role === 'student').length}
            </div>
            <div className="text-sm text-gray-600">O'quvchilar</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">
              {safeUsers.filter(u => u.role === 'admin').length}
            </div>
            <div className="text-sm text-gray-600">Adminlar</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">
              {safeUsers.filter(u => u.is_active).length}
            </div>
            <div className="text-sm text-gray-600">Faol foydalanuvchilar</div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Foydalanuvchilar ro'yxati</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {searchTerm ? 'Qidiruv natijasi topilmadi' : 'Hali hech qanday foydalanuvchi mavjud emas'}
              </p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Foydalanuvchi</TableHead>
                    <TableHead>Aloqa</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Holat</TableHead>
                    <TableHead>Ro'yxatdan o'tgan</TableHead>
                    <TableHead className="w-[150px]">Amallar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentUsers.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="bg-blue-100 p-2 rounded-full">
                            <UserIcon className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium">{user.full_name}</div>
                            <div className="text-sm text-gray-500">ID: {user._id.slice(-8)}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Mail className="h-3 w-3 mr-1 text-gray-400" />
                            {user.email}
                          </div>
                          <div className="flex items-center text-sm">
                            <Phone className="h-3 w-3 mr-1 text-gray-400" />
                            {user.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                          {user.role === 'admin' ? 'Admin' : 'O\'quvchi'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Badge variant={user.is_active ? 'default' : 'destructive'}>
                            {user.is_active ? 'Faol' : 'Bloklangan'}
                          </Badge>
                          {user.is_verified && (
                            <Badge variant="outline" className="text-green-600 border-green-600">
                              <Check className="h-3 w-3 mr-1" />
                              Tasdiqlangan
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">
                          {formatDate(user.createdAt)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewUserDetails(user)}
                            title="Ma'lumotlarni ko'rish"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewBlockAccess(user)}
                            title="Blok ruxsatlarini ko'rish"
                          >
                            <Key className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    itemsPerPage={itemsPerPage}
                    totalItems={filteredUsers.length}
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* User Details Dialog */}
      <Dialog open={showUserDetails} onOpenChange={setShowUserDetails}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Foydalanuvchi ma'lumotlari</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div>
                <Label>To'liq ism</Label>
                <p className="font-medium">{selectedUser.full_name}</p>
              </div>
              <div>
                <Label>Email</Label>
                <p className="font-medium">{selectedUser.email}</p>
              </div>
              <div>
                <Label>Telefon</Label>
                <p className="font-medium">{selectedUser.phone}</p>
              </div>
              <div>
                <Label>Rol</Label>
                <Badge variant={selectedUser.role === 'admin' ? 'default' : 'secondary'}>
                  {selectedUser.role === 'admin' ? 'Admin' : 'O\'quvchi'}
                </Badge>
              </div>
              <div>
                <Label>Holat</Label>
                <div className="flex items-center space-x-2">
                  <Badge variant={selectedUser.is_active ? 'default' : 'destructive'}>
                    {selectedUser.is_active ? 'Faol' : 'Bloklangan'}
                  </Badge>
                  {selectedUser.is_verified && (
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      <Check className="h-3 w-3 mr-1" />
                      Tasdiqlangan
                    </Badge>
                  )}
                </div>
              </div>
              <div>
                <Label>Ro'yxatdan o'tgan</Label>
                <p className="text-sm text-gray-600">{formatDate(selectedUser.createdAt)}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Block Access Dialog */}
      <Dialog open={showBlockAccess} onOpenChange={setShowBlockAccess}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedUser?.full_name} - Blok ruxsatlari
            </DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              {isLoadingAccess ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {blocks.map((block) => {
                      const hasAccess = userBlockAccess.includes(block._id);
                      return (
                        <Card key={block._id} className={hasAccess ? 'border-green-200 bg-green-50' : ''}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-medium">{block.name}</h4>
                                <p className="text-sm text-gray-600">
                                  {formatPrice(block.price)}
                                </p>
                              </div>
                              <Badge variant={hasAccess ? 'default' : 'secondary'}>
                                {hasAccess ? 'Ruxsat berilgan' : 'Ruxsat yo\'q'}
                              </Badge>
                            </div>
                            <div className="flex justify-end space-x-2">
                              {hasAccess ? (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleRevokeAccess(selectedUser._id, block._id)}
                                  className="text-red-600 border-red-600 hover:bg-red-50"
                                >
                                  <X className="h-4 w-4 mr-1" />
                                  Ruxsatni olib tashlash
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  onClick={() => handleGrantAccess(selectedUser._id, block._id)}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <Check className="h-4 w-4 mr-1" />
                                  Ruxsat berish
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsersPage; 