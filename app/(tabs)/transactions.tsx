import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import { Filter, Search, Calendar, ChevronDown, X } from 'lucide-react-native';
import TransactionItem from '@/components/TransactionItem';
import SafeAreaView from '@/components/SafeAreaView';
import { mockTransactions, mockAccounts } from '@/data/mockData';
import { Transaction, Account } from '@/types';
import { useTheme } from '@/hooks/useTheme';

type FilterType = 'all' | 'credit' | 'debit';
type SortType = 'date' | 'amount';

export default function TransactionsScreen() {
  const { theme } = useTheme();
  const [transactions] = useState<Transaction[]>(mockTransactions);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAccount, setSelectedAccount] = useState<string>('all');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [sortType, setSortType] = useState<SortType>('date');
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState('7');

  const filteredTransactions = transactions
    .filter(transaction => {
      if (searchQuery && !transaction.description.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      if (selectedAccount !== 'all' && transaction.accountId !== selectedAccount) {
        return false;
      }
      
      if (filterType !== 'all' && transaction.type !== filterType) {
        return false;
      }
      
      const transactionDate = new Date(transaction.date);
      const today = new Date();
      const daysAgo = new Date(today.getTime() - parseInt(dateRange) * 24 * 60 * 60 * 1000);
      
      return transactionDate >= daysAgo;
    })
    .sort((a, b) => {
      if (sortType === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else {
        return Math.abs(b.amount) - Math.abs(a.amount);
      }
    });

  const getAccountName = (accountId: string) => {
    const account = mockAccounts.find(acc => acc.id === accountId);
    return account ? `${account.type} (${account.accountNumber})` : 'Unknown Account';
  };

  const getTotalAmount = (type: 'credit' | 'debit') => {
    return filteredTransactions
      .filter(t => t.type === type)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.text,
    },
    filterButton: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: theme.surfaceVariant,
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
    summaryContainer: {
      flexDirection: 'row',
      paddingHorizontal: 20,
      marginBottom: 16,
      gap: 12,
    },
    summaryCard: {
      flex: 1,
      backgroundColor: theme.surfaceVariant,
      borderRadius: 12,
      padding: 16,
    },
    summaryLabel: {
      fontSize: 12,
      color: theme.textSecondary,
      marginBottom: 8,
    },
    summaryAmount: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    activeFilters: {
      paddingHorizontal: 20,
      marginBottom: 16,
    },
    activeFiltersLabel: {
      fontSize: 14,
      color: theme.textSecondary,
      marginBottom: 8,
    },
    filterChip: {
      backgroundColor: theme.primary,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      marginRight: 8,
    },
    filterChipText: {
      fontSize: 12,
      color: theme.textOnPrimary,
      fontWeight: '600',
    },
    transactionsList: {
      flex: 1,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 60,
    },
    emptyStateText: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 8,
    },
    emptyStateSubtext: {
      fontSize: 14,
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
    filterSection: {
      marginBottom: 24,
    },
    filterLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 12,
    },
    filterDropdown: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: theme.surfaceVariant,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 8,
    },
    filterDropdownText: {
      fontSize: 16,
      color: theme.text,
    },
    filterOptions: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    filterOption: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: theme.surfaceVariant,
      borderWidth: 1,
      borderColor: theme.border,
    },
    filterOptionActive: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    filterOptionText: {
      fontSize: 14,
      color: theme.text,
    },
    filterOptionTextActive: {
      color: theme.textOnPrimary,
      fontWeight: '600',
    },
    applyButton: {
      backgroundColor: theme.primary,
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: 'center',
      marginTop: 16,
    },
    applyButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.textOnPrimary,
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.title}>Transactions</Text>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(true)}
        >
          <Filter size={20} color={theme.primary} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Search size={20} color={theme.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search transactions..."
          placeholderTextColor={theme.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total Credits</Text>
          <Text style={[styles.summaryAmount, { color: theme.success }]}>
            +₹{getTotalAmount('credit').toLocaleString('en-IN')}
          </Text>
        </View>
        
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total Debits</Text>
          <Text style={[styles.summaryAmount, { color: theme.error }]}>
            -₹{getTotalAmount('debit').toLocaleString('en-IN')}
          </Text>
        </View>
      </View>

      {/* Active Filters */}
      {(selectedAccount !== 'all' || filterType !== 'all' || dateRange !== '7') && (
        <View style={styles.activeFilters}>
          <Text style={styles.activeFiltersLabel}>Active Filters:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {selectedAccount !== 'all' && (
              <View style={styles.filterChip}>
                <Text style={styles.filterChipText}>
                  {getAccountName(selectedAccount)}
                </Text>
              </View>
            )}
            {filterType !== 'all' && (
              <View style={styles.filterChip}>
                <Text style={styles.filterChipText}>
                  {filterType === 'credit' ? 'Credits' : 'Debits'}
                </Text>
              </View>
            )}
            {dateRange !== '7' && (
              <View style={styles.filterChip}>
                <Text style={styles.filterChipText}>
                  Last {dateRange} days
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      )}

      {/* Transactions List */}
      <ScrollView style={styles.transactionsList} showsVerticalScrollIndicator={false}>
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((transaction) => (
            <TransactionItem key={transaction.id} transaction={transaction} />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No transactions found</Text>
            <Text style={styles.emptyStateSubtext}>
              Try adjusting your filters or search query
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Filter Modal */}
      <Modal
        visible={showFilters}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFilters(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Transactions</Text>
              <TouchableOpacity onPress={() => setShowFilters(false)}>
                <X size={24} color={theme.text} />
              </TouchableOpacity>
            </View>

            {/* Account Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Account</Text>
              <TouchableOpacity style={styles.filterDropdown}>
                <Text style={styles.filterDropdownText}>
                  {selectedAccount === 'all' ? 'All Accounts' : getAccountName(selectedAccount)}
                </Text>
                <ChevronDown size={20} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Transaction Type Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Transaction Type</Text>
              <View style={styles.filterOptions}>
                {(['all', 'credit', 'debit'] as FilterType[]).map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.filterOption,
                      filterType === type && styles.filterOptionActive
                    ]}
                    onPress={() => setFilterType(type)}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        filterType === type && styles.filterOptionTextActive
                      ]}
                    >
                      {type === 'all' ? 'All' : type === 'credit' ? 'Credits' : 'Debits'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Date Range Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Date Range</Text>
              <View style={styles.filterOptions}>
                {['7', '30', '90', '365'].map((days) => (
                  <TouchableOpacity
                    key={days}
                    style={[
                      styles.filterOption,
                      dateRange === days && styles.filterOptionActive
                    ]}
                    onPress={() => setDateRange(days)}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        dateRange === days && styles.filterOptionTextActive
                      ]}
                    >
                      {days === '365' ? '1 Year' : `${days} Days`}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Sort Options */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Sort By</Text>
              <View style={styles.filterOptions}>
                {(['date', 'amount'] as SortType[]).map((sort) => (
                  <TouchableOpacity
                    key={sort}
                    style={[
                      styles.filterOption,
                      sortType === sort && styles.filterOptionActive
                    ]}
                    onPress={() => setSortType(sort)}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        sortType === sort && styles.filterOptionTextActive
                      ]}
                    >
                      {sort === 'date' ? 'Date' : 'Amount'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => setShowFilters(false)}
            >
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}