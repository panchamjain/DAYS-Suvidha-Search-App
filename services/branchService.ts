import { apiService } from './api';
import { Branch } from '../constants/MockData';

export interface BranchFilters {
  search?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}

export interface BranchListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Branch[];
}

class BranchService {
  // Get all branches for a merchant
  async getMerchantBranches(merchantId: number, filters?: BranchFilters): Promise<BranchListResponse> {
    try {
      console.log('Fetching branches for merchant ID:', merchantId);
      
      if (!merchantId || isNaN(merchantId) || merchantId <= 0) {
        console.warn('Invalid merchant ID provided:', merchantId);
        return {
          count: 0,
          next: null,
          previous: null,
          results: []
        };
      }
      
      const response = await apiService.get<any>(`/merchants/${merchantId}/branches/`, filters);
      console.log('Raw branches API response:', response);
      
      // Handle different possible response formats
      if (Array.isArray(response)) {
        // If response is directly an array of branches
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
          return response as BranchListResponse;
        } else if (response.data && Array.isArray(response.data)) {
          // Custom API format with data wrapper
          console.log('Response has data wrapper');
          return {
            count: response.data.length,
            next: response.next || null,
            previous: response.previous || null,
            results: response.data
          };
        } else if (response.branches && Array.isArray(response.branches)) {
          // Custom format with branches key
          console.log('Response has branches key');
          return {
            count: response.branches.length,
            next: response.next || null,
            previous: response.previous || null,
            results: response.branches
          };
        } else {
          // Check if the response object itself contains branch properties
          const keys = Object.keys(response);
          console.log('Response object keys:', keys);
          
          // If response has branch-like properties, treat it as a single branch
          if (response.id && response.name) {
            console.log('Response appears to be a single branch');
            return {
              count: 1,
              next: null,
              previous: null,
              results: [response]
            };
          }
        }
      }
      
      console.warn('Unknown response format for branches:', response);
      // Fallback: return empty results
      return {
        count: 0,
        next: null,
        previous: null,
        results: []
      };
      
    } catch (error) {
      console.error('Error fetching merchant branches:', error);
      // Return empty results instead of throwing error
      return {
        count: 0,
        next: null,
        previous: null,
        results: []
      };
    }
  }

  // Get branch by ID
  async getBranchById(branchId: number): Promise<Branch> {
    return apiService.get<Branch>(`/branches/${branchId}/`);
  }
}

export const branchService = new BranchService();
