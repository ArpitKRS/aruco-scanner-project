import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronDown, ChevronRight, Trash2 } from 'lucide-react-native';
import { useScans } from '@/hooks/useScans';
import { formatTimestamp } from '@/utils/dateUtils';

export default function HistoryScreen() {
  const { scans, clearScans } = useScans();
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const insets = useSafeAreaInsets();

  const toggleExpanded = (id: number) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const renderScanItem = ({ item }: { item: any }) => {
    const isExpanded = expandedItems.has(item.id);

    return (
      <View style={styles.scanItem}>
        <TouchableOpacity
          style={styles.scanHeader}
          onPress={() => toggleExpanded(item.id)}
          activeOpacity={0.7}
        >
          <View style={styles.scanHeaderContent}>
            <View style={styles.markerInfo}>
              <Text style={styles.markerId}>Marker #{item.markerId}</Text>
              <Text style={styles.timestamp}>{formatTimestamp(item.timestamp)}</Text>
            </View>
            {isExpanded ? (
              <ChevronDown size={20} color="#6b7280" />
            ) : (
              <ChevronRight size={20} color="#6b7280" />
            )}
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.scanDetails}>
            <Text style={styles.messageLabel}>Decoded Message:</Text>
            <Text style={styles.messageText}>{item.message}</Text>
            <View style={styles.metadata}>
              <Text style={styles.metadataText}>
                Scan ID: {item.id}
              </Text>
              <Text style={styles.metadataText}>
                Detection Time: {new Date(item.timestamp).toLocaleTimeString()}
              </Text>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
      <View style={styles.headerContent}>
        <Text style={styles.title}>Scan History</Text>
        {scans.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={clearScans}
            activeOpacity={0.7}
          >
            <Trash2 size={20} color="#ef4444" />
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>
      </View>

      {scans.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No scans yet</Text>
          <Text style={styles.emptyDescription}>
            Point your camera at ArUco markers to start scanning
          </Text>
        </View>
      ) : (
        <FlatList
          data={scans.slice().reverse()} // Show newest first
          keyExtractor={item => item.id.toString()}
          renderItem={renderScanItem}
          contentContainerStyle={[styles.listContainer, { paddingBottom: Math.max(insets.bottom + 100, 120) }]}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#fef2f2',
  },
  clearButtonText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
    color: '#ef4444',
  },
  listContainer: {
    padding: 16,
  },
  scanItem: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scanHeader: {
    padding: 16,
  },
  scanHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  markerInfo: {
    flex: 1,
  },
  markerId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563EB',
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 14,
    color: '#6b7280',
  },
  scanDetails: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  messageLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  messageText: {
    fontSize: 16,
    color: '#111827',
    marginBottom: 16,
    lineHeight: 22,
  },
  metadata: {
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 8,
  },
  metadataText: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 22,
  },
});