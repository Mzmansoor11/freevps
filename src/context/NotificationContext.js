import React, { createContext, useContext, useReducer, useEffect } from 'react';
import * as Notifications from 'expo-notifications';

// Initial state
const initialState = {
  notifications: [],
  expoPushToken: null,
  loading: false,
  error: null,
};

// Action types
const NOTIFICATION_ACTION_TYPES = {
  SET_LOADING: 'SET_LOADING',
  SET_EXPO_PUSH_TOKEN: 'SET_EXPO_PUSH_TOKEN',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  CLEAR_NOTIFICATIONS: 'CLEAR_NOTIFICATIONS',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

// Reducer
const notificationReducer = (state, action) => {
  switch (action.type) {
    case NOTIFICATION_ACTION_TYPES.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };

    case NOTIFICATION_ACTION_TYPES.SET_EXPO_PUSH_TOKEN:
      return {
        ...state,
        expoPushToken: action.payload,
      };

    case NOTIFICATION_ACTION_TYPES.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
      };

    case NOTIFICATION_ACTION_TYPES.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(notif => notif.id !== action.payload),
      };

    case NOTIFICATION_ACTION_TYPES.CLEAR_NOTIFICATIONS:
      return {
        ...state,
        notifications: [],
      };

    case NOTIFICATION_ACTION_TYPES.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case NOTIFICATION_ACTION_TYPES.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

// Create context
const NotificationContext = createContext();

// Provider component
export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  useEffect(() => {
    registerForPushNotificationsAsync();
    
    // Listen for notifications
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      addNotification({
        id: Date.now().toString(),
        title: notification.request.content.title,
        body: notification.request.content.body,
        data: notification.request.content.data,
        receivedAt: new Date().toISOString(),
      });
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
    };
  }, []);

  const registerForPushNotificationsAsync = async () => {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return;
      }
      
      const token = await Notifications.getExpoPushTokenAsync();
      dispatch({ 
        type: NOTIFICATION_ACTION_TYPES.SET_EXPO_PUSH_TOKEN, 
        payload: token.data 
      });
    } catch (error) {
      console.error('Error getting push token:', error);
      dispatch({ type: NOTIFICATION_ACTION_TYPES.SET_ERROR, payload: error.message });
    }
  };

  const addNotification = (notification) => {
    dispatch({ 
      type: NOTIFICATION_ACTION_TYPES.ADD_NOTIFICATION, 
      payload: notification 
    });
  };

  const removeNotification = (notificationId) => {
    dispatch({ 
      type: NOTIFICATION_ACTION_TYPES.REMOVE_NOTIFICATION, 
      payload: notificationId 
    });
  };

  const clearNotifications = () => {
    dispatch({ type: NOTIFICATION_ACTION_TYPES.CLEAR_NOTIFICATIONS });
  };

  const scheduleNotification = async (content, trigger = null) => {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content,
        trigger,
      });
      return notificationId;
    } catch (error) {
      dispatch({ type: NOTIFICATION_ACTION_TYPES.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const clearError = () => {
    dispatch({ type: NOTIFICATION_ACTION_TYPES.CLEAR_ERROR });
  };

  const value = {
    ...state,
    addNotification,
    removeNotification,
    clearNotifications,
    scheduleNotification,
    clearError,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Hook to use notification context
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};