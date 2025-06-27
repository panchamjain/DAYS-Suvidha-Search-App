import { apiService } from './api';
import { Merchant } from '../constants/MockData';

export interface MerchantFilters {
  category?: string;
  search?: string;
  location?: string;
  min_rating?: number;
  ordering?: string; // name, -name, rating, -rating, etc.
  page?: number;
  page_size?: number;
}

export interface MerchantListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Merchant[];
}

class MerchantService {
  // Get all merchants with filters
  async getMerchants(filters?: MerchantFilters): Promise<MerchantListResponse> {
    return apiService.get<MerchantListResponse>('/merchants/', filters);
  }

  // Get merchant by ID using the new API pattern
  async getMerchantById(id: number | string): Promise<Merchant> {
    console.log('Fetching merchant by ID:', id);
    
    try {
      // Use the new API pattern: https://www.daysahmedabad.com/merchant/{id}/
      const response = await fetch(`https://www.daysahmedabad.com/merchant/${id}/`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fresh merchant data from API:', data);
      
      return data;
    } catch (error) {
      console.error('Error fetching merchant by ID:', error);
      // Fallback to old API endpoint
      return apiService.get<Merchant>(`/merchant/${id}/`);
    }
  }

  // Get fresh merchant data by type and ID (supports both merchant and category)
  async getMerchantByTypeAndId(type: 'merchant' | 'category', id: string | number): Promise<Merchant> {
    console.log(`Fetching ${type} by ID:`, id);
    
    try {
      // Use the new API pattern: https://www.daysahmedabad.com/{type}/{id}/
      const response = await fetch(`https://www.daysahmedabad.com/${type}/${id}/`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`Fresh ${type} data from API:`, data);
      
      return data;
    } catch (error) {
      console.error(`Error fetching ${type} by ID:`, error);
      throw error;
    }
  }

  // Get merchants by category slug - handle different response formats
  async getMerchantsByCategory(categorySlug: string, filters?: Omit<MerchantFilters, 'category'>): Promise<MerchantListResponse> {
    console.log('Fetching merchants for category:', categorySlug);
    
    if (!categorySlug || categorySlug === 'undefined') {
      throw new Error('Category slug is required');
    }
    
    try {
      const response = await apiService.get<any>(`/categories/${categorySlug}/merchants/`);
      console.log('Raw API response:', response);
      
      // Handle different possible response formats
      if (Array.isArray(response)) {
        // If response is directly an array of merchants
        console.log('Response is array format, converting to paginated format');
        return {
          count: response.length,
          next: null,
          previous: null,
          results: response
        };
      } else if (response && typeof response === 'object') {
        // If response is an object, check for different structures
        if (response.results && Array.isArray(response.results)) {
          // Django REST framework paginated format
          console.log('Response is paginated format');
          return response as MerchantListResponse;
        } else if (response.data && Array.isArray(response.data)) {
          // Custom API format with data wrapper
          console.log('Response has data wrapper');
          return {
            count: response.data.length,
            next: response.next || null,
            previous: response.previous || null,
            results: response.data
          };
        } else if (response.merchants && Array.isArray(response.merchants)) {
          // Custom format with merchants key
          console.log('Response has merchants key');
          return {
            count: response.merchants.length,
            next: response.next || null,
            previous: response.previous || null,
            results: response.merchants
          };
        } else {
          // Check if the response object itself contains merchant properties
          const keys = Object.keys(response);
          console.log('Response object keys:', keys);
          
          // If response has merchant-like properties, treat it as a single merchant
          if (response.id && response.name) {
            console.log('Response appears to be a single merchant');
            return {
              count: 1,
              next: null,
              previous: null,
              results: [response]
            };
          }
        }
      }
      
      console.warn('Unknown response format:', response);
      // Fallback: return empty results
      return {
        count: 0,
        next: null,
        previous: null,
        results: []
      };
      
    } catch (error) {
      console.error('Error fetching merchants by category:', error);
      throw error;
    }
  }

  // Search merchants
  async searchMerchants(query: string, filters?: MerchantFilters): Promise<MerchantListResponse> {
    return apiService.get<MerchantListResponse>('/merchants/', { search: query, ...filters });
  }
}

export const merchantService = new MerchantService();
