import React from 'react';
import { Search, MapPin, TrendingUp, Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'popular' | 'recent' | 'trending' | 'destination';
  icon?: React.ReactNode;
  category?: string;
  count?: number;
}

interface SearchSuggestionsProps {
  suggestions?: SearchSuggestion[];
  onSuggestionClick: (suggestion: string) => void;
  isVisible: boolean;
  searchQuery?: string;
  className?: string;
}

const defaultSuggestions: SearchSuggestion[] = [
  // Popular destinations
  { id: '1', text: 'Goa beaches', type: 'popular', icon: <MapPin className="h-4 w-4" />, category: 'Destinations' },
  { id: '2', text: 'Kerala backwaters', type: 'popular', icon: <MapPin className="h-4 w-4" />, category: 'Destinations' },
  { id: '3', text: 'Himachal Pradesh mountains', type: 'popular', icon: <MapPin className="h-4 w-4" />, category: 'Destinations' },
  { id: '4', text: 'Rajasthan heritage tours', type: 'popular', icon: <MapPin className="h-4 w-4" />, category: 'Destinations' },
  
  // Trending searches
  { id: '5', text: 'solo female travel India', type: 'trending', icon: <TrendingUp className="h-4 w-4" />, category: 'Safety' },
  { id: '6', text: 'accessible travel destinations', type: 'trending', icon: <TrendingUp className="h-4 w-4" />, category: 'Accessibility' },
  { id: '7', text: 'budget backpacking trips', type: 'trending', icon: <TrendingUp className="h-4 w-4" />, category: 'Budget' },
  { id: '8', text: 'weekend getaways near Delhi', type: 'trending', icon: <TrendingUp className="h-4 w-4" />, category: 'Destinations' },
  
  // Recent popular
  { id: '9', text: 'Manali adventure sports', type: 'popular', icon: <Star className="h-4 w-4" />, category: 'Adventure' },
  { id: '10', text: 'Rishikesh yoga retreats', type: 'popular', icon: <Star className="h-4 w-4" />, category: 'Wellness' },
  { id: '11', text: 'Mumbai food tours', type: 'popular', icon: <Star className="h-4 w-4" />, category: 'Food' },
  { id: '12', text: 'Jaipur cultural experiences', type: 'popular', icon: <Star className="h-4 w-4" />, category: 'Culture' }
];

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  suggestions = defaultSuggestions,
  onSuggestionClick,
  isVisible,
  searchQuery = '',
  className = ''
}) => {
  // Filter suggestions based on search query
  const filteredSuggestions = searchQuery 
    ? suggestions.filter(suggestion => 
        suggestion.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        suggestion.category?.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 8)
    : suggestions.slice(0, 12);

  // Group suggestions by category for better organization
  const groupedSuggestions = filteredSuggestions.reduce((acc, suggestion) => {
    const category = suggestion.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(suggestion);
    return acc;
  }, {} as Record<string, SearchSuggestion[]>);

  if (!isVisible || filteredSuggestions.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className={`absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden ${className}`}
    >
      <div className="max-h-96 overflow-y-auto">
        {/* Header */}
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Search className="h-4 w-4" />
            <span>{searchQuery ? 'Search suggestions' : 'Popular searches'}</span>
          </div>
        </div>

        {/* Suggestions */}
        <div className="py-2">
          {Object.entries(groupedSuggestions).map(([category, categorySuggestions]) => (
            <div key={category}>
              {Object.keys(groupedSuggestions).length > 1 && (
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-50">
                  {category}
                </div>
              )}
              {categorySuggestions.map((suggestion, index) => (
                <motion.button
                  key={suggestion.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => onSuggestionClick(suggestion.text)}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left group"
                >
                  <div className="flex-shrink-0 text-gray-400 group-hover:text-gray-600">
                    {suggestion.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-gray-900 truncate">
                      {searchQuery ? (
                        <span>
                          {suggestion.text.split(new RegExp(`(${searchQuery})`, 'gi')).map((part, i) =>
                            part.toLowerCase() === searchQuery.toLowerCase() ? (
                              <mark key={i} className="bg-yellow-200 text-gray-900">{part}</mark>
                            ) : (
                              part
                            )
                          )}
                        </span>
                      ) : (
                        suggestion.text
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0 flex items-center gap-1">
                    {suggestion.type === 'trending' && (
                      <div className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                        Trending
                      </div>
                    )}
                    {suggestion.type === 'popular' && (
                      <div className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        Popular
                      </div>
                    )}
                    {suggestion.count && (
                      <span className="text-xs text-gray-400">
                        {suggestion.count}+ searches
                      </span>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Press Tab to navigate</span>
            <span>Enter to search</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SearchSuggestions;
