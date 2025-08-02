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
import { ArrowLeft, Phone, Mail, MessageCircle, CircleHelp as HelpCircle, FileText, Clock, Send } from 'lucide-react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQ[] = [
  {
    id: '1',
    question: 'How do I transfer money to another account?',
    answer: 'Go to Transfer tab, select the recipient, enter amount and confirm the transaction.',
    category: 'Transfers',
  },
  {
    id: '2',
    question: 'What are the daily transaction limits?',
    answer: 'Daily limit is ₹1,00,000 for transfers and ₹50,000 for UPI payments.',
    category: 'Limits',
  },
  {
    id: '3',
    question: 'How do I reset my login password?',
    answer: 'Use "Forgot Password" on login screen or contact customer support.',
    category: 'Security',
  },
  {
    id: '4',
    question: 'How do I enable biometric login?',
    answer: 'Go to Profile > Settings > Security and enable biometric authentication.',
    category: 'Security',
  },
];

export default function SupportScreen() {
  const [selectedTab, setSelectedTab] = useState<'help' | 'contact' | 'chat'>('help');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [chatMessage, setChatMessage] = useState('');

  const handleCall = () => {
    Alert.alert('Call Support', 'Calling customer support at 1800-123-4567');
  };

  const handleEmail = () => {
    Alert.alert('Email Support', 'Opening email client to support@exobank.com');
  };

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      Alert.alert('Message Sent', 'Your message has been sent to our support team.');
      setChatMessage('');
    }
  };

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Help & Support</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'help' && styles.tabActive]}
          onPress={() => setSelectedTab('help')}
        >
          <HelpCircle size={20} color={selectedTab === 'help' ? Colors.textOnPrimary : Colors.textSecondary} />
          <Text style={[styles.tabText, selectedTab === 'help' && styles.tabTextActive]}>
            Help
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'contact' && styles.tabActive]}
          onPress={() => setSelectedTab('contact')}
        >
          <Phone size={20} color={selectedTab === 'contact' ? Colors.textOnPrimary : Colors.textSecondary} />
          <Text style={[styles.tabText, selectedTab === 'contact' && styles.tabTextActive]}>
            Contact
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'chat' && styles.tabActive]}
          onPress={() => setSelectedTab('chat')}
        >
          <MessageCircle size={20} color={selectedTab === 'chat' ? Colors.textOnPrimary : Colors.textSecondary} />
          <Text style={[styles.tabText, selectedTab === 'chat' && styles.tabTextActive]}>
            Chat
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {selectedTab === 'help' && (
          <View style={styles.content}>
            {/* Quick Actions */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Quick Actions</Text>
              <View style={styles.quickActions}>
                <TouchableOpacity style={styles.quickAction}>
                  <FileText size={24} color={Colors.primary} />
                  <Text style={styles.quickActionText}>User Guide</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.quickAction}>
                  <Clock size={24} color={Colors.primary} />
                  <Text style={styles.quickActionText}>Service Hours</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* FAQs */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
              {faqs.map((faq) => (
                <TouchableOpacity
                  key={faq.id}
                  style={styles.faqItem}
                  onPress={() => toggleFAQ(faq.id)}
                >
                  <View style={styles.faqHeader}>
                    <Text style={styles.faqQuestion}>{faq.question}</Text>
                    <Text style={styles.faqCategory}>{faq.category}</Text>
                  </View>
                  {expandedFAQ === faq.id && (
                    <Text style={styles.faqAnswer}>{faq.answer}</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {selectedTab === 'contact' && (
          <View style={styles.content}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Contact Information</Text>
              
              <TouchableOpacity style={styles.contactItem} onPress={handleCall}>
                <View style={styles.contactIcon}>
                  <Phone size={24} color={Colors.primary} />
                </View>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactTitle}>Phone Support</Text>
                  <Text style={styles.contactDetails}>1800-123-4567</Text>
                  <Text style={styles.contactHours}>24/7 Available</Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.contactItem} onPress={handleEmail}>
                <View style={styles.contactIcon}>
                  <Mail size={24} color={Colors.primary} />
                </View>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactTitle}>Email Support</Text>
                  <Text style={styles.contactDetails}>support@exobank.com</Text>
                  <Text style={styles.contactHours}>Response within 24 hours</Text>
                </View>
              </TouchableOpacity>
              
              <View style={styles.contactItem}>
                <View style={styles.contactIcon}>
                  <MessageCircle size={24} color={Colors.primary} />
                </View>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactTitle}>Live Chat</Text>
                  <Text style={styles.contactDetails}>Chat with our agents</Text>
                  <Text style={styles.contactHours}>Mon-Fri, 9 AM - 6 PM</Text>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Branch Locations</Text>
              <View style={styles.branchItem}>
                <Text style={styles.branchName}>Main Branch</Text>
                <Text style={styles.branchAddress}>
                  123 Banking Street, Financial District, Mumbai - 400001
                </Text>
                <Text style={styles.branchHours}>Mon-Fri: 10 AM - 4 PM, Sat: 10 AM - 2 PM</Text>
              </View>
            </View>
          </View>
        )}

        {selectedTab === 'chat' && (
          <View style={styles.content}>
            <View style={styles.chatContainer}>
              <View style={styles.chatHeader}>
                <Text style={styles.chatTitle}>Live Chat Support</Text>
                <Text style={styles.chatStatus}>● Online</Text>
              </View>
              
              <View style={styles.chatMessages}>
                <View style={styles.supportMessage}>
                  <Text style={styles.supportMessageText}>
                    Hello! How can I help you today?
                  </Text>
                  <Text style={styles.messageTime}>Just now</Text>
                </View>
              </View>
              
              <View style={styles.chatInput}>
                <TextInput
                  style={styles.messageInput}
                  value={chatMessage}
                  onChangeText={setChatMessage}
                  placeholder="Type your message..."
                  multiline
                  placeholderTextColor={Colors.textSecondary}
                />
                <TouchableOpacity
                  style={styles.sendButton}
                  onPress={handleSendMessage}
                >
                  <Send size={20} color={Colors.textOnPrimary} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  placeholder: {
    width: 40,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: Colors.surfaceVariant,
    marginRight: 8,
  },
  tabActive: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginLeft: 8,
  },
  tabTextActive: {
    color: Colors.textOnPrimary,
  },
  content: {
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 16,
  },
  quickAction: {
    flex: 1,
    backgroundColor: Colors.surfaceVariant,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  quickActionText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
    marginTop: 8,
    textAlign: 'center',
  },
  faqItem: {
    backgroundColor: Colors.surfaceVariant,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
    marginRight: 12,
  },
  faqCategory: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
    backgroundColor: Colors.background,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  faqAnswer: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 12,
    lineHeight: 20,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceVariant,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  contactDetails: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
    marginBottom: 2,
  },
  contactHours: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  branchItem: {
    backgroundColor: Colors.surfaceVariant,
    padding: 16,
    borderRadius: 12,
  },
  branchName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  branchAddress: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
    lineHeight: 20,
  },
  branchHours: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  chatContainer: {
    backgroundColor: Colors.surfaceVariant,
    borderRadius: 12,
    overflow: 'hidden',
    minHeight: 400,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.primary,
  },
  chatTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textOnPrimary,
  },
  chatStatus: {
    fontSize: 12,
    color: Colors.textOnPrimary,
  },
  chatMessages: {
    flex: 1,
    padding: 16,
    minHeight: 200,
  },
  supportMessage: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.background,
    padding: 12,
    borderRadius: 12,
    maxWidth: '80%',
    marginBottom: 8,
  },
  supportMessageText: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 4,
  },
  messageTime: {
    fontSize: 10,
    color: Colors.textSecondary,
  },
  chatInput: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    backgroundColor: Colors.background,
  },
  messageInput: {
    flex: 1,
    backgroundColor: Colors.surfaceVariant,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    maxHeight: 100,
    fontSize: 14,
    color: Colors.text,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});