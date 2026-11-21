import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../utils/theme';
import { useCart } from '../context/CartContext';

const money = (amount) => `R${Number(amount || 0).toFixed(2)}`;

const CheckoutScreen = ({ navigation }) => {
  const { items, totalPrice, deliveryFee, serviceFee, tax, getCartTotal } = useCart();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Review your order</Text>
        <Text style={styles.subtitle}>Check your items and estimated total before payment.</Text>

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
          <Text style={styles.noticeText}>Demo checkout: online payments are not connected yet. No money will be charged.</Text>
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
  backButton: { backgroundColor: theme.colors.primary, padding: theme.spacing.md, borderRadius: theme.borderRadius.lg, alignItems: 'center', marginBottom: theme.spacing.sm },
  backButtonText: { color: theme.colors.white, fontSize: 16, fontWeight: 'bold' },
  disabledButton: { backgroundColor: theme.colors.lightGray, padding: theme.spacing.md, borderRadius: theme.borderRadius.lg, alignItems: 'center' },
  disabledButtonText: { color: theme.colors.textSecondary, fontSize: 15, fontWeight: '600' },
});

export default CheckoutScreen;
