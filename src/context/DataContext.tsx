import React, { createContext, useContext, useState } from 'react';
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
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [weddings, setWeddings] = useState<Wedding[]>(mockWeddings);
  const [guests, setGuests] = useState<Guest[]>(mockGuests);
  const [gifts, setGifts] = useState<Gift[]>(mockGifts);

  const addWedding = (wedding: Wedding) => setWeddings([...weddings, wedding]);
  const addGuest = (guest: Guest) => setGuests([...guests, guest]);
  const addGift = (gift: Gift) => setGifts([...gifts, gift]);

  const getGuestHistory = (guestId: string) => {
    return gifts.filter(g => g.guestId === guestId);
  };

  const getGiftsForWedding = (weddingId: string) => {
    return gifts.filter(g => g.weddingId === weddingId);
  };

  return (
    <DataContext.Provider value={{
      weddings, guests, gifts,
      addWedding, addGuest, addGift,
      getGuestHistory, getGiftsForWedding
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
};