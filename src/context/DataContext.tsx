import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Wedding, Guest, Gift } from '../types';
import { mockWeddings, mockGuests, mockGifts } from '../data/mockData';

interface DataContextType {
  weddings: Wedding[];
  guests: Guest[];
  gifts: Gift[];
  addWedding: (wedding: Wedding) => void;
  addGuest: (guest: Guest) => void;
  addGift: (gift: Gift) => void;
  getGuestHistory: (guestId: string) => Gift[];
  getGiftsForWedding: (weddingId: string) => Gift[];
  clearAllData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

interface DataProviderProps {
  children: ReactNode;
}

// Storage keys
const STORAGE_KEYS = {
  WEDDINGS: 'family_gift_ledger_weddings',
  GUESTS: 'family_gift_ledger_guests',
  GIFTS: 'family_gift_ledger_gifts',
};

// Helper functions
const loadFromStorage = <T,>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading from storage:', error);
  }
  return defaultValue;
};

const saveToStorage = <T,>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to storage:', error);
  }
};

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  // Initialize state from localStorage or use mock data
  const [weddings, setWeddings] = useState<Wedding[]>(() => 
    loadFromStorage(STORAGE_KEYS.WEDDINGS, mockWeddings)
  );
  const [guests, setGuests] = useState<Guest[]>(() => 
    loadFromStorage(STORAGE_KEYS.GUESTS, mockGuests)
  );
  const [gifts, setGifts] = useState<Gift[]>(() => 
    loadFromStorage(STORAGE_KEYS.GIFTS, mockGifts)
  );

  // Save to localStorage whenever data changes
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.WEDDINGS, weddings);
  }, [weddings]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.GUESTS, guests);
  }, [guests]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.GIFTS, gifts);
  }, [gifts]);

  const addWedding = (wedding: Wedding) => {
    setWeddings(prev => [...prev, wedding]);
  };

  const addGuest = (guest: Guest) => {
    setGuests(prev => [...prev, guest]);
  };

  const addGift = (gift: Gift) => {
    setGifts(prev => [...prev, gift]);
  };

  const getGuestHistory = (guestId: string) => {
    return gifts.filter(g => g.guestId === guestId);
  };

  const getGiftsForWedding = (weddingId: string) => {
    return gifts.filter(g => g.weddingId === weddingId);
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      localStorage.removeItem(STORAGE_KEYS.WEDDINGS);
      localStorage.removeItem(STORAGE_KEYS.GUESTS);
      localStorage.removeItem(STORAGE_KEYS.GIFTS);
      setWeddings([]);
      setGuests([]);
      setGifts([]);
    }
  };

  return (
    <DataContext.Provider value={{
      weddings, guests, gifts,
      addWedding, addGuest, addGift,
      getGuestHistory, getGiftsForWedding,
      clearAllData
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};