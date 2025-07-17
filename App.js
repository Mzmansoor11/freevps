import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import VendorsScreen from './src/screens/VendorsScreen';
import CartScreen from './src/screens/CartScreen';
import OrdersScreen from './src/screens/OrdersScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import VendorDetailScreen from './src/screens/VendorDetailScreen';
import ProductDetailScreen from './src/screens/ProductDetailScreen';
import CheckoutScreen from './src/screens/CheckoutScreen';
import OrderTrackingScreen from './src/screens/OrderTrackingScreen';
import LoginScreen from './src/screens/LoginScreen';
import SearchScreen from './src/screens/SearchScreen';

// Context
import { UserProvider } from './src/context/UserContext';
import { LocationProvider } from './src/context/LocationContext';
import { NotificationProvider } from './src/context/NotificationContext';
import { CartProvider } from './src/context/CartContext';
import { OrderProvider } from './src/context/OrderContext';

// Theme
import { theme } from './src/utils/theme';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Vendors') {
            iconName = focused ? 'storefront' : 'storefront-outline';
          } else if (route.name === 'Cart') {
            iconName = focused ? 'bag' : 'bag-outline';
          } else if (route.name === 'Orders') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.gray,
        tabBarStyle: {
          backgroundColor: theme.colors.white,
          borderTopWidth: 1,
          borderTopColor: theme.colors.lightGray,
          paddingBottom: 5,
          height: 90,
        },
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: theme.colors.white,
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: 'Ubazol' }}
      />
      <Tab.Screen 
        name="Vendors" 
        component={VendorsScreen}
        options={{ title: 'Vendors' }}
      />
      <Tab.Screen 
        name="Cart" 
        component={CartScreen}
        options={{ 
          title: 'Cart',
          tabBarBadge: 3, // Will be dynamic based on cart items
        }}
      />
      <Tab.Screen 
        name="Orders" 
        component={OrdersScreen}
        options={{ title: 'My Orders' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Set to true for development

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    // Request location permission
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access location was denied');
    }

    // Request notification permission
    const { status: notificationStatus } = await Notifications.requestPermissionsAsync();
    if (notificationStatus !== 'granted') {
      alert('Permission to send notifications was denied');
    }
  };

  return (
    <SafeAreaProvider>
      <UserProvider>
        <LocationProvider>
          <NotificationProvider>
            <CartProvider>
              <OrderProvider>
                <NavigationContainer>
                  <StatusBar style="light" backgroundColor={theme.colors.primary} />
                  <Stack.Navigator>
                    {!isLoggedIn ? (
                      <Stack.Screen
                        name="Login"
                        component={LoginScreen}
                        options={{ headerShown: false }}
                      />
                    ) : (
                      <>
                        <Stack.Screen
                          name="MainTabs"
                          component={MainTabs}
                          options={{ headerShown: false }}
                        />
                        <Stack.Screen
                          name="VendorDetail"
                          component={VendorDetailScreen}
                          options={{
                            title: 'Vendor Details',
                            headerStyle: {
                              backgroundColor: theme.colors.primary,
                            },
                            headerTintColor: theme.colors.white,
                          }}
                        />
                        <Stack.Screen
                          name="ProductDetail"
                          component={ProductDetailScreen}
                          options={{
                            title: 'Product Details',
                            headerStyle: {
                              backgroundColor: theme.colors.primary,
                            },
                            headerTintColor: theme.colors.white,
                          }}
                        />
                        <Stack.Screen
                          name="Checkout"
                          component={CheckoutScreen}
                          options={{
                            title: 'Checkout',
                            headerStyle: {
                              backgroundColor: theme.colors.primary,
                            },
                            headerTintColor: theme.colors.white,
                          }}
                        />
                        <Stack.Screen
                          name="OrderTracking"
                          component={OrderTrackingScreen}
                          options={{
                            title: 'Track Order',
                            headerStyle: {
                              backgroundColor: theme.colors.primary,
                            },
                            headerTintColor: theme.colors.white,
                          }}
                        />
                        <Stack.Screen
                          name="Search"
                          component={SearchScreen}
                          options={{
                            title: 'Search',
                            headerStyle: {
                              backgroundColor: theme.colors.primary,
                            },
                            headerTintColor: theme.colors.white,
                          }}
                        />
                      </>
                    )}
                  </Stack.Navigator>
                </NavigationContainer>
              </OrderProvider>
            </CartProvider>
          </NotificationProvider>
        </LocationProvider>
      </UserProvider>
    </SafeAreaProvider>
  );
}

export default App;