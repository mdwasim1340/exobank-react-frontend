import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { ArrowLeft, TrendingUp, TrendingDown, ChartPie as PieChart, ChartBar as BarChart3, Plus, Eye, EyeOff } from 'lucide-react-native';
import { router } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';

const { width } = Dimensions.get('window');

interface Investment {
  id: string;
  name: string;
  type: 'mutual_fund' | 'stocks' | 'bonds' | 'fd' | 'sip';
  currentValue: number;
  investedAmount: number;
  returns: number;
  returnsPercentage: number;
  units?: number;
  nav?: number;
}

const mockInvestments: Investment[] = [
  {
    id: '1',
    name: 'HDFC Top 100 Fund',
    type: 'mutual_fund',
    currentValue: 125000,
    investedAmount: 100000,
    returns: 25000,
    returnsPercentage: 25.0,
    units: 1250,
    nav: 100,
  },
  {
    id: '2',
    name: 'Reliance Industries',
    type: 'stocks',
    currentValue: 85000,
    investedAmount: 80000,
    returns: 5000,
    returnsPercentage: 6.25,
    units: 50,
    nav: 1700,
  },
  {
    id: '3',
    name: 'SBI SIP',
    type: 'sip',
    currentValue: 45000,
    investedAmount: 40000,
    returns: 5000,
    returnsPercentage: 12.5,
  },
  {
    id: '4',
    name: 'Government Bonds',
    type: 'bonds',
    currentValue: 102000,
    investedAmount: 100000,
    returns: 2000,
    returnsPercentage: 2.0,
  },
];

