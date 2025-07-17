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
import DiscoverScreen from './src/screens/DiscoverScreen';
import DealsScreen from './src/screens/DealsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import MapScreen from './src/screens/MapScreen';
import BusinessDetailScreen from './src/screens/BusinessDetailScreen';
import LoginScreen from './src/screens/LoginScreen';

// Context
import { UserProvider } from './src/context/UserContext';
import { LocationProvider } from './src/context/LocationContext';
import { NotificationProvider } from './src/context/NotificationContext';

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
          } else if (route.name === 'Discover') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Deals') {
            iconName = focused ? 'pricetag' : 'pricetag-outline';
          } else if (route.name === 'Map') {
            iconName = focused ? 'map' : 'map-outline';
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
        name="Discover" 
        component={DiscoverScreen}
        options={{ title: 'Discover' }}
      />
      <Tab.Screen 
        name="Deals" 
        component={DealsScreen}
        options={{ title: 'Deals' }}
      />
      <Tab.Screen 
        name="Map" 
        component={MapScreen}
        options={{ title: 'Map' }}
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
                      name="BusinessDetail"
                      component={BusinessDetailScreen}
                      options={{
                        title: 'Business Details',
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
          </NotificationProvider>
        </LocationProvider>
      </UserProvider>
    </SafeAreaProvider>
  );
}

export default App;