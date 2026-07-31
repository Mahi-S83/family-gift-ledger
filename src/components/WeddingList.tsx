import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Plus } from 'lucide-react';
import { AddWeddingModal } from './AddWeddingModal';
import { EmptyState } from './EmptyStates';

interface WeddingListProps {
  selectedWeddingId: string;
  onSelectWedding: (id: string) => void;
}

export const WeddingList: React.FC<WeddingListProps> = ({ selectedWeddingId, onSelectWedding }) => {
  const { weddings, gifts, guests } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getWeddingStats = (weddingId: string) => {
    const weddingGifts = gifts.filter(g => g.weddingId === weddingId);
    const totalCash = weddingGifts.reduce((sum, g) => sum + (g.amount || 0), 0);
    const guestIds = weddingGifts.map(g => g.guestId);
    const uniqueGuests = new Set(guestIds).size;
    const repeatGuests = guests.filter(g => {
      const guestGifts = gifts.filter(gg => gg.guestId === g.id);
      return guestGifts.some(gg => gg.weddingId !== weddingId) && guestGifts.some(gg => gg.weddingId === weddingId);
    }).length;
    return { totalCash, uniqueGuests, repeatGuests, giftCount: weddingGifts.length };
  };

  if (weddings.length === 0) {
    return (
      <div>
        <div className="flex items-baseline justify-between mb-4 flex-wrap gap-2">
          <div>
            <h2 className="font-['Fraunces'] text-3xl font-semibold text-maroon-deep">Your Family's Weddings</h2>
            <p className="text-ink-soft text-sm">Start building your family gift history.</p>
          </div>
        </div>
        <EmptyState 
          type="no-weddings" 
          action={() => setIsModalOpen(true)} 
        />
        <AddWeddingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-baseline justify-between mb-4 flex-wrap gap-2">
        <div>
          <h2 className="font-['Fraunces'] text-3xl font-semibold text-maroon-deep">Your Family's Weddings</h2>
          <p className="text-ink-soft text-sm">Pick a wedding to add gifts, or start a new one.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        <div 
          onClick={() => setIsModalOpen(true)}
          className="border-2 border-dashed border-gold rounded-xl bg-marigold/5 flex flex-col items-center justify-center gap-2 min-h-[200px] cursor-pointer hover:bg-marigold/15 transition-colors"
        >
          <div className="w-11 h-11 rounded-full bg-maroon text-white flex items-center justify-center text-2xl font-bold">
            <Plus size={24} strokeWidth={3} />
          </div>
          <strong className="font-['Fraunces'] text-base text-maroon-deep">Add New Wedding</strong>
        </div>

        {weddings.map(wedding => {
          const stats = getWeddingStats(wedding.id);
          const isSelected = selectedWeddingId === wedding.id;
          return (
            <div
              key={wedding.id}
              onClick={() => onSelectWedding(wedding.id)}
              className={`relative bg-paper rounded-xl border p-5 cursor-pointer shadow-md transition-all ${
                isSelected ? 'border-marigold ring-2 ring-marigold/40' : 'border-line hover:shadow-lg hover:-translate-y-1'
              }`}
            >
              <div className="absolute -top-px -right-px w-0 h-0 border-solid border-[0_34px_34px_0] border-transparent border-r-marigold" />
              <div className="text-xs uppercase tracking-wider text-gold font-bold mb-1.5">
                {new Date(wedding.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              </div>
              <div className="font-['Fraunces'] text-xl font-semibold text-maroon-deep leading-tight">
                {wedding.name}
              </div>
              <div className="flex items-center gap-1.5 mt-2 text-ink-soft text-sm">
                <span>{wedding.city || 'India'}</span>
                <span className="w-1 h-1 rounded-full bg-ink-soft" />
                <span>{stats.giftCount} gifts logged</span>
              </div>
              <div className="flex gap-3 mt-3 pt-3 border-t border-dashed border-line">
                <div>
                  <b className="font-['IBM_Plex_Mono'] text-base text-maroon">₹{stats.totalCash.toLocaleString()}</b>
                  <span className="block text-[10px] text-ink-soft uppercase tracking-wider">Cash</span>
                </div>
                <div>
                  <b className="font-['IBM_Plex_Mono'] text-base text-maroon">{stats.repeatGuests}</b>
                  <span className="block text-[10px] text-ink-soft uppercase tracking-wider">
                    {stats.repeatGuests === 0 ? 'First wedding' : 'Repeat guests'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <AddWeddingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};