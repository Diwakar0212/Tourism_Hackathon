import React, { useState, useEffect } from 'react';
import { offlineStorage, syncManager } from '../../utils/offlineStorage';

interface ConnectionStatusProps {
  className?: string;
}

interface StorageInfo {
  cachedItems: number;
  syncQueueItems: number;
  estimatedSize: number;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ className = '' }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showDetails, setShowDetails] = useState(false);
  const [storageInfo, setStorageInfo] = useState<StorageInfo | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setLastSyncTime(new Date());
      // Trigger sync when coming back online
      syncManager.processSyncQueue();
    };
    
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load storage info
    loadStorageInfo();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadStorageInfo = async () => {
    try {
      const info = await offlineStorage.getStorageInfo();
      setStorageInfo(info);
    } catch (error) {
      console.error('Failed to load storage info:', error);
    }
  };

  const handleClearCache = async () => {
    try {
      await offlineStorage.clearOldCache();
      await loadStorageInfo();
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  };

  const getStatusColor = () => {
    return isOnline ? 'bg-green-500' : 'bg-red-500';
  };

  const getStatusText = () => {
    return isOnline ? 'Online' : 'Offline';
  };

  return (
    <div className={`relative ${className}`}>
      {/* Status Indicator */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        className={`flex items-center space-x-2 px-3 py-1 rounded-full text-white text-sm font-medium transition-all duration-200 ${getStatusColor()} hover:opacity-80`}
        aria-label={`Connection status: ${getStatusText()}`}
      >
        <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-white animate-pulse' : 'bg-white'}`} />
        <span className="hidden sm:inline">{getStatusText()}</span>
        {!isOnline && storageInfo && storageInfo.syncQueueItems > 0 && (
          <span className="bg-white bg-opacity-20 px-1.5 py-0.5 rounded text-xs">
            {storageInfo.syncQueueItems}
          </span>
        )}
      </button>

      {/* Details Dropdown */}
      {showDetails && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Connection Status
              </h3>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                aria-label="Close details"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Connection Info */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Status:</span>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
                  <span className={`text-sm font-medium ${isOnline ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {getStatusText()}
                  </span>
                </div>
              </div>

              {lastSyncTime && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Last Sync:</span>
                  <span className="text-sm text-gray-900 dark:text-white">
                    {lastSyncTime.toLocaleTimeString()}
                  </span>
                </div>
              )}

              {storageInfo && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Cached Items:</span>
                    <span className="text-sm text-gray-900 dark:text-white">
                      {storageInfo.cachedItems}
                    </span>
                  </div>

                  {storageInfo.syncQueueItems > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Pending Sync:</span>
                      <span className="text-sm text-orange-600 dark:text-orange-400 font-medium">
                        {storageInfo.syncQueueItems} items
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Storage Used:</span>
                    <span className="text-sm text-gray-900 dark:text-white">
                      {storageInfo.estimatedSize} KB
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Actions */}
            <div className="mt-4 space-y-2">
              {!isOnline && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                  <div className="flex">
                    <svg className="w-5 h-5 text-amber-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <div className="ml-3">
                      <p className="text-sm text-amber-800 dark:text-amber-200">
                        You're offline. Changes will sync when connection is restored.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {isOnline && storageInfo && storageInfo.syncQueueItems > 0 && (
                <button
                  onClick={() => syncManager.processSyncQueue()}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Sync Now ({storageInfo.syncQueueItems} items)
                </button>
              )}

              {storageInfo && storageInfo.cachedItems > 0 && (
                <button
                  onClick={handleClearCache}
                  className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Clear Old Cache
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile-optimized offline banner */}
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 bg-red-500 text-white text-center py-2 px-4 text-sm font-medium z-40 sm:hidden">
          🔌 Offline Mode - Changes will sync when online
        </div>
      )}
    </div>
  );
};

export default ConnectionStatus;
