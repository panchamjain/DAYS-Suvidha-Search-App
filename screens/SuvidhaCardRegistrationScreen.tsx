import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import Colors from '../constants/Colors';

interface Child {
  id: string;
  name: string;
  dateOfBirth: string;
  bloodGroup: string;
}

const SuvidhaCardRegistrationScreen = () => {
  const navigation = useNavigation();
  
  // Personal Information
  const [name, setName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [pinCode, setPinCode] = useState('');
  
  // Marriage Information
  const [isMarried, setIsMarried] = useState<boolean | null>(null);
  const [spouseName, setSpouseName] = useState('');
  const [spouseDateOfBirth, setSpouseDateOfBirth] = useState('');
  const [spouseBloodGroup, setSpouseBloodGroup] = useState('');
  
  // Children Information
  const [children, setChildren] = useState<Child[]>([]);

  const genderOptions = ['Male', 'Female', 'Other'];
  const bloodGroupOptions = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const handlePhotoUpload = () => {
    Alert.alert(
      'Upload Photo',
      'Choose an option',
      [
        { text: 'Camera', onPress: () => console.log('Camera selected') },
        { text: 'Gallery', onPress: () => console.log('Gallery selected') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const addChild = () => {
    const newChild: Child = {
      id: Date.now().toString(),
      name: '',
      dateOfBirth: '',
      bloodGroup: '',
    };
    setChildren([...children, newChild]);
  };

  const removeChild = (id: string) => {
    setChildren(children.filter(child => child.id !== id));
  };

  const updateChild = (id: string, field: keyof Child, value: string) => {
    setChildren(children.map(child => 
      child.id === id ? { ...child, [field]: value } : child
    ));
  };

  const handleSubmit = () => {
    // Basic validation
    if (!name || !dateOfBirth || !gender || !phoneNumber || !email || !address || !pinCode) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (isMarried && (!spouseName || !spouseDateOfBirth || !spouseBloodGroup)) {
      Alert.alert('Error', 'Please fill in all spouse details');
      return;
    }

    // Check if all children have complete information
    const incompleteChild = children.find(child => !child.name || !child.dateOfBirth || !child.bloodGroup);
    if (incompleteChild) {
      Alert.alert('Error', 'Please complete all child information or remove incomplete entries');
      return;
    }

    Alert.alert(
      'Application Submitted',
      'Your DAYS Suvidha Card application has been submitted successfully. You will receive a confirmation email shortly.',
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  const renderDropdown = (
    value: string,
    onSelect: (value: string) => void,
    options: string[],
    placeholder: string
  ) => (
    <TouchableOpacity
      style={styles.dropdownContainer}
      onPress={() => {
        Alert.alert(
          'Select ' + placeholder,
          '',
          options.map(option => ({
            text: option,
            onPress: () => onSelect(option),
          })).concat([{ text: 'Cancel', style: 'cancel' }])
        );
      }}
    >
      <Text style={[styles.dropdownText, !value && styles.placeholderText]}>
        {value || placeholder}
      </Text>
      <MaterialIcons name="arrow-drop-down" size={24} color={Colors.textLight} />
    </TouchableOpacity>
  );

  const renderMarriageToggle = () => (
    <View style={styles.toggleContainer}>
      <Text style={styles.label}>Are you married? *</Text>
      <View style={styles.toggleButtons}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            isMarried === true && styles.toggleButtonActive,
          ]}
          onPress={() => setIsMarried(true)}
        >
          <Text style={[
            styles.toggleButtonText,
            isMarried === true && styles.toggleButtonTextActive,
          ]}>
            Yes
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            isMarried === false && styles.toggleButtonActive,
          ]}
          onPress={() => setIsMarried(false)}
        >
          <Text style={[
            styles.toggleButtonText,
            isMarried === false && styles.toggleButtonTextActive,
          ]}>
            No
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderChildCard = (child: Child, index: number) => (
    <View key={child.id} style={styles.childCard}>
      <View style={styles.childHeader}>
        <Text style={styles.childTitle}>Child {index + 1}</Text>
        <TouchableOpacity
          onPress={() => removeChild(child.id)}
          style={styles.removeButton}
        >
          <MaterialIcons name="close" size={20} color={Colors.error} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Child's Name *</Text>
        <TextInput
          style={styles.input}
          value={child.name}
          onChangeText={(text) => updateChild(child.id, 'name', text)}
          placeholder="Enter child's name"
          placeholderTextColor={Colors.textLight}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Date of Birth *</Text>
        <TextInput
          style={styles.input}
          value={child.dateOfBirth}
          onChangeText={(text) => updateChild(child.id, 'dateOfBirth', text)}
          placeholder="DD/MM/YYYY"
          placeholderTextColor={Colors.textLight}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Blood Group *</Text>
        {renderDropdown(
          child.bloodGroup,
          (value) => updateChild(child.id, 'bloodGroup', value),
          bloodGroupOptions,
          'Select blood group'
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={Colors.card} barStyle="dark-content" />
      <Header title="Suvidha Card Registration" showBackButton />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Header Section */}
          <View style={styles.headerSection}>
            <View style={styles.cardIcon}>
              <MaterialIcons name="card-membership" size={40} color="white" />
            </View>
            <Text style={styles.headerTitle}>DAYS Suvidha Card</Text>
            <Text style={styles.headerSubtitle}>
              Fill in your details to apply for exclusive discounts across Ahmedabad
            </Text>
          </View>

          {/* Personal Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name *</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter your full name"
                placeholderTextColor={Colors.textLight}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Date of Birth *</Text>
              <TextInput
                style={styles.input}
                value={dateOfBirth}
                onChangeText={setDateOfBirth}
                placeholder="DD/MM/YYYY"
                placeholderTextColor={Colors.textLight}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Gender *</Text>
              {renderDropdown(gender, setGender, genderOptions, 'Select gender')}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Blood Group</Text>
              {renderDropdown(bloodGroup, setBloodGroup, bloodGroupOptions, 'Select blood group')}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Photo Upload</Text>
              <TouchableOpacity style={styles.photoUpload} onPress={handlePhotoUpload}>
                {photo ? (
                  <Image source={{ uri: photo }} style={styles.photoPreview} />
                ) : (
                  <>
                    <MaterialIcons name="camera-alt" size={32} color={Colors.primary} />
                    <Text style={styles.photoUploadText}>Tap to upload photo</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Contact Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number *</Text>
              <TextInput
                style={styles.input}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholder="Enter your phone number"
                placeholderTextColor={Colors.textLight}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address *</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email address"
                placeholderTextColor={Colors.textLight}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Address *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={address}
                onChangeText={setAddress}
                placeholder="Enter your complete address"
                placeholderTextColor={Colors.textLight}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Pin Code *</Text>
              <TextInput
                style={styles.input}
                value={pinCode}
                onChangeText={setPinCode}
                placeholder="Enter pin code"
                placeholderTextColor={Colors.textLight}
                keyboardType="numeric"
                maxLength={6}
              />
            </View>
          </View>

          {/* Marriage Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Family Information</Text>
            
            {renderMarriageToggle()}

            {isMarried && (
              <View style={styles.spouseSection}>
                <Text style={styles.subsectionTitle}>Spouse Details</Text>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Spouse's Name *</Text>
                  <TextInput
                    style={styles.input}
                    value={spouseName}
                    onChangeText={setSpouseName}
                    placeholder="Enter spouse's name"
                    placeholderTextColor={Colors.textLight}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Spouse's Date of Birth *</Text>
                  <TextInput
                    style={styles.input}
                    value={spouseDateOfBirth}
                    onChangeText={setSpouseDateOfBirth}
                    placeholder="DD/MM/YYYY"
                    placeholderTextColor={Colors.textLight}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Spouse's Blood Group *</Text>
                  {renderDropdown(
                    spouseBloodGroup,
                    setSpouseBloodGroup,
                    bloodGroupOptions,
                    'Select blood group'
                  )}
                </View>
              </View>
            )}

            {/* Children Section */}
            <View style={styles.childrenSection}>
              <View style={styles.childrenHeader}>
                <Text style={styles.subsectionTitle}>Children Details</Text>
                <TouchableOpacity style={styles.addChildButton} onPress={addChild}>
                  <MaterialIcons name="add" size={20} color="white" />
                  <Text style={styles.addChildText}>Add Child</Text>
                </TouchableOpacity>
              </View>

              {children.map((child, index) => renderChildCard(child, index))}
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <MaterialIcons name="send" size={24} color="white" />
            <Text style={styles.submitButtonText}>Submit Application</Text>
          </TouchableOpacity>

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
  headerSection: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  cardIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 22,
  },
  section: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 20,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
    marginTop: 8,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  dropdownContainer: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 16,
    color: Colors.text,
  },
  placeholderText: {
    color: Colors.textLight,
  },
  photoUpload: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoPreview: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  photoUploadText: {
    fontSize: 14,
    color: Colors.primary,
    marginTop: 8,
    fontWeight: '500',
  },
  toggleContainer: {
    marginBottom: 16,
  },
  toggleButtons: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  toggleButtonActive: {
    backgroundColor: Colors.primary,
  },
  toggleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textLight,
  },
  toggleButtonTextActive: {
    color: 'white',
  },
  spouseSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  childrenSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  childrenHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addChildButton: {
    backgroundColor: Colors.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addChildText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 6,
  },
  childCard: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  childHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  childTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: `${Colors.error}15`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  bottomSpacing: {
    height: 20,
  },
});

export default SuvidhaCardRegistrationScreen;