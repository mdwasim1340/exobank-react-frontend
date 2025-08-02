import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  Dimensions,
} from 'react-native';
import { ArrowLeft, ChevronDown, Calendar, User, Building, CreditCard, CircleAlert as AlertCircle, CircleCheck as CheckCircle, Clock, ArrowRight, Copy, Share, Download } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import SafeAreaView from '@/components/SafeAreaView';
import { useTheme } from '@/hooks/useTheme';
import { mockAccounts } from '@/data/mockData';
import { Account } from '@/types';

interface TransferFormData {
  amount: string;
  sourceAccountId: string;
  destinationType: 'own' | 'other' | 'external';
  destinationAccountId: string;
  recipientName: string;
  recipientAccountNumber: string;
  recipientBankName: string;
  ifscCode: string;
  description: string;
  transferDate: 'immediate' | 'scheduled';
  scheduledDate: string;
  currency: 'NPR' | 'USD' | 'INR';
}

interface ValidationErrors {
  amount?: string;
  sourceAccount?: string;
  destination?: string;
  recipientName?: string;
  recipientAccountNumber?: string;
  ifscCode?: string;
  scheduledDate?: string;
}

const { width: screenWidth } = Dimensions.get('window');

const currencies = [
  { code: 'NPR', symbol: 'रू', name: 'Nepalese Rupee' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
];

const transferLimits = {
  daily: 100000,
  perTransaction: 50000,
  monthly: 500000,
};

export default function TransferScreen() {
  const { theme } = useTheme();
  const params = useLocalSearchParams();
  const sourceAccount = params.sourceAccount as string;

  const [currentStep, setCurrentStep] = useState<'form' | 'review' | 'success'>('form');
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [showSourceAccountModal, setShowSourceAccountModal] = useState(false);
  const [showDestinationModal, setShowDestinationModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [transactionId, setTransactionId] = useState('');

  const [formData, setFormData] = useState<TransferFormData>({
    amount: '',
    sourceAccountId: sourceAccount || mockAccounts[0].id,
    destinationType: 'own',
    destinationAccountId: '',
    recipientName: '',
    recipientAccountNumber: '',
    recipientBankName: '',
    ifscCode: '',
    description: '',
    transferDate: 'immediate',
    scheduledDate: '',
    currency: 'NPR',
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [dailyTransferAmount, setDailyTransferAmount] = useState(25000); // Mock current daily usage

  const selectedCurrency = currencies.find(c => c.code === formData.currency);
  const selectedSourceAccount = mockAccounts.find(acc => acc.id === formData.sourceAccountId);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Amount validation
    const amount = parseFloat(formData.amount);
    if (!formData.amount || isNaN(amount) || amount <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    } else if (amount > transferLimits.perTransaction) {
      newErrors.amount = `Amount exceeds per transaction limit of ${selectedCurrency?.symbol}${transferLimits.perTransaction.toLocaleString()}`;
    } else if (dailyTransferAmount + amount > transferLimits.daily) {
      newErrors.amount = `Amount exceeds daily limit. Remaining: ${selectedCurrency?.symbol}${(transferLimits.daily - dailyTransferAmount).toLocaleString()}`;
    } else if (selectedSourceAccount && amount > selectedSourceAccount.balance) {
      newErrors.amount = 'Insufficient balance in source account';
    }

    // Source account validation
    if (!formData.sourceAccountId) {
      newErrors.sourceAccount = 'Please select a source account';
    }

    // Destination validation
    if (formData.destinationType === 'other' || formData.destinationType === 'external') {
      if (!formData.recipientName.trim()) {
        newErrors.recipientName = 'Please enter recipient name';
      }
      if (!formData.recipientAccountNumber.trim()) {
        newErrors.recipientAccountNumber = 'Please enter recipient account number';
      }
      if (formData.destinationType === 'external' && !formData.ifscCode.trim()) {
        newErrors.ifscCode = 'Please enter IFSC code for external transfers';
      }
    } else if (formData.destinationType === 'own' && !formData.destinationAccountId) {
      newErrors.destination = 'Please select destination account';
    }

    // Scheduled date validation
    if (formData.transferDate === 'scheduled') {
      if (!formData.scheduledDate) {
        newErrors.scheduledDate = 'Please select a scheduled date';
      } else {
        const selectedDate = new Date(formData.scheduledDate);
        const today = new Date();
        if (selectedDate <= today) {
          newErrors.scheduledDate = 'Scheduled date must be in the future';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleTransfer = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const newTransactionId = `TXN${Date.now()}`;
      setTransactionId(newTransactionId);
      setIsLoading(false);
      setCurrentStep('success');
    }, 2000);
  };

  const handleNewTransfer = () => {
    setCurrentStep('form');
    setFormData({
      amount: '',
      sourceAccountId: sourceAccount || mockAccounts[0].id,
      destinationType: 'own',
      destinationAccountId: '',
      recipientName: '',
      recipientAccountNumber: '',
      recipientBankName: '',
      ifscCode: '',
      description: '',
      transferDate: 'immediate',
      scheduledDate: '',
      currency: 'NPR',
    });
    setErrors({});
    setTransactionId('');
  };

  const generateDateOptions = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    
    return dates;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getDestinationAccountOptions = () => {
    return mockAccounts.filter(acc => acc.id !== formData.sourceAccountId);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 20,
      paddingTop: 40,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.surfaceVariant,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.text,
      flex: 1,
    },
    stepIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      marginBottom: 24,
    },
    stepDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.border,
      marginHorizontal: 4,
    },
    stepDotActive: {
      backgroundColor: theme.primary,
    },
    stepLine: {
      flex: 1,
      height: 2,
      backgroundColor: theme.border,
      marginHorizontal: 8,
    },
    stepLineActive: {
      backgroundColor: theme.primary,
    },
    content: {
      flex: 1,
      paddingHorizontal: 20,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 16,
    },
    inputGroup: {
      marginBottom: 16,
    },
    inputLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 8,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.surfaceVariant,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
    },
    inputContainerError: {
      borderColor: theme.error,
    },
    input: {
      flex: 1,
      paddingHorizontal: 16,
      paddingVertical: 16,
      fontSize: 16,
      color: theme.text,
    },
    currencyButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 16,
      borderRightWidth: 1,
      borderRightColor: theme.border,
    },
    currencyText: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
      marginRight: 8,
    },
    dropdown: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.surfaceVariant,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 16,
      borderWidth: 1,
      borderColor: theme.border,
    },
    dropdownError: {
      borderColor: theme.error,
    },
    dropdownText: {
      fontSize: 16,
      color: theme.text,
    },
    dropdownPlaceholder: {
      color: theme.textSecondary,
    },
    errorText: {
      fontSize: 12,
      color: theme.error,
      marginTop: 4,
    },
    transferTypeContainer: {
      flexDirection: 'row',
      gap: 12,
    },
    transferTypeButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      backgroundColor: theme.surfaceVariant,
      borderWidth: 1,
      borderColor: theme.border,
    },
    transferTypeButtonActive: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    transferTypeText: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.text,
      marginLeft: 8,
    },
    transferTypeTextActive: {
      color: theme.textOnPrimary,
    },
    dateTypeContainer: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 16,
    },
    dateTypeButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      backgroundColor: theme.surfaceVariant,
      borderWidth: 1,
      borderColor: theme.border,
    },
    dateTypeButtonActive: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    dateTypeText: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.text,
      marginLeft: 8,
    },
    dateTypeTextActive: {
      color: theme.textOnPrimary,
    },
    limitInfo: {
      backgroundColor: theme.surfaceVariant,
      padding: 16,
      borderRadius: 12,
      marginBottom: 16,
    },
    limitTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 8,
    },
    limitItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 4,
    },
    limitLabel: {
      fontSize: 12,
      color: theme.textSecondary,
    },
    limitValue: {
      fontSize: 12,
      fontWeight: '500',
      color: theme.text,
    },
    continueButton: {
      backgroundColor: theme.primary,
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: 'center',
      marginBottom: 20,
    },
    continueButtonDisabled: {
      opacity: 0.6,
    },
    continueButtonText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.textOnPrimary,
    },
    reviewCard: {
      backgroundColor: theme.surface,
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: theme.border,
    },
    reviewTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 16,
    },
    reviewRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    reviewLabel: {
      fontSize: 14,
      color: theme.textSecondary,
    },
    reviewValue: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.text,
      textAlign: 'right',
      flex: 1,
      marginLeft: 16,
    },
    reviewAmount: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.primary,
    },
    confirmButton: {
      backgroundColor: theme.primary,
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: 'center',
      marginBottom: 12,
    },
    editButton: {
      backgroundColor: theme.surfaceVariant,
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.border,
    },
    editButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
    },
    successContainer: {
      alignItems: 'center',
      paddingVertical: 40,
    },
    successIcon: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.success + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 24,
    },
    successTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 8,
    },
    successMessage: {
      fontSize: 16,
      color: theme.textSecondary,
      textAlign: 'center',
      marginBottom: 32,
      lineHeight: 24,
    },
    transactionId: {
      fontSize: 14,
      color: theme.textSecondary,
      marginBottom: 32,
    },
    successActions: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 24,
    },
    actionButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      backgroundColor: theme.surfaceVariant,
      borderWidth: 1,
      borderColor: theme.border,
    },
    actionButtonText: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.text,
      marginLeft: 8,
    },
    newTransferButton: {
      backgroundColor: theme.primary,
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: 'center',
      marginBottom: 12,
    },
    backToHomeButton: {
      backgroundColor: theme.surfaceVariant,
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.border,
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
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
    },
    modalOption: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
      paddingHorizontal: 16,
      borderRadius: 8,
      marginBottom: 8,
      backgroundColor: theme.surfaceVariant,
    },
    modalOptionSelected: {
      backgroundColor: theme.primary,
    },
    modalOptionIcon: {
      marginRight: 12,
    },
    modalOptionContent: {
      flex: 1,
    },
    modalOptionText: {
      fontSize: 16,
      color: theme.text,
      fontWeight: '500',
    },
    modalOptionTextSelected: {
      color: theme.textOnPrimary,
    },
    modalOptionSubtext: {
      fontSize: 12,
      color: theme.textSecondary,
      marginTop: 2,
    },
    modalOptionSubtextSelected: {
      color: theme.textOnPrimary,
      opacity: 0.8,
    },
    loadingOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: theme.overlay,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    loadingContent: {
      backgroundColor: theme.background,
      padding: 32,
      borderRadius: 16,
      alignItems: 'center',
    },
    loadingText: {
      fontSize: 16,
      color: theme.text,
      marginTop: 16,
    },
  });

  const renderFormStep = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      {/* Amount Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Transfer Amount</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Amount *</Text>
          <View style={[styles.inputContainer, errors.amount && styles.inputContainerError]}>
            <TouchableOpacity
              style={styles.currencyButton}
              onPress={() => setShowCurrencyModal(true)}
            >
              <Text style={styles.currencyText}>{selectedCurrency?.symbol}</Text>
              <ChevronDown size={16} color={theme.textSecondary} />
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              value={formData.amount}
              onChangeText={(value) => setFormData(prev => ({ ...prev, amount: value }))}
              placeholder="0.00"
              placeholderTextColor={theme.textSecondary}
              keyboardType="numeric"
            />
          </View>
          {errors.amount && <Text style={styles.errorText}>{errors.amount}</Text>}
        </View>

        <View style={styles.limitInfo}>
          <Text style={styles.limitTitle}>Transfer Limits</Text>
          <View style={styles.limitItem}>
            <Text style={styles.limitLabel}>Daily Used</Text>
            <Text style={styles.limitValue}>
              {selectedCurrency?.symbol}{dailyTransferAmount.toLocaleString()} / {selectedCurrency?.symbol}{transferLimits.daily.toLocaleString()}
            </Text>
          </View>
          <View style={styles.limitItem}>
            <Text style={styles.limitLabel}>Per Transaction</Text>
            <Text style={styles.limitValue}>{selectedCurrency?.symbol}{transferLimits.perTransaction.toLocaleString()}</Text>
          </View>
          <View style={styles.limitItem}>
            <Text style={styles.limitLabel}>Available Balance</Text>
            <Text style={styles.limitValue}>
              {selectedCurrency?.symbol}{selectedSourceAccount?.balance.toLocaleString() || '0'}
            </Text>
          </View>
        </View>
      </View>

      {/* Source Account Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>From Account</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Source Account *</Text>
          <TouchableOpacity
            style={[styles.dropdown, errors.sourceAccount && styles.dropdownError]}
            onPress={() => setShowSourceAccountModal(true)}
          >
            <Text style={[styles.dropdownText, !selectedSourceAccount && styles.dropdownPlaceholder]}>
              {selectedSourceAccount 
                ? `${selectedSourceAccount.type} (${selectedSourceAccount.accountNumber})`
                : 'Select source account'
              }
            </Text>
            <ChevronDown size={20} color={theme.textSecondary} />
          </TouchableOpacity>
          {errors.sourceAccount && <Text style={styles.errorText}>{errors.sourceAccount}</Text>}
        </View>
      </View>

      {/* Destination Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>To Account</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Transfer Type *</Text>
          <View style={styles.transferTypeContainer}>
            <TouchableOpacity
              style={[
                styles.transferTypeButton,
                formData.destinationType === 'own' && styles.transferTypeButtonActive
              ]}
              onPress={() => setFormData(prev => ({ ...prev, destinationType: 'own' }))}
            >
              <User size={16} color={formData.destinationType === 'own' ? theme.textOnPrimary : theme.text} />
              <Text style={[
                styles.transferTypeText,
                formData.destinationType === 'own' && styles.transferTypeTextActive
              ]}>
                My Account
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.transferTypeButton,
                formData.destinationType === 'other' && styles.transferTypeButtonActive
              ]}
              onPress={() => setFormData(prev => ({ ...prev, destinationType: 'other' }))}
            >
              <Building size={16} color={formData.destinationType === 'other' ? theme.textOnPrimary : theme.text} />
              <Text style={[
                styles.transferTypeText,
                formData.destinationType === 'other' && styles.transferTypeTextActive
              ]}>
                Same Bank
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.transferTypeButton,
                formData.destinationType === 'external' && styles.transferTypeButtonActive
              ]}
              onPress={() => setFormData(prev => ({ ...prev, destinationType: 'external' }))}
            >
              <CreditCard size={16} color={formData.destinationType === 'external' ? theme.textOnPrimary : theme.text} />
              <Text style={[
                styles.transferTypeText,
                formData.destinationType === 'external' && styles.transferTypeTextActive
              ]}>
                Other Bank
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {formData.destinationType === 'own' && (
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Destination Account *</Text>
            <TouchableOpacity
              style={[styles.dropdown, errors.destination && styles.dropdownError]}
              onPress={() => setShowDestinationModal(true)}
            >
              <Text style={[styles.dropdownText, !formData.destinationAccountId && styles.dropdownPlaceholder]}>
                {formData.destinationAccountId 
                  ? (() => {
                      const account = mockAccounts.find(acc => acc.id === formData.destinationAccountId);
                      return account ? `${account.type} (${account.accountNumber})` : 'Select account';
                    })()
                  : 'Select destination account'
                }
              </Text>
              <ChevronDown size={20} color={theme.textSecondary} />
            </TouchableOpacity>
            {errors.destination && <Text style={styles.errorText}>{errors.destination}</Text>}
          </View>
        )}

        {(formData.destinationType === 'other' || formData.destinationType === 'external') && (
          <>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Recipient Name *</Text>
              <View style={[styles.inputContainer, errors.recipientName && styles.inputContainerError]}>
                <TextInput
                  style={styles.input}
                  value={formData.recipientName}
                  onChangeText={(value) => setFormData(prev => ({ ...prev, recipientName: value }))}
                  placeholder="Enter recipient's full name"
                  placeholderTextColor={theme.textSecondary}
                />
              </View>
              {errors.recipientName && <Text style={styles.errorText}>{errors.recipientName}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Account Number *</Text>
              <View style={[styles.inputContainer, errors.recipientAccountNumber && styles.inputContainerError]}>
                <TextInput
                  style={styles.input}
                  value={formData.recipientAccountNumber}
                  onChangeText={(value) => setFormData(prev => ({ ...prev, recipientAccountNumber: value }))}
                  placeholder="Enter recipient's account number"
                  placeholderTextColor={theme.textSecondary}
                  keyboardType="numeric"
                />
              </View>
              {errors.recipientAccountNumber && <Text style={styles.errorText}>{errors.recipientAccountNumber}</Text>}
            </View>

            {formData.destinationType === 'external' && (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Bank Name</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      value={formData.recipientBankName}
                      onChangeText={(value) => setFormData(prev => ({ ...prev, recipientBankName: value }))}
                      placeholder="Enter bank name"
                      placeholderTextColor={theme.textSecondary}
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>IFSC Code *</Text>
                  <View style={[styles.inputContainer, errors.ifscCode && styles.inputContainerError]}>
                    <TextInput
                      style={styles.input}
                      value={formData.ifscCode}
                      onChangeText={(value) => setFormData(prev => ({ ...prev, ifscCode: value.toUpperCase() }))}
                      placeholder="Enter IFSC code"
                      placeholderTextColor={theme.textSecondary}
                      autoCapitalize="characters"
                      maxLength={11}
                    />
                  </View>
                  {errors.ifscCode && <Text style={styles.errorText}>{errors.ifscCode}</Text>}
                </View>
              </>
            )}
          </>
        )}
      </View>

      {/* Transfer Details Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Transfer Details</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Description (Optional)</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={formData.description}
              onChangeText={(value) => setFormData(prev => ({ ...prev, description: value }))}
              placeholder="Add a note for this transfer"
              placeholderTextColor={theme.textSecondary}
              multiline
              numberOfLines={2}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Transfer Date *</Text>
          <View style={styles.dateTypeContainer}>
            <TouchableOpacity
              style={[
                styles.dateTypeButton,
                formData.transferDate === 'immediate' && styles.dateTypeButtonActive
              ]}
              onPress={() => setFormData(prev => ({ ...prev, transferDate: 'immediate' }))}
            >
              <Clock size={16} color={formData.transferDate === 'immediate' ? theme.textOnPrimary : theme.text} />
              <Text style={[
                styles.dateTypeText,
                formData.transferDate === 'immediate' && styles.dateTypeTextActive
              ]}>
                Immediate
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.dateTypeButton,
                formData.transferDate === 'scheduled' && styles.dateTypeButtonActive
              ]}
              onPress={() => setFormData(prev => ({ ...prev, transferDate: 'scheduled' }))}
            >
              <Calendar size={16} color={formData.transferDate === 'scheduled' ? theme.textOnPrimary : theme.text} />
              <Text style={[
                styles.dateTypeText,
                formData.transferDate === 'scheduled' && styles.dateTypeTextActive
              ]}>
                Scheduled
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {formData.transferDate === 'scheduled' && (
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Scheduled Date *</Text>
            <TouchableOpacity
              style={[styles.dropdown, errors.scheduledDate && styles.dropdownError]}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={[styles.dropdownText, !formData.scheduledDate && styles.dropdownPlaceholder]}>
                {formData.scheduledDate ? formatDate(formData.scheduledDate) : 'Select date'}
              </Text>
              <Calendar size={20} color={theme.textSecondary} />
            </TouchableOpacity>
            {errors.scheduledDate && <Text style={styles.errorText}>{errors.scheduledDate}</Text>}
          </View>
        )}
      </View>

      <TouchableOpacity
        style={styles.continueButton}
        onPress={() => {
          if (validateForm()) {
            setCurrentStep('review');
          }
        }}
      >
        <Text style={styles.continueButtonText}>Review Transfer</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderReviewStep = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.reviewCard}>
        <Text style={styles.reviewTitle}>Transfer Summary</Text>
        
        <View style={styles.reviewRow}>
          <Text style={styles.reviewLabel}>Amount</Text>
          <Text style={styles.reviewAmount}>
            {selectedCurrency?.symbol}{parseFloat(formData.amount || '0').toLocaleString()}
          </Text>
        </View>

        <View style={styles.reviewRow}>
          <Text style={styles.reviewLabel}>From</Text>
          <Text style={styles.reviewValue}>
            {selectedSourceAccount?.type} ({selectedSourceAccount?.accountNumber})
          </Text>
        </View>

        <View style={styles.reviewRow}>
          <Text style={styles.reviewLabel}>To</Text>
          <Text style={styles.reviewValue}>
            {formData.destinationType === 'own' 
              ? (() => {
                  const account = mockAccounts.find(acc => acc.id === formData.destinationAccountId);
                  return account ? `${account.type} (${account.accountNumber})` : '';
                })()
              : `${formData.recipientName} (${formData.recipientAccountNumber})`
            }
          </Text>
        </View>

        {formData.recipientBankName && (
          <View style={styles.reviewRow}>
            <Text style={styles.reviewLabel}>Bank</Text>
            <Text style={styles.reviewValue}>{formData.recipientBankName}</Text>
          </View>
        )}

        {formData.ifscCode && (
          <View style={styles.reviewRow}>
            <Text style={styles.reviewLabel}>IFSC Code</Text>
            <Text style={styles.reviewValue}>{formData.ifscCode}</Text>
          </View>
        )}

        <View style={styles.reviewRow}>
          <Text style={styles.reviewLabel}>Transfer Date</Text>
          <Text style={styles.reviewValue}>
            {formData.transferDate === 'immediate' 
              ? 'Immediate' 
              : formatDate(formData.scheduledDate)
            }
          </Text>
        </View>

        {formData.description && (
          <View style={styles.reviewRow}>
            <Text style={styles.reviewLabel}>Description</Text>
            <Text style={styles.reviewValue}>{formData.description}</Text>
          </View>
        )}

        <View style={styles.reviewRow}>
          <Text style={styles.reviewLabel}>Transfer Fee</Text>
          <Text style={styles.reviewValue}>Free</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.confirmButton, isLoading && styles.continueButtonDisabled]}
        onPress={handleTransfer}
        disabled={isLoading}
      >
        <Text style={styles.continueButtonText}>
          {isLoading ? 'Processing...' : 'Confirm Transfer'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.editButton}
        onPress={() => setCurrentStep('form')}
      >
        <Text style={styles.editButtonText}>Edit Details</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderSuccessStep = () => (
    <View style={styles.successContainer}>
      <View style={styles.successIcon}>
        <CheckCircle size={40} color={theme.success} />
      </View>
      
      <Text style={styles.successTitle}>Transfer Successful!</Text>
      <Text style={styles.successMessage}>
        Your transfer of {selectedCurrency?.symbol}{parseFloat(formData.amount || '0').toLocaleString()} has been {formData.transferDate === 'immediate' ? 'completed' : 'scheduled'} successfully.
      </Text>
      
      <Text style={styles.transactionId}>Transaction ID: {transactionId}</Text>

      <View style={styles.successActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Copy size={16} color={theme.text} />
          <Text style={styles.actionButtonText}>Copy ID</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Share size={16} color={theme.text} />
          <Text style={styles.actionButtonText}>Share</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Download size={16} color={theme.text} />
          <Text style={styles.actionButtonText}>Receipt</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.newTransferButton}
        onPress={handleNewTransfer}
      >
        <Text style={styles.continueButtonText}>New Transfer</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.backToHomeButton}
        onPress={() => router.replace('/(tabs)')}
      >
        <Text style={styles.editButtonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            if (currentStep === 'form') {
              router.back();
            } else if (currentStep === 'review') {
              setCurrentStep('form');
            }
          }}
        >
          <ArrowLeft size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {currentStep === 'form' ? 'Transfer Money' : 
           currentStep === 'review' ? 'Review Transfer' : 
           'Transfer Complete'}
        </Text>
      </View>

      {/* Step Indicator */}
      {currentStep !== 'success' && (
        <View style={styles.stepIndicator}>
          <View style={[styles.stepDot, styles.stepDotActive]} />
          <View style={[styles.stepLine, currentStep === 'review' && styles.stepLineActive]} />
          <View style={[styles.stepDot, currentStep === 'review' && styles.stepDotActive]} />
        </View>
      )}

      <View style={styles.content}>
        {currentStep === 'form' && renderFormStep()}
        {currentStep === 'review' && renderReviewStep()}
        {currentStep === 'success' && renderSuccessStep()}
      </View>

      {/* Currency Modal */}
      <Modal
        visible={showCurrencyModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCurrencyModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Currency</Text>
              <TouchableOpacity onPress={() => setShowCurrencyModal(false)}>
                <Text style={{ color: theme.primary, fontSize: 16 }}>Cancel</Text>
              </TouchableOpacity>
            </View>
            
            {currencies.map((currency) => (
              <TouchableOpacity
                key={currency.code}
                style={[
                  styles.modalOption,
                  formData.currency === currency.code && styles.modalOptionSelected
                ]}
                onPress={() => {
                  setFormData(prev => ({ ...prev, currency: currency.code }));
                  setShowCurrencyModal(false);
                }}
              >
                <View style={styles.modalOptionContent}>
                  <Text style={[
                    styles.modalOptionText,
                    formData.currency === currency.code && styles.modalOptionTextSelected
                  ]}>
                    {currency.symbol} {currency.code}
                  </Text>
                  <Text style={[
                    styles.modalOptionSubtext,
                    formData.currency === currency.code && styles.modalOptionSubtextSelected
                  ]}>
                    {currency.name}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Source Account Modal */}
      <Modal
        visible={showSourceAccountModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSourceAccountModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Source Account</Text>
              <TouchableOpacity onPress={() => setShowSourceAccountModal(false)}>
                <Text style={{ color: theme.primary, fontSize: 16 }}>Cancel</Text>
              </TouchableOpacity>
            </View>
            
            {mockAccounts.map((account) => (
              <TouchableOpacity
                key={account.id}
                style={[
                  styles.modalOption,
                  formData.sourceAccountId === account.id && styles.modalOptionSelected
                ]}
                onPress={() => {
                  setFormData(prev => ({ ...prev, sourceAccountId: account.id }));
                  setShowSourceAccountModal(false);
                }}
              >
                <View style={styles.modalOptionContent}>
                  <Text style={[
                    styles.modalOptionText,
                    formData.sourceAccountId === account.id && styles.modalOptionTextSelected
                  ]}>
                    {account.type} ({account.accountNumber})
                  </Text>
                  <Text style={[
                    styles.modalOptionSubtext,
                    formData.sourceAccountId === account.id && styles.modalOptionSubtextSelected
                  ]}>
                    Balance: NPR {account.balance.toLocaleString()}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Destination Account Modal */}
      <Modal
        visible={showDestinationModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDestinationModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Destination Account</Text>
              <TouchableOpacity onPress={() => setShowDestinationModal(false)}>
                <Text style={{ color: theme.primary, fontSize: 16 }}>Cancel</Text>
              </TouchableOpacity>
            </View>
            
            {getDestinationAccountOptions().map((account) => (
              <TouchableOpacity
                key={account.id}
                style={[
                  styles.modalOption,
                  formData.destinationAccountId === account.id && styles.modalOptionSelected
                ]}
                onPress={() => {
                  setFormData(prev => ({ ...prev, destinationAccountId: account.id }));
                  setShowDestinationModal(false);
                }}
              >
                <View style={styles.modalOptionContent}>
                  <Text style={[
                    styles.modalOptionText,
                    formData.destinationAccountId === account.id && styles.modalOptionTextSelected
                  ]}>
                    {account.type} ({account.accountNumber})
                  </Text>
                  <Text style={[
                    styles.modalOptionSubtext,
                    formData.destinationAccountId === account.id && styles.modalOptionSubtextSelected
                  ]}>
                    Balance: NPR {account.balance.toLocaleString()}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

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
              <Text style={styles.modalTitle}>Select Date</Text>
              <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                <Text style={{ color: theme.primary, fontSize: 16 }}>Cancel</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView>
              {generateDateOptions().map((date) => (
                <TouchableOpacity
                  key={date}
                  style={[
                    styles.modalOption,
                    formData.scheduledDate === date && styles.modalOptionSelected
                  ]}
                  onPress={() => {
                    setFormData(prev => ({ ...prev, scheduledDate: date }));
                    setShowDatePicker(false);
                  }}
                >
                  <Text style={[
                    styles.modalOptionText,
                    formData.scheduledDate === date && styles.modalOptionTextSelected
                  ]}>
                    {formatDate(date)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Loading Overlay */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContent}>
            <AlertCircle size={32} color={theme.primary} />
            <Text style={styles.loadingText}>Processing Transfer...</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}