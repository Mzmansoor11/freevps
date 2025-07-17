import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../utils/theme';
import { useCart } from '../context/CartContext';

const CartScreen = ({ navigation }) => {
  const { items, getCartTotal, updateQuantity, removeItem, clearCart } = useCart();

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.image || 'https://via.placeholder.com/60x60' }} style={styles.itemImage} />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemVendor}>{item.vendorName}</Text>
        <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
      </View>
      <View style={styles.quantityControls}>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => updateQuantity(item.id, item.quantity - 1, item.options)}
        >
          <Ionicons name="remove" size={16} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text style={styles.quantity}>{item.quantity}</Text>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => updateQuantity(item.id, item.quantity + 1, item.options)}
        >
          <Ionicons name="add" size={16} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeItem(item.id, item.options)}
      >
        <Ionicons name="trash" size={16} color={theme.colors.error} />
      </TouchableOpacity>
    </View>
  );

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Ionicons name="bag-outline" size={80} color={theme.colors.gray} />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>Add items from vendors to get started</Text>
          <TouchableOpacity
            style={styles.browseButton}
            onPress={() => navigation.navigate('Vendors')}
          >
            <Text style={styles.browseButtonText}>Browse Vendors</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Cart ({items.length} items)</Text>
        <TouchableOpacity onPress={clearCart}>
          <Text style={styles.clearText}>Clear</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={items}
        renderItem={renderCartItem}
        keyExtractor={(item) => `${item.id}-${JSON.stringify(item.options)}`}
        style={styles.cartList}
      />

      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalAmount}>${getCartTotal().toFixed(2)}</Text>
        </View>
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={() => navigation.navigate('Checkout')}
        >
          <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.white,
    ...theme.shadows.small,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  clearText: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  cartList: {
    flex: 1,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    marginHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.xs,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.small,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: theme.borderRadius.md,
  },
  itemInfo: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  itemVendor: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: theme.spacing.md,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  quantity: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginHorizontal: theme.spacing.md,
    minWidth: 30,
    textAlign: 'center',
  },
  removeButton: {
    padding: theme.spacing.sm,
  },
  footer: {
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
    ...theme.shadows.large,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  checkoutButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  emptySubtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  browseButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
  },
  browseButtonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CartScreen;