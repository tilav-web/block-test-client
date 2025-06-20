import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, X } from 'lucide-react';
import type { Block, CreateBlockDto, UpdateBlockDto } from '@/services/block.service';
import { subjectService, type Subject } from '@/services/subject.service';

interface BlockFormProps {
  block?: Block | null;
  onSubmit: (data: CreateBlockDto | UpdateBlockDto) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export const BlockForm: React.FC<BlockFormProps> = ({
  block,
  onSubmit,
  onCancel,
  isLoading,
}) => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(true);
  const [formData, setFormData] = useState({
    name: block?.name || '',
    price: block?.price || 0,
    main: block?.main?._id || '',
    addition: block?.addition?._id || '',
    mandatory: block?.mandatory?.map(s => s._id) || [],
  });

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      setIsLoadingSubjects(true);
      const data = await subjectService.getAll();
      setSubjects(data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    } finally {
      setIsLoadingSubjects(false);
    }
  };

  const handleInputChange = (field: string, value: string | string[] | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleMandatoryToggle = (subjectId: string) => {
    setFormData(prev => ({
      ...prev,
      mandatory: prev.mandatory.includes(subjectId)
        ? prev.mandatory.filter(id => id !== subjectId)
        : [...prev.mandatory, subjectId],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      name: formData.name,
      price: formData.price,
      ...(formData.main && { main: formData.main }),
      ...(formData.addition && { addition: formData.addition }),
      ...(formData.mandatory.length > 0 && { mandatory: formData.mandatory }),
    };

    onSubmit(submitData);
  };

  const isFormValid = formData.name.trim().length > 0 && formData.price >= 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {block ? 'Blokni tahrirlash' : 'Yangi blok qo\'shish'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Block Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Blok nomi *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Blok nomini kiriting"
              required
            />
          </div>

          {/* Block Price */}
          <div className="space-y-2">
            <Label htmlFor="price">Narxi *</Label>
            <Input
              id="price"
              type="number"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
              placeholder="Blok narxini kiriting"
              required
            />
          </div>

          {/* Main Subject */}
          <div className="space-y-2">
            <Label htmlFor="main">Asosiy fan</Label>
            <select
              id="main"
              value={formData.main}
              onChange={(e) => handleInputChange('main', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Asosiy fanni tanlang</option>
              {subjects.map((subject) => (
                <option key={subject._id} value={subject._id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>

          {/* Additional Subject */}
          <div className="space-y-2">
            <Label htmlFor="addition">Qo'shimcha fan</Label>
            <select
              id="addition"
              value={formData.addition}
              onChange={(e) => handleInputChange('addition', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Qo'shimcha fanni tanlang</option>
              {subjects.map((subject) => (
                <option key={subject._id} value={subject._id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>

          {/* Mandatory Subjects */}
          <div className="space-y-2">
            <Label>Majburiy fanlar</Label>
            {isLoadingSubjects ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span>Fanlar yuklanmoqda...</span>
              </div>
            ) : (
              <div className="space-y-2 max-h-40 overflow-y-auto border rounded-md p-3">
                {subjects.length === 0 ? (
                  <p className="text-sm text-gray-500">Hali fanlar qo'shilmagan</p>
                ) : (
                  subjects.map((subject) => (
                    <label key={subject._id} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.mandatory.includes(subject._id)}
                        onChange={() => handleMandatoryToggle(subject._id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm">{subject.name}</span>
                    </label>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Selected Mandatory Subjects */}
          {formData.mandatory.length > 0 && (
            <div className="space-y-2">
              <Label>Tanlangan majburiy fanlar:</Label>
              <div className="flex flex-wrap gap-2">
                {formData.mandatory.map((subjectId) => {
                  const subject = subjects.find(s => s._id === subjectId);
                  return subject ? (
                    <div
                      key={subjectId}
                      className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
                    >
                      <span>{subject.name}</span>
                      <button
                        type="button"
                        onClick={() => handleMandatoryToggle(subjectId)}
                        className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Bekor qilish
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid || isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {block ? 'Yangilash' : 'Qo\'shish'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}; 