import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import Colors from '../constants/Colors';

const { width } = Dimensions.get('window');

interface FormShimmerProps {
  height?: number;
  width?: string | number;
  borderRadius?: number;
  style?: any;
}

const FormShimmer: React.FC<FormShimmerProps> = ({ 
  height = 20, 
  width: shimmerWidth = '100%', 
  borderRadius = 8,
  style 
}) => {
  const shimmerAnimation = useRef(new Animated.Value(-1)).current;

  useEffect(() => {
    const startShimmer = () => {
      Animated.loop(
        Animated.timing(shimmerAnimation, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        })
      ).start();
    };

    startShimmer();
  }, [shimmerAnimation]);

  const translateX = shimmerAnimation.interpolate({
    inputRange: [-1, 1],
    outputRange: [-width, width],
  });

  return (
    <View style={[styles.container, { height, width: shimmerWidth, borderRadius }, style]}>
      <View style={[styles.shimmerBase, { borderRadius }]} />
      <Animated.View 
        style={[
          styles.shimmerOverlay,
          {
            transform: [{ translateX }],
            borderRadius,
          }
        ]} 
      />
    </View>
  );
};

const ModernFormShimmer: React.FC = () => {
  return (
    <View style={styles.modernShimmerContainer}>
      {/* Header Shimmer */}
      <View style={styles.headerShimmer}>
        <View style={styles.headerIconShimmer}>
          <FormShimmer height={32} width={32} borderRadius={16} />
        </View>
        <View style={styles.headerTextShimmer}>
          <FormShimmer height={20} width="60%" borderRadius={10} />
          <FormShimmer height={14} width="40%" borderRadius={7} style={{ marginTop: 8 }} />
        </View>
      </View>

      {/* Form Fields Shimmer */}
      <View style={styles.fieldsShimmer}>
        {[1, 2, 3].map((item) => (
          <View key={item} style={styles.fieldGroup}>
            <FormShimmer height={16} width="30%" borderRadius={8} />
            <FormShimmer height={56} width="100%" borderRadius={16} style={{ marginTop: 8 }} />
          </View>
        ))}
      </View>

      {/* Toggle Field Shimmer */}
      <View style={styles.fieldGroup}>
        <FormShimmer height={16} width="25%" borderRadius={8} />
        <View style={styles.toggleShimmer}>
          <FormShimmer height={48} width="48%" borderRadius={12} />
          <FormShimmer height={48} width="48%" borderRadius={12} />
        </View>
      </View>

      {/* Button Shimmer */}
      <FormShimmer height={56} width="100%" borderRadius={20} style={{ marginTop: 32 }} />
    </View>
  );
};

const FormShimmerGroup: React.FC = () => {
  return (
    <View style={styles.shimmerGroup}>
      <ModernFormShimmer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: `${Colors.border}40`,
    overflow: 'hidden',
    position: 'relative',
  },
  shimmerBase: {
    flex: 1,
    backgroundColor: `${Colors.border}60`,
  },
  shimmerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    width: '30%',
  },
  modernShimmerContainer: {
    padding: 24,
  },
  shimmerGroup: {
    backgroundColor: Colors.card,
    borderRadius: 24,
    marginHorizontal: 16,
    marginVertical: 12,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
    borderWidth: 1,
    borderColor: `${Colors.border}30`,
  },
  headerShimmer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: `${Colors.border}30`,
  },
  headerIconShimmer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: `${Colors.primary}10`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerTextShimmer: {
    flex: 1,
  },
  fieldsShimmer: {
    marginBottom: 24,
  },
  fieldGroup: {
    marginBottom: 24,
  },
  toggleShimmer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
});

export { FormShimmer, FormShimmerGroup, ModernFormShimmer };
export default FormShimmer;
