import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  Platform,
  SafeAreaView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { useScans } from '@/hooks/useScans';
import { generateMockMarker } from '@/utils/mockAruco';
import { ScanOverlay } from '@/components/ScanOverlay';
import { ScanToast } from '@/components/ScanToast';
import { PermissionScreen } from '@/components/PermissionScreen';

const { width, height } = Dimensions.get('window');

interface DetectedMarker {
  id: number;
  message: string;
  timestamp: number;
  corners: { x: number; y: number }[];
}

export default function ScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing] = useState<CameraType>('back');
  const [detectedMarker, setDetectedMarker] = useState<DetectedMarker | null>(null);
  const [isScanning, setIsScanning] = useState(true);
  const [consecutiveDetections, setConsecutiveDetections] = useState(0);
  const [lastMarkerId, setLastMarkerId] = useState<number | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastData, setToastData] = useState<{ markerId: number; message: string } | null>(null);

  const { addScan } = useScans();
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const initialDelayRef = useRef<NodeJS.Timeout | null>(null);
  const outlineAnimation = useRef(new Animated.Value(0)).current;

  // Start scanning only when tab is focused AND permissions are granted
  useFocusEffect(
    React.useCallback(() => {
      // Only start if permissions are granted
      if (!permission?.granted) {
        return;
      }

      // Reset camera state when tab comes into focus
      setIsScanning(false);
      setDetectedMarker(null);
      setConsecutiveDetections(0);
      setLastMarkerId(null);
      
      // Start scanning after 3 seconds
      initialDelayRef.current = setTimeout(() => {
        setIsScanning(true);
      }, 1000);
      
      return () => {
        // Cleanup when tab loses focus
        if (scanIntervalRef.current) {
          clearInterval(scanIntervalRef.current);
        }
        if (pauseTimeoutRef.current) {
          clearTimeout(pauseTimeoutRef.current);
        }
        if (initialDelayRef.current) {
          clearTimeout(initialDelayRef.current);
        }
      };
    }, [permission?.granted])
  );

  useEffect(() => {
    // Only run scanning logic if permissions are granted
    if (!permission?.granted || !isScanning) return;

    scanIntervalRef.current = setInterval(() => {
      // Simulate random ArUco marker detection (80% chance for better demo)
      if (Math.random() < 0.85) {
        const mockMarker = generateMockMarker();
        const marker: DetectedMarker = {
          id: mockMarker.id,
          message: mockMarker.message,
          timestamp: Date.now(),
          corners: [
            { x: width * 0.25, y: height * 0.4 },
            { x: width * 0.75, y: height * 0.4 },
            { x: width * 0.75, y: height * 0.6 },
            { x: width * 0.25, y: height * 0.6 },
          ],
        };

        setDetectedMarker(marker);

        // Check for consecutive detections
        if (lastMarkerId === marker.id) {
          setConsecutiveDetections(prev => {
            const newCount = prev + 1;
            return newCount;
          });
        } else {
          setConsecutiveDetections(1);
          setLastMarkerId(marker.id);
        }
      } else {
        setDetectedMarker(null);
        setConsecutiveDetections(0);
        setLastMarkerId(null);
      }
    }, 800); // Scan every 0.8 seconds

    return () => {
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
      }
    };
  }, [isScanning, lastMarkerId, permission?.granted]);

  // Handle successful scan (≥3 consecutive frames)
  useEffect(() => {
    if (consecutiveDetections >= 2 && detectedMarker && isScanning) {
      handleScanSuccess(detectedMarker);
    }
  }, [consecutiveDetections, detectedMarker, isScanning]);

  const handleScanSuccess = (marker: DetectedMarker) => {
    // Trigger haptic feedback
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    // Add to scan history
    addScan({
      id: Date.now(),
      markerId: marker.id,
      message: marker.message,
      timestamp: marker.timestamp,
    });

    // Show success animation
    Animated.sequence([
      Animated.timing(outlineAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(outlineAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();

    // Show toast
    setToastData({ markerId: marker.id, message: marker.message });
    setShowToast(true);

    // Pause scanning for 2 seconds
    setIsScanning(false);
    pauseTimeoutRef.current = setTimeout(() => {
      setIsScanning(true);
      setDetectedMarker(null);
      setConsecutiveDetections(0);
      setLastMarkerId(null);
    }, 600);
  };

  const hideToast = () => {
    setShowToast(false);
    setToastData(null);
  };

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return <PermissionScreen onRequestPermission={requestPermission} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cameraContainer}>
        <CameraView style={styles.camera} facing={facing} />
        <ScanOverlay
          detectedMarker={detectedMarker}
          consecutiveDetections={consecutiveDetections}
          isScanning={isScanning}
          outlineAnimation={outlineAnimation}
        />
      </View>

      {showToast && toastData && (
        <ScanToast
          markerId={toastData.markerId}
          message={toastData.message}
          onHide={hideToast}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
});