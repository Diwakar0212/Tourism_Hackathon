import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Animation variants for Framer Motion
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3, ease: "easeOut" }
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 }
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { duration: 0.2, ease: "easeOut" }
};

export const slideIn = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
  transition: { duration: 0.3, ease: "easeOut" }
};

// Stagger animation for lists
export const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Loading states
export const loadingStates = {
  idle: "idle",
  loading: "loading",
  success: "success",
  error: "error"
} as const;

export type LoadingState = typeof loadingStates[keyof typeof loadingStates];

// Button variants
export const buttonVariants = {
  primary: "bg-primary-500 hover:bg-primary-600 text-white border-transparent shadow-soft hover:shadow-medium",
  secondary: "bg-white hover:bg-secondary-50 text-secondary-900 border-secondary-200 shadow-soft hover:shadow-medium",
  accent: "bg-accent-500 hover:bg-accent-600 text-white border-transparent shadow-soft hover:shadow-medium", 
  ghost: "bg-transparent hover:bg-secondary-100 text-secondary-700 border-transparent",
  outline: "bg-transparent hover:bg-secondary-50 text-secondary-700 border-secondary-300 border"
} as const;

// Status colors
export const statusColors = {
  success: "text-success-600 bg-success-50 border-success-200",
  warning: "text-warning-600 bg-warning-50 border-warning-200",
  error: "text-error-600 bg-error-50 border-error-200",
  info: "text-primary-600 bg-primary-50 border-primary-200"
} as const;
