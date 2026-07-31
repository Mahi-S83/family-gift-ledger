import React, { useState } from 'react';
import { DataProvider, useData } from './context/DataContext';
import { AddGiftForm } from './components/AddGiftForm';
import { SearchInterface } from './components/SearchInterface';

// Add this after the header section
const { guests, gifts } = useData();
const totalGifts = gifts.length;
const totalCash = gifts.reduce((sum, g) => sum + (g.amount || 0), 0);
const uniqueGuests = guests.length;

<div className="flex gap-4 text-sm text-gray-600">
  <span>👥 {uniqueGuests} Guests</span>
  <span>🎁 {totalGifts} Gifts</span>
  <span>💰 ₹{totalCash.toLocaleString()}</span>
</div>

const AppContent: React.FC = () => {
  const [selectedWeddingId, setSelectedWeddingId] = useState('w1');
  const [view, setView] = useState<'add' | 'search'>('add');
  const [refreshKey, setRefreshKey] = useState(0);
  const { weddings } = useData();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Family Gift Ledger</h1>
            <div className="flex gap-2 mt-1">
              <select
                value={selectedWeddingId}
                onChange={(e) => setSelectedWeddingId(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm"
              >
                {weddings.map(w => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setView('add')}
              className={`px-4 py-2 rounded-lg font-medium ${
                view === 'add' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Add Gift
            </button>
            <button
              onClick={() => setView('search')}
              className={`px-4 py-2 rounded-lg font-medium ${
                view === 'search' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Search
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {view === 'add' ? (
          <AddGiftForm 
            weddingId={selectedWeddingId} 
            onGiftAdded={() => setRefreshKey(prev => prev + 1)}
          />
        ) : (
          <SearchInterface />
        )}
      </main>
    </div>
  );
};

function App() {
  return (
    <DataProvider>
      <AppContent />
    </DataProvider>
  );
}

export default App;