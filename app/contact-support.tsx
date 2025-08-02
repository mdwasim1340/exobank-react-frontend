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
  Modal,
} from 'react-native';
import { ArrowLeft, Send, Paperclip, Phone, Mail, MessageCircle, Clock, CircleCheck as CheckCircle } from 'lucide-react-native';
import { router } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';

interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
  estimatedResponse: string;
}

const supportCategories = [
  'Account Issues',
  'Transaction Problems',
  'Card Related',
  'Loan Queries',
  'Investment Help',
  'Technical Support',
  'Security Concerns',
  'General Inquiry',
];

export default function ContactSupportScreen() {
  const { theme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [attachments, setAttachments] = useState<string[]>([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitTicket = async () => {
    if (!selectedCategory) {
      Alert.alert('Error', 'Please select a category');
      return;
    }

    if (!subject.trim()) {
      Alert.alert('Error', 'Please enter a subject');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Error', 'Please describe your issue');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        'Ticket Submitted',
        'Your support ticket has been submitted successfully. You will receive a response within 24 hours.',
        [
          {
            text: 'OK',
            onPress: () => {
              setSelectedCategory('');
              setSubject('');
              setDescription('');
              setAttachments([]);
            },
          },
        ]
      );
    }, 2000);
  };

  const handleAddAttachment = () => {
    if (attachments.length >= 3) {
      Alert.alert('Limit Reached', 'You can attach maximum 3 files');
      return;
    }

    Alert.alert(
      'Add Attachment',
      'Choose attachment type',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Camera', onPress: () => addAttachment('camera') },
        { text: 'Gallery', onPress: () => addAttachment('gallery') },
        { text: 'Document', onPress: () => addAttachment('document') },
      ]
    );
  };

  const addAttachment = (type: string) => {
    const newAttachment = `${type}_${Date.now()}.jpg`;
    setAttachments([...attachments, newAttachment]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleCall = () => {
    Alert.alert(
      'Call Support',
      'Call our 24/7 support line?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call Now', onPress: () => Alert.alert('Calling', 'Connecting to +1-800-EXOBANK...') },
      ]
    );
  };

  const handleEmail = () => {
    Alert.alert('Email Support', 'Opening email client to support@exobank.com');
  };

  const handleLiveChat = () => {
    router.push('/live-chat');
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
    quickActions: {
      flexDirection: 'row',
      paddingHorizontal: 20,
      marginBottom: 24,
      gap: 12,
    },
    quickAction: {
      flex: 1,
      backgroundColor: theme.surfaceVariant,
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.border,
    },
    quickActionIcon: {
      marginBottom: 8,
    },
    quickActionTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 4,
    },
    quickActionSubtitle: {
      fontSize: 11,
      color: theme.textSecondary,
      textAlign: 'center',
    },
    form: {
      paddingHorizontal: 20,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 16,
    },
    inputGroup: {
      marginBottom: 20,
    },
    inputLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 8,
    },
    categorySelector: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.surfaceVariant,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 16,
      borderWidth: 1,
      borderColor: theme.border,
    },
    categoryText: {
      fontSize: 16,
      color: selectedCategory ? theme.text : theme.textSecondary,
    },
    input: {
      backgroundColor: theme.surfaceVariant,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 16,
      fontSize: 16,
      color: theme.text,
      borderWidth: 1,
      borderColor: theme.border,
    },
    textArea: {
      minHeight: 120,
      textAlignVertical: 'top',
    },
    attachmentsContainer: {
      marginBottom: 20,
    },
    attachmentsList: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: 12,
    },
    attachmentItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.primary + '20',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
    },
    attachmentText: {
      fontSize: 12,
      color: theme.primary,
      marginRight: 8,
    },
    removeAttachment: {
      width: 16,
      height: 16,
      borderRadius: 8,
      backgroundColor: theme.error,
      justifyContent: 'center',
      alignItems: 'center',
    },
    addAttachmentButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.surfaceVariant,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.border,
      borderStyle: 'dashed',
    },
    addAttachmentText: {
      fontSize: 14,
      color: theme.textSecondary,
      marginLeft: 8,
    },
    submitButton: {
      backgroundColor: theme.primary,
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: 'center',
      marginTop: 20,
      marginBottom: 20,
      elevation: 2,
      shadowColor: theme.shadowDark,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
    },
    submitButtonDisabled: {
      opacity: 0.6,
    },
    submitButtonText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.textOnPrimary,
    },
    supportInfo: {
      backgroundColor: theme.surfaceVariant,
      padding: 16,
      borderRadius: 12,
      marginHorizontal: 20,
      marginBottom: 20,
    },
    supportInfoTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 12,
    },
    supportInfoItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    supportInfoIcon: {
      marginRight: 12,
    },
    supportInfoText: {
      fontSize: 14,
      color: theme.textSecondary,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: theme.overlay,
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: theme.background,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 20,
      maxHeight: '60%',
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
    },
    categoryOption: {
      paddingVertical: 16,
      paddingHorizontal: 16,
      borderRadius: 8,
      marginBottom: 8,
      backgroundColor: theme.surfaceVariant,
    },
    categoryOptionSelected: {
      backgroundColor: theme.primary,
    },
    categoryOptionText: {
      fontSize: 16,
      color: theme.text,
    },
    categoryOptionTextSelected: {
      color: theme.textOnPrimary,
    },
  });

  const isFormValid = selectedCategory && subject.trim() && description.trim();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contact Support</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickAction} onPress={handleCall}>
            <Phone size={24} color={theme.primary} style={styles.quickActionIcon} />
            <Text style={styles.quickActionTitle}>Call</Text>
            <Text style={styles.quickActionSubtitle}>24/7 Available</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickAction} onPress={handleEmail}>
            <Mail size={24} color={theme.primary} style={styles.quickActionIcon} />
            <Text style={styles.quickActionTitle}>Email</Text>
            <Text style={styles.quickActionSubtitle}>24h Response</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickAction} onPress={handleLiveChat}>
            <MessageCircle size={24} color={theme.primary} style={styles.quickActionIcon} />
            <Text style={styles.quickActionTitle}>Live Chat</Text>
            <Text style={styles.quickActionSubtitle}>Mon-Fri 9-6</Text>
          </TouchableOpacity>
        </View>

        {/* Support Form */}
        <View style={styles.form}>
          <Text style={styles.sectionTitle}>Submit a Ticket</Text>

          {/* Category Selection */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Category *</Text>
            <TouchableOpacity
              style={styles.categorySelector}
              onPress={() => setShowCategoryModal(true)}
            >
              <Text style={styles.categoryText}>
                {selectedCategory || 'Select a category'}
              </Text>
              <Text style={{ color: theme.textSecondary }}>▼</Text>
            </TouchableOpacity>
          </View>

          {/* Subject */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Subject *</Text>
            <TextInput
              style={styles.input}
              value={subject}
              onChangeText={setSubject}
              placeholder="Brief description of your issue"
              placeholderTextColor={theme.textSecondary}
            />
          </View>

          {/* Description */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Description *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Please provide detailed information about your issue..."
              placeholderTextColor={theme.textSecondary}
              multiline
              numberOfLines={6}
            />
          </View>

          {/* Attachments */}
          <View style={styles.attachmentsContainer}>
            <Text style={styles.inputLabel}>Attachments (Max 3 files)</Text>
            
            {attachments.length > 0 && (
              <View style={styles.attachmentsList}>
                {attachments.map((attachment, index) => (
                  <View key={index} style={styles.attachmentItem}>
                    <Text style={styles.attachmentText}>{attachment}</Text>
                    <TouchableOpacity
                      style={styles.removeAttachment}
                      onPress={() => removeAttachment(index)}
                    >
                      <Text style={{ color: theme.textOnPrimary, fontSize: 10 }}>×</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            <TouchableOpacity
              style={styles.addAttachmentButton}
              onPress={handleAddAttachment}
            >
              <Paperclip size={16} color={theme.textSecondary} />
              <Text style={styles.addAttachmentText}>Add attachment</Text>
            </TouchableOpacity>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              (!isFormValid || isSubmitting) && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmitTicket}
            disabled={!isFormValid || isSubmitting}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Support Information */}
        <View style={styles.supportInfo}>
          <Text style={styles.supportInfoTitle}>Support Information</Text>
          
          <View style={styles.supportInfoItem}>
            <Clock size={16} color={theme.primary} style={styles.supportInfoIcon} />
            <Text style={styles.supportInfoText}>Average response time: 2-4 hours</Text>
          </View>
          
          <View style={styles.supportInfoItem}>
            <CheckCircle size={16} color={theme.success} style={styles.supportInfoIcon} />
            <Text style={styles.supportInfoText}>Phone support: 24/7 available</Text>
          </View>
          
          <View style={styles.supportInfoItem}>
            <MessageCircle size={16} color={theme.info} style={styles.supportInfoIcon} />
            <Text style={styles.supportInfoText}>Live chat: Mon-Fri 9 AM - 6 PM</Text>
          </View>
        </View>
      </ScrollView>

      {/* Category Selection Modal */}
      <Modal
        visible={showCategoryModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Category</Text>
              <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
                <Text style={{ color: theme.primary, fontSize: 16 }}>Cancel</Text>
              </TouchableOpacity>
            </View>

            <ScrollView>
              {supportCategories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryOption,
                    selectedCategory === category && styles.categoryOptionSelected,
                  ]}
                  onPress={() => {
                    setSelectedCategory(category);
                    setShowCategoryModal(false);
                  }}
                >
                  <Text
                    style={[
                      styles.categoryOptionText,
                      selectedCategory === category && styles.categoryOptionTextSelected,
                    ]}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}