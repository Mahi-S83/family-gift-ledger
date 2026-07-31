import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { parseNaturalQuery, searchGifts } from '../services/searchServices';
import { Search, X, Users } from 'lucide-react';
import { EmptyState } from './EmptyStates';

// In handleSearch function, remove 'weddings' from searchGifts call:


export const SearchTimeline: React.FC = () => {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<any>({});
  const [results, setResults] = useState<any[]>([]);
  const [selectedGuestId, setSelectedGuestId] = useState<string | null>(null);
  const [ambiguousMatches, setAmbiguousMatches] = useState<any[]>([]);
  const [showAmbiguousPrompt, setShowAmbiguousPrompt] = useState(false);
  const { gifts, guests, weddings } = useData();

  const handleSearch = () => {
    const parsed = parseNaturalQuery(query);
    setFilters(parsed);
    
    // Check for ambiguous relation matches
    if (parsed.relation) {
      const matchingGuests = guests.filter(g => g.relation === parsed.relation);
      if (matchingGuests.length > 1) {
        setAmbiguousMatches(matchingGuests);
        setShowAmbiguousPrompt(true);
        return;
      }
    }
    
    setShowAmbiguousPrompt(false);
    const searchResults = searchGifts(parsed, gifts, guests);
    setResults(searchResults);
    
    if (searchResults.length > 0) {
      const firstGuestId = searchResults[0].guestId;
      setSelectedGuestId(firstGuestId);
    }
  };

  const handleAmbiguousSelect = (guestId: string) => {
    setShowAmbiguousPrompt(false);
    const filteredResults = results.filter(r => r.guestId === guestId);
    setResults(filteredResults);
    setSelectedGuestId(guestId);
    
    const guest = guests.find(g => g.id === guestId);
    if (guest) {
      setFilters({ ...filters, guest: guest.name });
    }
  };

  const getGuestGifts = (guestId: string) => {
    return gifts.filter(g => g.guestId === guestId).sort((a, b) => {
      const dateA = new Date(weddings.find(w => w.id === a.weddingId)?.date || 0);
      const dateB = new Date(weddings.find(w => w.id === b.weddingId)?.date || 0);
      return dateB.getTime() - dateA.getTime();
    });
  };

  const getGuest = (id: string) => guests.find(g => g.id === id);
  const getWedding = (id: string) => weddings.find(w => w.id === id);

  const uniqueGuestIds = [...new Set(results.map(g => g.guestId))];
  const selectedGuest = selectedGuestId ? getGuest(selectedGuestId) : null;
  const selectedGifts = selectedGuestId ? getGuestGifts(selectedGuestId) : [];

  const totalGifts = gifts.length;
  const totalCash = gifts.reduce((sum, g) => sum + (g.amount || 0), 0);
  const repeatGuests = guests.filter(g => {
    const guestGifts = gifts.filter(gg => gg.guestId === g.id);
    const weddingsAttended = new Set(guestGifts.map(gg => gg.weddingId));
    return weddingsAttended.size > 1;
  }).length;

  const cashGifts = gifts.filter(g => g.type === 'cash' || g.type === 'both');
  const cashRatio = gifts.length > 0 ? Math.round((cashGifts.length / gifts.length) * 100) : 0;

  // If no results yet and no query, show empty state with search prompt
  if (results.length === 0 && !query) {
    return (
      <div>
        <div className="flex items-baseline justify-between mb-4 flex-wrap gap-2">
          <div>
            <h2 className="font-['Fraunces'] text-3xl font-semibold text-maroon-deep">Search &amp; Guest Timeline</h2>
            <p className="text-ink-soft text-sm">Ask a question the way you'd ask a person.</p>
          </div>
        </div>

        <div className="flex gap-2.5 bg-paper border border-line rounded-xl p-1.5 pl-4 shadow-md mb-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What did Bua's family give last time?"
            className="flex-1 border-none outline-none text-sm font-['Manrope'] py-2 bg-transparent"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            onClick={handleSearch}
            className="bg-maroon text-white px-5 py-2 rounded-lg font-bold text-sm hover:bg-maroon-deep transition-colors flex items-center gap-2"
          >
            <Search size={16} /> Ask
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-paper border border-line rounded-xl p-8 text-center shadow-md">
            <div className="w-16 h-16 rounded-full bg-cream mx-auto flex items-center justify-center mb-4">
              <Search size={32} className="text-marigold-deep" />
            </div>
            <h3 className="font-['Fraunces'] text-xl font-semibold text-maroon-deep mb-2">
              Search Your Family History
            </h3>
            <p className="text-ink-soft text-sm max-w-sm mx-auto">
              Ask questions like "What did Bua give?" or "Show gifts above ₹5000" to find gifts across all weddings.
            </p>
          </div>
          <div className="bg-paper border border-line rounded-xl p-8 text-center shadow-md">
            <div className="w-16 h-16 rounded-full bg-cream mx-auto flex items-center justify-center mb-4">
              <Users size={32} className="text-marigold-deep" />
            </div>
            <h3 className="font-['Fraunces'] text-xl font-semibold text-maroon-deep mb-2">
              Guest Timeline
            </h3>
            <p className="text-ink-soft text-sm max-w-sm mx-auto">
              Select a guest from search results to see their complete gift history across all family weddings.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-baseline justify-between mb-4 flex-wrap gap-2">
        <div>
          <h2 className="font-['Fraunces'] text-3xl font-semibold text-maroon-deep">Search &amp; Guest Timeline</h2>
          <p className="text-ink-soft text-sm">Ask a question the way you'd ask a person.</p>
        </div>
      </div>

      <div className="flex gap-2.5 bg-paper border border-line rounded-xl p-1.5 pl-4 shadow-md mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What did Bua's family give last time?"
          className="flex-1 border-none outline-none text-sm font-['Manrope'] py-2 bg-transparent"
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button
          onClick={handleSearch}
          className="bg-maroon text-white px-5 py-2 rounded-lg font-bold text-sm hover:bg-maroon-deep transition-colors flex items-center gap-2"
        >
          <Search size={16} /> Ask
        </button>
      </div>

      {/* Ambiguous Match Prompt */}
      {showAmbiguousPrompt && ambiguousMatches.length > 0 && (
        <div className="bg-gradient-to-br from-marigold/10 to-maroon/5 border border-gold/40 rounded-xl p-4 mb-4">
          <p className="text-sm font-semibold text-maroon-deep mb-2">
            Multiple people found with relation "{filters.relation}"
          </p>
          <p className="text-xs text-ink-soft mb-3">Select which one you're looking for:</p>
          <div className="flex flex-wrap gap-2">
            {ambiguousMatches.map(guest => (
              <button
                key={guest.id}
                onClick={() => handleAmbiguousSelect(guest.id)}
                className="px-4 py-2 rounded-lg bg-white border border-line hover:border-marigold text-sm font-medium transition-all flex items-center gap-2"
              >
                <div className="w-6 h-6 rounded-full bg-mehendi text-white flex items-center justify-center text-xs font-['Fraunces'] font-semibold">
                  {guest.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                {guest.name} · {guest.household || 'No household'}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Filter Chips */}
      {Object.keys(filters).length > 0 && (
        <div className="flex flex-wrap gap-2 mb-5">
          {Object.entries(filters).map(([key, value]: [string, any]) => (
            <div key={key} className="flex items-center gap-1.5 bg-white border border-gold px-3 py-1.5 rounded-full text-xs font-bold text-maroon-deep">
              <b className="text-ink-soft font-semibold">{key.charAt(0).toUpperCase() + key.slice(1)}:</b> {value}
              <button
                onClick={() => {
                  const newFilters = { ...filters };
                  delete newFilters[key];
                  setFilters(newFilters);
                }}
                className="w-4 h-4 rounded-full bg-cream flex items-center justify-center hover:bg-marigold/20"
              >
                <X size={10} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Results */}
      {uniqueGuestIds.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-5">
          {/* Guest List */}
          <div className="bg-paper border border-line rounded-xl p-4 shadow-md max-h-[500px] overflow-y-auto">
            <div className="space-y-2">
              {uniqueGuestIds.map(id => {
                const guest = getGuest(id);
                if (!guest) return null;
                const guestGifts = getGuestGifts(id);
                const weddingsCount = new Set(guestGifts.map(g => g.weddingId)).size;
                const isActive = selectedGuestId === id;
                return (
                  <div
                    key={id}
                    onClick={() => setSelectedGuestId(id)}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      isActive ? 'border-maroon bg-maroon/5' : 'border-line hover:border-marigold'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-mehendi text-white flex items-center justify-center font-['Fraunces'] font-semibold text-sm flex-shrink-0">
                      {guest.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <b className="text-sm block">{guest.name}</b>
                      <span className="text-xs text-ink-soft">
                        {guest.household || 'No household'} · {guest.relation || 'No relation'}
                      </span>
                    </div>
                    <div className="font-['IBM_Plex_Mono'] text-xs bg-marigold text-maroon-deep px-2.5 py-1 rounded-full font-bold">
                      {weddingsCount} {weddingsCount === 1 ? 'wedding' : 'weddings'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-paper border border-line rounded-xl p-5 shadow-md">
            {selectedGuest ? (
              <>
                <div className="flex items-center gap-3 pb-4 mb-4 border-b border-dashed border-line">
                  <div className="w-11 h-11 rounded-full bg-mehendi text-white flex items-center justify-center font-['Fraunces'] font-semibold text-lg flex-shrink-0">
                    {selectedGuest.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-['Fraunces'] text-xl font-semibold text-maroon-deep">{selectedGuest.name}</h3>
                    <span className="text-xs text-ink-soft">
                      {selectedGuest.household || 'No household'} · seen at {new Set(selectedGifts.map(g => g.weddingId)).size} weddings
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  {selectedGifts.map((gift, index) => {
                    const wedding = getWedding(gift.weddingId);
                    const isLast = index === selectedGifts.length - 1;
                    return (
                      <div key={gift.id} className={`relative pl-6 pb-4 ${!isLast ? 'border-l-2 border-line' : ''}`}>
                        <div className={`absolute left-[-7px] top-1 w-3 h-3 rounded-full bg-marigold border-2 border-paper shadow-[0_0_0_2px_#F2971D]`} />
                        <div className="text-[10px] uppercase tracking-wider text-gold font-bold">
                          {wedding?.name || 'Unknown Wedding'} · {wedding ? new Date(wedding.date).getFullYear() : ''}
                        </div>
                        <div className="font-['IBM_Plex_Mono'] text-lg font-semibold text-maroon-deep">
                          ₹{gift.amount?.toLocaleString() || '0'} {gift.type === 'gift' ? '🎁' : gift.type === 'both' ? '💰🎁' : '💰'}
                        </div>
                        {gift.description && (
                          <div className="text-sm text-ink-soft mt-0.5">+ {gift.description}</div>
                        )}
                        {gift.notes && (
                          <div className="text-xs text-ink-soft mt-1 italic">📝 {gift.notes}</div>
                        )}
                        {gift.photo && (
                          <div className="mt-2">
                            <img
                              src={gift.photo}
                              alt="Gift"
                              className="w-16 h-16 object-cover rounded-lg border border-line"
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-cream mx-auto flex items-center justify-center mb-4">
                  <Users size={32} className="text-marigold-deep" />
                </div>
                <p className="text-ink-soft text-sm">Select a guest from the list to see their timeline</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <EmptyState type="no-results" />
      )}

      {/* Stats Strip - 5 columns */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-5">
        <div className="bg-paper border border-line rounded-xl p-4 text-center shadow-md">
          <b className="font-['IBM_Plex_Mono'] text-2xl text-maroon block">{totalGifts}</b>
          <span className="text-[10px] text-ink-soft uppercase tracking-wider">Gifts recorded</span>
        </div>
        <div className="bg-paper border border-line rounded-xl p-4 text-center shadow-md">
          <b className="font-['IBM_Plex_Mono'] text-2xl text-maroon block">₹{totalCash.toLocaleString()}</b>
          <span className="text-[10px] text-ink-soft uppercase tracking-wider">Total cash</span>
        </div>
        <div className="bg-paper border border-line rounded-xl p-4 text-center shadow-md">
          <b className="font-['IBM_Plex_Mono'] text-2xl text-maroon block">{cashRatio}%</b>
          <span className="text-[10px] text-ink-soft uppercase tracking-wider">Cash ratio</span>
        </div>
        <div className="bg-paper border border-line rounded-xl p-4 text-center shadow-md">
          <b className="font-['IBM_Plex_Mono'] text-2xl text-maroon block">{repeatGuests}</b>
          <span className="text-[10px] text-ink-soft uppercase tracking-wider">Repeat guests</span>
        </div>
        <div className="bg-paper border border-line rounded-xl p-4 text-center shadow-md">
          <b className="font-['IBM_Plex_Mono'] text-2xl text-maroon block">8.4s</b>
          <span className="text-[10px] text-ink-soft uppercase tracking-wider">Avg entry time</span>
        </div>
      </div>
    </div>
  );
};