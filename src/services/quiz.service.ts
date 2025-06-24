import { API_ENDPOINTS } from '@/common/api/endpoints';
import { privateInstance } from '@/common/api/axios-instance';

export interface QuizBlock {
  _id: string;
  name: string;
  price: number;
  main: string;
  addition: string;
  mandatory: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface QuizSubject {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface QuizOption {
  _id: string;
  type: string;
  value: string;
}

export interface QuizTest {
  _id: string;
  subject: QuizSubject;
  question: string;
  degree: string;
  target: string;
  type: string;
  options: QuizOption[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  correctOptionId?: string;
}

export interface QuizSubjectWithTests {
  subject: QuizSubject;
  tests: QuizTest[];
}

export interface QuizFetchResponse {
  block: QuizBlock;
  main: QuizSubjectWithTests;
  addition: QuizSubjectWithTests;
  mandatory: QuizSubjectWithTests[];
}

export interface AnswerItem {
  questionId: string;
  answerId: string;
}

export interface QuizResultSubject {
  subject: string; // subject ObjectId
  answers: AnswerItem[]; // array of { questionId, answerId }
}

export interface QuizResultMandatory {
  subject: string;
  answers: AnswerItem[];
}

export interface QuizResultPayload {
  block: string;
  main: QuizResultSubject;
  addition: QuizResultSubject;
  mandatory: QuizResultMandatory[];
}

export interface QuizAutoSavePayload {
  blockId: string;
  answers: Record<string, string>;
  remaining: number;
}

class QuizService {
  async fetchQuiz(blockId: string): Promise<QuizFetchResponse> {
    const response = await privateInstance.get(API_ENDPOINTS.QUIZ.FETCH(blockId));
    return response.data;
  }

  async saveQuizResult(payload: QuizResultPayload): Promise<unknown> {
    const response = await privateInstance.post(API_ENDPOINTS.QUIZ.SAVE_RESULT, payload);
    return response.data;
  }

  async autoSaveQuiz(payload: QuizAutoSavePayload): Promise<unknown> {
    const response = await privateInstance.post(API_ENDPOINTS.QUIZ.AUTOSAVE, payload);
    return response.data;
  }
}

export const quizService = new QuizService(); 