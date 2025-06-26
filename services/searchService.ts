import { apiService } from './api';
import { Merchant, Category } from '../constants/MockData';

export interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  type: 'category' | 'merchant' | 'location';
  url?: string;
  data: any;
  icon: string;
}

export interface SearchResponse {
  results: SearchResult[];
  count: number;
}

class SearchService {
  // Search using the API
  async search(query: string): Promise<SearchResponse> {
    try {
      console.log('Searching for:', query);
      const response = await apiService.get<any>(`/search/`, { q: query });
      console.log('Search API response:', response);
      
      // Transform API response to our SearchResult format
      const results: SearchResult[] = [];
      
      if (response && Array.isArray(response)) {
        // If response is directly an array
        response.forEach((item, index) => {
          results.push(this.transformSearchItem(item, index));
        });
      } else if (response && response.results && Array.isArray(response.results)) {
        // If response has results array
        response.results.forEach((item: any, index: number) => {
          results.push(this.transformSearchItem(item, index));
        });
      } else if (response && typeof response === 'object') {
        // Check for different possible structures
        const keys = Object.keys(response);
        console.log('Search response keys:', keys);
        
        // Look for common search result keys
        for (const key of ['merchants', 'categories', 'data', 'items']) {
          if (response[key] && Array.isArray(response[key])) {
            response[key].forEach((item: any, index: number) => {
              results.push(this.transformSearchItem(item, index, key));
            });
          }
        }
      }
      
      return {
        results,
        count: results.length
      };
    } catch (error) {
      console.error('Search API error:', error);
      return {
        results: [],
        count: 0
      };
    }
  }

  private transformSearchItem(item: any, index: number, type?: string): SearchResult {
    // Try to determine the type of search result
    let resultType: 'category' | 'merchant' | 'location' = 'merchant';
    let icon = 'store';
    let title = item.name || item.title || `Result ${index + 1}`;
    let subtitle = 'Search Result';
    
    // Determine type based on item properties or API response structure
    if (item.category_name || item.category || type === 'categories') {
      resultType = 'category';
      icon = 'category';
      subtitle = 'Category';
    } else if (item.address || item.location) {
      if (item.name && (item.discount || item.rating)) {
        resultType = 'merchant';
        icon = 'store';
        subtitle = 'Merchant';
      } else {
        resultType = 'location';
        icon = 'location-on';
        subtitle = 'Location';
      }
    }
    
    // Extract additional info for subtitle
    if (resultType === 'merchant') {
      if (item.category_name) {
        subtitle = `Merchant in ${item.category_name}`;
      } else if (item.address) {
        subtitle = 'Merchant';
      }
    } else if (resultType === 'category') {
      subtitle = 'Category';
    }
    
    return {
      id: item.id?.toString() || `search-${index}`,
      title,
      subtitle,
      type: resultType,
      url: item.url || item.link,
      data: item,
      icon
    };
  }
}

export const searchService = new SearchService();