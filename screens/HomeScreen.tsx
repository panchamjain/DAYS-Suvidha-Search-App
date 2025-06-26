import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, StatusBar, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import CategoryCard from '../components/CategoryCard';
import { Category } from '../constants/MockData';
import Colors from '../constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useCategories } from '../hooks/useApi';

interface SearchSuggestion {
  id: string;
  title: string;
  subtitle: string;
  type: 'category' | 'merchant' | 'location' | 'discount';
  data: any;
  icon: string;
}

const HomeScreen = () => {
  const navigation = useNavigation();
  const { data: categories, loading, error } = useCategories();

  const handleCategoryPress = (category: Category) => {
    console.log('Category pressed:', category);
    
    // Ensure we have a valid slug
    const categorySlug = category.slug || category.id || category.name?.toLowerCase().replace(/\s+/g, '-');
    console.log('Using categorySlug:', categorySlug);
    
    (navigation as any).navigate('Category', { 
      categoryId: categorySlug, 
      categoryName: category.name 
    });
  };

  const handleSuggestionPress = (suggestion: SearchSuggestion) => {
    switch (suggestion.type) {
      case 'category':
        const suggestionSlug = suggestion.data.slug || suggestion.data.id || suggestion.data.name?.toLowerCase().replace(/\s+/g, '-');
        (navigation as any).navigate('Category', {
          categoryId: suggestionSlug,
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
  };

  const renderCategory = ({ item }: { item: Category }) => {
    console.log('Rendering category:', item);
    return (
      <CategoryCard
        category={item}
        onPress={() => handleCategoryPress(item)}
      />
    );
  };

  const renderError = () => (
    <View style={styles.errorContainer}>
      <MaterialIcons name="error-outline" size={48} color={Colors.textLight} />
      <Text style={styles.errorText}>Failed to load categories</Text>
      <Text style={styles.errorSubtext}>Please check your internet connection</Text>
      <Text style={styles.debugText}>Error: {error?.message}</Text>
    </View>
  );

  const renderLoading = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={Colors.primary} />
      <Text style={styles.loadingText}>Loading categories...</Text>
    </View>
  );

  // Ensure categories is an array and log the data
  const categoryList = Array.isArray(categories) ? categories : [];
  console.log('Categories data received:', categoryList);
  
  // Log the first category to see its structure
  if (categoryList.length > 0) {
    console.log('First category structure:', categoryList[0]);
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={Colors.card} barStyle="dark-content" />
      <Header title="DAYS Ahmedabad" />
      
      <SearchBar onSuggestionPress={handleSuggestionPress} />
      
      <View style={styles.banner}>
        <View style={styles.bannerContent}>
          <View>
            <Text style={styles.bannerTitle}>Suvidha Card</Text>
            <Text style={styles.bannerSubtitle}>
              Exclusive discounts across Ahmedabad
            </Text>
          </View>
          <View style={styles.bannerIconContainer}>
            <MaterialIcons name="card-giftcard" size={40} color="white" />
          </View>
        </View>
      </View>
      
      <View style={styles.listHeader}>
        <Text style={styles.listHeaderTitle}>Categories</Text>
        <Text style={styles.listHeaderSubtitle}>
          {categoryList.length > 0 ? `${categoryList.length} categories available` : 'Explore discount categories'}
        </Text>
      </View>
      
      {loading ? renderLoading() : error ? renderError() : (
        <FlatList
          data={categoryList}
          keyExtractor={(item) => item.id || item.slug || item.name}
          renderItem={renderCategory}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          columnWrapperStyle={categoryList.length > 1 ? styles.columnWrapper : undefined}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  banner: {
    backgroundColor: Colors.primary,
    padding: 20,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
    borderRadius: 16,
    elevation: 4,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  bannerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    maxWidth: '80%',
  },
  bannerIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listHeader: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  listHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  listHeaderSubtitle: {
    fontSize: 14,
    color: Colors.textLight,
    marginTop: 4,
  },
  listContent: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    paddingBottom: 24,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.textLight,
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
    marginBottom: 8,
  },
  debugText: {
    fontSize: 12,
    color: Colors.warning,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default HomeScreen;
