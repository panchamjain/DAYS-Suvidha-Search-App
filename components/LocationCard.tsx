import React from 'react';
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
        <MaterialCommunityIcons name="map-marker" size={24} color={COLORS.primary} />
        <Text style={styles.area}>{location.area}</Text>
      </View>
      
      <Text style={styles.address}>
        {location.address}, {location.city}, {location.state} - {location.pincode}
      </Text>
      
      {location.timings && (
        <View style={styles.timingsContainer}>
          <MaterialCommunityIcons name="clock-outline" size={16} color={COLORS.text.tertiary} />
          <Text style={styles.timings}>{location.timings}</Text>
        </View>
      )}
      
      <View style={styles.divider} />
      
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
          <MaterialCommunityIcons name="phone" size={20} color={COLORS.primary} />
          <Text style={styles.actionText}>Call</Text>
        </TouchableOpacity>
        
        {location.email && (
          <TouchableOpacity style={styles.actionButton} onPress={handleEmail}>
            <MaterialCommunityIcons name="email-outline" size={20} color={COLORS.primary} />
            <Text style={styles.actionText}>Email</Text>
          </TouchableOpacity>
        )}
        
        {location.website && (
          <TouchableOpacity style={styles.actionButton} onPress={handleWebsite}>
            <MaterialCommunityIcons name="web" size={20} color={COLORS.primary} />
            <Text style={styles.actionText}>Website</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity style={styles.actionButton} onPress={onViewMap}>
          <MaterialCommunityIcons name="map" size={20} color={COLORS.primary} />
          <Text style={styles.actionText}>Map</Text>
        </TouchableOpacity>
      </View>
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
    ...SHADOWS.light,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.base,
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
  },
  timingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.base,
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
  },
  actionButton: {
    alignItems: 'center',
    padding: SIZES.base,
  },
  actionText: {
    ...FONTS.medium,
    fontSize: SIZES.small,
    color: COLORS.primary,
    marginTop: 2,
  },
});

export default LocationCard;