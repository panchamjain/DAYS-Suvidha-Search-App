// Simple test to check API response structure
export const testSearchAPI = async () => {
  try {
    console.log('Testing search API with different queries...');
    
    const queries = ['sh', 'restaurant', 'food', 'hotel'];
    
    for (const query of queries) {
      console.log(`\n--- Testing query: "${query}" ---`);
      
      try {
        const response = await fetch(`https://www.daysahmedabad.com/api/search/?q=${query}`);
        const data = await response.json();
        
        console.log(`Response for "${query}":`, JSON.stringify(data, null, 2));
        console.log(`Response type:`, typeof data);
        console.log(`Is array:`, Array.isArray(data));
        
        if (data && typeof data === 'object') {
          console.log(`Object keys:`, Object.keys(data));
        }
        
      } catch (error) {
        console.error(`Error for query "${query}":`, error);
      }
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
};

// Call the test
testSearchAPI();