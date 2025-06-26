import { apiService } from './api';
import { Category } from '../constants/MockData';

export interface CategoryFilters {
  search?: string;
  ordering?: string; // For Django REST framework ordering
  page?: number;
  page_size?: number;
}

class CategoryService {
  // Get all categories
  async getCategories(filters?: CategoryFilters): Promise<Category[]> {
    return apiService.get<Category[]>('/categories/', filters);
  }

  // Get category by slug
  async getCategoryBySlug(slug: string): Promise<Category> {
    return apiService.get<Category>(`/categories/${slug}/`);
  }

  // Search categories
  async searchCategories(query: string): Promise<Category[]> {
    return apiService.get<Category[]>('/categories/', { search: query });
  }
}

export const categoryService = new CategoryService();
