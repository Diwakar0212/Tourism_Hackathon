import React, { useEffect } from 'react';

interface AnnouncementProps {
  message: string;
  priority?: 'polite' | 'assertive';
  onAnnounce?: () => void;
}

// Screen reader announcement component
const Announcement: React.FC<AnnouncementProps> = ({
  message,
  priority = 'polite',
  onAnnounce
}) => {
  useEffect(() => {
    if (message && onAnnounce) {
      onAnnounce();
    }
  }, [message, onAnnounce]);

  return (
    <div
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  );
};

// Skip to content link
export const SkipToContent: React.FC = () => {
  return (
    <a
      href="#main-content"
      className="
        sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4
        bg-blue-600 text-white px-4 py-2 rounded-md z-50
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
      "
    >
      Skip to main content
    </a>
  );
};

// Focus trap component
interface FocusTrapProps {
  children: React.ReactNode;
  isActive: boolean;
  initialFocus?: React.RefObject<HTMLElement>;
  restoreFocus?: boolean;
}

export const FocusTrap: React.FC<FocusTrapProps> = ({
  children,
  isActive,
  initialFocus,
  restoreFocus = true
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const previousActiveElement = React.useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isActive) return;

    // Store the previously focused element
    previousActiveElement.current = document.activeElement as HTMLElement;

    // Focus the initial element or first focusable element
    const focusableElements = getFocusableElements();
    const initialElement = initialFocus?.current || focusableElements[0];
    if (initialElement) {
      initialElement.focus();
    }

    // Handle keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusableElements = getFocusableElements();
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      
      // Restore focus to previously focused element
      if (restoreFocus && previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [isActive, initialFocus, restoreFocus]);

  const getFocusableElements = (): HTMLElement[] => {
    if (!containerRef.current) return [];

    const focusableSelector = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ].join(', ');

    return Array.from(containerRef.current.querySelectorAll(focusableSelector));
  };

  return (
    <div ref={containerRef}>
      {children}
    </div>
  );
};

// ARIA label provider for complex components
interface AriaLabelProviderProps {
  children: React.ReactNode;
  label?: string;
  labelledBy?: string;
  describedBy?: string;
  role?: string;
}

export const AriaLabelProvider: React.FC<AriaLabelProviderProps> = ({
  children,
  label,
  labelledBy,
  describedBy,
  role
}) => {
  return (
    <div
      aria-label={label}
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      role={role}
    >
      {children}
    </div>
  );
};

// High contrast mode detection
export const useHighContrastMode = () => {
  const [isHighContrast, setIsHighContrast] = React.useState(false);

  useEffect(() => {
    const checkHighContrast = () => {
      const testElement = document.createElement('div');
      testElement.style.borderColor = 'rgb(31, 41, 59)'; // slate-800
      testElement.style.borderStyle = 'solid';
      testElement.style.borderWidth = '1px';
      testElement.style.height = '1px';
      testElement.style.position = 'absolute';
      testElement.style.left = '-9999px';
      
      document.body.appendChild(testElement);
      
      const computedStyle = getComputedStyle(testElement);
      const isHighContrast = computedStyle.borderColor !== 'rgb(31, 41, 59)';
      
      document.body.removeChild(testElement);
      setIsHighContrast(isHighContrast);
    };

    checkHighContrast();
    
    // Listen for changes in system preferences
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    const handleChange = () => checkHighContrast();
    
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return isHighContrast;
};

// Reduced motion detection
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return prefersReducedMotion;
};

export default Announcement;
