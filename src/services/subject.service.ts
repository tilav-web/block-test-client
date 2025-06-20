import { API_ENDPOINTS } from "@/common/api/endpoints";
import { privateInstance } from "../common/api/axios-instance";

export interface Subject {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubjectDto {
  name: string;
}

export interface UpdateSubjectDto {
  name?: string;
}

class SubjectService {
  async getAll(): Promise<Subject[]> {
    try {
      const response = await privateInstance.get(API_ENDPOINTS.SUBJECTS.GET_ALL);
      return response.data;
    } catch (error) {
      console.error('Error fetching subjects:', error);
      throw error;
    }
  }

  async getById(id: string): Promise<Subject> {
    try {
      const response = await privateInstance.get(API_ENDPOINTS.SUBJECTS.GET_BY_ID(id));
      return response.data;
    } catch (error) {
      console.error('Error fetching subject:', error);
      throw error;
    }
  }

  async create(data: CreateSubjectDto): Promise<Subject> {
    try {
      const response = await privateInstance.post(API_ENDPOINTS.SUBJECTS.CREATE, data);
      return response.data;
    } catch (error) {
      console.error('Error creating subject:', error);
      throw error;
    }
  }

  async update(id: string, data: UpdateSubjectDto): Promise<Subject> {
    try {
      const response = await privateInstance.patch(API_ENDPOINTS.SUBJECTS.UPDATE(id), data);
      return response.data;
    } catch (error) {
      console.error('Error updating subject:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await privateInstance.delete(API_ENDPOINTS.SUBJECTS.DELETE(id));
    } catch (error) {
      console.error('Error deleting subject:', error);
      throw error;
    }
  }
}

export const subjectService = new SubjectService(); 