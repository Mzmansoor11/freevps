import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../utils/theme';
import { useOrder, ORDER_STATUS } from '../context/OrderContext';

const money = (amount) => `R${Number(amount || 0).toFixed(2)}`;

const statusDetails = {
  [ORDER_STATUS.PENDING]: { label: 'Pending', icon: 'time-outline' },
  [ORDER_STATUS.CONFIRMED]: { label: 'Confirmed', icon: 'checkmark-circle-outline' },
  [ORDER_STATUS.PREPARING]: { label: 'Preparing', icon: 'restaurant-outline' },
  [ORDER_STATUS.READY_FOR_PICKUP]: { label: 'Ready for pickup', icon: 'bag-check-outline' },
  [ORDER_STATUS.OUT_FOR_DELIVERY]: { label: 'Out for delivery', icon: 'bicycle-outline' },
  [ORDER_STATUS.DELIVERED]: { label: 'Delivered', icon: 'checkmark-done-circle-outline' },
  [ORDER_STATUS.CANCELLED]: { label: 'Cancelled', icon: 'close-circle-outline' },
};

const OrdersScreen = () => {
  const { getOrderHistory, loading } = useOrder();
  const orders = getOrderHistory();

  const renderOrder = ({ item }) => {
    const status = statusDetails[item.status] || statusDetails[ORDER_STATUS.PENDING];
    const date = item.createdAt ? new Date(item.createdAt).toLocaleString() : 'Date unavailable';
    const itemCount = Array.isArray(item.items)
      ? item.items.reduce((sum, product) => sum + Number(product.quantity || 0), 0)
      : 0;

    return (
      <View style={styles.orderCard}>
        <View style={styles.orderTopRow}>
          <View style={styles.orderHeading}>
            <Text style={styles.orderId}>Order #{String(item.id || '').slice(-8)}</Text>
            <Text style={styles.date}>{date}</Text>
          </View>
          <View style={styles.statusPill}>
            <Ionicons name={status.icon} size={15} color={theme.colors.primary} />
            <Text style={styles.statusText}>{status.label}</Text>
          </View>
        </View>
        <Text style={styles.vendorName}>{item.vendor?.name || item.vendorName || 'Mzansi Cart vendor'}</Text>
        <Text style={styles.itemSummary}>{itemCount} item{itemCount === 1 ? '' : 's'}</Text>
        {Array.isArray(item.items) && item.items.slice(0, 3).map((product, index) => (
          <View key={product.id ? String(product.id) : String(index)} style={styles.productRow}>
            <Text style={styles.productName}>{product.name || 'Product'} × {product.quantity || 1}</Text>
            <Text style={styles.productPrice}>{money(Number(product.price || 0) * Number(product.quantity || 1))}</Text>
          </View>
        ))}
        {Array.isArray(item.items) && item.items.length > 3 && (
          <Text style={styles.moreItems}>+ {item.items.length - 3} more item(s)</Text>
        )}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Order total</Text>
          <Text style={styles.totalAmount}>{money(item.totalPrice ?? item.total ?? 0)}</Text>
        </View>
        <Text style={styles.demoNote}>Order history stored on this device. Vendor updates are not connected yet.</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={(item, index) => String(item.id || index)}
        renderItem={renderOrder}
        contentContainerStyle={[styles.content, orders.length === 0 && styles.emptyContent]}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Order History</Text>
            <Text style={styles.subtitle}>View your current and previous orders.</Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={54} color={theme.colors.gray} />
            <Text style={styles.emptyTitle}>{loading ? 'Loading orders…' : 'No orders yet'}</Text>
            <Text style={styles.emptyText}>When you place an order, it will appear here with its status and order details.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: theme.spacing.md, paddingBottom: theme.spacing.xl },
  emptyContent: { flexGrow: 1 },
  header: { marginBottom: theme.spacing.md },
  title: { fontSize: 24, fontWeight: 'bold', color: theme.colors.text, marginBottom: theme.spacing.xs },
  subtitle: { fontSize: 15, color: theme.colors.textSecondary },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: theme.spacing.lg, paddingVertical: theme.spacing.xl },
  emptyTitle: { fontSize: 19, fontWeight: 'bold', color: theme.colors.text, marginTop: theme.spacing.md },
  emptyText: { fontSize: 14, color: theme.colors.textSecondary, textAlign: 'center', lineHeight: 21, marginTop: theme.spacing.sm },
  orderCard: { backgroundColor: theme.colors.white, borderRadius: theme.borderRadius.lg, padding: theme.spacing.md, marginBottom: theme.spacing.md, ...theme.shadows.small },
  orderTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: theme.spacing.sm },
  orderHeading: { flex: 1, paddingRight: theme.spacing.sm },
  orderId: { fontSize: 16, fontWeight: 'bold', color: theme.colors.text },
  date: { fontSize: 12, color: theme.colors.textSecondary, marginTop: 4 },
  statusPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.background, borderRadius: 16, paddingHorizontal: 9, paddingVertical: 6 },
  statusText: { fontSize: 12, color: theme.colors.primary, fontWeight: '600', marginLeft: 4 },
  vendorName: { fontSize: 15, fontWeight: '600', color: theme.colors.text, marginBottom: 3 },
  itemSummary: { fontSize: 12, color: theme.colors.textSecondary, marginBottom: theme.spacing.sm },
  productRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 },
  productName: { flex: 1, fontSize: 13, color: theme.colors.text },
  productPrice: { fontSize: 13, color: theme.colors.text },
  moreItems: { fontSize: 12, color: theme.colors.textSecondary, marginTop: 3 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: theme.colors.lightGray, marginTop: theme.spacing.sm, paddingTop: theme.spacing.sm },
  totalLabel: { fontSize: 14, fontWeight: '600', color: theme.colors.text },
  totalAmount: { fontSize: 16, fontWeight: 'bold', color: theme.colors.primary },
  demoNote: { fontSize: 11, color: theme.colors.textSecondary, marginTop: theme.spacing.sm },
});

export default OrdersScreen;
