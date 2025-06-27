import { useState, useEffect, useCallback } from 'react';
import { ApiError } from '../services/api';
import { Category } from '../constants/MockData';
import { MerchantListResponse } from '../services/merchantService';
import { BranchListResponse } from '../services/branchService';

export interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
  refresh: () => Promise<void>;
}

export function useApi<T>(
  apiCall: () => Promise<T>,
  dependencies: any[] = []
): UseApiState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Making API call...');
      const response = await apiCall();
      console.log('API response:', response);
      setData(response);
    } catch (err) {
      console.error('API Error:', err);
      setError(err as ApiError);
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refresh = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  return { data, loading, error, refresh };
}

// Specialized hooks for your API with proper typing
export function useCategories(): UseApiState<Category[]> {
  const { categoryService } = require('../services/categoryService');
  return useApi<Category[]>(() => {
    console.log('Fetching categories...');
    return categoryService.getCategories();
  });
}

export function useMerchants(filters?: any): UseApiState<MerchantListResponse> {
  const { merchantService } = require('../services/merchantService');
  return useApi<MerchantListResponse>(() => merchantService.getMerchants(filters), [filters]);
}

export function useMerchantsByCategory(categorySlug: string, filters?: any): UseApiState<MerchantListResponse> {
  const { merchantService } = require('../services/merchantService');
  return useApi<MerchantListResponse>(() => {
    console.log('Fetching merchants for category:', categorySlug);
    return merchantService.getMerchantsByCategory(categorySlug, filters);
  }, [categorySlug, filters]);
}

export function useMerchantBranches(merchantId: number | null): UseApiState<BranchListResponse> {
  const { branchService } = require('../services/branchService');
  return useApi<BranchListResponse>(() => {
    if (!merchantId || isNaN(merchantId)) {
      // Return empty result instead of making API call
      return Promise.resolve({
        count: 0,
        next: null,
        previous: null,
        results: []
      });
    }
    return branchService.getMerchantBranches(merchantId);
  }, [merchantId]);
}

export function useMerchantDetail(merchantId: number) {
  const { merchantService } = require('../services/merchantService');
  return useApi(() => merchantService.getMerchantById(merchantId), [merchantId]);
}

export function useBranchDetail(branchId: number) {
  const { branchService } = require('../services/branchService');
  return useApi(() => branchService.getBranchById(branchId), [branchId]);
}
