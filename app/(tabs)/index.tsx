import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Image,
} from 'react-native';
import { Plus, Send, QrCode, ChevronRight, Bell, Search, Receipt } from 'lucide-react-native';
import { router } from 'expo-router';
import AccountCard from '@/components/AccountCard';
import TransactionItem from '@/components/TransactionItem';
import SafeAreaView from '@/components/SafeAreaView';
import { mockAccounts, mockTransactions, mockUser } from '@/data/mockData';
import { Account, Transaction } from '@/types';
import { useTheme } from '@/hooks/useTheme';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { theme } = useTheme();
  const [accounts, setAccounts] = useState<Account[]>(mockAccounts);
  const [transactions] = useState<Transaction[]>(mockTransactions.slice(0, 3));

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

  const handleAddMoney = () => {
    router.push('/add-money');
  };

  const handleTransfer = () => {
    router.push('/transfer');
  };

  const handleQRScan = () => {
    router.push('/qr-scanner');
  };

  const handleSearch = () => {
    router.push('/search');
  };

  const handleNotifications = () => {
    router.push('/notifications');
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
    },
    logoContainer: {
      marginRight: 12,
    },
    logo: {
      width: 80,
      height: 30,
    },
    welcomeContainer: {
      flex: 1,
    },
    welcomeText: {
      fontSize: 14,
      color: theme.textSecondary,
      marginBottom: 2,
    },
    userName: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
    },
    headerActions: {
      flexDirection: 'row',
      gap: 8,
    },
    headerButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.surfaceVariant,
      justifyContent: 'center',
      alignItems: 'center',
    },
    quickActions: {
      flexDirection: 'row',
      paddingHorizontal: 20,
      marginBottom: 32,
      justifyContent: 'space-around',
    },
    actionButton: {
      alignItems: 'center',
      flex: 1,
    },
    actionIcon: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: theme.surfaceVariant,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 8,
      elevation: 2,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
    },
    actionText: {
      fontSize: 12,
      color: theme.text,
      fontWeight: '500',
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
      paddingHorizontal: 20,
      marginBottom: 16,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      marginBottom: 16,
    },
    viewAllText: {
      fontSize: 14,
      color: theme.primary,
      fontWeight: '600',
    },
    accountsList: {
      paddingLeft: 12,
    },
    transactionsList: {
      backgroundColor: theme.surface,
      borderRadius: 16,
      marginHorizontal: 20,
      overflow: 'hidden',
      elevation: 2,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
      borderWidth: 1,
      borderColor: theme.border,
    },
    servicesGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: 20,
      gap: 12,
    },
    serviceCard: {
      width: '48%',
      backgroundColor: theme.surfaceVariant,
      padding: 16,
      borderRadius: 12,
      borderLeftWidth: 4,
      borderLeftColor: theme.primary,
      alignItems: 'center',
      minHeight: 120,
    },
    serviceIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.background,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
    },
    serviceEmoji: {
      fontSize: 24,
    },
    serviceTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 4,
      textAlign: 'center',
    },
    serviceDescription: {
      fontSize: 12,
      color: theme.textSecondary,
      textAlign: 'center',
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with safe area spacing */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image
              source={require('@/assets/images/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>Good morning,</Text>
            <Text style={styles.userName}>{mockUser.name}</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton} onPress={handleSearch}>
              <Search size={20} color={theme.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton} onPress={handleNotifications}>
              <Bell size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* My Accounts Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Accounts</Text>
            <TouchableOpacity onPress={() => router.push('/accounts')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={accounts}
            renderItem={({ item }) => (
              <AccountCard
                account={item}
                onToggleVisibility={handleToggleVisibility}
                onPress={handleAccountPress}
              />
            )}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.accountsList}
            snapToInterval={width * 0.85 + 16}
            decelerationRate="fast"
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleAddMoney}
          >
            <View style={styles.actionIcon}>
              <Plus size={20} color={theme.primary} />
            </View>
            <Text style={styles.actionText}>Add Money</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleQRScan}
          >
            <View style={styles.actionIcon}>
              <QrCode size={20} color={theme.primary} />
            </View>
            <Text style={styles.actionText}>QR Pay</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/bill-payments')}
          >
            <View style={styles.actionIcon}>
              <Receipt size={20} color={theme.primary} />
            </View>
            <Text style={styles.actionText}>Bill Pay</Text>
          </TouchableOpacity>
        </View>

        {/* Financial Services */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Financial Services</Text>
          <View style={styles.servicesGrid}>
            <TouchableOpacity style={styles.serviceCard} onPress={() => router.push('/fixed-deposits')}>
              <View style={styles.serviceIcon}>
                <Text style={styles.serviceEmoji}>🏦</Text>
              </View>
              <Text style={styles.serviceTitle}>Fixed Deposit</Text>
              <Text style={styles.serviceDescription}>Earn up to 7.5% interest</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.serviceCard} onPress={() => router.push('/mutual-funds')}>
              <View style={styles.serviceIcon}>
                <Text style={styles.serviceEmoji}>📈</Text>
              </View>
              <Text style={styles.serviceTitle}>Mutual Funds</Text>
              <Text style={styles.serviceDescription}>Start SIP from ₹500</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.serviceCard} onPress={() => router.push('/insurance')}>
              <View style={styles.serviceIcon}>
                <Text style={styles.serviceEmoji}>🛡️</Text>
              </View>
              <Text style={styles.serviceTitle}>Insurance</Text>
              <Text style={styles.serviceDescription}>Protect your family</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.serviceCard} onPress={() => router.push('/loans')}>
              <View style={styles.serviceIcon}>
                <Text style={styles.serviceEmoji}>💰</Text>
              </View>
              <Text style={styles.serviceTitle}>Loans</Text>
              <Text style={styles.serviceDescription}>Quick approval</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity
              onPress={() => router.push('/transactions')}
            >
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.transactionsList}>
            {transactions.map((transaction) => (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}