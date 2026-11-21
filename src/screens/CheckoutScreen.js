import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../utils/theme';
import { useCart } from '../context/CartContext';

const DELIVERY_DETAILS_KEY = 'mzansiCartDeliveryDetails';
const money = (amount) => `R${Number(amount || 0).toFixed(2)}`;

const emptyDetails = {
  fullName: '',
  phone: '',
  address: '',
  suburb: '',
  postalCode: '',
  instructions: '',
};

const CheckoutScreen = ({ navigation }) => {
  const { items, totalPrice, deliveryFee, serviceFee, tax, getCartTotal } = useCart();
  const [details, setDetails] = useState(emptyDetails);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadDetails = async () => {
      try {
        const stored = await AsyncStorage.getItem(DELIVERY_DETAILS_KEY);
        if (stored) {
          setDetails({ ...emptyDetails, ...JSON.parse(stored) });
          setSaved(true);
        }
      } catch (error) {
        console.warn('Could not load saved delivery details:', error);
      }
    };
    loadDetails();
  }, []);

  const updateField = (field, value) => {
    setDetails(current => ({ ...current, [field]: value }));
    setSaved(false);
  };

  const saveDetails = async () => {
    if (!details.fullName.trim() || !details.phone.trim() || !details.address.trim() ||
        !details.suburb.trim() || !details.postalCode.trim()) {
      Alert.alert('Missing details', 'Please complete your name, phone number, street address, suburb and postal code.');
      return;
    }
    if (details.phone.replace(/\D/g, '').length < 9) {
      Alert.alert('Check phone number', 'Please enter a valid contact number.');
      return;
    }
    setSaving(true);
    try {
      await AsyncStorage.setItem(DELIVERY_DETAILS_KEY, JSON.stringify(details));
      setSaved(true);
      Alert.alert('Details saved', 'Your delivery details have been saved on this device.');
    } catch (error) {
      Alert.alert('Could not save', 'Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const field = (label, key, placeholder, options = {}) => (
    <View style={styles.field} key={key}>
      <Text style={styles.fieldLabel}>{label}{options.required ? ' *' : ''}</Text>
      <TextInput
        style={[styles.input, options.multiline && styles.multilineInput]}
        value={details[key]}
        onChangeText={(value) => updateField(key, value)}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textSecondary}
        keyboardType={options.keyboardType || 'default'}
        autoCapitalize={options.autoCapitalize || 'sentences'}
        multiline={!!options.multiline}
        textAlignVertical={options.multiline ? 'top' : 'center'}
        maxLength={options.maxLength}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Checkout</Text>
        <Text style={styles.subtitle}>Review your order and add your delivery details.</Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Order items</Text>
          {items.length === 0 ? (
            <Text style={styles.muted}>Your cart is empty.</Text>
          ) : items.map((item, index) => (
            <View key={`${item.id}-${index}`} style={styles.itemRow}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.muted}>{item.quantity} × {money(item.price)}</Text>
              </View>
              <Text style={styles.itemPrice}>{money(item.price * item.quantity)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Delivery details</Text>
          <Text style={styles.helper}>Fields marked * are required. These details are saved on this device for this demo.</Text>
          {field('Full name', 'fullName', 'Enter your full name', { required: true })}
          {field('Mobile number', 'phone', 'e.g. 082 123 4567', { required: true, keyboardType: 'phone-pad' })}
          {field('Street address', 'address', 'House or street address', { required: true })}
          {field('Suburb', 'suburb', 'Enter your suburb', { required: true })}
          {field('Postal code', 'postalCode', 'Enter postal code', { required: true, keyboardType: 'number-pad', maxLength: 10 })}
          {field('Delivery instructions (optional)', 'instructions', 'Gate code, landmarks or other instructions', { multiline: true, maxLength: 250 })}
          <TouchableOpacity style={styles.saveButton} onPress={saveDetails} disabled={saving}>
            <Text style={styles.saveButtonText}>{saving ? 'Saving…' : saved ? 'Update delivery details' : 'Save delivery details'}</Text>
          </TouchableOpacity>
          {saved && (
            <View style={styles.savedRow}>
              <Ionicons name="checkmark-circle" size={18} color={theme.colors.primary} />
              <Text style={styles.savedText}>Delivery details saved on this device</Text>
            </View>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Cost summary</Text>
          <View style={styles.totalRow}><Text style={styles.label}>Subtotal</Text><Text style={styles.amount}>{money(totalPrice)}</Text></View>
          <View style={styles.totalRow}><Text style={styles.label}>Delivery fee</Text><Text style={styles.amount}>{money(deliveryFee)}</Text></View>
          <View style={styles.totalRow}><Text style={styles.label}>Service fee</Text><Text style={styles.amount}>{money(serviceFee)}</Text></View>
          <View style={styles.totalRow}><Text style={styles.label}>Tax</Text><Text style={styles.amount}>{money(tax)}</Text></View>
          <View style={styles.separator} />
          <View style={styles.totalRow}><Text style={styles.grandLabel}>Estimated total</Text><Text style={styles.grandTotal}>{money(getCartTotal())}</Text></View>
        </View>

        <View style={styles.notice}>
          <Ionicons name="information-circle-outline" size={22} color={theme.colors.primary} />
          <Text style={styles.noticeText}>Demo checkout: online payments and order submission are not connected yet. No money will be charged.</Text>
        </View>

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Back to cart</Text>
        </TouchableOpacity>
        <View style={styles.disabledButton}>
          <Text style={styles.disabledButtonText}>Payment not available yet</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: theme.spacing.md, paddingBottom: theme.spacing.xl },
  title: { fontSize: 24, fontWeight: 'bold', color: theme.colors.text, marginBottom: theme.spacing.xs },
  subtitle: { fontSize: 15, color: theme.colors.textSecondary, marginBottom: theme.spacing.md },
  card: { backgroundColor: theme.colors.white, borderRadius: theme.borderRadius.lg, padding: theme.spacing.md, marginBottom: theme.spacing.md, ...theme.shadows.small },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: theme.colors.text, marginBottom: theme.spacing.md },
  helper: { fontSize: 13, color: theme.colors.textSecondary, marginBottom: theme.spacing.sm },
  field: { marginBottom: theme.spacing.sm },
  fieldLabel: { fontSize: 14, fontWeight: '600', color: theme.colors.text, marginBottom: 6 },
  input: { minHeight: 48, borderWidth: 1, borderColor: theme.colors.lightGray, borderRadius: theme.borderRadius.md, paddingHorizontal: theme.spacing.md, color: theme.colors.text, backgroundColor: theme.colors.background, fontSize: 15 },
  multilineInput: { minHeight: 88, paddingTop: theme.spacing.sm },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: theme.spacing.sm, borderBottomWidth: 1, borderBottomColor: theme.colors.lightGray },
  itemInfo: { flex: 1, paddingRight: theme.spacing.sm },
  itemName: { fontSize: 15, fontWeight: '600', color: theme.colors.text },
  itemPrice: { fontSize: 15, fontWeight: '600', color: theme.colors.text },
  muted: { fontSize: 13, color: theme.colors.textSecondary, marginTop: 3 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: theme.spacing.xs },
  label: { fontSize: 14, color: theme.colors.textSecondary },
  amount: { fontSize: 14, color: theme.colors.text },
  separator: { height: 1, backgroundColor: theme.colors.lightGray, marginVertical: theme.spacing.sm },
  grandLabel: { fontSize: 17, fontWeight: 'bold', color: theme.colors.text },
  grandTotal: { fontSize: 20, fontWeight: 'bold', color: theme.colors.primary },
  notice: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.white, borderRadius: theme.borderRadius.md, padding: theme.spacing.md, marginBottom: theme.spacing.md },
  noticeText: { flex: 1, marginLeft: theme.spacing.sm, fontSize: 13, color: theme.colors.text },
  saveButton: { minHeight: 48, backgroundColor: theme.colors.primary, padding: theme.spacing.md, borderRadius: theme.borderRadius.lg, alignItems: 'center', justifyContent: 'center', marginTop: theme.spacing.sm },
  saveButtonText: { color: theme.colors.white, fontSize: 15, fontWeight: 'bold' },
  savedRow: { flexDirection: 'row', alignItems: 'center', marginTop: theme.spacing.sm },
  savedText: { color: theme.colors.primary, fontSize: 13, marginLeft: 6 },
  backButton: { backgroundColor: theme.colors.primary, padding: theme.spacing.md, borderRadius: theme.borderRadius.lg, alignItems: 'center', marginBottom: theme.spacing.sm, minHeight: 48, justifyContent: 'center' },
  backButtonText: { color: theme.colors.white, fontSize: 16, fontWeight: 'bold' },
  disabledButton: { backgroundColor: theme.colors.lightGray, padding: theme.spacing.md, borderRadius: theme.borderRadius.lg, alignItems: 'center', minHeight: 48, justifyContent: 'center' },
  disabledButtonText: { color: theme.colors.textSecondary, fontSize: 15, fontWeight: '600' },
});

export default CheckoutScreen;
