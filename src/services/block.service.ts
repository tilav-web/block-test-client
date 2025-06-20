import { API_ENDPOINTS } from "@/common/api/endpoints";
import { privateInstance } from "../common/api/axios-instance";

export interface Subject {
  _id: string;
  name: string;
}

export interface Block {
  _id: string;
  name: string;
  price: number;
  main?: Subject;
  addition?: Subject;
  mandatory?: Subject[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateBlockDto {
  name: string;
  price: number;
  main?: string;
  addition?: string;
  mandatory?: string[];
}

export interface UpdateBlockDto {
  name?: string;
  price?: number;
  main?: string;
  addition?: string;
  mandatory?: string[];
}

class BlockService {
  async getAll(): Promise<Block[]> {
    try {
      const response = await privateInstance.get(API_ENDPOINTS.BLOCKS.GET_ALL);
      return response.data;
    } catch (error) {
      console.error('Error fetching blocks:', error);
      throw error;
    }
  }

  async getById(id: string): Promise<Block> {
    try {
      const response = await privateInstance.get(API_ENDPOINTS.BLOCKS.GET_BY_ID(id));
      return response.data;
    } catch (error) {
      console.error('Error fetching block:', error);
      throw error;
    }
  }

  async create(data: CreateBlockDto): Promise<Block> {
    try {
      const response = await privateInstance.post(API_ENDPOINTS.BLOCKS.CREATE, data);
      return response.data;
    } catch (error) {
      console.error('Error creating block:', error);
      throw error;
    }
  }

  async update(id: string, data: UpdateBlockDto): Promise<Block> {
    try {
      const response = await privateInstance.patch(API_ENDPOINTS.BLOCKS.UPDATE(id), data);
      return response.data;
    } catch (error) {
      console.error('Error updating block:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await privateInstance.delete(API_ENDPOINTS.BLOCKS.DELETE(id));
    } catch (error) {
      console.error('Error deleting block:', error);
      throw error;
    }
  }
}

export const blockService = new BlockService(); 