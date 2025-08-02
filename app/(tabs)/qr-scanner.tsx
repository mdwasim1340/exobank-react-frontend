import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Flashlight, FlashlightOff, X, CircleCheck as CheckCircle } from 'lucide-react-native';
import SafeAreaView from '@/components/SafeAreaView';
import { useTheme } from '@/hooks/useTheme';

export default function QRScannerScreen() {
  const { theme } = useTheme();
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const [showAmountModal, setShowAmountModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Main styles - defined early to prevent undefined errors
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
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 14,
      color: theme.textSecondary,
    },
    cameraContainer: {
      flex: 1,
      margin: 20,
      borderRadius: 16,
      overflow: 'hidden',
      position: 'relative',
    },
    camera: {
      flex: 1,
    },
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    scanArea: {
      width: 250,
      height: 250,
      position: 'relative',
    },
    corner: {
      position: 'absolute',
      width: 30,
      height: 30,
      borderColor: theme.textOnPrimary,
      borderWidth: 3,
    },
    topLeft: {
      top: 0,
      left: 0,
      borderRightWidth: 0,
      borderBottomWidth: 0,
    },
    topRight: {
      top: 0,
      right: 0,
      borderLeftWidth: 0,
      borderBottomWidth: 0,
    },
    bottomLeft: {
      bottom: 0,
      left: 0,
      borderRightWidth: 0,
      borderTopWidth: 0,
    },
    bottomRight: {
      bottom: 0,
      right: 0,
      borderLeftWidth: 0,
      borderTopWidth: 0,
    },
    controls: {
      position: 'absolute',
      bottom: 20,
      right: 20,
    },
    controlButton: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: theme.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    instructions: {
      padding: 20,
      alignItems: 'center',
    },
    instructionText: {
      fontSize: 16,
      color: theme.textSecondary,
      textAlign: 'center',
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
      minHeight: 300,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.text,
    },
    qrInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.surfaceVariant,
      padding: 12,
      borderRadius: 8,
      marginBottom: 24,
    },
    qrInfoText: {
      fontSize: 14,
      color: theme.success,
      marginLeft: 8,
      fontWeight: '600',
    },
    amountContainer: {
      marginBottom: 32,
    },
    amountLabel: {
      fontSize: 16,
      color: theme.text,
      marginBottom: 12,
      fontWeight: '600',
    },
    amountInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: theme.primary,
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    currencySymbol: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.text,
      marginRight: 8,
    },
    amountInput: {
      flex: 1,
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.text,
    },
    modalButtons: {
      flexDirection: 'row',
      gap: 12,
    },
    modalButton: {
      flex: 1,
      paddingVertical: 16,
      borderRadius: 8,
      alignItems: 'center',
    },
    cancelButton: {
      backgroundColor: theme.surfaceVariant,
    },
    payButton: {
      backgroundColor: theme.primary,
    },
    cancelButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
    },
    payButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.textOnPrimary,
    },
    permissionContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    permissionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 12,
      textAlign: 'center',
    },
    permissionText: {
      fontSize: 16,
      color: theme.textSecondary,
      textAlign: 'center',
      marginBottom: 24,
      lineHeight: 22,
    },
    permissionButton: {
      backgroundColor: theme.primary,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
    },
    permissionButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.textOnPrimary,
    },
  });

  if (!permission) {
    return <View style={[styles.container, { backgroundColor: theme.background }]} />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionTitle}>Camera Permission Required</Text>
          <Text style={styles.permissionText}>
            We need your permission to use the camera for QR code scanning
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={requestPermission}
          >
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    setScannedData(data);
    setShowAmountModal(true);
    
    setTimeout(() => {
      setIsProcessing(false);
    }, 2000);
  };

  const handlePayment = () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    Alert.alert(
      'Payment Confirmation',
      `Are you sure you want to pay ₹${amount}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Pay',
          onPress: () => {
            setShowAmountModal(false);
            setAmount('');
            setScannedData(null);
            Alert.alert('Success', 'Payment processed successfully!');
          },
        },
      ]
    );
  };

  const toggleFlash = () => {
    setFlashEnabled(!flashEnabled);
  };

  const closeModal = () => {
    setShowAmountModal(false);
    setAmount('');
    setScannedData(null);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.title}>QR Scanner</Text>
        <Text style={styles.subtitle}>Scan QR code to make payment</Text>
      </View>

      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          facing={facing}
          onBarcodeScanned={handleBarcodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
        >
          <View style={styles.overlay}>
            <View style={styles.scanArea}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
            </View>
          </View>
        </CameraView>

        <View style={styles.controls}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={toggleFlash}
          >
            {flashEnabled ? (
              <FlashlightOff size={24} color={theme.textOnPrimary} />
            ) : (
              <Flashlight size={24} color={theme.textOnPrimary} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.instructions}>
        <Text style={styles.instructionText}>
          Point your camera at a QR code to scan
        </Text>
      </View>

      {/* Amount Input Modal */}
      <Modal
        visible={showAmountModal}
        transparent
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Enter Amount</Text>
              <TouchableOpacity onPress={closeModal}>
                <X size={24} color={theme.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.qrInfo}>
              <CheckCircle size={20} color={theme.success} />
              <Text style={styles.qrInfoText}>QR Code Scanned Successfully</Text>
            </View>

            <View style={styles.amountContainer}>
              <Text style={styles.amountLabel}>Amount to Pay</Text>
              <View style={styles.amountInputContainer}>
                <Text style={styles.currencySymbol}>₹</Text>
                <TextInput
                  style={styles.amountInput}
                  value={amount}
                  onChangeText={setAmount}
                  placeholder="0.00"
                  placeholderTextColor={theme.textSecondary}
                  keyboardType="numeric"
                  autoFocus
                />
              </View>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={closeModal}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.payButton]}
                onPress={handlePayment}
              >
                <Text style={styles.payButtonText}>Pay Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}