import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { PiggyBank, Repeat, TrendingUp, Wallet } from 'lucide-react-native';
import { FinancialProduct } from '@/types';
import { Colors } from '@/constants/Colors';

interface ProductCardProps {
  product: FinancialProduct;
  onPress: (product: FinancialProduct) => void;
}

export default function ProductCard({ product, onPress }: ProductCardProps) {
  const getIcon = (iconName: string) => {
    const iconProps = { size: 32, color: Colors.primary };
    
    switch (iconName) {
      case 'piggy-bank':
        return <PiggyBank {...iconProps} />;
      case 'repeat':
        return <Repeat {...iconProps} />;
      case 'trending-up':
        return <TrendingUp {...iconProps} />;
      case 'wallet':
        return <Wallet {...iconProps} />;
      default:
        return <PiggyBank {...iconProps} />;
    }
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(product)}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        {getIcon(product.icon)}
      </View>
      <Text style={styles.title}>{product.title}</Text>
      <Text style={styles.description}>{product.description}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    margin: 8,
    alignItems: 'center',
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: 12,
    color: Colors.gray,
    textAlign: 'center',
    lineHeight: 16,
  },
});