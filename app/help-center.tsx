import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Image,
} from 'react-native';
import { ArrowLeft, Search, Play, FileText, MessageCircle, ThumbsUp, ThumbsDown, Star } from 'lucide-react-native';
import { router } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';

interface HelpCategory {
  id: string;
  title: string;
  icon: string;
  articleCount: number;
  color: string;
}

interface HelpArticle {
  id: string;
  title: string;
  category: string;
  type: 'article' | 'video' | 'guide';
  readTime: string;
  rating: number;
  helpful: number;
  content: string;
}

interface VideoTutorial {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
  category: string;
}

const helpCategories: HelpCategory[] = [
  {
    id: '1',
    title: 'Getting Started',
    icon: '🚀',
    articleCount: 12,
    color: '#4CAF50',
  },
  {
    id: '2',
    title: 'Account Management',
    icon: '👤',
    articleCount: 18,
    color: '#2196F3',
  },
  {
    id: '3',
    title: 'Transactions',
    icon: '💳',
    articleCount: 24,
    color: '#FF9800',
  },
  {
    id: '4',
    title: 'Security',
    icon: '🔒',
    articleCount: 15,
    color: '#F44336',
  },
  {
    id: '5',
    title: 'Investments',
    icon: '📈',
    articleCount: 20,
    color: '#9C27B0',
  },
  {
    id: '6',
    title: 'Loans & Credit',
    icon: '🏦',
    articleCount: 16,
    color: '#795548',
  },
];

const popularArticles: HelpArticle[] = [
  {
    id: '1',
    title: 'How to transfer money to another account',
    category: 'Transactions',
    type: 'guide',
    readTime: '3 min read',
    rating: 4.8,
    helpful: 245,
    content: 'Step-by-step guide to transfer money...',
  },
  {
    id: '2',
    title: 'Setting up biometric authentication',
    category: 'Security',
    type: 'article',
    readTime: '2 min read',
    rating: 4.6,
    helpful: 189,
    content: 'Learn how to secure your account...',
  },
  {
    id: '3',
    title: 'Understanding your account statement',
    category: 'Account Management',
    type: 'article',
    readTime: '5 min read',
    rating: 4.5,
    helpful: 156,
    content: 'Detailed explanation of account statements...',
  },
];

const videoTutorials: VideoTutorial[] = [
  {
    id: '1',
    title: 'Complete App Tour',
    duration: '5:30',
    thumbnail: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Getting Started',
  },
  {
    id: '2',
    title: 'Making Your First Transfer',
    duration: '3:45',
    thumbnail: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Transactions',
  },
  {
    id: '3',
    title: 'Investment Basics',
    duration: '8:20',
    thumbnail: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Investments',
  },
];

const troubleshootingSteps = [
  {
    id: '1',
    title: 'App not loading or crashing',
    steps: [
      'Force close the app and reopen',
      'Check your internet connection',
      'Update the app to latest version',
      'Restart your device',
      'Contact support if issue persists',
    ],
  },
  {
    id: '2',
    title: 'Transaction failed or pending',
    steps: [
      'Check your account balance',
      'Verify recipient details',
      'Wait for 24 hours for auto-reversal',
      'Check transaction history',
      'Contact support with transaction ID',
    ],
  },
  {
    id: '3',
    title: 'Cannot login to account',
    steps: [
      'Check your credentials',
      'Try password reset',
      'Clear app cache and data',
      'Check if account is locked',
      'Contact support for assistance',
    ],
  },
];

