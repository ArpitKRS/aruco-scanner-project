import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CircleCheck as CheckCircle, X } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface Props {
  markerId: number;
  message: string;
  onHide: () => void;
}

export function ScanToast({ markerId, message, onHide }: Props) {
  const insets = useSafeAreaInsets();
  const slideAnimation = useRef(new Animated.Value(-100)).current;
  const opacityAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Slide in animation
    Animated.parallel([
      Animated.timing(slideAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-hide after 4 seconds
    const timer = setTimeout(() => {
      hideToast();
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(slideAnimation, {
        toValue: -100,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnimation, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide();
    });
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          top: 60 + insets.top,
          transform: [{ translateY: slideAnimation }],
          opacity: opacityAnimation,
        },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <CheckCircle size={24} color="#10B981" />
            <Text style={styles.title}>Scan Complete</Text>
          </View>
          <TouchableOpacity onPress={hideToast} style={styles.closeButton}>
            <X size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.details}>
          <Text style={styles.markerLabel}>Marker ID:</Text>
          <Text style={styles.markerId}>#{markerId}</Text>
        </View>
        
        <View style={styles.messageContainer}>
          <Text style={styles.messageLabel}>Decoded Message:</Text>
          <Text style={styles.message}>{message}</Text>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 12,
    right: 12,
    zIndex: 1000,
  },
  content: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '700',
    color: '#10B981',
  },
  closeButton: {
    padding: 4,
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  markerLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    marginRight: 8,
  },
  markerId: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2563EB',
  },
  messageContainer: {
    backgroundColor: '#f9fafb',
    padding: 10,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  messageLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  message: {
    fontSize: 14,
    color: '#111827',
    lineHeight: 18,
  },
});