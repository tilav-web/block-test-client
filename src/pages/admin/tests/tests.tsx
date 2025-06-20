import React, { useState, useEffect } from 'react';
import { toastSuccess, toastError } from '@/common/utils/toast-actions';
import { TestTable } from './_components/TestTable';
import { TestForm } from './_components/TestForm';
import { DeleteConfirmDialog } from './_components/DeleteConfirmDialog';
import { TestViewDialog } from './_components/TestViewDialog';
import { testsService, type Test, type CreateTestDto, type UpdateTestDto, type CreateTestWithFilesDto } from '@/services/tests.service';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { blockService, type Block } from '@/services/block.service';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ChevronsUpDown, Check } from 'lucide-react';

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export const TestsPage: React.FC = () => {
  const [tests, setTests] = useState<Test[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [editingTest, setEditingTest] = useState<Test | null>(null);
  const [deletingTest, setDeletingTest] = useState<Test | null>(null);
  const [viewingTest, setViewingTest] = useState<Test | null>(null);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [blockSearch, setBlockSearch] = useState('');
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [blockPopoverOpen, setBlockPopoverOpen] = useState(false);

  useEffect(() => {
    fetchTests();
    fetchBlocks();
  }, []);

  const fetchTests = async () => {
    try {
      setIsLoading(true);
      const data = await testsService.getAll();
      setTests(data);
    } catch (error: unknown) {
      console.error('Error fetching tests:', error);
      const apiError = error as ApiError;
      toastError(apiError.response?.data?.message || 'Testlarni yuklashda xatolik yuz berdi');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBlocks = async () => {
    try {
      const data = await blockService.getAll();
      setBlocks(data);
    } catch {
      toastError('Bloklarni yuklashda xatolik yuz berdi');
    }
  };

  const handleAdd = () => {
    setEditingTest(null);
    setShowForm(true);
  };

  const handleEdit = (test: Test) => {
    setEditingTest(test);
    setShowForm(true);
  };

  const handleView = (test: Test) => {
    setViewingTest(test);
    setShowViewDialog(true);
  };

  const handleDelete = (id: string) => {
    const test = tests.find(t => t._id === id);
    if (test) {
      setDeletingTest(test);
      setShowDeleteDialog(true);
    }
  };

  const handleFormSubmit = async (data: CreateTestDto | UpdateTestDto | CreateTestWithFilesDto) => {
    try {
      console.log('handleFormSubmit called with data:', data);
      setIsFormLoading(true);
      
      if (editingTest) {
        // Update existing test
        console.log('Updating existing test');
        const updateData = data as UpdateTestDto;
        const updatedTest = await testsService.update(editingTest._id, updateData);
        setTests(prev => prev.map(test => 
          test._id === editingTest._id ? updatedTest : test
        ));
        toastSuccess('Test muvaffaqiyatli yangilandi');
      } else {
        // Create new test
        console.log('Creating new test');
        if ('questionFile' in data || 'optionFiles' in data) {
          // Use file upload method
          console.log('Using file upload method');
          const createData = data as CreateTestWithFilesDto;
          const newTest = await testsService.createWithFiles(createData);
          setTests(prev => [...prev, newTest]);
          toastSuccess('Test muvaffaqiyatli qo\'shildi');
        } else {
          // Use regular method
          console.log('Using regular method');
          const createData = data as CreateTestDto;
          const newTest = await testsService.create(createData);
          setTests(prev => [...prev, newTest]);
          toastSuccess('Test muvaffaqiyatli qo\'shildi');
        }
      }
      
      setShowForm(false);
      setEditingTest(null);
    } catch (error: unknown) {
      console.error('Error saving test:', error);
      const apiError = error as ApiError;
      toastError(apiError.response?.data?.message || 'Test saqlashda xatolik yuz berdi');
    } finally {
      setIsFormLoading(false);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingTest(null);
  };

  const handleViewClose = () => {
    setShowViewDialog(false);
    setViewingTest(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingTest) return;

    try {
      setIsDeleteLoading(true);
      await testsService.delete(deletingTest._id);
      setTests(prev => prev.filter(test => test._id !== deletingTest._id));
      toastSuccess('Test muvaffaqiyatli o\'chirildi');
      setShowDeleteDialog(false);
      setDeletingTest(null);
    } catch (error: unknown) {
      console.error('Error deleting test:', error);
      const apiError = error as ApiError;
      toastError(apiError.response?.data?.message || 'Test o\'chirishda xatolik yuz berdi');
    } finally {
      setIsDeleteLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteDialog(false);
    setDeletingTest(null);
  };

  // Filter blocks by search
  const filteredBlocks = blocks.filter((block) =>
    block.name.toLowerCase().includes(blockSearch.toLowerCase())
  );
  const selectedBlock = blocks.find((b) => b._id === selectedBlockId);

  // Optionally filter tests by selected block
  const filteredTests = selectedBlockId
    ? tests.filter((t) => t.subject && t.subject._id && t.subject._id === selectedBlockId)
    : tests;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Testlar boshqaruvi</h1>
          <p className="text-muted-foreground">
            Testlarni qo'shish, tahrirlash va o'chirish
          </p>
        </div>
        {/* Block selection combobox */}
        <div className="mb-6 max-w-xs">
          <Popover open={blockPopoverOpen} onOpenChange={setBlockPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={blockPopoverOpen}
                className="w-full justify-between"
              >
                {selectedBlock ? selectedBlock.name : 'Blokni tanlang...'}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput
                  placeholder="Blok nomi bo'yicha qidiring..."
                  value={blockSearch}
                  onValueChange={setBlockSearch}
                  className="h-9"
                />
                <CommandList>
                  <CommandEmpty>Blok topilmadi.</CommandEmpty>
                  <CommandGroup>
                    {filteredBlocks.map((block) => (
                      <CommandItem
                        key={block._id}
                        value={block.name}
                        onSelect={() => {
                          setSelectedBlockId(block._id);
                          setBlockPopoverOpen(false);
                        }}
                      >
                        {block.name}
                        <Check
                          className={
                            'ml-auto ' +
                            (selectedBlockId === block._id ? 'opacity-100' : 'opacity-0')
                          }
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        <TestTable
          tests={filteredTests}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAdd={handleAdd}
          onView={handleView}
          isLoading={isLoading}
        />

        {/* Form Modal */}
        {showForm && (
          <Dialog open={showForm} onOpenChange={handleFormCancel}>
            <DialogContent className="w-full sm:max-w-[70vw] max-w-[90vw] max-h-[90vh] overflow-y-auto">
              <TestForm
                test={editingTest}
                onSubmit={handleFormSubmit}
                onCancel={handleFormCancel}
                isLoading={isFormLoading}
              />
            </DialogContent>
          </Dialog>
        )}

        {/* View Dialog */}
        {showViewDialog && viewingTest && (
          <TestViewDialog
            test={viewingTest}
            onClose={handleViewClose}
            open={showViewDialog}
          />
        )}

        {/* Delete Confirmation Dialog */}
        {showDeleteDialog && deletingTest && (
          <DeleteConfirmDialog
            testQuestion={deletingTest.question}
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