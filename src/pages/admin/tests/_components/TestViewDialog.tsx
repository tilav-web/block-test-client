import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Type, Upload, Link, CheckCircle } from 'lucide-react';
import type { Test } from '@/services/tests.service';
import { serverUrl } from '@/common/utils/shared';

interface TestViewDialogProps {
  test: Test;
  onClose: () => void;
  open: boolean;
}

const getTypeIcon = (type: string) => {
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

const renderContent = (type: string, value: string) => {
  if (type === 'text') {
    return <p className="text-gray-700">{value}</p>;
  } else if (type === 'file' || type === 'url') {
    // Check if the value is an image URL
    const isImage = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(value) || 
                   value.startsWith('data:image/') ||
                   value.includes('blob:');
    
    if (isImage) {
      return (
        <div className="mt-2">
          <img 
            src={`${serverUrl}${value}`} 
            alt="Content" 
            className="max-w-full h-auto max-h-64 rounded-lg border"
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement;
              target.style.display = 'none';
              const errorMsg = target.nextElementSibling as HTMLElement;
              if (errorMsg) errorMsg.style.display = 'block';
            }}
          />
          <p className="text-red-500 text-sm mt-1 hidden">Rasm yuklanmadi</p>
        </div>
      );
    } else {
      return (
        <div className="mt-2">
          <a 
            href={value} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline break-all"
          >
            {value}
          </a>
        </div>
      );
    }
  }
  return <p className="text-gray-700">{value}</p>;
};

export const TestViewDialog: React.FC<TestViewDialogProps> = ({ test, onClose, open }) => {

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Test ma'lumotlari</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Subject */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Fan</h3>
            <p className="text-lg font-medium">{test.subject.name}</p>
          </div>

          {/* Question */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-sm font-medium text-gray-500">Savol</h3>
              <div className="flex items-center gap-1">
                {getTypeIcon(test.type)}
                <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(test.type)}`}>
                  {getTypeLabel(test.type)}
                </span>
              </div>
            </div>
            <p className="text-gray-700 mb-2">{test.question}</p>
            {test.target && (test.type === 'file' || test.type === 'url') && (
              <div className="mt-2">
                {test.type === 'file' ? (
                  renderContent('file', test.target)
                ) : (
                  renderContent('url', test.target)
                )}
              </div>
            )}
          </div>

          {/* Degree */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Daraja</h3>
            <span className={`text-sm px-2 py-1 rounded-full ${
              test.degree === 'easy' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {test.degree === 'easy' ? 'Oson' : 'Qiyin'}
            </span>
          </div>

          {/* Options */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-3">Variantlar</h3>
            <div className="space-y-3">
              {test.options.map((option, index) => (
                <div 
                  key={option._id} 
                  className={`p-3 rounded-lg border ${
                    option._id === test.correctOptionId 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-700">{index + 1}.</span>
                      {option._id === test.correctOptionId && (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getTypeIcon(option.type)}
                        <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(option.type)}`}>
                          {getTypeLabel(option.type)}
                        </span>
                      </div>
                      {renderContent(option.type, option.value)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Created Date */}
          <div className="text-sm text-gray-500">
            Yaratilgan: {new Date(test.createdAt).toLocaleDateString('uz-UZ', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 