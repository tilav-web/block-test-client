import React, { useState } from 'react';
import type { Block } from '@/services/block.service';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination } from '@/components/ui/pagination';
import { Edit, Trash2, Plus, Eye } from 'lucide-react';

interface BlockTableProps {
  blocks: Block[];
  onEdit: (block: Block) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  onView: (block: Block) => void;
  isLoading: boolean;
}

export const BlockTable: React.FC<BlockTableProps> = ({
  blocks,
  onEdit,
  onDelete,
  onAdd,
  onView,
  isLoading,
}) => {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // 10 blocks per page

  // Pagination calculations
  const totalPages = Math.ceil(blocks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBlocks = blocks.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

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
        <h2 className="text-2xl font-bold">Bloklar</h2>
        <Button onClick={onAdd} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Yangi Blok
        </Button>
      </div>

      {blocks.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">Hali hech qanday blok qo'shilmagan</p>
          <Button onClick={onAdd} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Birinchi blokni qo'shing
          </Button>
        </div>
      ) : (
        <>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">№</TableHead>
                  <TableHead>Nomi</TableHead>
                  <TableHead>Narxi</TableHead>
                  <TableHead>Asosiy fan</TableHead>
                  <TableHead>Qo'shimcha fan</TableHead>
                  <TableHead>Majburiy fanlar</TableHead>
                  <TableHead>Yaratilgan</TableHead>
                  <TableHead className="w-[150px]">Amallar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentBlocks.map((block, index) => (
                  <TableRow key={block._id}>
                    <TableCell className="font-medium">{startIndex + index + 1}</TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <p className="font-medium truncate" title={block.name}>
                          {block.name}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium text-green-600">
                        {block.price.toLocaleString('uz-UZ', {
                          style: 'currency',
                          currency: 'UZS',
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        })}
                      </span>
                    </TableCell>
                    <TableCell>
                      {block.main ? (
                        <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {block.main.name}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-500">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {block.addition ? (
                        <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          {block.addition.name}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-500">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {block.mandatory && block.mandatory.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {block.mandatory.map((subject) => (
                            <span 
                              key={subject._id} 
                              className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full"
                            >
                              {subject.name}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">
                        {new Date(block.createdAt).toLocaleDateString('uz-UZ')}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onView(block)}
                          title="Ko'rish"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(block)}
                          title="Tahrirlash"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(block._id)}
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                itemsPerPage={itemsPerPage}
                totalItems={blocks.length}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}; 