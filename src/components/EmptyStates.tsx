import React from 'react';
import { Gift, Users, Search, Calendar } from 'lucide-react';

interface EmptyStateProps {
  type: 'no-weddings' | 'no-gifts' | 'no-results';
  action?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ type, action }) => {
  const configs = {
    'no-weddings': {
      icon: Calendar,
      title: 'No Weddings Added Yet',
      description: 'Start by adding your first family wedding to begin tracking gifts.',
      buttonText: 'Add Your First Wedding',
    },
    'no-gifts': {
      icon: Gift,
      title: 'No Gifts Recorded Yet',
      description: 'This wedding doesn\'t have any gifts recorded yet. Start adding gifts to build your family history.',
      buttonText: 'Add First Gift',
    },
    'no-results': {
      icon: Search,
      title: 'No Results Found',
      description: 'We couldn\'t find any matches for your search. Try different keywords or browse your guest list.',
      buttonText: 'Browse All Guests',
    },
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <div className="bg-paper border border-line rounded-xl p-12 text-center shadow-md">
      <div className="w-20 h-20 rounded-full bg-cream mx-auto flex items-center justify-center mb-4">
        <Icon size={40} className="text-marigold-deep" />
      </div>
      <h3 className="font-['Fraunces'] text-2xl font-semibold text-maroon-deep mb-2">
        {config.title}
      </h3>
      <p className="text-ink-soft text-sm max-w-md mx-auto mb-6">
        {config.description}
      </p>
      {action && (
        <button
          onClick={action}
          className="px-6 py-3 rounded-xl bg-maroon text-white font-['Fraunces'] font-semibold shadow-lg shadow-maroon/30 hover:bg-maroon-deep transition-colors"
        >
          {config.buttonText}
        </button>
      )}
    </div>
  );
};