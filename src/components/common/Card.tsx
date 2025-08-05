import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/styles';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'glass';
  hover?: boolean;
  interactive?: boolean;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  variant = 'default',
  hover = true,
  interactive = false,
  className,
  children,
  onClick,
  ...props
}) => {
  const variantClasses = {
    default: 'card-premium',
    elevated: 'bg-white rounded-2xl border border-secondary-200/60 shadow-medium hover:shadow-strong',
    outlined: 'bg-white rounded-2xl border-2 border-secondary-200 hover:border-primary-300',
    glass: 'glass rounded-2xl shadow-soft hover:shadow-medium'
  };

  if (interactive) {
    return (
      <motion.div
        whileHover={{ scale: 1.02, y: -4 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        className={cn(
          variantClasses[variant],
          hover && 'transition-all duration-300',
          'cursor-pointer',
          className
        )}
        onClick={onClick}
        {...(props as any)}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div
      className={cn(
        variantClasses[variant],
        hover && 'transition-all duration-300',
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

// Card components
export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div
    className={cn('p-6 pb-4', className)}
    {...props}
  >
    {children}
  </div>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div
    className={cn('px-6 pb-6', className)}
    {...props}
  >
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div
    className={cn('px-6 py-4 bg-secondary-50/50 border-t border-secondary-200/60', className)}
    {...props}
  >
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className,
  children,
  ...props
}) => (
  <h3
    className={cn('text-xl font-semibold text-secondary-900 mb-2', className)}
    {...props}
  >
    {children}
  </h3>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  className,
  children,
  ...props
}) => (
  <p
    className={cn('text-secondary-600 leading-relaxed', className)}
    {...props}
  >
    {children}
  </p>
);

export default Card;