import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, AlertTriangle } from 'lucide-react';

interface DeleteConfirmDialogProps {
  blockName: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
  open: boolean;
}

export const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  blockName,
  onConfirm,
  onCancel,
  isLoading,
  open,
}) => {
  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Blokni o'chirish
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-gray-600">
            <strong>"{blockName}"</strong> blokini o'chirishni xohlaysizmi?
          </p>
          
          <p className="text-sm text-red-600">
            Bu amalni qaytarib bo'lmaydi va blok bilan bog'liq barcha ma'lumotlar o'chiriladi.
          </p>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Bekor qilish
            </Button>
            <Button
              variant="destructive"
              onClick={onConfirm}
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              O'chirish
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 