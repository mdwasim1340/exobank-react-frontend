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
} from 'react-native';
import { ArrowLeft, CreditCard, Building, Banknote, Smartphone, Plus } from 'lucide-react-native';
import { router } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { mockAccounts } from '@/data/mockData';

export default function AddMoneyScreen() {
  const { theme } = useTheme();
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [selectedAccount, setSelectedAccount] = useState(mockAccounts[0].id);

  const addMoneyMethods = [
    {
      id: 'bank_transfer',
      title: 'Bank Transfer',
      subtitle: 'Transfer from another bank account',
      icon: Building,
      fee: 'Free',
      time: '1-2 business days',
    },
    {
      id: 'debit_card',
      title: 'Debit Card',
      subtitle: 'Add money using your debit card',
      icon: CreditCard,
      fee: '₹5 + GST',
      time: 'Instant',
    },
    {
      id: 'upi',
      title: 'UPI',
      subtitle: 'Add money via UPI apps',
      icon: Smartphone,
      fee: 'Free',
      time: 'Instant',
    },
    {
      id: 'cash_deposit',
      title: 'Cash Deposit',
      subtitle: 'Deposit cash at ATM or branch',
      icon: Banknote,
      fee: 'Free',
      time: 'Instant',
    },
  ];

  const handleAddMoney = () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (!selectedMethod) {
      Alert.alert('Error', 'Please select a payment method');
      return;
    }

    const method = addMoneyMethods.find(m => m.id === selectedMethod);
    Alert.alert(
      'Confirm Transaction',
      `Add ₹${amount} using ${method?.title}?\n\nFee: ${method?.fee}\nTime: ${method?.time}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Confirm', 
          onPress: () => {
            Alert.alert('Success', 'Money added successfully!');
            router.back();
          }
        },
      ]
    );
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
    },
    amountSection: {
      padding: 20,
      alignItems: 'center',
    },
    amountLabel: {
      fontSize: 16,
      color: theme.textSecondary,
      marginBottom: 16,
    },
    amountContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.surfaceVariant,
      borderRadius: 16,
      paddingHorizontal: 20,
      paddingVertical: 16,
      marginBottom: 16,
      borderWidth: 2,
      borderColor: theme.primary,
    },
    currencySymbol: {
      fontSize: 28,
      fontWeight: 'bold',
      color: theme.text,
      marginRight: 8,
    },
    amountInput: {
      flex: 1,
      fontSize: 28,
      fontWeight: 'bold',
      color: theme.text,
      textAlign: 'center',
    },
    quickAmounts: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 24,
    },
    quickAmountButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: theme.surfaceVariant,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.border,
    },
    quickAmountText: {
      fontSize: 14,
      color: theme.text,
      fontWeight: '500',
    },
    accountSelector: {
      marginHorizontal: 20,
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 12,
    },
    accountCard: {
      backgroundColor: theme.surfaceVariant,
      padding: 16,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: theme.primary,
    },
    accountType: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 4,
    },
    accountNumber: {
      fontSize: 12,
      color: theme.textSecondary,
    },
    methodsSection: {
      marginHorizontal: 20,
      marginBottom: 24,
    },
    methodCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.surface,
      padding: 16,
      borderRadius: 12,
      marginBottom: 12,
      borderWidth: 2,
      borderColor: theme.border,
    },
    methodCardSelected: {
      borderColor: theme.primary,
      backgroundColor: theme.surfaceVariant,
    },
    methodIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.surfaceVariant,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    methodInfo: {
      flex: 1,
    },
    methodTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 2,
    },
    methodSubtitle: {
      fontSize: 12,
      color: theme.textSecondary,
      marginBottom: 4,
    },
    methodDetails: {
      flexDirection: 'row',
      gap: 16,
    },
    methodFee: {
      fontSize: 11,
      color: theme.success,
      fontWeight: '500',
    },
    methodTime: {
      fontSize: 11,
      color: theme.textSecondary,
    },
    addButton: {
      backgroundColor: theme.primary,
      marginHorizontal: 20,
      marginBottom: 20,
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: 'center',
      elevation: 2,
      shadowColor: theme.shadowDark,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
    },
    addButtonDisabled: {
      opacity: 0.5,
    },
    addButtonText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.textOnPrimary,
    },
  });

  const selectedAccountData = mockAccounts.find(acc => acc.id === selectedAccount);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Money</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Amount Input */}
        <View style={styles.amountSection}>
          <Text style={styles.amountLabel}>Enter amount to add</Text>
          <View style={styles.amountContainer}>
            <Text style={styles.currencySymbol}>₹</Text>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={setAmount}
              placeholder="0"
              placeholderTextColor={theme.textSecondary}
              keyboardType="numeric"
              autoFocus
            />
          </View>
          
          <View style={styles.quickAmounts}>
            {['500', '1000', '2000', '5000'].map((quickAmount) => (
              <TouchableOpacity
                key={quickAmount}
                style={styles.quickAmountButton}
                onPress={() => setAmount(quickAmount)}
              >
                <Text style={styles.quickAmountText}>₹{quickAmount}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Account Selection */}
        <View style={styles.accountSelector}>
          <Text style={styles.sectionTitle}>Add to Account</Text>
          {selectedAccountData && (
            <View style={styles.accountCard}>
              <Text style={styles.accountType}>{selectedAccountData.type} Account</Text>
              <Text style={styles.accountNumber}>{selectedAccountData.accountNumber}</Text>
            </View>
          )}
        </View>

        {/* Payment Methods */}
        <View style={styles.methodsSection}>
          <Text style={styles.sectionTitle}>Choose Payment Method</Text>
          {addMoneyMethods.map((method) => {
            const IconComponent = method.icon;
            return (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.methodCard,
                  selectedMethod === method.id && styles.methodCardSelected
                ]}
                onPress={() => setSelectedMethod(method.id)}
              >
                <View style={styles.methodIcon}>
                  <IconComponent size={24} color={theme.primary} />
                </View>
                <View style={styles.methodInfo}>
                  <Text style={styles.methodTitle}>{method.title}</Text>
                  <Text style={styles.methodSubtitle}>{method.subtitle}</Text>
                  <View style={styles.methodDetails}>
                    <Text style={styles.methodFee}>Fee: {method.fee}</Text>
                    <Text style={styles.methodTime}>{method.time}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Add Money Button */}
      <TouchableOpacity
        style={[
          styles.addButton,
          (!amount || !selectedMethod) && styles.addButtonDisabled
        ]}
        onPress={handleAddMoney}
        disabled={!amount || !selectedMethod}
      >
        <Text style={styles.addButtonText}>
          Add ₹{amount || '0'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}