import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Dimensions,
} from 'react-native';
import { ArrowLeft, Search, Filter, Clock, TrendingUp, X, User, CreditCard, Building, Receipt, ChevronRight } from 'lucide-react-native';
import { router } from 'expo-router';
import SafeAreaView from '@/components/SafeAreaView';
import { useTheme } from '@/hooks/useTheme';

interface SearchResult {
  id: string;
  type: 'transaction' | 'account' | 'contact' | 'service' | 'help';
  title: string;
  subtitle: string;
  icon: any;
  route?: string;
  data?: any;
}

interface RecentSearch {
  id: string;
  query: string;
  timestamp: string;
}

interface TrendingTopic {
  id: string;
  title: string;
  count: number;
}

const { width: screenWidth } = Dimensions.get('window');

const mockSearchResults: SearchResult[] = [
  {
    id: '1',
    type: 'transaction',
    title: 'Transfer to John Smith',
    subtitle: 'Yesterday • ₹5,000',
    icon: User,
    route: '/transaction-details',
  },
  {
    id: '2',
    type: 'account',
    title: 'Savings Account',
    subtitle: '****1234 • ₹25,000.50',
    icon: CreditCard,
    route: '/account-details',
  },
  {
    id: '3',
    type: 'service',
    title: 'Fixed Deposit',
    subtitle: 'Investment • Up to 7.5% interest',
    icon: Building,
    route: '/fixed-deposits',
  },
  {
    id: '4',
    type: 'transaction',
    title: 'Bill Payment - Electricity',
    subtitle: '3 days ago • ₹1,250',
    icon: Receipt,
    route: '/transaction-details',
  },
  {
    id: '5',
    type: 'help',
    title: 'How to transfer money',
    subtitle: 'Help Center • Step-by-step guide',
    icon: Search,
    route: '/help-center',
  },
];

const mockRecentSearches: RecentSearch[] = [
  { id: '1', query: 'transfer money', timestamp: '2024-01-15T10:30:00Z' },
  { id: '2', query: 'fixed deposit', timestamp: '2024-01-14T15:45:00Z' },
  { id: '3', query: 'bill payment', timestamp: '2024-01-13T09:20:00Z' },
  { id: '4', query: 'account balance', timestamp: '2024-01-12T14:10:00Z' },
];

const mockTrendingTopics: TrendingTopic[] = [
  { id: '1', title: 'UPI payments', count: 1250 },
  { id: '2', title: 'Mutual funds', count: 890 },
  { id: '3', title: 'Credit card', count: 675 },
  { id: '4', title: 'Loan EMI', count: 543 },
  { id: '5', title: 'Insurance', count: 432 },
];

const searchFilters = [
  { id: 'all', label: 'All', icon: Search },
  { id: 'transactions', label: 'Transactions', icon: Receipt },
  { id: 'accounts', label: 'Accounts', icon: CreditCard },
  { id: 'services', label: 'Services', icon: Building },
  { id: 'help', label: 'Help', icon: User },
];

