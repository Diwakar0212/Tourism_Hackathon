import React, { useState } from 'react';

interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultOpen?: string[];
  className?: string;
  variant?: 'default' | 'bordered' | 'filled';
}

const Accordion: React.FC<AccordionProps> = ({
  items,
  allowMultiple = false,
  defaultOpen = [],
  className = '',
  variant = 'default'
}) => {
  const [openItems, setOpenItems] = useState<string[]>(defaultOpen);

  const toggleItem = (itemId: string) => {
    const item = items.find(item => item.id === itemId);
    if (item?.disabled) return;

    setOpenItems(prev => {
      if (allowMultiple) {
        return prev.includes(itemId)
          ? prev.filter(id => id !== itemId)
          : [...prev, itemId];
      } else {
        return prev.includes(itemId) ? [] : [itemId];
      }
    });
  };

  const getContainerClasses = () => {
    switch (variant) {
      case 'bordered':
        return 'border border-gray-200 rounded-lg divide-y divide-gray-200';
      case 'filled':
        return 'bg-gray-50 rounded-lg divide-y divide-gray-200';
      default:
        return 'divide-y divide-gray-200';
    }
  };

  const getItemClasses = (disabled: boolean) => {
    const baseClasses = 'transition-colors';
    
    switch (variant) {
      case 'bordered':
      case 'filled':
        return `${baseClasses} ${disabled ? 'opacity-50' : ''}`;
      default:
        return `${baseClasses} border border-gray-200 rounded-lg mb-2 ${
          disabled ? 'opacity-50' : ''
        }`;
    }
  };

  const getHeaderClasses = (isOpen: boolean, disabled: boolean) => {
    const baseClasses = `
      flex items-center justify-between w-full px-4 py-3 text-left
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset
      transition-colors
      ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
    `;

    if (variant === 'filled') {
      return `${baseClasses} ${
        isOpen
          ? 'bg-blue-50 text-blue-700'
          : disabled
          ? 'bg-gray-100 text-gray-500'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`;
    }

    return `${baseClasses} ${
      isOpen
        ? 'text-blue-600'
        : disabled
        ? 'text-gray-400'
        : 'text-gray-700 hover:text-gray-900'
    }`;
  };

  return (
    <div className={`${getContainerClasses()} ${className}`}>
      {items.map((item) => {
        const isOpen = openItems.includes(item.id);
        
        return (
          <div key={item.id} className={getItemClasses(item.disabled || false)}>
            {/* Header */}
            <button
              onClick={() => toggleItem(item.id)}
              className={getHeaderClasses(isOpen, item.disabled || false)}
              disabled={item.disabled}
              aria-expanded={isOpen}
              aria-controls={`accordion-content-${item.id}`}
            >
              <div className="flex items-center">
                {item.icon && (
                  <span className="mr-3 w-5 h-5 flex-shrink-0">{item.icon}</span>
                )}
                <span className="font-medium">{item.title}</span>
              </div>
              
              {/* Chevron Icon */}
              <svg
                className={`w-5 h-5 transition-transform duration-200 ${
                  isOpen ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Content */}
            {isOpen && (
              <div
                id={`accordion-content-${item.id}`}
                className="px-4 pb-4 pt-1 text-gray-600"
                role="region"
                aria-labelledby={`accordion-header-${item.id}`}
              >
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Accordion;
