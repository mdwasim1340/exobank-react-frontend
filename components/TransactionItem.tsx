import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react-native';
import { Transaction } from '@/types';
import { useTheme } from '@/hooks/useTheme';

interface TransactionItemProps {
  transaction: Transaction;
}

export default function TransactionItem({ transaction }: TransactionItemProps) {
  const { theme } = useTheme();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatAmount = (amount: number) => {
    return `₹${Math.abs(amount).toLocaleString('en-IN')}`;
  };

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      backgroundColor: theme.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.surfaceVariant,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    content: {
      flex: 1,
    },
    description: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 4,
    },
    date: {
      fontSize: 12,
      color: theme.textSecondary,
      marginBottom: 2,
    },
    category: {
      fontSize: 12,
      color: theme.textSecondary,
    },
    amountContainer: {
      alignItems: 'flex-end',
    },
    amount: {
      fontSize: 16,
      fontWeight: 'bold',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {transaction.type === 'credit' ? (
          <ArrowDownLeft size={20} color={theme.success} />
        ) : (
          <ArrowUpRight size={20} color={theme.error} />
        )}
      </View>
      
      <View style={styles.content}>
        <Text style={styles.description}>{transaction.description}</Text>
        <Text style={styles.date}>{formatDate(transaction.date)}</Text>
        <Text style={styles.category}>{transaction.category}</Text>
      </View>
      
      <View style={styles.amountContainer}>
        <Text
          style={[
            styles.amount,
            { color: transaction.type === 'credit' ? theme.success : theme.error }
          ]}
        >
          {transaction.type === 'credit' ? '+' : '-'}{formatAmount(transaction.amount)}
        </Text>
      </View>
    </View>
  );
}