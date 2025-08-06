import React, { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import Input, { InputProps } from './Input';
import SearchSuggestions from './SearchSuggestions';
import { AnimatePresence } from 'framer-motion';

interface SearchInputProps extends Omit<InputProps, 'leftIcon'> {
  suggestions?: Array<{
    id: string;
    text: string;
    type: 'popular' | 'recent' | 'trending' | 'destination';
    icon?: React.ReactNode;
    category?: string;
    count?: number;
  }>;
  showSuggestionsOnFocus?: boolean;
  onSuggestionSelect?: (suggestion: string) => void;
  onSearch?: (query: string) => void;
  debounceMs?: number;
}

const SearchInput: React.FC<SearchInputProps> = ({
  suggestions,
  showSuggestionsOnFocus = true,
  onSuggestionSelect,
  onSearch,
  debounceMs = 300,
  value = '',
  onChange,
  onFocus,
  onBlur,
  placeholder = "Search destinations, experiences, or activities...",
  className = '',
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchValue, setSearchValue] = useState(value as string);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Handle input change with debouncing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchValue(newValue);
    
    // Call parent onChange immediately for controlled components
    onChange?.(e);

    // Debounce the search callback
    if (onSearch && debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    if (onSearch) {
      debounceRef.current = setTimeout(() => {
        onSearch(newValue);
      }, debounceMs);
    }

    // Show suggestions when typing
    if (newValue.trim() || showSuggestionsOnFocus) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  // Handle focus
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    if (showSuggestionsOnFocus) {
      setShowSuggestions(true);
    }
    onFocus?.(e);
  };

  // Handle blur
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    // Delay hiding suggestions to allow for suggestion clicks
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
    onBlur?.(e);
  };

  // Handle suggestion selection
  const handleSuggestionClick = (suggestion: string) => {
    setSearchValue(suggestion);
    setShowSuggestions(false);
    
    // Create synthetic event for controlled components
    const syntheticEvent = {
      target: { value: suggestion },
      currentTarget: { value: suggestion }
    } as React.ChangeEvent<HTMLInputElement>;
    
    onChange?.(syntheticEvent);
    onSuggestionSelect?.(suggestion);
    onSearch?.(suggestion);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchValue.trim()) {
      e.preventDefault();
      setShowSuggestions(false);
      onSearch?.(searchValue);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  // Sync external value changes
  useEffect(() => {
    setSearchValue(value as string);
  }, [value]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <Input
        {...props}
        value={searchValue}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        leftIcon={<Search className="h-5 w-5" />}
        className={`transition-all duration-200 ${
          isFocused ? 'ring-2 ring-primary-500/20' : ''
        }`}
      />
      
      <AnimatePresence>
        {showSuggestions && (
          <SearchSuggestions
            suggestions={suggestions}
            onSuggestionClick={handleSuggestionClick}
            isVisible={showSuggestions}
            searchQuery={searchValue}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchInput;
