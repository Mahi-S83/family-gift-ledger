import React, { useState, useRef, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { findMatchingGuests } from '../services/matchingServices';
import { Wedding } from '../types';
import { Camera, X } from 'lucide-react';
import { EmptyState } from './EmptyStates';

interface AddGiftProps {
  wedding: Wedding;
}

const RELATIONS = ['Bua', 'Chacha', 'Chachi', 'Tau', 'Tai', 'Mama', 'Mami', 'Dadi', 'Nani', 'Friend', 'Colleague', 'Other'];

export const AddGift: React.FC<AddGiftProps> = ({ wedding }) => {
  const { guests, gifts, addGuest, addGift } = useData();
  const [formData, setFormData] = useState({
    name: '',
    household: '',
    relation: '',
    giftType: 'cash' as 'cash' | 'gift' | 'both',
    amount: '',
    description: '',
    photo: '',
    notes: '',
  });
  const [selectedGuestId, setSelectedGuestId] = useState<string | null>(null);
  const [showMatch, setShowMatch] = useState(false);
  const [matches, setMatches] = useState<any[]>([]);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (formData.name.length >= 3) {
      const results = findMatchingGuests(formData.name, guests, gifts, [wedding]);
      setMatches(results);
      setShowMatch(results.length > 0);
    } else {
      setShowMatch(false);
    }
  }, [formData.name, guests, gifts, wedding]);

  const handleMatchSelect = (guestId: string) => {
    const guest = guests.find(g => g.id === guestId);
    if (guest) {
      setSelectedGuestId(guestId);
      setFormData(prev => ({
        ...prev,
        name: guest.name,
        household: guest.household || '',
        relation: guest.relation || '',
      }));
      setShowMatch(false);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPhotoPreview(base64String);
        setFormData(prev => ({ ...prev, photo: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhotoPreview(null);
    setFormData(prev => ({ ...prev, photo: '' }));
    if (photoInputRef.current) {
      photoInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let guestId = selectedGuestId;
    
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

    const newGift = {
      id: `gt${Date.now()}`,
      guestId: guestId!,
      weddingId: wedding.id,
      type: formData.giftType,
      amount: formData.amount ? parseFloat(formData.amount) : undefined,
      description: formData.description || undefined,
      photo: formData.photo || undefined,
      notes: formData.notes || undefined,
    };
    
    addGift(newGift);
    
    setFormData({
      name: '',
      household: '',
      relation: '',
      giftType: 'cash',
      amount: '',
      description: '',
      photo: '',
      notes: '',
    });
    setSelectedGuestId(null);
    setShowMatch(false);
    setPhotoPreview(null);
    if (photoInputRef.current) {
      photoInputRef.current.value = '';
    }
    inputRef.current?.focus();
  };

  const previewAmount = formData.amount ? parseInt(formData.amount) : 0;
  // If no guests exist yet, show a helpful message
if (guests.length === 0 && !formData.name) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-4 flex-wrap gap-2">
        <div>
          <h2 className="font-['Fraunces'] text-3xl font-semibold text-maroon-deep">Add a Gift</h2>
          <p className="text-ink-soft text-sm">{wedding.name} · {new Date(wedding.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
        </div>
      </div>
      <EmptyState 
        type="no-gifts" 
        action={() => {
          // Focus the guest name input
          setTimeout(() => inputRef.current?.focus(), 100);
        }} 
      />
    </div>
  );
}
  return (
    <div>
      <div className="flex items-baseline justify-between mb-4 flex-wrap gap-2">
        <div>
          <h2 className="font-['Fraunces'] text-3xl font-semibold text-maroon-deep">Add a Gift</h2>
          <p className="text-ink-soft text-sm">{wedding.name} · {new Date(wedding.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.8fr] gap-6">
        <div className="bg-paper rounded-xl border border-line p-6 shadow-md">
          <div className="inline-flex items-center gap-2 bg-mehendi text-white text-xs font-bold px-3 py-1.5 rounded-full mb-4 font-['IBM_Plex_Mono']">
            <span className="timer-pulse">●</span>
            Target: under 10 seconds
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <label className="block text-xs font-bold text-maroon-deep uppercase tracking-wider mb-1.5">
                Guest Name
              </label>
              <input
                ref={inputRef}
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Start typing a name…"
                className="w-full px-4 py-3 rounded-lg border border-line bg-white text-ink text-sm focus:outline-none focus:border-marigold-deep focus:ring-2 focus:ring-marigold/20"
                required
              />

              {showMatch && matches.length > 0 && (
                <div className="mt-2 bg-gradient-to-br from-marigold/10 to-maroon/5 border border-gold/40 rounded-xl p-3 flex items-center gap-3 match-card">
                  <div className="w-9 h-9 rounded-full bg-maroon text-white flex items-center justify-center font-['Fraunces'] font-semibold text-sm flex-shrink-0">
                    {matches[0].guest.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <b className="text-sm text-ink block">{matches[0].guest.name}</b>
                    <div className="text-xs text-ink-soft">
                      Last seen · {matches[0].weddingName || 'Previous wedding'} · {matches[0].guest.household || 'No household'}
                    </div>
                  </div>
                  <div className="flex gap-1.5 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => handleMatchSelect(matches[0].guest.id)}
                      className="text-xs font-bold px-3 py-1.5 rounded-lg bg-mehendi text-white"
                    >
                      Use existing
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowMatch(false)}
                      className="text-xs font-bold px-3 py-1.5 rounded-lg border border-line text-ink-soft"
                    >
                      Create new
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-maroon-deep uppercase tracking-wider mb-1.5">
                Household / Family <span className="font-normal text-ink-soft normal-case">(optional)</span>
              </label>
              <input
                type="text"
                value={formData.household}
                onChange={(e) => setFormData({ ...formData, household: e.target.value })}
                placeholder="e.g., Sharma Family"
                className="w-full px-4 py-3 rounded-lg border border-line bg-white text-ink text-sm focus:outline-none focus:border-marigold-deep focus:ring-2 focus:ring-marigold/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-maroon-deep uppercase tracking-wider mb-1.5">
                Relation Tag
              </label>
              <div className="flex flex-wrap gap-2">
                {RELATIONS.map(rel => (
                  <button
                    key={rel}
                    type="button"
                    onClick={() => setFormData({ ...formData, relation: rel })}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                      formData.relation === rel
                        ? 'bg-marigold border-marigold-deep text-maroon-deep'
                        : 'bg-white border-line text-ink-soft hover:border-marigold'
                    }`}
                  >
                    {rel}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-maroon-deep uppercase tracking-wider mb-1.5">
                Gift Type
              </label>
              <div className="flex gap-2.5">
                {['cash', 'gift', 'both'].map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData({ ...formData, giftType: type as any })}
                    className={`flex-1 py-2.5 rounded-lg border text-sm font-bold capitalize transition-all ${
                      formData.giftType === type
                        ? 'border-maroon bg-maroon/5 text-maroon-deep'
                        : 'border-line text-ink-soft hover:border-marigold'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-maroon-deep uppercase tracking-wider mb-1.5">
                Amount
              </label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="e.g., 5100"
                className="w-full px-4 py-3 rounded-lg border border-line bg-white text-ink text-sm focus:outline-none focus:border-marigold-deep focus:ring-2 focus:ring-marigold/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-maroon-deep uppercase tracking-wider mb-1.5">
                Description <span className="font-normal text-ink-soft normal-case">(optional)</span>
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="e.g., Silver dinner set"
                className="w-full px-4 py-3 rounded-lg border border-line bg-white text-ink text-sm focus:outline-none focus:border-marigold-deep focus:ring-2 focus:ring-marigold/20"
              />
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block text-xs font-bold text-maroon-deep uppercase tracking-wider mb-1.5">
                Photo <span className="font-normal text-ink-soft normal-case">(optional)</span>
              </label>
              <div className="flex items-center gap-3">
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="photo-upload"
                />
                <label
                  htmlFor="photo-upload"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-line bg-white text-ink-soft text-sm font-medium hover:border-marigold cursor-pointer transition-colors"
                >
                  <Camera size={18} />
                  Upload Photo
                </label>
                {photoPreview && (
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              {photoPreview && (
                <div className="mt-2">
                  <img
                    src={photoPreview}
                    alt="Gift preview"
                    className="w-24 h-24 object-cover rounded-lg border border-line"
                  />
                </div>
              )}
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-bold text-maroon-deep uppercase tracking-wider mb-1.5">
                Notes <span className="font-normal text-ink-soft normal-case">(optional)</span>
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Any additional notes about this gift..."
                rows={2}
                className="w-full px-4 py-3 rounded-lg border border-line bg-white text-ink text-sm focus:outline-none focus:border-marigold-deep focus:ring-2 focus:ring-marigold/20 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-maroon text-white font-['Fraunces'] font-semibold text-base shadow-lg shadow-maroon/30 hover:bg-maroon-deep transition-colors"
            >
              Save Gift & Add Next →
            </button>
          </form>
        </div>

        <div className="bg-paper rounded-xl border border-line p-6 shadow-md">
          <p className="font-['Fraunces'] text-base text-maroon-deep font-semibold mb-4">Entry preview</p>
          
          <div className="relative bg-gradient-to-br from-marigold to-marigold-deep rounded-xl p-5 text-maroon-deep overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-white/30 to-transparent" />
            <div className="relative">
              <small className="uppercase tracking-wider font-bold text-[10px] opacity-75">Shagun received</small>
              <div className="font-['IBM_Plex_Mono'] text-3xl font-semibold mt-1">
                ₹{previewAmount.toLocaleString()}
              </div>
              <div className="font-['Fraunces'] text-lg mt-2">
                from {formData.name || 'Guest Name'}
                {formData.relation && ` · ${formData.relation}`}
              </div>
              {formData.notes && (
                <div className="mt-2 text-sm opacity-80 border-t border-maroon-deep/20 pt-2">
                  📝 {formData.notes}
                </div>
              )}
              {photoPreview && (
                <div className="mt-2">
                  <img
                    src={photoPreview}
                    alt="Gift preview"
                    className="w-16 h-16 object-cover rounded-lg border-2 border-white/30"
                  />
                </div>
              )}
            </div>
          </div>

          <p className="text-xs text-ink-soft leading-relaxed mt-4 pt-3 border-t border-dashed border-line">
            AI matched this name against every wedding your family has recorded. Nothing merges automatically —
            the recorder always confirms before the guest is linked to past history.
          </p>
        </div>
      </div>
    </div>
  );
};