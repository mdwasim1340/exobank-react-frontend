import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { Account } from '@/types';
import { useTheme } from '@/hooks/useTheme';

interface AccountCardProps {
  account: Account;
  onToggleVisibility: (id: string) => void;
  onPress: (account: Account) => void;
}

const { width } = Dimensions.get('window');
const cardWidth = width * 0.85;

export default function AccountCard({ account, onToggleVisibility, onPress }: AccountCardProps) {
  const { theme } = useTheme();
  const scaleValue = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const getCardColor = (type: string) => {
    switch (type) {
      case 'Savings':
        return theme.primary;
      case 'FD':
        return theme.info;
      case 'RD':
        return theme.warning;
      case 'Loan':
        return theme.secondary;
      default:
        return theme.primary;
    }
  };

  const formatAmount = (amount: number) => {
    return account.isVisible ? `₹${Math.abs(amount).toLocaleString('en-IN')}` : '₹****';
  };

  const styles = StyleSheet.create({
    card: {
      width: cardWidth,
      marginHorizontal: 10,
      padding: 16,
      borderRadius: 16,
      elevation: 3,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
      minHeight: 100,
      backgroundColor: getCardColor(account.type),
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    accountInfo: {
      flex: 1,
    },
    accountType: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.textOnPrimary,
      marginBottom: 2,
    },
    accountNumber: {
      fontSize: 12,
      color: theme.textOnPrimary,
      opacity: 0.8,
    },
    eyeButton: {
      padding: 8,
      marginTop: -8,
      marginRight: -8,
    },
    balanceContainer: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    balanceLabel: {
      fontSize: 10,
      color: theme.textOnPrimary,
      opacity: 0.7,
      marginBottom: 2,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    balance: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.textOnPrimary,
    },
    interestRate: {
      fontSize: 10,
      color: theme.textOnPrimary,
      opacity: 0.8,
      marginTop: 2,
    },
  });

  return (
    <Animated.View style={[{ transform: [{ scale: scaleValue }] }]}>
      <TouchableOpacity
        style={styles.card}
        onPress={() => onPress(account)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <View style={styles.header}>
          <View style={styles.accountInfo}>
            <Text style={styles.accountType}>{account.type}</Text>
            <Text style={styles.accountNumber}>{account.accountNumber}</Text>
          </View>
          <TouchableOpacity
            onPress={() => onToggleVisibility(account.id)}
            style={styles.eyeButton}
          >
            {account.isVisible ? (
              <Eye size={18} color={theme.textOnPrimary} />
            ) : (
              <EyeOff size={18} color={theme.textOnPrimary} />
            )}
          </TouchableOpacity>
        </View>
        
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>
            {account.type === 'Loan' ? 'Outstanding' : 'Available Balance'}
          </Text>
          <Text style={styles.balance}>{formatAmount(account.balance)}</Text>
          {account.interestRate && (
            <Text style={styles.interestRate}>
              {account.interestRate}% p.a.
            </Text>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}