import React from 'react';
import type { Test } from '@/services/tests.service';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2, Plus, Eye, Type, Upload, Link } from 'lucide-react';

interface TestTableProps {
  tests: Test[];
  onEdit: (test: Test) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  onView: (test: Test) => void;
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

const truncateText = (text: string, maxLength: number = 50) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const TestTable: React.FC<TestTableProps> = ({
  tests,
  onEdit,
  onDelete,
  onAdd,
  onView,
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
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">Hali hech qanday test qo'shilmagan</p>
          <Button onClick={onAdd} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Birinchi testni qo'shing
          </Button>
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">№</TableHead>
                <TableHead>Savol</TableHead>
                <TableHead>Daraja</TableHead>
                <TableHead>Fan</TableHead>
                <TableHead>Savol turi</TableHead>
                <TableHead>Variantlar soni</TableHead>
                <TableHead>Yaratilgan</TableHead>
                <TableHead className="w-[150px]">Amallar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tests.map((test, index) => (
                <TableRow key={test._id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>
                    <div className="max-w-xs">
                      <p className="font-medium truncate" title={test.question}>
                        {truncateText(test.question, 60)}
                      </p>
                      {test.target && test.type !== 'text' && (
                        <p className="text-xs text-gray-500 truncate" title={test.target}>
                          {test.type === 'file' ? '📎 Fayl' : '🔗 URL'}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      test.degree === 'easy' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {test.degree === 'easy' ? 'Oson' : 'Qiyin'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{test.subject.name}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTypeIcon(test.type)}
                      <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(test.type)}`}>
                        {getTypeLabel(test.type)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">
                      {test.options.length} ta
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">
                      {new Date(test.createdAt).toLocaleDateString('uz-UZ')}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onView(test)}
                        title="Ko'rish"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(test)}
                        title="Tahrirlash"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(test._id)}
                        className="text-destructive hover:text-destructive"
                        title="O'chirish"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}; 