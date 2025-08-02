import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { ArrowLeft, Chrome as Home, Car, GraduationCap, CreditCard, Building, Calculator, FileText, Clock } from 'lucide-react-native';
import { router } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';

interface LoanType {
  id: string;
  title: string;
  subtitle: string;
  icon: any;
  color: string;
  interestRate: string;
  maxAmount: string;
  tenure: string;
  features: string[];
}

interface ExistingLoan {
  id: string;
  type: string;
  amount: number;
  outstanding: number;
  emi: number;
  nextDueDate: string;
  interestRate: number;
  tenure: string;
}

const loanTypes: LoanType[] = [
  {
    id: 'home_loan',
    title: 'Home Loan',
    subtitle: 'Buy your dream home',
    icon: Home,
    color: '#4CAF50',
    interestRate: '8.5% - 9.5%',
    maxAmount: '₹5 Crores',
    tenure: 'Up to 30 years',
    features: ['Tax benefits', 'Flexible repayment', 'Quick approval'],
  },
  {
    id: 'car_loan',
    title: 'Car Loan',
    subtitle: 'Drive your dream car',
    icon: Car,
    color: '#2196F3',
    interestRate: '7.5% - 8.5%',
    maxAmount: '₹1 Crore',
    tenure: 'Up to 7 years',
    features: ['100% financing', 'Quick disbursal', 'Flexible EMI'],
  },
  {
    id: 'personal_loan',
    title: 'Personal Loan',
    subtitle: 'For all your needs',
    icon: CreditCard,
    color: '#FF9800',
    interestRate: '10.5% - 15%',
    maxAmount: '₹40 Lakhs',
    tenure: 'Up to 5 years',
    features: ['No collateral', 'Instant approval', 'Minimal documentation'],
  },
  {
    id: 'education_loan',
    title: 'Education Loan',
    subtitle: 'Invest in your future',
    icon: GraduationCap,
    color: '#9C27B0',
    interestRate: '8% - 12%',
    maxAmount: '₹1.5 Crores',
    tenure: 'Up to 15 years',
    features: ['Moratorium period', 'Tax benefits', 'Covers all expenses'],
  },
  {
    id: 'business_loan',
    title: 'Business Loan',
    subtitle: 'Grow your business',
    icon: Building,
    color: '#795548',
    interestRate: '9% - 14%',
    maxAmount: '₹10 Crores',
    tenure: 'Up to 10 years',
    features: ['Working capital', 'Equipment financing', 'Quick processing'],
  },
];

const existingLoans: ExistingLoan[] = [
  {
    id: '1',
    type: 'Home Loan',
    amount: 5000000,
    outstanding: 3500000,
    emi: 45000,
    nextDueDate: '15 Feb 2025',
    interestRate: 8.5,
    tenure: '20 years',
  },
  {
    id: '2',
    type: 'Car Loan',
    amount: 800000,
    outstanding: 450000,
    emi: 18000,
    nextDueDate: '20 Feb 2025',
    interestRate: 7.8,
    tenure: '5 years',
  },
];

