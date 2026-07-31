import { Gift, Guest, Wedding } from '../types';

export interface SearchFilters {
  relation?: string;
  minAmount?: number;
  maxAmount?: number;
  weddingId?: string;
  searchText?: string;
}

// Simulate AI parsing of natural language
export const parseNaturalQuery = (query: string): SearchFilters => {
  const filters: SearchFilters = {};
  const lower = query.toLowerCase();

  // Check for wedding names
  const weddingMatch = lower.match(/neha|aman|diya|wedding/i);
  if (weddingMatch) {
    if (weddingMatch[0].includes('neha')) filters.weddingId = 'w1';
    else if (weddingMatch[0].includes('aman')) filters.weddingId = 'w2';
    else if (weddingMatch[0].includes('diya')) filters.weddingId = 'w3';
  }

  // Check for relations
  const relationMatch = lower.match(/bua|chacha|mama|friend|colleague/i);
  if (relationMatch) {
    filters.relation = relationMatch[0].charAt(0).toUpperCase() + relationMatch[0].slice(1);
  }

  // Check for amounts
  const amountMatch = lower.match(/above\s*([0-9]+)|more than\s*([0-9]+)/i);
  if (amountMatch) {
    const amount = parseInt(amountMatch[1] || amountMatch[2]);
    if (!isNaN(amount)) filters.minAmount = amount;
  }

  return filters;
};

export const searchGifts = (
  filters: SearchFilters,
  gifts: Gift[],
  guests: Guest[],
  weddings: Wedding[]
): Gift[] => {
  let result = [...gifts];

  if (filters.weddingId) {
    result = result.filter(g => g.weddingId === filters.weddingId);
  }

  if (filters.relation) {
    const guestIds = guests
      .filter(g => g.relation === filters.relation)
      .map(g => g.id);
    result = result.filter(g => guestIds.includes(g.guestId));
  }

  if (filters.minAmount !== undefined) {
    result = result.filter(g => (g.amount || 0) >= filters.minAmount!);
  }

  if (filters.searchText) {
    const searchLower = filters.searchText.toLowerCase();
    result = result.filter(g => {
      const guest = guests.find(gu => gu.id === g.guestId);
      return guest?.name.toLowerCase().includes(searchLower) || 
             g.description?.toLowerCase().includes(searchLower);
    });
  }

  return result;
};