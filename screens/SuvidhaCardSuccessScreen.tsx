import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Animated,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import Header from '../components/Header';
import Colors from '../constants/Colors';

interface SuccessRouteParams {
  applicationData?: any;
  submittedData?: any;
}

const SuvidhaCardSuccessScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { applicationData, submittedData } = (route.params as SuccessRouteParams) || {};

  const handleGoHome = () => {
    navigation.navigate('Home' as never);
  };

  const handleViewApplication = () => {
    // You can implement a detailed view of the application here
    console.log('Application Data:', applicationData);
    console.log('Submitted Data:', submittedData);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={Colors.success || Colors.primary} barStyle="light-content" />
      <Header title="Application Submitted" showBackButton={false} />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Success Animation Container */}
          <View style={styles.successContainer}>
            <Animated.View style={styles.successIconContainer}>
              <View style={styles.successIconBackground}>
                <MaterialIcons name="check-circle" size={80} color="white" />
              </View>
              <View style={styles.successIconRing} />
            </Animated.View>
            
            <Text style={styles.successTitle}>Application Submitted Successfully! 🎉</Text>
            <Text style={styles.successSubtitle}>
              Your DAYS Suvidha Card application has been received and is being processed.
            </Text>
          </View>

          {/* Application Details Card */}
          <View style={styles.detailsCard}>
            <View style={styles.detailsHeader}>
              <MaterialIcons name="receipt-long" size={24} color={Colors.primary} />
              <Text style={styles.detailsTitle}>Application Details</Text>
            </View>
            
            {applicationData?.application_id && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Application ID:</Text>
                <Text style={styles.detailValue}>{applicationData.application_id}</Text>
              </View>
            )}
            
            {submittedData?.name && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Applicant Name:</Text>
                <Text style={styles.detailValue}>{submittedData.name}</Text>
              </View>
            )}
            
            {submittedData?.email && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Email:</Text>
                <Text style={styles.detailValue}>{submittedData.email}</Text>
              </View>
            )}
            
            {submittedData?.phone && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Phone:</Text>
                <Text style={styles.detailValue}>{submittedData.phone}</Text>
              </View>
            )}
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Submitted:</Text>
              <Text style={styles.detailValue}>
                {new Date().toLocaleDateString('en-GB')} at {new Date().toLocaleTimeString('en-GB', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </Text>
            </View>
          </View>

          {/* Next Steps Card */}
          <View style={styles.nextStepsCard}>
            <View style={styles.nextStepsHeader}>
              <MaterialIcons name="timeline" size={24} color={Colors.secondary} />
              <Text style={styles.nextStepsTitle}>What Happens Next?</Text>
            </View>
            
            <View style={styles.stepsList}>
              <View style={styles.stepItem}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>1</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>Application Review</Text>
                  <Text style={styles.stepDescription}>
                    Our team will review your application within 2-3 business days.
                  </Text>
                </View>
              </View>
              
              <View style={styles.stepItem}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>2</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>Email Confirmation</Text>
                  <Text style={styles.stepDescription}>
                    You\'ll receive an email confirmation with your card details.
                  </Text>
                </View>
              </View>
              
              <View style={styles.stepItem}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>3</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>Card Activation</Text>
                  <Text style={styles.stepDescription}>
                    Your digital Suvidha Card will be activated and ready to use.
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Benefits Reminder Card */}
          <View style={styles.benefitsCard}>
            <View style={styles.benefitsHeader}>
              <MaterialIcons name="card-giftcard" size={24} color={Colors.warning} />
              <Text style={styles.benefitsTitle}>Your Benefits</Text>
            </View>
            
            <View style={styles.benefitsList}>
              <View style={styles.benefitItem}>
                <MaterialIcons name="local-offer" size={20} color={Colors.primary} />
                <Text style={styles.benefitText}>Exclusive discounts at 500+ merchants</Text>
              </View>
              
              <View style={styles.benefitItem}>
                <MaterialIcons name="verified" size={20} color={Colors.primary} />
                <Text style={styles.benefitText}>Verified merchant network</Text>
              </View>
              
              <View style={styles.benefitItem}>
                <MaterialIcons name="savings" size={20} color={Colors.primary} />
                <Text style={styles.benefitText}>Save up to 30% on dining & shopping</Text>
              </View>
              
              <View style={styles.benefitItem}>
                <MaterialIcons name="support" size={20} color={Colors.primary} />
                <Text style={styles.benefitText}>24/7 customer support</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            {applicationData && (
              <TouchableOpacity 
                style={styles.secondaryButton} 
                onPress={handleViewApplication}
              >
                <MaterialIcons name="visibility" size={20} color={Colors.primary} />
                <Text style={styles.secondaryButtonText}>View Application</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={styles.primaryButton} 
              onPress={handleGoHome}
            >
              <MaterialIcons name="home" size={20} color="white" />
              <Text style={styles.primaryButtonText}>Back to Home</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.bottomSpacing} />
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
    padding: 20,
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    marginBottom: 20,
  },
  successIconContainer: {
    position: 'relative',
    marginBottom: 24,
  },
  successIconBackground: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.success || '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  successIconRing: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: `${Colors.success || '#4CAF50'}30`,
    top: -15,
    left: -15,
    zIndex: 1,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  successSubtitle: {
    fontSize: 16,
    color: Colors.textLight,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  detailsCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  detailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  detailLabel: {
    fontSize: 14,
    color: Colors.textLight,
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    flex: 1,
    textAlign: 'right',
  },
  nextStepsCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  nextStepsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  nextStepsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: 8,
  },
  stepsList: {
    gap: 16,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: Colors.textLight,
    lineHeight: 20,
  },
  benefitsCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  benefitsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  benefitsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: 8,
  },
  benefitsList: {
    gap: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  benefitText: {
    fontSize: 14,
    color: Colors.text,
    marginLeft: 12,
    flex: 1,
  },
  actionButtons: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  secondaryButton: {
    backgroundColor: `${Colors.primary}10`,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: `${Colors.primary}30`,
  },
  secondaryButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  bottomSpacing: {
    height: 40,
  },
});

export default SuvidhaCardSuccessScreen;