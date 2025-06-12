import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text, Image, ImageSourcePropType } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SHADOWS, SIZES } from '../constants/theme';

interface CategoryCardProps {
  name: string;
  icon: string;
  image: ImageSourcePropType;
  description: string;
  onPress: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ name, icon, image, description, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <Image source={image} style={styles.image} />
      <View style={styles.overlay} />
      <View style={styles.content}>
        <MaterialCommunityIcons name={icon as any} size={32} color={COLORS.white} />
        <Text style={styles.title}>{name}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {description}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 160,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.padding,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  content: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: SIZES.padding,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...FONTS.bold,
    fontSize: SIZES.extraLarge,
    color: COLORS.white,
    marginTop: SIZES.base,
    textAlign: 'center',
  },
  description: {
    ...FONTS.regular,
    fontSize: SIZES.small,
    color: COLORS.white,
    marginTop: SIZES.base,
    textAlign: 'center',
    opacity: 0.9,
  },
});

export default CategoryCard;