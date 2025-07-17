import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
  favorites: [],
  loyaltyPoints: 0,
  badges: [],
  preferences: {
    notifications: true,
    locationSharing: true,
    language: 'en',
    theme: 'light',
  },
};

// Action types
const USER_ACTION_TYPES = {
  SET_LOADING: 'SET_LOADING',
  SET_USER: 'SET_USER',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  UPDATE_PROFILE: 'UPDATE_PROFILE',
  ADD_FAVORITE: 'ADD_FAVORITE',
  REMOVE_FAVORITE: 'REMOVE_FAVORITE',
  UPDATE_LOYALTY_POINTS: 'UPDATE_LOYALTY_POINTS',
  ADD_BADGE: 'ADD_BADGE',
  UPDATE_PREFERENCES: 'UPDATE_PREFERENCES',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

// Reducer
const userReducer = (state, action) => {
  switch (action.type) {
    case USER_ACTION_TYPES.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };

    case USER_ACTION_TYPES.SET_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        loading: false,
      };

    case USER_ACTION_TYPES.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        loading: false,
        error: null,
      };

    case USER_ACTION_TYPES.LOGIN_FAILURE:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload,
      };

    case USER_ACTION_TYPES.LOGOUT:
      return {
        ...initialState,
        loading: false,
      };

    case USER_ACTION_TYPES.UPDATE_PROFILE:
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload,
        },
      };

    case USER_ACTION_TYPES.ADD_FAVORITE:
      return {
        ...state,
        favorites: [...state.favorites, action.payload],
      };

    case USER_ACTION_TYPES.REMOVE_FAVORITE:
      return {
        ...state,
        favorites: state.favorites.filter(fav => fav.id !== action.payload),
      };

    case USER_ACTION_TYPES.UPDATE_LOYALTY_POINTS:
      return {
        ...state,
        loyaltyPoints: action.payload,
      };

    case USER_ACTION_TYPES.ADD_BADGE:
      return {
        ...state,
        badges: [...state.badges, action.payload],
      };

    case USER_ACTION_TYPES.UPDATE_PREFERENCES:
      return {
        ...state,
        preferences: {
          ...state.preferences,
          ...action.payload,
        },
      };

    case USER_ACTION_TYPES.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case USER_ACTION_TYPES.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

// Create context
const UserContext = createContext();

// Provider component
export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  // Load user data from storage on app start
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      dispatch({ type: USER_ACTION_TYPES.SET_LOADING, payload: true });
      
      const userData = await AsyncStorage.getItem('userData');
      const favoritesData = await AsyncStorage.getItem('favorites');
      const loyaltyPoints = await AsyncStorage.getItem('loyaltyPoints');
      const badges = await AsyncStorage.getItem('badges');
      const preferences = await AsyncStorage.getItem('preferences');

      if (userData) {
        dispatch({ type: USER_ACTION_TYPES.SET_USER, payload: JSON.parse(userData) });
      }

      if (favoritesData) {
        dispatch({ type: USER_ACTION_TYPES.ADD_FAVORITE, payload: JSON.parse(favoritesData) });
      }

      if (loyaltyPoints) {
        dispatch({ type: USER_ACTION_TYPES.UPDATE_LOYALTY_POINTS, payload: parseInt(loyaltyPoints) });
      }

      if (badges) {
        dispatch({ type: USER_ACTION_TYPES.ADD_BADGE, payload: JSON.parse(badges) });
      }

      if (preferences) {
        dispatch({ type: USER_ACTION_TYPES.UPDATE_PREFERENCES, payload: JSON.parse(preferences) });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      dispatch({ type: USER_ACTION_TYPES.SET_LOADING, payload: false });
    }
  };

  const login = async (email, password) => {
    try {
      dispatch({ type: USER_ACTION_TYPES.SET_LOADING, payload: true });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userData = {
        id: Date.now(),
        email,
        name: email.split('@')[0],
        avatar: null,
        joinedDate: new Date().toISOString(),
      };

      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      dispatch({ 
        type: USER_ACTION_TYPES.LOGIN_SUCCESS, 
        payload: { user: userData } 
      });

      return { success: true };
    } catch (error) {
      dispatch({ 
        type: USER_ACTION_TYPES.LOGIN_FAILURE, 
        payload: error.message 
      });
      return { success: false, error: error.message };
    }
  };

  const register = async (name, email, password) => {
    try {
      dispatch({ type: USER_ACTION_TYPES.SET_LOADING, payload: true });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userData = {
        id: Date.now(),
        email,
        name,
        avatar: null,
        joinedDate: new Date().toISOString(),
      };

      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      dispatch({ 
        type: USER_ACTION_TYPES.LOGIN_SUCCESS, 
        payload: { user: userData } 
      });

      return { success: true };
    } catch (error) {
      dispatch({ 
        type: USER_ACTION_TYPES.LOGIN_FAILURE, 
        payload: error.message 
      });
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.multiRemove(['userData', 'favorites', 'loyaltyPoints', 'badges']);
      dispatch({ type: USER_ACTION_TYPES.LOGOUT });
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const updatedUser = { ...state.user, ...profileData };
      await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
      dispatch({ type: USER_ACTION_TYPES.UPDATE_PROFILE, payload: profileData });
      return { success: true };
    } catch (error) {
      dispatch({ type: USER_ACTION_TYPES.SET_ERROR, payload: error.message });
      return { success: false, error: error.message };
    }
  };

  const addFavorite = async (business) => {
    try {
      const newFavorites = [...state.favorites, business];
      await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
      dispatch({ type: USER_ACTION_TYPES.ADD_FAVORITE, payload: business });
    } catch (error) {
      console.error('Error adding favorite:', error);
    }
  };

  const removeFavorite = async (businessId) => {
    try {
      const newFavorites = state.favorites.filter(fav => fav.id !== businessId);
      await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
      dispatch({ type: USER_ACTION_TYPES.REMOVE_FAVORITE, payload: businessId });
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  const updateLoyaltyPoints = async (points) => {
    try {
      await AsyncStorage.setItem('loyaltyPoints', points.toString());
      dispatch({ type: USER_ACTION_TYPES.UPDATE_LOYALTY_POINTS, payload: points });
    } catch (error) {
      console.error('Error updating loyalty points:', error);
    }
  };

  const addBadge = async (badge) => {
    try {
      const newBadges = [...state.badges, badge];
      await AsyncStorage.setItem('badges', JSON.stringify(newBadges));
      dispatch({ type: USER_ACTION_TYPES.ADD_BADGE, payload: badge });
    } catch (error) {
      console.error('Error adding badge:', error);
    }
  };

  const updatePreferences = async (preferences) => {
    try {
      const newPreferences = { ...state.preferences, ...preferences };
      await AsyncStorage.setItem('preferences', JSON.stringify(newPreferences));
      dispatch({ type: USER_ACTION_TYPES.UPDATE_PREFERENCES, payload: preferences });
    } catch (error) {
      console.error('Error updating preferences:', error);
    }
  };

  const clearError = () => {
    dispatch({ type: USER_ACTION_TYPES.CLEAR_ERROR });
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    addFavorite,
    removeFavorite,
    updateLoyaltyPoints,
    addBadge,
    updatePreferences,
    clearError,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

// Hook to use user context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};