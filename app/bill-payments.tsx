import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Dimensions,
} from 'react-native';
import { ArrowLeft, Search, Zap, Smartphone, Wifi, Car, Chrome as Home, Droplets, Flame, CreditCard } from 'lucide-react-native';
import { router } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';

interface BillCategory {
  id: string;
  title: string;
  titleNepali: string;
  icon: any;
  color: string;
  providers: BillProvider[];
}

interface BillProvider {
  id: string;
  name: string;
  nameNepali: string;
  logo?: string;
  category: string;
}

const { width: screenWidth } = Dimensions.get('window');

const billCategories: BillCategory[] = [
  {
    id: 'electricity',
    title: 'Electricity',
    titleNepali: 'बिजुली',
    icon: Zap,
    color: '#FFC107',
    providers: [
      { id: 'nea', name: 'Nepal Electricity Authority', nameNepali: 'नेपाल विद्युत प्राधिकरण', category: 'electricity' },
      { id: 'kulekhani', name: 'Kulekhani Hydropower', nameNepali: 'कुलेखानी जलविद्युत', category: 'electricity' },
    ],
  },
  {
    id: 'mobile',
    title: 'Mobile',
    titleNepali: 'मोबाइल',
    icon: Smartphone,
    color: '#4CAF50',
    providers: [
      { id: 'ncell', name: 'Ncell', nameNepali: 'एनसेल', category: 'mobile' },
      { id: 'ntc', name: 'Nepal Telecom', nameNepali: 'नेपाल टेलिकम', category: 'mobile' },
      { id: 'smart_telecom', name: 'Smart Telecom', nameNepali: 'स्मार्ट टेलिकम', category: 'mobile' },
    ],
  },
  {
    id: 'internet',
    title: 'Internet',
    titleNepali: 'इन्टरनेट',
    icon: Wifi,
    color: '#2196F3',
    providers: [
      { id: 'worldlink', name: 'WorldLink', nameNepali: 'वर्ल्डलिंक', category: 'internet' },
      { id: 'vianet', name: 'Vianet', nameNepali: 'भायानेट', category: 'internet' },
      { id: 'subisu', name: 'Subisu', nameNepali: 'सुबिसु', category: 'internet' },
    ],
  },
  {
    id: 'water',
    title: 'Water',
    titleNepali: 'पानी',
    icon: Droplets,
    color: '#00BCD4',
    providers: [
      { id: 'kukl', name: 'Kathmandu Upatyaka Khanepani Limited', nameNepali: 'काठमाडौं उपत्यका खानेपानी लिमिटेड', category: 'water' },
      { id: 'water_supply', name: 'Water Supply Corporation', nameNepali: 'खानेपानी निगम', category: 'water' },
    ],
  },
  {
    id: 'insurance',
    title: 'Insurance',
    titleNepali: 'बीमा',
    icon: Home,
    color: '#9C27B0',
    providers: [
      { id: 'nic_asia', name: 'NIC Asia Insurance', nameNepali: 'एनआईसी एशिया बीमा', category: 'insurance' },
      { id: 'oriental', name: 'Oriental Insurance', nameNepali: 'ओरिएन्टल बीमा', category: 'insurance' },
      { id: 'sagarmatha', name: 'Sagarmatha Insurance', nameNepali: 'सगरमाथा बीमा', category: 'insurance' },
    ],
  },
  {
    id: 'loan_emi',
    title: 'Loan EMI',
    titleNepali: 'ऋण किस्ता',
    icon: CreditCard,
    color: '#795548',
    providers: [
      { id: 'nabil', name: 'Nabil Bank', nameNepali: 'नबिल बैंक', category: 'loan_emi' },
      { id: 'nic_asia_bank', name: 'NIC Asia Bank', nameNepali: 'एनआईसी एशिया बैंक', category: 'loan_emi' },
      { id: 'standard_chartered', name: 'Standard Chartered Bank', nameNepali: 'स्ट्यान्डर्ड चार्टर्ड बैंक', category: 'loan_emi' },
    ],
  },
];

