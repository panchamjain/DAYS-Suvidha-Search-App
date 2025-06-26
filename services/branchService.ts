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
    return apiService.get<BranchListResponse>(`/merchants/${merchantId}/branches/`, filters);
  }

  // Get branch by ID
  async getBranchById(branchId: number): Promise<Branch> {
    return apiService.get<Branch>(`/branches/${branchId}/`);
  }
}

export const branchService = new BranchService();
