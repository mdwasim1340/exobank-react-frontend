import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Alert,
} from 'react-native';
import { ArrowLeft, Eye, EyeOff, Download, Share, Copy, MoveHorizontal as MoreHorizontal, TrendingUp, Calendar } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { mockAccounts, mockTransactions } from '@/data/mockData';
import TransactionItem from '@/components/TransactionItem';

export default function AccountDetailsScreen() {
  const { theme } = useTheme();
  const { id } = useLocalSearchParams();
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [showActions, setShowActions] = useState(false);

  const account = mockAccounts.find(acc => acc.id === id);
  const accountTransactions = mockTransactions.filter(t => t.accountId === id);

  if (!account) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.errorText, { color: theme.text }]}>Account not found</Text>
      </SafeAreaView>
    );
  }

  const formatAmount = (amount: number) => {
    return isBalanceVisible ? `₹${Math.abs(amount).toLocaleString('en-IN')}` : '₹****';
  };

  const handleCopyAccountNumber = () => {
    Alert.alert('Copied', 'Account number copied to clipboard');
  };

  const handleDownloadStatement = () => {
    Alert.alert(
      'Download Statement',
      'Choose format and date range',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'PDF (Last 3 months)', onPress: () => downloadStatement('pdf', '3months') },
        { text: 'Excel (Last 6 months)', onPress: () => downloadStatement('excel', '6months') },
      ]
    );
  };

  const downloadStatement = (format: string, period: string) => {
    Alert.alert('Success', `${format.toUpperCase()} statement for ${period} will be downloaded shortly`);
  };

  const handleShareStatement = () => {
    Alert.alert(
      'Share Statement',
      'Choose sharing method',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Email', onPress: () => shareStatement('email') },
        { text: 'WhatsApp', onPress: () => shareStatement('whatsapp') },
        { text: 'More Options', onPress: () => shareStatement('more') },
      ]
    );
  };

  const shareStatement = (method: string) => {
    Alert.alert('Success', `Statement shared via ${method}`);
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
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
      flex: 1,
      textAlign: 'center',
      marginHorizontal: 16,
    },
    moreButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.surfaceVariant,
      justifyContent: 'center',
      alignItems: 'center',
    },
    accountCard: {
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
    accountType: {
      fontSize: 16,
      color: theme.textOnPrimary,
      opacity: 0.8,
      marginBottom: 8,
    },
    balanceContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    balance: {
      fontSize: 32,
      fontWeight: 'bold',
      color: theme.textOnPrimary,
    },
    eyeButton: {
      padding: 8,
    },
    accountInfo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    accountNumber: {
      fontSize: 14,
      color: theme.textOnPrimary,
      opacity: 0.8,
    },
    copyButton: {
      padding: 4,
    },
    quickActions: {
      flexDirection: 'row',
      paddingHorizontal: 20,
      marginBottom: 32,
      gap: 12,
    },
    actionButton: {
      flex: 1,
      backgroundColor: theme.surfaceVariant,
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
    },
    actionIcon: {
      marginBottom: 8,
    },
    actionText: {
      fontSize: 12,
      color: theme.text,
      fontWeight: '500',
    },
    statsContainer: {
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
    },
    statLabel: {
      fontSize: 12,
      color: theme.textSecondary,
      marginBottom: 4,
    },
    statValue: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.text,
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
    emptyTransactions: {
      padding: 40,
      alignItems: 'center',
    },
    emptyText: {
      fontSize: 16,
      color: theme.textSecondary,
      textAlign: 'center',
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
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 20,
      textAlign: 'center',
    },
    modalAction: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
      paddingHorizontal: 16,
      borderRadius: 12,
      marginBottom: 8,
    },
    modalActionText: {
      fontSize: 16,
      color: theme.text,
      marginLeft: 16,
      fontWeight: '500',
    },
    errorText: {
      fontSize: 18,
      textAlign: 'center',
      marginTop: 100,
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
        <Text style={styles.headerTitle}>Account Details</Text>
        <TouchableOpacity
          style={styles.moreButton}
          onPress={() => setShowActions(true)}
        >
          <MoreHorizontal size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Account Card */}
        <View style={styles.accountCard}>
          <Text style={styles.accountType}>{account.type} Account</Text>
          <View style={styles.balanceContainer}>
            <Text style={styles.balance}>{formatAmount(account.balance)}</Text>
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setIsBalanceVisible(!isBalanceVisible)}
            >
              {isBalanceVisible ? (
                <Eye size={24} color={theme.textOnPrimary} />
              ) : (
                <EyeOff size={24} color={theme.textOnPrimary} />
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.accountInfo}>
            <Text style={styles.accountNumber}>Account: {account.accountNumber}</Text>
            <TouchableOpacity style={styles.copyButton} onPress={handleCopyAccountNumber}>
              <Copy size={16} color={theme.textOnPrimary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton} onPress={() => router.push(`/transfer?sourceAccount=${account.id}`)}>
            <TrendingUp size={24} color={theme.primary} style={styles.actionIcon} />
            <Text style={styles.actionText}>Transfer Money</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleDownloadStatement}>
            <Download size={24} color={theme.primary} style={styles.actionIcon} />
            <Text style={styles.actionText}>Statement</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleShareStatement}>
            <Share size={24} color={theme.primary} style={styles.actionIcon} />
            <Text style={styles.actionText}>Share Statement</Text>
          </TouchableOpacity>
        </View>

        {/* Account Statistics */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Interest Rate</Text>
            <Text style={styles.statValue}>{account.interestRate}% p.a.</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Accrued Interest</Text>
            <Text style={styles.statValue}>₹{Math.abs(account.accruedInterest).toLocaleString('en-IN')}</Text>
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          {accountTransactions.length > 0 ? (
            <View style={styles.transactionsList}>
              {accountTransactions.slice(0, 5).map((transaction) => (
                <TransactionItem key={transaction.id} transaction={transaction} />
              ))}
            </View>
          ) : (
            <View style={styles.emptyTransactions}>
              <Text style={styles.emptyText}>No transactions found for this account</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Actions Modal */}
      <Modal
        visible={showActions}
        transparent
        animationType="slide"
        onRequestClose={() => setShowActions(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowActions(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Account Actions</Text>
            
            <TouchableOpacity style={styles.modalAction} onPress={handleDownloadStatement}>
              <Download size={20} color={theme.primary} />
              <Text style={styles.modalActionText}>Download Statement</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.modalAction} onPress={handleShareStatement}>
              <Share size={20} color={theme.primary} />
              <Text style={styles.modalActionText}>Share Account Details</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.modalAction}>
              <Calendar size={20} color={theme.primary} />
              <Text style={styles.modalActionText}>Set Alerts</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}