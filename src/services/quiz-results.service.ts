import { API_ENDPOINTS } from "@/common/api/endpoints";
import { privateInstance } from "../common/api/axios-instance";

export type Period = 'daily' | 'weekly' | 'monthly';

interface Subject {
  _id: string;
  name: string;
}

interface SubjectResult {
  subject: Subject;
  correctAnswers: number;
  score: number;
}

export interface QuizResult {
  _id: string;
  user: {
    _id: string;
    full_name: string;
  };
  block: {
    _id: string;
    name: string;
  };
  main: SubjectResult;
  addition: SubjectResult;
  mandatory: SubjectResult[];
  totalScore: number;
  createdAt: string;
}

export interface PaginationInfo {
  total: number;
  pages: number;
  page: number;
  limit: number;
}

export interface QuizResultsResponse {
  results: QuizResult[];
  pagination: PaginationInfo;
}

class QuizResultsService {
  async getAllTimeResults(page = 1, limit = 10): Promise<QuizResultsResponse> {
    try {
      const response = await privateInstance.get(API_ENDPOINTS.QUIZ.GET_RESULTS, {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching all time results:', error);
      throw error;
    }
  }

  async getResultsByPeriod(
    period: Period,
    page = 1,
    limit = 10,
  ): Promise<QuizResultsResponse> {
    try {
      const response = await privateInstance.get(
        API_ENDPOINTS.QUIZ.GET_RESULTS_BY_PERIOD(period),
        {
          params: { page, limit },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching results by period:', error);
      throw error;
    }
  }

  async getQuizRatings(
    period: Period | 'all',
    page = 1,
    limit = 10,
    blockName?: string,
  ): Promise<QuizResultsResponse> {
    try {
      const response = await privateInstance.get(
        API_ENDPOINTS.QUIZ.GET_RATINGS_BY_PERIOD(period),
        {
          params: { page, limit, blockName },
        },
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching quiz ratings:', error);
      throw error;
    }
  }
}

export const quizResultsService = new QuizResultsService();
