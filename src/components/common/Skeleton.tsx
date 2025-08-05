import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'text',
  width,
  height,
  animation = 'pulse'
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'circular':
        return 'rounded-full';
      case 'rectangular':
        return 'rounded-md';
      default: // text
        return 'rounded';
    }
  };

  const getAnimationClasses = () => {
    switch (animation) {
      case 'wave':
        return 'animate-pulse bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 bg-[length:200%_100%] animate-wave';
      case 'none':
        return 'bg-gray-300';
      default: // pulse
        return 'animate-pulse bg-gray-300';
    }
  };

  const getDefaultDimensions = () => {
    switch (variant) {
      case 'circular':
        return { width: '40px', height: '40px' };
      case 'rectangular':
        return { width: '100%', height: '200px' };
      default: // text
        return { width: '100%', height: '1em' };
    }
  };

  const defaults = getDefaultDimensions();
  const style = {
    width: width || defaults.width,
    height: height || defaults.height,
  };

  return (
    <div
      className={`
        ${getVariantClasses()}
        ${getAnimationClasses()}
        ${className}
      `}
      style={style}
      aria-hidden="true"
    />
  );
};

// Skeleton variants for common use cases
export const SkeletonText: React.FC<Omit<SkeletonProps, 'variant'>> = (props) => (
  <Skeleton {...props} variant="text" />
);

export const SkeletonAvatar: React.FC<Omit<SkeletonProps, 'variant'>> = (props) => (
  <Skeleton {...props} variant="circular" />
);

export const SkeletonImage: React.FC<Omit<SkeletonProps, 'variant'>> = (props) => (
  <Skeleton {...props} variant="rectangular" />
);

// Skeleton group for loading lists
interface SkeletonGroupProps {
  count: number;
  className?: string;
  itemClassName?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  spacing?: 'none' | 'sm' | 'md' | 'lg';
}

export const SkeletonGroup: React.FC<SkeletonGroupProps> = ({
  count,
  className = '',
  itemClassName = '',
  variant = 'text',
  spacing = 'md'
}) => {
  const getSpacingClasses = () => {
    switch (spacing) {
      case 'none':
        return '';
      case 'sm':
        return 'space-y-2';
      case 'lg':
        return 'space-y-6';
      default: // md
        return 'space-y-4';
    }
  };

  return (
    <div className={`${getSpacingClasses()} ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton
          key={index}
          variant={variant}
          className={itemClassName}
        />
      ))}
    </div>
  );
};

// Card skeleton for complex layouts
export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`p-4 border border-gray-200 rounded-lg ${className}`}>
    <div className="flex items-center space-x-4 mb-4">
      <SkeletonAvatar width={40} height={40} />
      <div className="flex-1 space-y-2">
        <SkeletonText height="1rem" width="60%" />
        <SkeletonText height="0.875rem" width="40%" />
      </div>
    </div>
    <div className="space-y-2 mb-4">
      <SkeletonText height="0.875rem" />
      <SkeletonText height="0.875rem" width="80%" />
    </div>
    <SkeletonImage height={200} className="mb-4" />
    <div className="flex justify-between items-center">
      <SkeletonText height="1rem" width="30%" />
      <SkeletonText height="2rem" width="80px" />
    </div>
  </div>
);

export default Skeleton;
