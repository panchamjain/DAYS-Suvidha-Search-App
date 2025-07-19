import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import Colors from '../constants/Colors';

interface FormItem {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'active' | 'inactive' | 'coming_soon';
  icon: keyof typeof MaterialIcons.glyphMap;
  estimatedTime: string;
  lastUpdated: string;
  submissionCount: number;
  route?: string;
  isNew?: boolean;
  isPriority?: boolean;
}

const FormsScreen = () => {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Mock data for forms - replace with actual API data
  const [forms, setForms] = useState<FormItem[]>([
    {
      id: '1',
      title: 'DAYS Suvidha Card Registration',
      description: 'Register for the DAYS Suvidha Card to access exclusive discounts and benefits across Ahmedabad.',
      category: 'membership',
      status: 'active',
      icon: 'card-membership',
      estimatedTime: '5-10 min',
      lastUpdated: '2024-01-15',
      submissionCount: 1247,
      route: 'SuvidhaCardRegistration',
      isNew: false,
      isPriority: true,
    },
    {
      id: '2',
      title: 'Event Registration',
      description: 'Register for upcoming DAYS events, workshops, and community gatherings.',
      category: 'events',
      status: 'active',
      icon: 'event',
      estimatedTime: '3-5 min',
      lastUpdated: '2024-01-12',
      submissionCount: 892,
      isNew: true,
    },
    {
      id: '3',
      title: 'Volunteer Application',
      description: 'Join our volunteer program and contribute to community development initiatives.',
      category: 'volunteer',
      status: 'active',
      icon: 'volunteer-activism',
      estimatedTime: '8-12 min',
      lastUpdated: '2024-01-10',
      submissionCount: 456,
    },
    {
      id: '4',
      title: 'Scholarship Application',
      description: 'Apply for educational scholarships and financial assistance programs.',
      category: 'education',
      status: 'active',
      icon: 'school',
      estimatedTime: '15-20 min',
      lastUpdated: '2024-01-08',
      submissionCount: 234,
      isPriority: true,
    },
    {
      id: '5',
      title: 'Business Partnership',
      description: 'Partner with DAYS Trust for business collaborations and CSR initiatives.',
      category: 'business',
      status: 'active',
      icon: 'business',
      estimatedTime: '10-15 min',
      lastUpdated: '2024-01-05',
      submissionCount: 123,
    },
    {
      id: '6',
      title: 'Feedback & Suggestions',
      description: 'Share your feedback and suggestions to help us improve our services.',
      category: 'feedback',
      status: 'active',
      icon: 'feedback',
      estimatedTime: '2-3 min',
      lastUpdated: '2024-01-03',
      submissionCount: 678,
    },
    {
      id: '7',
      title: 'Medical Camp Registration',
      description: 'Register for free medical camps and health checkup programs.',
      category: 'health',
      status: 'coming_soon',
      icon: 'local-hospital',
      estimatedTime: '5-7 min',
      lastUpdated: '2024-01-01',
      submissionCount: 0,
      isNew: true,
    },
    {
      id: '8',
      title: 'Donation Form',
      description: 'Make donations to support our community development programs.',
      category: 'donation',
      status: 'active',
      icon: 'favorite',
      estimatedTime: '3-5 min',
      lastUpdated: '2023-12-28',
      submissionCount: 567,
    },
  ]);

  const categories = [
    { id: 'all', name: 'All Forms', icon: 'apps' as keyof typeof MaterialIcons.glyphMap },
    { id: 'membership', name: 'Membership', icon: 'card-membership' as keyof typeof MaterialIcons.glyphMap },
    { id: 'events', name: 'Events', icon: 'event' as keyof typeof MaterialIcons.glyphMap },
    { id: 'volunteer', name: 'Volunteer', icon: 'volunteer-activism' as keyof typeof MaterialIcons.glyphMap },
    { id: 'education', name: 'Education', icon: 'school' as keyof typeof MaterialIcons.glyphMap },
    { id: 'business', name: 'Business', icon: 'business' as keyof typeof MaterialIcons.glyphMap },
    { id: 'health', name: 'Health', icon: 'local-hospital' as keyof typeof MaterialIcons.glyphMap },
    { id: 'feedback', name: 'Feedback', icon: 'feedback' as keyof typeof MaterialIcons.glyphMap },
    { id: 'donation', name: 'Donation', icon: 'favorite' as keyof typeof MaterialIcons.glyphMap },
  ];

  const filteredForms = selectedCategory === 'all' 
    ? forms 
    : forms.filter(form => form.category === selectedCategory);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleFormPress = (form: FormItem) => {
    if (form.status === 'coming_soon') {
      // Show coming soon message
      return;
    }
    
    if (form.route) {
      navigation.navigate(form.route as never);
    } else {
      // Navigate to a generic form screen or show message
      console.log(`Opening form: ${form.title}`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return Colors.success;
      case 'inactive': return Colors.textLight;
      case 'coming_soon': return Colors.warning;
      default: return Colors.textLight;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Active';
      case 'inactive': return 'Inactive';
      case 'coming_soon': return 'Coming Soon';
      default: return 'Unknown';
    }
  };

  const renderCategoryFilter = () => (
    <View style={styles.categoryContainer}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryScrollContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryChip,
              selectedCategory === category.id && styles.categoryChipActive
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <MaterialIcons 
              name={category.icon} 
              size={16} 
              color={selectedCategory === category.id ? 'white' : Colors.primary} 
            />
            <Text style={[
              styles.categoryChipText,
              selectedCategory === category.id && styles.categoryChipTextActive
            ]}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderFormCard = (form: FormItem) => (
    <TouchableOpacity
      key={form.id}
      style={[
        styles.formCard,
        form.isPriority && styles.priorityFormCard,
        form.status === 'coming_soon' && styles.comingSoonFormCard
      ]}
      onPress={() => handleFormPress(form)}
      disabled={form.status === 'coming_soon'}
    >
      {/* Priority Badge */}
      {form.isPriority && (
        <View style={styles.priorityBadge}>
          <MaterialIcons name="star" size={12} color="white" />
          <Text style={styles.priorityText}>Priority</Text>
        </View>
      )}

      {/* New Badge */}
      {form.isNew && (
        <View style={styles.newBadge}>
          <Text style={styles.newText}>New</Text>
        </View>
      )}

      <View style={styles.formCardHeader}>
        <View style={[
          styles.formIconContainer,
          { backgroundColor: `${Colors.primary}15` }
        ]}>
          <MaterialIcons 
            name={form.icon} 
            size={24} 
            color={form.status === 'coming_soon' ? Colors.textLight : Colors.primary} 
          />
        </View>
        
        <View style={styles.formHeaderInfo}>
          <Text style={[
            styles.formTitle,
            form.status === 'coming_soon' && styles.comingSoonText
          ]}>
            {form.title}
          </Text>
          <View style={styles.statusContainer}>
            <View style={[styles.statusDot, { backgroundColor: getStatusColor(form.status) }]} />
            <Text style={[styles.statusText, { color: getStatusColor(form.status) }]}>
              {getStatusText(form.status)}
            </Text>
          </View>
        </View>
      </View>

      <Text style={[
        styles.formDescription,
        form.status === 'coming_soon' && styles.comingSoonText
      ]}>
        {form.description}
      </Text>

      <View style={styles.formFooter}>
        <View style={styles.formMetrics}>
          <View style={styles.metricItem}>
            <MaterialIcons name="access-time" size={14} color={Colors.textLight} />
            <Text style={styles.metricText}>{form.estimatedTime}</Text>
          </View>
          <View style={styles.metricItem}>
            <MaterialIcons name="people" size={14} color={Colors.textLight} />
            <Text style={styles.metricText}>{form.submissionCount.toLocaleString()}</Text>
          </View>
        </View>
        
        <View style={styles.formAction}>
          {form.status === 'coming_soon' ? (
            <View style={styles.comingSoonButton}>
              <Text style={styles.comingSoonButtonText}>Coming Soon</Text>
            </View>
          ) : (
            <View style={styles.fillButton}>
              <Text style={styles.fillButtonText}>Fill Form</Text>
              <MaterialIcons name="arrow-forward" size={16} color="white" />
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderStatsHeader = () => (
    <View style={styles.statsContainer}>
      <View style={styles.statCard}>
        <Text style={styles.statNumber}>{forms.filter(f => f.status === 'active').length}</Text>
        <Text style={styles.statLabel}>Active Forms</Text>
      </View>
      <View style={styles.statCard}>
        <Text style={styles.statNumber}>{forms.reduce((sum, f) => sum + f.submissionCount, 0).toLocaleString()}</Text>
        <Text style={styles.statLabel}>Total Submissions</Text>
      </View>
      <View style={styles.statCard}>
        <Text style={styles.statNumber}>{forms.filter(f => f.isNew).length}</Text>
        <Text style={styles.statLabel}>New Forms</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={Colors.card} barStyle="dark-content" />
      <Header title="DAYS Forms" showBackButton />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.headerContent}>
            <MaterialIcons name="description" size={32} color={Colors.primary} />
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>Available Forms</Text>
              <Text style={styles.headerSubtitle}>
                Complete forms to access DAYS services and programs
              </Text>
            </View>
          </View>
        </View>

        {/* Stats Header */}
        {renderStatsHeader()}

        {/* Category Filter */}
        {renderCategoryFilter()}

        {/* Forms List */}
        <View style={styles.formsContainer}>
          <View style={styles.formsHeader}>
            <Text style={styles.formsTitle}>
              {selectedCategory === 'all' ? 'All Forms' : categories.find(c => c.id === selectedCategory)?.name}
            </Text>
            <Text style={styles.formsCount}>
              {filteredForms.length} form{filteredForms.length !== 1 ? 's' : ''}
            </Text>
          </View>
          
          {filteredForms.map(renderFormCard)}
        </View>

        <View style={styles.bottomSpacing} />
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
  headerSection: {
    backgroundColor: Colors.card,
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    marginLeft: 16,
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.textLight,
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textLight,
    textAlign: 'center',
    fontWeight: '500',
  },
  categoryContainer: {
    marginBottom: 24,
  },
  categoryScrollContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: `${Colors.primary}20`,
    gap: 6,
  },
  categoryChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  categoryChipTextActive: {
    color: 'white',
  },
  formsContainer: {
    paddingHorizontal: 20,
  },
  formsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  formsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  formsCount: {
    fontSize: 14,
    color: Colors.textLight,
    fontWeight: '500',
  },
  formCard: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
    borderWidth: 1,
    borderColor: `${Colors.border}30`,
    position: 'relative',
  },
  priorityFormCard: {
    borderColor: `${Colors.warning}40`,
    borderWidth: 2,
  },
  comingSoonFormCard: {
    opacity: 0.7,
  },
  priorityBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: Colors.warning,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    zIndex: 1,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'white',
  },
  newBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: Colors.success,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  newText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'white',
  },
  formCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  formIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  formHeaderInfo: {
    flex: 1,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  formDescription: {
    fontSize: 14,
    color: Colors.textLight,
    lineHeight: 20,
    marginBottom: 16,
  },
  comingSoonText: {
    opacity: 0.6,
  },
  formFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  formMetrics: {
    flexDirection: 'row',
    gap: 16,
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metricText: {
    fontSize: 12,
    color: Colors.textLight,
    fontWeight: '500',
  },
  formAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fillButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 6,
  },
  fillButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  comingSoonButton: {
    backgroundColor: `${Colors.warning}20`,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: `${Colors.warning}40`,
  },
  comingSoonButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.warning,
  },
  bottomSpacing: {
    height: 40,
  },
});

export default FormsScreen;