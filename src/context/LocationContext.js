import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';

// Initial state
const initialState = {
  currentLocation: null,
  deliveryAddress: null,
  savedAddresses: [],
  locationPermission: null,
  loading: false,
  error: null,
};

// Action types
const LOCATION_ACTION_TYPES = {
  SET_LOADING: 'SET_LOADING',
  SET_CURRENT_LOCATION: 'SET_CURRENT_LOCATION',
  SET_DELIVERY_ADDRESS: 'SET_DELIVERY_ADDRESS',
  ADD_SAVED_ADDRESS: 'ADD_SAVED_ADDRESS',
  REMOVE_SAVED_ADDRESS: 'REMOVE_SAVED_ADDRESS',
  UPDATE_SAVED_ADDRESS: 'UPDATE_SAVED_ADDRESS',
  LOAD_SAVED_ADDRESSES: 'LOAD_SAVED_ADDRESSES',
  SET_LOCATION_PERMISSION: 'SET_LOCATION_PERMISSION',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

// Reducer
const locationReducer = (state, action) => {
  switch (action.type) {
    case LOCATION_ACTION_TYPES.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };

    case LOCATION_ACTION_TYPES.SET_CURRENT_LOCATION:
      return {
        ...state,
        currentLocation: action.payload,
        loading: false,
      };

    case LOCATION_ACTION_TYPES.SET_DELIVERY_ADDRESS:
      return {
        ...state,
        deliveryAddress: action.payload,
      };

    case LOCATION_ACTION_TYPES.ADD_SAVED_ADDRESS:
      return {
        ...state,
        savedAddresses: [...state.savedAddresses, action.payload],
      };

    case LOCATION_ACTION_TYPES.REMOVE_SAVED_ADDRESS:
      return {
        ...state,
        savedAddresses: state.savedAddresses.filter(addr => addr.id !== action.payload),
      };

    case LOCATION_ACTION_TYPES.UPDATE_SAVED_ADDRESS:
      return {
        ...state,
        savedAddresses: state.savedAddresses.map(addr =>
          addr.id === action.payload.id ? { ...addr, ...action.payload } : addr
        ),
      };

    case LOCATION_ACTION_TYPES.LOAD_SAVED_ADDRESSES:
      return {
        ...state,
        savedAddresses: action.payload,
      };

    case LOCATION_ACTION_TYPES.SET_LOCATION_PERMISSION:
      return {
        ...state,
        locationPermission: action.payload,
      };

    case LOCATION_ACTION_TYPES.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case LOCATION_ACTION_TYPES.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

// Create context
const LocationContext = createContext();

// Provider component
export const LocationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(locationReducer, initialState);

  // Load saved addresses on app start
  useEffect(() => {
    loadSavedAddresses();
    checkLocationPermission();
  }, []);

  const loadSavedAddresses = async () => {
    try {
      const savedAddresses = await AsyncStorage.getItem('savedAddresses');
      const deliveryAddress = await AsyncStorage.getItem('deliveryAddress');
      
      if (savedAddresses) {
        dispatch({ 
          type: LOCATION_ACTION_TYPES.LOAD_SAVED_ADDRESSES, 
          payload: JSON.parse(savedAddresses) 
        });
      }

      if (deliveryAddress) {
        dispatch({ 
          type: LOCATION_ACTION_TYPES.SET_DELIVERY_ADDRESS, 
          payload: JSON.parse(deliveryAddress) 
        });
      }
    } catch (error) {
      console.error('Error loading saved addresses:', error);
    }
  };

  const checkLocationPermission = async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      dispatch({ 
        type: LOCATION_ACTION_TYPES.SET_LOCATION_PERMISSION, 
        payload: status 
      });
    } catch (error) {
      console.error('Error checking location permission:', error);
    }
  };

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      dispatch({ 
        type: LOCATION_ACTION_TYPES.SET_LOCATION_PERMISSION, 
        payload: status 
      });
      return status === 'granted';
    } catch (error) {
      dispatch({ type: LOCATION_ACTION_TYPES.SET_ERROR, payload: error.message });
      return false;
    }
  };

  const getCurrentLocation = async () => {
    try {
      dispatch({ type: LOCATION_ACTION_TYPES.SET_LOADING, payload: true });

      // Check permission first
      if (state.locationPermission !== 'granted') {
        const granted = await requestLocationPermission();
        if (!granted) {
          throw new Error('Location permission denied');
        }
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      // Reverse geocode to get address
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      const currentLocation = {
        coordinates: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
        address: reverseGeocode[0] || null,
        timestamp: new Date().toISOString(),
      };

      dispatch({ 
        type: LOCATION_ACTION_TYPES.SET_CURRENT_LOCATION, 
        payload: currentLocation 
      });

      return currentLocation;
    } catch (error) {
      dispatch({ type: LOCATION_ACTION_TYPES.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const setDeliveryAddress = async (address) => {
    try {
      await AsyncStorage.setItem('deliveryAddress', JSON.stringify(address));
      dispatch({ 
        type: LOCATION_ACTION_TYPES.SET_DELIVERY_ADDRESS, 
        payload: address 
      });
    } catch (error) {
      dispatch({ type: LOCATION_ACTION_TYPES.SET_ERROR, payload: error.message });
    }
  };

  const addSavedAddress = async (address) => {
    try {
      const newAddress = {
        id: Date.now().toString(),
        ...address,
        createdAt: new Date().toISOString(),
      };

      const updatedAddresses = [...state.savedAddresses, newAddress];
      await AsyncStorage.setItem('savedAddresses', JSON.stringify(updatedAddresses));
      
      dispatch({ 
        type: LOCATION_ACTION_TYPES.ADD_SAVED_ADDRESS, 
        payload: newAddress 
      });

      return newAddress;
    } catch (error) {
      dispatch({ type: LOCATION_ACTION_TYPES.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const removeSavedAddress = async (addressId) => {
    try {
      const updatedAddresses = state.savedAddresses.filter(addr => addr.id !== addressId);
      await AsyncStorage.setItem('savedAddresses', JSON.stringify(updatedAddresses));
      
      dispatch({ 
        type: LOCATION_ACTION_TYPES.REMOVE_SAVED_ADDRESS, 
        payload: addressId 
      });
    } catch (error) {
      dispatch({ type: LOCATION_ACTION_TYPES.SET_ERROR, payload: error.message });
    }
  };

  const updateSavedAddress = async (addressId, updates) => {
    try {
      const updatedAddress = { id: addressId, ...updates };
      const updatedAddresses = state.savedAddresses.map(addr =>
        addr.id === addressId ? { ...addr, ...updates } : addr
      );
      
      await AsyncStorage.setItem('savedAddresses', JSON.stringify(updatedAddresses));
      
      dispatch({ 
        type: LOCATION_ACTION_TYPES.UPDATE_SAVED_ADDRESS, 
        payload: updatedAddress 
      });
    } catch (error) {
      dispatch({ type: LOCATION_ACTION_TYPES.SET_ERROR, payload: error.message });
    }
  };

  const geocodeAddress = async (addressString) => {
    try {
      const geocoded = await Location.geocodeAsync(addressString);
      if (geocoded.length > 0) {
        return {
          coordinates: {
            latitude: geocoded[0].latitude,
            longitude: geocoded[0].longitude,
          },
          address: addressString,
        };
      }
      throw new Error('Address not found');
    } catch (error) {
      dispatch({ type: LOCATION_ACTION_TYPES.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const calculateDistance = (location1, location2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    
    const lat1 = location1.latitude;
    const lon1 = location1.longitude;
    const lat2 = location2.latitude;
    const lon2 = location2.longitude;
    
    const R = 6371; // Radius of Earth in kilometers
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    return distance; // Distance in kilometers
  };

  const clearError = () => {
    dispatch({ type: LOCATION_ACTION_TYPES.CLEAR_ERROR });
  };

  const value = {
    ...state,
    getCurrentLocation,
    setDeliveryAddress,
    addSavedAddress,
    removeSavedAddress,
    updateSavedAddress,
    geocodeAddress,
    calculateDistance,
    requestLocationPermission,
    clearError,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};

// Hook to use location context
export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};