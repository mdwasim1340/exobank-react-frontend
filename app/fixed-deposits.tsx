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
} from 'react-native';
import { ArrowLeft, Plus, Calculator, TrendingUp, Calendar, DollarSign, Clock, Download } from 'lucide-react-native';
import { router } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';

interface FixedDeposit {
  id: string;
  amount: number;
  interestRate: number;
  tenure: number; // in months
  maturityDate: string;
  maturityAmount: number;
  status: 'active' | 'matured' | 'premature';
  depositDate: string;
}

const mockFDs: FixedDeposit[] = [
  {
    id: '1',
    amount: 100000,
    interestRate: 6.5,
    tenure: 12,
    maturityDate: '2025-12-15',
    maturityAmount: 106500,
    status: 'active',
    depositDate: '2024-12-15',
  },
  {
    id: '2',
    amount: 250000,
    interestRate: 7.2,
    tenure: 24,
    maturityDate: '2026-06-20',
    maturityAmount: 286800,
    status: 'active',
    depositDate: '2024-06-20',
  },
  {
    id: '3',
    amount: 50000,
    interestRate: 6.0,
    tenure: 6,
    maturityDate: '2024-12-10',
    maturityAmount: 51500,
    status: 'matured',
    depositDate: '2024-06-10',
  },
];

