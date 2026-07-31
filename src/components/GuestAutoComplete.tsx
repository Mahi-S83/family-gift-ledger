import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { findMatchingGuests } from '../services/matchingServices';

interface GuestAutocompleteProps {
  onSelect: (guestId: string | null) => void;
  weddingId: string;
}

export const GuestAutocomplete: React.FC<GuestAutocompleteProps> = ({ onSelect, weddingId }) => {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const { guests, gifts, weddings } = useData();

  useEffect(() => {
    if (input.length < 2) {
      setSuggestions([]);
      return;
    }

    const matches = findMatchingGuests(input, guests, gifts, weddings);
    setSuggestions(matches.slice(0, 3));
  }, [input, guests, gifts, weddings]);

  const handleSelect = (suggestion: any) => {
    onSelect(suggestion.guest.id);
    setInput(suggestion.guest.name);
    setSuggestions([]);
  };

  const handleAddNew = () => {
    onSelect(null);
    setSuggestions([]);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Start typing guest name..."
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        onFocus={() => setIsTyping(true)}
        onBlur={() => setTimeout(() => setIsTyping(false), 200)}
      />
      
      {isTyping && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.guest.id}
              className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-0"
              onMouseDown={() => handleSelect(suggestion)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium">{suggestion.guest.name}</div>
                  {suggestion.guest.household && (
                    <div className="text-sm text-gray-500">{suggestion.guest.household}</div>
                  )}
                </div>
                <div className="text-sm text-blue-600">
                  {suggestion.weddingName && `Last: ${suggestion.weddingName}`}
                  {suggestion.lastGift?.amount && `, ₹${suggestion.lastGift.amount}`}
                </div>
              </div>
              <div className="mt-1 flex gap-2">
                <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                  Match: {Math.round(suggestion.score * 100)}%
                </span>
                {suggestion.guest.relation && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                    {suggestion.guest.relation}
                  </span>
                )}
              </div>
            </div>
          ))}
          <div
            className="p-3 text-blue-600 hover:bg-blue-50 cursor-pointer rounded-b-lg"
            onMouseDown={handleAddNew}
          >
            + Add as new guest
          </div>
        </div>
      )}
    </div>
  );
};