import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  SafeAreaView,
  StatusBar
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { merchants } from '../data/mockData';
import MerchantCard from '../components/MerchantCard';

const AllMerchantsScreen = ({ navigation }: any) => {
  const [sortBy, setSortBy] = useState('name'); // 'name', 'rating', 'discount'
  
  const getSortedMerchants = () => {
    if (sortBy === 'name') {
      return [...merchants].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'rating') {
      return [...merchants].sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'discount') {
      return [...merchants].sort((a, b) => {
        const maxDiscountA = Math.max(...a.discounts.map(d => d.percentage));
        const maxDiscountB = Math.max(...b.discounts.map(d => d.percentage));
        return maxDiscountB - maxDiscountA;
      });
    }
    return merchants;
  };
  
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
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Merchants</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Sort by:</Text>
        
        <View style={styles.sortButtons}>
          <TouchableOpacity 
            style={[
              styles.sortButton,
              sortBy === 'name' && styles.activeSortButton
            ]}
            onPress={() => setSortBy('name')}
          >
            <Text 
              style={[
                styles.sortButtonText,
                sortBy === 'name' && styles.activeSortButtonText
              ]}
            >
              Name
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.sortButton,
              sortBy === 'rating' && styles.activeSortButton
            ]}
            onPress={() => setSortBy('rating')}
          >
            <Text 
              style={[
                styles.sortButtonText,
                sortBy === 'rating' && styles.activeSortButtonText
              ]}
            >
              Rating
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.sortButton,
              sortBy === 'discount' && styles.activeSortButton
            ]}
            onPress={() => setSortBy('discount')}
          >
            <Text 
              style={[
                styles.sortButtonText,
                sortBy === 'discount' && styles.activeSortButtonText
              ]}
            >
              Discount
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <FlatList
        data={getSortedMerchants()}
        renderItem={renderMerchantItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.merchantsList}
      />
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
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  headerTitle: {
    ...FONTS.bold,
    fontSize: SIZES.large,
    color: COLORS.text.primary,
  },
  backButton: {
    padding: 4,
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.base,
    marginBottom: SIZES.padding,
  },
  sortLabel: {
    ...FONTS.medium,
    fontSize: SIZES.font,
    color: COLORS.text.secondary,
    marginRight: SIZES.padding,
  },
  sortButtons: {
    flexDirection: 'row',
    flex: 1,
  },
  sortButton: {
    paddingVertical: SIZES.base,
    paddingHorizontal: SIZES.padding,
    borderRadius: SIZES.radius,
    marginRight: SIZES.base,
  },
  activeSortButton: {
    backgroundColor: COLORS.primary,
  },
  sortButtonText: {
    ...FONTS.medium,
    fontSize: SIZES.font,
    color: COLORS.text.secondary,
  },
  activeSortButtonText: {
    color: COLORS.white,
  },
  merchantsList: {
    paddingHorizontal: SIZES.padding,
    paddingBottom: 100,
  },
});

export default AllMerchantsScreen;