export default function BillPaymentsScreen() {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [language, setLanguage] = useState<'en' | 'np'>('en');

  const filteredCategories = billCategories.filter(category =>
    category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.titleNepali.includes(searchQuery) ||
    category.providers.some(provider => 
      provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.nameNepali.includes(searchQuery)
    )
  );

  const handleCategoryPress = (categoryId: string) => {
    router.push(`/bill-payment-form?category=${categoryId}`);
  };

  const texts = {
    en: {
      title: 'Bill Payments',
      searchPlaceholder: 'Search bills or providers...',
      quickPay: 'Quick Pay',
      allCategories: 'All Categories',
      recentBills: 'Recent Bills',
      providers: 'providers',
      payNow: 'Pay Now',
      due: 'Due',
      account: 'Account',
    },
    np: {
      title: 'बिल भुक्तानी',
      searchPlaceholder: 'बिल वा प्रदायकहरू खोज्नुहोस्...',
      quickPay: 'द्रुत भुक्तानी',
      allCategories: 'सबै श्रेणीहरू',
      recentBills: 'हालका बिलहरू',
      providers: 'प्रदायकहरू',
      payNow: 'अहिले भुक्तानी गर्नुहोस्',
      due: 'बाँकी',
      account: 'खाता',
    }
  };

  const t = texts[language];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: screenWidth > 768 ? '5%' : 20,
      paddingVertical: 20,
      paddingTop: 40,
    },
    backButton: {
      width: Math.max(44, screenWidth * 0.1),
      height: Math.max(44, screenWidth * 0.1),
      borderRadius: Math.max(22, screenWidth * 0.05),
      backgroundColor: theme.surfaceVariant,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    headerTitle: {
      fontSize: screenWidth > 768 ? 24 : 20,
      fontWeight: 'bold',
      color: theme.text,
      flex: 1,
    },
    languageToggle: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      backgroundColor: theme.primary,
      borderRadius: 8,
      minWidth: 44,
      minHeight: 44,
      justifyContent: 'center',
      alignItems: 'center',
    },
    languageToggleText: {
      color: theme.textOnPrimary,
      fontWeight: '600',
      fontSize: 14,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.surfaceVariant,
      marginHorizontal: screenWidth > 768 ? '5%' : 20,
      marginBottom: 24,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 12,
    },
    searchInput: {
      flex: 1,
      marginLeft: 12,
      fontSize: screenWidth > 768 ? 18 : 16,
      color: theme.text,
    },
    quickActions: {
      paddingHorizontal: screenWidth > 768 ? '5%' : 20,
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: screenWidth > 768 ? 20 : 16,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 16,
    },
    quickActionsList: {
      flexDirection: 'row',
      gap: 12,
    },
    quickActionCard: {
      backgroundColor: theme.surfaceVariant,
      padding: screenWidth > 768 ? 20 : 16,
      borderRadius: 12,
      alignItems: 'center',
      minWidth: screenWidth > 768 ? 120 : 100,
      minHeight: 100,
    },
    quickActionIcon: {
      marginBottom: 8,
    },
    quickActionText: {
      fontSize: screenWidth > 768 ? 14 : 12,
      color: theme.text,
      fontWeight: '500',
      textAlign: 'center',
    },
    categoriesGrid: {
      paddingHorizontal: screenWidth > 768 ? '5%' : 20,
    },
    categoryRow: {
      flexDirection: screenWidth > 768 ? 'row' : 'column',
      marginBottom: 16,
      gap: 12,
    },
    categoryCard: {
      flex: screenWidth > 768 ? 1 : undefined,
      backgroundColor: theme.surface,
      borderRadius: 16,
      padding: screenWidth > 768 ? 24 : 20,
      alignItems: 'center',
      elevation: 2,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
      borderWidth: 1,
      borderColor: theme.border,
      minHeight: screenWidth > 768 ? 140 : 120,
    },
    categoryIconContainer: {
      width: screenWidth > 768 ? 64 : 56,
      height: screenWidth > 768 ? 64 : 56,
      borderRadius: screenWidth > 768 ? 32 : 28,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
    },
    categoryTitle: {
      fontSize: screenWidth > 768 ? 16 : 14,
      fontWeight: '600',
      color: theme.text,
      textAlign: 'center',
      marginBottom: 4,
    },
    categoryTitleNepali: {
      fontSize: screenWidth > 768 ? 14 : 12,
      color: theme.textSecondary,
      textAlign: 'center',
      marginBottom: 4,
    },
    categorySubtitle: {
      fontSize: screenWidth > 768 ? 13 : 11,
      color: theme.textSecondary,
      textAlign: 'center',
    },
    recentBills: {
      paddingHorizontal: screenWidth > 768 ? '5%' : 20,
      marginTop: 24,
    },
    recentBillCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.surfaceVariant,
      padding: screenWidth > 768 ? 20 : 16,
      borderRadius: 12,
      marginBottom: 12,
      minHeight: 72,
    },
    billIcon: {
      width: screenWidth > 768 ? 48 : 40,
      height: screenWidth > 768 ? 48 : 40,
      borderRadius: screenWidth > 768 ? 24 : 20,
      backgroundColor: theme.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    billInfo: {
      flex: 1,
    },
    billProvider: {
      fontSize: screenWidth > 768 ? 18 : 16,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 2,
    },
    billNumber: {
      fontSize: screenWidth > 768 ? 14 : 12,
      color: theme.textSecondary,
      marginBottom: 2,
    },
    billAmount: {
      fontSize: screenWidth > 768 ? 16 : 14,
      fontWeight: '600',
      color: theme.primary,
    },
    payButton: {
      backgroundColor: theme.primary,
      paddingHorizontal: screenWidth > 768 ? 20 : 16,
      paddingVertical: screenWidth > 768 ? 12 : 8,
      borderRadius: 8,
      minHeight: 44,
      justifyContent: 'center',
      alignItems: 'center',
    },
    payButtonText: {
      fontSize: screenWidth > 768 ? 14 : 12,
      color: theme.textOnPrimary,
      fontWeight: '600',
    },
  });

  const quickActions = [
    { id: 'mobile', title: language === 'en' ? 'Mobile Recharge' : 'मोबाइल रिचार्ज', icon: Smartphone },
    { id: 'electricity', title: language === 'en' ? 'Electricity' : 'बिजुली', icon: Zap },
    { id: 'internet', title: language === 'en' ? 'Internet' : 'इन्टरनेट', icon: Wifi },
  ];

  const recentBills = [
    {
      id: '1',
      provider: 'Nepal Electricity Authority',
      providerNepali: 'नेपाल विद्युत प्राधिकरण',
      number: '****1234',
      amount: 'NPR 1,250',
      category: 'electricity',
      dueDate: '15 Jan 2025',
    },
    {
      id: '2',
      provider: 'Ncell',
      providerNepali: 'एनसेल',
      number: '****5678',
      amount: 'NPR 599',
      category: 'mobile',
      dueDate: '20 Jan 2025',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.title}</Text>
        <TouchableOpacity
          style={styles.languageToggle}
          onPress={() => setLanguage(language === 'en' ? 'np' : 'en')}
        >
          <Text style={styles.languageToggleText}>
            {language === 'en' ? 'नेपाली' : 'English'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Search */}
        <View style={styles.searchContainer}>
          <Search size={20} color={theme.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder={t.searchPlaceholder}
            placeholderTextColor={theme.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>{t.quickPay}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.quickActionsList}>
              {quickActions.map((action) => {
                const IconComponent = action.icon;
                return (
                  <TouchableOpacity
                    key={action.id}
                    style={styles.quickActionCard}
                    onPress={() => handleCategoryPress(action.id)}
                  >
                    <View style={styles.quickActionIcon}>
                      <IconComponent size={24} color={theme.primary} />
                    </View>
                    <Text style={styles.quickActionText}>{action.title}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>

        {/* Categories Grid */}
        <View style={styles.categoriesGrid}>
          <Text style={styles.sectionTitle}>{t.allCategories}</Text>
          {Array.from({ length: Math.ceil(filteredCategories.length / (screenWidth > 768 ? 2 : 1)) }, (_, rowIndex) => (
            <View key={rowIndex} style={styles.categoryRow}>
              {filteredCategories.slice(
                rowIndex * (screenWidth > 768 ? 2 : 1), 
                rowIndex * (screenWidth > 768 ? 2 : 1) + (screenWidth > 768 ? 2 : 1)
              ).map((category) => {
                const IconComponent = category.icon;
                return (
                  <TouchableOpacity
                    key={category.id}
                    style={styles.categoryCard}
                    onPress={() => handleCategoryPress(category.id)}
                  >
                    <View style={[
                      styles.categoryIconContainer,
                      { backgroundColor: category.color + '20' }
                    ]}>
                      <IconComponent size={28} color={category.color} />
                    </View>
                    <Text style={styles.categoryTitle}>
                      {language === 'en' ? category.title : category.titleNepali}
                    </Text>
                    {language === 'en' && (
                      <Text style={styles.categoryTitleNepali}>{category.titleNepali}</Text>
                    )}
                    <Text style={styles.categorySubtitle}>
                      {category.providers.length} {t.providers}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>

        {/* Recent Bills */}
        <View style={styles.recentBills}>
          <Text style={styles.sectionTitle}>{t.recentBills}</Text>
          {recentBills.map((bill) => (
            <View key={bill.id} style={styles.recentBillCard}>
              <View style={styles.billIcon}>
                <Text style={{ color: theme.textOnPrimary, fontSize: 16, fontWeight: 'bold' }}>
                  {(language === 'en' ? bill.provider : bill.providerNepali).charAt(0)}
                </Text>
              </View>
              <View style={styles.billInfo}>
                <Text style={styles.billProvider}>
                  {language === 'en' ? bill.provider : bill.providerNepali}
                </Text>
                <Text style={styles.billNumber}>{t.account}: {bill.number}</Text>
                <Text style={styles.billAmount}>{t.due}: {bill.amount}</Text>
              </View>
              <TouchableOpacity style={styles.payButton}>
                <Text style={styles.payButtonText}>{t.payNow}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}