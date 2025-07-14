import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Scan } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

interface Props {
  detectedMarker: any;
  consecutiveDetections: number;
  isScanning: boolean;
  outlineAnimation: Animated.Value;
}

export function ScanOverlay({ 
  detectedMarker, 
  consecutiveDetections, 
  isScanning,
  outlineAnimation 
}: Props) {
  const insets = useSafeAreaInsets();
  
  const borderColor = outlineAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(37, 99, 235, 0.8)', 'rgba(16, 185, 129, 1)'],
  });

  return (
    <View style={[styles.overlay, StyleSheet.absoluteFillObject]}>
      {/* Scanning indicator */}
      <View style={[styles.statusBar, { paddingTop: Math.max(insets.top, 16) }]}>
        <View style={styles.statusBarContent}>
          <View style={styles.statusContent}>
            <Scan size={20} color="#ffffff" />
            <Text style={styles.statusText}>
              {isScanning ? 'Scanning for ArUco markers...' : 'Initializing scanner...'}
            </Text>
          </View>
          <View style={styles.counterContainer}>
            {consecutiveDetections > 0 && (
              <Text style={styles.detectionCounter}>
                {consecutiveDetections}/2
              </Text>
            )}
          </View>
        </View>
      </View>

      {/* Detection frame */}
      <View style={[styles.frameContainer, { 
        top: height * 0.25 + insets.top,
        bottom: height * 0.25 + insets.bottom,
      }]}>
        <View style={styles.frame} />
        <View style={styles.frameCorners}>
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
        </View>
      </View>

      {/* Detected marker outline */}
      {detectedMarker && (
        <Animated.View
          style={[
            styles.markerOutline,
            {
              borderColor,
              left: detectedMarker.corners[0].x,
              top: detectedMarker.corners[0].y,
              width: detectedMarker.corners[1].x - detectedMarker.corners[0].x,
              height: detectedMarker.corners[2].y - detectedMarker.corners[0].y,
            },
          ]}
        >
          <View style={styles.markerInfo}>
            <Text style={styles.markerIdText}>#{detectedMarker.id}</Text>
          </View>
        </Animated.View>
      )}

      {/* Instructions */}
      <View style={[styles.instructions, { paddingBottom: Math.max(insets.bottom + 100, 120) }]}>
        <Text style={styles.instructionText}>
          Point camera at ArUco markers
        </Text>
        <Text style={styles.instructionSubtext}>
          Auto-scan triggers after 2 consecutive detections
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
  },
  statusBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  statusBarContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 40,
  },
  statusContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  detectionCounter: {
    fontSize: 16,
    fontWeight: '700',
    color: '#10B981',
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#10B981',
    minWidth: 50,
    textAlign: 'center',
  },
  counterContainer: {
    minWidth: 50,
    alignItems: 'flex-end',
  },
  frameContainer: {
    position: 'absolute',
    left: 20,
    right: 20,
    top: height * 0.3,
    bottom: height * 0.3,
  },
  frame: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 16,
    borderStyle: 'dashed',
  },
  frameCorners: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  corner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: '#ffffff',
    borderWidth: 3,
  },
  topLeft: {
    top: -3,
    left: -3,
    borderBottomWidth: 0,
    borderRightWidth: 0,
    borderTopLeftRadius: 16,
  },
  topRight: {
    top: -3,
    right: -3,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderTopRightRadius: 16,
  },
  bottomLeft: {
    bottom: -3,
    left: -3,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomLeftRadius: 16,
  },
  bottomRight: {
    bottom: -3,
    right: -3,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderBottomRightRadius: 16,
  },
  markerOutline: {
    position: 'absolute',
    borderWidth: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  markerInfo: {
    position: 'absolute',
    top: -36,
    left: -2,
    backgroundColor: 'rgba(37, 99, 235, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  markerIdText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  instructions: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  instructionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 6,
  },
  instructionSubtext: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
});