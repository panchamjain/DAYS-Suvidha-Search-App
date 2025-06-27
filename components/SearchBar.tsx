import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Animated,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Colors from '../constants/Colors';
import { searchService, SearchResult } from '../services/searchService';

interface SearchSuggestion {
  id: string;
  title: string;
  subtitle: string;
  type: 'category' | 'merchant' | 'location';
  data: any;
  icon: string;
  url?: string;
}

interface SearchBarProps {
  onSuggestionPress: (suggestion: SearchSuggestion) => void;
  onSearchFocus?: () => void;
  onSearchBlur?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSuggestionPress,
  onSearchFocus,
  onSearchBlur,
}) => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const animatedHeight = useRef(new Animated.Value(0)).current;
  const searchInputRef = useRef<TextInput>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const animateDropdown = useCallback((show: boolean) => {
    Animated.timing(animatedHeight, {
      toValue: show ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [animatedHeight]);

  // Convert SearchResult to SearchSuggestion
  const convertSearchResult = (result: SearchResult): SearchSuggestion => ({
    id: result.id,
    title: result.title,
    subtitle: result.subtitle,
    type: result.type,
    data: result.data,
    icon: result.icon,
    url: result.url,
  });

  // Navigate based on type and URL from API
  const navigateToResult = (suggestion: SearchSuggestion) => {
    console.log('Navigating to suggestion:', suggestion);
    
    // Use the type from API to determine navigation
    switch (suggestion.type) {
      case 'category':
        // Extract category ID from URL or use data
        let categoryId = suggestion.data.slug || suggestion.data.id;
        
        if (suggestion.url && suggestion.url.includes('/category/')) {
          categoryId = suggestion.url.split('/category/')[1];
        }
        
        console.log('Navigating to category:', categoryId, suggestion.title);
        (navigation as any).navigate('Category', { 
          categoryId, 
          categoryName: suggestion.title 
        });
        break;
        
      case 'merchant':
        // Extract merchant ID from URL or use data
        let merchantId = suggestion.data.id;
        
        if (suggestion.url && suggestion.url.includes('/merchant/')) {
          merchantId = suggestion.url.split('/merchant/')[1];
        }
        
        console.log('Navigating to merchant:', merchantId, suggestion.title);
        (navigation as any).navigate('MerchantDetail', { 
          merchant: { ...suggestion.data, id: merchantId }
        });
        break;
        
      case 'location':
        // Navigate to search screen with location filter
        console.log('Navigating to location search:', suggestion.title);
        (navigation as any).navigate('Search', {
          suggestion: suggestion,
        });
        break;
        
      default:
        console.log('Unknown suggestion type:', suggestion.type);
        break;
    }
  };

  // Search function using only API
  const performSearch = useCallback(async (query: string) => {
    if (query.trim().length === 0) {
      setSuggestions([]);
      setShowSuggestions(false);
      animateDropdown(false);
      return;
    }

    console.log('SearchBar: Starting API search for:', query);
    setIsSearching(true);

    try {
      // Only use API search - no fallback to mock data
      const apiResults = await searchService.search(query);
      console.log('SearchBar: API search results:', apiResults);
      
      if (apiResults.results.length > 0) {
        const apiSuggestions = apiResults.results
          .slice(0, 8)
          .map(convertSearchResult);
        console.log('SearchBar: Converted API suggestions:', apiSuggestions);
        setSuggestions(apiSuggestions);
        setShowSuggestions(true);
        animateDropdown(true);
      } else {
        // No results from API
        console.log('SearchBar: No API results found');
        setSuggestions([]);
        setShowSuggestions(false);
        animateDropdown(false);
      }
      
    } catch (error) {
      console.error('SearchBar: Search error:', error);
      // On error, show no suggestions instead of fallback
      setSuggestions([]);
      setShowSuggestions(false);
      animateDropdown(false);
    } finally {
      setIsSearching(false);
    }
  }, [animateDropdown]);

  // Debounced search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      performSearch(searchQuery);
    }, 300); // 300ms debounce

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, performSearch]);

  const handleSuggestionPress = (suggestion: SearchSuggestion) => {
    setSearchQuery(suggestion.title);
    setShowSuggestions(false);
    animateDropdown(false);
    searchInputRef.current?.blur();
    
    // Navigate to the result based on API type
    navigateToResult(suggestion);
    
    // Also call the original callback
    onSuggestionPress(suggestion);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    animateDropdown(false);
  };

  const handleFocus = () => {
    onSearchFocus?.();
    if (searchQuery.trim().length > 0) {
      setShowSuggestions(true);
      animateDropdown(true);
    }
  };

  const handleBlur = () => {
    onSearchBlur?.();
    // Delay hiding suggestions to allow for suggestion tap
    setTimeout(() => {
      setShowSuggestions(false);
      animateDropdown(false);
    }, 150);
  };

  const renderSuggestion = ({ item }: { item: SearchSuggestion }) => {
    console.log('SearchBar: Rendering suggestion:', item);
    return (
      <TouchableOpacity
        style={styles.suggestionItem}
        onPress={() => handleSuggestionPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.suggestionIcon}>
          <MaterialIcons name={item.icon as any} size={20} color={Colors.primary} />
        </View>
        <View style={styles.suggestionContent}>
          <Text style={styles.suggestionTitle}>{item.title}</Text>
          <Text style={styles.suggestionSubtitle}>{item.subtitle}</Text>
        </View>
        <MaterialIcons name="north-west" size={16} color={Colors.textLight} />
      </TouchableOpacity>
    );
  };

  const renderNoResults = () => (
    <View style={styles.noResultsContainer}>
      <MaterialIcons name="search-off" size={24} color={Colors.textLight} />
      <Text style={styles.noResultsText}>No results found</Text>
      <Text style={styles.noResultsSubtext}>Try a different search term</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <MaterialIcons name="search" size={20} color={Colors.textLight} />
          <TextInput
            ref={searchInputRef}
            style={styles.searchInput}
            placeholder="Search categories, merchants, locations..."
            placeholderTextColor={Colors.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={handleFocus}
            onBlur={handleBlur}
            returnKeyType="search"
          />
          {isSearching && (
            <View style={styles.loadingIndicator}>
              <MaterialIcons name="hourglass-empty" size={16} color={Colors.textLight} />
            </View>
          )}
          {searchQuery.length > 0 && !isSearching && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <MaterialIcons name="close" size={20} color={Colors.textLight} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Suggestions Dropdown */}
      <Animated.View
        style={[
          styles.suggestionsContainer,
          {
            maxHeight: animatedHeight.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 300],
            }),
            opacity: animatedHeight,
          },
        ]}
      >
        {showSuggestions && (
          <>
            {suggestions.length > 0 ? (
              <FlatList
                data={suggestions}
                keyExtractor={(item) => item.id}
                renderItem={renderSuggestion}
                style={styles.suggestionsList}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              />
            ) : (
              searchQuery.trim().length > 0 && !isSearching && renderNoResults()
            )}
          </>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    zIndex: 1000,
  },
  searchContainer: {
    marginBottom: 8,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 48,
    ...Platform.select({
      ios: {
        shadowColor: Colors.cardShadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    marginLeft: 12,
    marginRight: 8,
    minHeight: 24,
  },
  loadingIndicator: {
    padding: 4,
  },
  clearButton: {
    padding: 4,
  },
  suggestionsContainer: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: Colors.cardShadow,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  suggestionsList: {
    maxHeight: 300,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  suggestionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: `${Colors.primary}10`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  suggestionContent: {
    flex: 1,
  },
  suggestionTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 2,
  },
  suggestionSubtitle: {
    fontSize: 13,
    color: Colors.textLight,
  },
  suggestionTypeContainer: {
    alignItems: 'flex-end',
  },
  suggestionType: {
    fontSize: 11,
    color: Colors.primary,
    fontWeight: '500',
    textTransform: 'capitalize',
    marginBottom: 2,
  },
  noResultsContainer: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  noResultsText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginTop: 8,
    marginBottom: 4,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
  },
});

export default SearchBar;
