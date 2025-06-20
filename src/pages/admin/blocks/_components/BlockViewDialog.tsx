import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Block } from '@/services/block.service';

interface BlockViewDialogProps {
  block: Block;
  open: boolean;
  onClose: () => void;
}

export const BlockViewDialog: React.FC<BlockViewDialogProps> = ({
  block,
  open,
  onClose,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Blok ma'lumotlari</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Asosiy ma'lumotlar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Blok nomi:</label>
                <p className="text-lg font-semibold mt-1">{block.name}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Narxi:</label>
                <p className="text-lg font-semibold text-green-600 mt-1">
                  {block.price.toLocaleString('uz-UZ', {
                    style: 'currency',
                    currency: 'UZS',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Yaratilgan sana:</label>
                  <p className="text-sm text-gray-600 mt-1">{formatDate(block.createdAt)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Yangilangan sana:</label>
                  <p className="text-sm text-gray-600 mt-1">{formatDate(block.updatedAt)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Subject */}
          {block.main && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Asosiy fan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {block.main.name}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Additional Subject */}
          {block.addition && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Qo'shimcha fan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    {block.addition.name}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Mandatory Subjects */}
          {block.mandatory && block.mandatory.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Majburiy fanlar ({block.mandatory.length} ta)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {block.mandatory.map((subject) => (
                    <span
                      key={subject._id}
                      className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                    >
                      {subject.name}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Umumiy ma'lumot</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Narxi:</span>
                  <span className="ml-2 text-green-600 font-semibold">
                    {block.price.toLocaleString('uz-UZ', {
                      style: 'currency',
                      currency: 'UZS',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Asosiy fan:</span>
                  <span className="ml-2 text-gray-600">
                    {block.main ? 'Mavjud' : 'Mavjud emas'}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Qo'shimcha fan:</span>
                  <span className="ml-2 text-gray-600">
                    {block.addition ? 'Mavjud' : 'Mavjud emas'}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Majburiy fanlar:</span>
                  <span className="ml-2 text-gray-600">
                    {block.mandatory ? `${block.mandatory.length} ta` : 'Mavjud emas'}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Jami fanlar:</span>
                  <span className="ml-2 text-gray-600">
                    {[
                      block.main ? 1 : 0,
                      block.addition ? 1 : 0,
                      block.mandatory ? block.mandatory.length : 0
                    ].reduce((a, b) => a + b, 0)} ta
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 