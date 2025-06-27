import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Linking } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import { Branch } from '../constants/MockData';

interface BranchCardProps {
  branch: Branch;
  onPress?: () => void;
  showCallButton?: boolean;
  showDirectionsButton?: boolean;
}

const BranchCard: React.FC<BranchCardProps> = ({ 
  branch, 
  onPress, 
  showCallButton = true, 
  showDirectionsButton = true 
}) => {
  // Safe access to branch properties with fallbacks
  const branchName = branch?.name || 'Branch';
  const branchAddress = branch?.address || 'Address not available';
  const branchContact = branch?.contact || 'Contact not available';
  const isMainBranch = branch?.isMainBranch || false;
  const operatingHours = branch?.operatingHours || { weekdays: '', weekends: '' };
  const amenities = branch?.amenities || [];

  const handleCall = () => {
    if (branch?.contact) {
      Linking.openURL(`tel:${branch.contact}`);
    }
  };

  const handleDirections = () => {
    if (branch?.address) {
      const address = encodeURIComponent(branch.location);
      Linking.openURL(address);
    }
  };

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={onPress} 
      activeOpacity={0.7}
      disabled={!onPress}
    >
      <View style={styles.cardHeader}>
        <View style={styles.branchInfo}>
          <View style={styles.nameContainer}>
            <Text style={styles.branchName}>{branchName}</Text>
            {isMainBranch && (
              <View style={styles.mainBadge}>
                <Text style={styles.mainBadgeText}>Main</Text>
              </View>
            )}
          </View>
          
          <View style={styles.addressContainer}>
            <MaterialIcons name="location-on" size={16} color={Colors.textLight} />
            <Text style={styles.address}>{branchAddress}</Text>
          </View>
          
          <View style={styles.contactContainer}>
            <MaterialIcons name="phone" size={16} color={Colors.textLight} />
            <Text style={styles.contact}>{branchContact}</Text>
          </View>
        </View>
      </View>

      {/* Only show hours if they exist */}
      {(operatingHours.weekdays || operatingHours.weekends) && (
        <View style={styles.hoursContainer}>
          {operatingHours.weekdays && (
            <View style={styles.hoursRow}>
              <MaterialIcons name="access-time" size={16} color={Colors.primary} />
              <View style={styles.hoursText}>
                <Text style={styles.hoursLabel}>Weekdays:</Text>
                <Text style={styles.hoursValue}>{operatingHours.weekdays}</Text>
              </View>
            </View>
          )}
          {operatingHours.weekends && (
            <View style={styles.hoursRow}>
              <MaterialIcons name="event" size={16} color={Colors.primary} />
              <View style={styles.hoursText}>
                <Text style={styles.hoursLabel}>Weekends:</Text>
                <Text style={styles.hoursValue}>{operatingHours.weekends}</Text>
              </View>
            </View>
          )}
        </View>
      )}

      {/* Only show amenities if they exist */}
      {amenities && amenities.length > 0 && (
        <View style={styles.amenitiesContainer}>
          <Text style={styles.amenitiesTitle}>Amenities:</Text>
          <View style={styles.amenitiesList}>
            {amenities.map((amenity, index) => (
              <View key={index} style={styles.amenityTag}>
                <Text style={styles.amenityText}>{amenity}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <View style={styles.actionButtons}>
        {showCallButton && branch?.contact && (
          <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
            <MaterialIcons name="phone" size={18} color={Colors.primary} />
            <Text style={styles.actionButtonText}>Call</Text>
          </TouchableOpacity>
        )}
        
        {showDirectionsButton && branch?.address && (
          <TouchableOpacity style={styles.actionButton} onPress={handleDirections}>
            <MaterialIcons name="directions" size={18} color={Colors.secondary} />
            <Text style={[styles.actionButtonText, { color: Colors.secondary }]}>Directions</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: Colors.cardShadow,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 10,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  cardHeader: {
    marginBottom: 16,
  },
  branchInfo: {
    marginBottom: 12,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  branchName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
  },
  mainBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  mainBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  address: {
    fontSize: 14,
    color: Colors.text,
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
  contactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contact: {
    fontSize: 14,
    color: Colors.text,
    marginLeft: 8,
  },
  hoursContainer: {
    backgroundColor: `${Colors.background}80`,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  hoursRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  hoursText: {
    marginLeft: 8,
    flex: 1,
  },
  hoursLabel: {
    fontSize: 13,
    color: Colors.textLight,
    fontWeight: '500',
  },
  hoursValue: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
  },
  amenitiesContainer: {
    marginBottom: 16,
  },
  amenitiesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  amenitiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  amenityTag: {
    backgroundColor: `${Colors.primary}10`,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 4,
  },
  amenityText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: `${Colors.background}80`,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
    marginLeft: 6,
  },
});

export default BranchCard;
