import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { GuestAutocomplete } from './GuestAutoComplete';

interface AddGiftFormProps {
  weddingId: string;
  onGiftAdded: () => void;
}

const RELATIONS = ['Bua', 'Chacha', 'Chachi', 'Tau', 'Tai', 'Mama', 'Mami', 'Dadi', 'Nani', 'Friend', 'Colleague', 'Other'];

export const AddGiftForm: React.FC<AddGiftFormProps> = ({ weddingId, onGiftAdded }) => {
  const { addGuest, addGift, guests } = useData();
  const [selectedGuestId, setSelectedGuestId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    household: '',
    relation: '',
    giftType: 'cash' as 'cash' | 'gift' | 'both',
    amount: '',
    description: '',
    notes: '',
  });

  const handleGuestSelect = (guestId: string | null) => {
    setSelectedGuestId(guestId);
    if (guestId === null) {
      // New guest
      setFormData(prev => ({ ...prev, name: '', household: '', relation: '' }));
    } else {
      const guest = guests.find(g => g.id === guestId);
      if (guest) {
        setFormData(prev => ({
          ...prev,
          name: guest.name,
          household: guest.household || '',
          relation: guest.relation || '',
        }));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let guestId = selectedGuestId;
    
    // If no guest selected, create new guest
    if (!guestId) {
      const newGuest = {
        id: `g${Date.now()}`,
        name: formData.name,
        household: formData.household || undefined,
        relation: formData.relation || undefined,
      };
      addGuest(newGuest);
      guestId = newGuest.id;
    }

    // Add gift
    const newGift = {
      id: `gt${Date.now()}`,
      guestId: guestId!,
      weddingId,
      type: formData.giftType,
      amount: formData.amount ? parseFloat(formData.amount) : undefined,
      description: formData.description || undefined,
      notes: formData.notes || undefined,
    };
    
    addGift(newGift);
    onGiftAdded();
    
    // Reset form
    setSelectedGuestId(null);
    setFormData({
      name: '',
      household: '',
      relation: '',
      giftType: 'cash',
      amount: '',
      description: '',
      notes: '',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-800">Add New Gift</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Guest Name (start typing for AI matching)
        </label>
        <GuestAutocomplete onSelect={handleGuestSelect} weddingId={weddingId} />
      </div>

      {selectedGuestId === null && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Household</label>
            <input
              type="text"
              value={formData.household}
              onChange={(e) => setFormData({ ...formData, household: e.target.value })}
              placeholder="e.g., Sharma Family"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Relation</label>
          <select
            value={formData.relation}
            onChange={(e) => setFormData({ ...formData, relation: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Select</option>
            {RELATIONS.map(rel => (
              <option key={rel} value={rel}>{rel}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Gift Type</label>
          <select
            value={formData.giftType}
            onChange={(e) => setFormData({ ...formData, giftType: e.target.value as any })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="cash">Cash</option>
            <option value="gift">Gift</option>
            <option value="both">Both</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount (₹)
          </label>
          <input
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            placeholder="e.g., 5000"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <input
          type="text"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="e.g., Silver dinner set"
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        Add Gift (Recorded in under 10s)
      </button>
    </form>
  );
};