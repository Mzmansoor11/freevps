import React, { createContext, useState } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'Order Delivered!',
      message: 'Your order from Pizza Palace has been delivered.',
      type: 'success',
      timestamp: new Date('2024-01-15T19:00:00'),
      read: false
    },
    {
      id: '2',
      title: 'Order Update',
      message: 'Your order from Burger Barn is being prepared.',
      type: 'info',
      timestamp: new Date('2024-01-16T12:30:00'),
      read: false
    }
  ]);

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
      ...notification
    };
    setNotifications([newNotification, ...notifications]);
    return newNotification;
  };

  const markAsRead = (notificationId) => {
    setNotifications(notifications.map(notif =>
      notif.id === notificationId ? { ...notif, read: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const removeNotification = (notificationId) => {
    setNotifications(notifications.filter(notif => notif.id !== notificationId));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const getUnreadCount = () => {
    return notifications.filter(notif => !notif.read).length;
  };

  const sendOrderNotification = (orderId, status, message) => {
    let title = '';
    let type = 'info';

    switch (status) {
      case 'confirmed':
        title = 'Order Confirmed';
        type = 'success';
        break;
      case 'preparing':
        title = 'Order Being Prepared';
        type = 'info';
        break;
      case 'out_for_delivery':
        title = 'Out for Delivery';
        type = 'info';
        break;
      case 'delivered':
        title = 'Order Delivered';
        type = 'success';
        break;
      case 'cancelled':
        title = 'Order Cancelled';
        type = 'error';
        break;
      default:
        title = 'Order Update';
    }

    return addNotification({
      title,
      message: message || `Order #${orderId} status updated.`,
      type,
      orderId
    });
  };

  const value = {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    getUnreadCount,
    sendOrderNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export { NotificationContext };