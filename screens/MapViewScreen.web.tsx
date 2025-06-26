import * as React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView,
  StatusBar,
  Linking
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { getMerchantById } from '../data/mockData';

const MapViewScreen = ({ route, navigation }: any) => {
  const { merchantId, locationId } = route.params;
  const merchant = getMerchantById(merchantId);
  
  if (!merchant) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Merchant not found</Text>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  
  // Find the selected location or use the first one
  const selectedLocation = locationId 
    ? merchant.locations.find(loc => loc.id === locationId) 
    : merchant.locations[0];
  
  if (!selectedLocation) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Location not found</Text>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  
  const openGoogleMaps = () => {
    const { latitude, longitude } = selectedLocation.coordinates;
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    Linking.openURL(url);
  };
  
  const openDirections = () => {
    const { latitude, longitude } = selectedLocation.coordinates;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    Linking.openURL(url);
  };
  
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
        <Text style={styles.headerTitle}>{merchant.name}</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <View style={styles.mapPlaceholder}>
        <MaterialCommunityIcons name="map" size={64} color={COLORS.primary} />
        <Text style={styles.mapPlaceholderTitle}>Map View</Text>
        <Text style={styles.mapPlaceholderText}>
          Maps are not available on web. Use the buttons below to open in Google Maps.
        </Text>
      </View>
      
      <View style={styles.locationInfoContainer}>
        <Text style={styles.locationTitle}>{selectedLocation.area}</Text>
        <Text style={styles.locationAddress}>
          {selectedLocation.address}, {selectedLocation.city}, {selectedLocation.state} - {selectedLocation.pincode}
        </Text>
        
        {selectedLocation.timings && (
          <View style={styles.timingsContainer}>
            <MaterialCommunityIcons name="clock-outline" size={16} color={COLORS.text.tertiary} />
            <Text style={styles.timings}>{selectedLocation.timings}</Text>
          </View>
        )}
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.mapButton} onPress={openGoogleMaps}>
            <MaterialCommunityIcons name="map-marker" size={20} color={COLORS.white} />
            <Text style={styles.mapButtonText}>View on Google Maps</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.directionsButton} onPress={openDirections}>
            <MaterialCommunityIcons name="directions" size={20} color={COLORS.white} />
            <Text style={styles.directionsText}>Get Directions</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    backgroundColor: COLORS.white,
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  headerTitle: {
    ...FONTS.bold,
    fontSize: SIZES.large,
    color: COLORS.text.primary,
    flex: 1,
    textAlign: 'center',
  },
  backButton: {
    padding: 4,
  },
  backButtonText: {
    ...FONTS.medium,
    fontSize: SIZES.font,
    color: COLORS.primary,
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    margin: SIZES.padding,
    borderRadius: SIZES.radius,
    padding: SIZES.padding * 2,
  },
  mapPlaceholderTitle: {
    ...FONTS.bold,
    fontSize: SIZES.large,
    color: COLORS.text.primary,
    marginTop: SIZES.padding,
    marginBottom: SIZES.base,
  },
  mapPlaceholderText: {
    ...FONTS.regular,
    fontSize: SIZES.font,
    color: COLORS.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  locationInfoContainer: {
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  locationTitle: {
    ...FONTS.bold,
    fontSize: SIZES.large,
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  locationAddress: {
    ...FONTS.regular,
    fontSize: SIZES.font,
    color: COLORS.text.secondary,
    marginBottom: 8,
  },
  timingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  timings: {
    ...FONTS.regular,
    fontSize: SIZES.small,
    color: COLORS.text.tertiary,
    marginLeft: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.secondary,
    paddingVertical: SIZES.padding,
    borderRadius: SIZES.radius,
    flex: 1,
    marginRight: SIZES.base,
  },
  mapButtonText: {
    ...FONTS.medium,
    fontSize: SIZES.font,
    color: COLORS.white,
    marginLeft: SIZES.base,
  },
  directionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.padding,
    borderRadius: SIZES.radius,
    flex: 1,
    marginLeft: SIZES.base,
  },
  directionsText: {
    ...FONTS.medium,
    fontSize: SIZES.font,
    color: COLORS.white,
    marginLeft: SIZES.base,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding,
  },
  errorText: {
    ...FONTS.bold,
    fontSize: SIZES.large,
    color: COLORS.text.primary,
    marginTop: SIZES.padding,
    textAlign: 'center',
  },
});

export default MapViewScreen;