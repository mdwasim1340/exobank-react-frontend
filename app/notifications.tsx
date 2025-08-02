import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { ArrowLeft, Bell, CreditCard, TrendingUp, CircleAlert as AlertCircle, CircleCheck as CheckCircle, Trash2, MoveVertical as MoreVertical, Settings } from 'lucide-react-native';
import { router } from 'expo-router';
import SafeAreaView from '@/components/SafeAreaView';
import { useTheme } from '@/hooks/useTheme';

const { width: screenWidth } = Dimensions.get('window');

interface Notification {
  id: string;
  type: 'transaction' | 'security' | 'promotion' | 'system';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  priority: 'high' | 'medium' | 'low';
  date: string;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'transaction',
    title: 'Payment Received',
    message: 'You received ₹5,000 from John Smith',
    time: '2 minutes ago',
    isRead: false,
    priority: 'high',
    date: '2024-01-15',
  },
  {
    id: '2',
    type: 'security',
    title: 'Login Alert',
    message: 'New login detected from iPhone 14',
    time: '1 hour ago',
    isRead: false,
    priority: 'high',
    date: '2024-01-15',
  },
  {
    id: '3',
    type: 'transaction',
    title: 'Payment Sent',
    message: 'You sent ₹1,200 to Sarah Wilson',
    time: '3 hours ago',
    isRead: true,
    priority: 'medium',
    date: '2024-01-15',
  },
  {
    id: '4',
    type: 'promotion',
    title: 'Special Offer',
    message: 'Get 2% extra interest on FD. Limited time offer!',
    time: '1 day ago',
    isRead: true,
    priority: 'low',
    date: '2024-01-14',
  },
  {
    id: '5',
    type: 'system',
    title: 'Maintenance Notice',
    message: 'Scheduled maintenance on Jan 15, 2-4 AM',
    time: '2 days ago',
    isRead: true,
    priority: 'medium',
    date: '2024-01-13',
  },
  {
    id: '6',
    type: 'transaction',
    title: 'Bill Payment Successful',
    message: 'Electricity bill payment of ₹1,250 completed',
    time: '3 days ago',
    isRead: true,
    priority: 'medium',
    date: '2024-01-12',
  },
  {
    id: '7',
    type: 'promotion',
    title: 'Investment Opportunity',
    message: 'New mutual fund with 12% expected returns',
    time: '4 days ago',
    isRead: false,
    priority: 'low',
    date: '2024-01-11',
  },
];