export default function SearchScreen() {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>(mockRecentSearches);
  const [isSearching, setIsSearching] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (searchQuery.trim()) {
      setIsSearching(true);
      // Simulate search delay
      const timer = setTimeout(() => {
        const filtered = mockSearchResults.filter(result => {
          const matchesQuery = result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              result.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
          const matchesFilter = selectedFilter === 'all' || 
                               (selectedFilter === 'transactions' && result.type === 'transaction') ||
                               (selectedFilter === 'accounts' && result.type === 'account') ||
                               (selectedFilter === 'services' && result.type === 'service') ||
                               (selectedFilter === 'help' && result.type === 'help');
          return matchesQuery && matchesFilter;
        });
        setSearchResults(filtered);
        setIsSearching(false);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  }, [searchQuery, selectedFilter]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() && !recentSearches.find(s => s.query === query.trim())) {
      const newSearch: RecentSearch = {
        id: Date.now().toString(),
        query: query.trim(),
        timestamp: new Date().toISOString(),
      };
      setRecentSearches(prev => [newSearch, ...prev.slice(0, 9)]);
    }
  };

  const handleRecentSearchPress = (query: string) => {
    setSearchQuery(query);
  };

  const handleClearRecentSearch = (id: string) => {
    setRecentSearches(prev => prev.filter(search => search.id !== id));
  };

  const handleClearAllRecentSearches = () => {
    setRecentSearches([]);
  };

  const handleResultPress = (result: SearchResult) => {
    if (result.route) {
      router.push(result.route);
    }
  };

  const getResultIcon = (result: SearchResult) => {
    const IconComponent = result.icon;
    const iconColor = result.type === 'transaction' ? theme.primary :
                     result.type === 'account' ? theme.info :
                     result.type === 'service' ? theme.success :
                     result.type === 'help' ? theme.warning :
                     theme.textSecondary;
    return <IconComponent size={20} color={iconColor} />;
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: screenWidth > 768 ? '5%' : 20,
      paddingVertical: 16,
      backgroundColor: theme.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    backButton: {
      width: Math.max(44, screenWidth * 0.08),
      height: Math.max(44, screenWidth * 0.08),
      borderRadius: Math.max(22, screenWidth * 0.04),
      backgroundColor: theme.surfaceVariant,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    searchContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.surfaceVariant,
      borderRadius: 12,
      paddingHorizontal: 16,
      marginRight: 12,
      minHeight: 44,
    },
    searchIcon: {
      marginRight: 12,
    },
    searchInput: {
      flex: 1,
      fontSize: screenWidth > 768 ? 18 : 16,
      color: theme.text,
      paddingVertical: 12,
    },
    clearButton: {
      padding: 4,
    },
    filterButton: {
      width: Math.max(44, screenWidth * 0.08),
      height: Math.max(44, screenWidth * 0.08),
      borderRadius: Math.max(22, screenWidth * 0.04),
      backgroundColor: showFilters ? theme.primary : theme.surfaceVariant,
      justifyContent: 'center',
      alignItems: 'center',
    },
    filtersContainer: {
      paddingHorizontal: screenWidth > 768 ? '5%' : 20,
      paddingVertical: 12,
      backgroundColor: theme.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    filtersScroll: {
      flexDirection: 'row',
      gap: 8,
    },
    filterChip: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: theme.surfaceVariant,
      borderWidth: 1,
      borderColor: theme.border,
      minHeight: 36,
    },
    filterChipActive: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    filterChipText: {
      fontSize: screenWidth > 768 ? 16 : 14,
      color: theme.text,
      fontWeight: '500',
      marginLeft: 6,
    },
    filterChipTextActive: {
      color: theme.textOnPrimary,
    },
    content: {
      flex: 1,
      paddingHorizontal: screenWidth > 768 ? '5%' : 20,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: screenWidth > 768 ? 20 : 18,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 16,
      marginTop: 20,
    },
    recentSearchItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      backgroundColor: theme.surfaceVariant,
      borderRadius: 12,
      marginBottom: 8,
      minHeight: 48,
    },
    recentSearchIcon: {
      marginRight: 12,
    },
    recentSearchText: {
      flex: 1,
      fontSize: screenWidth > 768 ? 18 : 16,
      color: theme.text,
    },
    clearRecentButton: {
      padding: 8,
    },
    clearAllButton: {
      alignSelf: 'flex-end',
      paddingVertical: 8,
      paddingHorizontal: 16,
      backgroundColor: theme.surfaceVariant,
      borderRadius: 8,
      marginBottom: 16,
      minHeight: 36,
      justifyContent: 'center',
    },
    clearAllText: {
      fontSize: screenWidth > 768 ? 16 : 14,
      color: theme.primary,
      fontWeight: '600',
    },
    trendingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      backgroundColor: theme.surfaceVariant,
      borderRadius: 12,
      marginBottom: 8,
      minHeight: 48,
    },
    trendingIcon: {
      marginRight: 12,
    },
    trendingContent: {
      flex: 1,
    },
    trendingTitle: {
      fontSize: screenWidth > 768 ? 18 : 16,
      color: theme.text,
      fontWeight: '500',
    },
    trendingCount: {
      fontSize: screenWidth > 768 ? 14 : 12,
      color: theme.textSecondary,
      marginTop: 2,
    },
    resultItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
      paddingHorizontal: 16,
      backgroundColor: theme.surface,
      borderRadius: 12,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: theme.border,
      minHeight: 64,
    },
    resultIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.surfaceVariant,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    resultContent: {
      flex: 1,
    },
    resultTitle: {
      fontSize: screenWidth > 768 ? 18 : 16,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 4,
    },
    resultSubtitle: {
      fontSize: screenWidth > 768 ? 16 : 14,
      color: theme.textSecondary,
    },
    resultArrow: {
      marginLeft: 12,
    },
    emptyState: {
      alignItems: 'center',
      paddingVertical: 60,
    },
    emptyIcon: {
      marginBottom: 16,
    },
    emptyTitle: {
      fontSize: screenWidth > 768 ? 20 : 18,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 8,
    },
    emptySubtitle: {
      fontSize: screenWidth > 768 ? 16 : 14,
      color: theme.textSecondary,
      textAlign: 'center',
      lineHeight: 20,
    },
    loadingContainer: {
      alignItems: 'center',
      paddingVertical: 40,
    },
    loadingText: {
      fontSize: screenWidth > 768 ? 16 : 14,
      color: theme.textSecondary,
      marginTop: 12,
    },
  });

  const renderRecentSearches = () => (
    <View style={styles.section}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={styles.sectionTitle}>Recent Searches</Text>
        {recentSearches.length > 0 && (
          <TouchableOpacity style={styles.clearAllButton} onPress={handleClearAllRecentSearches}>
            <Text style={styles.clearAllText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {recentSearches.length > 0 ? (
        recentSearches.map((search) => (
          <TouchableOpacity
            key={search.id}
            style={styles.recentSearchItem}
            onPress={() => handleRecentSearchPress(search.query)}
          >
            <Clock size={16} color={theme.textSecondary} style={styles.recentSearchIcon} />
            <Text style={styles.recentSearchText}>{search.query}</Text>
            <TouchableOpacity
              style={styles.clearRecentButton}
              onPress={() => handleClearRecentSearch(search.id)}
            >
              <X size={16} color={theme.textSecondary} />
            </TouchableOpacity>
          </TouchableOpacity>
        ))
      ) : (
        <View style={styles.emptyState}>
          <Clock size={48} color={theme.textSecondary} style={styles.emptyIcon} />
          <Text style={styles.emptyTitle}>No Recent Searches</Text>
          <Text style={styles.emptySubtitle}>Your recent searches will appear here</Text>
        </View>
      )}
    </View>
  );

  const renderTrendingTopics = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Trending</Text>
      {mockTrendingTopics.map((topic) => (
        <TouchableOpacity
          key={topic.id}
          style={styles.trendingItem}
          onPress={() => handleSearch(topic.title)}
        >
          <TrendingUp size={16} color={theme.primary} style={styles.trendingIcon} />
          <View style={styles.trendingContent}>
            <Text style={styles.trendingTitle}>{topic.title}</Text>
            <Text style={styles.trendingCount}>{topic.count.toLocaleString()} searches</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderSearchResults = () => {
    if (isSearching) {
      return (
        <View style={styles.loadingContainer}>
          <Search size={32} color={theme.textSecondary} />
          <Text style={styles.loadingText}>Searching...</Text>
        </View>
      );
    }

    if (searchResults.length === 0 && searchQuery.trim()) {
      return (
        <View style={styles.emptyState}>
          <Search size={48} color={theme.textSecondary} style={styles.emptyIcon} />
          <Text style={styles.emptyTitle}>No Results Found</Text>
          <Text style={styles.emptySubtitle}>
            Try adjusting your search terms or filters
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Results ({searchResults.length})
        </Text>
        {searchResults.map((result) => (
          <TouchableOpacity
            key={result.id}
            style={styles.resultItem}
            onPress={() => handleResultPress(result)}
          >
            <View style={styles.resultIcon}>
              {getResultIcon(result)}
            </View>
            <View style={styles.resultContent}>
              <Text style={styles.resultTitle}>{result.title}</Text>
              <Text style={styles.resultSubtitle}>{result.subtitle}</Text>
            </View>
            <ChevronRight size={16} color={theme.textSecondary} style={styles.resultArrow} />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={theme.text} />
        </TouchableOpacity>
        
        <View style={styles.searchContainer}>
          <Search size={20} color={theme.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search transactions, accounts, help..."
            placeholderTextColor={theme.textSecondary}
            autoFocus
            returnKeyType="search"
            onSubmitEditing={() => handleSearch(searchQuery)}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => setSearchQuery('')}
            >
              <X size={16} color={theme.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
        
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Filter size={20} color={showFilters ? theme.textOnPrimary : theme.text} />
        </TouchableOpacity>
      </View>

      {/* Filters */}
      {showFilters && (
        <View style={styles.filtersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.filtersScroll}>
              {searchFilters.map((filter) => {
                const IconComponent = filter.icon;
                const isActive = selectedFilter === filter.id;
                return (
                  <TouchableOpacity
                    key={filter.id}
                    style={[
                      styles.filterChip,
                      isActive && styles.filterChipActive
                    ]}
                    onPress={() => setSelectedFilter(filter.id)}
                  >
                    <IconComponent 
                      size={16} 
                      color={isActive ? theme.textOnPrimary : theme.text} 
                    />
                    <Text style={[
                      styles.filterChipText,
                      isActive && styles.filterChipTextActive
                    ]}>
                      {filter.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>
      )}

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {searchQuery.trim() ? renderSearchResults() : (
          <>
            {renderRecentSearches()}
            {renderTrendingTopics()}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}