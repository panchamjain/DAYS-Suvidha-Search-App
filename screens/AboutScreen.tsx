import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Header from '../components/Header';
import Colors from '../constants/Colors';

const AboutScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={Colors.card} barStyle="dark-content" />
      <Header title="About DAYS" showBackButton />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <MaterialIcons name="card-giftcard" size={48} color={Colors.primary} />
            </View>
            <Text style={styles.appName}>DAYS Ahmedabad</Text>
            <Text style={styles.tagline}>Your Gateway to Exclusive Discounts</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <MaterialIcons name="info-outline" size={20} color={Colors.primary} />
                <Text style={styles.sectionTitle}>About Suvidha Card</Text>
              </View>
              <Text style={styles.description}>
                The DAYS Suvidha Card is your key to unlocking exclusive discounts across Ahmedabad. 
                From restaurants and shopping to healthcare and entertainment, enjoy special offers 
                at hundreds of partner establishments throughout the city.
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <MaterialIcons name="star" size={20} color={Colors.primary} />
                <Text style={styles.sectionTitle}>Features</Text>
              </View>
              <View style={styles.featuresList}>
                <View style={styles.featureItem}>
                  <MaterialIcons name="check-circle" size={16} color={Colors.secondary} />
                  <Text style={styles.featureText}>Exclusive discounts up to 30%</Text>
                </View>
                <View style={styles.featureItem}>
                  <MaterialIcons name="check-circle" size={16} color={Colors.secondary} />
                  <Text style={styles.featureText}>500+ partner merchants</Text>
                </View>
                <View style={styles.featureItem}>
                  <MaterialIcons name="check-circle" size={16} color={Colors.secondary} />
                  <Text style={styles.featureText}>Easy search and navigation</Text>
                </View>
                <View style={styles.featureItem}>
                  <MaterialIcons name="check-circle" size={16} color={Colors.secondary} />
                  <Text style={styles.featureText}>Real-time offers and updates</Text>
                </View>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <MaterialIcons name="contact-support" size={20} color={Colors.primary} />
                <Text style={styles.sectionTitle}>Contact Us</Text>
              </View>
              <Text style={styles.description}>
                For support or inquiries about the DAYS Suvidha Card, please contact our customer service team.
              </Text>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Version 1.0.0</Text>
            <Text style={styles.footerText}>© 2024 DAYS Ahmedabad</Text>
          </View>
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
  content: {
    padding: 16,
  },
  logoContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: `${Colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: Colors.textLight,
    textAlign: 'center',
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: 8,
  },
  description: {
    fontSize: 15,
    color: Colors.text,
    lineHeight: 22,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 16,
  },
  featuresList: {
    marginTop: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 15,
    color: Colors.text,
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  footerText: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 4,
  },
});

export default AboutScreen;