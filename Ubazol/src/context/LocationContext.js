import React, { createContext, useState } from 'react';

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [address, setAddress] = useState('123 Main Street, Downtown');
  const [savedAddresses, setSavedAddresses] = useState([
    {
      id: '1',
      label: 'Home',
      address: '123 Main Street, Downtown',
      city: 'New York',
      zipCode: '10001',
      isDefault: true
    },
    {
      id: '2',
      label: 'Work',
      address: '456 Business Ave, Midtown',
      city: 'New York',
      zipCode: '10002',
      isDefault: false
    }
  ]);

  const updateCurrentLocation = (location) => {
    setCurrentLocation(location);
  };

  const updateAddress = (newAddress) => {
    setAddress(newAddress);
  };

  const addAddress = (addressData) => {
    const newAddress = {
      id: Date.now().toString(),
      ...addressData,
      isDefault: false
    };
    setSavedAddresses([...savedAddresses, newAddress]);
    return newAddress;
  };

  const removeAddress = (addressId) => {
    setSavedAddresses(savedAddresses.filter(addr => addr.id !== addressId));
  };

  const setDefaultAddress = (addressId) => {
    const updatedAddresses = savedAddresses.map(addr => ({
      ...addr,
      isDefault: addr.id === addressId
    }));
    setSavedAddresses(updatedAddresses);
    
    const defaultAddr = updatedAddresses.find(addr => addr.id === addressId);
    if (defaultAddr) {
      setAddress(defaultAddr.address);
    }
  };

  const getCurrentPosition = async () => {
    try {
      // Mock location for demo
      const mockLocation = {
        latitude: 40.7128,
        longitude: -74.0060,
        address: '123 Main Street, Downtown'
      };
      setCurrentLocation(mockLocation);
      setAddress(mockLocation.address);
      return mockLocation;
    } catch (error) {
      console.error('Error getting location:', error);
      return null;
    }
  };

  const value = {
    currentLocation,
    address,
    savedAddresses,
    updateCurrentLocation,
    updateAddress,
    addAddress,
    removeAddress,
    setDefaultAddress,
    getCurrentPosition,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};

export { LocationContext };