import * as React from 'react';
import { StyleSheet, TouchableOpacity, View, Text, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SHADOWS, SIZES } from '../constants/theme';
import { Merchant } from '../data/mockData';

interface MerchantCardProps {
  merchant: Merchant;
  onPress: () => void;
}

const MerchantCard: React.FC<MerchantCardProps> = ({ merchant, onPress }) => {
  // Get the highest discount percentage
  const highestDiscount = merchant.discounts.reduce(
    (max, discount) => (discount.percentage > max ? discount.percentage : max),
    0
  );

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.imageContainer}>
        {merchant.image ? (
          <Image source={merchant.image} style={styles.image} />
        ) : (
          <View style={styles.placeholderImage}>
            <MaterialCommunityIcons 
              name={merchant.category === 'Restaurants' ? 'food' : 
                    merchant.category === 'Healthcare' ? 'hospital' :
                    merchant.category === 'Shopping' ? 'shopping' :
                    merchant.category === 'Entertainment' ? 'movie' : 'school'} 
              size={32} 
              color={COLORS.primary} 
            />
          </View>
        )}
        {highestDiscount > 0 && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{highestDiscount}% OFF</Text>
          </View>
        )}
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{merchant.name}</Text>
        
        <View style={styles.ratingContainer}>
          <MaterialCommunityIcons name="star" size={16} color={COLORS.secondary} />
          <Text style={styles.rating}>{merchant.rating.toFixed(1)}</Text>
          <Text style={styles.reviews}>({merchant.reviews})</Text>
        </View>
        
        <Text style={styles.description} numberOfLines={2}>
          {merchant.description}
        </Text>
        
        <View style={styles.locationContainer}>
          <MaterialCommunityIcons name="map-marker" size={14} color={COLORS.gray} />
          <Text style={styles.location} numberOfLines={1}>
            {merchant.locations[0].area}, {merchant.locations[0].city}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.padding,
    overflow: 'hidden',
    flexDirection: 'row',
    ...SHADOWS.medium,
  },
  imageContainer: {
    width: 110,
    height: 110,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  discountBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: COLORS.tertiary,
    paddingHorizontal: SIZES.base,
    paddingVertical: 2,
    borderBottomLeftRadius: SIZES.base,
  },
  discountText: {
    ...FONTS.bold,
    fontSize: 10,
    color: COLORS.white,
  },
  content: {
    flex: 1,
    padding: SIZES.padding,
    justifyContent: 'center',
  },
  title: {
    ...FONTS.bold,
    fontSize: SIZES.medium,
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  rating: {
    ...FONTS.medium,
    fontSize: SIZES.small,
    color: COLORS.text.primary,
    marginLeft: 2,
  },
  reviews: {
    ...FONTS.regular,
    fontSize: SIZES.small,
    color: COLORS.text.tertiary,
    marginLeft: 2,
  },
  description: {
    ...FONTS.regular,
    fontSize: SIZES.small,
    color: COLORS.text.secondary,
    marginBottom: 6,
    lineHeight: 18,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    ...FONTS.regular,
    fontSize: SIZES.small,
    color: COLORS.text.tertiary,
    marginLeft: 2,
  },
});

export default MerchantCard;
