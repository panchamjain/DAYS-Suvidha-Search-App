import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, ScrollView, TouchableOpacity, Linking, Platform } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import Header from '../components/Header';
import BranchCard from '../components/BranchCard';
import BranchCardSkeleton from '../components/BranchCardSkeleton';
import Colors from '../constants/Colors';
import { Merchant } from '../constants/MockData';
import { merchantService } from '../services/merchantService';

type MerchantDetailRouteParams = {
  merchant?: Merchant;
  merchantId?: string | number;
};

const MerchantDetailScreen = () => {
  const route = useRoute<RouteProp<Record<string, MerchantDetailRouteParams>, string>>();
  const { merchant: initialMerchant, merchantId } = route.params;
  
  const [merchant, setMerchant] = useState<Merchant | null>(initialMerchant || null);
  const [loading, setLoading] = useState(!initialMerchant);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'branches'>('overview');

  // Fetch fresh merchant data if we only have an ID (from search suggestions)
  useEffect(() => {
    const fetchMerchantData = async () => {
      if (!merchant && merchantId) {
        console.log('Fetching fresh merchant data for ID:', merchantId);
        setLoading(true);
        setError(null);
        
        try {
          const freshMerchantData = await merchantService.getMerchantById(merchantId);
          console.log('Fresh merchant data received:', freshMerchantData);
          setMerchant(freshMerchantData);
        } catch (err) {
          console.error('Error fetching merchant data:', err);
          setError('Failed to load merchant details');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchMerchantData();
  }, [merchantId, merchant]);

  // Safe access to merchant properties with fallbacks
  const merchantName = merchant?.name || 'Unknown Merchant';
  const merchantRating = typeof merchant?.rating === 'number' ? merchant.rating : 0;
  const merchantDiscount = merchant?.discount || 'No discount available';
  const merchantDescription = merchant?.description || 'No description available';
  const merchantAddress = merchant?.address || 'Address not available';
  const merchantContact = merchant?.contact || '';

  // Use branches from merchant data instead of making separate API call
  const branches = merchant?.branches || (merchant as any)?.locations || [];
  const branchLoading = loading; // Use the same loading state as merchant
  const branchError = error; // Use the same error state as merchant

  // Log branch data for debugging
  console.log('Merchant branches data:', {
    merchantId: merchant?.id,
    branchesCount: branches.length,
    branches: branches
  });

  // Show loading state while fetching merchant data
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={Colors.card} barStyle="dark-content" />
        <Header title="Loading..." showBackButton />
        
        <View style={styles.loadingContainer}>
          <MaterialIcons name="hourglass-empty" size={48} color={Colors.primary} />
          <Text style={styles.loadingText}>Loading merchant details...</Text>
          <Text style={styles.loadingSubtext}>Please wait while we fetch the latest information</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show error state if merchant data failed to load
  if (error || !merchant) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={Colors.card} barStyle="dark-content" />
        <Header title="Error" showBackButton />
        
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={48} color={Colors.textLight} />
          <Text style={styles.errorText}>Failed to load merchant</Text>
          <Text style={styles.errorSubtext}>{error || 'Merchant not found'}</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Create discount types from the fresh merchant data
  const discountTypes = [
    { type: 'Regular', description: merchantDiscount, icon: 'local-offer' },
    ...((merchant as any).weekend_discount ? [{ type: 'Weekend Special', description: (merchant as any).weekend_discount, icon: 'event' }] : []),
    ...((merchant as any).family_discount ? [{ type: 'Family Package', description: (merchant as any).family_discount, icon: 'people' }] : []),
    ...((merchant as any).student_discount ? [{ type: 'Student Discount', description: (merchant as any).student_discount, icon: 'school' }] : []),
  ];

  const mainBranch = branches.find((branch: any) => branch.isMainBranch || branch.is_main) || branches[0];

  const handleCall = (contact?: string) => {
    const phoneNumber = contact || merchantContact;
    if (phoneNumber) {
      Linking.openURL(`tel:${phoneNumber}`);
    }
  };

  const handleMap = (address?: string) => {
    const location = encodeURIComponent(address || merchantAddress);
    if (location) {
      Linking.openURL(`https://maps.google.com/?q=${location}`);
    }
  };

  const handleWebsite = () => {
    if (merchant.website) {
      const url = merchant.website.startsWith('http') ? merchant.website : `https://${merchant.website}`;
      Linking.openURL(url);
    }
  };

  const renderOverviewTab = () => (
    <>
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.quickActionButton} onPress={() => handleCall()}>
          <View style={[styles.quickActionIcon, { backgroundColor: `${Colors.primary}15` }]}>
            <MaterialIcons name="phone" size={22} color={Colors.primary} />
          </View>
          <Text style={styles.quickActionText}>Call</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.quickActionButton} onPress={() => handleMap()}>
          <View style={[styles.quickActionIcon, { backgroundColor: `${Colors.secondary}15` }]}>
            <MaterialIcons name="map" size={22} color={Colors.secondary} />
          </View>
          <Text style={styles.quickActionText}>Directions</Text>
        </TouchableOpacity>
        
        {merchant.website && (
          <TouchableOpacity style={styles.quickActionButton} onPress={handleWebsite}>
            <View style={[styles.quickActionIcon, { backgroundColor: `${Colors.info}15` }]}>
              <MaterialIcons name="language" size={22} color={Colors.info} />
            </View>
            <Text style={styles.quickActionText}>Website</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity style={styles.quickActionButton}>
          <View style={[styles.quickActionIcon, { backgroundColor: `${Colors.warning}15` }]}>
            <MaterialIcons name="share" size={22} color={Colors.warning} />
          </View>
          <Text style={styles.quickActionText}>Share</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.card}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="info-outline" size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>About</Text>
          </View>
          <Text style={styles.description}>{merchantDescription}</Text>
          
          {merchant.establishedYear && (
            <View style={styles.establishedContainer}>
              <MaterialIcons name="event" size={16} color={Colors.textLight} />
              <Text style={styles.establishedText}>Established in {merchant.establishedYear}</Text>
            </View>
          )}
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="local-offer" size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Available Discounts</Text>
          </View>
          <View style={styles.discountTypesContainer}>
            {discountTypes.map((discount, index) => (
              <View key={index} style={styles.discountTypeCard}>
                <View style={styles.discountTypeIconContainer}>
                  <MaterialIcons name={discount.icon as any} size={20} color={Colors.primary} />
                </View>
                <View style={styles.discountTypeContent}>
                  <Text style={styles.discountTypeTitle}>{discount.type}</Text>
                  <Text style={styles.discountTypeDescription}>{discount.description}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
        
        {mainBranch && (
          <>
            <View style={styles.divider} />
            
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <MaterialIcons name="store" size={20} color={Colors.primary} />
                <Text style={styles.sectionTitle}>Main Branch</Text>
              </View>
              <View style={styles.mainBranchContainer}>
                <View style={styles.branchInfo}>
                  <Text style={styles.branchName}>{mainBranch.area}</Text>
                  <View style={styles.branchDetail}>
                    <MaterialIcons name="location-on" size={16} color={Colors.textLight} />
                    <Text style={styles.branchAddress}>{mainBranch.address}</Text>
                  </View>
                  <View style={styles.branchDetail}>
                    <MaterialIcons name="phone" size={16} color={Colors.textLight} />
                    <Text style={styles.branchContact}>{mainBranch.contact}</Text>
                  </View>
                  <View style={styles.branchDetail}>
                    <MaterialIcons name="access-time" size={16} color={Colors.textLight} />
                    <Text style={styles.branchHours}>{mainBranch.operatingHours?.weekdays || 'Contact for hours'}</Text>
                  </View>
                </View>
                
                <View style={styles.branchActions}>
                  <TouchableOpacity style={styles.branchActionButton} onPress={() => handleCall(mainBranch.contact)}>
                    <MaterialIcons name="phone" size={18} color="white" />
                    <Text style={styles.branchActionText}>Call</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.branchActionButton, { backgroundColor: Colors.secondary }]} onPress={() => handleMap(mainBranch.address)}>
                    <MaterialIcons name="directions" size={18} color="white" />
                    <Text style={styles.branchActionText}>Directions</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </>
        )}
      </View>
    </>
  );

  const renderBranchesTab = () => {
    if (branchLoading) {
      return (
        <View style={styles.branchesContainer}>
          <View style={styles.branchesHeader}>
            <Text style={styles.branchesTitle}>Loading Branches...</Text>
            <Text style={styles.branchesSubtitle}>Please wait while we fetch branch information</Text>
          </View>
          
          {/* Render shimmer skeletons */}
          {[1, 2, 3].map((index) => (
            <BranchCardSkeleton key={index} />
          ))}
        </View>
      );
    }

    if (branchError) {
      return (
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={48} color={Colors.textLight} />
          <Text style={styles.errorText}>Failed to load branches</Text>
          <Text style={styles.errorSubtext}>Please try again later</Text>
          <Text style={styles.debugText}>Error: {branchError}</Text>
        </View>
      );
    }

    if (branches.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="store" size={48} color={Colors.textLight} />
          <Text style={styles.emptyText}>No branches found</Text>
          <Text style={styles.emptySubtext}>Branch information may be updated soon</Text>
        </View>
      );
    }

    return (
      <View style={styles.branchesContainer}>
        <View style={styles.branchesHeader}>
          <Text style={styles.branchesTitle}>All Branches ({branches.length})</Text>
          <Text style={styles.branchesSubtitle}>Find the nearest location</Text>
        </View>
        
        {branches.map((branch: any, index: number) => (
          <BranchCard
            key={branch.id || index}
            branch={branch}
            showCallButton={true}
            showDirectionsButton={true}
          />
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={Colors.card} barStyle="dark-content" />
      <Header title={merchantName} showBackButton />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.merchantHeader}>
          <View style={styles.merchantIconContainer}>
            <Text style={styles.merchantIconText}>{merchantName.charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={styles.merchantName}>{merchantName}</Text>
          
          {merchantRating > 0 && (
            <View style={styles.ratingContainer}>
              <MaterialIcons name="star" size={20} color={Colors.warning} />
              <Text style={styles.rating}>{merchantRating.toFixed(1)}</Text>
            </View>
          )}
          
          <View style={styles.discountBadge}>
            <MaterialIcons name="local-offer" size={20} color="white" />
            <Text style={styles.discountText}>{merchantDiscount}</Text>
          </View>

          <View style={styles.branchCountContainer}>
            <MaterialIcons name="store" size={16} color={Colors.primary} />
            <Text style={styles.branchCountText}>
              {branchLoading ? 'Loading...' : `${branches.length} ${branches.length === 1 ? 'Branch' : 'Branches'}`}
            </Text>
          </View>
        </View>
        
        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, selectedTab === 'overview' && styles.activeTab]}
            onPress={() => setSelectedTab('overview')}
          >
            <Text style={[styles.tabText, selectedTab === 'overview' && styles.activeTabText]}>
              Overview
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, selectedTab === 'branches' && styles.activeTab]}
            onPress={() => setSelectedTab('branches')}
          >
            <Text style={[styles.tabText, selectedTab === 'branches' && styles.activeTabText]}>
              Branches {branchLoading ? '' : `(${branches.length})`}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {selectedTab === 'overview' ? renderOverviewTab() : renderBranchesTab()}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  loadingSubtext: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
  },
  merchantHeader: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  merchantIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: `${Colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  merchantIconText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  merchantName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${Colors.warning}15`,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 12,
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.warning,
    marginLeft: 6,
  },
  discountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 12,
  },
  discountText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    marginLeft: 6,
  },
  branchCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${Colors.primary}10`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  branchCountText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary,
    marginLeft: 6,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 4,
    ...Platform.select({
      ios: {
        shadowColor: Colors.cardShadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textLight,
  },
  activeTabText: {
    color: 'white',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    marginHorizontal: 16,
    backgroundColor: Colors.card,
    borderRadius: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: Colors.cardShadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  quickActionButton: {
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    color: Colors.text,
    fontWeight: '500',
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    margin: 16,
    ...Platform.select({
      ios: {
        shadowColor: Colors.cardShadow,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 5,
      },
    }),
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
    marginBottom: 12,
  },
  establishedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${Colors.background}80`,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  establishedText: {
    fontSize: 13,
    color: Colors.textLight,
    marginLeft: 6,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 16,
  },
  discountTypesContainer: {
    marginTop: 8,
  },
  discountTypeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${Colors.background}80`,
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  discountTypeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${Colors.primary}10`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  discountTypeContent: {
    flex: 1,
  },
  discountTypeTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  discountTypeDescription: {
    fontSize: 13,
    color: Colors.textLight,
  },
  mainBranchContainer: {
    backgroundColor: `${Colors.background}80`,
    borderRadius: 12,
    padding: 16,
  },
  branchInfo: {
    marginBottom: 16,
  },
  branchName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  branchDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  branchAddress: {
    fontSize: 14,
    color: Colors.text,
    marginLeft: 8,
    flex: 1,
  },
  branchContact: {
    fontSize: 14,
    color: Colors.text,
    marginLeft: 8,
  },
  branchHours: {
    fontSize: 14,
    color: Colors.text,
    marginLeft: 8,
  },
  branchActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  branchActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
    justifyContent: 'center',
  },
  branchActionText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
    marginLeft: 6,
  },
  branchesContainer: {
    paddingBottom: 24,
  },
  branchesHeader: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  branchesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  branchesSubtitle: {
    fontSize: 14,
    color: Colors.textLight,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    minHeight: 200,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
    marginBottom: 8,
  },
  debugText: {
    fontSize: 12,
    color: Colors.warning,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    minHeight: 200,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
  },
});

export default MerchantDetailScreen;
