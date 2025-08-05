import React, { useState, useEffect } from 'react';
import { X, Download, Smartphone } from 'lucide-react';

interface PWAInstallPromptProps {
  className?: string;
}

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const PWAInstallPrompt: React.FC<PWAInstallPromptProps> = ({ className = '' }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if app is already installed/standalone
    const checkStandalone = () => {
      const standalone = window.matchMedia('(display-mode: standalone)').matches ||
                        (window.navigator as any).standalone ||
                        document.referrer.includes('android-app://');
      setIsInstalled(standalone);
    };

    // Check if iOS
    const checkIOS = () => {
      const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
      setIsIOS(iOS);
    };

    checkStandalone();
    checkIOS();

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Don't show prompt immediately, wait for user engagement
      setTimeout(() => {
        if (!isInstalled && !localStorage.getItem('pwa-install-dismissed')) {
          setShowPrompt(true);
        }
      }, 5000); // Show after 5 seconds
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
      localStorage.setItem('pwa-installed', 'true');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [isInstalled]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
          console.log('PWA installation accepted');
        } else {
          console.log('PWA installation dismissed');
          localStorage.setItem('pwa-install-dismissed', 'true');
        }
        
        setDeferredPrompt(null);
        setShowPrompt(false);
      } catch (error) {
        console.error('Error during PWA installation:', error);
      }
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  const getInstallInstructions = () => {
    if (isIOS) {
      return {
        title: 'Install SafeSolo',
        steps: [
          'Tap the Share button in Safari',
          'Scroll down and tap "Add to Home Screen"',
          'Tap "Add" to install SafeSolo'
        ]
      };
    }
    
    return {
      title: 'Install SafeSolo App',
      steps: [
        'Tap "Install" to add SafeSolo to your home screen',
        'Access all features offline',
        'Get faster performance and instant access'
      ]
    };
  };

  // Don't show if already installed or dismissed
  if (isInstalled || !showPrompt) {
    return null;
  }

  const instructions = getInstallInstructions();

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 ${className}`}>
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white p-4 shadow-lg">
        <div className="max-w-md mx-auto">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                {isIOS ? <Smartphone className="h-5 w-5" /> : <Download className="h-5 w-5" />}
              </div>
              <div>
                <h3 className="font-semibold text-lg">{instructions.title}</h3>
                <p className="text-teal-100 text-sm">Get the full SafeSolo experience</p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="text-teal-200 hover:text-white transition-colors"
              aria-label="Dismiss install prompt"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-2 mb-4">
            {instructions.steps.map((step, index) => (
              <div key={index} className="flex items-center space-x-3 text-sm">
                <div className="flex-shrink-0 w-5 h-5 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-xs font-medium">
                  {index + 1}
                </div>
                <span className="text-teal-100">{step}</span>
              </div>
            ))}
          </div>

          <div className="flex space-x-3">
            {!isIOS && deferredPrompt && (
              <button
                onClick={handleInstallClick}
                className="flex-1 bg-white text-teal-700 font-semibold py-2 px-4 rounded-lg hover:bg-teal-50 transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Install Now</span>
              </button>
            )}
            
            <button
              onClick={handleDismiss}
              className="flex-1 bg-teal-800 text-teal-100 font-medium py-2 px-4 rounded-lg hover:bg-teal-900 transition-colors duration-200"
            >
              Maybe Later
            </button>
          </div>

          {/* iOS specific instructions */}
          {isIOS && (
            <div className="mt-3 pt-3 border-t border-teal-500">
              <div className="flex items-center space-x-2 text-teal-100 text-xs">
                <Smartphone className="h-4 w-4" />
                <span>Use Safari browser for installation</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Hook to check PWA installation status
export const usePWAInstallation = () => {
  const [isInstalled, setIsInstalled] = useState(false);
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    const checkInstallation = () => {
      const standalone = window.matchMedia('(display-mode: standalone)').matches ||
                        (window.navigator as any).standalone ||
                        document.referrer.includes('android-app://');
      setIsInstalled(standalone);
    };

    const handleBeforeInstallPrompt = () => {
      setCanInstall(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setCanInstall(false);
    };

    checkInstallation();
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  return { isInstalled, canInstall };
};

export default PWAInstallPrompt;
