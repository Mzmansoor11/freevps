import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Initial state
const initialState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
};

// Order statuses
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  READY_FOR_PICKUP: 'ready_for_pickup',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

// Action types
const ORDER_ACTION_TYPES = {
  SET_LOADING: 'SET_LOADING',
  LOAD_ORDERS: 'LOAD_ORDERS',
  ADD_ORDER: 'ADD_ORDER',
  UPDATE_ORDER: 'UPDATE_ORDER',
  SET_CURRENT_ORDER: 'SET_CURRENT_ORDER',
  CANCEL_ORDER: 'CANCEL_ORDER',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

// Reducer
const orderReducer = (state, action) => {
  switch (action.type) {
    case ORDER_ACTION_TYPES.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };

    case ORDER_ACTION_TYPES.LOAD_ORDERS:
      return {
        ...state,
        orders: action.payload,
        loading: false,
      };

    case ORDER_ACTION_TYPES.ADD_ORDER:
      return {
        ...state,
        orders: [action.payload, ...state.orders],
        currentOrder: action.payload,
        loading: false,
      };

    case ORDER_ACTION_TYPES.UPDATE_ORDER:
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload.id ? { ...order, ...action.payload } : order
        ),
        currentOrder: state.currentOrder?.id === action.payload.id 
          ? { ...state.currentOrder, ...action.payload } 
          : state.currentOrder,
      };

    case ORDER_ACTION_TYPES.SET_CURRENT_ORDER:
      return {
        ...state,
        currentOrder: action.payload,
      };

    case ORDER_ACTION_TYPES.CANCEL_ORDER:
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload ? { ...order, status: ORDER_STATUS.CANCELLED } : order
        ),
        currentOrder: state.currentOrder?.id === action.payload 
          ? { ...state.currentOrder, status: ORDER_STATUS.CANCELLED } 
          : state.currentOrder,
      };

    case ORDER_ACTION_TYPES.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case ORDER_ACTION_TYPES.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

// Create context
const OrderContext = createContext();

