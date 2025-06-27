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
      
      // Make direct API call to get the most accurate response
      const response = await fetch(`https://www.daysahmedabad.com/api/search/?q=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
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
        } else {
          // Check for categorized response (merchants, categories, etc.)
          const categoryKeys = ['merchants', 'categories', 'businesses', 'shops', 'stores', 'data'];
          let foundResults = false;
          
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
              foundResults = true;
            }
          }
          
          // If no arrays found but object has properties that look like search results
          if (!foundResults) {
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
    const title = item.label || '';
    
    if (!title || title.trim() === '') {
      console.log('Skipping item without title:', item);
      return null;
    }
    
    // Determine type based on API response structure and item properties
    let resultType: 'category' | 'merchant' | 'location' = 'merchant';
    let icon = 'store';
    let subtitle = 'Search Result';
    let url = item.url || item.link;
    
    // Check for explicit type field from API
    if (item.type) {
      switch (item.type.toLowerCase()) {
        case 'category':
          resultType = 'category';
          break;
        case 'merchant':
          resultType = 'merchant';
          break;
        case 'location':
        case 'area':
        case 'place':
          resultType = 'location';
          break;
      }
    } else {
      // Determine type based on context or item properties
      if (context === 'categories' || 
          item.category_id || 
          item.is_category || 
          item.slug && !item.address && !item.phone && !item.contact ||
          item.icon && !item.address) {
        resultType = 'category';
      } else if (context === 'merchants' || 
                 item.address || 
                 item.phone || 
                 item.contact || 
                 item.branches || 
                 item.branch_count || 
                 item.discount || 
                 item.rating ||
                 item.business_type ||
                 item.merchant_id) {
        resultType = 'merchant';
      } else if (item.area || 
                 item.city || 
                 item.location_type ||
                 item.coordinates) {
        resultType = 'location';
      }
    }
    
    // Set appropriate icon and subtitle based on type
    switch (resultType) {
      case 'category':
        icon = item.icon || 'category';
        subtitle = 'Category';
        if (item.description) {
          const desc = item.description.length > 40 
            ? item.description.substring(0, 40) + '...' 
            : item.description;
          subtitle = `Category - ${desc}`;
        }
        // Generate category URL if not provided
        if (!url && (item.slug || item.id)) {
          url = `/category/${item.slug || item.id}`;
        }
        break;
        
      case 'merchant':
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
        // Generate merchant URL if not provided
        if (!url && item.id) {
          url = `/merchant/${item.id}`;
        }
        break;
        
      case 'location':
        icon = 'location-on';
        subtitle = item.city ? `Location in ${item.city}` : 'Location';
        break;
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
