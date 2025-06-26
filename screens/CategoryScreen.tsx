import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, StatusBar, ActivityIndicator } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import MerchantCard from '../components/MerchantCard';
import Colors from '../constants/Colors';
import { Merchant } from '../constants/MockData';
import { useMerchantsByCategory } from '../hooks/useApi';
import { MerchantListResponse } from '../services/merchantService';
import { MaterialIcons } from '@expo/vector-icons';

type CategoryRouteParams = {
  categoryId: string;
  categoryName: string;
};

const CategoryScreen = () => {
  const route = useRoute<RouteProp<Record<string, CategoryRouteParams>, string>>();
  const navigation = useNavigation();
  const { categoryId, categoryName } = route.params;
  
  // Debug logging
  useEffect(() => {
    console.log('CategoryScreen params:', { categoryId, categoryName });
  }, [categoryId, categoryName]);

  const { data: merchantData, loading, error, refresh } = useMerchantsByCategory(categoryId);

  // Type assertion for merchantData and detailed logging
  const typedMerchantData = merchantData as MerchantListResponse | null;
  
  useEffect(() => {
    console.log('Merchant data received:', typedMerchantData);
    if (typedMerchantData) {
      console.log('Merchant count:', typedMerchantData.count);
      console.log('Merchant results length:', typedMerchantData.results?.length);
      console.log('First merchant:', typedMerchantData.results?.[0]);
    }
  }, [typedMerchantData]);

  const handleMerchantPress = (merchant: Merchant) => {
    (navigation as any).navigate('MerchantDetail', { merchant });
  };

  const renderMerchant = ({ item }: { item: Merchant }) => (
    <MerchantCard
      merchant={item}
      onPress={() => handleMerchantPress(item)}
    />
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>{categoryName || 'Category'}</Text>
      <Text style={styles.subtitle}>
        {typedMerchantData ? `${typedMerchantData.count || 0} merchants found` : 'Loading...'}
      </Text>
      {/* Debug info */}
      {__DEV__ && typedMerchantData && (
        <Text style={styles.debugText}>
          Debug: Results array length: {typedMerchantData.results?.length || 0}
        </Text>
      )}
    </View>
  );

  const renderError = () => (
    <View style={styles.errorContainer}>
      <MaterialIcons name="error-outline" size={48} color={Colors.textLight} />
      <Text style={styles.errorText}>Failed to load merchants</Text>
      <Text style={styles.errorSubtext}>
        {error?.message || 'Please check your internet connection'}
      </Text>
      {!categoryId && (
        <Text style={styles.debugText}>Debug: Category ID is missing</Text>
      )}
    </View>
  );

  const renderLoading = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={Colors.primary} />
      <Text style={styles.loadingText}>Loading merchants...</Text>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="store-mall-directory" size={48} color={Colors.textLight} />
      <Text style={styles.emptyText}>No merchants found</Text>
      <Text style={styles.emptySubtext}>Try checking other categories</Text>
      {/* Debug info */}
      {__DEV__ && (
        <View style={styles.debugContainer}>
          <Text style={styles.debugText}>Debug Info:</Text>
          <Text style={styles.debugText}>Category ID: {categoryId}</Text>
          <Text style={styles.debugText}>Loading: {loading.toString()}</Text>
          <Text style={styles.debugText}>Error: {error?.message || 'None'}</Text>
          <Text style={styles.debugText}>Data: {typedMerchantData ? 'Present' : 'Null'}</Text>
          {typedMerchantData && (
            <>
              <Text style={styles.debugText}>Count: {typedMerchantData.count}</Text>
              <Text style={styles.debugText}>Results length: {typedMerchantData.results?.length || 0}</Text>
            </>
          )}
        </View>
      )}
    </View>
  );

  // Handle missing categoryId
  if (!categoryId || categoryId === 'undefined') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={Colors.card} barStyle="dark-content" />
        <Header title={categoryName || 'Category'} showBackButton />
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={48} color={Colors.textLight} />
          <Text style={styles.errorText}>Invalid Category</Text>
          <Text style={styles.errorSubtext}>Category information is missing</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (loading && !typedMerchantData) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={Colors.card} barStyle="dark-content" />
        <Header title={categoryName || 'Category'} showBackButton />
        {renderLoading()}
      </SafeAreaView>
    );
  }

  if (error && !typedMerchantData) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={Colors.card} barStyle="dark-content" />
        <Header title={categoryName || 'Category'} showBackButton />
        {renderError()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={Colors.card} barStyle="dark-content" />
      <Header title={categoryName || 'Category'} showBackButton />
      
      <FlatList
        data={typedMerchantData?.results || []}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        renderItem={renderMerchant}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={!loading ? renderEmpty : null}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
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
    marginTop: 4,
  },
  debugContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: `${Colors.warning}10`,
    borderRadius: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    minHeight: 300,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
  },
});

export default CategoryScreen;
