import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../utils/theme';

const vendorCategories = [
  'Groceries',
  'Household essentials',
  'Restaurants',
  'Electronics',
  'Fashion',
  'Other',
];

const VendorsScreen = () => {
  const [businessName, setBusinessName] = useState('');
  const [contactName, setContactName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [suburb, setSuburb] = useState('');
  const [category, setCategory] = useState('Groceries');
  const [preview, setPreview] = useState(null);

  const previewApplication = () => {
    if (!businessName.trim() || !contactName.trim() || !whatsapp.trim() || !suburb.trim()) {
      Alert.alert('Complete the form', 'Please enter your business name, contact name, WhatsApp number and suburb.');
      return;
    }

    setPreview({
      businessName: businessName.trim(),
      contactName: contactName.trim(),
      whatsapp: whatsapp.trim(),
      suburb: suburb.trim(),
      category,
    });

    Alert.alert(
      'Preview created',
      'This is a local preview only. Your details have not been sent to Mzansi Cart and your business is not yet registered.'
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <Ionicons name="storefront" size={30} color={theme.colors.white} />
          </View>
          <Text style={styles.title}>Grow with Mzansi Cart</Text>
          <Text style={styles.subtitle}>
            We are preparing a local marketplace for grocery and household businesses.
            Vendor applications will open after the platform's approval and order systems are ready.
          </Text>
        </View>

        <View style={styles.notice}>
          <Ionicons name="information-circle-outline" size={20} color={theme.colors.primary} />
          <Text style={styles.noticeText}>
            Prototype only: this form creates a preview on this screen. It does not submit or store an application.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Vendor interest form</Text>

        <Text style={styles.label}>Business name</Text>
        <TextInput
          accessibilityLabel="Business name"
          style={styles.input}
          value={businessName}
          onChangeText={setBusinessName}
          placeholder="e.g. Your grocery store"
          placeholderTextColor={theme.colors.gray}
          maxLength={80}
          returnKeyType="next"
        />

        <Text style={styles.label}>Contact person</Text>
        <TextInput
          accessibilityLabel="Contact person"
          style={styles.input}
          value={contactName}
          onChangeText={setContactName}
          placeholder="Full name"
          placeholderTextColor={theme.colors.gray}
          maxLength={80}
          returnKeyType="next"
        />

        <Text style={styles.label}>WhatsApp number</Text>
        <TextInput
          accessibilityLabel="WhatsApp number"
          style={styles.input}
          value={whatsapp}
          onChangeText={setWhatsapp}
          placeholder="+27 ..."
          placeholderTextColor={theme.colors.gray}
          keyboardType="phone-pad"
          maxLength={20}
          returnKeyType="next"
        />

        <Text style={styles.label}>Business suburb / area</Text>
        <TextInput
          accessibilityLabel="Business suburb or area"
          style={styles.input}
          value={suburb}
          onChangeText={setSuburb}
          placeholder="e.g. Johannesburg"
          placeholderTextColor={theme.colors.gray}
          maxLength={80}
          returnKeyType="done"
        />

        <Text style={styles.label}>Business category</Text>
        <View style={styles.categoryList}>
          {vendorCategories.map((item) => {
            const selected = category === item;
            return (
              <TouchableOpacity
                key={item}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                style={[styles.categoryChip, selected && styles.categoryChipSelected]}
                onPress={() => setCategory(item)}
              >
                <Text style={[styles.categoryText, selected && styles.categoryTextSelected]}>
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={previewApplication}>
          <Text style={styles.primaryButtonText}>Preview vendor application</Text>
        </TouchableOpacity>

        {preview && (
          <View style={styles.previewCard}>
            <Text style={styles.previewEyebrow}>LOCAL PREVIEW — NOT SUBMITTED</Text>
            <Text style={styles.previewTitle}>{preview.businessName}</Text>
            <Text style={styles.previewLine}>{preview.category} · {preview.suburb}</Text>
            <Text style={styles.previewLine}>Contact: {preview.contactName}</Text>
            <Text style={styles.previewLine}>WhatsApp: {preview.whatsapp}</Text>
          </View>
        )}

        <Text style={styles.footerNote}>
          Mzansi Cart will verify vendors and confirm terms before any shop can list products or accept customer orders.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xxl,
  },
  hero: {
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
  heroIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  notice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#E8F0EB',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  noticeText: {
    flex: 1,
    marginLeft: theme.spacing.sm,
    color: theme.colors.text,
    fontSize: 13,
    lineHeight: 19,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  label: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
    marginTop: theme.spacing.sm,
  },
  input: {
    minHeight: 48,
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.lightGray,
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    color: theme.colors.text,
    fontSize: 16,
  },
  categoryList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: theme.spacing.md,
  },
  categoryChip: {
    borderWidth: 1,
    borderColor: theme.colors.lightGray,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginRight: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    backgroundColor: theme.colors.white,
  },
  categoryChipSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  categoryText: {
    color: theme.colors.text,
    fontSize: 13,
  },
  categoryTextSelected: {
    color: theme.colors.white,
    fontWeight: '600',
  },
  primaryButton: {
    minHeight: 50,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
  primaryButtonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  previewCard: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.accent,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.lg,
  },
  previewEyebrow: {
    color: theme.colors.primary,
    fontSize: 11,
    fontWeight: '700',
    marginBottom: theme.spacing.xs,
  },
  previewTitle: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: theme.spacing.xs,
  },
  previewLine: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    marginTop: 3,
  },
  footerNote: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: theme.spacing.xl,
  },
});

export default VendorsScreen;
