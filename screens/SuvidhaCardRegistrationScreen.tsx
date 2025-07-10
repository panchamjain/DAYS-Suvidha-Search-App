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
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Calendar } from 'react-native-calendars';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import Header from '../components/Header';
import Colors from '../constants/Colors';

interface FormField {
  id: number;
  name: string;
  type: 'text' | 'email' | 'phone' | 'date' | 'select' | 'textarea' | 'file' | 'checkbox' | 'image' | 'toggle' | 'repeatable_group';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  fields?: FormField[]; // For repeatable_group
  visible_if?: {
    [key: string]: any;
  };
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

interface RepeatableGroupItem {
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
  const [repeatableGroups, setRepeatableGroups] = useState<{ [key: string]: RepeatableGroupItem[] }>({});
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Date picker state
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDateField, setSelectedDateField] = useState<string>('');
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');
  const [selectedGroupName, setSelectedGroupName] = useState<string>('');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tempDate, setTempDate] = useState(new Date());
  
  // Calendar modal state (fallback)
  const [showCalendar, setShowCalendar] = useState(false);

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
      const initialGroups: { [key: string]: RepeatableGroupItem[] } = {};
      
      schema.sections.forEach((section: FormSection) => {
        section.fields.forEach((field: FormField) => {
          if (field.type === 'checkbox') {
            initialData[field.name] = false;
          } else if (field.type === 'toggle' && field.options && field.options.length > 0) {
            initialData[field.name] = field.options[0]; // Set first option as active
          } else if (field.type === 'repeatable_group') {
            initialGroups[field.name] = [];
          } else {
            initialData[field.name] = '';
          }
        });
      });
      
      setFormData(initialData);
      setRepeatableGroups(initialGroups);
      
    } catch (error) {
      console.error('Error fetching form schema:', error);
      
      // Fallback to default schema
      const fallbackSchema: FormSchema = {
        title: 'DAYS Suvidha Card',
        description: 'Join thousands of members enjoying exclusive discounts across Ahmedabad',
        sections: [
          {
            id: 'personal',
            title: 'Personal Information',
            icon: 'person',
            fields: [
              { id: 1, name: 'name', type: 'text', label: 'Full Name', required: true, validation: { minLength: 2 } },
              { id: 2, name: 'dob', type: 'date', label: 'Date of Birth', required: true },
              { id: 3, name: 'gender', type: 'select', label: 'Gender', required: true, options: ['Male', 'Female', 'Other'] },
              { id: 4, name: 'blood_group', type: 'select', label: 'Blood Group', required: false, options: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
              { id: 5, name: 'photo', type: 'image', label: 'Photo Upload', required: false },
              { id: 6, name: 'terms', type: 'checkbox', label: 'I agree to terms and conditions', required: true }
            ]
          },
          {
            id: 'contact',
            title: 'Contact Information',
            icon: 'contact-phone',
            fields: [
              { id: 7, name: 'phone', type: 'phone', label: 'Phone Number', required: true, validation: { pattern: '^[6-9]\\d{9}$' } },
              { id: 8, name: 'email', type: 'email', label: 'Email Address', required: true },
              { id: 9, name: 'address', type: 'textarea', label: 'Full Address', required: true, validation: { minLength: 10 } },
              { id: 11, name: 'pincode', type: 'text', label: 'Pin Code', required: true, validation: { pattern: '^\\d{6}$' } }
            ]
          },
          {
            id: 'family',
            title: 'Family Information',
            icon: 'family-restroom',
            fields: [
              { id: 10, name: 'is_married', type: 'toggle', label: 'Marital Status', required: true, options: ['Single', 'Married'] }
            ]
          },
          {
            id: 'spouse',
            title: 'Spouse Details',
            icon: 'favorite',
            fields: [
              { id: 12, name: 'spouse_name', type: 'text', label: 'Spouse Name', required: true, validation: { minLength: 2 }, visible_if: { is_married: 'Married' } },
              { id: 13, name: 'spouse_dob', type: 'date', label: 'Spouse Date of Birth', required: true, visible_if: { is_married: 'Married' } },
              { id: 14, name: 'spouse_blood_group', type: 'select', label: 'Spouse Blood Group', required: true, options: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], visible_if: { is_married: 'Married' } }
            ]
          },
          {
            id: 'children',
            title: 'Children Information',
            icon: 'child-care',
            fields: [
              {
                id: 15,
                name: 'children',
                type: 'repeatable_group',
                label: 'Children Details',
                required: false,
                fields: [
                  { id: 16, name: 'child_name', type: 'text', label: 'Child Name', required: true },
                  { id: 17, name: 'child_dob', type: 'date', label: 'Date of Birth', required: true },
                  { id: 18, name: 'child_blood_group', type: 'select', label: 'Blood Group', required: true, options: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] }
                ]
              }
            ]
          }
        ]
      };
      
      setFormSchema(fallbackSchema);
      
      // Initialize form data with empty values
      const initialData: { [key: string]: any } = {};
      const initialGroups: { [key: string]: RepeatableGroupItem[] } = {};
      
      fallbackSchema.sections.forEach((section: FormSection) => {
        section.fields.forEach((field: FormField) => {
          if (field.type === 'checkbox') {
            initialData[field.name] = false;
          } else if (field.type === 'toggle' && field.options && field.options.length > 0) {
            initialData[field.name] = field.options[0]; // Set first option as active
          } else if (field.type === 'repeatable_group') {
            initialGroups[field.name] = [];
          } else {
            initialData[field.name] = '';
          }
        });
      });
      
      setFormData(initialData);
      setRepeatableGroups(initialGroups);
      
      Alert.alert(
        'Using Offline Form',
        'Could not connect to server. Using default form fields.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  // Validation functions
  const validateField = (field: FormField, value: any): string | undefined => {
    if (field.required && (
      (field.type === 'checkbox' && !value) ||
      (field.type !== 'checkbox' && (!value || value.toString().trim() === ''))
    )) {
      return `${field.label} is required`;
    }

    if (field.type === 'checkbox' || field.type === 'toggle') {
      return undefined; // Checkboxes and toggles only need required validation
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

  const handleFieldChange = (fieldName: string, value: any, groupId?: string, groupName?: string) => {
    if (groupId && groupName) {
      // Handle repeatable group field changes
      setRepeatableGroups(prev => ({
        ...prev,
        [groupName]: prev[groupName].map(item => 
          item.id === groupId ? { ...item, [fieldName]: value } : item
        )
      }));
      
      // Validate group field
      const field = getGroupField(fieldName, groupName);
      if (field) {
        const error = validateField(field, value);
        setErrors(prev => ({
          ...prev,
          [groupName]: {
            ...((prev[groupName] as { [key: string]: { [key: string]: string } }) || {}),
            [groupId]: {
              ...((prev[groupName] as { [key: string]: { [key: string]: string } })?.[groupId] || {}),
              [fieldName]: error || ''
            }
          }
        }));
      }
    } else {
      // Handle main form field changes
      setFormData(prev => ({ ...prev, [fieldName]: value }));
      
      // Validate field
      const field = getFieldByName(fieldName);
      if (field) {
        const error = validateField(field, value);
        setErrors(prev => ({ ...prev, [fieldName]: error || '' }));
      }
    }
  };

  const getFieldByName = (fieldName: string): FormField | undefined => {
    if (!formSchema) return undefined;
    
    for (const section of formSchema.sections) {
      const field = section.fields.find(f => f.name === fieldName);
      if (field) return field;
    }
    return undefined;
  };

  const getGroupField = (fieldName: string, groupName: string): FormField | undefined => {
    if (!formSchema) return undefined;
    
    for (const section of formSchema.sections) {
      const groupField = section.fields.find(f => f.name === groupName && f.type === 'repeatable_group');
      if (groupField && groupField.fields) {
        return groupField.fields.find(f => f.name === fieldName);
      }
    }
    return undefined;
  };

  const shouldShowField = (field: FormField): boolean => {
    if (!field.visible_if) return true;
    
    for (const [dependentField, expectedValue] of Object.entries(field.visible_if)) {
      const currentValue = formData[dependentField];
      if (currentValue !== expectedValue) {
        return false;
      }
    }
    return true;
  };

  const handleDateSelect = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setTempDate(selectedDate);
    }
    
    // Only close on Android when user cancels or selects
    if (Platform.OS === 'android') {
      if (event.type === 'dismissed') {
        setShowDatePicker(false);
        setSelectedDateField('');
        setSelectedGroupId('');
        setSelectedGroupName('');
      } else if (event.type === 'set' && selectedDate) {
        const formattedDate = selectedDate.toLocaleDateString('en-GB');
        
        if (selectedGroupId && selectedGroupName) {
          handleFieldChange(selectedDateField, formattedDate, selectedGroupId, selectedGroupName);
        } else {
          handleFieldChange(selectedDateField, formattedDate);
        }
        
        setShowDatePicker(false);
        setSelectedDateField('');
        setSelectedGroupId('');
        setSelectedGroupName('');
      }
    }
  };

  const handleDatePickerDone = () => {
    const formattedDate = tempDate.toLocaleDateString('en-GB');
    
    if (selectedGroupId && selectedGroupName) {
      handleFieldChange(selectedDateField, formattedDate, selectedGroupId, selectedGroupName);
    } else {
      handleFieldChange(selectedDateField, formattedDate);
    }
    
    setShowDatePicker(false);
    setSelectedDateField('');
    setSelectedGroupId('');
    setSelectedGroupName('');
  };

  const handleDatePickerCancel = () => {
    setShowDatePicker(false);
    setSelectedDateField('');
    setSelectedGroupId('');
    setSelectedGroupName('');
    setTempDate(currentDate);
  };

  const handleCalendarDateSelect = (date: string) => {
    const formattedDate = new Date(date).toLocaleDateString('en-GB');
    
    if (selectedGroupId && selectedGroupName) {
      handleFieldChange(selectedDateField, formattedDate, selectedGroupId, selectedGroupName);
    } else {
      handleFieldChange(selectedDateField, formattedDate);
    }
    
    setShowCalendar(false);
    setSelectedDateField('');
    setSelectedGroupId('');
    setSelectedGroupName('');
  };

  const openDatePicker = (fieldName: string, groupId?: string, groupName?: string) => {
    setSelectedDateField(fieldName);
    setSelectedGroupId(groupId || '');
    setSelectedGroupName(groupName || '');
    
    // Get current value to set initial date
    let currentValue;
    if (groupId && groupName) {
      const group = repeatableGroups[groupName];
      const item = group?.find(g => g.id === groupId);
      currentValue = item?.[fieldName];
    } else {
      currentValue = formData[fieldName];
    }
    
    if (currentValue) {
      const [day, month, year] = currentValue.split('/');
      const initialDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      setCurrentDate(initialDate);
      setTempDate(initialDate);
    } else {
      const now = new Date();
      setCurrentDate(now);
      setTempDate(now);
    }
    
    setShowDatePicker(true);
  };

  const openCalendar = (fieldName: string, groupId?: string, groupName?: string) => {
    setSelectedDateField(fieldName);
    setSelectedGroupId(groupId || '');
    setSelectedGroupName(groupName || '');
    setShowCalendar(true);
  };

  const handleImagePicker = async (fieldName: string, groupId?: string, groupName?: string) => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant permission to access your photo library.');
        return;
      }

      Alert.alert(
        'Select Image',
        'Choose an option',
        [
          {
            text: 'Camera',
            onPress: async () => {
              const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
              if (cameraStatus.status !== 'granted') {
                Alert.alert('Permission Required', 'Please grant camera permission.');
                return;
              }
              
              const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
              });

              if (!result.canceled && result.assets[0]) {
                handleFieldChange(fieldName, result.assets[0].uri, groupId, groupName);
              }
            }
          },
          {
            text: 'Gallery',
            onPress: async () => {
              const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
              });

              if (!result.canceled && result.assets[0]) {
                handleFieldChange(fieldName, result.assets[0].uri, groupId, groupName);
              }
            }
          },
          { text: 'Cancel', onPress: () => {} }
        ]
      );
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const addRepeatableGroupItem = (groupName: string) => {
    const newItem: RepeatableGroupItem = {
      id: Date.now().toString(),
    };
    
    // Initialize all fields in the group
    const groupField = getFieldByName(groupName);
    if (groupField && groupField.fields) {
      groupField.fields.forEach(field => {
        if (field.type === 'checkbox') {
          newItem[field.name] = false;
        } else if (field.type === 'toggle' && field.options && field.options.length > 0) {
          newItem[field.name] = field.options[0];
        } else {
          newItem[field.name] = '';
        }
      });
    }
    
    setRepeatableGroups(prev => ({
      ...prev,
      [groupName]: [...(prev[groupName] || []), newItem]
    }));
  };

  const removeRepeatableGroupItem = (groupName: string, id: string) => {
    setRepeatableGroups(prev => ({
      ...prev,
      [groupName]: prev[groupName].filter(item => item.id !== id)
    }));
    
    // Remove group item errors
    setErrors(prev => {
      const newErrors = { ...prev };
      if (newErrors[groupName] && typeof newErrors[groupName] === 'object') {
        delete (newErrors[groupName] as { [key: string]: any })[id];
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
          if (field.type === 'repeatable_group') {
            // Skip validation for repeatable groups here, handle separately
            return;
          }
          
          if (shouldShowField(field)) {
            const error = validateField(field, formData[field.name]);
            if (error) {
              newErrors[field.name] = error;
              hasErrors = true;
            }
          }
        });
      }
    });
    
    // Validate repeatable groups
    Object.entries(repeatableGroups).forEach(([groupName, items]) => {
      const groupField = getFieldByName(groupName);
      if (groupField && groupField.fields) {
        const groupErrors: { [key: string]: { [key: string]: string } } = {};
        
        items.forEach(item => {
          const itemErrors: { [key: string]: string } = {};
          
          groupField.fields!.forEach(field => {
            const error = validateField(field, item[field.name]);
            if (error) {
              itemErrors[field.name] = error;
              hasErrors = true;
            }
          });
          
          if (Object.keys(itemErrors).length > 0) {
            groupErrors[item.id] = itemErrors;
          }
        });
        
        if (Object.keys(groupErrors).length > 0) {
          newErrors[groupName] = groupErrors;
        }
      }
    });
    
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
    value: any,
    error?: string,
    groupId?: string,
    groupName?: string
  ) => {
    const handleChange = (newValue: any) => {
      handleFieldChange(field.name, newValue, groupId, groupName);
    };

    const handleBlur = () => {
      const fieldError = validateField(field, value);
      if (groupId && groupName) {
        setErrors(prev => ({
          ...prev,
          [groupName]: {
            ...((prev[groupName] as { [key: string]: { [key: string]: string } }) || {}),
            [groupId]: {
              ...((prev[groupName] as { [key: string]: { [key: string]: string } })?.[groupId] || {}),
              [field.name]: fieldError || ''
            }
          }
        }));
      } else {
        setErrors(prev => ({ ...prev, [field.name]: fieldError || '' }));
      }
    };

    // Toggle input
    if (field.type === 'toggle') {
      return (
        <View>
          <View style={styles.toggleContainer}>
            {field.options?.map((option, index) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.toggleOption,
                  value === option && styles.toggleOptionActive,
                  error && styles.toggleOptionError,
                  index === 0 && styles.toggleOptionFirst,
                  index === (field.options?.length || 0) - 1 && styles.toggleOptionLast
                ]}
                onPress={() => handleChange(option)}
              >
                <Text style={[
                  styles.toggleOptionText,
                  value === option && styles.toggleOptionTextActive
                ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {error && (
            <View style={styles.errorContainer}>
              <MaterialIcons name="error-outline" size={16} color={Colors.error} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
        </View>
      );
    }

    // Checkbox input
    if (field.type === 'checkbox') {
      return (
        <View>
          <TouchableOpacity
            style={[
              styles.checkboxContainer,
              error && styles.checkboxError
            ]}
            onPress={() => handleChange(!value)}
          >
            <View style={[
              styles.checkbox,
              value && styles.checkboxChecked,
              error && styles.checkboxErrorBorder
            ]}>
              {value && (
                <MaterialIcons name="check" size={18} color="white" />
              )}
            </View>
            <Text style={[
              styles.checkboxLabel,
              error && styles.checkboxLabelError
            ]}>
              {field.label}
            </Text>
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

    // Date input with native picker
    if (field.type === 'date') {
      return (
        <View>
          <TouchableOpacity
            style={[
              styles.input,
              error && styles.inputError,
              value && styles.inputFilled
            ]}
            onPress={() => openDatePicker(field.name, groupId, groupName)}
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
          <TouchableOpacity
            style={styles.calendarFallbackButton}
            onPress={() => openCalendar(field.name, groupId, groupName)}
          >
            <MaterialIcons name="event" size={16} color={Colors.primary} />
            <Text style={styles.calendarFallbackText}>Use Calendar</Text>
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

    // Image/File upload
    if (field.type === 'image' || field.type === 'file') {
      return (
        <View>
          <TouchableOpacity 
            style={[
              styles.imageUpload,
              error && styles.imageUploadError
            ]} 
            onPress={() => handleImagePicker(field.name, groupId, groupName)}
          >
            {value ? (
              <View style={styles.imagePreviewContainer}>
                <Image source={{ uri: value }} style={styles.imagePreview} />
                <View style={styles.imageOverlay}>
                  <MaterialIcons name="edit" size={24} color="white" />
                  <Text style={styles.imageOverlayText}>Change</Text>
                </View>
              </View>
            ) : (
              <View style={styles.imageUploadContent}>
                <View style={styles.imageIconContainer}>
                  <MaterialIcons name="add-a-photo" size={32} color={Colors.primary} />
                </View>
                <Text style={styles.imageUploadText}>Tap to upload {field.label.toLowerCase()}</Text>
                <Text style={styles.imageUploadSubtext}>JPG, PNG up to 5MB</Text>
              </View>
            )}
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

    // Select dropdown
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

    // Regular text inputs
    return (
      <View>
        <TextInput
          style={[
            styles.input,
            field.type === 'textarea' && styles.textArea,
            error && styles.inputError,
            value && styles.inputFilled
          ]}
          value={value || ''}
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
        
        {section.fields.map(field => {
          if (field.type === 'repeatable_group') {
            return renderRepeatableGroup(field);
          }
          
          if (!shouldShowField(field)) {
            return null;
          }
          
          return (
            <View key={field.name} style={styles.inputGroup}>
              {field.type !== 'checkbox' && (
                <Text style={styles.label}>
                  {field.label} {field.required && '*'}
                </Text>
              )}
              {renderInput(field, formData[field.name], errors[field.name] as string)}
            </View>
          );
        })}
      </View>
    );
  };

  const renderRepeatableGroup = (groupField: FormField) => {
    const groupItems = repeatableGroups[groupField.name] || [];
    
    return (
      <View key={groupField.name} style={styles.repeatableGroupContainer}>
        <View style={styles.repeatableGroupHeader}>
          <Text style={styles.subsectionTitle}>{groupField.label}</Text>
          <TouchableOpacity 
            style={styles.addButton} 
            onPress={() => addRepeatableGroupItem(groupField.name)}
          >
            <MaterialIcons name="add" size={18} color="white" />
            <Text style={styles.addButtonText}>Add {groupField.label}</Text>
          </TouchableOpacity>
        </View>

        {groupItems.map((item, index) => (
          <Animated.View key={item.id} style={styles.repeatableGroupItem}>
            <View style={styles.repeatableGroupItemHeader}>
              <View style={styles.repeatableGroupItemTitleContainer}>
                <MaterialIcons name="folder" size={24} color={Colors.primary} />
                <Text style={styles.repeatableGroupItemTitle}>
                  {groupField.label} {index + 1}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => removeRepeatableGroupItem(groupField.name, item.id)}
                style={styles.removeButton}
              >
                <MaterialIcons name="close" size={20} color={Colors.error} />
              </TouchableOpacity>
            </View>
            
            {groupField.fields?.map(field => (
              <View key={field.name} style={styles.inputGroup}>
                {field.type !== 'checkbox' && (
                  <Text style={styles.label}>
                    {field.label} {field.required && '*'}
                  </Text>
                )}
                {renderInput(
                  field,
                  item[field.name] || '',
                  ((errors[groupField.name] as { [key: string]: { [key: string]: string } })?.[item.id]?.[field.name]),
                  item.id,
                  groupField.name
                )}
              </View>
            ))}
          </Animated.View>
        ))}
        
        {groupItems.length === 0 && (
          <View style={styles.emptyRepeatableGroupContainer}>
            <MaterialIcons name="folder-open" size={48} color={Colors.textLight} />
            <Text style={styles.emptyRepeatableGroupText}>No {groupField.label.toLowerCase()} added yet</Text>
            <Text style={styles.emptyRepeatableGroupSubtext}>
              Tap &quot;Add {groupField.label}&quot; to include {groupField.label.toLowerCase()}
            </Text>
          </View>
        )}
      </View>
    );
  };

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

      {/* Native Date Picker */}
      {showDatePicker && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={showDatePicker}
          onRequestClose={handleDatePickerCancel}
        >
          <View style={styles.datePickerModal}>
            <View style={styles.datePickerContainer}>
              <View style={styles.datePickerHeader}>
                <TouchableOpacity
                  onPress={handleDatePickerCancel}
                  style={styles.datePickerButton}
                >
                  <Text style={styles.datePickerButtonText}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.datePickerTitle}>Select Date</Text>
                <TouchableOpacity
                  onPress={handleDatePickerDone}
                  style={styles.datePickerButton}
                >
                  <Text style={[styles.datePickerButtonText, styles.datePickerDoneButton]}>Done</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={tempDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateSelect}
                maximumDate={new Date()}
                minimumDate={new Date(1900, 0, 1)}
                style={styles.datePicker}
              />
            </View>
          </View>
        </Modal>
      )}

      {/* Calendar Modal (Fallback) */}
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
              onDayPress={(day) => handleCalendarDateSelect(day.dateString)}
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
  // Toggle styles
  toggleContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: Colors.border,
  },
  toggleOption: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleOptionFirst: {
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  toggleOptionLast: {
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  toggleOptionActive: {
    backgroundColor: Colors.primary,
  },
  toggleOptionError: {
    borderColor: Colors.error,
  },
  toggleOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  toggleOptionTextActive: {
    color: 'white',
  },
  // Checkbox styles
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  checkboxError: {
    // Add error styling if needed
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkboxErrorBorder: {
    borderColor: Colors.error,
  },
  checkboxLabel: {
    fontSize: 16,
    color: Colors.text,
    flex: 1,
  },
  checkboxLabelError: {
    color: Colors.error,
  },
  // Image upload styles
  imageUpload: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  imageUploadError: {
    borderColor: Colors.error,
    backgroundColor: `${Colors.error}05`,
  },
  imageUploadContent: {
    alignItems: 'center',
  },
  imageIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: `${Colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  imageUploadText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '600',
    marginBottom: 4,
  },
  imageUploadSubtext: {
    fontSize: 12,
    color: Colors.textLight,
  },
  imagePreviewContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 14,
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
  },
  imageOverlayText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  // Date picker styles
  calendarFallbackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: `${Colors.primary}10`,
    borderRadius: 8,
  },
  calendarFallbackText: {
    fontSize: 14,
    color: Colors.primary,
    marginLeft: 4,
    fontWeight: '500',
  },
  datePickerModal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  datePickerContainer: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  datePickerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  datePickerButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  datePickerButtonText: {
    fontSize: 16,
    color: Colors.primary,
  },
  datePickerDoneButton: {
    fontWeight: '600',
  },
  datePicker: {
    backgroundColor: Colors.card,
  },
  // Repeatable group styles
  repeatableGroupContainer: {
    marginBottom: 20,
  },
  repeatableGroupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  addButton: {
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
  addButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 14,
  },
  repeatableGroupItem: {
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
  repeatableGroupItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  repeatableGroupItemTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  repeatableGroupItemTitle: {
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
  emptyRepeatableGroupContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyRepeatableGroupText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textLight,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyRepeatableGroupSubtext: {
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