export default function InvestmentsScreen() {
  const { theme } = useTheme();
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'portfolio' | 'watchlist' | 'orders'>('portfolio');

  const totalInvested = mockInvestments.reduce((sum, inv) => sum + inv.investedAmount, 0);
  const totalCurrent = mockInvestments.reduce((sum, inv) => sum + inv.currentValue, 0);
  const totalReturns = totalCurrent - totalInvested;
  const totalReturnsPercentage = (totalReturns / totalInvested) * 100;

  const formatAmount = (amount: number) => {
    return isBalanceVisible ? `₹${amount.toLocaleString('en-IN')}` : '₹****';
  };

  const getInvestmentIcon = (type: string) => {
    switch (type) {
      case 'mutual_fund':
        return '📈';
      case 'stocks':
        return '📊';
      case 'bonds':
        return '🏛️';
      case 'fd':
        return '🏦';
      case 'sip':
        return '💰';
      default:
        return '💼';
    }
  };

  const getInvestmentTypeLabel = (type: string) => {
    switch (type) {
      case 'mutual_fund':
        return 'Mutual Fund';
      case 'stocks':
        return 'Stocks';
      case 'bonds':
        return 'Bonds';
      case 'fd':
        return 'Fixed Deposit';
      case 'sip':
        return 'SIP';
      default:
        return 'Investment';
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
    addButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    portfolioCard: {
      backgroundColor: theme.primary,
      marginHorizontal: 20,
      marginBottom: 24,
      padding: 24,
      borderRadius: 16,
      elevation: 4,
      shadowColor: theme.shadowDark,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    portfolioHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    portfolioLabel: {
      fontSize: 14,
      color: theme.textOnPrimary,
      opacity: 0.8,
    },
    eyeButton: {
      padding: 4,
    },
    portfolioValue: {
      fontSize: 32,
      fontWeight: 'bold',
      color: theme.textOnPrimary,
      marginBottom: 8,
    },
    returnsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    returnsText: {
      fontSize: 16,
      color: theme.textOnPrimary,
      marginRight: 8,
    },
    returnsPercentage: {
      fontSize: 14,
      color: theme.textOnPrimary,
      opacity: 0.9,
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
    quickStats: {
      flexDirection: 'row',
      paddingHorizontal: 20,
      marginBottom: 24,
      gap: 12,
    },
    statCard: {
      flex: 1,
      backgroundColor: theme.surfaceVariant,
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
    },
    statValue: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 12,
      color: theme.textSecondary,
    },
    investmentsList: {
      paddingHorizontal: 20,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 16,
    },
    investmentCard: {
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
    investmentHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    investmentIcon: {
      fontSize: 24,
      marginRight: 12,
    },
    investmentInfo: {
      flex: 1,
    },
    investmentName: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 2,
    },
    investmentType: {
      fontSize: 12,
      color: theme.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    investmentDetails: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    investmentValue: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
    },
    investmentReturns: {
      alignItems: 'flex-end',
    },
    returnsAmount: {
      fontSize: 14,
      fontWeight: '600',
      marginBottom: 2,
    },
    returnsPercent: {
      fontSize: 12,
      fontWeight: '500',
    },
    investmentMeta: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 8,
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: theme.border,
    },
    metaItem: {
      alignItems: 'center',
    },
    metaValue: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.text,
    },
    metaLabel: {
      fontSize: 10,
      color: theme.textSecondary,
      marginTop: 2,
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
    startInvestingButton: {
      backgroundColor: theme.primary,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
      marginTop: 16,
    },
    startInvestingText: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.textOnPrimary,
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
        <Text style={styles.headerTitle}>Investments</Text>
        <TouchableOpacity style={styles.addButton}>
          <Plus size={24} color={theme.textOnPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Portfolio Summary */}
        <View style={styles.portfolioCard}>
          <View style={styles.portfolioHeader}>
            <Text style={styles.portfolioLabel}>Total Portfolio Value</Text>
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setIsBalanceVisible(!isBalanceVisible)}
            >
              {isBalanceVisible ? (
                <Eye size={20} color={theme.textOnPrimary} />
              ) : (
                <EyeOff size={20} color={theme.textOnPrimary} />
              )}
            </TouchableOpacity>
          </View>
          <Text style={styles.portfolioValue}>{formatAmount(totalCurrent)}</Text>
          <View style={styles.returnsContainer}>
            {totalReturns >= 0 ? (
              <TrendingUp size={16} color={theme.textOnPrimary} />
            ) : (
              <TrendingDown size={16} color={theme.textOnPrimary} />
            )}
            <Text style={styles.returnsText}>
              {isBalanceVisible ? `₹${Math.abs(totalReturns).toLocaleString('en-IN')}` : '₹****'}
            </Text>
            <Text style={styles.returnsPercentage}>
              ({totalReturnsPercentage >= 0 ? '+' : ''}{totalReturnsPercentage.toFixed(2)}%)
            </Text>
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
            style={[styles.tab, selectedTab === 'watchlist' && styles.tabActive]}
            onPress={() => setSelectedTab('watchlist')}
          >
            <Text style={[styles.tabText, selectedTab === 'watchlist' && styles.tabTextActive]}>
              Watchlist
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'orders' && styles.tabActive]}
            onPress={() => setSelectedTab('orders')}
          >
            <Text style={[styles.tabText, selectedTab === 'orders' && styles.tabTextActive]}>
              Orders
            </Text>
          </TouchableOpacity>
        </View>

        {selectedTab === 'portfolio' && (
          <>
            {/* Quick Stats */}
            <View style={styles.quickStats}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{formatAmount(totalInvested)}</Text>
                <Text style={styles.statLabel}>Invested</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={[styles.statValue, { color: totalReturns >= 0 ? theme.success : theme.error }]}>
                  {isBalanceVisible ? `₹${Math.abs(totalReturns).toLocaleString('en-IN')}` : '₹****'}
                </Text>
                <Text style={styles.statLabel}>Returns</Text>
              </View>
            </View>

            {/* Investments List */}
            <View style={styles.investmentsList}>
              <Text style={styles.sectionTitle}>Your Investments</Text>
              {mockInvestments.map((investment) => (
                <TouchableOpacity key={investment.id} style={styles.investmentCard}>
                  <View style={styles.investmentHeader}>
                    <Text style={styles.investmentIcon}>
                      {getInvestmentIcon(investment.type)}
                    </Text>
                    <View style={styles.investmentInfo}>
                      <Text style={styles.investmentName}>{investment.name}</Text>
                      <Text style={styles.investmentType}>
                        {getInvestmentTypeLabel(investment.type)}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.investmentDetails}>
                    <Text style={styles.investmentValue}>
                      {formatAmount(investment.currentValue)}
                    </Text>
                    <View style={styles.investmentReturns}>
                      <Text style={[
                        styles.returnsAmount,
                        { color: investment.returns >= 0 ? theme.success : theme.error }
                      ]}>
                        {investment.returns >= 0 ? '+' : ''}
                        {isBalanceVisible ? `₹${Math.abs(investment.returns).toLocaleString('en-IN')}` : '₹****'}
                      </Text>
                      <Text style={[
                        styles.returnsPercent,
                        { color: investment.returns >= 0 ? theme.success : theme.error }
                      ]}>
                        ({investment.returnsPercentage >= 0 ? '+' : ''}{investment.returnsPercentage.toFixed(2)}%)
                      </Text>
                    </View>
                  </View>

                  {(investment.units || investment.nav) && (
                    <View style={styles.investmentMeta}>
                      {investment.units && (
                        <View style={styles.metaItem}>
                          <Text style={styles.metaValue}>{investment.units}</Text>
                          <Text style={styles.metaLabel}>Units</Text>
                        </View>
                      )}
                      {investment.nav && (
                        <View style={styles.metaItem}>
                          <Text style={styles.metaValue}>₹{investment.nav}</Text>
                          <Text style={styles.metaLabel}>NAV/Price</Text>
                        </View>
                      )}
                      <View style={styles.metaItem}>
                        <Text style={styles.metaValue}>
                          {formatAmount(investment.investedAmount)}
                        </Text>
                        <Text style={styles.metaLabel}>Invested</Text>
                      </View>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {selectedTab === 'watchlist' && (
          <View style={styles.emptyState}>
            <PieChart size={48} color={theme.textSecondary} style={styles.emptyIcon} />
            <Text style={styles.emptyTitle}>No items in watchlist</Text>
            <Text style={styles.emptySubtitle}>
              Add stocks and mutual funds to your watchlist to track their performance
            </Text>
            <TouchableOpacity style={styles.startInvestingButton}>
              <Text style={styles.startInvestingText}>Explore Investments</Text>
            </TouchableOpacity>
          </View>
        )}

        {selectedTab === 'orders' && (
          <View style={styles.emptyState}>
            <BarChart3 size={48} color={theme.textSecondary} style={styles.emptyIcon} />
            <Text style={styles.emptyTitle}>No recent orders</Text>
            <Text style={styles.emptySubtitle}>
              Your buy and sell orders will appear here
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}