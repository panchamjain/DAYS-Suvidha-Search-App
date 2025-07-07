
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  SafeAreaView, 
  StatusBar, 
  TouchableOpacity,
  Image,
  Linking
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import Colors from '../constants/Colors';
import { daysEvents, DaysEvent } from '../constants/TemplesData';

const DaysEventsScreen = () => {
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Workshop', 'Networking', 'Cultural', 'Business', 'Community'];

  const filteredEvents = daysEvents.filter(event => {
    return selectedCategory === 'All' || event.category === selectedCategory;
  });

  const handleEventPress = (event: DaysEvent) => {
    (navigation as any).navigate('EventDetail', { event });
  };

  const handleRegister = (event: DaysEvent) => {
    if (event.registrationLink) {
      Linking.openURL(event.registrationLink);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Upcoming': return Colors.primary;
      case 'Ongoing': return Colors.secondary;
      case 'Completed': return Colors.textLight;
      case 'Cancelled': return Colors.warning;
      default: return Colors.textLight;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Workshop': return 'school';
      case 'Networking': return 'people';
      case 'Cultural': return 'celebration';
      case 'Business': return 'business';
      case 'Community': return 'groups';
      default: return 'event';
    }
  };

  const renderEventCard = ({ item }: { item: DaysEvent }) => (
    <TouchableOpacity 
      style={styles.eventCard} 
      onPress={() => handleEventPress(item)}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.image }} style={styles.eventImage} />
      
      <View style={styles.eventInfo}>
        <View style={styles.eventHeader}>
          <View style={styles.categoryContainer}>
            <MaterialIcons 
              name={getCategoryIcon(item.category) as any} 
              size={16} 
              color={Colors.primary} 
            />
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
          
          <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(item.status)}15` }]}>
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
              {item.status}
            </Text>
          </View>
        </View>
        
        <Text style={styles.eventTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.eventDescription} numberOfLines={2}>{item.description}</Text>
        
        <View style={styles.eventDetails}>
          <View style={styles.detailItem}>
            <MaterialIcons name="event" size={16} color={Colors.textLight} />
            <Text style={styles.detailText}>{formatDate(item.date)}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <MaterialIcons name="access-time" size={16} color={Colors.textLight} />
            <Text style={styles.detailText}>{item.time}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <MaterialIcons name="location-on" size={16} color={Colors.textLight} />
            <Text style={styles.detailText} numberOfLines={1}>{item.venue}</Text>
          </View>
        </View>
        
        <View style={styles.eventFooter}>
          <View style={styles.priceContainer}>
            {item.isFree ? (
              <Text style={styles.freeText}>Free</Text>
            ) : (
              <Text style={styles.priceText}>₹{item.price}</Text>
            )}
          </View>
          
          {item.isRegistrationRequired && item.status === 'Upcoming' && (
            <TouchableOpacity 
              style={styles.registerButton}
              onPress={() => handleRegister(item)}
            >
              <Text style={styles.registerButtonText}>Register</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {item.maxParticipants && item.currentParticipants && (
          <View style={styles.participantsContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${(item.currentParticipants / item.maxParticipants) * 100}%` }
                ]} 
              />
            </View>
            <Text style={styles.participantsText}>
              {item.currentParticipants}/{item.maxParticipants} registered
            </Text>
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
      <Text style={styles.screenTitle}>DAYS Events</Text>
      <Text style={styles.screenSubtitle}>
        Join our community events and workshops
      </Text>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="event-busy" size={64} color={Colors.textLight} />
      <Text style={styles.emptyText}>No events found</Text>
      <Text style={styles.emptySubtext}>
        Check back later for upcoming events
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={Colors.card} barStyle="dark-content" />
      <Header title="DAYS Events" showBackButton />
      
      <FlatList
        data={filteredEvents}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderEventCard}
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
  eventCard: {
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
  eventImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  eventInfo: {
    padding: 16,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${Colors.primary}15`,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
    marginLeft: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  eventDescription: {
    fontSize: 14,
    color: Colors.textLight,
    lineHeight: 20,
    marginBottom: 12,
  },
  eventDetails: {
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    color: Colors.text,
    marginLeft: 8,
    flex: 1,
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  priceContainer: {
    flex: 1,
  },
  freeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.secondary,
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  registerButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  registerButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  participantsContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.secondary,
    borderRadius: 2,
  },
  participantsText: {
    fontSize: 12,
    color: Colors.textLight,
    textAlign: 'right',
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

export default DaysEventsScreen;
