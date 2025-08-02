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
  Image,
} from 'react-native';
import { ArrowLeft, TrendingUp, TrendingDown, Search, Filter, Plus, ChartBar as BarChart3, ChartPie as PieChart, Target } from 'lucide-react-native';
import { router } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';

interface MutualFund {
  id: string;
  name: string;
  category: string;
  nav: number;
  investedAmount: number;
  currentValue: number;
  returns: number;
  returnsPercentage: number;
  riskLevel: 'Low' | 'Moderate' | 'High';
  rating: number;
  expenseRatio: number;
  aum: string;
  manager: string;
}

interface SIP {
  id: string;
  fundName: string;
  amount: number;
  frequency: 'Monthly' | 'Quarterly';
  nextDate: string;
  totalInvested: number;
  currentValue: number;
}

const mockPortfolio: MutualFund[] = [
  {
    id: '1',
    name: 'HDFC Top 100 Fund',
    category: 'Large Cap',
    nav: 750.25,
    investedAmount: 50000,
    currentValue: 62500,
    returns: 12500,
    returnsPercentage: 25.0,
    riskLevel: 'Moderate',
    rating: 4.5,
    expenseRatio: 1.2,
    aum: '₹15,000 Cr',
    manager: 'Prashant Jain',
  },
  {
    id: '2',
    name: 'SBI Small Cap Fund',
    category: 'Small Cap',
    nav: 125.80,
    investedAmount: 30000,
    currentValue: 35400,
    returns: 5400,
    returnsPercentage: 18.0,
    riskLevel: 'High',
    rating: 4.2,
    expenseRatio: 1.8,
    aum: '₹8,500 Cr',
    manager: 'R. Srinivasan',
  },
  {
    id: '3',
    name: 'ICICI Prudential Balanced Fund',
    category: 'Hybrid',
    nav: 45.60,
    investedAmount: 25000,
    currentValue: 27750,
    returns: 2750,
    returnsPercentage: 11.0,
    riskLevel: 'Moderate',
    rating: 4.0,
    expenseRatio: 1.5,
    aum: '₹12,200 Cr',
    manager: 'Sankaran Naren',
  },
];

const mockSIPs: SIP[] = [
  {
    id: '1',
    fundName: 'HDFC Top 100 Fund',
    amount: 5000,
    frequency: 'Monthly',
    nextDate: '2025-02-01',
    totalInvested: 60000,
    currentValue: 75000,
  },
  {
    id: '2',
    fundName: 'SBI Small Cap Fund',
    amount: 3000,
    frequency: 'Monthly',
    nextDate: '2025-02-05',
    totalInvested: 36000,
    currentValue: 42500,
  },
];

const popularFunds: MutualFund[] = [
  {
    id: '4',
    name: 'Axis Bluechip Fund',
    category: 'Large Cap',
    nav: 45.25,
    investedAmount: 0,
    currentValue: 0,
    returns: 0,
    returnsPercentage: 15.2,
    riskLevel: 'Moderate',
    rating: 4.3,
    expenseRatio: 1.1,
    aum: '₹25,000 Cr',
    manager: 'Shreyash Devalkar',
  },
  {
    id: '5',
    name: 'Mirae Asset Emerging Bluechip',
    category: 'Large & Mid Cap',
    nav: 85.40,
    investedAmount: 0,
    currentValue: 0,
    returns: 0,
    returnsPercentage: 22.8,
    riskLevel: 'High',
    rating: 4.6,
    expenseRatio: 1.3,
    aum: '₹18,500 Cr',
    manager: 'Neelesh Surana',
  },
];

