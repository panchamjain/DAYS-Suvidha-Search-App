import * as React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  Image,
  SafeAreaView,
  StatusBar,
  Animated
} from 'react-native';
import { useRef } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, SHADOWS } from '../constants/theme';
import { getCategoryById, getMerchantsByCategory } from '../data/mockData';
import MerchantCard from '../components/MerchantCard';

const CategoryDetailsScreen = ({ route, navigation }: any) => {
  const { categoryId } = route.params;
  const category = getCategoryById(categoryId);
  const merchants = getMerchantsByCategory(categoryId);
  const scrollY = useRef(new Animated.Value(0)).current;
  
  if (!category) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Category not found</Text>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  
  // Banner animation
  const bannerHeight = scrollY.interpolate({
    inputRange: [0, 180],
    outputRange: [180, 90],
    extrapolate: 'clamp',
  });
  
  const bannerOpacity = scrollY.interpolate({
    inputRange: [0, 140, 180],
    outputRange: [1, 0.8, 0.6],
    extrapolate: 'clamp',
  });
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{category.name}</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <Animated.View 
        style={[
          styles.bannerContainer,
          {
            height: bannerHeight,
            opacity: bannerOpacity,
          }
        ]}
      >
        <Image source={category.image} style={styles.bannerImage} />
        <View style={styles.bannerOverlay} />
        <View style={styles.bannerContent}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name={category.icon as any} size={40} color={COLORS.white} />
          </View>
          <Text style={styles.bannerTitle}>{category.name}</Text>
          <Text style={styles.bannerDescription}>{category.description}</Text>
        </View>
      </Animated.View>
      
      <View style={styles.content}>
        <View style={styles.merchantsHeader}>
          <Text style={styles.merchantsTitle}>
            {merchants.length} {merchants.length === 1 ? 'Merchant' : 'Merchants'} Available
          </Text>
          
          <View style={styles.filterContainer}>
            <TouchableOpacity style={styles.filterButton}>
              <MaterialCommunityIcons name="filter-variant" size={20} color={COLORS.primary} />
              <Text style={styles.filterText}>Filter</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {merchants.length > 0 ? (
          <Animated.FlatList
            data={merchants}
            renderItem={({ item }) => (
              <MerchantCard
                merchant={item}
                onPress={() => navigation.navigate('MerchantDetails', { merchantId: item.id })}
              />
            )}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.merchantsList}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: true }
            )}
            scrollEventThrottle={16}
          />
        ) : (
          <View style={styles.noMerchantsContainer}>
            <MaterialCommunityIcons name="store-off" size={48} color={COLORS.gray} />
            <Text style={styles.noMerchantsText}>No merchants available</Text>
            <Text style={styles.noMerchantsSubtext}>Check back later for updates</Text>
          </View>
        )}
      </View>
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
    justifyContent: 'space-between',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding,
    zIndex: 10,
  },
  headerTitle: {
    ...FONTS.bold,
    fontSize: SIZES.large,
    color: COLORS.white,
  },
  backButton: {
    padding: 4,
  },
  backButtonText: {
    ...FONTS.medium,
    fontSize: SIZES.font,
    color: COLORS.primary,
  },
  bannerContainer: {
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bannerContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding,
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  bannerTitle: {
    ...FONTS.bold,
    fontSize: SIZES.xxl,
    color: COLORS.white,
    marginTop: SIZES.base,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  bannerDescription: {
    ...FONTS.regular,
    fontSize: SIZES.font,
    color: COLORS.white,
    marginTop: SIZES.base,
    textAlign: 'center',
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  content: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderTopLeftRadius: SIZES.radius,
    borderTopRightRadius: SIZES.radius,
    marginTop: -SIZES.radius,
    paddingTop: SIZES.padding,
    zIndex: 5,
  },
  merchantsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    marginBottom: SIZES.padding,
  },
  merchantsTitle: {
    ...FONTS.bold,
    fontSize: SIZES.large,
    color: COLORS.text.primary,
  },
  filterContainer: {
    flexDirection: 'row',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.base,
    borderRadius: SIZES.radius,
    ...SHADOWS.light,
  },
  filterText: {
    ...FONTS.medium,
    fontSize: SIZES.font,
    color: COLORS.primary,
    marginLeft: 4,
  },
  merchantsList: {
    paddingHorizontal: SIZES.padding,
    paddingBottom: 100,
  },
  noMerchantsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  noMerchantsText: {
    ...FONTS.bold,
    fontSize: SIZES.large,
    color: COLORS.text.primary,
    marginTop: SIZES.padding,
  },
  noMerchantsSubtext: {
    ...FONTS.regular,
    fontSize: SIZES.font,
    color: COLORS.text.tertiary,
    marginTop: SIZES.base,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding,
  },
  errorText: {
    ...FONTS.bold,
    fontSize: SIZES.large,
    color: COLORS.text.primary,
    marginBottom: SIZES.padding,
  },
});

export default CategoryDetailsScreen;
