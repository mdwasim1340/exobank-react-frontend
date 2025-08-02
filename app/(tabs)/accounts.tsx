import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { router } from 'expo-router';
import AccountCard from '@/components/AccountCard';
import SafeAreaView from '@/components/SafeAreaView';
import { mockAccounts } from '@/data/mockData';
import { Account } from '@/types';
import { useTheme } from '@/hooks/useTheme';

export default function AccountsScreen() {
  const { theme } = useTheme();
  const [accounts, setAccounts] = useState<Account[]>(mockAccounts);

  const handleToggleVisibility = (accountId: string) => {
    setAccounts(prev =>
      prev.map(account =>
        account.id === accountId
          ? { ...account, isVisible: !account.isVisible }
          : account
      )
    );
  };

  const handleAccountPress = (account: Account) => {
    router.push(`/account-details?id=${account.id}`);
  };

  const getTotalBalance = () => {
    return accounts
      .filter(account => account.type !== 'Loan')
      .reduce((total, account) => total + account.balance, 0);
  };

  const getTotalLoan = () => {
    return accounts
      .filter(account => account.type === 'Loan')
      .reduce((total, account) => total + Math.abs(account.balance), 0);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.text,
    },
    summaryContainer: {
      flexDirection: 'row',
      paddingHorizontal: 20,
      marginBottom: 24,
      gap: 12,
    },
    summaryCard: {
      flex: 1,
      borderRadius: 12,
      padding: 16,
    },
    balanceCard: {
      backgroundColor: theme.primary,
    },
    loanCard: {
      backgroundColor: theme.secondary,
    },
    summaryLabel: {
      fontSize: 14,
      color: theme.textOnPrimary,
      opacity: 0.9,
      marginBottom: 8,
    },
    loanLabel: {
      color: theme.textOnPrimary,
    },
    summaryAmount: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.textOnPrimary,
    },
    loanAmount: {
      color: theme.textOnPrimary,
    },
    accountsSection: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 16,
      paddingHorizontal: 20,
    },
    accountCardContainer: {
      marginBottom: 16,
    },
    cardWrapper: {
      alignItems: 'center',
    },
    detailsButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 12,
      paddingVertical: 8,
    },
    detailsButtonText: {
      fontSize: 14,
      color: theme.primary,
      fontWeight: '600',
      marginRight: 4,
    },
    quickActions: {
      paddingHorizontal: 20,
      marginBottom: 24,
    },
    actionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 16,
      paddingHorizontal: 16,
      backgroundColor: theme.surface,
      borderRadius: 12,
      marginBottom: 8,
      elevation: 1,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
      borderWidth: 1,
      borderColor: theme.border,
      minHeight: 56,
    },
    actionText: {
      fontSize: 16,
      color: theme.text,
      fontWeight: '500',
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.title}>My Accounts</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <View style={[styles.summaryCard, styles.balanceCard]}>
            <Text style={styles.summaryLabel}>Total Balance</Text>
            <Text style={styles.summaryAmount}>
              ₹{getTotalBalance().toLocaleString('en-IN')}
            </Text>
          </View>
          
          <View style={[styles.summaryCard, styles.loanCard]}>
            <Text style={[styles.summaryLabel, styles.loanLabel]}>Total Loans</Text>
            <Text style={[styles.summaryAmount, styles.loanAmount]}>
              ₹{getTotalLoan().toLocaleString('en-IN')}
            </Text>
          </View>
        </View>

        {/* Account Cards */}
        <View style={styles.accountsSection}>
          <Text style={styles.sectionTitle}>All Accounts</Text>
          
          {accounts.map((account) => (
            <View key={account.id} style={styles.accountCardContainer}>
              <View style={styles.cardWrapper}>
                <AccountCard
                  account={account}
                  onToggleVisibility={handleToggleVisibility}
                  onPress={handleAccountPress}
                />
              </View>
              
              <TouchableOpacity
                style={styles.detailsButton}
                onPress={() => handleAccountPress(account)}
              >
                <Text style={styles.detailsButtonText}>View Details</Text>
                <ChevronRight size={16} color={theme.primary} />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <TouchableOpacity style={styles.actionItem}>
            <Text style={styles.actionText}>Open New Account</Text>
            <ChevronRight size={16} color={theme.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionItem}>
            <Text style={styles.actionText}>Account Statements</Text>
            <ChevronRight size={16} color={theme.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionItem}>
            <Text style={styles.actionText}>Interest Certificates</Text>
            <ChevronRight size={16} color={theme.textSecondary} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}