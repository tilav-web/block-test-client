import React, { useState, useEffect } from 'react';
import { toastSuccess, toastError } from '@/common/utils/toast-actions';
import { BlockTable } from './_components/BlockTable';
import { BlockForm } from './_components/BlockForm';
import { DeleteConfirmDialog } from './_components/DeleteConfirmDialog';
import { BlockViewDialog } from './_components/BlockViewDialog';
import { blockService, type Block, type CreateBlockDto, type UpdateBlockDto } from '@/services/block.service';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export const BlocksPage: React.FC = () => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [editingBlock, setEditingBlock] = useState<Block | null>(null);
  const [deletingBlock, setDeletingBlock] = useState<Block | null>(null);
  const [viewingBlock, setViewingBlock] = useState<Block | null>(null);

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
      console.error('Error fetching blocks:', error);
      const apiError = error as ApiError;
      toastError(apiError.response?.data?.message || 'Bloklarni yuklashda xatolik yuz berdi');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingBlock(null);
    setShowForm(true);
  };

  const handleEdit = (block: Block) => {
    setEditingBlock(block);
    setShowForm(true);
  };

  const handleView = (block: Block) => {
    setViewingBlock(block);
    setShowViewDialog(true);
  };

  const handleDelete = (id: string) => {
    const block = blocks.find(b => b._id === id);
    if (block) {
      setDeletingBlock(block);
      setShowDeleteDialog(true);
    }
  };

  const handleFormSubmit = async (data: CreateBlockDto | UpdateBlockDto) => {
    try {
      console.log('handleFormSubmit called with data:', data);
      setIsFormLoading(true);
      
      if (editingBlock) {
        // Update existing block
        console.log('Updating existing block');
        const updateData = data as UpdateBlockDto;
        const updatedBlock = await blockService.update(editingBlock._id, updateData);
        setBlocks(prev => prev.map(block => 
          block._id === editingBlock._id ? updatedBlock : block
        ));
        toastSuccess('Blok muvaffaqiyatli yangilandi');
      } else {
        // Create new block
        console.log('Creating new block');
        const createData = data as CreateBlockDto;
        const newBlock = await blockService.create(createData);
        setBlocks(prev => [...prev, newBlock]);
        toastSuccess('Blok muvaffaqiyatli qo\'shildi');
      }
      
      setShowForm(false);
      setEditingBlock(null);
    } catch (error: unknown) {
      console.error('Error saving block:', error);
      const apiError = error as ApiError;
      toastError(apiError.response?.data?.message || 'Blok saqlashda xatolik yuz berdi');
    } finally {
      setIsFormLoading(false);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingBlock(null);
  };

  const handleViewClose = () => {
    setShowViewDialog(false);
    setViewingBlock(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingBlock) return;

    try {
      setIsDeleteLoading(true);
      await blockService.delete(deletingBlock._id);
      setBlocks(prev => prev.filter(block => block._id !== deletingBlock._id));
      toastSuccess('Blok muvaffaqiyatli o\'chirildi');
      setShowDeleteDialog(false);
      setDeletingBlock(null);
    } catch (error: unknown) {
      console.error('Error deleting block:', error);
      const apiError = error as ApiError;
      toastError(apiError.response?.data?.message || 'Blok o\'chirishda xatolik yuz berdi');
    } finally {
      setIsDeleteLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteDialog(false);
    setDeletingBlock(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Bloklar boshqaruvi</h1>
          <p className="text-muted-foreground">
            Bloklarni qo'shish, tahrirlash va o'chirish
          </p>
        </div>

        <BlockTable
          blocks={blocks}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAdd={handleAdd}
          onView={handleView}
          isLoading={isLoading}
        />

        {/* Form Modal */}
        {showForm && (
          <Dialog open={showForm} onOpenChange={handleFormCancel}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <BlockForm
                block={editingBlock}
                onSubmit={handleFormSubmit}
                onCancel={handleFormCancel}
                isLoading={isFormLoading}
              />
            </DialogContent>
          </Dialog>
        )}

        {/* View Dialog */}
        {showViewDialog && viewingBlock && (
          <BlockViewDialog
            block={viewingBlock}
            onClose={handleViewClose}
            open={showViewDialog}
          />
        )}

        {/* Delete Confirmation Dialog */}
        {showDeleteDialog && deletingBlock && (
          <DeleteConfirmDialog
            blockName={deletingBlock.name}
            onConfirm={handleDeleteConfirm}
            onCancel={handleDeleteCancel}
            isLoading={isDeleteLoading}
            open={showDeleteDialog}
          />
        )}
      </div>
    </div>
  );
};

export default BlocksPage;
