import React from 'react';
import type { Test } from '@/services/tests.service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Trash2, Plus, FileText, Link, Type, Upload } from 'lucide-react';

interface TestListProps {
  tests: Test[];
  onEdit: (test: Test) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  isLoading: boolean;
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'text':
      return <Type className="h-3 w-3" />;
    case 'file':
      return <Upload className="h-3 w-3" />;
    case 'url':
      return <Link className="h-3 w-3" />;
    default:
      return <Type className="h-3 w-3" />;
  }
};

const getTypeLabel = (type: string) => {
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

const getTypeColor = (type: string) => {
  switch (type) {
    case 'text':
      return 'bg-blue-100 text-blue-800';
    case 'file':
      return 'bg-green-100 text-green-800';
    case 'url':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const TestList: React.FC<TestListProps> = ({
  tests,
  onEdit,
  onDelete,
  onAdd,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Testlar</h2>
        <Button onClick={onAdd} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Yangi Test
        </Button>
      </div>

      {tests.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">Hali hech qanday test qo'shilmagan</p>
            <Button onClick={onAdd} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Birinchi testni qo'shing
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {tests.map((test) => (
            <Card key={test._id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg line-clamp-2">{test.question}</CardTitle>
                  <div className="flex items-center gap-2">
                    {getTypeIcon(test.type)}
                    <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(test.type)}`}>
                      Savol: {getTypeLabel(test.type)}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Fan: {test.subject?.name || 'Aniqlanmagan'}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Options Preview */}
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-700">Variantlar:</div>
                    <div className="space-y-1">
                      {test.options?.slice(0, 3).map((option, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs text-gray-600">
                          <span className="font-medium">{index + 1}.</span>
                          <span className="truncate flex-1">{option.value}</span>
                          <div className="flex items-center gap-1 text-gray-400">
                            {getTypeIcon(option.type)}
                            <span>{getTypeLabel(option.type)}</span>
                          </div>
                        </div>
                      ))}
                      {test.options?.length > 3 && (
                        <div className="text-xs text-gray-500">
                          +{test.options?.length - 3} ta variant ko'proq
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Correct Answer */}
                  <div className="text-sm">
                    <span className="font-medium text-green-600">To'g'ri javob: </span>
                    <span className="text-gray-700">
                      {test.options?.find(opt => opt?._id === test?.correctOptionId)?.value || 'Aniqlanmagan'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                    <div className="text-sm text-muted-foreground">
                      {new Date(test.createdAt).toLocaleDateString('uz-UZ')}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(test)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDelete(test._id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}; 