export default function FixedDepositsScreen() {
  const { theme } = useTheme();
  const [selectedTab, setSelectedTab] = useState<'active' | 'calculator' | 'create'>('active');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [calculatorAmount, setCalculatorAmount] = useState('');
  const [calculatorTenure, setCalculatorTenure] = useState('12');
  const [calculatorRate, setCalculatorRate] = useState('6.5');
  const [newFDAmount, setNewFDAmount] = useState('');
  const [newFDTenure, setNewFDTenure] = useState('12');
  const [selectedRate, setSelectedRate] = useState('6.5');

  const calculateMaturity = (principal: number, rate: number, tenure: number) => {
    const maturityAmount = principal * Math.pow(1 + rate / 100, tenure / 12);
    return Math.round(maturityAmount);
  };

  const handleCreateFD = () => {
    if (!newFDAmount || parseFloat(newFDAmount) < 1000) {
      Alert.alert('Error', 'Minimum deposit amount is ₹1,000');
      return;
    }

    const principal = parseFloat(newFDAmount);
    const rate = parseFloat(selectedRate);
    const tenure = parseInt(newFDTenure);
    const maturityAmount = calculateMaturity(principal, rate, tenure);

    Alert.alert(
      'Confirm Fixed Deposit',
      `Principal: ₹${principal.toLocaleString('en-IN')}\nTenure: ${tenure} months\nInterest Rate: ${rate}%\nMaturity Amount: ₹${maturityAmount.toLocaleString('en-IN')}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Create FD',
          onPress: () => {
            setShowCreateModal(false);
            Alert.alert('Success', 'Fixed Deposit created successfully!');
            setNewFDAmount('');
            setNewFDTenure('12');
          },
        },
      ]
    );
  };

  const handlePrematureWithdrawal = (fd: FixedDeposit) => {
    const penaltyRate = 1.0; // 1% penalty
    const reducedRate = fd.interestRate - penaltyRate;
    const currentAmount = calculateMaturity(fd.amount, reducedRate, 12); // Assuming 1 year passed

    Alert.alert(
      'Premature Withdrawal',
      `Penalty: ${penaltyRate}%\nReduced Rate: ${reducedRate}%\nAmount after penalty: ₹${currentAmount.toLocaleString('en-IN')}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Proceed', onPress: () => Alert.alert('Success', 'Withdrawal initiated') },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return theme.success;
      case 'matured':
        return theme.info;
      case 'premature':
        return theme.warning;
      default:
        return theme.textSecondary;
    }
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
    createButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    tabContainer: {
      flexDirection: 'row',
      paddingHorizontal: 20,
      marginBottom: 20,
    },
    tab: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      backgroundColor: theme.surfaceVariant,
      marginRight: 8,
      alignItems: 'center',
    },
    tabActive: {
      backgroundColor: theme.primary,
    },
    tabText: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.text,
    },
    tabTextActive: {
      color: theme.textOnPrimary,
    },
    summaryCard: {
      backgroundColor: theme.primary,
      marginHorizontal: 20,
      marginBottom: 24,
      padding: 20,
      borderRadius: 16,
      elevation: 4,
      shadowColor: theme.shadowDark,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    summaryTitle: {
      fontSize: 14,
      color: theme.textOnPrimary,
      opacity: 0.8,
      marginBottom: 8,
    },
    summaryAmount: {
      fontSize: 28,
      fontWeight: 'bold',
      color: theme.textOnPrimary,
      marginBottom: 16,
    },
    summaryStats: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    statItem: {
      alignItems: 'center',
    },
    statValue: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.textOnPrimary,
    },
    statLabel: {
      fontSize: 12,
      color: theme.textOnPrimary,
      opacity: 0.8,
      marginTop: 2,
    },
    fdCard: {
      backgroundColor: theme.surface,
      marginHorizontal: 20,
      marginBottom: 16,
      padding: 20,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.border,
      elevation: 2,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
    },
    fdHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    fdAmount: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.text,
    },
    statusBadge: {
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 12,
    },
    statusText: {
      fontSize: 12,
      fontWeight: '600',
      color: theme.textOnPrimary,
      textTransform: 'uppercase',
    },
    fdDetails: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    detailItem: {
      flex: 1,
      alignItems: 'center',
    },
    detailValue: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 4,
    },
    detailLabel: {
      fontSize: 12,
      color: theme.textSecondary,
    },
    fdActions: {
      flexDirection: 'row',
      gap: 12,
    },
    actionButton: {
      flex: 1,
      paddingVertical: 10,
      borderRadius: 8,
      alignItems: 'center',
    },
    primaryAction: {
      backgroundColor: theme.primary,
    },
    secondaryAction: {
      backgroundColor: theme.surfaceVariant,
      borderWidth: 1,
      borderColor: theme.border,
    },
    primaryActionText: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.textOnPrimary,
    },
    secondaryActionText: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.text,
    },
    calculatorContainer: {
      paddingHorizontal: 20,
    },
    inputGroup: {
      marginBottom: 20,
    },
    inputLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 8,
    },
    input: {
      backgroundColor: theme.surfaceVariant,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 16,
      fontSize: 16,
      color: theme.text,
      borderWidth: 1,
      borderColor: theme.border,
    },
    tenureOptions: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginTop: 8,
    },
    tenureOption: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: theme.surfaceVariant,
      borderWidth: 1,
      borderColor: theme.border,
    },
    tenureOptionActive: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    tenureOptionText: {
      fontSize: 14,
      color: theme.text,
      fontWeight: '500',
    },
    tenureOptionTextActive: {
      color: theme.textOnPrimary,
    },
    resultCard: {
      backgroundColor: theme.surfaceVariant,
      padding: 20,
      borderRadius: 16,
      marginTop: 20,
    },
    resultTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 16,
    },
    resultRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    resultLabel: {
      fontSize: 14,
      color: theme.textSecondary,
    },
    resultValue: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.text,
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
      maxHeight: '80%',
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 24,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.text,
    },
    rateOptions: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginTop: 8,
    },
    rateOption: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: theme.surfaceVariant,
      borderWidth: 1,
      borderColor: theme.border,
    },
    rateOptionActive: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    rateOptionText: {
      fontSize: 14,
      color: theme.text,
      fontWeight: '500',
    },
    rateOptionTextActive: {
      color: theme.textOnPrimary,
    },
    createFDButton: {
      backgroundColor: theme.primary,
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: 'center',
      marginTop: 20,
    },
    createFDButtonText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.textOnPrimary,
    },
    emptyState: {
      alignItems: 'center',
      paddingVertical: 60,
    },
    emptyIcon: {
      marginBottom: 16,
    },
    emptyTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 8,
    },
    emptySubtitle: {
      fontSize: 14,
      color: theme.textSecondary,
      textAlign: 'center',
      lineHeight: 20,
    },
  });

  const activeFDs = mockFDs.filter(fd => fd.status === 'active');
  const totalInvestment = activeFDs.reduce((sum, fd) => sum + fd.amount, 0);
  const totalMaturityAmount = activeFDs.reduce((sum, fd) => sum + fd.maturityAmount, 0);
  const totalInterest = totalMaturityAmount - totalInvestment;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Fixed Deposits</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => setShowCreateModal(true)}
        >
          <Plus size={24} color={theme.textOnPrimary} />
        </TouchableOpacity>
      </View>

      {/* Summary Card */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Total Investment</Text>
        <Text style={styles.summaryAmount}>₹{totalInvestment.toLocaleString('en-IN')}</Text>
        <View style={styles.summaryStats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>₹{totalInterest.toLocaleString('en-IN')}</Text>
            <Text style={styles.statLabel}>Interest Earned</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{activeFDs.length}</Text>
            <Text style={styles.statLabel}>Active FDs</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>₹{totalMaturityAmount.toLocaleString('en-IN')}</Text>
            <Text style={styles.statLabel}>Maturity Value</Text>
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'active' && styles.tabActive]}
          onPress={() => setSelectedTab('active')}
        >
          <Text style={[styles.tabText, selectedTab === 'active' && styles.tabTextActive]}>
            My FDs
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'calculator' && styles.tabActive]}
          onPress={() => setSelectedTab('calculator')}
        >
          <Text style={[styles.tabText, selectedTab === 'calculator' && styles.tabTextActive]}>
            Calculator
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {selectedTab === 'active' && (
          <>
            {mockFDs.map((fd) => (
              <View key={fd.id} style={styles.fdCard}>
                <View style={styles.fdHeader}>
                  <Text style={styles.fdAmount}>₹{fd.amount.toLocaleString('en-IN')}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(fd.status) }]}>
                    <Text style={styles.statusText}>{fd.status}</Text>
                  </View>
                </View>

                <View style={styles.fdDetails}>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailValue}>{fd.interestRate}%</Text>
                    <Text style={styles.detailLabel}>Interest Rate</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailValue}>{fd.tenure} months</Text>
                    <Text style={styles.detailLabel}>Tenure</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailValue}>₹{fd.maturityAmount.toLocaleString('en-IN')}</Text>
                    <Text style={styles.detailLabel}>Maturity Amount</Text>
                  </View>
                </View>

                <View style={styles.fdActions}>
                  <TouchableOpacity style={[styles.actionButton, styles.secondaryAction]}>
                    <Text style={styles.secondaryActionText}>View Details</Text>
                  </TouchableOpacity>
                  {fd.status === 'active' && (
                    <TouchableOpacity
                      style={[styles.actionButton, styles.primaryAction]}
                      onPress={() => handlePrematureWithdrawal(fd)}
                    >
                      <Text style={styles.primaryActionText}>Withdraw</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
          </>
        )}

        {selectedTab === 'calculator' && (
          <View style={styles.calculatorContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Investment Amount</Text>
              <TextInput
                style={styles.input}
                value={calculatorAmount}
                onChangeText={setCalculatorAmount}
                placeholder="Enter amount"
                placeholderTextColor={theme.textSecondary}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Tenure (Months)</Text>
              <TextInput
                style={styles.input}
                value={calculatorTenure}
                onChangeText={setCalculatorTenure}
                placeholder="Enter tenure"
                placeholderTextColor={theme.textSecondary}
                keyboardType="numeric"
              />
              <View style={styles.tenureOptions}>
                {['6', '12', '24', '36', '60'].map((tenure) => (
                  <TouchableOpacity
                    key={tenure}
                    style={[
                      styles.tenureOption,
                      calculatorTenure === tenure && styles.tenureOptionActive
                    ]}
                    onPress={() => setCalculatorTenure(tenure)}
                  >
                    <Text style={[
                      styles.tenureOptionText,
                      calculatorTenure === tenure && styles.tenureOptionTextActive
                    ]}>
                      {tenure} months
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Interest Rate (%)</Text>
              <TextInput
                style={styles.input}
                value={calculatorRate}
                onChangeText={setCalculatorRate}
                placeholder="Enter rate"
                placeholderTextColor={theme.textSecondary}
                keyboardType="numeric"
              />
            </View>

            {calculatorAmount && calculatorTenure && calculatorRate && (
              <View style={styles.resultCard}>
                <Text style={styles.resultTitle}>Calculation Results</Text>
                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>Principal Amount</Text>
                  <Text style={styles.resultValue}>₹{parseFloat(calculatorAmount).toLocaleString('en-IN')}</Text>
                </View>
                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>Interest Earned</Text>
                  <Text style={styles.resultValue}>
                    ₹{(calculateMaturity(parseFloat(calculatorAmount), parseFloat(calculatorRate), parseInt(calculatorTenure)) - parseFloat(calculatorAmount)).toLocaleString('en-IN')}
                  </Text>
                </View>
                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>Maturity Amount</Text>
                  <Text style={[styles.resultValue, { color: theme.success, fontSize: 18, fontWeight: 'bold' }]}>
                    ₹{calculateMaturity(parseFloat(calculatorAmount), parseFloat(calculatorRate), parseInt(calculatorTenure)).toLocaleString('en-IN')}
                  </Text>
                </View>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Create FD Modal */}
      <Modal
        visible={showCreateModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create Fixed Deposit</Text>
              <TouchableOpacity onPress={() => setShowCreateModal(false)}>
                <Text style={{ color: theme.primary, fontSize: 16 }}>Cancel</Text>
              </TouchableOpacity>
            </View>

            <ScrollView>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Investment Amount</Text>
                <TextInput
                  style={styles.input}
                  value={newFDAmount}
                  onChangeText={setNewFDAmount}
                  placeholder="Minimum ₹1,000"
                  placeholderTextColor={theme.textSecondary}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Tenure</Text>
                <View style={styles.tenureOptions}>
                  {['6', '12', '18', '24', '36', '60'].map((tenure) => (
                    <TouchableOpacity
                      key={tenure}
                      style={[
                        styles.tenureOption,
                        newFDTenure === tenure && styles.tenureOptionActive
                      ]}
                      onPress={() => setNewFDTenure(tenure)}
                    >
                      <Text style={[
                        styles.tenureOptionText,
                        newFDTenure === tenure && styles.tenureOptionTextActive
                      ]}>
                        {tenure} months
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Interest Rate</Text>
                <View style={styles.rateOptions}>
                  {['6.0', '6.5', '7.0', '7.5', '8.0'].map((rate) => (
                    <TouchableOpacity
                      key={rate}
                      style={[
                        styles.rateOption,
                        selectedRate === rate && styles.rateOptionActive
                      ]}
                      onPress={() => setSelectedRate(rate)}
                    >
                      <Text style={[
                        styles.rateOptionText,
                        selectedRate === rate && styles.rateOptionTextActive
                      ]}>
                        {rate}% p.a.
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {newFDAmount && (
                <View style={styles.resultCard}>
                  <Text style={styles.resultTitle}>FD Summary</Text>
                  <View style={styles.resultRow}>
                    <Text style={styles.resultLabel}>Principal</Text>
                    <Text style={styles.resultValue}>₹{parseFloat(newFDAmount).toLocaleString('en-IN')}</Text>
                  </View>
                  <View style={styles.resultRow}>
                    <Text style={styles.resultLabel}>Tenure</Text>
                    <Text style={styles.resultValue}>{newFDTenure} months</Text>
                  </View>
                  <View style={styles.resultRow}>
                    <Text style={styles.resultLabel}>Interest Rate</Text>
                    <Text style={styles.resultValue}>{selectedRate}% p.a.</Text>
                  </View>
                  <View style={styles.resultRow}>
                    <Text style={styles.resultLabel}>Maturity Amount</Text>
                    <Text style={[styles.resultValue, { color: theme.success, fontSize: 18, fontWeight: 'bold' }]}>
                      ₹{calculateMaturity(parseFloat(newFDAmount), parseFloat(selectedRate), parseInt(newFDTenure)).toLocaleString('en-IN')}
                    </Text>
                  </View>
                </View>
              )}

              <TouchableOpacity
                style={styles.createFDButton}
                onPress={handleCreateFD}
              >
                <Text style={styles.createFDButtonText}>Create Fixed Deposit</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}