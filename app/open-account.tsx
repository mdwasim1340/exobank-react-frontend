import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
  Modal,
  Platform,
  Dimensions,
} from 'react-native';
import { ArrowLeft, ArrowRight, User, MapPin, FileText, CreditCard, DollarSign, Upload, Calendar, CircleCheck as CheckCircle, ChevronDown } from 'lucide-react-native';
import { router } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';

interface FormData {
  // Personal Information
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  phone: string;
  
  // Address Details
  address: string;
  city: string;
  province: string;
  postalCode: string;
  
  // Identity Verification
  panNumber: string;
  nationalIdNumber: string;
  
  // Account Details
  accountType: string;
  initialDeposit: string;
}

const accountTypes = [
  { 
    id: 'savings', 
    name: 'Savings Account', 
    nameNepali: 'बचत खाता',
    minDeposit: 1000, 
    features: ['No minimum balance', 'Free debit card', 'Online banking'],
    featuresNepali: ['न्यूनतम ब्यालेन्स आवश्यक छैन', 'निःशुल्क डेबिट कार्ड', 'अनलाइन बैंकिङ']
  },
  { 
    id: 'current', 
    name: 'Current Account', 
    nameNepali: 'चालु खाता',
    minDeposit: 10000, 
    features: ['Unlimited transactions', 'Overdraft facility', 'Business banking'],
    featuresNepali: ['असीमित लेनदेन', 'ओभरड्राफ्ट सुविधा', 'व्यापारिक बैंकिङ']
  },
  { 
    id: 'salary', 
    name: 'Salary Account', 
    nameNepali: 'तलब खाता',
    minDeposit: 0, 
    features: ['Zero balance', 'Salary processing', 'Premium benefits'],
    featuresNepali: ['शून्य ब्यालेन्स', 'तलब प्रशोधन', 'प्रिमियम सुविधाहरू']
  },
];

const genderOptions = [
  { en: 'Male', np: 'पुरुष' },
  { en: 'Female', np: 'महिला' },
  { en: 'Other', np: 'अन्य' }
];

const nepalProvinces = [
  { en: 'Koshi', np: 'कोशी' },
  { en: 'Madhesh', np: 'मधेश' },
  { en: 'Bagmati', np: 'बागमती' },
  { en: 'Gandaki', np: 'गण्डकी' },
  { en: 'Lumbini', np: 'लुम्बिनी' },
  { en: 'Karnali', np: 'कर्णाली' },
  { en: 'Sudurpashchim', np: 'सुदूरपश्चिम' }
];

const { width: screenWidth } = Dimensions.get('window');