// Provider component
export const OrderProvider = ({ children }) => {
  const [state, dispatch] = useReducer(orderReducer, initialState);

  // Load orders from storage on app start
  useEffect(() => {
    loadOrders();
  }, []);

  // Save orders to storage whenever they change
  useEffect(() => {
    if (!state.loading) {
      saveOrders();
    }
  }, [state.orders]);

  const loadOrders = async () => {
    try {
      dispatch({ type: ORDER_ACTION_TYPES.SET_LOADING, payload: true });
      
      const ordersData = await AsyncStorage.getItem('orders');
      if (ordersData) {
        const parsedOrders = JSON.parse(ordersData);
        dispatch({ type: ORDER_ACTION_TYPES.LOAD_ORDERS, payload: parsedOrders });
      } else {
        dispatch({ type: ORDER_ACTION_TYPES.SET_LOADING, payload: false });
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      dispatch({ type: ORDER_ACTION_TYPES.SET_ERROR, payload: error.message });
    }
  };

  const saveOrders = async () => {
    try {
      await AsyncStorage.setItem('orders', JSON.stringify(state.orders));
    } catch (error) {
      console.error('Error saving orders:', error);
    }
  };

  const createOrder = async (orderData) => {
    try {
      dispatch({ type: ORDER_ACTION_TYPES.SET_LOADING, payload: true });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newOrder = {
        id: Date.now().toString(),
        ...orderData,
        status: ORDER_STATUS.PENDING,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        estimatedDeliveryTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes from now
      };

      dispatch({ type: ORDER_ACTION_TYPES.ADD_ORDER, payload: newOrder });

      // Simulate status updates
      setTimeout(() => {
        updateOrderStatus(newOrder.id, ORDER_STATUS.CONFIRMED);
      }, 5000);

      setTimeout(() => {
        updateOrderStatus(newOrder.id, ORDER_STATUS.PREPARING);
      }, 10000);

      return { success: true, order: newOrder };
    } catch (error) {
      dispatch({ type: ORDER_ACTION_TYPES.SET_ERROR, payload: error.message });
      return { success: false, error: error.message };
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const updatedOrder = {
        id: orderId,
        status,
        updatedAt: new Date().toISOString(),
      };

      dispatch({ type: ORDER_ACTION_TYPES.UPDATE_ORDER, payload: updatedOrder });

      return { success: true };
    } catch (error) {
      dispatch({ type: ORDER_ACTION_TYPES.SET_ERROR, payload: error.message });
      return { success: false, error: error.message };
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      // Check if order can be cancelled
      const order = state.orders.find(o => o.id === orderId);
      if (!order) {
        throw new Error('Order not found');
      }

      if ([ORDER_STATUS.OUT_FOR_DELIVERY, ORDER_STATUS.DELIVERED].includes(order.status)) {
        throw new Error('Order cannot be cancelled at this stage');
      }

      dispatch({ type: ORDER_ACTION_TYPES.CANCEL_ORDER, payload: orderId });

      return { success: true };
    } catch (error) {
      dispatch({ type: ORDER_ACTION_TYPES.SET_ERROR, payload: error.message });
      return { success: false, error: error.message };
    }
  };

  const reorder = async (orderId) => {
    try {
      const order = state.orders.find(o => o.id === orderId);
      if (!order) {
        throw new Error('Order not found');
      }

      const reorderData = {
        items: order.items,
        vendor: order.vendor,
        deliveryAddress: order.deliveryAddress,
        totalPrice: order.totalPrice,
        deliveryFee: order.deliveryFee,
        serviceFee: order.serviceFee,
        tax: order.tax,
        paymentMethod: order.paymentMethod,
      };

      return await createOrder(reorderData);
    } catch (error) {
      dispatch({ type: ORDER_ACTION_TYPES.SET_ERROR, payload: error.message });
      return { success: false, error: error.message };
    }
  };

  const trackOrder = (orderId) => {
    const order = state.orders.find(o => o.id === orderId);
    if (!order) {
      return null;
    }

    // Simulate tracking data
    const trackingSteps = [
      { status: ORDER_STATUS.PENDING, title: 'Order Placed', completed: true },
      { status: ORDER_STATUS.CONFIRMED, title: 'Order Confirmed', completed: [ORDER_STATUS.CONFIRMED, ORDER_STATUS.PREPARING, ORDER_STATUS.READY_FOR_PICKUP, ORDER_STATUS.OUT_FOR_DELIVERY, ORDER_STATUS.DELIVERED].includes(order.status) },
      { status: ORDER_STATUS.PREPARING, title: 'Preparing', completed: [ORDER_STATUS.PREPARING, ORDER_STATUS.READY_FOR_PICKUP, ORDER_STATUS.OUT_FOR_DELIVERY, ORDER_STATUS.DELIVERED].includes(order.status) },
      { status: ORDER_STATUS.OUT_FOR_DELIVERY, title: 'Out for Delivery', completed: [ORDER_STATUS.OUT_FOR_DELIVERY, ORDER_STATUS.DELIVERED].includes(order.status) },
      { status: ORDER_STATUS.DELIVERED, title: 'Delivered', completed: order.status === ORDER_STATUS.DELIVERED },
    ];

    return {
      order,
      trackingSteps,
      currentStep: trackingSteps.findIndex(step => step.status === order.status),
    };
  };

  const getOrderHistory = () => {
    return state.orders.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  const getActiveOrders = () => {
    return state.orders.filter(order => 
      ![ORDER_STATUS.DELIVERED, ORDER_STATUS.CANCELLED].includes(order.status)
    );
  };

  const setCurrentOrder = (order) => {
    dispatch({ type: ORDER_ACTION_TYPES.SET_CURRENT_ORDER, payload: order });
  };

  const clearError = () => {
    dispatch({ type: ORDER_ACTION_TYPES.CLEAR_ERROR });
  };

  const value = {
    ...state,
    createOrder,
    updateOrderStatus,
    cancelOrder,
    reorder,
    trackOrder,
    getOrderHistory,
    getActiveOrders,
    setCurrentOrder,
    clearError,
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};

// Hook to use order context
export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};