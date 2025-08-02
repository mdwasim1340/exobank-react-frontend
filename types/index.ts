export interface Account {
  id: string;
  type: 'Savings' | 'Loan' | 'RD' | 'FD';
  accountNumber: string;
  balance: number;
  interestRate: number;
  accruedInterest: number;
  isVisible: boolean;
}

export interface Transaction {
  id: string;
  accountId: string;
  date: string;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  category: string;
}

export interface FinancialProduct {
  id: string;
  title: string;
  description: string;
  icon: string;
  route: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
}

export interface TransferData {
  id: string;
  amount: number;
  currency: string;
  sourceAccountId: string;
  destinationAccountId?: string;
  recipientName?: string;
  recipientAccountNumber?: string;
  recipientBankName?: string;
  ifscCode?: string;
  description: string;
  transferDate: string;
  status: 'pending' | 'completed' | 'failed' | 'scheduled';
  transactionId: string;
  createdAt: string;
}