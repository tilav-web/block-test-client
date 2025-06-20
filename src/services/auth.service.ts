import { API_ENDPOINTS } from "@/common/api/endpoints";
import { privateInstance } from "../common/api/axios-instance";

export interface User {
  _id: string;
  full_name: string;
  email: string;
  phone: string;
  role: 'student' | 'admin';
  is_active: boolean;
  is_verified: boolean;
  accessible_blocks?: string[];
  createdAt: string;
  updatedAt: string;
}

class AuthService {
  async login({email, password}: {email: string, password: string}) {
    try {
      const response = await privateInstance.post(API_ENDPOINTS.AUTH.LOGIN, {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  async register({
    full_name,
    email,
    password1,
    password2,
    phone,
  }: {
    full_name: string;
    email: string;
    password1: string;
    password2: string;
    phone: string;
  }) {
    try {
      const response = await privateInstance.post(API_ENDPOINTS.AUTH.REGISTER, {
        full_name,
        email,
        password1,
        password2,
        phone,
      });
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  async logout() {
    try {
      const response = await privateInstance.post(API_ENDPOINTS.AUTH.LOGOUT);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  async profile() {
    try {
      const response = await privateInstance.get(API_ENDPOINTS.AUTH.PROFILE);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // Admin user management methods
  async getAllUsers(): Promise<User[]> {
    try {
      const response = await privateInstance.get(API_ENDPOINTS.USERS.GET_ALL);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getUserBlockAccess(userId: string): Promise<string[]> {
    try {
      const response = await privateInstance.get(`/auth/users/${userId}/block-access`);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async grantBlockAccess(userId: string, blockId: string): Promise<User> {
    try {
      const response = await privateInstance.patch(`/auth/users/${userId}/grant-block/${blockId}`);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async revokeBlockAccess(userId: string, blockId: string): Promise<User> {
    try {
      const response = await privateInstance.patch(`/auth/users/${userId}/revoke-block/${blockId}`);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export const authService = new AuthService();