export default function HelpCenterScreen() {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<'articles' | 'videos' | 'troubleshoot'>('articles');

  const handleArticlePress = (article: HelpArticle) => {
    router.push(`/help-article?id=${article.id}`);
  };

  const handleVideoPress = (video: VideoTutorial) => {
    router.push(`/video-tutorial?id=${video.id}`);
  };

  const handleCategoryPress = (category: HelpCategory) => {
    router.push(`/help-category?id=${category.id}`);
  };

  const handleFeedback = (articleId: string, helpful: boolean) => {
    // Handle feedback submission
    console.log(`Article ${articleId} marked as ${helpful ? 'helpful' : 'not helpful'}`);
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
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.surfaceVariant,
      marginHorizontal: 20,
      marginBottom: 24,
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
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 16,
      paddingHorizontal: 20,
    },
    categoriesGrid: {
      paddingHorizontal: 20,
      marginBottom: 32,
    },
    categoryRow: {
      flexDirection: 'row',
      marginBottom: 12,
      gap: 12,
    },
    categoryCard: {
      flex: 1,
      backgroundColor: theme.surface,
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.border,
      elevation: 1,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
    },
    categoryIcon: {
      fontSize: 32,
      marginBottom: 8,
    },
    categoryTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.text,
      textAlign: 'center',
      marginBottom: 4,
    },
    categoryCount: {
      fontSize: 12,
      color: theme.textSecondary,
    },
    articleCard: {
      backgroundColor: theme.surface,
      marginHorizontal: 20,
      marginBottom: 12,
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
      elevation: 1,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
    },
    articleHeader: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 8,
    },
    articleIcon: {
      marginRight: 12,
      marginTop: 2,
    },
    articleContent: {
      flex: 1,
    },
    articleTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 4,
      lineHeight: 22,
    },
    articleMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    articleCategory: {
      fontSize: 12,
      color: theme.primary,
      fontWeight: '500',
      marginRight: 12,
    },
    articleReadTime: {
      fontSize: 12,
      color: theme.textSecondary,
    },
    articleFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 8,
    },
    articleRating: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    ratingText: {
      fontSize: 12,
      color: theme.textSecondary,
      marginLeft: 4,
    },
    helpfulCount: {
      fontSize: 12,
      color: theme.textSecondary,
    },
    videoCard: {
      backgroundColor: theme.surface,
      marginHorizontal: 20,
      marginBottom: 12,
      borderRadius: 12,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: theme.border,
      elevation: 1,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
    },
    videoThumbnail: {
      width: '100%',
      height: 120,
      position: 'relative',
    },
    playButton: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: [{ translateX: -20 }, { translateY: -20 }],
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    videoDuration: {
      position: 'absolute',
      bottom: 8,
      right: 8,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
    },
    videoDurationText: {
      fontSize: 12,
      color: 'white',
      fontWeight: '500',
    },
    videoInfo: {
      padding: 16,
    },
    videoTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 4,
    },
    videoCategory: {
      fontSize: 12,
      color: theme.primary,
      fontWeight: '500',
    },
    troubleshootCard: {
      backgroundColor: theme.surface,
      marginHorizontal: 20,
      marginBottom: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
      overflow: 'hidden',
    },
    troubleshootHeader: {
      backgroundColor: theme.surfaceVariant,
      padding: 16,
    },
    troubleshootTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
    },
    troubleshootSteps: {
      padding: 16,
    },
    troubleshootStep: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 12,
    },
    stepNumber: {
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: theme.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
      marginTop: 2,
    },
    stepNumberText: {
      fontSize: 12,
      color: theme.textOnPrimary,
      fontWeight: 'bold',
    },
    stepText: {
      fontSize: 14,
      color: theme.text,
      flex: 1,
      lineHeight: 20,
    },
    feedbackContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
    },
    feedbackButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      backgroundColor: theme.surfaceVariant,
    },
    feedbackText: {
      fontSize: 12,
      color: theme.textSecondary,
      marginLeft: 4,
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
        <Text style={styles.headerTitle}>Help Center</Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Search size={20} color={theme.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search help articles..."
          placeholderTextColor={theme.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'articles' && styles.tabActive]}
          onPress={() => setSelectedTab('articles')}
        >
          <Text style={[styles.tabText, selectedTab === 'articles' && styles.tabTextActive]}>
            Articles
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'videos' && styles.tabActive]}
          onPress={() => setSelectedTab('videos')}
        >
          <Text style={[styles.tabText, selectedTab === 'videos' && styles.tabTextActive]}>
            Videos
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'troubleshoot' && styles.tabActive]}
          onPress={() => setSelectedTab('troubleshoot')}
        >
          <Text style={[styles.tabText, selectedTab === 'troubleshoot' && styles.tabTextActive]}>
            Troubleshoot
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {selectedTab === 'articles' && (
          <>
            {/* Categories */}
            <Text style={styles.sectionTitle}>Browse by Category</Text>
            <View style={styles.categoriesGrid}>
              {Array.from({ length: Math.ceil(helpCategories.length / 2) }, (_, rowIndex) => (
                <View key={rowIndex} style={styles.categoryRow}>
                  {helpCategories.slice(rowIndex * 2, rowIndex * 2 + 2).map((category) => (
                    <TouchableOpacity
                      key={category.id}
                      style={styles.categoryCard}
                      onPress={() => handleCategoryPress(category)}
                    >
                      <Text style={styles.categoryIcon}>{category.icon}</Text>
                      <Text style={styles.categoryTitle}>{category.title}</Text>
                      <Text style={styles.categoryCount}>{category.articleCount} articles</Text>
                    </TouchableOpacity>
                  ))}
                  {rowIndex === Math.ceil(helpCategories.length / 2) - 1 && 
                   helpCategories.length % 2 === 1 && (
                    <View style={[styles.categoryCard, { opacity: 0 }]} />
                  )}
                </View>
              ))}
            </View>

            {/* Popular Articles */}
            <Text style={styles.sectionTitle}>Popular Articles</Text>
            {popularArticles.map((article) => (
              <TouchableOpacity
                key={article.id}
                style={styles.articleCard}
                onPress={() => handleArticlePress(article)}
              >
                <View style={styles.articleHeader}>
                  <FileText size={20} color={theme.primary} style={styles.articleIcon} />
                  <View style={styles.articleContent}>
                    <Text style={styles.articleTitle}>{article.title}</Text>
                    <View style={styles.articleMeta}>
                      <Text style={styles.articleCategory}>{article.category}</Text>
                      <Text style={styles.articleReadTime}>{article.readTime}</Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.articleFooter}>
                  <View style={styles.articleRating}>
                    <Star size={14} color={theme.warning} />
                    <Text style={styles.ratingText}>{article.rating}</Text>
                  </View>
                  <Text style={styles.helpfulCount}>{article.helpful} found helpful</Text>
                  <View style={styles.feedbackContainer}>
                    <TouchableOpacity
                      style={styles.feedbackButton}
                      onPress={() => handleFeedback(article.id, true)}
                    >
                      <ThumbsUp size={14} color={theme.success} />
                      <Text style={styles.feedbackText}>Helpful</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.feedbackButton}
                      onPress={() => handleFeedback(article.id, false)}
                    >
                      <ThumbsDown size={14} color={theme.error} />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}

        {selectedTab === 'videos' && (
          <>
            <Text style={styles.sectionTitle}>Video Tutorials</Text>
            {videoTutorials.map((video) => (
              <TouchableOpacity
                key={video.id}
                style={styles.videoCard}
                onPress={() => handleVideoPress(video)}
              >
                <View style={styles.videoThumbnail}>
                  <Image
                    source={{ uri: video.thumbnail }}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="cover"
                  />
                  <View style={styles.playButton}>
                    <Play size={16} color="white" />
                  </View>
                  <View style={styles.videoDuration}>
                    <Text style={styles.videoDurationText}>{video.duration}</Text>
                  </View>
                </View>
                <View style={styles.videoInfo}>
                  <Text style={styles.videoTitle}>{video.title}</Text>
                  <Text style={styles.videoCategory}>{video.category}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}

        {selectedTab === 'troubleshoot' && (
          <>
            <Text style={styles.sectionTitle}>Common Issues</Text>
            {troubleshootingSteps.map((issue) => (
              <View key={issue.id} style={styles.troubleshootCard}>
                <View style={styles.troubleshootHeader}>
                  <Text style={styles.troubleshootTitle}>{issue.title}</Text>
                </View>
                <View style={styles.troubleshootSteps}>
                  {issue.steps.map((step, index) => (
                    <View key={index} style={styles.troubleshootStep}>
                      <View style={styles.stepNumber}>
                        <Text style={styles.stepNumberText}>{index + 1}</Text>
                      </View>
                      <Text style={styles.stepText}>{step}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}