import * as React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SHADOWS, SIZES } from '../constants/theme';
import { Discount } from '../data/mockData';

interface DiscountCardProps {
  discount: Discount;
}

const DiscountCard: React.FC<DiscountCardProps> = ({ discount }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.percentageContainer}>
          <Text style={styles.percentage}>{discount.percentage}%</Text>
          <Text style={styles.off}>OFF</Text>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{discount.title}</Text>
          <View style={styles.validContainer}>
            <MaterialCommunityIcons name="calendar-range" size={14} color={COLORS.text.tertiary} />
            <Text style={styles.validUntil}>Valid until {discount.validUntil}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.divider} />
      
      <Text style={styles.description}>{discount.description}</Text>
      
      {discount.terms && (
        <View style={styles.termsContainer}>
          <MaterialCommunityIcons name="information-outline" size={14} color={COLORS.text.tertiary} />
          <Text style={styles.terms}>{discount.terms}</Text>
        </View>
      )}
      
      <TouchableOpacity style={styles.useButton}>
        <Text style={styles.useButtonText}>Use Discount</Text>
        <MaterialCommunityIcons name="arrow-right" size={16} color={COLORS.white} style={{ marginLeft: 4 }} />
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
    borderLeftWidth: 4,
    borderLeftColor: COLORS.tertiary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  percentageContainer: {
    backgroundColor: COLORS.tertiary,
    borderRadius: SIZES.radius,
    padding: SIZES.base,
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
  },
  percentage: {
    ...FONTS.bold,
    fontSize: SIZES.large,
    color: COLORS.white,
  },
  off: {
    ...FONTS.medium,
    fontSize: SIZES.small,
    color: COLORS.white,
  },
  titleContainer: {
    flex: 1,
    marginLeft: SIZES.padding,
  },
  title: {
    ...FONTS.bold,
    fontSize: SIZES.medium,
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  validContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  validUntil: {
    ...FONTS.regular,
    fontSize: SIZES.small,
    color: COLORS.text.tertiary,
    marginLeft: 4,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.lightGray,
    marginVertical: SIZES.padding,
  },
  description: {
    ...FONTS.regular,
    fontSize: SIZES.font,
    color: COLORS.text.secondary,
    marginBottom: SIZES.padding,
    lineHeight: 20,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.lightGray,
    padding: SIZES.base,
    borderRadius: SIZES.base,
    marginBottom: SIZES.padding,
  },
  terms: {
    ...FONTS.regular,
    fontSize: SIZES.small,
    color: COLORS.text.tertiary,
    marginLeft: 4,
    flex: 1,
  },
  useButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.base,
    borderRadius: SIZES.radius,
  },
  useButtonText: {
    ...FONTS.medium,
    fontSize: SIZES.font,
    color: COLORS.white,
  },
});

export default DiscountCard;
