import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Initial state
const initialState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  selectedVendor: null,
  deliveryFee: 0,
  serviceFee: 0,
  tax: 0,
  loading: false,
  error: null,
};

// Action types
const CART_ACTION_TYPES = {
  SET_LOADING: 'SET_LOADING',
  LOAD_CART: 'LOAD_CART',
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  SET_VENDOR: 'SET_VENDOR',
  UPDATE_FEES: 'UPDATE_FEES',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

// Helper functions
const calculateTotals = (items) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  return { totalItems, totalPrice };
};

// Reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTION_TYPES.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };

    case CART_ACTION_TYPES.LOAD_CART:
      const { totalItems, totalPrice } = calculateTotals(action.payload.items);
      return {
        ...state,
        ...action.payload,
        totalItems,
        totalPrice,
        loading: false,
      };

    case CART_ACTION_TYPES.ADD_ITEM: {
      const existingItemIndex = state.items.findIndex(
        item => item.id === action.payload.id && 
        JSON.stringify(item.options) === JSON.stringify(action.payload.options)
      );

      let newItems;
      if (existingItemIndex >= 0) {
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      } else {
        newItems = [...state.items, action.payload];
      }

      const totals = calculateTotals(newItems);
      return {
        ...state,
        items: newItems,
        ...totals,
        error: null,
      };
    }

    case CART_ACTION_TYPES.REMOVE_ITEM: {
      const newItems = state.items.filter(item => 
        !(item.id === action.payload.id && 
          JSON.stringify(item.options) === JSON.stringify(action.payload.options))
      );
      const totals = calculateTotals(newItems);
      return {
        ...state,
        items: newItems,
        ...totals,
        selectedVendor: newItems.length === 0 ? null : state.selectedVendor,
      };
    }

    case CART_ACTION_TYPES.UPDATE_QUANTITY: {
      const newItems = state.items.map(item =>
        item.id === action.payload.id && 
        JSON.stringify(item.options) === JSON.stringify(action.payload.options)
          ? { ...item, quantity: action.payload.quantity }
          : item
      ).filter(item => item.quantity > 0);

      const totals = calculateTotals(newItems);
      return {
        ...state,
        items: newItems,
        ...totals,
        selectedVendor: newItems.length === 0 ? null : state.selectedVendor,
      };
    }

    case CART_ACTION_TYPES.CLEAR_CART:
      return {
        ...initialState,
        loading: false,
      };

    case CART_ACTION_TYPES.SET_VENDOR:
      return {
        ...state,
        selectedVendor: action.payload,
      };

    case CART_ACTION_TYPES.UPDATE_FEES:
      return {
        ...state,
        deliveryFee: action.payload.deliveryFee || 0,
        serviceFee: action.payload.serviceFee || 0,
        tax: action.payload.tax || 0,
      };

    case CART_ACTION_TYPES.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case CART_ACTION_TYPES.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

// Create context
const CartContext = createContext();

// Provider component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart data from storage on app start
  useEffect(() => {
    loadCartData();
  }, []);

  // Save cart data to storage whenever it changes
  useEffect(() => {
    if (!state.loading) {
      saveCartData();
    }
  }, [state.items, state.selectedVendor, state.deliveryFee, state.serviceFee, state.tax]);

  const loadCartData = async () => {
    try {
      dispatch({ type: CART_ACTION_TYPES.SET_LOADING, payload: true });
      
      const cartData = await AsyncStorage.getItem('cartData');
      if (cartData) {
        const parsedCart = JSON.parse(cartData);
        dispatch({ type: CART_ACTION_TYPES.LOAD_CART, payload: parsedCart });
      } else {
        dispatch({ type: CART_ACTION_TYPES.SET_LOADING, payload: false });
      }
    } catch (error) {
      console.error('Error loading cart data:', error);
      dispatch({ type: CART_ACTION_TYPES.SET_ERROR, payload: error.message });
    }
  };

  const saveCartData = async () => {
    try {
      const cartData = {
        items: state.items,
        selectedVendor: state.selectedVendor,
        deliveryFee: state.deliveryFee,
        serviceFee: state.serviceFee,
        tax: state.tax,
      };
      await AsyncStorage.setItem('cartData', JSON.stringify(cartData));
    } catch (error) {
      console.error('Error saving cart data:', error);
    }
  };

  const addItem = async (product, quantity = 1, options = {}) => {
    try {
      // Check if adding from different vendor
      if (state.selectedVendor && state.selectedVendor.id !== product.vendorId) {
        throw new Error('You can only order from one vendor at a time. Clear cart to add items from a different vendor.');
      }

      const cartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        vendorId: product.vendorId,
        vendorName: product.vendorName,
        quantity,
        options,
        addedAt: new Date().toISOString(),
      };

      dispatch({ type: CART_ACTION_TYPES.ADD_ITEM, payload: cartItem });

      // Set vendor if first item
      if (!state.selectedVendor) {
        dispatch({ 
          type: CART_ACTION_TYPES.SET_VENDOR, 
          payload: { 
            id: product.vendorId, 
            name: product.vendorName,
            image: product.vendorImage,
          } 
        });
      }

      return { success: true };
    } catch (error) {
      dispatch({ type: CART_ACTION_TYPES.SET_ERROR, payload: error.message });
      return { success: false, error: error.message };
    }
  };

  const removeItem = (productId, options = {}) => {
    dispatch({ 
      type: CART_ACTION_TYPES.REMOVE_ITEM, 
      payload: { id: productId, options } 
    });
  };

  const updateQuantity = (productId, quantity, options = {}) => {
    dispatch({ 
      type: CART_ACTION_TYPES.UPDATE_QUANTITY, 
      payload: { id: productId, quantity, options } 
    });
  };

  const clearCart = async () => {
    try {
      await AsyncStorage.removeItem('cartData');
      dispatch({ type: CART_ACTION_TYPES.CLEAR_CART });
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const updateFees = (fees) => {
    dispatch({ type: CART_ACTION_TYPES.UPDATE_FEES, payload: fees });
  };

  const getCartTotal = () => {
    return state.totalPrice + state.deliveryFee + state.serviceFee + state.tax;
  };

  const getItemCount = () => {
    return state.totalItems;
  };

  const isItemInCart = (productId, options = {}) => {
    return state.items.some(item => 
      item.id === productId && 
      JSON.stringify(item.options) === JSON.stringify(options)
    );
  };

  const getItemQuantity = (productId, options = {}) => {
    const item = state.items.find(item => 
      item.id === productId && 
      JSON.stringify(item.options) === JSON.stringify(options)
    );
    return item ? item.quantity : 0;
  };

  const clearError = () => {
    dispatch({ type: CART_ACTION_TYPES.CLEAR_ERROR });
  };

  const value = {
    ...state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    updateFees,
    getCartTotal,
    getItemCount,
    isItemInCart,
    getItemQuantity,
    clearError,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};