export default function OpenAccountScreen() {
  const { theme } = useTheme();
  const [currentStep, setCurrentStep] = useState(1);
  const [language, setLanguage] = useState<'en' | 'np'>('en');
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    panNumber: '',
    nationalIdNumber: '',
    accountType: '',
    initialDeposit: '',
  });
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [showProvinceModal, setShowProvinceModal] = useState(false);
  const [showAccountTypeModal, setShowAccountTypeModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const totalSteps = 4;

  const texts = {
    en: {
      title: 'Open New Account',
      step1Title: 'Personal Information',
      step1Subtitle: 'Please provide your basic details',
      step2Title: 'Address Details',
      step2Subtitle: 'Please provide your residential address',
      step3Title: 'Identity Verification',
      step3Subtitle: 'Please provide your identity documents',
      step4Title: 'Account Selection',
      step4Subtitle: 'Choose your account type and initial deposit',
      firstName: 'First Name',
      lastName: 'Last Name',
      dateOfBirth: 'Date of Birth',
      gender: 'Gender',
      email: 'Email Address',
      phone: 'Phone Number',
      address: 'Address',
      city: 'City',
      province: 'Province',
      postalCode: 'Postal Code',
      panNumber: 'PAN Number (Optional)',
      nationalIdNumber: 'National ID Number',
      accountType: 'Account Type',
      initialDeposit: 'Initial Deposit Amount',
      uploadNationalIdFront: 'Upload National ID Front Image',
      uploadNationalIdBack: 'Upload National ID Back Image',
      uploadPanCard: 'Upload PAN Card (Optional)',
      selectGender: 'Select gender',
      selectProvince: 'Select province',
      previous: 'Previous',
      next: 'Next',
      submitApplication: 'Submit Application',
      required: '*',
      optional: '(Optional)',
      applicationSummary: 'Application Summary',
      name: 'Name',
      minDeposit: 'Minimum deposit',
      jpgPngPdf: 'JPG, PNG or PDF (Max 5MB)',
      applicationSubmitted: 'Application Submitted',
      applicationSubmittedMessage: 'Your account opening application has been submitted successfully. You will receive a confirmation email shortly.',
      fillAllFields: 'Please fill in all required fields',
      stepOf: 'Step {current} of {total}',
    },
    np: {
      title: 'नयाँ खाता खोल्नुहोस्',
      step1Title: 'व्यक्तिगत जानकारी',
      step1Subtitle: 'कृपया आफ्ना आधारभूत विवरणहरू प्रदान गर्नुहोस्',
      step2Title: 'ठेगाना विवरण',
      step2Subtitle: 'कृपया आफ्नो आवासीय ठेगाना प्रदान गर्नुहोस्',
      step3Title: 'पहिचान प्रमाणीकरण',
      step3Subtitle: 'कृपया आफ्ना पहिचान कागजातहरू प्रदान गर्नुहोस्',
      step4Title: 'खाता छनोट',
      step4Subtitle: 'आफ्नो खाताको प्रकार र प्रारम्भिक जम्मा छान्नुहोस्',
      firstName: 'पहिलो नाम',
      lastName: 'अन्तिम नाम',
      dateOfBirth: 'जन्म मिति',
      gender: 'लिङ्ग',
      email: 'इमेल ठेगाना',
      phone: 'फोन नम्बर',
      address: 'ठेगाना',
      city: 'शहर',
      province: 'प्रदेश',
      postalCode: 'हुलाक कोड',
      panNumber: 'प्यान नम्बर (वैकल्पिक)',
      nationalIdNumber: 'राष्ट्रिय परिचयपत्र नम्बर',
      accountType: 'खाताको प्रकार',
      initialDeposit: 'प्रारम्भिक जम्मा रकम',
      uploadNationalIdFront: 'राष्ट्रिय परिचयपत्रको अगाडिको भाग अपलोड गर्नुहोस्',
      uploadNationalIdBack: 'राष्ट्रिय परिचयपत्रको पछाडिको भाग अपलोड गर्नुहोस्',
      uploadPanCard: 'प्यान कार्ड अपलोड गर्नुहोस् (वैकल्पिक)',
      selectGender: 'लिङ्ग छान्नुहोस्',
      selectProvince: 'प्रदेश छान्नुहोस्',
      previous: 'अघिल्लो',
      next: 'अर्को',
      submitApplication: 'आवेदन पेश गर्नुहोस्',
      required: '*',
      optional: '(वैकल्पिक)',
      applicationSummary: 'आवेदन सारांश',
      name: 'नाम',
      minDeposit: 'न्यूनतम जम्मा',
      jpgPngPdf: 'JPG, PNG वा PDF (अधिकतम ५MB)',
      applicationSubmitted: 'आवेदन पेश गरियो',
      applicationSubmittedMessage: 'तपाईंको खाता खोल्ने आवेदन सफलतापूर्वक पेश गरिएको छ। तपाईंले छिट्टै पुष्टिकरण इमेल प्राप्त गर्नुहुनेछ।',
      fillAllFields: 'कृपया सबै आवश्यक क्षेत्रहरू भर्नुहोस्',
      stepOf: 'चरण {current} को {total}',
    }
  };

  const t = texts[language];

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.firstName && formData.lastName && formData.dateOfBirth && 
                 formData.gender && formData.email && formData.phone);
      case 2:
        return !!(formData.address && formData.city && formData.province && formData.postalCode);
      case 3:
        return !!(formData.nationalIdNumber); // PAN is optional
      case 4:
        return !!(formData.accountType && formData.initialDeposit);
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) {
      Alert.alert('Error', t.fillAllFields);
      return;
    }
    
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    Alert.alert(
      t.applicationSubmitted,
      t.applicationSubmittedMessage,
      [
        {
          text: 'OK',
          onPress: () => router.replace('/login'),
        },
      ]
    );
  };

  const getSelectedAccountType = () => {
    return accountTypes.find(type => type.id === formData.accountType);
  };

  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return '';
    const parts = dateString.split('/');
    if (parts.length === 3) {
      return `${parts[0]}/${parts[1]}/${parts[2]}`;
    }
    return dateString;
  };

  const handleDateSelect = (date: string) => {
    updateFormData('dateOfBirth', date);
    setShowDatePicker(false);
  };

  const generateDateOptions = () => {
    const currentYear = new Date().getFullYear();
    const minYear = currentYear - 80;
    const maxYear = currentYear - 18;
    
    const dates = [];
    for (let year = maxYear; year >= minYear; year--) {
      for (let month = 12; month >= 1; month--) {
        const daysInMonth = new Date(year, month, 0).getDate();
        for (let day = daysInMonth; day >= 1; day--) {
          const dateStr = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
          dates.push(dateStr);
        }
      }
    }
    return dates.slice(0, 100); // Limit for performance
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: screenWidth > 768 ? '5%' : 20,
      paddingVertical: 20,
      paddingTop: 40,
    },
    backButton: {
      width: Math.max(44, screenWidth * 0.1),
      height: Math.max(44, screenWidth * 0.1),
      borderRadius: Math.max(22, screenWidth * 0.05),
      backgroundColor: theme.surfaceVariant,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    headerTitle: {
      fontSize: screenWidth > 768 ? 24 : 20,
      fontWeight: 'bold',
      color: theme.text,
      flex: 1,
    },
    languageToggle: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      backgroundColor: theme.primary,
      borderRadius: 8,
      minWidth: 44,
      minHeight: 44,
      justifyContent: 'center',
      alignItems: 'center',
    },
    languageToggleText: {
      color: theme.textOnPrimary,
      fontWeight: '600',
      fontSize: 14,
    },
    progressContainer: {
      paddingHorizontal: screenWidth > 768 ? '5%' : 20,
      marginBottom: 24,
    },
    progressBar: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    progressStep: {
      flex: 1,
      height: 4,
      backgroundColor: theme.border,
      marginHorizontal: 2,
      borderRadius: 2,
    },
    progressStepActive: {
      backgroundColor: theme.primary,
    },
    progressText: {
      fontSize: screenWidth > 768 ? 16 : 14,
      color: theme.textSecondary,
      textAlign: 'center',
    },
    stepTitle: {
      fontSize: screenWidth > 768 ? 22 : 18,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 8,
    },
    stepSubtitle: {
      fontSize: screenWidth > 768 ? 16 : 14,
      color: theme.textSecondary,
      marginBottom: 24,
      lineHeight: 20,
    },
    content: {
      flex: 1,
      paddingHorizontal: screenWidth > 768 ? '5%' : 20,
    },
    inputGroup: {
      marginBottom: screenWidth > 768 ? 24 : 20,
    },
    inputLabel: {
      fontSize: screenWidth > 768 ? 16 : 14,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 8,
      lineHeight: 20,
    },
    input: {
      backgroundColor: theme.surfaceVariant,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: screenWidth > 768 ? 18 : 16,
      fontSize: screenWidth > 768 ? 18 : 16,
      color: theme.text,
      borderWidth: 1,
      borderColor: theme.border,
      minHeight: 44,
    },
    inputRow: {
      flexDirection: screenWidth > 768 ? 'row' : 'column',
      gap: 12,
    },
    inputHalf: {
      flex: screenWidth > 768 ? 1 : undefined,
    },
    dropdown: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.surfaceVariant,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: screenWidth > 768 ? 18 : 16,
      borderWidth: 1,
      borderColor: theme.border,
      minHeight: 44,
    },
    dropdownText: {
      fontSize: screenWidth > 768 ? 18 : 16,
      color: formData.gender || formData.province || formData.accountType ? theme.text : theme.textSecondary,
    },
    accountTypeCard: {
      backgroundColor: theme.surface,
      borderRadius: 12,
      padding: screenWidth > 768 ? 20 : 16,
      marginBottom: 12,
      borderWidth: 2,
      borderColor: theme.border,
    },
    accountTypeCardSelected: {
      borderColor: theme.primary,
      backgroundColor: theme.surfaceVariant,
    },
    accountTypeName: {
      fontSize: screenWidth > 768 ? 18 : 16,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 4,
    },
    accountTypeNameNepali: {
      fontSize: screenWidth > 768 ? 16 : 14,
      color: theme.textSecondary,
      marginBottom: 8,
    },
    accountTypeMinDeposit: {
      fontSize: screenWidth > 768 ? 16 : 14,
      color: theme.textSecondary,
      marginBottom: 8,
    },
    accountTypeFeatures: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    featureTag: {
      backgroundColor: theme.primary + '20',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    featureText: {
      fontSize: screenWidth > 768 ? 14 : 12,
      color: theme.primary,
      fontWeight: '500',
    },
    uploadArea: {
      backgroundColor: theme.surfaceVariant,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: theme.border,
      borderStyle: 'dashed',
      padding: screenWidth > 768 ? 32 : 24,
      alignItems: 'center',
      marginBottom: 16,
      minHeight: 120,
    },
    uploadIcon: {
      marginBottom: 12,
    },
    uploadText: {
      fontSize: screenWidth > 768 ? 16 : 14,
      color: theme.text,
      fontWeight: '500',
      marginBottom: 4,
      textAlign: 'center',
    },
    uploadSubtext: {
      fontSize: screenWidth > 768 ? 14 : 12,
      color: theme.textSecondary,
      textAlign: 'center',
    },
    buttonContainer: {
      flexDirection: screenWidth > 768 ? 'row' : 'column',
      paddingHorizontal: screenWidth > 768 ? '5%' : 20,
      paddingVertical: 20,
      gap: 12,
    },
    button: {
      flex: screenWidth > 768 ? 1 : undefined,
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      minHeight: 44,
    },
    previousButton: {
      backgroundColor: theme.surfaceVariant,
      borderWidth: 1,
      borderColor: theme.border,
    },
    nextButton: {
      backgroundColor: theme.primary,
    },
    buttonText: {
      fontSize: screenWidth > 768 ? 18 : 16,
      fontWeight: '600',
      marginHorizontal: 8,
    },
    previousButtonText: {
      color: theme.text,
    },
    nextButtonText: {
      color: theme.textOnPrimary,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: theme.overlay,
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: theme.background,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 20,
      maxHeight: '60%',
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    modalTitle: {
      fontSize: screenWidth > 768 ? 20 : 18,
      fontWeight: 'bold',
      color: theme.text,
    },
    modalOption: {
      paddingVertical: 16,
      paddingHorizontal: 16,
      borderRadius: 8,
      marginBottom: 8,
      backgroundColor: theme.surfaceVariant,
      minHeight: 44,
      justifyContent: 'center',
    },
    modalOptionSelected: {
      backgroundColor: theme.primary,
    },
    modalOptionText: {
      fontSize: screenWidth > 768 ? 18 : 16,
      color: theme.text,
    },
    modalOptionTextSelected: {
      color: theme.textOnPrimary,
    },
    modalOptionTextNepali: {
      fontSize: screenWidth > 768 ? 16 : 14,
      color: theme.textSecondary,
      marginTop: 2,
    },
    modalOptionTextNepaliSelected: {
      color: theme.textOnPrimary,
      opacity: 0.8,
    },
    summaryCard: {
      backgroundColor: theme.surfaceVariant,
      borderRadius: 12,
      padding: screenWidth > 768 ? 20 : 16,
      marginBottom: 20,
    },
    summaryTitle: {
      fontSize: screenWidth > 768 ? 18 : 16,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 12,
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
      alignItems: 'flex-start',
    },
    summaryLabel: {
      fontSize: screenWidth > 768 ? 16 : 14,
      color: theme.textSecondary,
      flex: 1,
    },
    summaryValue: {
      fontSize: screenWidth > 768 ? 16 : 14,
      color: theme.text,
      fontWeight: '500',
      flex: 1,
      textAlign: 'right',
    },
    datePickerContainer: {
      maxHeight: 200,
    },
  });

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.stepTitle}>{t.step1Title}</Text>
            <Text style={styles.stepSubtitle}>{t.step1Subtitle}</Text>

            <View style={styles.inputRow}>
              <View style={[styles.inputGroup, styles.inputHalf]}>
                <Text style={styles.inputLabel}>{t.firstName} {t.required}</Text>
                <TextInput
                  style={styles.input}
                  value={formData.firstName}
                  onChangeText={(value) => updateFormData('firstName', value)}
                  placeholder={`Enter ${t.firstName.toLowerCase()}`}
                  placeholderTextColor={theme.textSecondary}
                />
              </View>
              <View style={[styles.inputGroup, styles.inputHalf]}>
                <Text style={styles.inputLabel}>{t.lastName} {t.required}</Text>
                <TextInput
                  style={styles.input}
                  value={formData.lastName}
                  onChangeText={(value) => updateFormData('lastName', value)}
                  placeholder={`Enter ${t.lastName.toLowerCase()}`}
                  placeholderTextColor={theme.textSecondary}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t.dateOfBirth} {t.required}</Text>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.dropdownText}>
                  {formatDateForDisplay(formData.dateOfBirth) || 'DD/MM/YYYY'}
                </Text>
                <Calendar size={20} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t.gender} {t.required}</Text>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setShowGenderModal(true)}
              >
                <Text style={styles.dropdownText}>
                  {formData.gender || t.selectGender}
                </Text>
                <ChevronDown size={20} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t.email} {t.required}</Text>
              <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={(value) => updateFormData('email', value)}
                placeholder={`Enter ${t.email.toLowerCase()}`}
                placeholderTextColor={theme.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t.phone} {t.required}</Text>
              <TextInput
                style={styles.input}
                value={formData.phone}
                onChangeText={(value) => updateFormData('phone', value)}
                placeholder={`Enter ${t.phone.toLowerCase()}`}
                placeholderTextColor={theme.textSecondary}
                keyboardType="phone-pad"
              />
            </View>
          </ScrollView>
        );

      case 2:
        return (
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.stepTitle}>{t.step2Title}</Text>
            <Text style={styles.stepSubtitle}>{t.step2Subtitle}</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t.address} {t.required}</Text>
              <TextInput
                style={styles.input}
                value={formData.address}
                onChangeText={(value) => updateFormData('address', value)}
                placeholder={`Enter complete ${t.address.toLowerCase()}`}
                placeholderTextColor={theme.textSecondary}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.inputRow}>
              <View style={[styles.inputGroup, styles.inputHalf]}>
                <Text style={styles.inputLabel}>{t.city} {t.required}</Text>
                <TextInput
                  style={styles.input}
                  value={formData.city}
                  onChangeText={(value) => updateFormData('city', value)}
                  placeholder={`Enter ${t.city.toLowerCase()}`}
                  placeholderTextColor={theme.textSecondary}
                />
              </View>
              <View style={[styles.inputGroup, styles.inputHalf]}>
                <Text style={styles.inputLabel}>{t.postalCode} {t.required}</Text>
                <TextInput
                  style={styles.input}
                  value={formData.postalCode}
                  onChangeText={(value) => updateFormData('postalCode', value)}
                  placeholder={`Enter ${t.postalCode.toLowerCase()}`}
                  placeholderTextColor={theme.textSecondary}
                  keyboardType="numeric"
                  maxLength={5}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t.province} {t.required}</Text>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setShowProvinceModal(true)}
              >
                <Text style={styles.dropdownText}>
                  {formData.province || t.selectProvince}
                </Text>
                <ChevronDown size={20} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>
          </ScrollView>
        );

      case 3:
        return (
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.stepTitle}>{t.step3Title}</Text>
            <Text style={styles.stepSubtitle}>{t.step3Subtitle}</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t.nationalIdNumber} {t.required}</Text>
              <TextInput
                style={styles.input}
                value={formData.nationalIdNumber}
                onChangeText={(value) => updateFormData('nationalIdNumber', value)}
                placeholder={`Enter ${t.nationalIdNumber.toLowerCase()}`}
                placeholderTextColor={theme.textSecondary}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t.panNumber}</Text>
              <TextInput
                style={styles.input}
                value={formData.panNumber}
                onChangeText={(value) => updateFormData('panNumber', value.toUpperCase())}
                placeholder={`Enter ${t.panNumber.toLowerCase()}`}
                placeholderTextColor={theme.textSecondary}
                autoCapitalize="characters"
                maxLength={9}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t.uploadNationalIdFront} {t.required}</Text>
              <TouchableOpacity style={styles.uploadArea}>
                <Upload size={24} color={theme.primary} style={styles.uploadIcon} />
                <Text style={styles.uploadText}>{t.uploadNationalIdFront}</Text>
                <Text style={styles.uploadSubtext}>{t.jpgPngPdf}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t.uploadNationalIdBack} {t.required}</Text>
              <TouchableOpacity style={styles.uploadArea}>
                <Upload size={24} color={theme.primary} style={styles.uploadIcon} />
                <Text style={styles.uploadText}>{t.uploadNationalIdBack}</Text>
                <Text style={styles.uploadSubtext}>{t.jpgPngPdf}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t.uploadPanCard}</Text>
              <TouchableOpacity style={styles.uploadArea}>
                <Upload size={24} color={theme.primary} style={styles.uploadIcon} />
                <Text style={styles.uploadText}>{t.uploadPanCard}</Text>
                <Text style={styles.uploadSubtext}>{t.jpgPngPdf}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        );

      case 4:
        return (
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.stepTitle}>{t.step4Title}</Text>
            <Text style={styles.stepSubtitle}>{t.step4Subtitle}</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t.accountType} {t.required}</Text>
              {accountTypes.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.accountTypeCard,
                    formData.accountType === type.id && styles.accountTypeCardSelected
                  ]}
                  onPress={() => updateFormData('accountType', type.id)}
                >
                  <Text style={styles.accountTypeName}>{type.name}</Text>
                  <Text style={styles.accountTypeNameNepali}>{type.nameNepali}</Text>
                  <Text style={styles.accountTypeMinDeposit}>
                    {t.minDeposit}: NPR {type.minDeposit.toLocaleString('en-IN')}
                  </Text>
                  <View style={styles.accountTypeFeatures}>
                    {(language === 'en' ? type.features : type.featuresNepali).map((feature, index) => (
                      <View key={index} style={styles.featureTag}>
                        <Text style={styles.featureText}>{feature}</Text>
                      </View>
                    ))}
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t.initialDeposit} {t.required}</Text>
              <TextInput
                style={styles.input}
                value={formData.initialDeposit}
                onChangeText={(value) => updateFormData('initialDeposit', value)}
                placeholder={`${t.minDeposit} NPR ${getSelectedAccountType()?.minDeposit.toLocaleString('en-IN') || '0'}`}
                placeholderTextColor={theme.textSecondary}
                keyboardType="numeric"
              />
            </View>

            {/* Summary */}
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>{t.applicationSummary}</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>{t.name}</Text>
                <Text style={styles.summaryValue}>{formData.firstName} {formData.lastName}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>{t.email}</Text>
                <Text style={styles.summaryValue}>{formData.email}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>{t.phone}</Text>
                <Text style={styles.summaryValue}>{formData.phone}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>{t.accountType}</Text>
                <Text style={styles.summaryValue}>{getSelectedAccountType()?.name}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>{t.initialDeposit}</Text>
                <Text style={styles.summaryValue}>NPR {formData.initialDeposit}</Text>
              </View>
            </View>
          </ScrollView>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.title}</Text>
        <TouchableOpacity
          style={styles.languageToggle}
          onPress={() => setLanguage(language === 'en' ? 'np' : 'en')}
        >
          <Text style={styles.languageToggleText}>
            {language === 'en' ? 'नेपाली' : 'English'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          {Array.from({ length: totalSteps }, (_, index) => (
            <View
              key={index}
              style={[
                styles.progressStep,
                index < currentStep && styles.progressStepActive
              ]}
            />
          ))}
        </View>
        <Text style={styles.progressText}>
          {t.stepOf.replace('{current}', currentStep.toString()).replace('{total}', totalSteps.toString())}
        </Text>
      </View>

      {/* Step Content */}
      <View style={styles.content}>
        {renderStepContent()}
      </View>

      {/* Navigation Buttons */}
      <View style={styles.buttonContainer}>
        {currentStep > 1 && (
          <TouchableOpacity
            style={[styles.button, styles.previousButton]}
            onPress={handlePrevious}
          >
            <ArrowLeft size={20} color={theme.text} />
            <Text style={[styles.buttonText, styles.previousButtonText]}>{t.previous}</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={[styles.button, styles.nextButton]}
          onPress={handleNext}
        >
          <Text style={[styles.buttonText, styles.nextButtonText]}>
            {currentStep === totalSteps ? t.submitApplication : t.next}
          </Text>
          {currentStep < totalSteps && <ArrowRight size={20} color={theme.textOnPrimary} />}
        </TouchableOpacity>
      </View>

      {/* Date Picker Modal */}
      <Modal
        visible={showDatePicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDatePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t.dateOfBirth}</Text>
              <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                <Text style={{ color: theme.primary, fontSize: 16 }}>Cancel</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.datePickerContainer}>
              {generateDateOptions().map((date) => (
                <TouchableOpacity
                  key={date}
                  style={[
                    styles.modalOption,
                    formData.dateOfBirth === date && styles.modalOptionSelected
                  ]}
                  onPress={() => handleDateSelect(date)}
                >
                  <Text
                    style={[
                      styles.modalOptionText,
                      formData.dateOfBirth === date && styles.modalOptionTextSelected
                    ]}
                  >
                    {date}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Gender Modal */}
      <Modal
        visible={showGenderModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowGenderModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t.selectGender}</Text>
              <TouchableOpacity onPress={() => setShowGenderModal(false)}>
                <Text style={{ color: theme.primary, fontSize: 16 }}>Cancel</Text>
              </TouchableOpacity>
            </View>
            {genderOptions.map((option) => (
              <TouchableOpacity
                key={option.en}
                style={[
                  styles.modalOption,
                  formData.gender === option.en && styles.modalOptionSelected
                ]}
                onPress={() => {
                  updateFormData('gender', option.en);
                  setShowGenderModal(false);
                }}
              >
                <Text
                  style={[
                    styles.modalOptionText,
                    formData.gender === option.en && styles.modalOptionTextSelected
                  ]}
                >
                  {option.en}
                </Text>
                <Text
                  style={[
                    styles.modalOptionTextNepali,
                    formData.gender === option.en && styles.modalOptionTextNepaliSelected
                  ]}
                >
                  {option.np}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Province Modal */}
      <Modal
        visible={showProvinceModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowProvinceModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t.selectProvince}</Text>
              <TouchableOpacity onPress={() => setShowProvinceModal(false)}>
                <Text style={{ color: theme.primary, fontSize: 16 }}>Cancel</Text>
              </TouchableOpacity>
            </View>
            <ScrollView>
              {nepalProvinces.map((province) => (
                <TouchableOpacity
                  key={province.en}
                  style={[
                    styles.modalOption,
                    formData.province === province.en && styles.modalOptionSelected
                  ]}
                  onPress={() => {
                    updateFormData('province', province.en);
                    setShowProvinceModal(false);
                  }}
                >
                  <Text
                    style={[
                      styles.modalOptionText,
                      formData.province === province.en && styles.modalOptionTextSelected
                    ]}
                  >
                    {province.en}
                  </Text>
                  <Text
                    style={[
                      styles.modalOptionTextNepali,
                      formData.province === province.en && styles.modalOptionTextNepaliSelected
                    ]}
                  >
                    {province.np}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}