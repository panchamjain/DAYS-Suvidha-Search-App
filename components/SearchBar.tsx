import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
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
import Fuse from 'fuse.js';
import Colors from '../constants/Colors';
import { categories, merchants } from '../constants/MockData';
import { searchService, SearchResult } from '../services/searchService';

interface SearchSuggestion {
  id: string;
  title: string;
  subtitle: string;
  type: 'category' | 'merchant' | 'location' | 'discount';
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
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  // Memoize local search data for fallback
  const localSearchData = useMemo((): SearchSuggestion[] => [
    // Categories
    ...categories.map(category => ({
      id: `category-${category.id}`,
      title: category.name,
      subtitle: 'Category',
      type: 'category' as const,
      data: category,
      icon: category.icon,
      url: `/category/${category.slug || category.id}`,
    })),
    // Merchants
    ...merchants.map(merchant => ({
      id: `merchant-${merchant.id}`,
      title: merchant.name,
      subtitle: 'Merchant',
      type: 'merchant' as const,
      data: merchant,
      icon: 'store',
      url: `/merchant/${merchant.id}`,
    })),
    // Locations (extracted from merchant addresses)
    ...Array.from(new Set(merchants.map(m => m.address?.split(',')[0]?.trim()).filter(Boolean)))
      .map((location, index) => ({
        id: `location-${index}`,
        title: location!,
        subtitle: 'Location',
        type: 'location' as const,
        data: { location },
        icon: 'location-on',
      })),
    // Discounts
    ...Array.from(new Set(merchants.map(m => m.discount).filter(Boolean)))
      .map((discount, index) => ({
        id: `discount-${index}`,
        title: discount!,
        subtitle: 'Discount',
        type: 'discount' as const,
        data: { discount },
        icon: 'local-offer',
      })),
  ], []);

  // Memoize Fuse.js instance for local search fallback
  const fuse = useMemo(() => new Fuse(localSearchData, {
    keys: ['title', 'subtitle'],
    threshold: 0.4,
    includeScore: true,
    minMatchCharLength: 1,
  }), [localSearchData]);

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
    type: result.type === 'location' ? 'location' : result.type,
    data: result.data,
    icon: result.icon,
    url: result.url,
  });

  // Navigate based on URL or type
  const navigateToResult = (suggestion: SearchSuggestion) => {
    if (suggestion.url) {
      // Parse URL and navigate accordingly
      if (suggestion.url.includes('/category/')) {
        const categoryId = suggestion.url.split('/category/')[1];
        (navigation as any).navigate('Category', { 
          categoryId, 
          categoryName: suggestion.title 
        });
      } else if (suggestion.url.includes('/merchant/')) {
        const merchantId = suggestion.url.split('/merchant/')[1];
        (navigation as any).navigate('MerchantDetail', { 
          merchant: { ...suggestion.data, id: merchantId }
        });
      }
    } else {
      // Fallback to type-based navigation
      switch (suggestion.type) {
        case 'category':
          const categorySlug = suggestion.data.slug || suggestion.data.id || suggestion.data.name?.toLowerCase().replace(/\s+/g, '-');
          (navigation as any).navigate('Category', {
            categoryId: categorySlug,
            categoryName: suggestion.data.name,
          });
          break;
        case 'merchant':
          (navigation as any).navigate('MerchantDetail', {
            merchant: suggestion.data,
          });
          break;
        case 'location':
        case 'discount':
          (navigation as any).navigate('Search', {
            suggestion: suggestion,
          });
          break;
      }
    }
  };

  // Search function with API integration
  const performSearch = useCallback(async (query: string) => {
    if (query.trim().length === 0) {
      setSuggestions([]);
      setShowSuggestions(false);
      animateDropdown(false);
      return;
    }

    setIsSearching(true);

    try {
      // Try API search first
      const apiResults = await searchService.search(query);
      
      if (apiResults.results.length > 0) {
        // Use API results
        const apiSuggestions = apiResults.results
          .slice(0, 8)
          .map(convertSearchResult);
        setSuggestions(apiSuggestions);
      } else {
        // Fallback to local search
        const localResults = fuse.search(query).slice(0, 8);
        const localSuggestions = localResults.map(result => result.item);
        setSuggestions(localSuggestions);
      }
      
      setShowSuggestions(true);
      animateDropdown(true);
    } catch (error) {
      console.error('Search error:', error);
      // Fallback to local search on error
      const localResults = fuse.search(query).slice(0, 8);
      const localSuggestions = localResults.map(result => result.item);
      setSuggestions(localSuggestions);
      setShowSuggestions(true);
      animateDropdown(true);
    } finally {
      setIsSearching(false);
    }
  }, [fuse, animateDropdown]);

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
    
    // Navigate to the result
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

  const renderSuggestion = ({ item }: { item: SearchSuggestion }) => (
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
        <Text style={styles.suggestionSubtitle}>in {item.subtitle}</Text>
      </View>
      <MaterialIcons name="north-west" size={16} color={Colors.textLight} />
    </TouchableOpacity>
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
        {showSuggestions && suggestions.length > 0 && (
          <FlatList
            data={suggestions}
            keyExtractor={(item) => item.id}
            renderItem={renderSuggestion}
            style={styles.suggestionsList}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          />
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
});

export default SearchBar;
