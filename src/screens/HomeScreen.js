import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../utils/theme';
import { useUser } from '../context/UserContext';
import { useLocation } from '../context/LocationContext';
import { useOrder } from '../context/OrderContext';
import { useCart } from '../context/CartContext';

// Sample data - would come from API in real app
const categories = [
  { id: '1', name: 'Restaurants', icon: 'restaurant', color: '#FF6B6B' },
  { id: '2', name: 'Grocery', icon: 'basket', color: '#4ECDC4' },
  { id: '3', name: 'Pharmacy', icon: 'medical', color: '#45B7D1' },
  { id: '4', name: 'Electronics', icon: 'phone-portrait', color: '#FFA07A' },
  { id: '5', name: 'Fashion', icon: 'shirt', color: '#98D8C8' },
  { id: '6', name: 'Books', icon: 'book', color: '#F06292' },
];

const featuredVendors = [
  {
    id: '1',
    name: 'Pizza Palace',
    rating: 4.5,
    deliveryTime: '25-35 min',
    deliveryFee: 2.99,
    image: 'https://via.placeholder.com/200x120/FF6B6B/FFFFFF?text=Pizza+Palace',
    cuisine: 'Italian',
    category: 'Restaurants',
  },
  {
    id: '2',
    name: 'Fresh Market',
    rating: 4.7,
    deliveryTime: '15-25 min',
    deliveryFee: 1.99,
    image: 'https://via.placeholder.com/200x120/4ECDC4/FFFFFF?text=Fresh+Market',
    cuisine: 'Grocery',
    category: 'Grocery',
  },
  {
    id: '3',
    name: 'Tech Store',
    rating: 4.3,
    deliveryTime: '45-60 min',
    deliveryFee: 4.99,
    image: 'https://via.placeholder.com/200x120/FFA07A/FFFFFF?text=Tech+Store',
    cuisine: 'Electronics',
    category: 'Electronics',
  },
];

const HomeScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useUser();
  const { deliveryAddress, getCurrentLocation } = useLocation();
  const { getActiveOrders } = useOrder();
  const { getItemCount } = useCart();

  const activeOrders = getActiveOrders();
  const cartItemCount = getItemCount();

  useEffect(() => {
    // Update cart badge
    navigation.setOptions({
      tabBarBadge: cartItemCount > 0 ? cartItemCount : null,
    });
  }, [cartItemCount, navigation]);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate data refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const handleLocationPress = async () => {
    try {
      await getCurrentLocation();
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => navigation.navigate('Vendors', { category: item.name })}
    >
      <View style={[styles.categoryIcon, { backgroundColor: item.color }]}>
        <Ionicons name={item.icon} size={24} color={theme.colors.white} />
      </View>
      <Text style={styles.categoryText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderVendor = ({ item }) => (
    <TouchableOpacity
      style={styles.vendorCard}
      onPress={() => navigation.navigate('VendorDetail', { vendor: item })}
    >
      <Image source={{ uri: item.image }} style={styles.vendorImage} />
      <View style={styles.vendorInfo}>
        <Text style={styles.vendorName}>{item.name}</Text>
        <Text style={styles.vendorCuisine}>{item.cuisine}</Text>
        <View style={styles.vendorMeta}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={12} color={theme.colors.accent} />
            <Text style={styles.rating}>{item.rating}</Text>
          </View>
          <Text style={styles.deliveryTime}>{item.deliveryTime}</Text>
          <Text style={styles.deliveryFee}>${item.deliveryFee} delivery</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderActiveOrder = (order) => (
    <TouchableOpacity
      key={order.id}
      style={styles.activeOrderCard}
      onPress={() => navigation.navigate('OrderTracking', { orderId: order.id })}
    >
      <View style={styles.orderInfo}>
        <Text style={styles.orderVendor}>{order.vendor?.name}</Text>
        <Text style={styles.orderStatus}>{order.status.replace('_', ' ').toUpperCase()}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={theme.colors.gray} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.locationButton} onPress={handleLocationPress}>
            <Ionicons name="location" size={20} color={theme.colors.primary} />
            <View style={styles.locationText}>
              <Text style={styles.locationLabel}>Deliver to</Text>
              <Text style={styles.locationAddress} numberOfLines={1}>
                {deliveryAddress?.address || 'Set delivery address'}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => navigation.navigate('Search')}
          >
            <Ionicons name="search" size={20} color={theme.colors.gray} />
          </TouchableOpacity>
        </View>

        {/* Greeting */}
        <View style={styles.greetingContainer}>
          <Text style={styles.greeting}>Hello, {user?.name || 'there'}! 👋</Text>
          <Text style={styles.subGreeting}>What would you like to order today?</Text>
        </View>

        {/* Search Bar */}
        <TouchableOpacity
          style={styles.searchBar}
          onPress={() => navigation.navigate('Search')}
        >
          <Ionicons name="search" size={20} color={theme.colors.gray} />
          <Text style={styles.searchPlaceholder}>Search for vendors, products...</Text>
        </TouchableOpacity>

        {/* Active Orders */}
        {activeOrders.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Active Orders</Text>
            {activeOrders.map(renderActiveOrder)}
          </View>
        )}

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <FlatList
            data={categories}
            renderItem={renderCategory}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

        {/* Featured Vendors */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Vendors</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Vendors')}>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={featuredVendors}
            renderItem={renderVendor}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.vendorsList}
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => navigation.navigate('Orders')}
            >
              <Ionicons name="list" size={24} color={theme.colors.primary} />
              <Text style={styles.quickActionText}>Order History</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => navigation.navigate('Cart')}
            >
              <Ionicons name="bag" size={24} color={theme.colors.primary} />
              <Text style={styles.quickActionText}>View Cart</Text>
              {cartItemCount > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{cartItemCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.white,
    ...theme.shadows.small,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationText: {
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  locationLabel: {
    fontSize: 12,
    color: theme.colors.gray,
  },
  locationAddress: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
  },
  searchButton: {
    padding: theme.spacing.sm,
  },
  greetingContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subGreeting: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.small,
  },
  searchPlaceholder: {
    marginLeft: theme.spacing.sm,
    color: theme.colors.gray,
    fontSize: 16,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  seeAllText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  categoriesList: {
    paddingHorizontal: theme.spacing.md,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: theme.spacing.md,
    width: 80,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
  },
  categoryText: {
    fontSize: 12,
    color: theme.colors.text,
    textAlign: 'center',
  },
  vendorsList: {
    paddingHorizontal: theme.spacing.md,
  },
  vendorCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    marginRight: theme.spacing.md,
    width: 200,
    ...theme.shadows.medium,
  },
  vendorImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
  },
  vendorInfo: {
    padding: theme.spacing.md,
  },
  vendorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  vendorCuisine: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  vendorMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  rating: {
    fontSize: 12,
    color: theme.colors.text,
    marginLeft: theme.spacing.xs,
  },
  deliveryTime: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginRight: theme.spacing.sm,
  },
  deliveryFee: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  activeOrderCard: {
    backgroundColor: theme.colors.white,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...theme.shadows.small,
  },
  orderInfo: {
    flex: 1,
  },
  orderVendor: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  orderStatus: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.md,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: theme.colors.white,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    marginRight: theme.spacing.md,
    ...theme.shadows.small,
    position: 'relative',
  },
  quickActionText: {
    marginTop: theme.spacing.sm,
    fontSize: 14,
    color: theme.colors.text,
    fontWeight: '500',
  },
  cartBadge: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    backgroundColor: theme.colors.accent,
    borderRadius: theme.borderRadius.full,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    color: theme.colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default HomeScreen;