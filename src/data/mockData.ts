import { Wedding, Guest, Gift } from '../types';

export const mockWeddings: Wedding[] = [
  { id: 'w1', name: 'Neha Weds Rahul', bride: 'Neha', groom: 'Rahul', date: '2026-01-15' },
  { id: 'w2', name: 'Aman Weds Priya', bride: 'Priya', groom: 'Aman', date: '2024-03-20' },
  { id: 'w3', name: 'Diya Weds Karan', bride: 'Diya', groom: 'Karan', date: '2021-07-10' },
];

export const mockGuests: Guest[] = [
  { id: 'g1', name: 'Rajesh Sharma', household: 'Sharma Family', relation: 'Friend' },
  { id: 'g2', name: 'R. Sharma', household: 'Sharma Family', relation: 'Friend' },
  { id: 'g3', name: 'Sunita Bua', household: 'Bua', relation: 'Bua' },
  { id: 'g4', name: 'Anita Bua', household: 'Bua', relation: 'Bua' },
  { id: 'g5', name: 'Mohan Gupta', household: 'Gupta Family', relation: 'Mama' },
  { id: 'g6', name: 'Suresh Chacha', household: 'Chacha Family', relation: 'Chacha' },
];

export const mockGifts: Gift[] = [
  { id: 'gt1', guestId: 'g1', weddingId: 'w1', type: 'cash', amount: 5100, description: 'Cash' },
  { id: 'gt2', guestId: 'g1', weddingId: 'w2', type: 'both', amount: 2100, description: 'Dinner Set' },
  { id: 'gt3', guestId: 'g1', weddingId: 'w3', type: 'cash', amount: 1100 },
  { id: 'gt4', guestId: 'g3', weddingId: 'w1', type: 'cash', amount: 3000 },
  { id: 'gt5', guestId: 'g4', weddingId: 'w1', type: 'gift', description: 'Silver Utensils' },
  { id: 'gt6', guestId: 'g5', weddingId: 'w2', type: 'cash', amount: 5000 },
];