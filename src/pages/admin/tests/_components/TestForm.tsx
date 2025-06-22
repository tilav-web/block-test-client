import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, Plus, Trash2, Upload, Link, Type } from 'lucide-react';
import type { Test, CreateTestDto, UpdateTestDto, TestType, TestDegree, OptionType, CreateOptionDto, CreateTestWithFilesDto } from '@/services/tests.service';
import type { Subject } from '@/services/subject.service';
import { subjectService } from '@/services/subject.service';
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
import { useDebounce } from '@/hooks/use-debounce';

interface TestFormProps {
  test?: Test | null;
  onSubmit: (data: CreateTestDto | UpdateTestDto | CreateTestWithFilesDto) => void;
  onCancel: () => void;
  isLoading: boolean;
}

interface OptionData {
  type: OptionType;
  value: string;
  file?: File | null;
}

export const TestForm: React.FC<TestFormProps> = ({
  test,
  onSubmit,
  onCancel,
  isLoading,
}) => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [initialSubjects, setInitialSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [question, setQuestion] = useState('');
  const [target, setTarget] = useState('');
  const [degree, setDegree] = useState<TestDegree>('hard');
  const [questionFile, setQuestionFile] = useState<File | null>(null);
  const [questionType, setQuestionType] = useState<TestType>('text');
  const [options, setOptions] = useState<OptionData[]>([
    { type: 'text', value: '' },
    { type: 'text', value: '' },
    { type: 'text', value: '' },
    { type: 'text', value: '' }
  ]);
  const [correctOptionIndex, setCorrectOptionIndex] = useState(0);
  const [subjectSearch, setSubjectSearch] = useState('');
  const [subjectPopoverOpen, setSubjectPopoverOpen] = useState(false);
  const debouncedSubjectSearch = useDebounce(subjectSearch, 400);

  // Test type options
  const testTypeOptions: { value: TestType; label: string; icon: React.ReactNode }[] = [
    { value: 'text', label: 'Matn', icon: <Type className="h-4 w-4" /> },
    { value: 'file', label: 'Rasm', icon: <Upload className="h-4 w-4" /> },
    { value: 'url', label: 'URL', icon: <Link className="h-4 w-4" /> },
  ];
  // Option type options
  const optionTypeOptions: { value: OptionType; label: string }[] = [
    { value: 'text', label: 'Matn' },
    { value: 'file', label: 'Rasm' },
    { value: 'url', label: 'URL' },
  ];

  const degreeOptions = [
    { value: 'easy', label: 'Oson' },
    { value: 'hard', label: 'Qiyin' },
  ];

  useEffect(() => {
    // Fetch only 10 subjects initially
    subjectService.getLimited(10).then((data) => {
      setSubjects(data);
      setInitialSubjects(data);
    });
  }, []);

  useEffect(() => {
    if (debouncedSubjectSearch.trim() === '') {
      setSubjects(initialSubjects);
    } else {
      subjectService.searchByName(debouncedSubjectSearch).then(setSubjects);
    }
  }, [debouncedSubjectSearch, initialSubjects]);

  useEffect(() => {
    if (test) {
      setSelectedSubject(test.subject._id);
      setQuestion(test.question);
      setTarget(test.target || '');
      setDegree(test.degree);
      setQuestionType(test.type);
      setOptions(test.options.map(opt => ({ type: opt.type, value: opt.value })));
      const correctIndex = test.options.findIndex(opt => opt._id === test.correctOptionId);
      setCorrectOptionIndex(correctIndex >= 0 ? correctIndex : 0);
    } else {
      setSelectedSubject('');
      setQuestion('');
      setTarget('');
      setDegree('hard');
      setQuestionType('text');
      setOptions([
        { type: 'text', value: '' },
        { type: 'text', value: '' },
        { type: 'text', value: '' },
        { type: 'text', value: '' }
      ]);
      setCorrectOptionIndex(0);
    }
  }, [test]);

  const handleAddOption = () => {
    setOptions([...options, { type: 'text', value: '' }]);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
      if (correctOptionIndex >= newOptions.length) {
        setCorrectOptionIndex(newOptions.length - 1);
      }
    }
  };

  const handleOptionChange = (index: number, field: 'type' | 'value', value: string) => {
    const newOptions = [...options];
    if (field === 'type') {
      newOptions[index] = { ...newOptions[index], type: value as OptionType, file: undefined };
    } else {
      newOptions[index] = { ...newOptions[index], value };
    }
    setOptions(newOptions);
  };

  const handleOptionFileChange = (index: number, file: File | null) => {
    const newOptions = [...options];
    newOptions[index] = { 
      ...newOptions[index], 
      file,
      value: file ? file.name : ''
    };
    setOptions(newOptions);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submission started');
    console.log('Form data:', {
      selectedSubject,
      question,
      target,
      questionFile,
      questionType,
      options,
      correctOptionIndex,
      degree
    });
    
    if (!selectedSubject || options.some(opt => !opt.value.trim())) {
      console.log('Validation failed: missing subject or option values');
      return;
    }

    const filteredOptions = options.filter(opt => opt.value.trim());
    if (filteredOptions.length < 2) {
      console.log('Validation failed: not enough options');
      return;
    }

    // Check if we have file uploads
    const hasQuestionFile = questionType === 'file' && questionFile;
    const hasOptionFiles = options.some(opt => opt.type === 'file' && opt.file);

    console.log('File upload check:', { hasQuestionFile, hasOptionFiles });

    if (hasQuestionFile || hasOptionFiles) {
      // Use file upload method
      const formData: CreateTestWithFilesDto = {
        subject: selectedSubject,
        question: question.trim(),
        type: questionType,
        options: filteredOptions.map(opt => ({ type: opt.type, value: opt.value })),
        correctOptionValue: filteredOptions[correctOptionIndex].value,
        degree: degree,
      };

      if (hasQuestionFile) {
        formData.questionFile = questionFile!;
      }

      if (hasOptionFiles) {
        // Collect only the files that correspond to file-type options
        const optionFiles: File[] = [];
        filteredOptions.forEach((opt) => {
          const originalOption = options.find(o => o.value === opt.value);
          if (originalOption?.file) {
            optionFiles.push(originalOption.file);
          }
        });
        formData.optionFiles = optionFiles;
      }

      console.log('Submitting with files:', formData);
      onSubmit(formData);
    } else {
      // Use regular method
      const formData: CreateTestDto = {
        subject: selectedSubject,
        question: question.trim(),
        target: target.trim(),
        type: questionType,
        options: filteredOptions as CreateOptionDto[],
        correctOptionValue: filteredOptions[correctOptionIndex].value,
        degree: degree,
      };

      console.log('Submitting without files:', formData);
      onSubmit(formData);
    }
  };

  const isValid = selectedSubject &&
    ((questionType === 'file' && questionFile) ||
      (questionType === 'url' && target.trim() && question.trim()) ||
      (questionType === 'text' && question.trim())) &&
    options.filter(opt => opt.value.trim() || opt.file).length >= 2;

  const getTypeIcon = (type: TestType) => {
    switch (type) {
      case 'text':
        return <Type className="h-4 w-4" />;
      case 'file':
        return <Upload className="h-4 w-4" />;
      case 'url':
        return <Link className="h-4 w-4" />;
      default:
        return <Type className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: TestType) => {
    switch (type) {
      case 'text':
        return 'Matn';
      case 'file':
        return 'Fayl';
      case 'url':
        return 'URL';
      default:
        return type;
    }
  };

  const getInputType = (type: TestType) => {
    switch (type) {
      case 'text':
        return 'text';
      case 'file':
        return 'file';
      case 'url':
        return 'url';
      default:
        return 'text';
    }
  };

  const getPlaceholder = (type: TestType) => {
    switch (type) {
      case 'text':
        return 'Matn kiriting...';
      case 'file':
        return 'Fayl tanlang...';
      case 'url':
        return 'URL manzil kiriting...';
      default:
        return 'Qiymat kiriting...';
    }
  };

  const handleQuestionTypeChange = (newType: TestType) => {
    setQuestionType(newType);
    
    // Clear question and target when switching types
    if (newType === 'file') {
      setQuestion('');
      setTarget('');
      setQuestionFile(null);
    } else if (newType === 'url') {
      setQuestion('');
      setTarget('');
      setQuestionFile(null);
    } else if (newType === 'text') {
      setTarget('');
      setQuestionFile(null);
    }
  };

  const filteredSubjects = subjects;
  const selectedSubjectObj = subjects.find((s) => s._id === selectedSubject);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          {test ? 'Testni tahrirlash' : 'Yangi test qo\'shish'}
        </h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Subject (Fan) selection combobox */}
        <div className="mb-4">
          <Label>Fan</Label>
          <Popover open={subjectPopoverOpen} onOpenChange={setSubjectPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={subjectPopoverOpen}
                className="w-full justify-between"
                type="button"
              >
                {selectedSubjectObj ? selectedSubjectObj.name : 'Fan tanlang...'}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput
                  placeholder="Fan nomi bo'yicha qidiring..."
                  value={subjectSearch}
                  onValueChange={setSubjectSearch}
                  className="h-9"
                />
                <CommandList>
                  <CommandEmpty>Fan topilmadi.</CommandEmpty>
                  <CommandGroup>
                    {filteredSubjects.map((subject) => (
                      <CommandItem
                        key={subject._id}
                        value={subject.name}
                        onSelect={() => {
                          setSelectedSubject(subject._id);
                          setSubjectPopoverOpen(false);
                        }}
                      >
                        {subject.name}
                        <Check
                          className={
                            'ml-auto ' +
                            (selectedSubject === subject._id ? 'opacity-100' : 'opacity-0')
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

        {/* Question Type */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {/* Button group for test type */}
            {testTypeOptions.map((opt) => (
              <Button
                key={opt.value}
                type="button"
                variant={questionType === opt.value ? 'default' : 'outline'}
                onClick={() => handleQuestionTypeChange(opt.value as TestType)}
                className={questionType === opt.value ? 'bg-blue-600 text-white' : ''}
              >
                {opt.icon} <span className="ml-1">{opt.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Question */}
        <div className="space-y-2">
          <Label htmlFor="question" className="flex items-center gap-2">
            {getTypeIcon(questionType)}
            Savol ({getTypeLabel(questionType)} turi)
          </Label>
          {questionType === 'file' ? (
            <div className="space-y-2">
              <Input
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  setQuestionFile(file || null);
                  if (file) {
                    setQuestion(file.name);
                  }
                }}
                disabled={isLoading}
                accept="image/*"
              />
              {questionFile && (
                <div className="text-sm text-gray-500">
                  Tanlangan fayl: {questionFile.name}
                </div>
              )}
              <textarea
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Savol matnini kiriting (masalan: Bu rasmda nima ko'rsatilgan?)"
                disabled={isLoading}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
          ) : questionType === 'url' ? (
            <div className="space-y-2">
              <Input
                type="url"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="URL manzilini kiriting..."
                required
                disabled={isLoading}
              />
              <textarea
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Savol matnini kiriting (masalan: Bu rasmda nima ko'rsatilgan?)"
                required
                disabled={isLoading}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
          ) : (
            <textarea
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Savol matnini kiriting..."
              required
              disabled={isLoading}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          )}
        </div>

        {/* Degree */}
        <div className="space-y-2">
          <Label htmlFor="degree">Daraja</Label>
          <div className="flex gap-2">
            {degreeOptions.map((opt) => (
              <Button
                key={opt.value}
                type="button"
                variant={degree === opt.value ? 'default' : 'outline'}
                onClick={() => setDegree(opt.value as TestDegree)}
                className={degree === opt.value ? 'bg-blue-600 text-white' : ''}
                disabled={isLoading}
              >
                {opt.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Options */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {options.map((option, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correctOption"
                      checked={correctOptionIndex === index}
                      onChange={() => setCorrectOptionIndex(index)}
                      disabled={isLoading}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-medium text-green-600">To'g'ri javob</span>
                  </div>
                  <span className="text-sm text-gray-500">Variant {index + 1}</span>
                  {options.length > 2 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveOption(index)}
                      disabled={isLoading}
                      className="text-destructive hover:text-destructive ml-auto"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    {optionTypeOptions.map((opt) => (
                      <Button
                        key={opt.value}
                        type="button"
                        variant={option.type === opt.value ? 'default' : 'outline'}
                        onClick={() => handleOptionChange(index, 'type', opt.value)}
                        className={option.type === opt.value ? 'bg-blue-600 text-white' : ''}
                      >
                        {opt.label}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  {option.type === 'file' ? (
                    <div className="space-y-2">
                      <Input
                        type="file"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          handleOptionFileChange(index, file || null);
                        }}
                        disabled={isLoading}
                        className="text-sm"
                        accept="image/*"
                      />
                      {option.file && (
                        <div className="text-xs text-gray-500">
                          Tanlangan fayl: {option.file.name}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Input
                      type={getInputType(option.type)}
                      value={option.value}
                      onChange={(e) => handleOptionChange(index, 'value', e.target.value)}
                      placeholder={getPlaceholder(option.type)}
                      disabled={isLoading}
                      className="text-sm"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className='w-full'
              onClick={handleAddOption}
              disabled={isLoading}
            >
              <Plus className="h-4 w-4 mr-2" />
              Variant qo'shish
            </Button>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-2 pt-4">
          <Button
            type="submit"
            disabled={isLoading || !isValid}
            className="flex-1"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {test ? 'Saqlash' : 'Qo\'shish'}
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