export default function LoansScreen() {
  const { theme } = useTheme();
  const [selectedTab, setSelectedTab] = useState<'apply' | 'existing'>('apply');

  const handleLoanApplication = (loanType: LoanType) => {
    Alert.alert(
      'Apply for Loan',
      `Start application for ${loanType.title}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Apply', onPress: () => router.push(`/loan-application?type=${loanType.id}`) },
      ]
    );
  };

  const handleEMICalculator = () => {
    router.push('/emi-calculator');
  };

  const handleLoanDetails = (loan: ExistingLoan) => {
    router.push(`/loan-details?id=${loan.id}`);
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
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.text,
      flex: 1,
      textAlign: 'center',
      marginHorizontal: 16,
    },
    calculatorButton: {
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
    loanTypesList: {
      paddingHorizontal: 20,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 16,
    },
    loanTypeCard: {
      backgroundColor: theme.surface,
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: theme.border,
      elevation: 2,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
    },
    loanTypeHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    loanTypeIcon: {
      width: 56,
      height: 56,
      borderRadius: 28,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    loanTypeInfo: {
      flex: 1,
    },
    loanTypeTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 4,
    },
    loanTypeSubtitle: {
      fontSize: 14,
      color: theme.textSecondary,
    },
    loanTypeDetails: {
      marginBottom: 16,
    },
    detailRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    detailLabel: {
      fontSize: 14,
      color: theme.textSecondary,
    },
    detailValue: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.text,
    },
    featuresContainer: {
      marginBottom: 16,
    },
    featuresTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 8,
    },
    featuresList: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    featureTag: {
      backgroundColor: theme.surfaceVariant,
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 12,
    },
    featureText: {
      fontSize: 12,
      color: theme.text,
      fontWeight: '500',
    },
    applyButton: {
      backgroundColor: theme.primary,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
    },
    applyButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.textOnPrimary,
    },
    existingLoansList: {
      paddingHorizontal: 20,
    },
    loanCard: {
      backgroundColor: theme.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: theme.border,
      elevation: 1,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
    },
    loanHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    loanType: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.text,
    },
    loanStatus: {
      backgroundColor: theme.success,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 4,
    },
    loanStatusText: {
      fontSize: 10,
      color: theme.textOnPrimary,
      fontWeight: '600',
      textTransform: 'uppercase',
    },
    loanDetails: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    loanDetailItem: {
      flex: 1,
      alignItems: 'center',
    },
    loanDetailValue: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 2,
    },
    loanDetailLabel: {
      fontSize: 11,
      color: theme.textSecondary,
    },
    nextDueContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.surfaceVariant,
      padding: 12,
      borderRadius: 8,
    },
    nextDueText: {
      fontSize: 12,
      color: theme.textSecondary,
      marginLeft: 8,
    },
    nextDueDate: {
      fontSize: 12,
      fontWeight: '600',
      color: theme.warning,
      marginLeft: 4,
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Loans</Text>
        <TouchableOpacity
          style={styles.calculatorButton}
          onPress={handleEMICalculator}
        >
          <Calculator size={20} color={theme.textOnPrimary} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'apply' && styles.tabActive]}
          onPress={() => setSelectedTab('apply')}
        >
          <Text style={[styles.tabText, selectedTab === 'apply' && styles.tabTextActive]}>
            Apply for Loan
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'existing' && styles.tabActive]}
          onPress={() => setSelectedTab('existing')}
        >
          <Text style={[styles.tabText, selectedTab === 'existing' && styles.tabTextActive]}>
            My Loans ({existingLoans.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {selectedTab === 'apply' && (
          <View style={styles.loanTypesList}>
            <Text style={styles.sectionTitle}>Choose Loan Type</Text>
            {loanTypes.map((loanType) => {
              const IconComponent = loanType.icon;
              return (
                <View key={loanType.id} style={styles.loanTypeCard}>
                  <View style={styles.loanTypeHeader}>
                    <View style={[
                      styles.loanTypeIcon,
                      { backgroundColor: loanType.color + '20' }
                    ]}>
                      <IconComponent size={28} color={loanType.color} />
                    </View>
                    <View style={styles.loanTypeInfo}>
                      <Text style={styles.loanTypeTitle}>{loanType.title}</Text>
                      <Text style={styles.loanTypeSubtitle}>{loanType.subtitle}</Text>
                    </View>
                  </View>

                  <View style={styles.loanTypeDetails}>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Interest Rate</Text>
                      <Text style={styles.detailValue}>{loanType.interestRate}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Max Amount</Text>
                      <Text style={styles.detailValue}>{loanType.maxAmount}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Tenure</Text>
                      <Text style={styles.detailValue}>{loanType.tenure}</Text>
                    </View>
                  </View>

                  <View style={styles.featuresContainer}>
                    <Text style={styles.featuresTitle}>Key Features</Text>
                    <View style={styles.featuresList}>
                      {loanType.features.map((feature, index) => (
                        <View key={index} style={styles.featureTag}>
                          <Text style={styles.featureText}>{feature}</Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.applyButton}
                    onPress={() => handleLoanApplication(loanType)}
                  >
                    <Text style={styles.applyButtonText}>Apply Now</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        )}

        {selectedTab === 'existing' && (
          <View style={styles.existingLoansList}>
            <Text style={styles.sectionTitle}>Your Active Loans</Text>
            {existingLoans.length > 0 ? (
              existingLoans.map((loan) => (
                <TouchableOpacity
                  key={loan.id}
                  style={styles.loanCard}
                  onPress={() => handleLoanDetails(loan)}
                >
                  <View style={styles.loanHeader}>
                    <Text style={styles.loanType}>{loan.type}</Text>
                    <View style={styles.loanStatus}>
                      <Text style={styles.loanStatusText}>Active</Text>
                    </View>
                  </View>

                  <View style={styles.loanDetails}>
                    <View style={styles.loanDetailItem}>
                      <Text style={styles.loanDetailValue}>
                        ₹{loan.outstanding.toLocaleString('en-IN')}
                      </Text>
                      <Text style={styles.loanDetailLabel}>Outstanding</Text>
                    </View>
                    <View style={styles.loanDetailItem}>
                      <Text style={styles.loanDetailValue}>
                        ₹{loan.emi.toLocaleString('en-IN')}
                      </Text>
                      <Text style={styles.loanDetailLabel}>Monthly EMI</Text>
                    </View>
                    <View style={styles.loanDetailItem}>
                      <Text style={styles.loanDetailValue}>{loan.interestRate}%</Text>
                      <Text style={styles.loanDetailLabel}>Interest Rate</Text>
                    </View>
                  </View>

                  <View style={styles.nextDueContainer}>
                    <Clock size={16} color={theme.warning} />
                    <Text style={styles.nextDueText}>Next EMI due on</Text>
                    <Text style={styles.nextDueDate}>{loan.nextDueDate}</Text>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyState}>
                <FileText size={48} color={theme.textSecondary} style={styles.emptyIcon} />
                <Text style={styles.emptyTitle}>No Active Loans</Text>
                <Text style={styles.emptySubtitle}>
                  You don't have any active loans. Apply for a loan to get started.
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}