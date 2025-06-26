import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { searchService } from '../services/searchService';
import Colors from '../constants/Colors';

const ApiTester = () => {
  const [searchResult, setSearchResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testSearchAPI = async () => {
    setLoading(true);
    try {
      console.log('Testing search API...');
      
      // Test direct fetch first
      const directResponse = await fetch('https://www.daysahmedabad.com/api/search/?q=sh');
      const directData = await directResponse.json();
      console.log('Direct API response:', directData);
      
      // Test through service
      const serviceResult = await searchService.search('sh');
      console.log('Service result:', serviceResult);
      
      setSearchResult({
        direct: directData,
        service: serviceResult
      });
    } catch (error) {
      console.error('API test error:', error);
      setSearchResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={testSearchAPI} disabled={loading}>
        <Text style={styles.buttonText}>
          {loading ? 'Testing...' : 'Test Search API'}
        </Text>
      </TouchableOpacity>
      
      {searchResult && (
        <ScrollView style={styles.resultContainer}>
          <Text style={styles.resultText}>
            {JSON.stringify(searchResult, null, 2)}
          </Text>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.background,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  resultContainer: {
    flex: 1,
    backgroundColor: Colors.card,
    padding: 15,
    borderRadius: 8,
  },
  resultText: {
    fontSize: 12,
    fontFamily: 'monospace',
  },
});

export default ApiTester;