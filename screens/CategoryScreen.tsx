import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, StatusBar } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import Header from '../components/Header';
import MerchantCard from '../components/MerchantCard';
import MerchantCardSkeleton from '../components/MerchantCardSkeleton';
import Colors from '../constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useMerchantsByCategory } from '../hooks/useApi';

type CategoryRouteParams = {
  categoryId: string;
  categoryName: string;
};

const CategoryScreen = () => {
  const route = useRoute<RouteProp<Record<string, CategoryRouteParams>, string>>();
  const { categoryId, categoryName } = route.params;

  console.log('CategoryScreen params:', { categoryId, categoryName });

  const { data: merchantData, loading, error } = useMerchantsByCategory(categoryId);

  const merchants = merchantData?.results || [];

  const renderMerchant = ({ item }: { item: any }) => (
    <MerchantCard
      merchant={item}
      onPress={() => {
        // Handle merchant press
        console.log('Merchant pressed:', item);
      }}
    />
  );

  const renderMerchantSkeleton = ({ item }: { item: number }) => (
    <MerchantCardSkeleton key={item} />
  );

  const renderError = () => (
    <View style={styles.errorContainer}>
      <MaterialIcons name="error-outline" size={48} color={Colors.textLight} />
      <Text style={styles.errorText}>Failed to load merchants</Text>
      <Text style={styles.errorSubtext}>Please check your internet connection</Text>
      <Text style={styles.debugText}>Error: {error?.message}</Text>
    </View>
  );

  const renderShimmerLoading = () => (
    <FlatList
      data={[1, 2, 3, 4, 5]}
      keyExtractor={(item) => `skeleton-${item}`}
      renderItem={renderMerchantSkeleton}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="store-mall-directory" size={64} color={Colors.textLight} />
      <Text style={styles.emptyText}>No merchants found</Text>
      <Text style={styles.emptySubtext}>
        No merchants are available in this category at the moment.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={Colors.card} barStyle="dark-content" />
      <Header title={categoryName || 'Category'} showBackButton />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{categoryName}</Text>
        <Text style={styles.headerSubtitle}>
          {loading 
            ? 'Loading merchants...' 
            : `${merchants.length} ${merchants.length === 1 ? 'merchant' : 'merchants'} available`
          }
        </Text>
      </View>
      
      {loading ? renderShimmerLoading() : error ? renderError() : merchants.length === 0 ? renderEmptyState() : (
        <FlatList
          data={merchants}
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
          renderItem={renderMerchant}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.textLight,
  },
  listContent: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    paddingBottom: 24,
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
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
    marginBottom: 8,
  },
  debugText: {
    fontSize: 12,
    color: Colors.warning,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default CategoryScreen;
