import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import { Merchant } from '../constants/MockData';

interface MerchantCardProps {
  merchant: Merchant;
  onPress: () => void;
}

const MerchantCard: React.FC<MerchantCardProps> = ({ merchant, onPress }) => {
  // Safe access to merchant properties with fallbacks
  const merchantName = merchant.name || 'Unknown Merchant';
  const merchantRating = typeof merchant.rating === 'number' ? merchant.rating : 0;
  const merchantDiscount = merchant.discount || 'No discount available';
  const merchantAddress = merchant.address || 'Address not available';
  const merchantBranches = merchant.branch_count || 1;
  const merchantEstablished = merchant.establishedYear;

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={onPress} 
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        <View style={styles.leftSection}>
          <View style={styles.iconContainer}>
            <Text style={styles.iconText}>{merchantName.charAt(0).toUpperCase()}</Text>
          </View>
        </View>
        
        <View style={styles.middleSection}>
          <View style={styles.header}>
            <Text style={styles.name}>{merchantName}</Text>
            {merchantRating > 0 && (
              <View style={styles.ratingContainer}>
                <MaterialIcons name="star" size={16} color={Colors.warning} />
                <Text style={styles.rating}>{merchantRating.toFixed(1)}</Text>
              </View>
            )}
          </View>
          
          <View style={styles.discountContainer}>
            <MaterialIcons name="local-offer" size={16} color="white" />
            <Text style={styles.discount}>{merchantDiscount}</Text>
          </View>
          
          <View style={styles.addressContainer}>
            <MaterialIcons name="location-on" size={14} color={Colors.textLight} />
            <Text style={styles.address} numberOfLines={1}>{merchantAddress}</Text>
          </View>

          {/* Branch Information */}
          <View style={styles.branchInfo}>
            <View style={styles.branchContainer}>
              <MaterialIcons name="store" size={14} color={Colors.primary} />
              <Text style={styles.branchText}>
                {merchantBranches} {merchantBranches === 1 ? 'Branch' : 'Branches'}
              </Text>
            </View>
            {merchantEstablished && (
              <View style={styles.establishedContainer}>
                <MaterialIcons name="event" size={14} color={Colors.textLight} />
                <Text style={styles.establishedText}>Est. {merchantEstablished}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
      
      <View style={styles.cardFooter}>
        <View style={styles.tagContainer}>
          <View style={[styles.tag, { backgroundColor: `${Colors.primary}15` }]}>
            <Text style={styles.tagText}>Verified</Text>
          </View>
          {merchantBranches > 1 && (
            <View style={[styles.tag, { backgroundColor: `${Colors.secondary}15` }]}>
              <Text style={[styles.tagText, { color: Colors.secondary }]}>Multi-Branch</Text>
            </View>
          )}
        </View>
        <View style={styles.arrowContainer}>
          <MaterialIcons name="arrow-forward-ios" size={16} color={Colors.primary} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    marginVertical: 8,
    marginHorizontal: 16,
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
  cardContent: {
    padding: 16,
    flexDirection: 'row',
  },
  leftSection: {
    marginRight: 16,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: `${Colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  middleSection: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
    marginRight: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${Colors.warning}15`,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.warning,
    marginLeft: 4,
  },
  discountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  discount: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    marginLeft: 6,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  address: {
    fontSize: 13,
    color: Colors.textLight,
    marginLeft: 4,
    flex: 1,
  },
  branchInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  branchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${Colors.primary}08`,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  branchText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.primary,
    marginLeft: 4,
  },
  establishedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  establishedText: {
    fontSize: 12,
    color: Colors.textLight,
    marginLeft: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: `${Colors.background}50`,
  },
  tagContainer: {
    flexDirection: 'row',
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.primary,
  },
  arrowContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: `${Colors.primary}10`,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MerchantCard;