export default function MutualFundsScreen() {
  const { theme } = useTheme();
  const [selectedTab, setSelectedTab] = useState<'portfolio' | 'explore' | 'sip'>('portfolio');
  const [searchQuery, setSearchQuery] = useState('');
  const [showRiskAssessment, setShowRiskAssessment] = useState(false);
  const [riskAnswers, setRiskAnswers] = useState<number[]>([]);

  const totalInvested = mockPortfolio.reduce((sum, fund) => sum + fund.investedAmount, 0);
  const totalCurrent = mockPortfolio.reduce((sum, fund) => sum + fund.currentValue, 0);
  const totalReturns = totalCurrent - totalInvested;
  const totalReturnsPercentage = totalInvested > 0 ? (totalReturns / totalInvested) * 100 : 0;

  const handleInvestment = (fund: MutualFund) => {
    Alert.alert(
      'Investment Options',
      `Choose investment type for ${fund.name}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Lump Sum', onPress: () => router.push(`/fund-investment?id=${fund.id}&type=lumpsum`) },
        { text: 'Start SIP', onPress: () => router.push(`/fund-investment?id=${fund.id}&type=sip`) },
      ]
    );
  };

  const handleRiskAssessment = () => {
    if (riskAnswers.length < 5) {
      Alert.alert('Incomplete', 'Please answer all questions');
      return;
    }

    const avgScore = riskAnswers.reduce((sum, score) => sum + score, 0) / riskAnswers.length;
    let riskProfile = 'Conservative';
    if (avgScore >= 3) riskProfile = 'Moderate';
    if (avgScore >= 4) riskProfile = 'Aggressive';

    Alert.alert(
      'Risk Assessment Complete',
      `Your risk profile: ${riskProfile}\n\nWe'll recommend funds based on your risk tolerance.`,
      [{ text: 'OK', onPress: () => setShowRiskAssessment(false) }]
    );
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low':
        return theme.success;
      case 'Moderate':
        return theme.warning;
      case 'High':
        return theme.error;
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
    searchButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.surfaceVariant,
      justifyContent: 'center',
      alignItems: 'center',
    },
    portfolioCard: {
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
    portfolioTitle: {
      fontSize: 14,
      color: theme.textOnPrimary,
      opacity: 0.8,
      marginBottom: 8,
    },
    portfolioValue: {
      fontSize: 28,
      fontWeight: 'bold',
      color: theme.textOnPrimary,
      marginBottom: 16,
    },
    portfolioStats: {
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
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.surfaceVariant,
      marginHorizontal: 20,
      marginBottom: 16,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 12,
    },
    searchInput: {
      flex: 1,
      marginLeft: 12,
      fontSize: 16,
      color: theme.text,
    },
    fundCard: {
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
    fundHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 12,
    },
    fundInfo: {
      flex: 1,
    },
    fundName: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 4,
    },
    fundCategory: {
      fontSize: 12,
      color: theme.textSecondary,
      marginBottom: 8,
    },
    riskBadge: {
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 4,
      marginLeft: 12,
    },
    riskText: {
      fontSize: 10,
      color: theme.textOnPrimary,
      fontWeight: '600',
      textTransform: 'uppercase',
    },
    fundMetrics: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    metricItem: {
      flex: 1,
      alignItems: 'center',
    },
    metricValue: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 2,
    },
    metricLabel: {
      fontSize: 11,
      color: theme.textSecondary,
    },
    fundActions: {
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
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 16,
      paddingHorizontal: 20,
    },
    sipCard: {
      backgroundColor: theme.surface,
      marginHorizontal: 20,
      marginBottom: 12,
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
      elevation: 1,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
    },
    sipHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    sipFundName: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
      flex: 1,
    },
    sipAmount: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.primary,
    },
    sipDetails: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    sipDetailItem: {
      flex: 1,
      alignItems: 'center',
    },
    sipDetailValue: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 2,
    },
    sipDetailLabel: {
      fontSize: 11,
      color: theme.textSecondary,
    },
    nextSipDate: {
      fontSize: 12,
      color: theme.warning,
      textAlign: 'center',
      fontWeight: '500',
    },
    riskAssessmentButton: {
      backgroundColor: theme.surfaceVariant,
      marginHorizontal: 20,
      marginBottom: 20,
      padding: 16,
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.border,
    },
    riskAssessmentIcon: {
      marginRight: 12,
    },
    riskAssessmentText: {
      flex: 1,
    },
    riskAssessmentTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 2,
    },
    riskAssessmentSubtitle: {
      fontSize: 12,
      color: theme.textSecondary,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: theme.overlay,
      justifyContent: 'center',
      padding: 20,
    },
    modalContent: {
      backgroundColor: theme.background,
      borderRadius: 20,
      padding: 20,
      maxHeight: '80%',
    },
    modalHeader: {
      alignItems: 'center',
      marginBottom: 24,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 8,
    },
    modalSubtitle: {
      fontSize: 14,
      color: theme.textSecondary,
      textAlign: 'center',
    },
    questionContainer: {
      marginBottom: 24,
    },
    questionText: {
      fontSize: 16,
      color: theme.text,
      marginBottom: 16,
      lineHeight: 22,
    },
    answerOptions: {
      gap: 8,
    },
    answerOption: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      backgroundColor: theme.surfaceVariant,
      borderWidth: 1,
      borderColor: theme.border,
    },
    answerOptionSelected: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    answerOptionText: {
      fontSize: 14,
      color: theme.text,
    },
    answerOptionTextSelected: {
      color: theme.textOnPrimary,
    },
    completeButton: {
      backgroundColor: theme.primary,
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: 'center',
      marginTop: 20,
    },
    completeButtonText: {
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

  const riskQuestions = [
    {
      question: "What is your investment experience?",
      options: ["Beginner", "Some experience", "Experienced", "Expert", "Professional"]
    },
    {
      question: "How long do you plan to invest?",
      options: ["< 1 year", "1-3 years", "3-5 years", "5-10 years", "> 10 years"]
    },
    {
      question: "How would you react to a 20% portfolio decline?",
      options: ["Sell everything", "Sell some", "Hold", "Buy more", "Buy much more"]
    },
    {
      question: "What's your primary investment goal?",
      options: ["Capital preservation", "Income", "Balanced growth", "Growth", "Aggressive growth"]
    },
    {
      question: "What percentage of income can you invest?",
      options: ["< 5%", "5-10%", "10-20%", "20-30%", "> 30%"]
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mutual Funds</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Search size={20} color={theme.text} />
        </TouchableOpacity>
      </View>

      {/* Portfolio Summary */}
      <View style={styles.portfolioCard}>
        <Text style={styles.portfolioTitle}>Total Portfolio Value</Text>
        <Text style={styles.portfolioValue}>₹{totalCurrent.toLocaleString('en-IN')}</Text>
        <View style={styles.portfolioStats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>₹{totalInvested.toLocaleString('en-IN')}</Text>
            <Text style={styles.statLabel}>Invested</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {totalReturns >= 0 ? '+' : ''}₹{Math.abs(totalReturns).toLocaleString('en-IN')}
            </Text>
            <Text style={styles.statLabel}>Returns</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {totalReturnsPercentage >= 0 ? '+' : ''}{totalReturnsPercentage.toFixed(1)}%
            </Text>
            <Text style={styles.statLabel}>% Returns</Text>
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'portfolio' && styles.tabActive]}
          onPress={() => setSelectedTab('portfolio')}
        >
          <Text style={[styles.tabText, selectedTab === 'portfolio' && styles.tabTextActive]}>
            Portfolio
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'explore' && styles.tabActive]}
          onPress={() => setSelectedTab('explore')}
        >
          <Text style={[styles.tabText, selectedTab === 'explore' && styles.tabTextActive]}>
            Explore
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'sip' && styles.tabActive]}
          onPress={() => setSelectedTab('sip')}
        >
          <Text style={[styles.tabText, selectedTab === 'sip' && styles.tabTextActive]}>
            My SIPs
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {selectedTab === 'portfolio' && (
          <>
            {mockPortfolio.map((fund) => (
              <View key={fund.id} style={styles.fundCard}>
                <View style={styles.fundHeader}>
                  <View style={styles.fundInfo}>
                    <Text style={styles.fundName}>{fund.name}</Text>
                    <Text style={styles.fundCategory}>{fund.category}</Text>
                  </View>
                  <View style={[styles.riskBadge, { backgroundColor: getRiskColor(fund.riskLevel) }]}>
                    <Text style={styles.riskText}>{fund.riskLevel}</Text>
                  </View>
                </View>

                <View style={styles.fundMetrics}>
                  <View style={styles.metricItem}>
                    <Text style={styles.metricValue}>₹{fund.currentValue.toLocaleString('en-IN')}</Text>
                    <Text style={styles.metricLabel}>Current Value</Text>
                  </View>
                  <View style={styles.metricItem}>
                    <Text style={[styles.metricValue, { color: fund.returns >= 0 ? theme.success : theme.error }]}>
                      {fund.returns >= 0 ? '+' : ''}₹{Math.abs(fund.returns).toLocaleString('en-IN')}
                    </Text>
                    <Text style={styles.metricLabel}>Returns</Text>
                  </View>
                  <View style={styles.metricItem}>
                    <Text style={[styles.metricValue, { color: fund.returns >= 0 ? theme.success : theme.error }]}>
                      {fund.returnsPercentage >= 0 ? '+' : ''}{fund.returnsPercentage.toFixed(1)}%
                    </Text>
                    <Text style={styles.metricLabel}>% Returns</Text>
                  </View>
                </View>

                <View style={styles.fundActions}>
                  <TouchableOpacity style={[styles.actionButton, styles.secondaryAction]}>
                    <Text style={styles.secondaryActionText}>View Details</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.primaryAction]}
                    onPress={() => handleInvestment(fund)}
                  >
                    <Text style={styles.primaryActionText}>Invest More</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </>
        )}

        {selectedTab === 'explore' && (
          <>
            {/* Risk Assessment */}
            <TouchableOpacity
              style={styles.riskAssessmentButton}
              onPress={() => setShowRiskAssessment(true)}
            >
              <Target size={24} color={theme.primary} style={styles.riskAssessmentIcon} />
              <View style={styles.riskAssessmentText}>
                <Text style={styles.riskAssessmentTitle}>Take Risk Assessment</Text>
                <Text style={styles.riskAssessmentSubtitle}>Get personalized fund recommendations</Text>
              </View>
            </TouchableOpacity>

            {/* Search */}
            <View style={styles.searchContainer}>
              <Search size={20} color={theme.textSecondary} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search funds..."
                placeholderTextColor={theme.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              <Filter size={20} color={theme.textSecondary} />
            </View>

            <Text style={styles.sectionTitle}>Popular Funds</Text>
            {popularFunds.map((fund) => (
              <View key={fund.id} style={styles.fundCard}>
                <View style={styles.fundHeader}>
                  <View style={styles.fundInfo}>
                    <Text style={styles.fundName}>{fund.name}</Text>
                    <Text style={styles.fundCategory}>{fund.category} • {fund.aum} AUM</Text>
                  </View>
                  <View style={[styles.riskBadge, { backgroundColor: getRiskColor(fund.riskLevel) }]}>
                    <Text style={styles.riskText}>{fund.riskLevel}</Text>
                  </View>
                </View>

                <View style={styles.fundMetrics}>
                  <View style={styles.metricItem}>
                    <Text style={styles.metricValue}>₹{fund.nav}</Text>
                    <Text style={styles.metricLabel}>NAV</Text>
                  </View>
                  <View style={styles.metricItem}>
                    <Text style={[styles.metricValue, { color: theme.success }]}>
                      {fund.returnsPercentage.toFixed(1)}%
                    </Text>
                    <Text style={styles.metricLabel}>1Y Returns</Text>
                  </View>
                  <View style={styles.metricItem}>
                    <Text style={styles.metricValue}>{fund.expenseRatio}%</Text>
                    <Text style={styles.metricLabel}>Expense Ratio</Text>
                  </View>
                </View>

                <View style={styles.fundActions}>
                  <TouchableOpacity style={[styles.actionButton, styles.secondaryAction]}>
                    <Text style={styles.secondaryActionText}>View Details</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.primaryAction]}
                    onPress={() => handleInvestment(fund)}
                  >
                    <Text style={styles.primaryActionText}>Invest Now</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </>
        )}

        {selectedTab === 'sip' && (
          <>
            <Text style={styles.sectionTitle}>Active SIPs</Text>
            {mockSIPs.map((sip) => (
              <View key={sip.id} style={styles.sipCard}>
                <View style={styles.sipHeader}>
                  <Text style={styles.sipFundName}>{sip.fundName}</Text>
                  <Text style={styles.sipAmount}>₹{sip.amount.toLocaleString('en-IN')}</Text>
                </View>

                <View style={styles.sipDetails}>
                  <View style={styles.sipDetailItem}>
                    <Text style={styles.sipDetailValue}>₹{sip.totalInvested.toLocaleString('en-IN')}</Text>
                    <Text style={styles.sipDetailLabel}>Total Invested</Text>
                  </View>
                  <View style={styles.sipDetailItem}>
                    <Text style={styles.sipDetailValue}>₹{sip.currentValue.toLocaleString('en-IN')}</Text>
                    <Text style={styles.sipDetailLabel}>Current Value</Text>
                  </View>
                  <View style={styles.sipDetailItem}>
                    <Text style={[styles.sipDetailValue, { color: theme.success }]}>
                      +₹{(sip.currentValue - sip.totalInvested).toLocaleString('en-IN')}
                    </Text>
                    <Text style={styles.sipDetailLabel}>Returns</Text>
                  </View>
                </View>

                <Text style={styles.nextSipDate}>Next SIP: {sip.nextDate}</Text>
              </View>
            ))}
          </>
        )}
      </ScrollView>

      {/* Risk Assessment Modal */}
      <Modal
        visible={showRiskAssessment}
        transparent
        animationType="slide"
        onRequestClose={() => setShowRiskAssessment(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Risk Assessment</Text>
              <Text style={styles.modalSubtitle}>
                Answer these questions to get personalized fund recommendations
              </Text>
            </View>

            <ScrollView>
              {riskQuestions.map((q, qIndex) => (
                <View key={qIndex} style={styles.questionContainer}>
                  <Text style={styles.questionText}>{q.question}</Text>
                  <View style={styles.answerOptions}>
                    {q.options.map((option, oIndex) => (
                      <TouchableOpacity
                        key={oIndex}
                        style={[
                          styles.answerOption,
                          riskAnswers[qIndex] === oIndex + 1 && styles.answerOptionSelected
                        ]}
                        onPress={() => {
                          const newAnswers = [...riskAnswers];
                          newAnswers[qIndex] = oIndex + 1;
                          setRiskAnswers(newAnswers);
                        }}
                      >
                        <Text style={[
                          styles.answerOptionText,
                          riskAnswers[qIndex] === oIndex + 1 && styles.answerOptionTextSelected
                        ]}>
                          {option}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ))}

              <TouchableOpacity
                style={styles.completeButton}
                onPress={handleRiskAssessment}
              >
                <Text style={styles.completeButtonText}>Complete Assessment</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}