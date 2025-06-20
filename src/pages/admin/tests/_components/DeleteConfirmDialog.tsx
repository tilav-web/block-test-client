import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertTriangle } from 'lucide-react';

interface DeleteConfirmDialogProps {
  testQuestion: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
  open: boolean;
}

export const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  testQuestion,
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
            <AlertTriangle className="h-5 w-5 text-destructive" />
            O'chirishni tasdiqlang
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-muted-foreground">
            <strong>"{testQuestion}"</strong> testini o'chirishni xohlaysizmi?
          </p>
          <p className="text-sm text-destructive">
            ⚠️ Bu amalni qaytarib bo'lmaydi. Bu test va uning barcha variantlari ham o'chiriladi.
          </p>
        </div>

        <DialogFooter>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              'O\'chirish'
            )}
          </Button>
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1"
          >
            Bekor qilish
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 