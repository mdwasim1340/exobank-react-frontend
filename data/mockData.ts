import { Account, Transaction, FinancialProduct, User } from '@/types';

export const mockUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1 234 567 8900',
};

export const mockAccounts: Account[] = [
  {
    id: '1',
    type: 'Savings',
    accountNumber: '****1234',
    balance: 25000.50,
    interestRate: 3.5,
    accruedInterest: 875.25,
    isVisible: true,
  },
  {
    id: '2',
    type: 'FD',
    accountNumber: '****5678',
    balance: 100000.00,
    interestRate: 6.5,
    accruedInterest: 6500.00,
    isVisible: true,
  },
  {
    id: '3',
    type: 'RD',
    accountNumber: '****9012',
    balance: 15000.00,
    interestRate: 5.5,
    accruedInterest: 825.00,
    isVisible: true,
  },
  {
    id: '4',
    type: 'Loan',
    accountNumber: '****3456',
    balance: -50000.00,
    interestRate: 8.5,
    accruedInterest: -4250.00,
    isVisible: true,
  },
];

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    accountId: '1',
    date: '2024-01-15',
    amount: 5000,
    type: 'credit',
    description: 'Salary Credit',
    category: 'Income',
  },
  {
    id: '2',
    accountId: '1',
    date: '2024-01-14',
    amount: -1200,
    type: 'debit',
    description: 'Grocery Shopping',
    category: 'Food',
  },
  {
    id: '3',
    accountId: '1',
    date: '2024-01-13',
    amount: -500,
    type: 'debit',
    description: 'Fuel',
    category: 'Transport',
  },
  {
    id: '4',
    accountId: '2',
    date: '2024-01-12',
    amount: 10000,
    type: 'credit',
    description: 'FD Deposit',
    category: 'Investment',
  },
  {
    id: '5',
    accountId: '3',
    date: '2024-01-11',
    amount: 2000,
    type: 'credit',
    description: 'RD Monthly Deposit',
    category: 'Investment',
  },
];

export const financialProducts: FinancialProduct[] = [
  {
    id: '1',
    title: 'FD Account',
    description: 'Fixed Deposit with high returns',
    icon: 'piggy-bank',
    route: '/fd-account',
  },
  {
    id: '2',
    title: 'RD Account',
    description: 'Recurring Deposit for regular savings',
    icon: 'repeat',
    route: '/rd-account',
  },
  {
    id: '3',
    title: 'SIP Investment',
    description: 'Systematic Investment Plan',
    icon: 'trending-up',
    route: '/sip-investment',
  },
  {
    id: '4',
    title: 'Wallet Top-up',
    description: 'Add money to your wallet',
    icon: 'wallet',
    route: '/wallet-topup',
  },
];