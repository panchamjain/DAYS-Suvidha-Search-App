import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import ShimmerEffect from './ShimmerEffect';
import Colors from '../constants/Colors';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

const CategoryCardSkeleton: React.FC = () => {
  return (
    <View style={styles.card}>
      <ShimmerEffect width={64} height={64} borderRadius={32} style={styles.iconSkeleton} />
      <ShimmerEffect width="80%" height={16} borderRadius={8} style={styles.titleSkeleton} />
      <ShimmerEffect width="100%" height={12} borderRadius={6} style={styles.descriptionSkeleton} />
      <ShimmerEffect width="70%" height={12} borderRadius={6} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    width: cardWidth,
    margin: 8,
    alignItems: 'center',
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  iconSkeleton: {
    marginBottom: 16,
  },
  titleSkeleton: {
    marginBottom: 8,
  },
  descriptionSkeleton: {
    marginBottom: 4,
  },
});

export default CategoryCardSkeleton;