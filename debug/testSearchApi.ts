import { searchService } from '../services/searchService';

export const testSearchAPI = async () => {
  try {
    console.log('Testing search API with query: "sh"');
    const result = await searchService.search('sh');
    console.log('Search API test result:', result);
    return result;
  } catch (error) {
    console.error('Search API test failed:', error);
    return null;
  }
};

// Test the API endpoint directly
export const testDirectAPI = async () => {
  try {
    console.log('Testing direct API call to search endpoint');
    const response = await fetch('https://www.daysahmedabad.com/api/search/?q=sh');
    const data = await response.json();
    console.log('Direct API test result:', data);
    return data;
  } catch (error) {
    console.error('Direct API test failed:', error);
    return null;
  }
};