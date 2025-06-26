import React from 'react';
import { View, StyleSheet } from 'react-native';
import ShimmerEffect from './ShimmerEffect';
import Colors from '../constants/Colors';

const MerchantCardSkeleton: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <ShimmerEffect width="100%" height="100%" borderRadius={0} />
      </View>
      
      <View style={styles.content}>
        <ShimmerEffect width="80%" height={16} borderRadius={8} style={styles.titleSkeleton} />
        
        <View style={styles.ratingContainer}>
          <ShimmerEffect width={60} height={14} borderRadius={7} />
        </View>
        
        <ShimmerEffect width="100%" height={12} borderRadius={6} style={styles.descriptionSkeleton} />
        <ShimmerEffect width="70%" height={12} borderRadius={6} style={styles.descriptionSkeleton} />
        
        <View style={styles.locationContainer}>
          <ShimmerEffect width={14} height={14} borderRadius={7} />
          <ShimmerEffect width="60%" height={12} borderRadius={6} style={{ marginLeft: 8 }} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: Colors.card,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    flexDirection: 'row',
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  imageContainer: {
    width: 110,
    height: 110,
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  titleSkeleton: {
    marginBottom: 8,
  },
  ratingContainer: {
    marginBottom: 8,
  },
  descriptionSkeleton: {
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
});

export default MerchantCardSkeleton;