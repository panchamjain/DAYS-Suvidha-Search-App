import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import Header from '../components/Header';
import Colors from '../constants/Colors';

interface FailureRouteParams {
  error?: string;
  errorDetails?: any;
  submittedData?: any;
}

const SuvidhaCardFailureScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { error, errorDetails, submittedData } = (route.params as FailureRouteParams) || {};

  const handleRetrySubmission = async () => {
    if (!submittedData) {
      Alert.alert('Error', 'No data available to retry submission.');
      return;
    }

    Alert.alert(
      'Retry Submission',
      'Do you want to retry submitting your application?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Retry',
          onPress: async () => {
            try {
              const response = await fetch('https://www.daysahmedabad.com/api/suvidha/submit/', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  ...submittedData,
                  retry_attempt: true,
                  retry_timestamp: new Date().toISOString(),
                }),
              });

              const responseData = await response.json();

              if (response.ok) {
                navigation.navigate('SuvidhaCardSuccess' as never, { 
                  applicationData: responseData,
                  submittedData: submittedData 
                } as never);
              } else {
                Alert.alert('Retry Failed', responseData.message || 'Submission failed again. Please try later.');
              }
            } catch (retryError) {
              Alert.alert('Retry Failed', 'Network error. Please check your connection and try again.');
            }
          }
        }
      ]
    );
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleGoHome = () => {
    navigation.navigate('Home' as never);
  };

  const handleContactSupport = () => {
    Alert.alert(
      'Contact Support',
      'Please contact our support team for assistance:\n\nEmail: support@daysahmedabad.com\nPhone: +91 79 1234 5678\n\nReference your error details when contacting support.',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={Colors.error} barStyle="light-content" />
      <Header title="Submission Failed" showBackButton={false} />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Error Animation Container */}
          <View style={styles.errorContainer}>
            <View style={styles.errorIconContainer}>
              <View style={styles.errorIconBackground}>
                <MaterialIcons name="error" size={80} color="white" />
              </View>
              <View style={styles.errorIconRing} />
            </View>
            
            <Text style={styles.errorTitle}>Submission Failed</Text>
            <Text style={styles.errorSubtitle}>
              We encountered an issue while processing your application. Don\'t worry, your data is safe.
            </Text>
          </View>

          {/* Error Details Card */}
          <View style={styles.detailsCard}>
            <View style={styles.detailsHeader}>
              <MaterialIcons name="info" size={24} color={Colors.error} />
              <Text style={styles.detailsTitle}>Error Details</Text>
            </View>
            
            <View style={styles.errorMessageContainer}>
              <Text style={styles.errorMessage}>
                {error || 'An unexpected error occurred during submission.'}
              </Text>
            </View>
            
            {errorDetails?.code && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Error Code:</Text>
                <Text style={styles.detailValue}>{errorDetails.code}</Text>
              </View>
            )}
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Time:</Text>
              <Text style={styles.detailValue}>
                {new Date().toLocaleDateString('en-GB')} at {new Date().toLocaleTimeString('en-GB', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </Text>
            </View>
          </View>

          {/* Troubleshooting Card */}
          <View style={styles.troubleshootingCard}>
            <View style={styles.troubleshootingHeader}>
              <MaterialIcons name="build" size={24} color={Colors.warning} />
              <Text style={styles.troubleshootingTitle}>Troubleshooting</Text>
            </View>
            
            <View style={styles.troubleshootingList}>
              <View style={styles.troubleshootingItem}>
                <MaterialIcons name="wifi" size={20} color={Colors.textLight} />
                <Text style={styles.troubleshootingText}>
                  Check your internet connection and try again
                </Text>
              </View>
              
              <View style={styles.troubleshootingItem}>
                <MaterialIcons name="refresh" size={20} color={Colors.textLight} />
                <Text style={styles.troubleshootingText}>
                  Wait a few minutes and retry the submission
                </Text>
              </View>
              
              <View style={styles.troubleshootingItem}>
                <MaterialIcons name="edit" size={20} color={Colors.textLight} />
                <Text style={styles.troubleshootingText}>
                  Review your form data for any missing information
                </Text>
              </View>
              
              <View style={styles.troubleshootingItem}>
                <MaterialIcons name="support" size={20} color={Colors.textLight} />
                <Text style={styles.troubleshootingText}>
                  Contact support if the problem persists
                </Text>
              </View>
            </View>
          </View>

          {/* Data Safety Card */}
          <View style={styles.safetyCard}>
            <View style={styles.safetyHeader}>
              <MaterialIcons name="security" size={24} color={Colors.success || '#4CAF50'} />
              <Text style={styles.safetyTitle}>Your Data is Safe</Text>
            </View>
            
            <Text style={styles.safetyDescription}>
              Your application data has been preserved. You can retry submission without re-entering all information.
            </Text>
            
            <View style={styles.safetyFeatures}>
              <View style={styles.safetyFeature}>
                <MaterialIcons name="check-circle" size={16} color={Colors.success || '#4CAF50'} />
                <Text style={styles.safetyFeatureText}>Data automatically saved</Text>
              </View>
              
              <View style={styles.safetyFeature}>
                <MaterialIcons name="check-circle" size={16} color={Colors.success || '#4CAF50'} />
                <Text style={styles.safetyFeatureText}>Secure transmission</Text>
              </View>
              
              <View style={styles.safetyFeature}>
                <MaterialIcons name="check-circle" size={16} color={Colors.success || '#4CAF50'} />
                <Text style={styles.safetyFeatureText}>Privacy protected</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            {submittedData && (
              <TouchableOpacity 
                style={styles.retryButton} 
                onPress={handleRetrySubmission}
              >
                <MaterialIcons name="refresh" size={20} color="white" />
                <Text style={styles.retryButtonText}>Retry Submission</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={styles.secondaryButton} 
              onPress={handleGoBack}
            >
              <MaterialIcons name="arrow-back" size={20} color={Colors.primary} />
              <Text style={styles.secondaryButtonText}>Back to Form</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.supportButton} 
              onPress={handleContactSupport}
            >
              <MaterialIcons name="support-agent" size={20} color={Colors.warning} />
              <Text style={styles.supportButtonText}>Contact Support</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.homeButton} 
              onPress={handleGoHome}
            >
              <MaterialIcons name="home" size={20} color={Colors.textLight} />
              <Text style={styles.homeButtonText}>Back to Home</Text>
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
  errorContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    marginBottom: 20,
  },
  errorIconContainer: {
    position: 'relative',
    marginBottom: 24,
  },
  errorIconBackground: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.error,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  errorIconRing: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: `${Colors.error}30`,
    top: -15,
    left: -15,
    zIndex: 1,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  errorSubtitle: {
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
    borderLeftWidth: 4,
    borderLeftColor: Colors.error,
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
  errorMessageContainer: {
    backgroundColor: `${Colors.error}10`,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorMessage: {
    fontSize: 14,
    color: Colors.error,
    lineHeight: 20,
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
  troubleshootingCard: {
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
  troubleshootingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  troubleshootingTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: 8,
  },
  troubleshootingList: {
    gap: 12,
  },
  troubleshootingItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  troubleshootingText: {
    fontSize: 14,
    color: Colors.text,
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  safetyCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: Colors.success || '#4CAF50',
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  safetyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  safetyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: 8,
  },
  safetyDescription: {
    fontSize: 14,
    color: Colors.textLight,
    lineHeight: 20,
    marginBottom: 16,
  },
  safetyFeatures: {
    gap: 8,
  },
  safetyFeature: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  safetyFeatureText: {
    fontSize: 14,
    color: Colors.text,
    marginLeft: 8,
  },
  actionButtons: {
    gap: 12,
  },
  retryButton: {
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
  retryButtonText: {
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
  supportButton: {
    backgroundColor: `${Colors.warning}10`,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: `${Colors.warning}30`,
  },
  supportButtonText: {
    color: Colors.warning,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  homeButton: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  homeButtonText: {
    color: Colors.textLight,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  bottomSpacing: {
    height: 40,
  },
});

export default SuvidhaCardFailureScreen;