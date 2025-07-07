import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, StatusBar, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import CategoryCard from '../components/CategoryCard';
import CategoryCardSkeleton from '../components/CategoryCardSkeleton';
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
    // This is now handled in the SearchBar component itself
    console.log('Suggestion pressed:', suggestion);
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

  const renderCategorySkeleton = ({ item }: { item: number }) => (
    <CategoryCardSkeleton key={item} />
  );

  const renderError = () => (
    <View style={styles.errorContainer}>
      <MaterialIcons name="error-outline" size={48} color={Colors.textLight} />
      <Text style={styles.errorText}>Failed to load categories</Text>
      <Text style={styles.errorSubtext}>Please check your internet connection</Text>
      <Text style={styles.debugText}>Error: {error?.message}</Text>
    </View>
  );

  const renderShimmerLoading = () => (
    <FlatList
      data={[1, 2, 3, 4, 5, 6]}
      keyExtractor={(item) => `skeleton-${item}`}
      renderItem={renderCategorySkeleton}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      numColumns={2}
      columnWrapperStyle={styles.columnWrapper}
    />
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
      
      <FlatList
        data={[]}
        keyExtractor={() => 'header'}
        renderItem={() => null}
        ListHeaderComponent={
          <>
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

            {/* DAYS Sections */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>DAYS Community</Text>
                <Text style={styles.sectionSubtitle}>Stay connected with our community</Text>
              </View>
              
              <View style={styles.daysGrid}>
                <TouchableOpacity 
                  style={styles.daysCard}
                  onPress={() => navigation.navigate('DaysEvents' as never)}
                >
                  <View style={[styles.daysIcon, { backgroundColor: `${Colors.secondary}15` }]}>
                    <MaterialIcons name="event" size={32} color={Colors.secondary} />
                  </View>
                  <Text style={styles.daysTitle}>DAYS Events</Text>
                  <Text style={styles.daysDescription}>Join workshops, networking meets & cultural events</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.daysCard}
                  onPress={() => navigation.navigate('DaysNews' as never)}
                >
                  <View style={[styles.daysIcon, { backgroundColor: `${Colors.info}15` }]}>
                    <MaterialIcons name="article" size={32} color={Colors.info} />
                  </View>
                  <Text style={styles.daysTitle}>DAYS News</Text>
                  <Text style={styles.daysDescription}>Latest updates, partnerships & announcements</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Temples Section */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Temples of Ahmedabad</Text>
                <Text style={styles.sectionSubtitle}>Discover sacred places in the city</Text>
              </View>
              
              <TouchableOpacity 
                style={styles.templesBanner}
                onPress={() => navigation.navigate('Temples' as never)}
              >
                <View style={styles.templesContent}>
                  <View style={styles.templesIcon}>
                    <MaterialIcons name="account-balance" size={40} color="white" />
                  </View>
                  <View style={styles.templesInfo}>
                    <Text style={styles.templesTitle}>Explore Temples</Text>
                    <Text style={styles.templesSubtitle}>
                      Find temples with complete information including timings, trustees, and dharamshala facilities
                    </Text>
                  </View>
                  <MaterialIcons name="arrow-forward" size={24} color="white" />
                </View>
              </TouchableOpacity>
            </View>

            {/* Categories Section */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Discount Categories</Text>
                <Text style={styles.sectionSubtitle}>Browse by category to find the best deals</Text>
              </View>
            </View>
          </>
        }
        ListFooterComponent={
          loading ? renderShimmerLoading() : error ? renderError() : (
            <FlatList
              data={categoryList}
              keyExtractor={(item) => item.id || item.slug || item.name}
              renderItem={renderCategory}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              numColumns={2}
              columnWrapperStyle={categoryList.length > 1 ? styles.columnWrapper : undefined}
              scrollEnabled={false}
            />
          )
        }
        showsVerticalScrollIndicator={false}
      />
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
  sectionContainer: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.textLight,
  },
  daysGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  daysCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  daysIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  daysTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  daysDescription: {
    fontSize: 12,
    color: Colors.textLight,
    textAlign: 'center',
    lineHeight: 16,
  },
  templesBanner: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: 20,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  templesContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  templesIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  templesInfo: {
    flex: 1,
    marginRight: 12,
  },
  templesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 6,
  },
  templesSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 18,
  },
  listContent: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    paddingBottom: 24,
  },
  columnWrapper: {
    justifyContent: 'space-between',
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