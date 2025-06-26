import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import ShimmerEffect from './ShimmerEffect';
import Colors from '../constants/Colors';

const MerchantCardSkeleton: React.FC = () => {
  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.leftSection}>
          <ShimmerEffect width={56} height={56} borderRadius={16} />
        </View>
        
        <View style={styles.middleSection}>
          <View style={styles.header}>
            <ShimmerEffect width="70%" height={16} borderRadius={8} />
            <ShimmerEffect width={50} height={24} borderRadius={12} />
          </View>
          
          <ShimmerEffect width="60%" height={24} borderRadius={12} style={styles.discountSkeleton} />
          
          <View style={styles.addressContainer}>
            <ShimmerEffect width={14} height={14} borderRadius={7} />
            <ShimmerEffect width="80%" height={12} borderRadius={6} style={{ marginLeft: 8 }} />
          </View>

          <View style={styles.branchInfo}>
            <ShimmerEffect width={80} height={20} borderRadius={8} />
            <ShimmerEffect width={60} height={16} borderRadius={8} />
          </View>
        </View>
      </View>
      
      <View style={styles.cardFooter}>
        <View style={styles.tagContainer}>
          <ShimmerEffect width={60} height={24} borderRadius={8} />
          <ShimmerEffect width={80} height={24} borderRadius={8} style={{ marginLeft: 8 }} />
        </View>
        <ShimmerEffect width={28} height={28} borderRadius={14} />
      </View>
    </View>
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
  middleSection: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  discountSkeleton: {
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  branchInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    alignItems: 'center',
  },
});

export default MerchantCardSkeleton;
