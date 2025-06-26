// This is a debug file to test your API structure
// You can run this to see what your API returns

const API_BASE_URL = 'https://www.daysahmedabad.com/api';

async function testCategoriesAPI() {
  try {
    console.log('Testing Categories API...');
    const response = await fetch(`${API_BASE_URL}/categories/`);
    const data = await response.json();
    console.log('Categories API Response:', JSON.stringify(data, null, 2));
    
    // Check if categories have slug field
    if (Array.isArray(data) && data.length > 0) {
      const firstCategory = data[0];
      console.log('First category structure:', firstCategory);
      console.log('Has slug field?', 'slug' in firstCategory);
      console.log('Slug value:', firstCategory.slug);
    }
    
    return data;
  } catch (error) {
    console.error('Categories API Error:', error);
  }
}

async function testMerchantsAPI(categorySlug: string) {
  try {
    console.log(`Testing Merchants API for category: ${categorySlug}`);
    const response = await fetch(`${API_BASE_URL}/categories/${categorySlug}/merchants/`);
    const data = await response.json();
    console.log('Merchants API Response:', JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error('Merchants API Error:', error);
  }
}

// Test function - you can call this to debug
export async function debugAPI() {
  console.log('=== API DEBUG TEST ===');
  
  // Test categories
  const categories = await testCategoriesAPI();
  
  // Test merchants with a known category slug
  if (categories && Array.isArray(categories) && categories.length > 0) {
    const firstCategory = categories[0];
    if (firstCategory.slug) {
      await testMerchantsAPI(firstCategory.slug);
    } else {
      console.log('No slug found in category, testing with "eatery"');
      await testMerchantsAPI('eatery');
    }
  }
  
  console.log('=== END DEBUG TEST ===');
}