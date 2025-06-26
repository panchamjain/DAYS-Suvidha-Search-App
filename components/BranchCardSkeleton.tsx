import React from 'react';
import { View, StyleSheet } from 'react-native';
import ShimmerEffect from './ShimmerEffect';
import Colors from '../constants/Colors';

const BranchCardSkeleton: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <ShimmerEffect width={24} height={24} borderRadius={12} />
          <ShimmerEffect width={120} height={16} borderRadius={8} style={{ marginLeft: 12 }} />
        </View>
        <ShimmerEffect width={80} height={14} borderRadius={7} />
      </View>
      
      <ShimmerEffect width="100%" height={14} borderRadius={7} style={styles.addressSkeleton} />
      <ShimmerEffect width="70%" height={14} borderRadius={7} style={styles.addressSkeleton} />
      
      <View style={styles.divider} />
      
      <View style={styles.actionsContainer}>
        <ShimmerEffect width={40} height={40} borderRadius={20} />
        <ShimmerEffect width={40} height={40} borderRadius={20} />
        <ShimmerEffect width={40} height={40} borderRadius={20} />
        <ShimmerEffect width={40} height={40} borderRadius={20} />
      </View>
      
      <ShimmerEffect width="100%" height={40} borderRadius={8} style={{ marginTop: 16 }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressSkeleton: {
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 12,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    marginBottom: 16,
  },
});

export default BranchCardSkeleton;