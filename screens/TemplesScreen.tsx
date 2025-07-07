import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  SafeAreaView, 
  StatusBar, 
  TouchableOpacity,
  TextInput,
  Image
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import Colors from '../constants/Colors';
import { temples, Temple } from '../constants/TemplesData';

const { width } = Dimensions.get('window');

const TemplesScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Ancient', 'Modern', 'Heritage', 'Popular'];

  const filteredTemples = temples.filter(temple => {
    const matchesSearch = temple.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         temple.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         temple.deity.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || temple.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleTemplePress = (temple: Temple) => {
    (navigation as any).navigate('TempleDetail', { temple });
  };

  const renderTempleCard = ({ item }: { item: Temple }) => (
    <TouchableOpacity 
      style={styles.templeCard} 
      onPress={() => handleTemplePress(item)}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.mainImage }} style={styles.templeImage} />
      
      <View style={styles.templeInfo}>
        <View style={styles.templeHeader}>
          <Text style={styles.templeName} numberOfLines={1}>{item.name}</Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
        </View>
        
        <Text style={styles.templeDeity}>Deity: {item.deity}</Text>
        
        <View style={styles.locationContainer}>
          <MaterialIcons name="location-on" size={16} color={Colors.textLight} />
          <Text style={styles.templeLocation} numberOfLines={1}>{item.area}, {item.city}</Text>
        </View>
        
        <View style={styles.templeFeatures}>
          <View style={styles.featureItem}>
            <MaterialIcons name="access-time" size={14} color={Colors.primary} />
            <Text style={styles.featureText}>Open Today</Text>
          </View>
          
          {item.hasDharamshala && (
            <View style={styles.featureItem}>
              <MaterialIcons name="hotel" size={14} color={Colors.secondary} />
              <Text style={styles.featureText}>Dharamshala</Text>
            </View>
          )}
          
          {item.rating && (
            <View style={styles.featureItem}>
              <MaterialIcons name="star" size={14} color={Colors.warning} />
              <Text style={styles.featureText}>{item.rating}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderCategoryFilter = () => (
    <View style={styles.categoryContainer}>
      <FlatList
        data={categories}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.categoryButton,
              selectedCategory === item && styles.selectedCategoryButton
            ]}
            onPress={() => setSelectedCategory(item)}
          >
            <Text style={[
              styles.categoryButtonText,
              selectedCategory === item && styles.selectedCategoryButtonText
            ]}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.categoryList}
      />
    </View>
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.screenTitle}>Temples of Ahmedabad</Text>
      <Text style={styles.screenSubtitle}>
        Discover {filteredTemples.length} sacred places in the city
      </Text>
      
      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={20} color={Colors.textLight} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search temples, areas, or deities..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={Colors.textLight}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <MaterialIcons name="clear" size={20} color={Colors.textLight} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="account-balance" size={64} color={Colors.textLight} />
      <Text style={styles.emptyText}>No temples found</Text>
      <Text style={styles.emptySubtext}>
        Try adjusting your search or filter criteria
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={Colors.card} barStyle="dark-content" />
      <Header title="Temples" showBackButton />
      
      <FlatList
        data={filteredTemples}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderTempleCard}
        ListHeaderComponent={
          <>
            {renderHeader()}
            {renderCategoryFilter()}
          </>
        }
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    paddingBottom: 24,
  },
  headerContainer: {
    padding: 20,
    backgroundColor: Colors.card,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 16,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  screenSubtitle: {
    fontSize: 16,
    color: Colors.textLight,
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    marginLeft: 12,
  },
  categoryContainer: {
    marginBottom: 16,
  },
  categoryList: {
    paddingHorizontal: 16,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.card,
    marginRight: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedCategoryButton: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  selectedCategoryButtonText: {
    color: 'white',
  },
  templeCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  templeImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  templeInfo: {
    padding: 16,
  },
  templeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  templeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    flex: 1,
    marginRight: 12,
  },
  categoryBadge: {
    backgroundColor: `${Colors.primary}15`,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
  },
  templeDeity: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 8,
    fontWeight: '500',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  templeLocation: {
    fontSize: 14,
    color: Colors.text,
    marginLeft: 6,
    flex: 1,
  },
  templeFeatures: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${Colors.background}80`,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  featureText: {
    fontSize: 12,
    color: Colors.text,
    marginLeft: 4,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    minHeight: 300,
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

export default TemplesScreen;
