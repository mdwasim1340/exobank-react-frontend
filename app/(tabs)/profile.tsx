import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { User, Settings, Lock, Bell, CircleHelp as HelpCircle, Phone, LogOut, ChevronRight, Moon, Sun, Palette } from 'lucide-react-native';
import { router } from 'expo-router';
import SafeAreaView from '@/components/SafeAreaView';
import { mockUser } from '@/data/mockData';
import { useTheme } from '@/hooks/useTheme';

export default function ProfileScreen() {
  const { theme, themeMode, setThemeMode, isDark } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            console.log('User logged out');
          },
        },
      ]
    );
  };

  const handleChangePassword = () => {
    Alert.alert('Change Password', 'This feature will be available soon.');
  };

  const handleContactSupport = () => {
    router.push('/contact-support');
  };

  const handleHelpCenter = () => {
    router.push('/help-center');
  };

  const handleThemeSelection = () => {
    Alert.alert(
      'Select Theme',
      'Choose your preferred theme',
      [
        { text: 'Light', onPress: () => setThemeMode('light') },
        { text: 'Dark', onPress: () => setThemeMode('dark') },
        { text: 'System', onPress: () => setThemeMode('system') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const getThemeDisplayText = () => {
    switch (themeMode) {
      case 'light':
        return 'Light mode';
      case 'dark':
        return 'Dark mode';
      case 'system':
        return 'System default';
      default:
        return 'System default';
    }
  };

  const ProfileItem = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    showArrow = true, 
    rightComponent 
  }: {
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    showArrow?: boolean;
    rightComponent?: React.ReactNode;
  }) => (
    <TouchableOpacity
      style={styles.profileItem}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.profileItemLeft}>
        <View style={styles.iconContainer}>
          {icon}
        </View>
        <View style={styles.profileItemContent}>
          <Text style={styles.profileItemTitle}>{title}</Text>
          {subtitle && (
            <Text style={styles.profileItemSubtitle}>{subtitle}</Text>
          )}
        </View>
      </View>
      
      <View style={styles.profileItemRight}>
        {rightComponent}
        {showArrow && !rightComponent && (
          <ChevronRight size={20} color={theme.textSecondary} />
        )}
      </View>
    </TouchableOpacity>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.text,
    },
    userSection: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 20,
      backgroundColor: theme.surfaceVariant,
      marginHorizontal: 20,
      marginBottom: 24,
      borderRadius: 16,
    },
    avatarContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    userInfo: {
      flex: 1,
    },
    userName: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 4,
    },
    userEmail: {
      fontSize: 14,
      color: theme.textSecondary,
      marginBottom: 2,
    },
    userPhone: {
      fontSize: 14,
      color: theme.textSecondary,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 12,
      paddingHorizontal: 20,
    },
    profileItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 16,
      paddingHorizontal: 20,
      backgroundColor: theme.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    profileItemLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.surfaceVariant,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    profileItemContent: {
      flex: 1,
    },
    profileItemTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 2,
    },
    profileItemSubtitle: {
      fontSize: 14,
      color: theme.textSecondary,
    },
    profileItemRight: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    appInfo: {
      alignItems: 'center',
      paddingVertical: 24,
      paddingHorizontal: 20,
    },
    appInfoText: {
      fontSize: 12,
      color: theme.textSecondary,
      marginBottom: 4,
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* User Info Section */}
        <View style={styles.userSection}>
          <View style={styles.avatarContainer}>
            <User size={40} color={theme.textOnPrimary} />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{mockUser.name}</Text>
            <Text style={styles.userEmail}>{mockUser.email}</Text>
            <Text style={styles.userPhone}>{mockUser.phone}</Text>
          </View>
        </View>

        {/* Account Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          
          <ProfileItem
            icon={<Lock size={20} color={theme.primary} />}
            title="Change Password"
            subtitle="Update your account password"
            onPress={() => router.push('/change-password')}
          />
          
          <ProfileItem
            icon={<Bell size={20} color={theme.primary} />}
            title="Notifications"
            subtitle="Manage notification preferences"
            showArrow={false}
            rightComponent={
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: theme.border, true: theme.primary }}
                thumbColor={theme.surface}
              />
            }
          />
        </View>

        {/* App Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Settings</Text>
          
          <ProfileItem
            icon={<Palette size={20} color={theme.primary} />}
            title="Theme"
            subtitle={getThemeDisplayText()}
            onPress={handleThemeSelection}
          />
        </View>

        {/* Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <ProfileItem
            icon={<HelpCircle size={20} color={theme.primary} />}
            title="Help Center"
            subtitle="FAQs and guides"
            onPress={handleHelpCenter}
          />
          
          <ProfileItem
            icon={<Phone size={20} color={theme.primary} />}
            title="Contact Support"
            subtitle="Get help from our team"
            onPress={handleContactSupport}
          />
        </View>

        {/* Account Actions */}
        <View style={styles.section}>
          <ProfileItem
            icon={<LogOut size={20} color={theme.error} />}
            title="Logout"
            subtitle="Sign out of your account"
            onPress={() => router.push('/logout')}
          />
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>exoBank Mobile App</Text>
          <Text style={styles.appInfoText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}