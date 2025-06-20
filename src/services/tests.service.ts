import { API_ENDPOINTS } from "@/common/api/endpoints";
import { privateInstance, privateInstanceFile } from "../common/api/axios-instance";

export const TestType = {
  TEXT: 'text',
  FILE: 'file',
  URL: 'url',
} as const;

export const TestDegree = {
  EASY: 'easy',
  HARD: 'hard',
} as const;

export type TestType = typeof TestType[keyof typeof TestType];
export type TestDegree = typeof TestDegree[keyof typeof TestDegree];

export const OptionType = {
  TEXT: 'text',
  FILE: 'file',
  URL: 'url',
} as const;

export type OptionType = typeof OptionType[keyof typeof OptionType];

export interface Option {
  _id: string;
  type: OptionType;
  test: string;
  value: string;
}

export interface Test {
  _id: string;
  subject: {
    _id: string;
    name: string;
  };
  question: string;
  target?: string;
  type: TestType;
  options: Option[];
  correctOptionId: string;
  degree: TestDegree;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOptionDto {
  type: OptionType;
  value: string;
}

export interface CreateTestDto {
  subject: string;
  question: string;
  target?: string;
  type: TestType;
  options: CreateOptionDto[];
  correctOptionValue: string;
  degree?: TestDegree;
}

export interface CreateTestWithFilesDto {
  subject: string;
  question: string;
  type: TestType;
  options: CreateOptionDto[];
  correctOptionValue: string;
  questionFile?: File;
  optionFiles?: File[];
  degree?: TestDegree;
}

export interface UpdateTestDto {
  subject?: string;
  question?: string;
  target?: string;
  type?: TestType;
  options?: CreateOptionDto[];
  correctOptionValue?: string;
  degree?: TestDegree;
}

class TestsService {
  async getAll(): Promise<Test[]> {
    try {
      const response = await privateInstance.get(API_ENDPOINTS.TESTS.GET_ALL);
      return response.data;
    } catch (error) {
      console.error('Error fetching tests:', error);
      throw error;
    }
  }

  async getById(id: string): Promise<Test> {
    try {
      const response = await privateInstance.get(API_ENDPOINTS.TESTS.GET_BY_ID(id));
      return response.data;
    } catch (error) {
      console.error('Error fetching test:', error);
      throw error;
    }
  }

  async create(data: CreateTestDto): Promise<Test> {
    try {
      const response = await privateInstance.post(API_ENDPOINTS.TESTS.CREATE, data);
      return response.data;
    } catch (error) {
      console.error('Error creating test:', error);
      throw error;
    }
  }

  async createWithFiles(data: CreateTestWithFilesDto): Promise<Test> {
    try {
      const formData = new FormData();
      
      // Add basic fields
      formData.append('subject', data.subject);
      formData.append('type', data.type);
      formData.append('question', data.question);
      formData.append('correctOptionValue', data.correctOptionValue);
      
      // Add question file if provided
      if (data.questionFile) {
        formData.append('file', data.questionFile);
      }
      
      // Add options
      data.options.forEach((option, index) => {
        formData.append(`options[${index}][type]`, option.type);
        formData.append(`options[${index}][value]`, option.value);
      });
      
      // Add option files if provided
      if (data.optionFiles && data.optionFiles.length > 0) {
        data.optionFiles.forEach((file) => {
          formData.append('optionFiles', file);
        });
      }
      
      console.log('Sending form data:', {
        subject: data.subject,
        type: data.type,
        question: data.question,
        correctOptionValue: data.correctOptionValue,
        questionFile: data.questionFile?.name,
        optionFiles: data.optionFiles?.map(f => f.name),
        options: data.options
      });
      
      const response = await privateInstanceFile.post(API_ENDPOINTS.TESTS.CREATE, formData);
      return response.data;
    } catch (error) {
      console.error('Error creating test with files:', error);
      throw error;
    }
  }

  async update(id: string, data: UpdateTestDto): Promise<Test> {
    try {
      const response = await privateInstance.patch(API_ENDPOINTS.TESTS.UPDATE(id), data);
      return response.data;
    } catch (error) {
      console.error('Error updating test:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await privateInstance.delete(API_ENDPOINTS.TESTS.DELETE(id));
    } catch (error) {
      console.error('Error deleting test:', error);
      throw error;
    }
  }
}

export const testsService = new TestsService(); 