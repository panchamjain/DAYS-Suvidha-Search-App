import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar, FlatList, Text, Linking } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import SearchBar from '../components/SearchBar';
import CategoryCard from '../components/CategoryCard';
import MerchantCard from '../components/MerchantCard';
import Colors from '../constants/Colors';
import { merchants, Category, Merchant } from '../constants/MockData';

interface SearchSuggestion {
  id: string;
  title: string;
  subtitle: string;
  type: 'category' | 'merchant' | 'location' | 'discount';
  data: any;
  icon: string;
}

const SearchScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [searchResults, setSearchResults] = useState<{
    categories: Category[];
    merchants: Merchant[];
  }>({ categories: [], merchants: [] });
  const [showResults, setShowResults] = useState(false);

  const handleSuggestionPress = useCallback((suggestion: SearchSuggestion) => {
    console.log('Search suggestion pressed:', suggestion);
    
    // Check if the suggestion has a URL to open
    if (suggestion.data?.url) {
      try {
        // Try to open the URL
        Linking.openURL(suggestion.data.url);
        return;
      } catch (error) {
        console.error('Failed to open URL:', suggestion.data.url, error);
        // Continue with normal navigation if URL fails
      }
    }

    switch (suggestion.type) {
      case 'category':
        (navigation as any).navigate('Category', {
          categoryId: suggestion.data.slug || suggestion.data.id,
          categoryName: suggestion.data.name || suggestion.title,
        });
        break;
      case 'merchant':
        // Create a proper merchant object for navigation
        const merchantData: Merchant = {
          id: suggestion.data.id || parseInt(suggestion.id),
          name: suggestion.data.name,
          category: suggestion.data.category_name,
          address: suggestion.data.address,
          contact: suggestion.data.contact || suggestion.data.phone,
          discount: suggestion.data.discount,
          description: suggestion.data.description,
          rating: suggestion.data.rating,
          totalBranches: suggestion.data.totalBranches || suggestion.data.branch_count || 1,
          establishedYear: suggestion.data.establishedYear || suggestion.data.established_year,
          website: suggestion.data.website,
          ...suggestion.data // Include any additional fields
        };
        
        (navigation as any).navigate('MerchantDetail', {
          merchant: merchantData,
        });
        break;
      case 'location':
        // Filter merchants by location
        const locationMerchants = merchants.filter(merchant =>
          merchant.address?.toLowerCase().includes(suggestion.data.location?.toLowerCase() || suggestion.title.toLowerCase())
        );
        setSearchResults({ categories: [], merchants: locationMerchants });
        setShowResults(true);
        break;
      case 'discount':
        // Filter merchants by discount
        const discountMerchants = merchants.filter(merchant =>
          merchant.discount === suggestion.data.discount || merchant.discount === suggestion.title
        );
        setSearchResults({ categories: [], merchants: discountMerchants });
        setShowResults(true);
        break;
      default:
        console.warn('Unknown suggestion type:', suggestion.type);
        break;
    }
  }, [navigation]);

  // Handle incoming suggestion from navigation
  useEffect(() => {
    const params = route.params as any;
    if (params?.suggestion) {
      handleSuggestionPress(params.suggestion);
    }
  }, [route.params, handleSuggestionPress]);

  const handleCategoryPress = (categoryId: string, categoryName: string) => {
    (navigation as any).navigate('Category', { categoryId, categoryName });
  };

  const handleMerchantPress = (merchant: Merchant) => {
    (navigation as any).navigate('MerchantDetail', { merchant });
  };

  const renderSearchResults = () => {
    if (!showResults) return null;

    return (
      <View style={styles.resultsContainer}>
        {searchResults.categories.length > 0 && (
          <View style={styles.resultSection}>
            <Text style={styles.resultSectionTitle}>Categories</Text>
            <FlatList
              data={searchResults.categories}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <CategoryCard
                  category={item}
                  onPress={() => handleCategoryPress(item.id, item.name)}
                />
              )}
              numColumns={2}
              columnWrapperStyle={styles.columnWrapper}
              scrollEnabled={false}
            />
          </View>
        )}

        {searchResults.merchants.length > 0 && (
          <View style={styles.resultSection}>
            <Text style={styles.resultSectionTitle}>
              Merchants ({searchResults.merchants.length})
            </Text>
            <FlatList
              data={searchResults.merchants}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <MerchantCard
                  merchant={item}
                  onPress={() => handleMerchantPress(item)}
                />
              )}
              scrollEnabled={false}
            />
          </View>
        )}

        {searchResults.categories.length === 0 && searchResults.merchants.length === 0 && (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsText}>No results found</Text>
            <Text style={styles.noResultsSubtext}>
              Try searching for different keywords
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={Colors.card} barStyle="dark-content" />
      
      <SearchBar
        onSuggestionPress={handleSuggestionPress}
        onSearchFocus={() => setShowResults(false)}
      />

      {renderSearchResults()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  resultsContainer: {
    flex: 1,
    paddingTop: 16,
  },
  resultSection: {
    marginBottom: 24,
  },
  resultSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
  },
});

export default SearchScreen;