export default function NotificationsScreen() {
  const { theme } = useTheme();
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread' | 'transactions' | 'security' | 'promotions'>('all');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [selectionMode, setSelectionMode] = useState(false);

  const handleNotificationPress = (notification: Notification) => {
    if (selectionMode) {
      toggleNotificationSelection(notification.id);
      return;
    }
    
    if (!notification.isRead) {
      setNotifications(prev =>
        prev.map(n =>
          n.id === notification.id ? { ...n, isRead: true } : n
        )
      );
    }
  };

  const toggleNotificationSelection = (id: string) => {
    setSelectedNotifications(prev =>
      prev.includes(id)
        ? prev.filter(notifId => notifId !== id)
        : [...prev, id]
    );
  };

  const handleLongPress = (id: string) => {
    setSelectionMode(true);
    setSelectedNotifications([id]);
  };

  const exitSelectionMode = () => {
    setSelectionMode(false);
    setSelectedNotifications([]);
  };

  const deleteSelectedNotifications = () => {
    setNotifications(prev =>
      prev.filter(n => !selectedNotifications.includes(n.id))
    );
    exitSelectionMode();
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, isRead: true }))
    );
  };

  const markSelectedAsRead = () => {
    setNotifications(prev =>
      prev.map(n =>
        selectedNotifications.includes(n.id) ? { ...n, isRead: true } : n
      )
    );
    exitSelectionMode();
  };

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const getNotificationIcon = (type: string, priority: string) => {
    const iconColor = priority === 'high' ? theme.error : theme.primary;
    
    switch (type) {
      case 'transaction':
        return <CreditCard size={20} color={iconColor} />;
      case 'security':
        return <AlertCircle size={20} color={iconColor} />;
      case 'promotion':
        return <TrendingUp size={20} color={iconColor} />;
      case 'system':
        return <Bell size={20} color={iconColor} />;
      default:
        return <Bell size={20} color={iconColor} />;
    }
  };

  const groupNotificationsByDate = (notifications: Notification[]) => {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const groups: { [key: string]: Notification[] } = {
      Today: [],
      Yesterday: [],
      Earlier: [],
    };
    
    notifications.forEach(notification => {
      if (notification.date === today) {
        groups.Today.push(notification);
      } else if (notification.date === yesterday) {
        groups.Yesterday.push(notification);
      } else {
        groups.Earlier.push(notification);
      }
    });
    
    return groups;
  };

  const filteredNotifications = notifications.filter(n =>
    filter === 'all' ? true : 
    filter === 'unread' ? !n.isRead :
    filter === 'transactions' ? n.type === 'transaction' :
    filter === 'security' ? n.type === 'security' :
    filter === 'promotions' ? n.type === 'promotion' :
    true
  );

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const groupedNotifications = groupNotificationsByDate(filteredNotifications);

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
    },
    title: {
      fontSize: screenWidth > 768 ? 24 : 20,
      fontWeight: 'bold',
      color: theme.text,
      flex: 1,
      marginLeft: 16,
    },
    headerActions: {
      flexDirection: 'row',
      gap: 8,
    },
    headerButton: {
      width: Math.max(44, screenWidth * 0.08),
      height: Math.max(44, screenWidth * 0.08),
      borderRadius: Math.max(22, screenWidth * 0.04),
      backgroundColor: theme.surfaceVariant,
      justifyContent: 'center',
      alignItems: 'center',
    },
    selectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: screenWidth > 768 ? '5%' : 20,
      paddingVertical: 12,
      backgroundColor: theme.primary,
    },
    selectionTitle: {
      fontSize: screenWidth > 768 ? 18 : 16,
      fontWeight: '600',
      color: theme.textOnPrimary,
    },
    selectionActions: {
      flexDirection: 'row',
      gap: 16,
    },
    selectionAction: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 6,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    selectionActionText: {
      fontSize: screenWidth > 768 ? 16 : 14,
      color: theme.textOnPrimary,
      marginLeft: 6,
      fontWeight: '500',
    },
    markAllRead: {
      fontSize: screenWidth > 768 ? 16 : 14,
      fontWeight: '600',
      color: theme.primary,
    },
    filterTabs: {
      paddingHorizontal: screenWidth > 768 ? '5%' : 20,
      marginBottom: 16,
      backgroundColor: theme.surface,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    filterTabsScroll: {
      flexDirection: 'row',
      gap: 8,
    },
    filterTab: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 20,
      backgroundColor: theme.surfaceVariant,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.border,
      minHeight: 36,
      justifyContent: 'center',
    },
    filterTabActive: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    filterTabText: {
      fontSize: screenWidth > 768 ? 16 : 14,
      fontWeight: '600',
      color: theme.text,
    },
    filterTabTextActive: {
      color: theme.textOnPrimary,
    },
    dateGroup: {
      marginBottom: 24,
    },
    dateGroupTitle: {
      fontSize: screenWidth > 768 ? 18 : 16,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 12,
      paddingHorizontal: screenWidth > 768 ? '5%' : 20,
    },
    notificationItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      paddingVertical: 16,
      paddingHorizontal: screenWidth > 768 ? '5%' : 20,
      marginBottom: 8,
      backgroundColor: theme.background,
      borderWidth: 1,
      borderColor: theme.border,
      position: 'relative',
      minHeight: 72,
    },
    notificationItemUnread: {
      backgroundColor: theme.surfaceVariant,
      borderColor: theme.primary,
    },
    notificationItemSelected: {
      backgroundColor: theme.primary + '20',
      borderColor: theme.primary,
    },
    selectionCheckbox: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: theme.primary,
      marginRight: 12,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 2,
    },
    selectionCheckboxSelected: {
      backgroundColor: theme.primary,
    },
    notificationIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.background,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
      marginTop: 2,
    },
    notificationContent: {
      flex: 1,
    },
    notificationHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 4,
    },
    notificationTitle: {
      fontSize: screenWidth > 768 ? 18 : 16,
      fontWeight: '600',
      color: theme.text,
      flex: 1,
      marginRight: 8,
      lineHeight: 22,
    },
    notificationTime: {
      fontSize: screenWidth > 768 ? 14 : 12,
      color: theme.textSecondary,
    },
    notificationMessage: {
      fontSize: screenWidth > 768 ? 16 : 14,
      color: theme.textSecondary,
      lineHeight: 20,
      marginBottom: 8,
    },
    priorityBadge: {
      alignSelf: 'flex-start',
      backgroundColor: theme.error,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 4,
    },
    priorityBadgeText: {
      fontSize: screenWidth > 768 ? 12 : 10,
      color: theme.textOnPrimary,
      fontWeight: '600',
      textTransform: 'uppercase',
    },
    unreadDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.primary,
      position: 'absolute',
      top: 20,
      right: screenWidth > 768 ? '5%' : 20,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 60,
      paddingHorizontal: screenWidth > 768 ? '10%' : 40,
    },
    emptyStateTitle: {
      fontSize: screenWidth > 768 ? 20 : 18,
      fontWeight: '600',
      color: theme.text,
      marginTop: 16,
      marginBottom: 8,
    },
    emptyStateMessage: {
      fontSize: screenWidth > 768 ? 16 : 14,
      color: theme.textSecondary,
      textAlign: 'center',
      lineHeight: 20,
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Header */}
      {selectionMode ? (
        <View style={styles.selectionHeader}>
          <TouchableOpacity onPress={exitSelectionMode}>
            <Text style={styles.selectionTitle}>
              {selectedNotifications.length} selected
            </Text>
          </TouchableOpacity>
          <View style={styles.selectionActions}>
            <TouchableOpacity
              style={styles.selectionAction}
              onPress={markSelectedAsRead}
            >
              <CheckCircle size={16} color={theme.textOnPrimary} />
              <Text style={styles.selectionActionText}>Read</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.selectionAction}
              onPress={deleteSelectedNotifications}
            >
              <Trash2 size={16} color={theme.textOnPrimary} />
              <Text style={styles.selectionActionText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Notifications</Text>
          <View style={styles.headerActions}>
            {unreadCount > 0 && (
              <TouchableOpacity
                style={styles.headerButton}
                onPress={markAllAsRead}
              >
                <CheckCircle size={20} color={theme.primary} />
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.headerButton}>
              <Settings size={20} color={theme.text} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Filter Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterTabs}>
        <View style={styles.filterTabsScroll}>
          <TouchableOpacity
            style={[styles.filterTab, filter === 'all' && styles.filterTabActive]}
            onPress={() => setFilter('all')}
          >
            <Text style={[styles.filterTabText, filter === 'all' && styles.filterTabTextActive]}>
              All ({notifications.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterTab, filter === 'unread' && styles.filterTabActive]}
            onPress={() => setFilter('unread')}
          >
            <Text style={[styles.filterTabText, filter === 'unread' && styles.filterTabTextActive]}>
              Unread ({unreadCount})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterTab, filter === 'transactions' && styles.filterTabActive]}
            onPress={() => setFilter('transactions')}
          >
            <Text style={[styles.filterTabText, filter === 'transactions' && styles.filterTabTextActive]}>
              Transactions
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterTab, filter === 'security' && styles.filterTabActive]}
            onPress={() => setFilter('security')}
          >
            <Text style={[styles.filterTabText, filter === 'security' && styles.filterTabTextActive]}>
              Security
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterTab, filter === 'promotions' && styles.filterTabActive]}
            onPress={() => setFilter('promotions')}
          >
            <Text style={[styles.filterTabText, filter === 'promotions' && styles.filterTabTextActive]}>
              Offers
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Content */}
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.primary}
            colors={[theme.primary]}
          />
        }
      >
        {filteredNotifications.length > 0 ? (
          Object.entries(groupedNotifications).map(([dateGroup, notifications]) => {
            if (notifications.length === 0) return null;
            
            return (
              <View key={dateGroup} style={styles.dateGroup}>
                <Text style={styles.dateGroupTitle}>{dateGroup}</Text>
                {notifications.map((notification) => (
                  <TouchableOpacity
                    key={notification.id}
                    style={[
                      styles.notificationItem,
                      !notification.isRead && styles.notificationItemUnread,
                      selectedNotifications.includes(notification.id) && styles.notificationItemSelected
                    ]}
                    onPress={() => handleNotificationPress(notification)}
                    onLongPress={() => handleLongPress(notification.id)}
                  >
                    {selectionMode && (
                      <View style={[
                        styles.selectionCheckbox,
                        selectedNotifications.includes(notification.id) && styles.selectionCheckboxSelected
                      ]}>
                        {selectedNotifications.includes(notification.id) && (
                          <CheckCircle size={12} color={theme.textOnPrimary} />
                        )}
                      </View>
                    )}
                    
                    <View style={styles.notificationIcon}>
                      {getNotificationIcon(notification.type, notification.priority)}
                    </View>
                    
                    <View style={styles.notificationContent}>
                      <View style={styles.notificationHeader}>
                        <Text style={styles.notificationTitle}>{notification.title}</Text>
                        <Text style={styles.notificationTime}>{notification.time}</Text>
                      </View>
                      <Text style={styles.notificationMessage}>{notification.message}</Text>
                      {notification.priority === 'high' && (
                        <View style={styles.priorityBadge}>
                          <Text style={styles.priorityBadgeText}>High Priority</Text>
                        </View>
                      )}
                    </View>
                    
                    {!notification.isRead && !selectionMode && <View style={styles.unreadDot} />}
                  </TouchableOpacity>
                ))}
              </View>
            );
          })
        ) : (
          <View style={styles.emptyState}>
            <CheckCircle size={48} color={theme.textSecondary} />
            <Text style={styles.emptyStateTitle}>
              {filter === 'unread' ? 'All caught up!' : 'No notifications'}
            </Text>
            <Text style={styles.emptyStateMessage}>
              {filter === 'unread' 
                ? 'No unread notifications to show' 
                : filter === 'all'
                ? 'You\'ll see your notifications here when you receive them'
                : `No ${filter} notifications to show`
              }
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}