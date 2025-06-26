import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import Colors from '../constants/Colors';

const ApiTester = () => {
  const [testResults, setTestResults] = useState<string>('');

  const testCategoriesAPI = async () => {
    try {
      setTestResults('Testing Categories API...\n');
      const response = await fetch('https://www.daysahmedabad.com/api/categories/');
      const data = await response.json();
      
      setTestResults(prev => prev + `Categories Response:\n${JSON.stringify(data, null, 2)}\n\n`);
      
      // Test first category's merchants if available
      if (Array.isArray(data) && data.length > 0) {
        const firstCategory = data[0];
        const slug = firstCategory.slug || firstCategory.id || 'eatery';
        
        setTestResults(prev => prev + `Testing merchants for category: ${slug}\n`);
        
        const merchantResponse = await fetch(`https://www.daysahmedabad.com/api/categories/${slug}/merchants/`);
        const merchantData = await merchantResponse.json();
        
        setTestResults(prev => prev + `Merchants Response:\n${JSON.stringify(merchantData, null, 2)}\n`);
      }
    } catch (error) {
      setTestResults(prev => prev + `Error: ${error}\n`);
    }
  };

  const testSpecificCategory = async (slug: string) => {
    try {
      setTestResults(prev => prev + `\nTesting ${slug} category...\n`);
      const response = await fetch(`https://www.daysahmedabad.com/api/categories/${slug}/merchants/`);
      const data = await response.json();
      
      setTestResults(prev => prev + `${slug} Response:\n${JSON.stringify(data, null, 2)}\n\n`);
    } catch (error) {
      setTestResults(prev => prev + `${slug} Error: ${error}\n`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>API Tester</Text>
      
      <TouchableOpacity style={styles.button} onPress={testCategoriesAPI}>
        <Text style={styles.buttonText}>Test Categories & First Merchants</Text>
      </TouchableOpacity>
      
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.smallButton} onPress={() => testSpecificCategory('automobile')}>
          <Text style={styles.buttonText}>Test Automobile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.smallButton} onPress={() => testSpecificCategory('eatery')}>
          <Text style={styles.buttonText}>Test Eatery</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity style={styles.clearButton} onPress={() => setTestResults('')}>
        <Text style={styles.buttonText}>Clear Results</Text>
      </TouchableOpacity>
      
      <ScrollView style={styles.resultsContainer}>
        <Text style={styles.resultsText}>{testResults}</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  smallButton: {
    backgroundColor: Colors.secondary,
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  clearButton: {
    backgroundColor: Colors.warning,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },
  resultsContainer: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 8,
    padding: 12,
  },
  resultsText: {
    fontSize: 12,
    color: Colors.text,
    fontFamily: 'monospace',
  },
});

export default ApiTester;