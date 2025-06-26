import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput } from 'react-native';
import { searchService } from '../services/searchService';
import Colors from '../constants/Colors';

const SearchDebugger = () => {
  const [query, setQuery] = useState('sh');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testSearch = async () => {
    setLoading(true);
    try {
      console.log('Testing search with query:', query);
      
      // Test direct API call
      const directResponse = await fetch(`https://www.daysahmedabad.com/api/search/?q=${encodeURIComponent(query)}`);
      const directData = await directResponse.json();
      
      // Test through service
      const serviceResult = await searchService.search(query);
      
      setResult({
        query,
        directResponse: directData,
        serviceResult,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('Search test error:', error);
      setResult({ error: error.message, query });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search API Debugger</Text>
      
      <TextInput
        style={styles.input}
        value={query}
        onChangeText={setQuery}
        placeholder="Enter search query"
        placeholderTextColor={Colors.textLight}
      />
      
      <TouchableOpacity style={styles.button} onPress={testSearch} disabled={loading}>
        <Text style={styles.buttonText}>
          {loading ? 'Testing...' : 'Test Search'}
        </Text>
      </TouchableOpacity>
      
      {result && (
        <ScrollView style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Results for: "{result.query}"</Text>
          <Text style={styles.resultText}>
            {JSON.stringify(result, null, 2)}
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: Colors.text,
  },
  input: {
    backgroundColor: Colors.card,
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    color: Colors.text,
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
    fontSize: 16,
  },
  resultContainer: {
    flex: 1,
    backgroundColor: Colors.card,
    padding: 15,
    borderRadius: 8,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: Colors.text,
  },
  resultText: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: Colors.text,
  },
});

export default SearchDebugger;