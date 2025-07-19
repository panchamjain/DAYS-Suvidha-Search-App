import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, ScrollView, TouchableOpacity, Image, Linking } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Header from '../components/Header';
import Colors from '../constants/Colors';

interface TrusteeMember {
  id: string;
  name: string;
  designation: string;
  image?: string;
  description?: string;
  email?: string;
  phone?: string;
}

interface RegularMember {
  id: string;
  name: string;
  post: string;
  image?: string;
  department?: string;
}

interface Developer {
  id: string;
  name: string;
  role: string;
  image?: string;
  skills: string[];
  social?: {
    github?: string;
    linkedin?: string;
    email?: string;
  };
}

const AboutScreen = () => {
  // Mock data for trustees - replace with actual data
  const trustees: TrusteeMember[] = [
    {
      id: '1',
      name: 'Shri Rajesh Patel',
      designation: 'Chairman & Managing Trustee',
      description: 'Leading DAYS Trust with over 20 years of community service experience in Ahmedabad.',
      email: 'rajesh.patel@daystrust.org',
      phone: '+91 98765 43210',
    },
    {
      id: '2',
      name: 'Smt. Priya Shah',
      designation: 'Vice Chairperson',
      description: 'Dedicated to social welfare and community development initiatives across Gujarat.',
      email: 'priya.shah@daystrust.org',
      phone: '+91 98765 43211',
    },
    {
      id: '3',
      name: 'Shri Amit Kumar',
      designation: 'Secretary & Treasurer',
      description: 'Managing financial operations and administrative affairs of the trust with transparency.',
      email: 'amit.kumar@daystrust.org',
      phone: '+91 98765 43212',
    },
    {
      id: '4',
      name: 'Dr. Meera Joshi',
      designation: 'Trustee Member',
      description: 'Healthcare professional committed to community wellness and medical outreach programs.',
      email: 'meera.joshi@daystrust.org',
      phone: '+91 98765 43213',
    },
  ];

  // Mock data for regular members - replace with actual data
  const regularMembers: RegularMember[] = [
    { id: '1', name: 'Kiran Desai', post: 'Community Coordinator', department: 'Operations' },
    { id: '2', name: 'Rahul Mehta', post: 'Event Manager', department: 'Programs' },
    { id: '3', name: 'Sneha Patel', post: 'Social Media Manager', department: 'Marketing' },
    { id: '4', name: 'Vikram Singh', post: 'Technical Lead', department: 'Technology' },
    { id: '5', name: 'Anjali Sharma', post: 'Volunteer Coordinator', department: 'Community' },
    { id: '6', name: 'Deepak Agarwal', post: 'Finance Assistant', department: 'Finance' },
    { id: '7', name: 'Ritu Gupta', post: 'Program Manager', department: 'Programs' },
    { id: '8', name: 'Suresh Yadav', post: 'Operations Head', department: 'Operations' },
    { id: '9', name: 'Kavita Jain', post: 'Communications Lead', department: 'Marketing' },
  ];

  // Developer information
  const developer: Developer = {
    id: 'dev1',
    name: 'DAYS Development Team',
    role: 'Mobile App Developer',
    skills: ['React Native', 'TypeScript', 'UI/UX Design', 'API Integration'],
    social: {
      email: 'dev@daysahmedabad.com',
      github: 'https://github.com/daysahmedabad',
      linkedin: 'https://linkedin.com/company/days-ahmedabad',
    },
  };

  const handleContactPress = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleEmailPress = (email: string) => {
    Linking.openURL(`mailto:${email}`);
  };

  const handleSocialPress = (url: string) => {
    Linking.openURL(url);
  };

  const renderModernTrusteeCard = (trustee: TrusteeMember, index: number) => (
    <View key={trustee.id} style={[styles.modernTrusteeCard, index % 2 === 1 && styles.trusteeCardOffset]}>
      <View style={styles.trusteeCardHeader}>
        <View style={styles.trusteeAvatarContainer}>
          {trustee.image ? (
            <Image source={{ uri: trustee.image }} style={styles.trusteeAvatar} />
          ) : (
            <View style={styles.trusteeAvatarPlaceholder}>
              <Text style={styles.trusteeAvatarText}>
                {trustee.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
              </Text>
            </View>
          )}
          <View style={styles.trusteeStatusBadge}>
            <MaterialIcons name="verified" size={12} color="white" />
          </View>
        </View>
        <View style={styles.trusteeHeaderInfo}>
          <Text style={styles.trusteeName}>{trustee.name}</Text>
          <Text style={styles.trusteeDesignation}>{trustee.designation}</Text>
        </View>
      </View>
      
      <Text style={styles.trusteeDescription}>{trustee.description}</Text>
      
      <View style={styles.trusteeActions}>
        {trustee.email && (
          <TouchableOpacity 
            style={styles.trusteeActionButton}
            onPress={() => handleEmailPress(trustee.email!)}
          >
            <MaterialIcons name="email" size={16} color={Colors.primary} />
          </TouchableOpacity>
        )}
        {trustee.phone && (
          <TouchableOpacity 
            style={styles.trusteeActionButton}
            onPress={() => handleContactPress(trustee.phone!)}
          >
            <MaterialIcons name="phone" size={16} color={Colors.primary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderModernMemberCard = (member: RegularMember) => (
    <View key={member.id} style={styles.modernMemberCard}>
      <View style={styles.memberCardTop}>
        <View style={styles.memberAvatarContainer}>
          {member.image ? (
            <Image source={{ uri: member.image }} style={styles.memberAvatar} />
          ) : (
            <View style={styles.memberAvatarPlaceholder}>
              <Text style={styles.memberAvatarText}>
                {member.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.memberDepartmentBadge}>
          <Text style={styles.memberDepartmentText}>{member.department}</Text>
        </View>
      </View>
      
      <View style={styles.memberCardContent}>
        <Text style={styles.memberName}>{member.name}</Text>
        <Text style={styles.memberPost}>{member.post}</Text>
      </View>
    </View>
  );

  const renderDeveloperCard = () => (
    <View style={styles.developerCard}>
      <View style={styles.developerHeader}>
        <View style={styles.developerIconContainer}>
          <MaterialIcons name="code" size={32} color={Colors.primary} />
        </View>
        <View style={styles.developerInfo}>
          <Text style={styles.developerName}>{developer.name}</Text>
          <Text style={styles.developerRole}>{developer.role}</Text>
        </View>
        <View style={styles.developerBadge}>
          <MaterialIcons name="star" size={16} color="white" />
        </View>
      </View>
      
      <Text style={styles.developerDescription}>
        Crafted with passion and precision, this app represents our commitment to delivering 
        exceptional digital experiences for the DAYS community.
      </Text>
      
      <View style={styles.skillsContainer}>
        <Text style={styles.skillsTitle}>Technologies Used:</Text>
        <View style={styles.skillsGrid}>
          {developer.skills.map((skill, index) => (
            <View key={index} style={styles.skillChip}>
              <Text style={styles.skillText}>{skill}</Text>
            </View>
          ))}
        </View>
      </View>
      
      <View style={styles.developerActions}>
        {developer.social?.email && (
          <TouchableOpacity 
            style={styles.developerActionButton}
            onPress={() => handleEmailPress(developer.social!.email!)}
          >
            <MaterialIcons name="email" size={20} color="white" />
          </TouchableOpacity>
        )}
        {developer.social?.github && (
          <TouchableOpacity 
            style={styles.developerActionButton}
            onPress={() => handleSocialPress(developer.social!.github!)}
          >
            <MaterialIcons name="code" size={20} color="white" />
          </TouchableOpacity>
        )}
        {developer.social?.linkedin && (
          <TouchableOpacity 
            style={styles.developerActionButton}
            onPress={() => handleSocialPress(developer.social!.linkedin!)}
          >
            <MaterialIcons name="business" size={20} color="white" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={Colors.card} barStyle="dark-content" />
      <Header title="About DAYS Trust" showBackButton />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Organization Header */}
        <View style={styles.organizationHeader}>
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <MaterialIcons name="account-balance" size={48} color="white" />
            </View>
            <View style={styles.logoGlow} />
          </View>
          <Text style={styles.organizationName}>DAYS Trust</Text>
          <Text style={styles.organizationTagline}>
            Dedicated to Ahmedabad&apos;s Youth & Social Development
          </Text>
          <View style={styles.establishedBadge}>
            <MaterialIcons name="event" size={16} color={Colors.primary} />
            <Text style={styles.establishedText}>Established 2010</Text>
          </View>
        </View>

        {/* Mission & Vision Card */}
        <View style={styles.missionCard}>
          <View style={styles.missionHeader}>
            <MaterialIcons name="flag" size={24} color={Colors.primary} />
            <Text style={styles.missionTitle}>Our Mission & Vision</Text>
          </View>
          <Text style={styles.missionText}>
            DAYS Trust is committed to fostering community development, youth empowerment, and social welfare in Ahmedabad. 
            We believe in creating opportunities for growth, education, and sustainable development while preserving our 
            cultural heritage and values.
          </Text>
          <View style={styles.valuesContainer}>
            <View style={styles.valueItem}>
              <MaterialIcons name="favorite" size={20} color={Colors.error} />
              <Text style={styles.valueText}>Community Service</Text>
            </View>
            <View style={styles.valueItem}>
              <MaterialIcons name="school" size={20} color={Colors.info} />
              <Text style={styles.valueText}>Education</Text>
            </View>
            <View style={styles.valueItem}>
              <MaterialIcons name="eco" size={20} color={Colors.success} />
              <Text style={styles.valueText}>Sustainability</Text>
            </View>
          </View>
        </View>

        {/* Modern Trustee Members Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="supervisor-account" size={28} color={Colors.primary} />
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>Board of Trustees</Text>
              <Text style={styles.sectionSubtitle}>Leadership team guiding our mission</Text>
            </View>
          </View>
          
          <View style={styles.modernTrusteesContainer}>
            {trustees.map((trustee, index) => renderModernTrusteeCard(trustee, index))}
          </View>
        </View>

        {/* Modern Team Members Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="groups" size={28} color={Colors.secondary} />
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>Team Members</Text>
              <Text style={styles.sectionSubtitle}>Dedicated individuals making a difference</Text>
            </View>
          </View>
          
          <View style={styles.modernMembersGrid}>
            {regularMembers.map(renderModernMemberCard)}
          </View>
        </View>

        {/* Impact Statistics */}
        <View style={styles.impactSection}>
          <Text style={styles.impactTitle}>Our Impact</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>15+</Text>
              <Text style={styles.statLabel}>Years of Service</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>10K+</Text>
              <Text style={styles.statLabel}>Lives Touched</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>50+</Text>
              <Text style={styles.statLabel}>Programs</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>500+</Text>
              <Text style={styles.statLabel}>Partners</Text>
            </View>
          </View>
        </View>

        {/* Developer Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="developer-mode" size={28} color={Colors.warning} />
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>App Development</Text>
              <Text style={styles.sectionSubtitle}>Meet the team behind this app</Text>
            </View>
          </View>
          
          {renderDeveloperCard()}
        </View>

        {/* Contact Information */}
        <View style={styles.contactCard}>
          <View style={styles.contactHeader}>
            <MaterialIcons name="contact-mail" size={24} color={Colors.primary} />
            <Text style={styles.contactTitle}>Get in Touch</Text>
          </View>
          <Text style={styles.contactDescription}>
            Connect with us to learn more about our initiatives or to get involved in our community programs.
          </Text>
          
          <View style={styles.contactInfo}>
            <View style={styles.contactItem}>
              <MaterialIcons name="location-on" size={20} color={Colors.textLight} />
              <Text style={styles.contactText}>Ahmedabad, Gujarat, India</Text>
            </View>
            <View style={styles.contactItem}>
              <MaterialIcons name="email" size={20} color={Colors.textLight} />
              <Text style={styles.contactText}>info@daystrust.org</Text>
            </View>
            <View style={styles.contactItem}>
              <MaterialIcons name="phone" size={20} color={Colors.textLight} />
              <Text style={styles.contactText}>+91 79 1234 5678</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.joinButton}>
            <MaterialIcons name="volunteer-activism" size={20} color="white" />
            <Text style={styles.joinButtonText}>Join Our Mission</Text>
          </TouchableOpacity>
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
  organizationHeader: {
    backgroundColor: Colors.primary,
    paddingVertical: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    position: 'relative',
    overflow: 'hidden',
  },
  logoContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  logo: {
    width: 96,
    height: 96,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  logoGlow: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    top: -12,
    left: -12,
    zIndex: 1,
  },
  organizationName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  organizationTagline: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  establishedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  establishedText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
    marginLeft: 6,
  },
  missionCard: {
    backgroundColor: Colors.card,
    borderRadius: 24,
    padding: 24,
    margin: 20,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  missionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  missionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginLeft: 12,
  },
  missionText: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 26,
    marginBottom: 20,
  },
  valuesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  valueItem: {
    alignItems: 'center',
    flex: 1,
  },
  valueText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 8,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  sectionTitleContainer: {
    marginLeft: 12,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.textLight,
  },
  // Modern Trustee Cards
  modernTrusteesContainer: {
    gap: 16,
  },
  modernTrusteeCard: {
    backgroundColor: Colors.card,
    borderRadius: 24,
    padding: 24,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
    borderWidth: 1,
    borderColor: `${Colors.primary}08`,
  },
  trusteeCardOffset: {
    marginLeft: 20,
  },
  trusteeCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  trusteeAvatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  trusteeAvatar: {
    width: 64,
    height: 64,
    borderRadius: 20,
  },
  trusteeAvatarPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: `${Colors.primary}20`,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: `${Colors.primary}30`,
  },
  trusteeAvatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  trusteeStatusBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.card,
  },
  trusteeHeaderInfo: {
    flex: 1,
  },
  trusteeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  trusteeDesignation: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  trusteeDescription: {
    fontSize: 14,
    color: Colors.textLight,
    lineHeight: 22,
    marginBottom: 16,
  },
  trusteeActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  trusteeActionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${Colors.primary}10`,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: `${Colors.primary}20`,
  },
  // Modern Member Cards
  modernMembersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  modernMemberCard: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 16,
    width: '31%',
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
    borderWidth: 1,
    borderColor: `${Colors.secondary}08`,
  },
  memberCardTop: {
    alignItems: 'center',
    marginBottom: 12,
    position: 'relative',
  },
  memberAvatarContainer: {
    marginBottom: 8,
  },
  memberAvatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
  },
  memberAvatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: `${Colors.secondary}20`,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: `${Colors.secondary}30`,
  },
  memberAvatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.secondary,
  },
  memberDepartmentBadge: {
    backgroundColor: `${Colors.secondary}15`,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  memberDepartmentText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.secondary,
  },
  memberCardContent: {
    alignItems: 'center',
  },
  memberName: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  memberPost: {
    fontSize: 11,
    color: Colors.textLight,
    textAlign: 'center',
    lineHeight: 14,
  },
  // Developer Card
  developerCard: {
    backgroundColor: Colors.card,
    borderRadius: 24,
    padding: 24,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 2,
    borderColor: `${Colors.warning}20`,
    position: 'relative',
    overflow: 'hidden',
  },
  developerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  developerIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: `${Colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 2,
    borderColor: `${Colors.primary}20`,
  },
  developerInfo: {
    flex: 1,
  },
  developerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  developerRole: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.warning,
  },
  developerBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.warning,
    justifyContent: 'center',
    alignItems: 'center',
  },
  developerDescription: {
    fontSize: 14,
    color: Colors.textLight,
    lineHeight: 22,
    marginBottom: 20,
    fontStyle: 'italic',
  },
  skillsContainer: {
    marginBottom: 20,
  },
  skillsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillChip: {
    backgroundColor: `${Colors.primary}10`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: `${Colors.primary}20`,
  },
  skillText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
  },
  developerActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  developerActionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  // Impact and Contact sections remain the same
  impactSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  impactTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    width: '48%',
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statNumber: {
    fontSize: 28,
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
  contactCard: {
    backgroundColor: Colors.card,
    borderRadius: 24,
    padding: 24,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  contactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  contactTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginLeft: 12,
  },
  contactDescription: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 24,
    marginBottom: 20,
  },
  contactInfo: {
    marginBottom: 24,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactText: {
    fontSize: 14,
    color: Colors.text,
    marginLeft: 12,
  },
  joinButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  joinButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  bottomSpacing: {
    height: 40,
  },
});

export default AboutScreen;