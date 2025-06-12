import React, { useState, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  SafeAreaView,
  StatusBar,
  Animated,
  Share
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, SHADOWS } from '../constants/theme';
import { getMerchantById } from '../data/mockData';
import DiscountCard from '../components/DiscountCard';
import LocationCard from '../components/LocationCard';

const MerchantDetailsScreen = ({ route, navigation }: any) => {
  const { merchantId } = route.params;
  const merchant = getMerchantById(merchantId);
  const [activeTab, setActiveTab] = useState('discounts');
  const scrollY = useRef(new Animated.Value(0)).current;
  
  if (!merchant) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Merchant not found</Text>
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
  
  const handleViewMap = (locationId: string) => {
    navigation.navigate('MapView', { 
      merchantId: merchant.id,
      locationId: locationId
    });
  };
  
  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${merchant.name} on DAYS Suvidha Card! They offer up to ${Math.max(...merchant.discounts.map(d => d.percentage))}% discount.`,
      });
    } catch (error) {
      console.log(error);
    }
  };
  
  // Header animation
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -50],
    extrapolate: 'clamp',
  });
  
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 60, 90],
    outputRange: [1, 0.3, 0],
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
        <Text style={styles.headerTitle}>{merchant.name}</Text>
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <MaterialCommunityIcons name="share-variant" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>
      
      <Animated.ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        <Animated.View 
          style={[
            styles.merchantHeaderContainer,
            {
              transform: [{ translateY: headerHeight }],
              opacity: headerOpacity,
            }
          ]}
        >
          <View style={styles.merchantInfoContainer}>
            <View style={styles.merchantHeader}>
              {merchant.image ? (
                <Image source={merchant.image} style={styles.merchantImage} />
              ) : (
                <View style={styles.merchantImagePlaceholder}>
                  <MaterialCommunityIcons 
                    name={merchant.category === 'Restaurants' ? 'food' : 
                          merchant.category === 'Healthcare' ? 'hospital' :
                          merchant.category === 'Shopping' ? 'shopping' :
                          merchant.category === 'Entertainment' ? 'movie' : 'school'} 
                    size={40} 
                    color={COLORS.primary} 
                  />
                </View>
              )}
              
              <View style={styles.merchantDetails}>
                <Text style={styles.merchantName}>{merchant.name}</Text>
                <Text style={styles.merchantCategory}>{merchant.category}</Text>
                
                <View style={styles.ratingContainer}>
                  <MaterialCommunityIcons name="star" size={18} color={COLORS.secondary} />
                  <Text style={styles.rating}>{merchant.rating.toFixed(1)}</Text>
                  <Text style={styles.reviews}>({merchant.reviews} reviews)</Text>
                </View>
              </View>
            </View>
            
            <Text style={styles.merchantDescription}>{merchant.description}</Text>
          </View>
        </Animated.View>
        
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[
              styles.tab, 
              activeTab === 'discounts' && styles.activeTab
            ]}
            onPress={() => setActiveTab('discounts')}
          >
            <MaterialCommunityIcons 
              name="tag-outline" 
              size={20} 
              color={activeTab === 'discounts' ? COLORS.primary : COLORS.text.tertiary} 
            />
            <Text 
              style={[
                styles.tabText, 
                activeTab === 'discounts' && styles.activeTabText
              ]}
            >
              Discounts ({merchant.discounts.length})
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.tab, 
              activeTab === 'locations' && styles.activeTab
            ]}
            onPress={() => setActiveTab('locations')}
          >
            <MaterialCommunityIcons 
              name="map-marker-outline" 
              size={20} 
              color={activeTab === 'locations' ? COLORS.primary : COLORS.text.tertiary} 
            />
            <Text 
              style={[
                styles.tabText, 
                activeTab === 'locations' && styles.activeTabText
              ]}
            >
              Locations ({merchant.locations.length})
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.tabContent}>
          {activeTab === 'discounts' && (
            <View>
              {merchant.discounts.map((discount) => (
                <DiscountCard key={discount.id} discount={discount} />
              ))}
            </View>
          )}
          
          {activeTab === 'locations' && (
            <View>
              {merchant.locations.map((location) => (
                <LocationCard 
                  key={location.id} 
                  location={location} 
                  onViewMap={() => handleViewMap(location.id)} 
                />
              ))}
            </View>
          )}
        </View>
      </Animated.ScrollView>
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
    flex: 1,
    textAlign: 'center',
  },
  backButton: {
    padding: 4,
  },
  shareButton: {
    padding: 4,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  merchantHeaderContainer: {
    backgroundColor: COLORS.primary,
    paddingBottom: SIZES.padding,
  },
  merchantInfoContainer: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: SIZES.radius,
    borderTopRightRadius: SIZES.radius,
    padding: SIZES.padding,
    marginTop: SIZES.padding,
    ...SHADOWS.medium,
  },
  merchantHeader: {
    flexDirection: 'row',
    marginBottom: SIZES.padding,
  },
  merchantImage: {
    width: 80,
    height: 80,
    borderRadius: SIZES.radius,
    marginRight: SIZES.padding,
  },
  merchantImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.padding,
  },
  merchantDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  merchantName: {
    ...FONTS.bold,
    fontSize: SIZES.large,
    color: COLORS.text.primary,
    marginBottom: 2,
  },
  merchantCategory: {
    ...FONTS.regular,
    fontSize: SIZES.font,
    color: COLORS.text.secondary,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    ...FONTS.medium,
    fontSize: SIZES.font,
    color: COLORS.text.primary,
    marginLeft: 2,
  },
  reviews: {
    ...FONTS.regular,
    fontSize: SIZES.small,
    color: COLORS.text.tertiary,
    marginLeft: 4,
  },
  merchantDescription: {
    ...FONTS.regular,
    fontSize: SIZES.font,
    color: COLORS.text.secondary,
    lineHeight: 22,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    marginBottom: SIZES.padding,
    ...SHADOWS.light,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.padding,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    ...FONTS.medium,
    fontSize: SIZES.font,
    color: COLORS.text.tertiary,
    marginLeft: SIZES.base,
  },
  activeTabText: {
    color: COLORS.primary,
  },
  tabContent: {
    paddingHorizontal: SIZES.padding,
  },
  backButtonText: {
    ...FONTS.medium,
    fontSize: SIZES.font,
    color: COLORS.primary,
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

export default MerchantDetailsScreen;
