
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  StatusBar, 
  ScrollView, 
  TouchableOpacity,
  Image,
  Linking,
  Dimensions,
  FlatList
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRoute, RouteProp } from '@react-navigation/native';
import Header from '../components/Header';
import Colors from '../constants/Colors';
import { Temple } from '../constants/TemplesData';

const { width } = Dimensions.get('window');

type TempleDetailRouteParams = {
  temple: Temple;
};

const TempleDetailScreen = () => {
  const route = useRoute<RouteProp<Record<string, TempleDetailRouteParams>, string>>();
  const { temple } = route.params;
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const allImages = [temple.mainImage, ...temple.additionalImages];

  const handleCall = () => {
    if (temple.contact) {
      Linking.openURL(`tel:${temple.contact}`);
    }
  };

  const handleDirections = () => {
    const { latitude, longitude } = temple.coordinates;
    Linking.openURL(`https://maps.google.com/?q=${latitude},${longitude}`);
  };

  const handleWebsite = () => {
    if (temple.website) {
      const url = temple.website.startsWith('http') ? temple.website : `https://${temple.website}`;
      Linking.openURL(url);
    }
  };

  const renderImageGallery = () => (
    <View style={styles.imageGallery}>
      <Image 
        source={{ uri: allImages[selectedImageIndex] }} 
        style={styles.mainImage} 
      />
      
      {allImages.length > 1 && (
        <FlatList
          data={allImages}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={[
                styles.thumbnailContainer,
                selectedImageIndex === index && styles.selectedThumbnail
              ]}
              onPress={() => setSelectedImageIndex(index)}
            >
              <Image source={{ uri: item }} style={styles.thumbnail} />
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.thumbnailList}
        />
      )}
    </View>
  );

  const renderQuickActions = () => (
    <View style={styles.quickActions}>
      <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
        <View style={[styles.actionIcon, { backgroundColor: `${Colors.primary}15` }]}>
          <MaterialIcons name="phone" size={22} color={Colors.primary} />
        </View>
        <Text style={styles.actionText}>Call</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.actionButton} onPress={handleDirections}>
        <View style={[styles.actionIcon, { backgroundColor: `${Colors.secondary}15` }]}>
          <MaterialIcons name="directions" size={22} color={Colors.secondary} />
        </View>
        <Text style={styles.actionText}>Directions</Text>
      </TouchableOpacity>
      
      {temple.website && (
        <TouchableOpacity style={styles.actionButton} onPress={handleWebsite}>
          <View style={[styles.actionIcon, { backgroundColor: `${Colors.info}15` }]}>
            <MaterialIcons name="language" size={22} color={Colors.info} />
          </View>
          <Text style={styles.actionText}>Website</Text>
        </TouchableOpacity>
      )}
      
      <TouchableOpacity style={styles.actionButton}>
        <View style={[styles.actionIcon, { backgroundColor: `${Colors.warning}15` }]}>
          <MaterialIcons name="share" size={22} color={Colors.warning} />
        </View>
        <Text style={styles.actionText}>Share</Text>
      </TouchableOpacity>
    </View>
  );

  const renderBasicInfo = () => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <MaterialIcons name="info-outline" size={24} color={Colors.primary} />
        <Text style={styles.cardTitle}>Temple Information</Text>
      </View>
      
      <View style={styles.infoGrid}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Deity</Text>
          <Text style={styles.infoValue}>{temple.deity}</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Category</Text>
          <Text style={styles.infoValue}>{temple.category}</Text>
        </View>
        
        {temple.establishedYear && (
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Established</Text>
            <Text style={styles.infoValue}>{temple.establishedYear}</Text>
          </View>
        )}
        
        {temple.rating && (
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Rating</Text>
            <View style={styles.ratingContainer}>
              <MaterialIcons name="star" size={16} color={Colors.warning} />
              <Text style={styles.infoValue}>{temple.rating}</Text>
            </View>
          </View>
        )}
      </View>
      
      <Text style={styles.description}>{temple.description}</Text>
    </View>
  );

  const renderTimings = () => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <MaterialIcons name="access-time" size={24} color={Colors.primary} />
        <Text style={styles.cardTitle}>Timings</Text>
      </View>
      
      <View style={styles.timingItem}>
        <Text style={styles.timingLabel}>Morning</Text>
        <Text style={styles.timingValue}>{temple.timings.morning}</Text>
      </View>
      
      <View style={styles.timingItem}>
        <Text style={styles.timingLabel}>Evening</Text>
        <Text style={styles.timingValue}>{temple.timings.evening}</Text>
      </View>
      
      {temple.timings.aarti && (
        <>
          <View style={styles.divider} />
          <Text style={styles.aartiTitle}>Aarti Timings</Text>
          
          {temple.timings.aarti.morning && (
            <View style={styles.timingItem}>
              <Text style={styles.timingLabel}>Morning Aarti</Text>
              <Text style={styles.timingValue}>{temple.timings.aarti.morning}</Text>
            </View>
          )}
          
          {temple.timings.aarti.evening && (
            <View style={styles.timingItem}>
              <Text style={styles.timingLabel}>Evening Aarti</Text>
              <Text style={styles.timingValue}>{temple.timings.aarti.evening}</Text>
            </View>
          )}
        </>
      )}
    </View>
  );

  const renderDharamshala = () => {
    if (!temple.hasDharamshala) return null;

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <MaterialIcons name="hotel" size={24} color={Colors.primary} />
          <Text style={styles.cardTitle}>Dharamshala Facilities</Text>
        </View>
        
        {temple.dharamshalaDetails && (
          <>
            <View style={styles.dharamshalaInfo}>
              <View style={styles.dharamshalaItem}>
                <MaterialIcons name="meeting-room" size={20} color={Colors.secondary} />
                <Text style={styles.dharamshalaText}>
                  {temple.dharamshalaDetails.rooms} Rooms Available
                </Text>
              </View>
              
              <View style={styles.dharamshalaItem}>
                <MaterialIcons name="person" size={20} color={Colors.secondary} />
                <Text style={styles.dharamshalaText}>
                  Contact: {temple.dharamshalaDetails.contactPerson}
                </Text>
              </View>
              
              <View style={styles.dharamshalaItem}>
                <MaterialIcons name="phone" size={20} color={Colors.secondary} />
                <Text style={styles.dharamshalaText}>
                  {temple.dharamshalaDetails.contact}
                </Text>
              </View>
              
              {temple.dharamshalaDetails.charges && (
                <View style={styles.dharamshalaItem}>
                  <MaterialIcons name="attach-money" size={20} color={Colors.secondary} />
                  <Text style={styles.dharamshalaText}>
                    {temple.dharamshalaDetails.charges}
                  </Text>
                </View>
              )}
              
              {temple.dharamshalaDetails.bookingRequired && (
                <View style={styles.bookingNotice}>
                  <MaterialIcons name="event" size={16} color={Colors.warning} />
                  <Text style={styles.bookingText}>Prior booking required</Text>
                </View>
              )}
            </View>
          </>
        )}
      </View>
    );
  };

  const renderTrustees = () => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <MaterialIcons name="people" size={24} color={Colors.primary} />
        <Text style={styles.cardTitle}>Trustees</Text>
      </View>
      
      {temple.trustees.map((trustee, index) => (
        <View key={trustee.id} style={styles.trusteeItem}>
          <View style={styles.trusteeInfo}>
            <Text style={styles.trusteeName}>{trustee.name}</Text>
            <Text style={styles.trusteePosition}>{trustee.position}</Text>
            {trustee.contact && (
              <TouchableOpacity 
                style={styles.trusteeContact}
                onPress={() => Linking.openURL(`tel:${trustee.contact}`)}
              >
                <MaterialIcons name="phone" size={16} color={Colors.primary} />
                <Text style={styles.trusteeContactText}>{trustee.contact}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      ))}
    </View>
  );

  const renderFacilities = () => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <MaterialIcons name="local-convenience-store" size={24} color={Colors.primary} />
        <Text style={styles.cardTitle}>Facilities</Text>
      </View>
      
      <View style={styles.facilitiesGrid}>
        {temple.facilities.map((facility, index) => (
          <View key={index} style={styles.facilityTag}>
            <MaterialIcons name="check-circle" size={16} color={Colors.secondary} />
            <Text style={styles.facilityText}>{facility}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderFestivals = () => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <MaterialIcons name="celebration" size={24} color={Colors.primary} />
        <Text style={styles.cardTitle}>Major Festivals</Text>
      </View>
      
      <View style={styles.festivalsGrid}>
        {temple.festivals.map((festival, index) => (
          <View key={index} style={styles.festivalTag}>
            <Text style={styles.festivalText}>{festival}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={Colors.card} barStyle="dark-content" />
      <Header title={temple.name} showBackButton />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {renderImageGallery()}
        
        <View style={styles.content}>
          <View style={styles.templeHeader}>
            <Text style={styles.templeName}>{temple.name}</Text>
            <View style={styles.locationInfo}>
              <MaterialIcons name="location-on" size={20} color={Colors.textLight} />
              <Text style={styles.locationText}>
                {temple.address}, {temple.city} - {temple.pincode}
              </Text>
            </View>
          </View>
          
          {renderQuickActions()}
          {renderBasicInfo()}
          {renderTimings()}
          {renderDharamshala()}
          {renderTrustees()}
          {renderFacilities()}
          {renderFestivals()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  imageGallery: {
    backgroundColor: Colors.card,
  },
  mainImage: {
    width: width,
    height: 250,
    resizeMode: 'cover',
  },
  thumbnailList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  thumbnailContainer: {
    marginRight: 8,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedThumbnail: {
    borderColor: Colors.primary,
  },
  thumbnail: {
    width: 60,
    height: 60,
    resizeMode: 'cover',
  },
  content: {
    padding: 16,
  },
  templeHeader: {
    marginBottom: 20,
  },
  templeName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 16,
    color: Colors.textLight,
    marginLeft: 6,
    flex: 1,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.card,
    borderRadius: 16,
    paddingVertical: 16,
    marginBottom: 20,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    color: Colors.text,
    fontWeight: '500',
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: 8,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  infoItem: {
    width: '50%',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  description: {
    fontSize: 15,
    color: Colors.text,
    lineHeight: 22,
  },
  timingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  timingLabel: {
    fontSize: 15,
    color: Colors.text,
    fontWeight: '500',
  },
  timingValue: {
    fontSize: 15,
    color: Colors.primary,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 12,
  },
  aartiTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  dharamshalaInfo: {
    marginTop: 8,
  },
  dharamshalaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dharamshalaText: {
    fontSize: 15,
    color: Colors.text,
    marginLeft: 8,
    flex: 1,
  },
  bookingNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${Colors.warning}15`,
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  bookingText: {
    fontSize: 14,
    color: Colors.warning,
    fontWeight: '600',
    marginLeft: 6,
  },
  trusteeItem: {
    backgroundColor: `${Colors.background}80`,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  trusteeInfo: {
    flex: 1,
  },
  trusteeName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  trusteePosition: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 8,
  },
  trusteeContact: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trusteeContactText: {
    fontSize: 14,
    color: Colors.primary,
    marginLeft: 6,
    fontWeight: '500',
  },
  facilitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  facilityTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${Colors.secondary}15`,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  facilityText: {
    fontSize: 14,
    color: Colors.secondary,
    fontWeight: '500',
    marginLeft: 6,
  },
  festivalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  festivalTag: {
    backgroundColor: `${Colors.primary}15`,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  festivalText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
});

export default TempleDetailScreen;
