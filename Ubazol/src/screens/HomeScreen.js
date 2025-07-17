import React, { useContext, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Dimensions,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UserContext } from '../context/UserContext';
import { LocationContext } from '../context/LocationContext';
import { theme } from '../utils/theme';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const { user } = useContext(UserContext);
  const { address } = useContext(LocationContext);

  const categories = [
    { id: 1, name: 'Pizza', icon: '🍕', color: '#FF6B6B' },
    { id: 2, name: 'Burgers', icon: '🍔', color: '#4ECDC4' },
    { id: 3, name: 'Sushi', icon: '🍣', color: '#45B7D1' },
    { id: 4, name: 'Mexican', icon: '🌮', color: '#FFA07A' },
    { id: 5, name: 'Chinese', icon: '🥢', color: '#98D8C8' },
    { id: 6, name: 'Indian', icon: '🍛', color: '#F7DC6F' },
  ];

  const featuredVendors = [
    {
      id: 1,
      name: 'Pizza Palace',
      cuisine: 'Italian',
      rating: 4.8,
      deliveryTime: '25-35 min',
      deliveryFee: 2.99,
      image: 'https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=Pizza+Palace'
    },
    {
      id: 2,
      name: 'Burger Barn',
      cuisine: 'American',
      rating: 4.6,
      deliveryTime: '20-30 min',
      deliveryFee: 1.99,
      image: 'https://via.placeholder.com/300x200/4ECDC4/FFFFFF?text=Burger+Barn'
    },
    {
      id: 3,
      name: 'Sushi Spot',
      cuisine: 'Japanese',
      rating: 4.9,
      deliveryTime: '30-40 min',
      deliveryFee: 3.99,
      image: 'https://via.placeholder.com/300x200/45B7D1/FFFFFF?text=Sushi+Spot'
    }
  ];

  const handleAdminAccess = () => {
    Alert.alert(
      'Admin Access',
      'Access the administration panel',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Login as Admin',
          onPress: () => navigation.navigate('AdminLogin')
        }
      ]
    );
  };

  const CategoryCard = ({ category }) => (
    <TouchableOpacity 
      style={[styles.categoryCard, { backgroundColor: category.color }]}
      onPress={() => Alert.alert('Feature', `${category.name} category coming soon!`)}
    >
      <Text style={styles.categoryIcon}>{category.icon}</Text>
      <Text style={styles.categoryName}>{category.name}</Text>
    </TouchableOpacity>
  );

  const VendorCard = ({ vendor }) => (
    <TouchableOpacity 
      style={styles.vendorCard}
      onPress={() => Alert.alert('Feature', `${vendor.name} menu coming soon!`)}
    >
      <Image source={{ uri: vendor.image }} style={styles.vendorImage} />
      <View style={styles.vendorInfo}>
        <Text style={styles.vendorName}>{vendor.name}</Text>
        <Text style={styles.vendorCuisine}>{vendor.cuisine}</Text>
        <View style={styles.vendorDetails}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.rating}>{vendor.rating}</Text>
          </View>
          <Text style={styles.deliveryTime}>{vendor.deliveryTime}</Text>
          <Text style={styles.deliveryFee}>${vendor.deliveryFee} delivery</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={20} color={theme.colors.primary} />
            <Text style={styles.locationText}>
              {address || 'Select delivery location'}
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.adminButton}
            onPress={handleAdminAccess}
          >
            <Ionicons name="settings-outline" size={20} color={theme.colors.primary} />
            <Text style={styles.adminButtonText}>Admin</Text>
          </TouchableOpacity>
        </View>

        {/* Greeting */}
        <View style={styles.greetingContainer}>
          <Text style={styles.greetingText}>
            Hello {user?.name ? user.name.split(' ')[0] : 'there'}! 👋
          </Text>
          <Text style={styles.subGreetingText}>
            What would you like to eat today?
          </Text>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesContainer}
          >
            {categories.map(category => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </ScrollView>
        </View>

        {/* Featured Vendors */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Restaurants</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Vendors')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          {featuredVendors.map(vendor => (
            <VendorCard key={vendor.id} vendor={vendor} />
          ))}
        </View>

        {/* Promotional Banner */}
        <View style={styles.promoContainer}>
          <View style={styles.promoBanner}>
            <Text style={styles.promoTitle}>Free Delivery</Text>
            <Text style={styles.promoSubtitle}>On orders over $25</Text>
            <TouchableOpacity style={styles.promoButton}>
              <Text style={styles.promoButtonText}>Order Now</Text>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationText: {
    marginLeft: theme.spacing.xs,
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: '500',
  },
  adminButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  adminButtonText: {
    marginLeft: theme.spacing.xs,
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  greetingContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
  },
  greetingText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subGreetingText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  seeAllText: {
    fontSize: 16,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  categoriesContainer: {
    paddingLeft: theme.spacing.lg,
  },
  categoryCard: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
    ...theme.shadows.sm,
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: theme.spacing.xs,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.white,
    textAlign: 'center',
  },
  vendorCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    overflow: 'hidden',
    ...theme.shadows.md,
  },
  vendorImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  vendorInfo: {
    padding: theme.spacing.md,
  },
  vendorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  vendorCuisine: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  vendorDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    marginLeft: theme.spacing.xs,
  },
  deliveryTime: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginRight: theme.spacing.md,
  },
  deliveryFee: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  promoContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  promoBanner: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    alignItems: 'center',
    ...theme.shadows.md,
  },
  promoTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.white,
    marginBottom: theme.spacing.xs,
  },
  promoSubtitle: {
    fontSize: 16,
    color: theme.colors.white,
    marginBottom: theme.spacing.md,
  },
  promoButton: {
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  promoButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.primary,
  },
});

export default HomeScreen;