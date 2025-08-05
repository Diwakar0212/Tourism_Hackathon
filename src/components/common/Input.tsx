import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, AlertCircle, Check } from 'lucide-react';
import { cn } from '../../utils/styles';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  success?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'default' | 'filled' | 'borderless';
  size?: 'sm' | 'md' | 'lg';
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  success,
  leftIcon,
  rightIcon,
  variant = 'default',
  size = 'md',
  helperText,
  className,
  type,
  id,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);
  
  const isPasswordType = type === 'password';
  const actualType = isPasswordType && showPassword ? 'text' : type;
  
  const sizeClasses = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-11 px-4 text-base',
    lg: 'h-12 px-5 text-lg'
  };
  
  const variantClasses = {
    default: 'bg-white border border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20',
    filled: 'bg-secondary-50 border border-transparent focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20',
    borderless: 'bg-transparent border-b-2 border-secondary-200 focus:border-primary-500 rounded-none'
  };
  
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={cn('space-y-2', className)}>
      {/* Label */}
      {label && (
        <motion.label
          htmlFor={inputId}
          className={cn(
            'block text-sm font-medium transition-colors duration-200',
            error ? 'text-error-600' : success ? 'text-success-600' : 'text-secondary-700'
          )}
          animate={{ color: isFocused ? '#0ea5e9' : undefined }}
        >
          {label}
        </motion.label>
      )}
      
      {/* Input Container */}
      <div className="relative">
        {/* Left Icon */}
        {leftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400">
            {leftIcon}
          </div>
        )}
        
        {/* Input Field */}
        <motion.div
          whileFocus={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <input
            ref={ref}
            type={actualType}
            id={inputId}
            className={cn(
              // Base styles
              'w-full rounded-xl font-medium transition-all duration-200 outline-none',
              'placeholder:text-secondary-400 disabled:opacity-50 disabled:cursor-not-allowed',
              // Size classes
              sizeClasses[size],
              // Variant classes
              variantClasses[variant],
              // Icon padding adjustments
              leftIcon && 'pl-10',
              (rightIcon || isPasswordType || error || success) && 'pr-10',
              // State-based styling
              error && 'border-error-500 focus:border-error-500 focus:ring-error-500/20',
              success && 'border-success-500 focus:border-success-500 focus:ring-success-500/20'
            )}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            {...props}
          />
        </motion.div>
        
        {/* Right Icons Container */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
          {/* Success Icon */}
          {success && !error && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-success-500"
            >
              <Check className="w-4 h-4" />
            </motion.div>
          )}
          
          {/* Error Icon */}
          {error && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-error-500"
            >
              <AlertCircle className="w-4 h-4" />
            </motion.div>
          )}
          
          {/* Password Toggle */}
          {isPasswordType && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-secondary-400 hover:text-secondary-600 transition-colors duration-200"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          )}
          
          {/* Custom Right Icon */}
          {rightIcon && !isPasswordType && !error && !success && (
            <div className="text-secondary-400">
              {rightIcon}
            </div>
          )}
        </div>
      </div>
      
      {/* Helper Text / Error Message */}
      {(helperText || error) && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            'text-sm',
            error ? 'text-error-600' : 'text-secondary-500'
          )}
        >
          {error || helperText}
        </motion.p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;