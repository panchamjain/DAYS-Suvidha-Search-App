import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, StatusBar, ActivityIndicator } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import MerchantCard from '../components/MerchantCard';
import Colors from '../constants/Colors';
import { Merchant } from '../constants/MockData';
import { merchantService, MerchantFilters } from '../services/merchantService';
import { useApi } from '../hooks/useApi';

type CategoryRouteParams = {
  categoryId: string;
  categoryName: string;
};

const CategoryScreenWithAPI = () => {
  const route = useRoute<RouteProp<Record<string, CategoryRouteParams>, string>>();
  const navigation = useNavigation();
  const { categoryId, categoryName } = route.params;
  
  const [filters, setFilters] = useState<MerchantFilters>({
    categoryId,
    sortBy: 'rating',
    sortOrder: 'desc',
    page: 1,
    limit: 20,
  });

  // Using the API hook
  const { data: merchantData, loading, error, refresh } = useApi(
    () => merchantService.getMerchantsByCategory(categoryId, filters),
    [categoryId, filters]
  );

  const handleMerchantPress = (merchant: Merchant) => {
    (navigation as any).navigate('MerchantDetail', { merchant });
  };

  const handleLoadMore = () => {
    if (merchantData && filters.page) {
      const totalPages = Math.ceil(merchantData.totalCount / (filters.limit || 20));
      if (filters.page < totalPages) {
        setFilters(prev => ({ ...prev, page: (prev.page || 1) + 1 }));
      }
    }
  };

  const renderMerchant = ({ item }: { item: Merchant }) => (
    <MerchantCard
      merchant={item}
      onPress={() => handleMerchantPress(item)}
    />
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>{categoryName}</Text>
      <Text style={styles.subtitle}>
        {merchantData ? `${merchantData.totalCount} merchants found` : 'Loading...'}
      </Text>
    </View>
  );

  const renderError = () => (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>Failed to load merchants</Text>
      <Text style={styles.errorSubtext}>{error?.message}</Text>
    </View>
  );

  const renderLoading = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={Colors.primary} />
      <Text style={styles.loadingText}>Loading merchants...</Text>
    </View>
  );

  if (loading && !merchantData) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={Colors.card} barStyle="dark-content" />
        <Header title={categoryName} showBackButton />
        {renderLoading()}
      </SafeAreaView>
    );
  }

  if (error && !merchantData) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={Colors.card} barStyle="dark-content" />
        <Header title={categoryName} showBackButton />
        {renderError()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={Colors.card} barStyle="dark-content" />
      <Header title={categoryName} showBackButton />
      
      <FlatList
        data={merchantData?.merchants || []}
        keyExtractor={(item) => item.id}
        renderItem={renderMerchant}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        refreshing={loading}
        onRefresh={refresh}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: 16,
    backgroundColor: Colors.card,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textLight,
  },
  listContent: {
    paddingBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.textLight,
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
  },
});

export default CategoryScreenWithAPI;