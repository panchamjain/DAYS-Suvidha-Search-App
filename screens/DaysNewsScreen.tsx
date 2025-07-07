
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  SafeAreaView, 
  StatusBar, 
  TouchableOpacity,
  Image
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import Colors from '../constants/Colors';
import { daysNews, DaysNews } from '../constants/TemplesData';

const DaysNewsScreen = () => {
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Announcement', 'Partnership', 'Update', 'Achievement', 'Community'];

  const filteredNews = daysNews.filter(news => {
    return selectedCategory === 'All' || news.category === selectedCategory;
  });

  const handleNewsPress = (news: DaysNews) => {
    (navigation as any).navigate('NewsDetail', { news });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Announcement': return Colors.primary;
      case 'Partnership': return Colors.secondary;
      case 'Update': return Colors.info;
      case 'Achievement': return Colors.warning;
      case 'Community': return '#9C27B0';
      default: return Colors.textLight;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Announcement': return 'campaign';
      case 'Partnership': return 'handshake';
      case 'Update': return 'system-update';
      case 'Achievement': return 'emoji-events';
      case 'Community': return 'groups';
      default: return 'article';
    }
  };

  const renderNewsCard = ({ item }: { item: DaysNews }) => (
    <TouchableOpacity 
      style={styles.newsCard} 
      onPress={() => handleNewsPress(item)}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.image }} style={styles.newsImage} />
      
      <View style={styles.newsInfo}>
        <View style={styles.newsHeader}>
          <View style={[styles.categoryContainer, { backgroundColor: `${getCategoryColor(item.category)}15` }]}>
            <MaterialIcons 
              name={getCategoryIcon(item.category) as any} 
              size={16} 
              color={getCategoryColor(item.category)} 
            />
            <Text style={[styles.categoryText, { color: getCategoryColor(item.category) }]}>
              {item.category}
            </Text>
          </View>
          
          {item.isImportant && (
            <View style={styles.importantBadge}>
              <MaterialIcons name="priority-high" size={16} color={Colors.warning} />
            </View>
          )}
        </View>
        
        <Text style={styles.newsTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.newsSummary} numberOfLines={3}>{item.summary}</Text>
        
        <View style={styles.newsFooter}>
          <View style={styles.authorInfo}>
            <MaterialIcons name="person" size={16} color={Colors.textLight} />
            <Text style={styles.authorText}>{item.author}</Text>
          </View>
          
          <View style={styles.metaInfo}>
            <View style={styles.metaItem}>
              <MaterialIcons name="schedule" size={14} color={Colors.textLight} />
              <Text style={styles.metaText}>{item.readTime} min read</Text>
            </View>
            
            <View style={styles.metaItem}>
              <MaterialIcons name="event" size={14} color={Colors.textLight} />
              <Text style={styles.metaText}>{formatDate(item.publishedDate)}</Text>
            </View>
            
            {item.views && (
              <View style={styles.metaItem}>
                <MaterialIcons name="visibility" size={14} color={Colors.textLight} />
                <Text style={styles.metaText}>{item.views}</Text>
              </View>
            )}
          </View>
        </View>
        
        {item.tags && item.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {item.tags.slice(0, 3).map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderCategoryFilter = () => (
    <View style={styles.categoryFilterContainer}>
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
      <Text style={styles.screenTitle}>DAYS News</Text>
      <Text style={styles.screenSubtitle}>
        Stay updated with the latest from DAYS Ahmedabad
      </Text>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="article" size={64} color={Colors.textLight} />
      <Text style={styles.emptyText}>No news found</Text>
      <Text style={styles.emptySubtext}>
        Check back later for the latest updates
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={Colors.card} barStyle="dark-content" />
      <Header title="DAYS News" showBackButton />
      
      <FlatList
        data={filteredNews}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderNewsCard}
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
  },
  categoryFilterContainer: {
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
  newsCard: {
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
  newsImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  newsInfo: {
    padding: 16,
  },
  newsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  importantBadge: {
    backgroundColor: `${Colors.warning}15`,
    padding: 4,
    borderRadius: 8,
  },
  newsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
    lineHeight: 24,
  },
  newsSummary: {
    fontSize: 14,
    color: Colors.textLight,
    lineHeight: 20,
    marginBottom: 16,
  },
  newsFooter: {
    marginBottom: 12,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  authorText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
    marginLeft: 6,
  },
  metaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: Colors.textLight,
    marginLeft: 4,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: `${Colors.background}80`,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    color: Colors.primary,
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

export default DaysNewsScreen;
