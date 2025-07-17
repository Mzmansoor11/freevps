import React, { createContext, useState } from 'react';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([
    {
      id: '1001',
      vendorName: 'Pizza Palace',
      items: [
        { name: 'Margherita Pizza', quantity: 1, price: 15.99 },
        { name: 'Garlic Bread', quantity: 2, price: 5.99 }
      ],
      total: 27.97,
      status: 'delivered',
      orderDate: new Date('2024-01-15T18:30:00'),
      deliveryAddress: '123 Main St, City',
      estimatedDelivery: '25-35 min'
    },
    {
      id: '1002',
      vendorName: 'Burger Barn',
      items: [
        { name: 'Classic Burger', quantity: 2, price: 12.99 },
        { name: 'Fries', quantity: 1, price: 4.99 }
      ],
      total: 30.97,
      status: 'preparing',
      orderDate: new Date('2024-01-16T12:15:00'),
      deliveryAddress: '123 Main St, City',
      estimatedDelivery: '20-30 min'
    }
  ]);

  const createOrder = (orderData) => {
    const newOrder = {
      id: Date.now().toString(),
      ...orderData,
      orderDate: new Date(),
      status: 'pending'
    };
    setOrders([newOrder, ...orders]);
    return newOrder;
  };

  const updateOrderStatus = (orderId, status) => {
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, status } : order
    ));
  };

  const getOrderById = (orderId) => {
    return orders.find(order => order.id === orderId);
  };

  const getOrdersByStatus = (status) => {
    return orders.filter(order => order.status === status);
  };

  const value = {
    orders,
    createOrder,
    updateOrderStatus,
    getOrderById,
    getOrdersByStatus,
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};

export { OrderContext };