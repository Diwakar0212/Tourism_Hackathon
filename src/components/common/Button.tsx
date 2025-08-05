import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn, buttonVariants, type LoadingState } from '../../utils/styles';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof buttonVariants;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  loadingState?: LoadingState;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  loadingState = 'idle',
  leftIcon,
  rightIcon,
  fullWidth = false,
  className,
  disabled,
  children,
  onClick,
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm h-9',
    md: 'px-6 py-3 text-base h-11',
    lg: 'px-8 py-4 text-lg h-12',
    xl: 'px-10 py-5 text-xl h-14'
  };

  return (
    <motion.button
      whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={cn(
        // Base styles
        'btn-base relative overflow-hidden font-semibold',
        'focus-visible:ring-2 focus-visible:ring-offset-2',
        // Variant styles
        buttonVariants[variant],
        // Size styles
        sizeClasses[size],
        // Full width
        fullWidth && 'w-full',
        // Loading state
        (isLoading || loadingState === 'loading') && 'cursor-not-allowed',
        // Disabled state
        disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
        className
      )}
      disabled={disabled || isLoading || loadingState === 'loading'}
      onClick={onClick}
      {...(props as any)}
    >
      {/* Background shimmer effect on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />
      
      {/* Content container */}
      <span className="relative flex items-center justify-center gap-2">
        {/* Left icon or loading spinner */}
        {(isLoading || loadingState === 'loading') ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : leftIcon ? (
          <span className="flex-shrink-0">{leftIcon}</span>
        ) : null}
        
        {/* Button text */}
        <span className="flex-1 min-w-0">
          {(isLoading || loadingState === 'loading') ? 'Loading...' : children}
        </span>
        
        {/* Right icon */}
        {rightIcon && !(isLoading || loadingState === 'loading') && (
          <span className="flex-shrink-0">{rightIcon}</span>
        )}
      </span>
      
      {/* Success state indicator */}
      {loadingState === 'success' && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute inset-0 bg-success-500 rounded-xl flex items-center justify-center"
        >
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </motion.div>
      )}
      
      {/* Error state indicator */}
      {loadingState === 'error' && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute inset-0 bg-error-500 rounded-xl flex items-center justify-center"
        >
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </motion.div>
      )}
    </motion.button>
  );
};

export default Button;