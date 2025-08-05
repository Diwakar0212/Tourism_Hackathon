import React, { useState, useRef, useEffect } from 'react';

interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: 'left' | 'right' | 'center';
  className?: string;
  closeOnClick?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  children,
  align = 'left',
  className = '',
  closeOnClick = true
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const alignmentClasses = {
    left: 'left-0',
    right: 'right-0',
    center: 'left-1/2 transform -translate-x-1/2'
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen]);

  const handleTriggerClick = () => {
    setIsOpen(!isOpen);
  };

  const handleContentClick = () => {
    if (closeOnClick) {
      setIsOpen(false);
    }
  };

  return (
    <div ref={dropdownRef} className={`relative inline-block ${className}`}>
      {/* Trigger */}
      <div onClick={handleTriggerClick} className="cursor-pointer">
        {trigger}
      </div>

      {/* Dropdown Content */}
      {isOpen && (
        <div
          className={`
            absolute top-full mt-1 z-50 min-w-48 
            bg-white rounded-lg shadow-lg border border-gray-200
            transform transition-all duration-200 ease-out
            ${alignmentClasses[align]}
            ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
          `}
          onClick={handleContentClick}
        >
          <div className="py-1">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

// Dropdown Item Component
interface DropdownItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

export const DropdownItem: React.FC<DropdownItemProps> = ({
  children,
  onClick,
  href,
  disabled = false,
  className = '',
  icon
}) => {
  const baseClasses = `
    flex items-center px-4 py-2 text-sm text-gray-700
    hover:bg-gray-50 transition-colors cursor-pointer
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${className}
  `;

  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  if (href && !disabled) {
    return (
      <a href={href} className={baseClasses}>
        {icon && <span className="mr-2 w-4 h-4">{icon}</span>}
        {children}
      </a>
    );
  }

  return (
    <div className={baseClasses} onClick={handleClick}>
      {icon && <span className="mr-2 w-4 h-4">{icon}</span>}
      {children}
    </div>
  );
};

// Dropdown Separator Component
export const DropdownSeparator: React.FC = () => (
  <div className="border-t border-gray-200 my-1" />
);

export default Dropdown;
