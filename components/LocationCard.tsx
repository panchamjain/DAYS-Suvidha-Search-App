import * as React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Linking } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SHADOWS, SIZES } from '../constants/theme';
import { Location } from '../data/mockData';

interface LocationCardProps {
  location: Location;
  onViewMap: () => void;
}

const LocationCard: React.FC<LocationCardProps> = ({ location, onViewMap }) => {
  const handleCall = () => {
    Linking.openURL(`tel:${location.phone}`);
  };
  
  const handleEmail = () => {
    if (location.email) {
      Linking.openURL(`mailto:${location.email}`);
    }
  };
  
  const handleWebsite = () => {
    if (location.website) {
      Linking.openURL(`https://${location.website}`);
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MaterialCommunityIcons name="map-marker" size={24} color={COLORS.primary} />
          <Text style={styles.area}>{location.area}</Text>
        </View>
        {location.timings && (
          <View style={styles.timingsContainer}>
            <MaterialCommunityIcons name="clock-outline" size={16} color={COLORS.text.tertiary} />
            <Text style={styles.timings}>{location.timings}</Text>
          </View>
        )}
      </View>
      
      <Text style={styles.address}>
        {location.address}, {location.city}, {location.state} - {location.pincode}
      </Text>
      
      <View style={styles.divider} />
      
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
          <View style={[styles.actionIcon, { backgroundColor: 'rgba(25, 118, 210, 0.1)' }]}>
            <MaterialCommunityIcons name="phone" size={20} color={COLORS.primary} />
          </View>
          <Text style={styles.actionText}>Call</Text>
        </TouchableOpacity>
        
        {location.email && (
          <TouchableOpacity style={styles.actionButton} onPress={handleEmail}>
            <View style={[styles.actionIcon, { backgroundColor: 'rgba(67, 160, 71, 0.1)' }]}>
              <MaterialCommunityIcons name="email-outline" size={20} color={COLORS.tertiary} />
            </View>
            <Text style={styles.actionText}>Email</Text>
          </TouchableOpacity>
        )}
        
        {location.website && (
          <TouchableOpacity style={styles.actionButton} onPress={handleWebsite}>
            <View style={[styles.actionIcon, { backgroundColor: 'rgba(255, 109, 0, 0.1)' }]}>
              <MaterialCommunityIcons name="web" size={20} color={COLORS.secondary} />
            </View>
            <Text style={styles.actionText}>Website</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity style={styles.actionButton} onPress={onViewMap}>
          <View style={[styles.actionIcon, { backgroundColor: 'rgba(229, 57, 53, 0.1)' }]}>
            <MaterialCommunityIcons name="map" size={20} color={COLORS.error} />
          </View>
          <Text style={styles.actionText}>Map</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity style={styles.directionsButton} onPress={onViewMap}>
        <MaterialCommunityIcons name="directions" size={18} color={COLORS.white} />
        <Text style={styles.directionsText}>Get Directions</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.padding,
    ...SHADOWS.medium,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SIZES.base,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  area: {
    ...FONTS.bold,
    fontSize: SIZES.medium,
    color: COLORS.text.primary,
    marginLeft: SIZES.base,
  },
  address: {
    ...FONTS.regular,
    fontSize: SIZES.font,
    color: COLORS.text.secondary,
    marginBottom: SIZES.base,
    lineHeight: 20,
  },
  timingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    paddingHorizontal: SIZES.base,
    paddingVertical: 4,
    borderRadius: SIZES.base,
  },
  timings: {
    ...FONTS.regular,
    fontSize: SIZES.small,
    color: COLORS.text.tertiary,
    marginLeft: 4,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.lightGray,
    marginVertical: SIZES.base,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SIZES.base,
    marginBottom: SIZES.padding,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  actionText: {
    ...FONTS.medium,
    fontSize: SIZES.small,
    color: COLORS.text.secondary,
  },
  directionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.base,
    borderRadius: SIZES.radius,
  },
  directionsText: {
    ...FONTS.medium,
    fontSize: SIZES.font,
    color: COLORS.white,
    marginLeft: SIZES.base,
  },
});

export default LocationCard;
