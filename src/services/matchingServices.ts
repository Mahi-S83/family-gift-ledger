import { Guest, Gift } from '../types';

// Simple string similarity (Levenshtein-ish)
const getSimilarityScore = (str1: string, str2: string): number => {
  const s1 = str1.toLowerCase().trim();
  const s2 = str2.toLowerCase().trim();
  
  if (s1 === s2) return 1.0;
  if (s1.includes(s2) || s2.includes(s1)) return 0.8;
  
  // Simple word match ratio
  const words1 = s1.split(' ');
  const words2 = s2.split(' ');
  const common = words1.filter(w => words2.includes(w));
  return common.length / Math.max(words1.length, words2.length);
};

export const findMatchingGuests = (
  query: string,
  allGuests: Guest[],
  allGifts: Gift[],
  allWeddings: any[]
): { guest: Guest; score: number; lastGift?: Gift; weddingName?: string }[] => {
  
  const results = allGuests.map(guest => {
    const score = getSimilarityScore(query, guest.name);
    
    // Only return matches above threshold
    if (score < 0.3) return null;
    
    // Find last gift for this guest
    const guestGifts = allGifts.filter(g => g.guestId === guest.id);
    const lastGift = guestGifts.sort((a, b) => 
      new Date(allWeddings.find(w => w.id === b.weddingId)?.date || 0).getTime() -
      new Date(allWeddings.find(w => w.id === a.weddingId)?.date || 0).getTime()
    )[0];
    
    const weddingName = allWeddings.find(w => w.id === lastGift?.weddingId)?.name;
    
    return { guest, score, lastGift, weddingName };
  }).filter(Boolean) as { guest: Guest; score: number; lastGift?: Gift; weddingName?: string }[];
  
  // Sort by score, descending
  return results.sort((a, b) => b.score - a.score).slice(0, 3);
};