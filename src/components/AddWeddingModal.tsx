import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useData } from '../context/DataContext';

interface AddWeddingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddWeddingModal: React.FC<AddWeddingModalProps> = ({ isOpen, onClose }) => {
  const { addWedding } = useData();
  const [formData, setFormData] = useState({
    bride: '',
    groom: '',
    date: '',
    city: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const weddingName = `${formData.bride} weds ${formData.groom}`;
    const newWedding = {
      id: `w${Date.now()}`,
      name: weddingName,
      bride: formData.bride,
      groom: formData.groom,
      date: formData.date,
      city: formData.city || undefined,
    };
    
    addWedding(newWedding);
    setFormData({ bride: '', groom: '', date: '', city: '' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-paper rounded-xl max-w-md w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-cream rounded-full transition-colors"
        >
          <X size={20} />
        </button>
        
        <h2 className="font-['Fraunces'] text-2xl font-semibold text-maroon-deep mb-2">
          Add New Wedding
        </h2>
        <p className="text-ink-soft text-sm mb-6">
          Enter the details of the wedding you want to track.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-maroon-deep uppercase tracking-wider mb-1.5">
              Bride's Name
            </label>
            <input
              type="text"
              value={formData.bride}
              onChange={(e) => setFormData({ ...formData, bride: e.target.value })}
              placeholder="e.g., Neha"
              className="w-full px-4 py-3 rounded-lg border border-line bg-white text-ink text-sm focus:outline-none focus:border-marigold-deep focus:ring-2 focus:ring-marigold/20"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-maroon-deep uppercase tracking-wider mb-1.5">
              Groom's Name
            </label>
            <input
              type="text"
              value={formData.groom}
              onChange={(e) => setFormData({ ...formData, groom: e.target.value })}
              placeholder="e.g., Rahul"
              className="w-full px-4 py-3 rounded-lg border border-line bg-white text-ink text-sm focus:outline-none focus:border-marigold-deep focus:ring-2 focus:ring-marigold/20"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-maroon-deep uppercase tracking-wider mb-1.5">
              Wedding Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-line bg-white text-ink text-sm focus:outline-none focus:border-marigold-deep focus:ring-2 focus:ring-marigold/20"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-maroon-deep uppercase tracking-wider mb-1.5">
              City <span className="font-normal text-ink-soft normal-case">(optional)</span>
            </label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              placeholder="e.g., Delhi"
              className="w-full px-4 py-3 rounded-lg border border-line bg-white text-ink text-sm focus:outline-none focus:border-marigold-deep focus:ring-2 focus:ring-marigold/20"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-maroon text-white font-['Fraunces'] font-semibold text-base shadow-lg shadow-maroon/30 hover:bg-maroon-deep transition-colors"
          >
            Create Wedding
          </button>
        </form>
      </div>
    </div>
  );
};