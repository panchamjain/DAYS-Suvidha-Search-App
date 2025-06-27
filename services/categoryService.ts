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

  // Get category by slug using the new API pattern
  async getCategoryBySlug(slug: string): Promise<Category> {
    console.log('Fetching category by slug:', slug);
    
    try {
      // Use the new API pattern: https://www.daysahmedabad.com/category/{slug}/
      const response = await fetch(`https://www.daysahmedabad.com/category/${slug}/`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fresh category data from API:', data);
      
      return data;
    } catch (error) {
      console.error('Error fetching category by slug:', error);
      // Fallback to old API endpoint
      return apiService.get<Category>(`/categories/${slug}/`);
    }
  }

  // Get fresh category data by ID (supports the new API pattern)
  async getCategoryById(id: string | number): Promise<Category> {
    console.log('Fetching category by ID:', id);
    
    try {
      // Use the new API pattern: https://www.daysahmedabad.com/category/{id}/
      const response = await fetch(`https://www.daysahmedabad.com/category/${id}/`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fresh category data from API:', data);
      
      return data;
    } catch (error) {
      console.error('Error fetching category by ID:', error);
      throw error;
    }
  }

  // Search categories
  async searchCategories(query: string): Promise<Category[]> {
    return apiService.get<Category[]>('/categories/', { search: query });
  }
}

export const categoryService = new CategoryService();
