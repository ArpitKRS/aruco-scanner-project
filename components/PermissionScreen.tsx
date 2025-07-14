import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Camera, Shield } from 'lucide-react-native';

interface Props {
  onRequestPermission: () => void;
}

export function PermissionScreen({ onRequestPermission }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Shield size={80} color="#2563EB" />
        </View>
        
        <Text style={styles.title}>Camera Permission Required</Text>
        <Text style={styles.description}>
          This app needs access to your camera to scan ArUco markers. 
          Your privacy is important - we only use the camera for real-time marker detection.
        </Text>
        
        <View style={styles.features}>
          <View style={styles.feature}>
            <Camera size={24} color="#10B981" />
            <Text style={styles.featureText}>Real-time ArUco marker detection</Text>
          </View>
          <View style={styles.feature}>
            <Shield size={24} color="#10B981" />
            <Text style={styles.featureText}>No photos or videos are stored</Text>
          </View>
        </View>
        
        <TouchableOpacity
          style={styles.button}
          onPress={onRequestPermission}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Grant Camera Permission</Text>
        </TouchableOpacity>
        
        <Text style={styles.note}>
          You can always change this permission in your device settings later.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  features: {
    alignSelf: 'stretch',
    marginBottom: 40,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  featureText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#374151',
    flex: 1,
  },
  button: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    alignSelf: 'stretch',
    marginBottom: 16,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
  },
  note: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
});