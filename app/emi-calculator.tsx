import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
} from 'react-native';
import { ArrowLeft, Calculator, TrendingUp, DollarSign, Calendar } from 'lucide-react-native';
import { router } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';

export default function EMICalculatorScreen() {
  const { theme } = useTheme();
  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [tenure, setTenure] = useState('');
  const [tenureType, setTenureType] = useState<'years' | 'months'>('years');
  const [results, setResults] = useState<{
    emi: number;
    totalInterest: number;
    totalAmount: number;
  } | null>(null);

  const calculateEMI = () => {
    const principal = parseFloat(loanAmount);
    const rate = parseFloat(interestRate);
    const time = parseFloat(tenure);

    if (!principal || !rate || !time || principal <= 0 || rate <= 0 || time <= 0) {
      Alert.alert('Error', 'Please enter valid values for all fields');
      return;
    }

    // Convert annual rate to monthly and percentage to decimal
    const monthlyRate = rate / (12 * 100);
    // Convert tenure to months
    const tenureInMonths = tenureType === 'years' ? time * 12 : time;

    // EMI calculation formula: P * r * (1 + r)^n / ((1 + r)^n - 1)
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureInMonths)) / 
                (Math.pow(1 + monthlyRate, tenureInMonths) - 1);

    const totalAmount = emi * tenureInMonths;
    const totalInterest = totalAmount - principal;

    setResults({
      emi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalAmount: Math.round(totalAmount),
    });
  };

  const clearCalculation = () => {
    setLoanAmount('');
    setInterestRate('');
    setTenure('');
    setResults(null);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
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
      marginRight: 16,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.text,
    },
    content: {
      flex: 1,
      paddingHorizontal: 20,
    },
    calculatorCard: {
      backgroundColor: theme.surface,
      borderRadius: 16,
      padding: 20,
      marginBottom: 24,
      elevation: 2,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
      borderWidth: 1,
      borderColor: theme.border,
    },
    inputGroup: {
      marginBottom: 20,
    },
    inputLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 8,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.surfaceVariant,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
    },
    currencySymbol: {
      paddingLeft: 16,
      paddingRight: 8,
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.text,
    },
    percentSymbol: {
      paddingRight: 16,
      paddingLeft: 8,
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.text,
    },
    input: {
      flex: 1,
      paddingVertical: 16,
      paddingHorizontal: 8,
      fontSize: 16,
      color: theme.text,
    },
    tenureContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    tenureInput: {
      flex: 1,
      paddingVertical: 16,
      paddingHorizontal: 16,
      fontSize: 16,
      color: theme.text,
    },
    tenureToggle: {
      flexDirection: 'row',
      backgroundColor: theme.background,
      borderRadius: 8,
      margin: 4,
      overflow: 'hidden',
    },
    tenureOption: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: theme.surfaceVariant,
    },
    tenureOptionActive: {
      backgroundColor: theme.primary,
    },
    tenureOptionText: {
      fontSize: 14,
      color: theme.text,
      fontWeight: '500',
    },
    tenureOptionTextActive: {
      color: theme.textOnPrimary,
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 8,
    },
    calculateButton: {
      flex: 1,
      backgroundColor: theme.primary,
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
    },
    clearButton: {
      flex: 1,
      backgroundColor: theme.surfaceVariant,
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.border,
    },
    calculateButtonText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.textOnPrimary,
      marginLeft: 8,
    },
    clearButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
    },
    resultsCard: {
      backgroundColor: theme.primary,
      borderRadius: 16,
      padding: 20,
      marginBottom: 24,
      elevation: 4,
      shadowColor: theme.shadowDark,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    resultsTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.textOnPrimary,
      marginBottom: 20,
      textAlign: 'center',
    },
    resultItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    resultIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.textOnPrimary + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    resultContent: {
      flex: 1,
    },
    resultLabel: {
      fontSize: 14,
      color: theme.textOnPrimary,
      opacity: 0.8,
      marginBottom: 4,
    },
    resultValue: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.textOnPrimary,
    },
    breakdownCard: {
      backgroundColor: theme.surface,
      borderRadius: 16,
      padding: 20,
      elevation: 2,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
      borderWidth: 1,
      borderColor: theme.border,
    },
    breakdownTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 16,
      textAlign: 'center',
    },
    breakdownItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    breakdownLabel: {
      fontSize: 16,
      color: theme.text,
      fontWeight: '500',
    },
    breakdownValue: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.text,
    },
    principalBar: {
      height: 8,
      backgroundColor: theme.primary,
      borderRadius: 4,
      marginTop: 8,
    },
    interestBar: {
      height: 8,
      backgroundColor: theme.warning,
      borderRadius: 4,
      marginTop: 4,
    },
    barContainer: {
      marginTop: 16,
    },
    barLabel: {
      fontSize: 12,
      color: theme.textSecondary,
      marginBottom: 8,
    },
    barRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    barColor: {
      width: 16,
      height: 16,
      borderRadius: 8,
      marginRight: 8,
    },
    barText: {
      fontSize: 14,
      color: theme.text,
      flex: 1,
    },
    barPercentage: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.text,
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
        <Text style={styles.headerTitle}>EMI Calculator</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Calculator Input Card */}
        <View style={styles.calculatorCard}>
          {/* Loan Amount */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Loan Amount</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.currencySymbol}>₹</Text>
              <TextInput
                style={styles.input}
                value={loanAmount}
                onChangeText={setLoanAmount}
                placeholder="Enter loan amount"
                placeholderTextColor={theme.textSecondary}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Interest Rate */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Interest Rate (per annum)</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={interestRate}
                onChangeText={setInterestRate}
                placeholder="Enter interest rate"
                placeholderTextColor={theme.textSecondary}
                keyboardType="numeric"
              />
              <Text style={styles.percentSymbol}>%</Text>
            </View>
          </View>

          {/* Loan Tenure */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Loan Tenure</Text>
            <View style={styles.inputContainer}>
              <View style={styles.tenureContainer}>
                <TextInput
                  style={styles.tenureInput}
                  value={tenure}
                  onChangeText={setTenure}
                  placeholder="Enter tenure"
                  placeholderTextColor={theme.textSecondary}
                  keyboardType="numeric"
                />
                <View style={styles.tenureToggle}>
                  <TouchableOpacity
                    style={[
                      styles.tenureOption,
                      tenureType === 'years' && styles.tenureOptionActive
                    ]}
                    onPress={() => setTenureType('years')}
                  >
                    <Text style={[
                      styles.tenureOptionText,
                      tenureType === 'years' && styles.tenureOptionTextActive
                    ]}>
                      Years
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.tenureOption,
                      tenureType === 'months' && styles.tenureOptionActive
                    ]}
                    onPress={() => setTenureType('months')}
                  >
                    <Text style={[
                      styles.tenureOptionText,
                      tenureType === 'months' && styles.tenureOptionTextActive
                    ]}>
                      Months
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.calculateButton}
              onPress={calculateEMI}
            >
              <Calculator size={20} color={theme.textOnPrimary} />
              <Text style={styles.calculateButtonText}>Calculate EMI</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.clearButton}
              onPress={clearCalculation}
            >
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Results */}
        {results && (
          <>
            <View style={styles.resultsCard}>
              <Text style={styles.resultsTitle}>EMI Calculation Results</Text>
              
              <View style={styles.resultItem}>
                <View style={styles.resultIcon}>
                  <DollarSign size={20} color={theme.primary} />
                </View>
                <View style={styles.resultContent}>
                  <Text style={styles.resultLabel}>Monthly EMI</Text>
                  <Text style={styles.resultValue}>₹{results.emi.toLocaleString('en-IN')}</Text>
                </View>
              </View>

              <View style={styles.resultItem}>
                <View style={styles.resultIcon}>
                  <TrendingUp size={20} color={theme.primary} />
                </View>
                <View style={styles.resultContent}>
                  <Text style={styles.resultLabel}>Total Interest</Text>
                  <Text style={styles.resultValue}>₹{results.totalInterest.toLocaleString('en-IN')}</Text>
                </View>
              </View>

              <View style={styles.resultItem}>
                <View style={styles.resultIcon}>
                  <Calendar size={20} color={theme.primary} />
                </View>
                <View style={styles.resultContent}>
                  <Text style={styles.resultLabel}>Total Amount</Text>
                  <Text style={styles.resultValue}>₹{results.totalAmount.toLocaleString('en-IN')}</Text>
                </View>
              </View>
            </View>

            {/* Breakdown */}
            <View style={styles.breakdownCard}>
              <Text style={styles.breakdownTitle}>Payment Breakdown</Text>
              
              <View style={styles.breakdownItem}>
                <Text style={styles.breakdownLabel}>Principal Amount</Text>
                <Text style={styles.breakdownValue}>₹{parseFloat(loanAmount).toLocaleString('en-IN')}</Text>
              </View>
              
              <View style={styles.breakdownItem}>
                <Text style={styles.breakdownLabel}>Interest Amount</Text>
                <Text style={styles.breakdownValue}>₹{results.totalInterest.toLocaleString('en-IN')}</Text>
              </View>
              
              <View style={styles.breakdownItem}>
                <Text style={styles.breakdownLabel}>Total Payable</Text>
                <Text style={styles.breakdownValue}>₹{results.totalAmount.toLocaleString('en-IN')}</Text>
              </View>

              {/* Visual Breakdown */}
              <View style={styles.barContainer}>
                <Text style={styles.barLabel}>Payment Composition</Text>
                
                <View style={styles.barRow}>
                  <View style={[styles.barColor, { backgroundColor: theme.primary }]} />
                  <Text style={styles.barText}>Principal</Text>
                  <Text style={styles.barPercentage}>
                    {((parseFloat(loanAmount) / results.totalAmount) * 100).toFixed(1)}%
                  </Text>
                </View>
                
                <View style={styles.barRow}>
                  <View style={[styles.barColor, { backgroundColor: theme.warning }]} />
                  <Text style={styles.barText}>Interest</Text>
                  <Text style={styles.barPercentage}>
                    {((results.totalInterest / results.totalAmount) * 100).toFixed(1)}%
                  </Text>
                </View>

                <View style={{ flexDirection: 'row', marginTop: 8 }}>
                  <View 
                    style={[
                      styles.principalBar, 
                      { 
                        flex: parseFloat(loanAmount) / results.totalAmount,
                        marginRight: 2 
                      }
                    ]} 
                  />
                  <View 
                    style={[
                      styles.interestBar, 
                      { 
                        flex: results.totalInterest / results.totalAmount,
                        backgroundColor: theme.warning 
                      }
                    ]} 
                  />
                </View>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}