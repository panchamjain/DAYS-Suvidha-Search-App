import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  SafeAreaView,
  StatusBar
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { searchMerchants } from '../data/mockData';
import MerchantCard from '../components/MerchantCard';
import SearchBar from '../components/SearchBar';

const SearchScreen = ({ navigation }: any) => {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  
  const handleSearch = (query: string) => {
    if (query.trim()) {
      const results = searchMerchants(query);
      setSearchResults(results);
      setIsSearching(true);
      
      // Add to recent searches
      if (!recentSearches.includes(query)) {
        setRecentSearches(prev => [query, ...prev].slice(0, 5));
      }
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  };
  
  const handleSelectSuggestion = (type: string, id: string) => {
    if (type === 'category') {
      navigation.navigate('CategoryDetails', { categoryId: id });
    } else if (type === 'merchant') {
      navigation.navigate('MerchantDetails', { merchantId: id });
    } else if (type === 'location') {
      // Handle location suggestion
    } else if (type === 'discount') {
      // Handle discount suggestion
    }
  };
  
  const handleRecentSearch = (query: string) => {
    handleSearch(query);
  };
  
  const clearRecentSearches = () => {
    setRecentSearches([]);
  };
  
  const renderMerchantItem = ({ item }: any) => (
    <MerchantCard
      merchant={item}
      onPress={() => navigation.navigate('MerchantDetails', { merchantId: item.id })}
    />
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Search</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <SearchBar 
          onSearch={handleSearch} 
          onSelectSuggestion={handleSelectSuggestion} 
        />
      </View>
      
      {isSearching ? (
        <View style={styles.resultsContainer}>
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsTitle}>
              {searchResults.length} {searchResults.length === 1 ? 'Result' : 'Results'} Found
            </Text>
          </View>
          
          {searchResults.length > 0 ? (
            <FlatList
              data={searchResults}
              renderItem={renderMerchantItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.resultsList}
            />
          ) : (
            <View style={styles.noResultsContainer}>
              <MaterialCommunityIcons name="magnify-close" size={48} color={COLORS.gray} />
              <Text style={styles.noResultsText}>No results found</Text>
              <Text style={styles.noResultsSubtext}>Try a different search term</Text>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.initialContent}>
          {recentSearches.length > 0 && (
            <View style={styles.recentSearchesContainer}>
              <View style={styles.recentSearchesHeader}>
                <Text style={styles.recentSearchesTitle}>Recent Searches</Text>
                <TouchableOpacity onPress={clearRecentSearches}>
                  <Text style={styles.clearText}>Clear</Text>
                </TouchableOpacity>
              </View>
              
              {recentSearches.map((search, index) => (
                <TouchableOpacity 
                  key={`recent-${index}`}
                  style={styles.recentSearchItem}
                  onPress={() => handleRecentSearch(search)}
                >
                  <MaterialCommunityIcons name="history" size={20} color={COLORS.text.tertiary} />
                  <Text style={styles.recentSearchText}>{search}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          
          <View style={styles.popularFiltersContainer}>
            <Text style={styles.popularFiltersTitle}>Popular Filters</Text>
            
            <View style={styles.filtersRow}>
              <TouchableOpacity 
                style={styles.filterButton}
                onPress={() => handleSearch('restaurant')}
              >
                <MaterialCommunityIcons name="food" size={20} color={COLORS.primary} />
                <Text style={styles.filterText}>Restaurants</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.filterButton}
                onPress={() => handleSearch('healthcare')}
              >
                <MaterialCommunityIcons name="hospital" size={20} color={COLORS.primary} />
                <Text style={styles.filterText}>Healthcare</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.filtersRow}>
              <TouchableOpacity 
                style={styles.filterButton}
                onPress={() => handleSearch('20% off')}
              >
                <MaterialCommunityIcons name="tag" size={20} color={COLORS.primary} />
                <Text style={styles.filterText}>20% Off</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.filterButton}
                onPress={() => handleSearch('popular')}
              >
                <MaterialCommunityIcons name="star" size={20} color={COLORS.primary} />
                <Text style={styles.filterText}>Popular</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SIZES.padding,
    paddingTop: SIZES.padding,
    paddingBottom: SIZES.base,
  },
  headerTitle: {
    ...FONTS.bold,
    fontSize: SIZES.extraLarge,
    color: COLORS.text.primary,
  },
  searchContainer: {
    paddingHorizontal: SIZES.padding,
    marginBottom: SIZES.padding,
    zIndex: 10,
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: SIZES.padding,
  },
  resultsHeader: {
    marginBottom: SIZES.padding,
  },
  resultsTitle: {
    ...FONTS.bold,
    fontSize: SIZES.large,
    color: COLORS.text.primary,
  },
  resultsList: {
    paddingBottom: 100,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  noResultsText: {
    ...FONTS.bold,
    fontSize: SIZES.large,
    color: COLORS.text.primary,
    marginTop: SIZES.padding,
  },
  noResultsSubtext: {
    ...FONTS.regular,
    fontSize: SIZES.font,
    color: COLORS.text.tertiary,
    marginTop: SIZES.base,
  },
  initialContent: {
    flex: 1,
    paddingHorizontal: SIZES.padding,
  },
  recentSearchesContainer: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.padding,
  },
  recentSearchesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  recentSearchesTitle: {
    ...FONTS.bold,
    fontSize: SIZES.medium,
    color: COLORS.text.primary,
  },
  clearText: {
    ...FONTS.medium,
    fontSize: SIZES.small,
    color: COLORS.primary,
  },
  recentSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.base,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  recentSearchText: {
    ...FONTS.regular,
    fontSize: SIZES.font,
    color: COLORS.text.secondary,
    marginLeft: SIZES.base,
  },
  popularFiltersContainer: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
  },
  popularFiltersTitle: {
    ...FONTS.bold,
    fontSize: SIZES.medium,
    color: COLORS.text.primary,
    marginBottom: SIZES.padding,
  },
  filtersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.padding,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.base,
    borderRadius: SIZES.radius,
    width: '48%',
  },
  filterText: {
    ...FONTS.medium,
    fontSize: SIZES.font,
    color: COLORS.text.primary,
    marginLeft: SIZES.base,
  },
});

export default SearchScreen;