import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import { theme } from '../utils/theme';

// Temporary demonstration catalogue. Replace with verified vendor inventory before launch.
const demoProducts = {
  '1': [
    { id: 'pizza-1', name: 'Margherita Pizza', description: 'Tomato, mozzarella and basil', price: 99.00 },
    { id: 'pizza-2', name: 'Chicken Peri-Peri Pizza', description: 'Chicken, peri-peri sauce and cheese', price: 119.00 },
    { id: 'pizza-3', name: 'BBQ Chicken Pizza', description: 'BBQ chicken, onion and mozzarella', price: 125.00 },
    { id: 'pizza-4', name: 'Garlic Bread', description: 'Toasted garlic bread', price: 39.00 },
  ],
  '2': [
    { id: 'grocery-1', name: 'Fresh Milk 2L', description: 'Full cream milk', price: 34.99 },
    { id: 'grocery-2', name: 'Brown Bread', description: 'Freshly baked loaf', price: 18.99 },
    { id: 'grocery-3', name: 'Bananas 1kg', description: 'Fresh bananas', price: 24.99 },
    { id: 'grocery-4', name: 'Eggs 18 Pack', description: 'Large eggs', price: 59.99 },
  ],
  '3': [
    { id: 'tech-1', name: 'USB-C Charging Cable', description: '1 metre charging cable', price: 89.00 },
    { id: 'tech-2', name: 'Wireless Earphones', description: 'Bluetooth earphones', price: 249.00 },
  ],
};

const VendorDetailScreen = ({ route, navigation }) => {
  const vendor = route?.params?.vendor || {
    id: '1',
    name: 'Featured Vendor',
    category: 'Marketplace',
    cuisine: 'Local business',
    rating: 0,
    deliveryTime: 'To be confirmed',
    deliveryFee: 0,
  };
  const { addItem } = useCart();
  const products = useMemo(
    () => demoProducts[String(vendor.id)] || [
      { id: `demo-${vendor.id}-1`, name: 'Sample product', description: 'Demo listing — vendor stock to be confirmed', price: 49.00 },
    ],
    [vendor.id]
  );

  const handleAddToCart = async (product) => {
    const result = await addItem({
      ...product,
      vendorId: vendor.id,
      vendorName: vendor.name,
      vendorImage: vendor.image,
      image: vendor.image,
    });
    if (result.success) {
      Alert.alert('Added to cart', `${product.name} was added to your cart.`, [
        { text: 'Continue shopping', style: 'cancel' },
        { text: 'View cart', onPress: () => navigation.navigate('MainTabs', { screen: 'Cart' }) },
      ]);
    } else {
      Alert.alert('Unable to add item', result.error || 'Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.vendorHeader}>
          {vendor.image ? (
            <Image source={{ uri: vendor.image }} style={styles.vendorImage} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="storefront" size={42} color={theme.colors.primary} />
            </View>
          )}
          <Text style={styles.vendorName}>{vendor.name}</Text>
          <Text style={styles.vendorCategory}>{vendor.cuisine || vendor.category || 'Local vendor'}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaText}>★ {vendor.rating || 'New'}</Text>
            <Text style={styles.metaText}>{vendor.deliveryTime || 'Delivery time to be confirmed'}</Text>
            <Text style={styles.metaText}>
              {typeof vendor.deliveryFee === 'number' ? `R${vendor.deliveryFee.toFixed(2)} delivery` : 'Delivery fee to be confirmed'}
            </Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Menu & Products</Text>
          <Text style={styles.sectionSubtitle}>Demo catalogue — prices and availability are not yet confirmed by vendors.</Text>
        </View>

        {products.map((product) => (
          <View key={product.id} style={styles.productCard}>
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productDescription}>{product.description}</Text>
              <Text style={styles.productPrice}>R{product.price.toFixed(2)}</Text>
            </View>
            <TouchableOpacity
              accessibilityRole="button"
              style={styles.addButton}
              onPress={() => handleAddToCart(product)}
            >
              <Ionicons name="add" size={18} color={theme.colors.white} />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: theme.spacing.md, paddingBottom: theme.spacing.xxl },
  vendorHeader: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    ...theme.shadows.small,
  },
  vendorImage: { width: '100%', height: 145, borderRadius: theme.borderRadius.md, marginBottom: theme.spacing.md },
  imagePlaceholder: {
    width: 82, height: 82, borderRadius: 41, backgroundColor: '#E8F0EB',
    alignItems: 'center', justifyContent: 'center', marginBottom: theme.spacing.md,
  },
  vendorName: { fontSize: 22, fontWeight: 'bold', color: theme.colors.text },
  vendorCategory: { fontSize: 14, color: theme.colors.textSecondary, marginTop: 4 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: theme.spacing.md },
  metaText: { fontSize: 12, color: theme.colors.textSecondary, marginHorizontal: 5, marginTop: 3 },
  sectionHeader: { marginBottom: theme.spacing.md },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: theme.colors.text },
  sectionSubtitle: { fontSize: 12, lineHeight: 18, color: theme.colors.textSecondary, marginTop: 5 },
  productCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    ...theme.shadows.small,
  },
  productInfo: { flex: 1, paddingRight: theme.spacing.sm },
  productName: { fontSize: 16, fontWeight: '700', color: theme.colors.text },
  productDescription: { fontSize: 13, color: theme.colors.textSecondary, marginTop: 4 },
  productPrice: { fontSize: 15, fontWeight: '700', color: theme.colors.primary, marginTop: 8 },
  addButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    minHeight: 40,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: { color: theme.colors.white, fontWeight: '700', marginLeft: 3 },
});

export default VendorDetailScreen;
