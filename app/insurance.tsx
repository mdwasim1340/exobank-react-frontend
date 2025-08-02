import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { ArrowLeft, Shield, Heart, Car, Chrome as Home, Briefcase, Users, Plus, FileText, Clock } from 'lucide-react-native';
import { router } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';

interface InsuranceType {
  id: string;
  title: string;
  subtitle: string;
  icon: any;
  color: string;
  coverage: string;
  premium: string;
  features: string[];
  popular?: boolean;
}

interface ExistingPolicy {
  id: string;
  type: string;
  policyNumber: string;
  coverage: number;
  premium: number;
  nextDueDate: string;
  status: 'active' | 'expired' | 'pending';
}

const insuranceTypes: InsuranceType[] = [
  {
    id: 'health',
    title: 'Health Insurance',
    subtitle: 'Comprehensive health coverage',
    icon: Heart,
    color: '#E91E63',
    coverage: 'Up to ₹50 Lakhs',
    premium: 'Starting ₹5,000/year',
    features: ['Cashless treatment', 'Pre & post hospitalization', 'Day care procedures'],
    popular: true,
  },
  {
    id: 'life',
    title: 'Life Insurance',
    subtitle: 'Secure your family\'s future',
    icon: Shield,
    color: '#4CAF50',
    coverage: 'Up to ₹2 Crores',
    premium: 'Starting ₹8,000/year',
    features: ['Term life cover', 'Accidental death benefit', 'Tax benefits'],
  },
  {
    id: 'motor',
    title: 'Motor Insurance',
    subtitle: 'Complete car protection',
    icon: Car,
    color: '#2196F3',
    coverage: 'IDV based',
    premium: 'Starting ₹3,000/year',
    features: ['Third party cover', 'Own damage cover', 'Roadside assistance'],
  },
  {
    id: 'home',
    title: 'Home Insurance',
    subtitle: 'Protect your home & belongings',
    icon: Home,
    color: '#FF9800',
    coverage: 'Up to ₹1 Crore',
    premium: 'Starting ₹2,500/year',
    features: ['Structure cover', 'Contents cover', 'Personal liability'],
  },
  {
    id: 'travel',
    title: 'Travel Insurance',
    subtitle: 'Safe travels worldwide',
    icon: Briefcase,
    color: '#9C27B0',
    coverage: 'Up to ₹50 Lakhs',
    premium: 'Starting ₹500/trip',
    features: ['Medical emergencies', 'Trip cancellation', 'Baggage loss'],
  },
  {
    id: 'family',
    title: 'Family Floater',
    subtitle: 'One policy for entire family',
    icon: Users,
    color: '#795548',
    coverage: 'Up to ₹25 Lakhs',
    premium: 'Starting ₹12,000/year',
    features: ['Covers whole family', 'Shared sum insured', 'No claim bonus'],
  },
];

const existingPolicies: ExistingPolicy[] = [
  {
    id: '1',
    type: 'Health Insurance',
    policyNumber: 'HLT123456789',
    coverage: 500000,
    premium: 15000,
    nextDueDate: '15 Mar 2025',
    status: 'active',
  },
  {
    id: '2',
    type: 'Motor Insurance',
    policyNumber: 'MTR987654321',
    coverage: 800000,
    premium: 8500,
    nextDueDate: '28 Feb 2025',
    status: 'active',
  },
];

