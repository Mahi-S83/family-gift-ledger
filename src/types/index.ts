export interface Wedding {
  id: string;
  name: string;
  bride: string;
  groom: string;
  date: string;
}

export interface Guest {
  id: string;
  name: string;
  household?: string;
  relation?: string;
}

export interface Gift {
  id: string;
  guestId: string;
  weddingId: string;
  type: 'cash' | 'gift' | 'both';
  amount?: number;
  description?: string;
  photo?: string;
  notes?: string;
}

export interface SearchResult {
  type: 'guest' | 'gift';
  data: any;
  matchScore?: number;
}