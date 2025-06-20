import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save } from 'lucide-react';
import type { Subject, CreateSubjectDto, UpdateSubjectDto } from '@/services/subject.service';

interface SubjectFormProps {
  subject?: Subject | null;
  onSubmit: (data: CreateSubjectDto | UpdateSubjectDto) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export const SubjectForm: React.FC<SubjectFormProps> = ({
  subject,
  onSubmit,
  onCancel,
  isLoading,
}) => {
  const [name, setName] = useState('');

  useEffect(() => {
    if (subject) {
      setName(subject.name);
    } else {
      setName('');
    }
  }, [subject]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit({ name: name.trim() });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          {subject ? 'Fanni tahrirlash' : 'Yangi fan qo\'shish'}
        </h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Fan nomi</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Masalan: Matematika"
            required
            disabled={isLoading}
          />
        </div>
        <div className="flex gap-2">
          <Button
            type="submit"
            disabled={isLoading || !name.trim()}
            className="flex-1"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {subject ? 'Saqlash' : 'Qo\'shish'}
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Bekor qilish
          </Button>
        </div>
      </form>
    </div>
  );
}; 