export default function InsuranceScreen() {
  const { theme } = useTheme();
  const [selectedTab, setSelectedTab] = useState<'buy' | 'policies'>('buy');

  const handleInsuranceApplication = (insuranceType: InsuranceType) => {
    Alert.alert(
      'Buy Insurance',
      `Get a quote for ${insuranceType.title}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Get Quote', onPress: () => router.push(`/insurance-quote?type=${insuranceType.id}`) },
      ]
    );
  };

  const handlePolicyDetails = (policy: ExistingPolicy) => {
    router.push(`/policy-details?id=${policy.id}`);
  };

  const handleRenewPolicy = (policy: ExistingPolicy) => {
    Alert.alert(
      'Renew Policy',
      `Renew ${policy.type} policy?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Renew', onPress: () => Alert.alert('Success', 'Policy renewal initiated!') },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return theme.success;
      case 'expired':
        return theme.error;
      case 'pending':
        return theme.warning;
      default:
        return theme.textSecondary;
    }
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
    tabContainer: {
      flexDirection: 'row',
      paddingHorizontal: 20,
      marginBottom: 20,
    },
    tab: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      backgroundColor: theme.surfaceVariant,
      marginRight: 8,
      alignItems: 'center',
    },
    tabActive: {
      backgroundColor: theme.primary,
    },
    tabText: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.text,
    },
    tabTextActive: {
      color: theme.textOnPrimary,
    },
    insuranceTypesList: {
      paddingHorizontal: 20,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 16,
    },
    insuranceTypeCard: {
      backgroundColor: theme.surface,
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: theme.border,
      elevation: 2,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
      position: 'relative',
    },
    popularBadge: {
      position: 'absolute',
      top: 12,
      right: 12,
      backgroundColor: theme.warning,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 8,
    },
    popularText: {
      fontSize: 10,
      color: theme.textOnPrimary,
      fontWeight: '600',
      textTransform: 'uppercase',
    },
    insuranceTypeHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    insuranceTypeIcon: {
      width: 56,
      height: 56,
      borderRadius: 28,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    insuranceTypeInfo: {
      flex: 1,
    },
    insuranceTypeTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 4,
    },
    insuranceTypeSubtitle: {
      fontSize: 14,
      color: theme.textSecondary,
    },
    insuranceTypeDetails: {
      marginBottom: 16,
    },
    detailRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    detailLabel: {
      fontSize: 14,
      color: theme.textSecondary,
    },
    detailValue: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.text,
    },
    featuresContainer: {
      marginBottom: 16,
    },
    featuresTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 8,
    },
    featuresList: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    featureTag: {
      backgroundColor: theme.surfaceVariant,
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 12,
    },
    featureText: {
      fontSize: 12,
      color: theme.text,
      fontWeight: '500',
    },
    getQuoteButton: {
      backgroundColor: theme.primary,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
    },
    getQuoteButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.textOnPrimary,
    },
    policiesList: {
      paddingHorizontal: 20,
    },
    policyCard: {
      backgroundColor: theme.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: theme.border,
      elevation: 1,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
    },
    policyHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    policyType: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.text,
    },
    policyStatus: {
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 4,
    },
    policyStatusText: {
      fontSize: 10,
      color: theme.textOnPrimary,
      fontWeight: '600',
      textTransform: 'uppercase',
    },
    policyNumber: {
      fontSize: 12,
      color: theme.textSecondary,
      marginBottom: 12,
    },
    policyDetails: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    policyDetailItem: {
      flex: 1,
      alignItems: 'center',
    },
    policyDetailValue: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 2,
    },
    policyDetailLabel: {
      fontSize: 11,
      color: theme.textSecondary,
    },
    policyActions: {
      flexDirection: 'row',
      gap: 12,
    },
    policyActionButton: {
      flex: 1,
      paddingVertical: 8,
      borderRadius: 6,
      alignItems: 'center',
    },
    renewButton: {
      backgroundColor: theme.primary,
    },
    viewButton: {
      backgroundColor: theme.surfaceVariant,
      borderWidth: 1,
      borderColor: theme.border,
    },
    renewButtonText: {
      fontSize: 12,
      fontWeight: '600',
      color: theme.textOnPrimary,
    },
    viewButtonText: {
      fontSize: 12,
      fontWeight: '600',
      color: theme.text,
    },
    nextDueContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.surfaceVariant,
      padding: 8,
      borderRadius: 6,
      marginBottom: 12,
    },
    nextDueText: {
      fontSize: 11,
      color: theme.textSecondary,
      marginLeft: 6,
    },
    nextDueDate: {
      fontSize: 11,
      fontWeight: '600',
      color: theme.warning,
      marginLeft: 4,
    },
    emptyState: {
      alignItems: 'center',
      paddingVertical: 60,
    },
    emptyIcon: {
      marginBottom: 16,
    },
    emptyTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 8,
    },
    emptySubtitle: {
      fontSize: 14,
      color: theme.textSecondary,
      textAlign: 'center',
      lineHeight: 20,
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
        <Text style={styles.headerTitle}>Insurance</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'buy' && styles.tabActive]}
          onPress={() => setSelectedTab('buy')}
        >
          <Text style={[styles.tabText, selectedTab === 'buy' && styles.tabTextActive]}>
            Buy Insurance
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'policies' && styles.tabActive]}
          onPress={() => setSelectedTab('policies')}
        >
          <Text style={[styles.tabText, selectedTab === 'policies' && styles.tabTextActive]}>
            My Policies ({existingPolicies.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {selectedTab === 'buy' && (
          <View style={styles.insuranceTypesList}>
            <Text style={styles.sectionTitle}>Choose Insurance Type</Text>
            {insuranceTypes.map((insuranceType) => {
              const IconComponent = insuranceType.icon;
              return (
                <View key={insuranceType.id} style={styles.insuranceTypeCard}>
                  {insuranceType.popular && (
                    <View style={styles.popularBadge}>
                      <Text style={styles.popularText}>Popular</Text>
                    </View>
                  )}
                  
                  <View style={styles.insuranceTypeHeader}>
                    <View style={[
                      styles.insuranceTypeIcon,
                      { backgroundColor: insuranceType.color + '20' }
                    ]}>
                      <IconComponent size={28} color={insuranceType.color} />
                    </View>
                    <View style={styles.insuranceTypeInfo}>
                      <Text style={styles.insuranceTypeTitle}>{insuranceType.title}</Text>
                      <Text style={styles.insuranceTypeSubtitle}>{insuranceType.subtitle}</Text>
                    </View>
                  </View>

                  <View style={styles.insuranceTypeDetails}>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Coverage</Text>
                      <Text style={styles.detailValue}>{insuranceType.coverage}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Premium</Text>
                      <Text style={styles.detailValue}>{insuranceType.premium}</Text>
                    </View>
                  </View>

                  <View style={styles.featuresContainer}>
                    <Text style={styles.featuresTitle}>Key Features</Text>
                    <View style={styles.featuresList}>
                      {insuranceType.features.map((feature, index) => (
                        <View key={index} style={styles.featureTag}>
                          <Text style={styles.featureText}>{feature}</Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.getQuoteButton}
                    onPress={() => handleInsuranceApplication(insuranceType)}
                  >
                    <Text style={styles.getQuoteButtonText}>Get Quote</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        )}

        {selectedTab === 'policies' && (
          <View style={styles.policiesList}>
            <Text style={styles.sectionTitle}>Your Insurance Policies</Text>
            {existingPolicies.length > 0 ? (
              existingPolicies.map((policy) => (
                <View key={policy.id} style={styles.policyCard}>
                  <View style={styles.policyHeader}>
                    <Text style={styles.policyType}>{policy.type}</Text>
                    <View style={[
                      styles.policyStatus,
                      { backgroundColor: getStatusColor(policy.status) }
                    ]}>
                      <Text style={styles.policyStatusText}>{policy.status}</Text>
                    </View>
                  </View>

                  <Text style={styles.policyNumber}>Policy No: {policy.policyNumber}</Text>

                  <View style={styles.nextDueContainer}>
                    <Clock size={14} color={theme.warning} />
                    <Text style={styles.nextDueText}>Next premium due on</Text>
                    <Text style={styles.nextDueDate}>{policy.nextDueDate}</Text>
                  </View>

                  <View style={styles.policyDetails}>
                    <View style={styles.policyDetailItem}>
                      <Text style={styles.policyDetailValue}>
                        ₹{policy.coverage.toLocaleString('en-IN')}
                      </Text>
                      <Text style={styles.policyDetailLabel}>Coverage</Text>
                    </View>
                    <View style={styles.policyDetailItem}>
                      <Text style={styles.policyDetailValue}>
                        ₹{policy.premium.toLocaleString('en-IN')}
                      </Text>
                      <Text style={styles.policyDetailLabel}>Annual Premium</Text>
                    </View>
                  </View>

                  <View style={styles.policyActions}>
                    <TouchableOpacity
                      style={[styles.policyActionButton, styles.renewButton]}
                      onPress={() => handleRenewPolicy(policy)}
                    >
                      <Text style={styles.renewButtonText}>Renew</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.policyActionButton, styles.viewButton]}
                      onPress={() => handlePolicyDetails(policy)}
                    >
                      <Text style={styles.viewButtonText}>View Details</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <FileText size={48} color={theme.textSecondary} style={styles.emptyIcon} />
                <Text style={styles.emptyTitle}>No Insurance Policies</Text>
                <Text style={styles.emptySubtitle}>
                  You don't have any insurance policies yet. Buy insurance to protect yourself and your family.
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}