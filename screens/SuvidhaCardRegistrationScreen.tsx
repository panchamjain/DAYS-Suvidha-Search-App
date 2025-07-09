import React, { useState, useEffect } from 'react';
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
  Modal,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Calendar } from 'react-native-calendars';
import Header from '../components/Header';
import Colors from '../constants/Colors';

interface FormField {
  id: string;
  name: string;
  type: 'text' | 'email' | 'phone' | 'date' | 'select' | 'textarea' | 'file';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    message?: string;
  };
}

interface FormSection {
  id: string;
  title: string;
  icon: string;
  fields: FormField[];
  conditional?: {
    dependsOn: string;
    value: any;
  };
}

interface FormSchema {
  title: string;
  description: string;
  sections: FormSection[];
}

interface Child {
  id: string;
  [key: string]: any;
}

interface ValidationErrors {
  [key: string]: string | { [key: string]: { [key: string]: string } };
}

const SuvidhaCardRegistrationScreen = () => {
  const navigation = useNavigation();
  
  // Form schema and data
  const [formSchema, setFormSchema] = useState<FormSchema | null>(null);
  const [formData, setFormData] = useState<{ [key: string]: any }>({});
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Calendar modal state
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDateField, setSelectedDateField] = useState<string>('');
  const [selectedChildId, setSelectedChildId] = useState<string>('');

  // Fetch form schema from API
  useEffect(() => {
    fetchFormSchema();
  }, []);

  const fetchFormSchema = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://www.daysahmedabad.com/api/suvidha/form-schema/');
      
      if (!response.ok) {
        throw new Error('Failed to fetch form schema');
      }
      
      const schema = await response.json();
      setFormSchema(schema);
      
      // Initialize form data with empty values
      const initialData: { [key: string]: any } = {};
      schema.sections.forEach((section: FormSection) => {
        section.fields.forEach((field: FormField) => {
          initialData[field.id] = '';
        });
      });
      setFormData(initialData);
      
    } catch (error) {
      console.error('Error fetching form schema:', error);
      Alert.alert(
        'Error',
        'Failed to load form. Please check your internet connection and try again.',
        [{ text: 'Retry', onPress: fetchFormSchema }]
      );
    } finally {
      setLoading(false);
    }
  };

  // Validation functions
  const validateField = (field: FormField, value: any): string | undefined => {
    if (field.required && (!value || value.toString().trim() === '')) {
      return `${field.label} is required`;
    }

    if (!value || value.toString().trim() === '') {
      return undefined;
    }

    const stringValue = value.toString().trim();

    // Type-specific validation
    switch (field.type) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(stringValue)) {
          return 'Please enter a valid email address';
        }
        break;
      
      case 'phone':
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(stringValue.replace(/\s+/g, ''))) {
          return 'Please enter a valid 10-digit mobile number';
        }
        break;
      
      case 'date':
        const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
        if (!dateRegex.test(stringValue)) {
          return 'Please select a valid date';
        }
        
        const [, day, month, year] = stringValue.match(dateRegex) || [];
        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        const today = new Date();
        
        if (date > today) {
          return 'Date cannot be in the future';
        }
        if (today.getFullYear() - date.getFullYear() > 120) {
          return 'Please enter a valid date';
        }
        break;
    }

    // Custom validation rules
    if (field.validation) {
      if (field.validation.minLength && stringValue.length < field.validation.minLength) {
        return field.validation.message || `Minimum ${field.validation.minLength} characters required`;
      }
      
      if (field.validation.maxLength && stringValue.length > field.validation.maxLength) {
        return field.validation.message || `Maximum ${field.validation.maxLength} characters allowed`;
      }
      
      if (field.validation.pattern) {
        const regex = new RegExp(field.validation.pattern);
        if (!regex.test(stringValue)) {
          return field.validation.message || 'Invalid format';
        }
      }
    }

    return undefined;
  };

  const handleFieldChange = (fieldId: string, value: any, childId?: string) => {
    if (childId) {
      // Handle child field changes
      setChildren(prev => prev.map(child => 
        child.id === childId ? { ...child, [fieldId]: value } : child
      ));
      
      // Validate child field
      const field = getChildField(fieldId);
      if (field) {
        const error = validateField(field, value);
        setErrors(prev => ({
          ...prev,
          children: {
            ...((prev.children as { [key: string]: { [key: string]: string } }) || {}),
            [childId]: {
              ...((prev.children as { [key: string]: { [key: string]: string } })?.[childId] || {}),
              [fieldId]: error || ''
            }
          }
        }));
      }
    } else {
      // Handle main form field changes
      setFormData(prev => ({ ...prev, [fieldId]: value }));
      
      // Validate field
      const field = getFieldById(fieldId);
      if (field) {
        const error = validateField(field, value);
        setErrors(prev => ({ ...prev, [fieldId]: error || '' }));
      }
    }
  };

  const getFieldById = (fieldId: string): FormField | undefined => {
    if (!formSchema) return undefined;
    
    for (const section of formSchema.sections) {
      const field = section.fields.find(f => f.id === fieldId);
      if (field) return field;
    }
    return undefined;
  };

  const getChildField = (fieldId: string): FormField | undefined => {
    // Assuming child fields follow a pattern like 'child_name', 'child_dob', etc.
    const baseFieldId = fieldId.replace('child_', '');
    return getFieldById(baseFieldId) || {
      id: fieldId,
      name: fieldId,
      type: fieldId.includes('dob') ? 'date' : fieldId.includes('blood') ? 'select' : 'text',
      label: fieldId.replace('child_', '').replace('_', ' '),
      required: true
    } as FormField;
  };

  const handleDateSelect = (date: string) => {
    const formattedDate = new Date(date).toLocaleDateString('en-GB');
    
    if (selectedChildId) {
      handleFieldChange(selectedDateField, formattedDate, selectedChildId);
    } else {
      handleFieldChange(selectedDateField, formattedDate);
    }
    
    setShowCalendar(false);
    setSelectedDateField('');
    setSelectedChildId('');
  };

  const openCalendar = (fieldId: string, childId?: string) => {
    setSelectedDateField(fieldId);
    setSelectedChildId(childId || '');
    setShowCalendar(true);
  };

  const addChild = () => {
    const newChild: Child = {
      id: Date.now().toString(),
      child_name: '',
      child_dob: '',
      child_blood_group: '',
    };
    setChildren([...children, newChild]);
  };

  const removeChild = (id: string) => {
    setChildren(children.filter(child => child.id !== id));
    // Remove child errors
    setErrors(prev => {
      const newErrors = { ...prev };
      if (newErrors.children && typeof newErrors.children === 'object') {
        delete (newErrors.children as { [key: string]: any })[id];
      }
      return newErrors;
    });
  };

  const shouldShowSection = (section: FormSection): boolean => {
    if (!section.conditional) return true;
    
    const dependentValue = formData[section.conditional.dependsOn];
    return dependentValue === section.conditional.value;
  };

  const handleSubmit = async () => {
    if (!formSchema) return;
    
    setIsSubmitting(true);
    
    // Validate all fields
    const newErrors: ValidationErrors = {};
    let hasErrors = false;
    
    // Validate main form fields
    formSchema.sections.forEach(section => {
      if (shouldShowSection(section)) {
        section.fields.forEach(field => {
          const error = validateField(field, formData[field.id]);
          if (error) {
            newErrors[field.id] = error;
            hasErrors = true;
          }
        });
      }
    });
    
    // Validate children
    const childrenErrors: { [key: string]: { [key: string]: string } } = {};
    children.forEach(child => {
      const childErrors: { [key: string]: string } = {};
      
      ['child_name', 'child_dob', 'child_blood_group'].forEach(fieldId => {
        const field = getChildField(fieldId);
        if (field) {
          const error = validateField(field, child[fieldId]);
          if (error) {
            childErrors[fieldId] = error;
            hasErrors = true;
          }
        }
      });
      
      if (Object.keys(childErrors).length > 0) {
        childrenErrors[child.id] = childErrors;
      }
    });
    
    if (Object.keys(childrenErrors).length > 0) {
      newErrors.children = childrenErrors;
    }
    
    setErrors(newErrors);
    
    if (hasErrors) {
      setIsSubmitting(false);
      Alert.alert('Validation Error', 'Please fix the errors in the form');
      return;
    }

    // Simulate API submission
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        'Application Submitted! 🎉',
        'Your DAYS Suvidha Card application has been submitted successfully. You will receive a confirmation email shortly.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    }, 2000);
  };

  const renderInput = (
    field: FormField,
    value: string,
    error?: string,
    childId?: string
  ) => {
    const handleChange = (text: string) => {
      handleFieldChange(field.id, text, childId);
    };

    const handleBlur = () => {
      const fieldError = validateField(field, value);
      if (childId) {
        setErrors(prev => ({
          ...prev,
          children: {
            ...((prev.children as { [key: string]: { [key: string]: string } }) || {}),
            [childId]: {
              ...((prev.children as { [key: string]: { [key: string]: string } })?.[childId] || {}),
              [field.id]: fieldError || ''
            }
          }
        }));
      } else {
        setErrors(prev => ({ ...prev, [field.id]: fieldError || '' }));
      }
    };

    if (field.type === 'date') {
      return (
        <View>
          <TouchableOpacity
            style={[
              styles.input,
              error && styles.inputError,
              value && styles.inputFilled
            ]}
            onPress={() => openCalendar(field.id, childId)}
          >
            <Text style={[
              styles.inputText,
              !value && styles.placeholderText,
              value && styles.filledText
            ]}>
              {value || field.placeholder || 'Select date'}
            </Text>
            <MaterialIcons 
              name="calendar-today" 
              size={20} 
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
    }

    if (field.type === 'select') {
      return (
        <View>
          <TouchableOpacity
            style={[
              styles.input,
              error && styles.inputError,
              value && styles.inputFilled
            ]}
            onPress={() => {
              if (field.options) {
                Alert.alert(
                  `Select ${field.label}`,
                  '',
                  field.options.map(option => ({
                    text: option,
                    onPress: () => handleChange(option),
                  })).concat([{ text: 'Cancel', onPress: () => {} }])
                );
              }
            }}
          >
            <Text style={[
              styles.inputText,
              !value && styles.placeholderText,
              value && styles.filledText
            ]}>
              {value || field.placeholder || `Select ${field.label}`}
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
    }

    if (field.type === 'file') {
      return (
        <TouchableOpacity 
          style={styles.photoUpload} 
          onPress={() => {
            Alert.alert(
              'Upload Photo',
              'Choose an option',
              [
                { text: 'Camera', onPress: () => console.log('Camera selected') },
                { text: 'Gallery', onPress: () => console.log('Gallery selected') },
                { text: 'Cancel', onPress: () => {} },
              ]
            );
          }}
        >
          {value ? (
            <Image source={{ uri: value }} style={styles.photoPreview} />
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
      );
    }

    return (
      <View>
        <TextInput
          style={[
            styles.input,
            field.type === 'textarea' && styles.textArea,
            error && styles.inputError,
            value && styles.inputFilled
          ]}
          value={value}
          onChangeText={handleChange}
          onBlur={handleBlur}
          placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
          placeholderTextColor={Colors.textLight}
          keyboardType={
            field.type === 'email' ? 'email-address' :
            field.type === 'phone' ? 'phone-pad' : 'default'
          }
          multiline={field.type === 'textarea'}
          numberOfLines={field.type === 'textarea' ? 3 : 1}
          maxLength={field.validation?.maxLength}
          autoCapitalize={field.type === 'email' ? 'none' : 'words'}
        />
        {error && (
          <View style={styles.errorContainer}>
            <MaterialIcons name="error-outline" size={16} color={Colors.error} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
      </View>
    );
  };

  const renderSection = (section: FormSection) => {
    if (!shouldShowSection(section)) return null;

    return (
      <View key={section.id} style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialIcons name={section.icon as any} size={24} color={Colors.primary} />
          <Text style={styles.sectionTitle}>{section.title}</Text>
        </View>
        
        {section.fields.map(field => (
          <View key={field.id} style={styles.inputGroup}>
            <Text style={styles.label}>
              {field.label} {field.required && '*'}
            </Text>
            {renderInput(field, formData[field.id] || '', errors[field.id] as string)}
          </View>
        ))}
      </View>
    );
  };

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
          { id: 'child_name', name: 'child_name', type: 'text', label: 'Child Name', required: true },
          child.child_name || '',
          ((errors.children as { [key: string]: { [key: string]: string } })?.[child.id]?.child_name),
          child.id
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Date of Birth *</Text>
        {renderInput(
          { id: 'child_dob', name: 'child_dob', type: 'date', label: 'Date of Birth', required: true },
          child.child_dob || '',
          ((errors.children as { [key: string]: { [key: string]: string } })?.[child.id]?.child_dob),
          child.id
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Blood Group *</Text>
        {renderInput(
          { 
            id: 'child_blood_group', 
            name: 'child_blood_group', 
            type: 'select', 
            label: 'Blood Group', 
            required: true,
            options: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
          },
          child.child_blood_group || '',
          ((errors.children as { [key: string]: { [key: string]: string } })?.[child.id]?.child_blood_group),
          child.id
        )}
      </View>
    </Animated.View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={Colors.primary} barStyle="light-content" />
        <Header title="Suvidha Card Registration" showBackButton />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading form...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!formSchema) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={Colors.primary} barStyle="light-content" />
        <Header title="Suvidha Card Registration" showBackButton />
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={64} color={Colors.error} />
          <Text style={styles.errorTitle}>Failed to Load Form</Text>
          <Text style={styles.errorMessage}>Please check your internet connection and try again.</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchFormSchema}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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
              <Text style={styles.headerTitle}>{formSchema.title}</Text>
              <Text style={styles.headerSubtitle}>{formSchema.description}</Text>
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

          {/* Dynamic Form Sections */}
          {formSchema.sections.map(renderSection)}

          {/* Children Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="child-care" size={24} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Children Details</Text>
            </View>
            
            <View style={styles.childrenHeader}>
              <Text style={styles.subsectionTitle}>Add Children Information</Text>
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
                <Text style={styles.emptyChildrenSubtext}>Tap &quot;Add Child&quot; to include children details</Text>
              </View>
            )}
          </View>

          {/* Submit Button */}
          <TouchableOpacity 
            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]} 
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <View style={styles.submitButtonContent}>
                <ActivityIndicator size={24} color="white" />
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

      {/* Calendar Modal */}
      <Modal
        visible={showCalendar}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCalendar(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.calendarModal}>
            <View style={styles.calendarHeader}>
              <Text style={styles.calendarTitle}>Select Date</Text>
              <TouchableOpacity
                onPress={() => setShowCalendar(false)}
                style={styles.closeButton}
              >
                <MaterialIcons name="close" size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>
            <Calendar
              onDayPress={(day) => handleDateSelect(day.dateString)}
              maxDate={new Date().toISOString().split('T')[0]}
              theme={{
                backgroundColor: Colors.card,
                calendarBackground: Colors.card,
                textSectionTitleColor: Colors.text,
                selectedDayBackgroundColor: Colors.primary,
                selectedDayTextColor: 'white',
                todayTextColor: Colors.primary,
                dayTextColor: Colors.text,
                textDisabledColor: Colors.textLight,
                dotColor: Colors.primary,
                selectedDotColor: 'white',
                arrowColor: Colors.primary,
                monthTextColor: Colors.text,
                indicatorColor: Colors.primary,
                textDayFontWeight: '500',
                textMonthFontWeight: 'bold',
                textDayHeaderFontWeight: '600',
              }}
            />
          </View>
        </View>
      </Modal>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.text,
    marginTop: 16,
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 16,
    color: Colors.textLight,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
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
  subsectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputText: {
    fontSize: 16,
    flex: 1,
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
  placeholderText: {
    color: Colors.textLight,
  },
  filledText: {
    color: Colors.text,
    fontWeight: '500',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarModal: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    margin: 20,
    maxWidth: 400,
    width: '90%',
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SuvidhaCardRegistrationScreen;