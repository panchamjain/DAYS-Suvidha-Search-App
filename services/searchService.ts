import { apiService } from './api';

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
      
      // Make direct API call to avoid any service layer issues
      const response = await fetch(`https://www.daysahmedabad.com/api/search/?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      console.log('Raw search API response:', data);
      console.log('Response type:', typeof data);
      console.log('Is array:', Array.isArray(data));
      
      if (data && typeof data === 'object') {
        console.log('Response keys:', Object.keys(data));
      }
      
      // Transform API response to our SearchResult format
      const results: SearchResult[] = [];
      
      // Handle different response structures
      if (Array.isArray(data)) {
        // Direct array response
        console.log('Processing array response with', data.length, 'items');
        data.forEach((item, index) => {
          const transformed = this.transformSearchItem(item, index);
          if (transformed) {
            console.log(`Transformed item ${index}:`, transformed);
            results.push(transformed);
          }
        });
      } else if (data && typeof data === 'object') {
        // Object response - check for various structures
        
        // Check for paginated response
        if (data.results && Array.isArray(data.results)) {
          console.log('Processing paginated response with', data.results.length, 'items');
          data.results.forEach((item: any, index: number) => {
            const transformed = this.transformSearchItem(item, index);
            if (transformed) {
              console.log(`Transformed paginated item ${index}:`, transformed);
              results.push(transformed);
            }
          });
        }
        
        // Check for categorized response (merchants, categories, etc.)
        const categoryKeys = ['merchants', 'categories', 'businesses', 'shops', 'stores'];
        for (const key of categoryKeys) {
          if (data[key] && Array.isArray(data[key])) {
            console.log(`Processing ${key} array with`, data[key].length, 'items');
            data[key].forEach((item: any, index: number) => {
              const transformed = this.transformSearchItem(item, index, key);
              if (transformed) {
                console.log(`Transformed ${key} item ${index}:`, transformed);
                results.push(transformed);
              }
            });
          }
        }
        
        // If no arrays found but object has properties that look like search results
        if (results.length === 0) {
          // Check if the response itself is a single result
          if (data.id || data.name || data.title) {
            console.log('Processing single object response');
            const transformed = this.transformSearchItem(data, 0);
            if (transformed) {
              console.log('Transformed single object:', transformed);
              results.push(transformed);
            }
          } else {
            // Try to extract results from any property that contains objects with name/title
            Object.keys(data).forEach((key, index) => {
              const value = data[key];
              if (value && typeof value === 'object' && (value.name || value.title)) {
                console.log(`Processing object property ${key}`);
                const transformed = this.transformSearchItem(value, index, key);
                if (transformed) {
                  console.log(`Transformed property ${key}:`, transformed);
                  results.push(transformed);
                }
              }
            });
          }
        }
      }
      
      console.log('Final search results:', results);
      
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

  private transformSearchItem(item: any, index: number, context?: string): SearchResult | null {
    console.log(`Transforming item ${index} with context "${context}":`, item);
    
    // Skip if item doesn't exist or is not an object
    if (!item || typeof item !== 'object') {
      console.log('Skipping invalid item:', item);
      return null;
    }

    // Extract title from various possible fields
    const title = item.label || 
                  item.title || 
                  item.business_name || 
                  item.merchant_name || 
                  item.shop_name || 
                  item.store_name ||
                  item.category_name ||
                  '';
    
    if (!title || title.trim() === '') {
      console.log('Skipping item without title:', item);
      return null;
    }
    
    // Determine type and create appropriate subtitle
    let resultType: 'category' | 'merchant' | 'location' = 'merchant';
    let icon = 'store';
    let subtitle = 'Search Result';
    let url = item.url || item.link;
    
    // Determine type based on context or item properties
    if (context === 'categories' || 
        item.category_id || 
        item.is_category || 
        item.type === 'category' ||
        (item.slug && !item.address && !item.phone)) {
      resultType = 'category';
      icon = item.icon || 'category';
      subtitle = 'Category';
      
      if (item.description) {
        const desc = item.description.length > 40 
          ? item.description.substring(0, 40) + '...' 
          : item.description;
        subtitle = `Category - ${desc}`;
      }
      
      // Generate category URL
      if (!url && (item.slug || item.id)) {
        url = `/category/${item.slug || item.id}`;
      }
    } else if (context === 'merchants' || 
               item.address || 
               item.phone || 
               item.contact || 
               item.branches || 
               item.branch_count || 
               item.discount || 
               item.rating ||
               item.business_type) {
      resultType = 'merchant';
      icon = 'store';
      
      // Create descriptive subtitle
      if (item.category_name) {
        subtitle = `${item.category_name}`;
      } else if (item.discount) {
        subtitle = `Merchant - ${item.discount}`;
      } else if (item.address) {
        // Extract area from address
        const addressParts = item.address.split(',');
        const area = addressParts[0]?.trim();
        subtitle = area ? `Merchant in ${area}` : 'Merchant';
      } else {
        subtitle = 'Merchant';
      }
      
      // Generate merchant URL
      if (!url && item.id) {
        url = `/merchant/${item.id}`;
      }
    } else if (item.area || item.city || item.location_type) {
      resultType = 'location';
      icon = 'location-on';
      subtitle = item.city ? `Location in ${item.city}` : 'Location';
    }
    
    const result = {
      id: item.id?.toString() || `search-${index}-${Date.now()}`,
      title: title.trim(),
      subtitle,
      type: resultType,
      url,
      data: item,
      icon
    };
    
    console.log('Transformed result:', result);
    return result;
  }
}

export const searchService = new SearchService();
