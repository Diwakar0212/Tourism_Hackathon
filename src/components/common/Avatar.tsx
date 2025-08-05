import React from 'react';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  name?: string;
  className?: string;
  onClick?: () => void;
  status?: 'online' | 'offline' | 'away' | 'busy';
  showStatus?: boolean;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  size = 'md',
  name,
  className = '',
  onClick,
  status,
  showStatus = false
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'xs':
        return 'w-6 h-6 text-xs';
      case 'sm':
        return 'w-8 h-8 text-sm';
      case 'lg':
        return 'w-12 h-12 text-lg';
      case 'xl':
        return 'w-16 h-16 text-xl';
      case '2xl':
        return 'w-20 h-20 text-2xl';
      default:
        return 'w-10 h-10 text-base';
    }
  };

  const getStatusClasses = () => {
    switch (status) {
      case 'online':
        return 'bg-green-400';
      case 'offline':
        return 'bg-gray-400';
      case 'away':
        return 'bg-yellow-400';
      case 'busy':
        return 'bg-red-400';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusSize = () => {
    switch (size) {
      case 'xs':
        return 'w-1.5 h-1.5';
      case 'sm':
        return 'w-2 h-2';
      case 'lg':
        return 'w-3 h-3';
      case 'xl':
        return 'w-4 h-4';
      case '2xl':
        return 'w-5 h-5';
      default:
        return 'w-2.5 h-2.5';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const generateBackgroundColor = (name: string) => {
    const colors = [
      'bg-red-500',
      'bg-yellow-500',
      'bg-green-500',
      'bg-blue-500',
      'bg-indigo-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-gray-500'
    ];
    
    const hash = name
      .split('')
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    return colors[hash % colors.length];
  };

  const baseClasses = `
    relative inline-flex items-center justify-center
    rounded-full overflow-hidden font-medium text-white
    ${getSizeClasses()}
    ${onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}
    ${className}
  `;

  return (
    <div className={baseClasses} onClick={onClick}>
      {src ? (
        <img
          src={src}
          alt={alt || name || 'Avatar'}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Hide broken image and show initials instead
            e.currentTarget.style.display = 'none';
          }}
        />
      ) : name ? (
        <div className={`w-full h-full flex items-center justify-center ${generateBackgroundColor(name)}`}>
          {getInitials(name)}
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-400">
          <svg className="w-1/2 h-1/2" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}

      {/* Status Indicator */}
      {showStatus && status && (
        <div
          className={`
            absolute bottom-0 right-0 rounded-full ring-2 ring-white
            ${getStatusSize()}
            ${getStatusClasses()}
          `}
          title={status}
        />
      )}
    </div>
  );
};

// Avatar Group Component
interface AvatarGroupProps {
  avatars: Array<{
    src?: string;
    alt?: string;
    name?: string;
  }>;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  max?: number;
  className?: string;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  avatars,
  size = 'md',
  max = 5,
  className = ''
}) => {
  const displayAvatars = avatars.slice(0, max);
  const remainingCount = avatars.length - max;

  return (
    <div className={`flex -space-x-2 ${className}`}>
      {displayAvatars.map((avatar, index) => (
        <Avatar
          key={index}
          {...avatar}
          size={size}
          className="ring-2 ring-white"
        />
      ))}
      
      {remainingCount > 0 && (
        <div
          className={`
            relative inline-flex items-center justify-center
            rounded-full bg-gray-100 text-gray-600 font-medium
            ring-2 ring-white
            ${getSizeClasses(size)}
          `}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
};

// Helper function for avatar group size classes
const getSizeClasses = (size: string) => {
  switch (size) {
    case 'xs':
      return 'w-6 h-6 text-xs';
    case 'sm':
      return 'w-8 h-8 text-sm';
    case 'lg':
      return 'w-12 h-12 text-lg';
    case 'xl':
      return 'w-16 h-16 text-xl';
    case '2xl':
      return 'w-20 h-20 text-2xl';
    default:
      return 'w-10 h-10 text-base';
  }
};

export default Avatar;
