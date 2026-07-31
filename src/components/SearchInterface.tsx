import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { parseNaturalQuery, searchGifts, SearchFilters } from '../services/searchServices';

export const SearchInterface: React.FC = () => {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [results, setResults] = useState<any[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const { gifts, guests, weddings } = useData();

  const handleSearch = () => {
    const parsed = parseNaturalQuery(query);
    setFilters(parsed);
    setShowFilters(true);
    
    const searchResults = searchGifts(parsed, gifts, guests, weddings);
    setResults(searchResults);
  };

  const getGuestName = (guestId: string) => {
    return guests.find(g => g.id === guestId)?.name || 'Unknown';
  };

  const getWeddingName = (weddingId: string) => {
    return weddings.find(w => w.id === weddingId)?.name || 'Unknown';
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Ask About Gifts</h3>
      
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g., What did Bua give? or Show gifts above ₹5000"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button
          onClick={handleSearch}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      {showFilters && Object.keys(filters).length > 0 && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">AI Interpretation:</p>
          <div className="flex flex-wrap gap-2">
            {filters.relation && (
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                Relation: {filters.relation}
              </span>
            )}
            {filters.minAmount && (
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                Min: ₹{filters.minAmount}
              </span>
            )}
            {filters.weddingId && (
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                Wedding: {getWeddingName(filters.weddingId)}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-1">Edit filters below if needed</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="mt-6">
          <p className="text-sm text-gray-600 mb-3">Found {results.length} gifts</p>
          <div className="space-y-3">
            {results.map(gift => {
              const guest = guests.find(g => g.id === gift.guestId);
              return (
                <div key={gift.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{guest?.name}</p>
                      <p className="text-sm text-gray-500">
                        {guest?.relation && `${guest.relation} · `}
                        {getWeddingName(gift.weddingId)}
                      </p>
                    </div>
                    <div className="text-right">
                      {gift.amount && (
                        <p className="font-semibold text-blue-600">₹{gift.amount}</p>
                      )}
                      {gift.description && (
                        <p className="text-sm text-gray-600">{gift.description}</p>
                      )}
                      <span className="text-xs text-gray-400 capitalize">{gift.type}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};