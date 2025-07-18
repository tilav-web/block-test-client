'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight, Eye, Medal } from 'lucide-react';
import type { Period, QuizResult } from '@/services/quiz-results.service';
import { quizResultsService } from '@/services/quiz-results.service';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useDebounce } from '@/hooks/use-debounce';

export default function QuizRating() {
  const [period, setPeriod] = useState<Period | 'all'>('all');
  const [ratings, setRatings] = useState<QuizResult[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 0,
    page: 1,
    limit: 10,
  });
  const [loading, setLoading] = useState(true);
  const [selectedResult, setSelectedResult] = useState<QuizResult | null>(null);
  const [blockName, setBlockName] = useState('');
  const debouncedBlockName = useDebounce(blockName, 500);

  useEffect(() => {
    const fetchRatings = async () => {
      setLoading(true);
      try {
        const data = await quizResultsService.getQuizRatings(
          period,
          pagination.page,
          pagination.limit,
          debouncedBlockName,
        );
        setRatings(data.results);
        setPagination(data.pagination);
      } catch (error) {
        console.error('Error fetching quiz ratings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, [period, pagination.page, debouncedBlockName]);

  const handlePeriodChange = (value: typeof period) => {
    setPeriod(value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleBlockNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBlockName(event.target.value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const getRank = (index: number) => {
    const rank = (pagination.page - 1) * pagination.limit + index + 1;
    if (rank === 1) return <Medal className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-slate-400" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-amber-700" />;
    return rank;
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Reyting Doskasi</h1>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Block nomi bo'yicha qidirish..."
            value={blockName}
            onChange={handleBlockNameChange}
            className="w-[240px]"
          />
          <Select value={period} onValueChange={handlePeriodChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Vaqt oralig'ini tanlang" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Barcha vaqt</SelectItem>
              <SelectItem value="daily">Kunlik</SelectItem>
              <SelectItem value="weekly">Haftalik</SelectItem>
              <SelectItem value="monthly">Oylik</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">O'rin</TableHead>
              <TableHead>Foydalanuvchi</TableHead>
              <TableHead>Block</TableHead>
              <TableHead>Eng yuqori ball</TableHead>
              <TableHead>Sana</TableHead>
              <TableHead className="text-right">Amallar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Yuklanmoqda...
                </TableCell>
              </TableRow>
            ) : ratings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Natijalar topilmadi
                </TableCell>
              </TableRow>
            ) : (
              ratings.map((result, index) => (
                <TableRow key={result?._id}>
                  <TableCell className="font-bold text-lg text-center">{getRank(index)}</TableCell>
                  <TableCell>{result?.user?.full_name}</TableCell>
                  <TableCell>{result?.block?.name}</TableCell>
                  <TableCell className="font-medium">{result?.totalScore.toFixed(2)}</TableCell>
                  <TableCell>{format(new Date(result?.createdAt), 'dd.MM.yyyy HH:mm')}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => setSelectedResult(result)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {pagination.pages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="mx-2">
            {pagination.page} / {pagination.pages}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.pages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {selectedResult && (
        <Dialog open={!!selectedResult} onOpenChange={(isOpen) => !isOpen && setSelectedResult(null)}>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>Test Natijasi</DialogTitle>
              <DialogDescription>
                Foydalanuvchi: {selectedResult?.user?.full_name} | Block: {selectedResult?.block?.name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {selectedResult?.main && (
                <div>
                  <h4 className="font-semibold text-gray-800">Asosiy fan: {selectedResult?.main?.subject?.name}</h4>
                  <p className="text-sm text-gray-500">To'g'ri javoblar: {selectedResult?.main?.correctAnswers} | Ball: {selectedResult?.main?.score.toFixed(1)}</p>
                </div>
              )}
              {selectedResult?.addition && (
                 <div>
                  <h4 className="font-semibold text-gray-800">Qo'shimcha fan: {selectedResult?.addition.subject?.name}</h4>
                  <p className="text-sm text-gray-500">To'g'ri javoblar: {selectedResult?.addition.correctAnswers} | Ball: {selectedResult?.addition.score.toFixed(1)}</p>
                </div>
              )}
              {selectedResult?.mandatory.length > 0 && (
                 <div className="space-y-2">
                  <h4 className="font-semibold text-gray-800">Majburiy fanlar</h4>
                  {selectedResult?.mandatory.map((item, idx) => (
                    <div key={idx} className="p-2 border rounded-md bg-gray-50/50">
                      <p className="font-medium text-sm">{item.subject?.name}</p>
                      <p className="text-xs text-gray-500">To'g'ri javoblar: {item.correctAnswers} | Ball: {item.score.toFixed(1)}</p>
                    </div>
                  ))}
                </div>
              )}
              <hr />
              <div>
                <h4 className="font-semibold text-lg">Umumiy ball: {selectedResult?.totalScore?.toFixed(2)}</h4>
                <p className="text-sm text-gray-500">
                  Sana: {format(new Date(selectedResult?.createdAt), 'dd.MM.yyyy HH:mm')}
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
