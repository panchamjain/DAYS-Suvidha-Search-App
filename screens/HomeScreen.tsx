import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  Image, 
  FlatList, 
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, SHADOWS } from '../constants/theme';
import { categories, getPopularMerchants, searchMerchants } from '../data/mockData';
import CategoryCard from '../components/CategoryCard';
import MerchantCard from '../components/MerchantCard';
import SearchBar from '../components/SearchBar';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.75;

const HomeScreen = ({ navigation }: any) => {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const popularMerchants = getPopularMerchants();
  
  const handleSearch = (query: string) => {
    if (query.trim()) {
      const results = searchMerchants(query);
      setSearchResults(results);
      setIsSearching(true);
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
      // This could navigate to a map view or filter by location
    } else if (type === 'discount') {
      // Handle discount suggestion
      // This could navigate to the merchant with this discount
    }
    
    setIsSearching(false);
  };
  
  const renderCategoryItem = ({ item }: any) => (
    <CategoryCard
      name={item.name}
      icon={item.icon}
      image={item.image}
      description={item.description}
      onPress={() => navigation.navigate('CategoryDetails', { categoryId: item.id })}
    />
  );
  
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
        <Image source={require('../assets/images/days-logo.png')} style={styles.logo} />
        <Text style={styles.headerTitle}>DAYS Ahmedabad</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <SearchBar 
          onSearch={handleSearch} 
          onSelectSuggestion={handleSelectSuggestion} 
        />
      </View>
      
      {isSearching ? (
        <View style={styles.searchResultsContainer}>
          <Text style={styles.sectionTitle}>Search Results</Text>
          {searchResults.length > 0 ? (
            <FlatList
              data={searchResults}
              renderItem={renderMerchantItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.searchResultsList}
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
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <FlatList
              data={categories}
              renderItem={renderCategoryItem}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesList}
              snapToInterval={CARD_WIDTH + SIZES.padding}
              decelerationRate="fast"
              ItemSeparatorComponent={() => <View style={{ width: SIZES.padding }} />}
            />
          </View>
          
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Popular Merchants</Text>
              <TouchableOpacity 
                style={styles.viewAllButton}
                onPress={() => navigation.navigate('AllMerchants')}
              >
                <Text style={styles.viewAllText}>View All</Text>
                <MaterialCommunityIcons name="chevron-right" size={20} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
            
            {popularMerchants.map((merchant) => (
              <MerchantCard
                key={merchant.id}
                merchant={merchant}
                onPress={() => navigation.navigate('MerchantDetails', { merchantId: merchant.id })}
              />
            ))}
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About DAYS Suvidha Card</Text>
            <View style={styles.aboutCard}>
              <Text style={styles.aboutText}>
                The DAYS Suvidha Card offers exclusive discounts and benefits at various establishments across Ahmedabad. 
                From restaurants to healthcare, shopping to entertainment, enjoy special privileges with your DAYS membership.
              </Text>
              <TouchableOpacity style={styles.learnMoreButton}>
                <Text style={styles.learnMoreText}>Learn More</Text>
                <MaterialCommunityIcons name="arrow-right" size={18} color={COLORS.white} style={{ marginLeft: 4 }} />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingTop: SIZES.padding,
    paddingBottom: SIZES.base,
    backgroundColor: COLORS.white,
    ...SHADOWS.light,
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  headerTitle: {
    ...FONTS.bold,
    fontSize: SIZES.extraLarge,
    color: COLORS.primary,
    marginLeft: SIZES.base,
  },
  searchContainer: {
    paddingHorizontal: SIZES.padding,
    marginVertical: SIZES.padding,
    zIndex: 10,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  section: {
    marginBottom: SIZES.padding * 2,
    paddingHorizontal: SIZES.padding,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  sectionTitle: {
    ...FONTS.bold,
    fontSize: SIZES.large,
    color: COLORS.text.primary,
    marginBottom: SIZES.padding,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    ...FONTS.medium,
    fontSize: SIZES.font,
    color: COLORS.primary,
  },
  categoriesList: {
    paddingRight: SIZES.padding,
  },
  aboutCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    ...SHADOWS.medium,
  },
  aboutText: {
    ...FONTS.regular,
    fontSize: SIZES.font,
    color: COLORS.text.secondary,
    lineHeight: 22,
  },
  learnMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: SIZES.padding,
    paddingVertical: SIZES.base,
    paddingHorizontal: SIZES.padding,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius,
  },
  learnMoreText: {
    ...FONTS.medium,
    fontSize: SIZES.font,
    color: COLORS.white,
  },
  searchResultsContainer: {
    flex: 1,
    paddingHorizontal: SIZES.padding,
  },
  searchResultsList: {
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
});

export default HomeScreen;
