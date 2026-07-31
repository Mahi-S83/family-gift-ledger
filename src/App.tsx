import React, { useState } from 'react';
import { DataProvider, useData } from './context/DataContext';
import { WeddingList } from './components/WeddingList';
import { AddGift } from './components/AddGift';
import { SearchTimeline } from './components/SearchTimeline';
import { Garland } from './components/Garland';

const AppContent: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState<'weddings' | 'add' | 'search'>('weddings');
  const [selectedWeddingId, setSelectedWeddingId] = useState('w1');
  const { weddings } = useData();
  const selectedWedding = weddings.find(w => w.id === selectedWeddingId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-marigold to-maroon flex items-center justify-center shadow-lg">
            <span className="font-['Fraunces'] text-paper text-xl font-bold">FG</span>
          </div>
          <div>
            <h1 className="font-['Fraunces'] text-2xl font-bold text-maroon-deep">Family Gift Ledger</h1>
            <span className="text-xs text-ink-soft uppercase tracking-wider">Every shaadi, remembered</span>
          </div>
        </div>

        <div className="flex gap-1.5 bg-paper p-1.5 rounded-xl border border-line shadow-md">
          {[
            { id: 'weddings', label: 'Weddings' },
            { id: 'add', label: 'Add Gift' },
            { id: 'search', label: 'Search & Timeline' }
          ].map(screen => (
            <button
              key={screen.id}
              onClick={() => setActiveScreen(screen.id as any)}
              className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                activeScreen === screen.id
                  ? 'bg-maroon text-white shadow-lg shadow-maroon/35'
                  : 'text-ink-soft hover:text-maroon'
              }`}
            >
              {screen.label}
            </button>
          ))}
        </div>
      </header>

      <Garland />

      <div className="mt-6">
        {activeScreen === 'weddings' && (
          <WeddingList
            selectedWeddingId={selectedWeddingId}
            onSelectWedding={setSelectedWeddingId}
          />
        )}
        {activeScreen === 'add' && selectedWedding && (
          <AddGift wedding={selectedWedding} />
        )}
        {activeScreen === 'search' && (
          <SearchTimeline />
        )}
      </div>
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