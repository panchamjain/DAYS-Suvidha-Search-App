import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  Image,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { getCategoryById, getMerchantsByCategory } from '../data/mockData';
import MerchantCard from '../components/MerchantCard';

const CategoryDetailsScreen = ({ route, navigation }: any) => {
  const { categoryId } = route.params;
  const category = getCategoryById(categoryId);
  const merchants = getMerchantsByCategory(categoryId);
  
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
      
      <View style={styles.bannerContainer}>
        <Image source={category.image} style={styles.bannerImage} />
        <View style={styles.bannerOverlay} />
        <View style={styles.bannerContent}>
          <MaterialCommunityIcons name={category.icon as any} size={40} color={COLORS.white} />
          <Text style={styles.bannerTitle}>{category.name}</Text>
          <Text style={styles.bannerDescription}>{category.description}</Text>
        </View>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.merchantsTitle}>
          {merchants.length} {merchants.length === 1 ? 'Merchant' : 'Merchants'} Available
        </Text>
        
        {merchants.length > 0 ? (
          <FlatList
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
    height: 180,
    width: '100%',
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
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
  bannerTitle: {
    ...FONTS.bold,
    fontSize: SIZES.xxl,
    color: COLORS.white,
    marginTop: SIZES.base,
    textAlign: 'center',
  },
  bannerDescription: {
    ...FONTS.regular,
    fontSize: SIZES.font,
    color: COLORS.white,
    marginTop: SIZES.base,
    textAlign: 'center',
    opacity: 0.9,
  },
  content: {
    flex: 1,
    paddingHorizontal: SIZES.padding,
    paddingTop: SIZES.padding,
  },
  merchantsTitle: {
    ...FONTS.bold,
    fontSize: SIZES.large,
    color: COLORS.text.primary,
    marginBottom: SIZES.padding,
  },
  merchantsList: {
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