import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  clickable?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'md',
  hover = false,
  clickable = false,
  onClick,
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  const baseClasses = `bg-white rounded-lg shadow-sm border border-gray-200 ${paddingClasses[padding]}`;

  const interactiveClasses = hover || clickable
    ? 'transition-all duration-200 hover:shadow-md hover:border-gray-300'
    : '';

  const clickableClasses = clickable
    ? 'cursor-pointer transform hover:scale-[1.02]'
    : '';

  const combinedClasses = `${baseClasses} ${interactiveClasses} ${clickableClasses} ${className}`;

  return (
    <div className={combinedClasses} onClick={onClick}>
      {children}
    </div>
  );
};

export default Card;