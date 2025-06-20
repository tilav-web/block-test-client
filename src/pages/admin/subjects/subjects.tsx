import React, { useState, useEffect } from 'react';
import { toastSuccess, toastError } from '@/common/utils/toast-actions';
import { SubjectList } from './_components/SubjectList';
import { SubjectForm } from './_components/SubjectForm';
import { DeleteConfirmDialog } from './_components/DeleteConfirmDialog';
import { subjectService, type Subject, type CreateSubjectDto, type UpdateSubjectDto } from '@/services/subject.service';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export const SubjectPage: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [deletingSubject, setDeletingSubject] = useState<Subject | null>(null);

  // Fetch subjects on component mount
  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      setIsLoading(true);
      const data = await subjectService.getAll();
      setSubjects(data);
    } catch (error: unknown) {
      console.error('Error fetching subjects:', error);
      const apiError = error as ApiError;
      toastError(apiError.response?.data?.message || 'Fanlarni yuklashda xatolik yuz berdi');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingSubject(null);
    setShowForm(true);
  };

  const handleEdit = (subject: Subject) => {
    setEditingSubject(subject);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    const subject = subjects.find(s => s._id === id);
    if (subject) {
      setDeletingSubject(subject);
      setShowDeleteDialog(true);
    }
  };

  const handleFormSubmit = async (data: CreateSubjectDto | UpdateSubjectDto) => {
    try {
      setIsFormLoading(true);
      
      if (editingSubject) {
        // Update existing subject
        const updateData = data as UpdateSubjectDto;
        const updatedSubject = await subjectService.update(editingSubject._id, updateData);
        setSubjects(prev => prev.map(subject => 
          subject._id === editingSubject._id ? updatedSubject : subject
        ));
        toastSuccess('Fan muvaffaqiyatli yangilandi');
      } else {
        // Create new subject
        const createData = data as CreateSubjectDto;
        const newSubject = await subjectService.create(createData);
        setSubjects(prev => [...prev, newSubject]);
        toastSuccess('Fan muvaffaqiyatli qo\'shildi');
      }
      
      setShowForm(false);
      setEditingSubject(null);
    } catch (error: unknown) {
      console.error('Error saving subject:', error);
      const apiError = error as ApiError;
      toastError(apiError.response?.data?.message || 'Fan saqlashda xatolik yuz berdi');
    } finally {
      setIsFormLoading(false);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingSubject(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingSubject) return;

    try {
      setIsDeleteLoading(true);
      await subjectService.delete(deletingSubject._id);
      setSubjects(prev => prev.filter(subject => subject._id !== deletingSubject._id));
      toastSuccess('Fan muvaffaqiyatli o\'chirildi');
      setShowDeleteDialog(false);
      setDeletingSubject(null);
    } catch (error: unknown) {
      console.error('Error deleting subject:', error);
      const apiError = error as ApiError;
      toastError(apiError.response?.data?.message || 'Fan o\'chirishda xatolik yuz berdi');
    } finally {
      setIsDeleteLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteDialog(false);
    setDeletingSubject(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Fanlar boshqaruvi</h1>
          <p className="text-muted-foreground">
            Fanlarni qo'shish, tahrirlash va o'chirish
          </p>
        </div>

        <SubjectList
          subjects={subjects}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAdd={handleAdd}
          isLoading={isLoading}
        />

        {/* Form Modal */}
        {showForm && (
          <Dialog open={showForm} onOpenChange={handleFormCancel}>
            <DialogContent className="max-w-2xl">
              <SubjectForm
                subject={editingSubject}
                onSubmit={handleFormSubmit}
                onCancel={handleFormCancel}
                isLoading={isFormLoading}
              />
            </DialogContent>
          </Dialog>
        )}

        {/* Delete Confirmation Dialog */}
        {showDeleteDialog && deletingSubject && (
          <DeleteConfirmDialog
            subjectName={deletingSubject.name}
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
