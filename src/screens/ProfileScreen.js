import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../utils/theme';
import { checkApiHealth, API_BASE_URL } from '../utils/api';

const ProfileScreen = () => {
  const [connection, setConnection] = useState('checking');
  const [message, setMessage] = useState('Checking backend connection…');
  const [checking, setChecking] = useState(false);

  const testConnection = useCallback(async () => {
    setChecking(true);
    setConnection('checking');
    setMessage('Checking backend connection…');

    try {
      const health = await checkApiHealth();
      setConnection('connected');
      setMessage(
        health.persistence === 'not-configured'
          ? 'Connected. Backend is responding; secure order storage is not configured.'
          : 'Connected. Backend is responding.'
      );
    } catch (error) {
      setConnection('offline');
      setMessage(error.message || 'Could not connect to the backend.');
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    testConnection();
  }, [testConnection]);

  const statusColor = connection === 'connected'
    ? theme.colors.success
    : connection === 'offline'
      ? theme.colors.error
      : theme.colors.textSecondary;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.subtitle}>Manage your account and preferences</Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Backend connection</Text>
          <View style={styles.statusRow}>
            {checking ? (
              <ActivityIndicator size="small" color={theme.colors.primary} />
            ) : (
              <Ionicons
                name={connection === 'connected' ? 'checkmark-circle' : connection === 'offline' ? 'alert-circle' : 'ellipse'}
                size={21}
                color={statusColor}
              />
            )}
            <Text style={[styles.statusText, { color: statusColor }]}>
              {connection === 'connected' ? 'Connected' : connection === 'offline' ? 'Not connected' : 'Checking'}
            </Text>
          </View>
          <Text style={styles.message}>{message}</Text>
          <Text style={styles.url}>{API_BASE_URL}</Text>
          <TouchableOpacity
            accessibilityRole="button"
            style={[styles.button, checking && styles.buttonDisabled]}
            onPress={testConnection}
            disabled={checking}
          >
            <Text style={styles.buttonText}>{checking ? 'Checking…' : 'Test connection again'}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.demoNote}>
          Development backend only. Orders, payments and customer details are not sent to this server.
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    padding: theme.spacing.md,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
  },
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    ...theme.shadows.small,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  statusRow: {
    minHeight: 28,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
  },
  message: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginTop: theme.spacing.sm,
  },
  url: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    marginTop: theme.spacing.sm,
  },
  button: {
    minHeight: 48,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: theme.colors.white,
    fontSize: 15,
    fontWeight: '600',
  },
  demoNote: {
    color: theme.colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
    marginTop: theme.spacing.md,
  },
});

export default ProfileScreen;
