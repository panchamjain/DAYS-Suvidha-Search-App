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
  Animated,
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

interface ValidationErrors {
  name?: string;
  dateOfBirth?: string;
  gender?: string;
  phoneNumber?: string;
  email?: string;
  address?: string;
  pinCode?: string;
  spouseName?: string;
  spouseDateOfBirth?: string;
  spouseBloodGroup?: string;
  children?: { [key: string]: { name?: string; dateOfBirth?: string; bloodGroup?: string } };
}

const SuvidhaCardRegistrationScreen = () => {
  const navigation = useNavigation();
  
  // Personal Information
  const [name, setName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [photo] = useState<string | null>(null);
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
  
  // Validation
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const genderOptions = ['Male', 'Female', 'Other'];
  const bloodGroupOptions = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  // Validation functions
  const validateName = (value: string): string | undefined => {
    if (!value.trim()) return 'Name is required';
    if (value.trim().length < 2) return 'Name must be at least 2 characters';
    if (!/^[a-zA-Z\s]+$/.test(value)) return 'Name can only contain letters and spaces';
    return undefined;
  };

  const validateDateOfBirth = (value: string): string | undefined => {
    if (!value.trim()) return 'Date of birth is required';
    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!dateRegex.test(value)) return 'Please use DD/MM/YYYY format';
    
    const [, day, month, year] = value.match(dateRegex) || [];
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const today = new Date();
    
    if (date > today) return 'Date cannot be in the future';
    if (today.getFullYear() - date.getFullYear() > 120) return 'Please enter a valid date';
    
    return undefined;
  };

  const validatePhoneNumber = (value: string): string | undefined => {
    if (!value.trim()) return 'Phone number is required';
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(value.replace(/\s+/g, ''))) return 'Please enter a valid 10-digit mobile number';
    return undefined;
  };

  const validateEmail = (value: string): string | undefined => {
    if (!value.trim()) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return 'Please enter a valid email address';
    return undefined;
  };

  const validateAddress = (value: string): string | undefined => {
    if (!value.trim()) return 'Address is required';
    if (value.trim().length < 10) return 'Please enter a complete address';
    return undefined;
  };

  const validatePinCode = (value: string): string | undefined => {
    if (!value.trim()) return 'Pin code is required';
    if (!/^\d{6}$/.test(value)) return 'Pin code must be 6 digits';
    return undefined;
  };

  const validateField = (field: string, value: string) => {
    let error: string | undefined;
    
    switch (field) {
      case 'name':
        error = validateName(value);
        break;
      case 'dateOfBirth':
        error = validateDateOfBirth(value);
        break;
      case 'phoneNumber':
        error = validatePhoneNumber(value);
        break;
      case 'email':
        error = validateEmail(value);
        break;
      case 'address':
        error = validateAddress(value);
        break;
      case 'pinCode':
        error = validatePinCode(value);
        break;
      case 'spouseName':
        error = isMarried ? validateName(value) : undefined;
        break;
      case 'spouseDateOfBirth':
        error = isMarried ? validateDateOfBirth(value) : undefined;
        break;
    }
    
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handlePhotoUpload = () => {
    Alert.alert(
      'Upload Photo',
      'Choose an option',
      [
        { text: 'Camera', onPress: () => console.log('Camera selected') },
        { text: 'Gallery', onPress: () => console.log('Gallery selected') },
        { text: 'Cancel', onPress: () => {} },
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
    // Remove child errors
    setErrors(prev => {
      const newErrors = { ...prev };
      if (newErrors.children) {
        delete newErrors.children[id];
      }
      return newErrors;
    });
  };

  const updateChild = (id: string, field: keyof Child, value: string) => {
    setChildren(children.map(child => 
      child.id === id ? { ...child, [field]: value } : child
    ));
    
    // Validate child field
    if (field === 'name') {
      const error = validateName(value);
      setErrors(prev => ({
        ...prev,
        children: {
          ...prev.children,
          [id]: { ...prev.children?.[id], name: error }
        }
      }));
    } else if (field === 'dateOfBirth') {
      const error = validateDateOfBirth(value);
      setErrors(prev => ({
        ...prev,
        children: {
          ...prev.children,
          [id]: { ...prev.children?.[id], dateOfBirth: error }
        }
      }));
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Validate all fields
    const newErrors: ValidationErrors = {};
    
    newErrors.name = validateName(name);
    newErrors.dateOfBirth = validateDateOfBirth(dateOfBirth);
    if (!gender) newErrors.gender = 'Please select gender';
    newErrors.phoneNumber = validatePhoneNumber(phoneNumber);
    newErrors.email = validateEmail(email);
    newErrors.address = validateAddress(address);
    newErrors.pinCode = validatePinCode(pinCode);
    
    if (isMarried) {
      newErrors.spouseName = validateName(spouseName);
      newErrors.spouseDateOfBirth = validateDateOfBirth(spouseDateOfBirth);
      if (!spouseBloodGroup) newErrors.spouseBloodGroup = 'Please select blood group';
    }
    
    // Validate children
    const childrenErrors: { [key: string]: { name?: string; dateOfBirth?: string; bloodGroup?: string } } = {};
    children.forEach(child => {
      const childError: { name?: string; dateOfBirth?: string; bloodGroup?: string } = {};
      childError.name = validateName(child.name);
      childError.dateOfBirth = validateDateOfBirth(child.dateOfBirth);
      if (!child.bloodGroup) childError.bloodGroup = 'Please select blood group';
      
      if (childError.name || childError.dateOfBirth || childError.bloodGroup) {
        childrenErrors[child.id] = childError;
      }
    });
    
    if (Object.keys(childrenErrors).length > 0) {
      newErrors.children = childrenErrors;
    }
    
    // Remove undefined errors
    Object.keys(newErrors).forEach(key => {
      if (!newErrors[key as keyof ValidationErrors]) {
        delete newErrors[key as keyof ValidationErrors];
      }
    });
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      setIsSubmitting(false);
      Alert.alert('Validation Error', 'Please fix the errors in the form');
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        'Application Submitted! 🎉',
        'Your DAYS Suvidha Card application has been submitted successfully. You will receive a confirmation email shortly.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    }, 2000);
  };

  const renderDropdown = (
    value: string,
    onSelect: (value: string) => void,
    options: string[],
    placeholder: string,
    error?: string
  ) => (
    <View>
      <TouchableOpacity
        style={[
          styles.dropdownContainer,
          error && styles.inputError,
          value && styles.inputFilled
        ]}
        onPress={() => {
          Alert.alert(
            'Select ' + placeholder,
            '',
            options.map(option => ({
              text: option,
              onPress: () => onSelect(option),
            })).concat([{ text: 'Cancel', onPress: () => {} }])
          );
        }}
      >
        <Text style={[
          styles.dropdownText, 
          !value && styles.placeholderText,
          value && styles.filledText
        ]}>
          {value || placeholder}
        </Text>
        <MaterialIcons 
          name="arrow-drop-down" 
          size={24} 
          color={error ? Colors.error : value ? Colors.primary : Colors.textLight} 
        />
      </TouchableOpacity>
      {error && (
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={16} color={Colors.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );

  const renderInput = (
    value: string,
    onChangeText: (text: string) => void,
    placeholder: string,
    error?: string,
    keyboardType?: any,
    multiline?: boolean,
    maxLength?: number,
    autoCapitalize?: any,
    onBlur?: () => void
  ) => (
    <View>
      <TextInput
        style={[
          styles.input,
          multiline && styles.textArea,
          error && styles.inputError,
          value && styles.inputFilled
        ]}
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        placeholder={placeholder}
        placeholderTextColor={Colors.textLight}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
        maxLength={maxLength}
        autoCapitalize={autoCapitalize}
      />
      {error && (
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={16} color={Colors.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );

  const renderMarriageToggle = () => (
    <View style={styles.toggleContainer}>
      <Text style={styles.label}>Marital Status *</Text>
      <View style={styles.toggleButtons}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            isMarried === true && styles.toggleButtonActive,
          ]}
          onPress={() => {
            setIsMarried(true);
            setErrors(prev => ({ ...prev, gender: undefined }));
          }}
        >
          <MaterialIcons 
            name="favorite" 
            size={20} 
            color={isMarried === true ? 'white' : Colors.textLight} 
          />
          <Text style={[
            styles.toggleButtonText,
            isMarried === true && styles.toggleButtonTextActive,
          ]}>
            Married
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            isMarried === false && styles.toggleButtonActive,
          ]}
          onPress={() => {
            setIsMarried(false);
            setSpouseName('');
            setSpouseDateOfBirth('');
            setSpouseBloodGroup('');
            setErrors(prev => {
              const newErrors = { ...prev };
              delete newErrors.spouseName;
              delete newErrors.spouseDateOfBirth;
              delete newErrors.spouseBloodGroup;
              return newErrors;
            });
          }}
        >
          <MaterialIcons 
            name="person" 
            size={20} 
            color={isMarried === false ? 'white' : Colors.textLight} 
          />
          <Text style={[
            styles.toggleButtonText,
            isMarried === false && styles.toggleButtonTextActive,
          ]}>
            Single
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderChildCard = (child: Child, index: number) => (
    <Animated.View key={child.id} style={styles.childCard}>
      <View style={styles.childHeader}>
        <View style={styles.childTitleContainer}>
          <MaterialIcons name="child-care" size={24} color={Colors.primary} />
          <Text style={styles.childTitle}>Child {index + 1}</Text>
        </View>
        <TouchableOpacity
          onPress={() => removeChild(child.id)}
          style={styles.removeButton}
        >
          <MaterialIcons name="close" size={20} color={Colors.error} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Child&apos;s Name *</Text>
        {renderInput(
          child.name,
          (text) => updateChild(child.id, 'name', text),
          "Enter child's name",
          errors.children?.[child.id]?.name,
          'default',
          false,
          50,
          'words',
          () => validateField('name', child.name)
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Date of Birth *</Text>
        {renderInput(
          child.dateOfBirth,
          (text) => updateChild(child.id, 'dateOfBirth', text),
          'DD/MM/YYYY',
          errors.children?.[child.id]?.dateOfBirth,
          'numeric',
          false,
          10,
          'none',
          () => validateField('dateOfBirth', child.dateOfBirth)
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Blood Group *</Text>
        {renderDropdown(
          child.bloodGroup,
          (value) => updateChild(child.id, 'bloodGroup', value),
          bloodGroupOptions,
          'Select blood group',
          errors.children?.[child.id]?.bloodGroup
        )}
      </View>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={Colors.primary} barStyle="light-content" />
      <Header title="Suvidha Card Registration" showBackButton />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Modern Header Section */}
          <View style={styles.headerSection}>
            <View style={styles.headerGradient}>
              <View style={styles.cardIconContainer}>
                <View style={styles.cardIcon}>
                  <MaterialIcons name="card-membership" size={32} color="white" />
                </View>
                <View style={styles.cardIconRing} />
              </View>
              <Text style={styles.headerTitle}>DAYS Suvidha Card</Text>
              <Text style={styles.headerSubtitle}>
                Join thousands of members enjoying exclusive discounts across Ahmedabad
              </Text>
              <View style={styles.benefitsContainer}>
                <View style={styles.benefitItem}>
                  <MaterialIcons name="local-offer" size={16} color="rgba(255,255,255,0.9)" />
                  <Text style={styles.benefitText}>Exclusive Discounts</Text>
                </View>
                <View style={styles.benefitItem}>
                  <MaterialIcons name="verified" size={16} color="rgba(255,255,255,0.9)" />
                  <Text style={styles.benefitText}>Verified Merchants</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Personal Information */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="person" size={24} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Personal Information</Text>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name *</Text>
              {renderInput(
                name,
                setName,
                'Enter your full name',
                errors.name,
                'default',
                false,
                50,
                'words',
                () => validateField('name', name)
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Date of Birth *</Text>
              {renderInput(
                dateOfBirth,
                setDateOfBirth,
                'DD/MM/YYYY',
                errors.dateOfBirth,
                'numeric',
                false,
                10,
                'none',
                () => validateField('dateOfBirth', dateOfBirth)
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Gender *</Text>
              {renderDropdown(gender, setGender, genderOptions, 'Select gender', errors.gender)}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Blood Group</Text>
              {renderDropdown(bloodGroup, setBloodGroup, bloodGroupOptions, 'Select blood group (optional)')}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Photo Upload</Text>
              <TouchableOpacity style={styles.photoUpload} onPress={handlePhotoUpload}>
                {photo ? (
                  <Image source={{ uri: photo }} style={styles.photoPreview} />
                ) : (
                  <View style={styles.photoUploadContent}>
                    <View style={styles.photoIconContainer}>
                      <MaterialIcons name="camera-alt" size={28} color={Colors.primary} />
                    </View>
                    <Text style={styles.photoUploadText}>Tap to upload photo</Text>
                    <Text style={styles.photoUploadSubtext}>JPG, PNG up to 5MB</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Contact Information */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="contact-phone" size={24} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Contact Information</Text>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number *</Text>
              {renderInput(
                phoneNumber,
                setPhoneNumber,
                'Enter 10-digit mobile number',
                errors.phoneNumber,
                'phone-pad',
                false,
                10,
                'none',
                () => validateField('phoneNumber', phoneNumber)
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address *</Text>
              {renderInput(
                email,
                setEmail,
                'Enter your email address',
                errors.email,
                'email-address',
                false,
                100,
                'none',
                () => validateField('email', email)
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Address *</Text>
              {renderInput(
                address,
                setAddress,
                'Enter your complete address with landmark',
                errors.address,
                'default',
                true,
                200,
                'sentences',
                () => validateField('address', address)
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Pin Code *</Text>
              {renderInput(
                pinCode,
                setPinCode,
                'Enter 6-digit pin code',
                errors.pinCode,
                'numeric',
                false,
                6,
                'none',
                () => validateField('pinCode', pinCode)
              )}
            </View>
          </View>

          {/* Family Information */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="family-restroom" size={24} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Family Information</Text>
            </View>
            
            {renderMarriageToggle()}

            {isMarried && (
              <Animated.View style={styles.spouseSection}>
                <View style={styles.subsectionHeader}>
                  <MaterialIcons name="favorite" size={20} color={Colors.secondary} />
                  <Text style={styles.subsectionTitle}>Spouse Details</Text>
                </View>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Spouse&apos;s Name *</Text>
                  {renderInput(
                    spouseName,
                    setSpouseName,
                    "Enter spouse's name",
                    errors.spouseName,
                    'default',
                    false,
                    50,
                    'words',
                    () => validateField('spouseName', spouseName)
                  )}
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Spouse&apos;s Date of Birth *</Text>
                  {renderInput(
                    spouseDateOfBirth,
                    setSpouseDateOfBirth,
                    'DD/MM/YYYY',
                    errors.spouseDateOfBirth,
                    'numeric',
                    false,
                    10,
                    'none',
                    () => validateField('spouseDateOfBirth', spouseDateOfBirth)
                  )}
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Spouse&apos;s Blood Group *</Text>
                  {renderDropdown(
                    spouseBloodGroup,
                    setSpouseBloodGroup,
                    bloodGroupOptions,
                    'Select blood group',
                    errors.spouseBloodGroup
                  )}
                </View>
              </Animated.View>
            )}

            {/* Children Section */}
            <View style={styles.childrenSection}>
              <View style={styles.childrenHeader}>
                <View style={styles.subsectionHeader}>
                  <MaterialIcons name="child-care" size={20} color={Colors.info} />
                  <Text style={styles.subsectionTitle}>Children Details</Text>
                </View>
                <TouchableOpacity style={styles.addChildButton} onPress={addChild}>
                  <MaterialIcons name="add" size={18} color="white" />
                  <Text style={styles.addChildText}>Add Child</Text>
                </TouchableOpacity>
              </View>

              {children.map((child, index) => renderChildCard(child, index))}
              
              {children.length === 0 && (
                <View style={styles.emptyChildrenContainer}>
                  <MaterialIcons name="child-friendly" size={48} color={Colors.textLight} />
                  <Text style={styles.emptyChildrenText}>No children added yet</Text>
                  <Text style={styles.emptyChildrenSubtext}>Tap "Add Child" to include children details</Text>
                </View>
              )}
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity 
            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]} 
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <View style={styles.submitButtonContent}>
                <MaterialIcons name="hourglass-empty" size={24} color="white" />
                <Text style={styles.submitButtonText}>Submitting...</Text>
              </View>
            ) : (
              <View style={styles.submitButtonContent}>
                <MaterialIcons name="send" size={24} color="white" />
                <Text style={styles.submitButtonText}>Submit Application</Text>
              </View>
            )}
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
    marginBottom: 32,
  },
  headerGradient: {
    backgroundColor: Colors.primary,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  cardIconContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  cardIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  cardIconRing: {
    position: 'absolute',
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    top: -12,
    left: -12,
    zIndex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  benefitsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  benefitText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  section: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginLeft: 12,
  },
  subsectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  subsectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: 8,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 2,
    borderColor: Colors.border,
    transition: 'all 0.3s ease',
  },
  inputFilled: {
    borderColor: Colors.primary,
    backgroundColor: `${Colors.primary}05`,
  },
  inputError: {
    borderColor: Colors.error,
    backgroundColor: `${Colors.error}05`,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  dropdownContainer: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderWidth: 2,
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
  filledText: {
    color: Colors.text,
    fontWeight: '500',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 4,
  },
  errorText: {
    fontSize: 14,
    color: Colors.error,
    marginLeft: 6,
    flex: 1,
  },
  photoUpload: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoUploadContent: {
    alignItems: 'center',
  },
  photoIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: `${Colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  photoPreview: {
    width: '100%',
    height: '100%',
    borderRadius: 14,
  },
  photoUploadText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '600',
    marginBottom: 4,
  },
  photoUploadSubtext: {
    fontSize: 12,
    color: Colors.textLight,
  },
  toggleContainer: {
    marginBottom: 20,
  },
  toggleButtons: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 4,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  toggleButtonActive: {
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  toggleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textLight,
    marginLeft: 8,
  },
  toggleButtonTextActive: {
    color: 'white',
  },
  spouseSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  childrenSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  childrenHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  addChildButton: {
    backgroundColor: Colors.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  addChildText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 14,
  },
  childCard: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  childHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  childTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  childTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: 8,
  },
  removeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${Colors.error}15`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyChildrenContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyChildrenText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textLight,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyChildrenSubtext: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    paddingVertical: 20,
    marginTop: 12,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  submitButtonDisabled: {
    backgroundColor: Colors.textLight,
    shadowOpacity: 0.2,
  },
  submitButtonContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  bottomSpacing: {
    height: 40,
  },
});

export default SuvidhaCardRegistrationScreen;