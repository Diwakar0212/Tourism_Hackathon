/**
 * Offline Data Storage Manager
 * Handles caching and syncing of data when offline
 */

interface CachedData {
  id: string;
  data: any;
  timestamp: number;
  type: 'safety' | 'trip' | 'user' | 'emergency';
  synced: boolean;
}

interface SyncQueue {
  id: string;
  action: 'create' | 'update' | 'delete';
  type: string;
  data: any;
  timestamp: number;
  retryCount: number;
}

class OfflineStorageManager {
  private dbName = 'SafeSoloOfflineDB';
  private dbVersion = 1;
  private db: IDBDatabase | null = null;

  async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create object stores
        if (!db.objectStoreNames.contains('cachedData')) {
          const cachedStore = db.createObjectStore('cachedData', { keyPath: 'id' });
          cachedStore.createIndex('type', 'type', { unique: false });
          cachedStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        if (!db.objectStoreNames.contains('syncQueue')) {
          const syncStore = db.createObjectStore('syncQueue', { keyPath: 'id' });
          syncStore.createIndex('timestamp', 'timestamp', { unique: false });
          syncStore.createIndex('type', 'type', { unique: false });
        }

        if (!db.objectStoreNames.contains('userSettings')) {
          db.createObjectStore('userSettings', { keyPath: 'key' });
        }
      };
    });
  }

  // Cache data for offline access
  async cacheData(id: string, data: any, type: CachedData['type']): Promise<void> {
    if (!this.db) await this.initialize();

    const cachedData: CachedData = {
      id,
      data,
      timestamp: Date.now(),
      type,
      synced: navigator.onLine
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['cachedData'], 'readwrite');
      const store = transaction.objectStore('cachedData');
      const request = store.put(cachedData);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  // Get cached data
  async getCachedData(id: string): Promise<CachedData | null> {
    if (!this.db) await this.initialize();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['cachedData'], 'readonly');
      const store = transaction.objectStore('cachedData');
      const request = store.get(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || null);
    });
  }

  // Get all cached data by type
  async getCachedDataByType(type: CachedData['type']): Promise<CachedData[]> {
    if (!this.db) await this.initialize();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['cachedData'], 'readonly');
      const store = transaction.objectStore('cachedData');
      const index = store.index('type');
      const request = index.getAll(type);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || []);
    });
  }

  // Add item to sync queue
  async addToSyncQueue(
    action: SyncQueue['action'],
    type: string,
    data: any,
    id?: string
  ): Promise<void> {
    if (!this.db) await this.initialize();

    const syncItem: SyncQueue = {
      id: id || `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      action,
      type,
      data,
      timestamp: Date.now(),
      retryCount: 0
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['syncQueue'], 'readwrite');
      const store = transaction.objectStore('syncQueue');
      const request = store.put(syncItem);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  // Get sync queue
  async getSyncQueue(): Promise<SyncQueue[]> {
    if (!this.db) await this.initialize();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['syncQueue'], 'readonly');
      const store = transaction.objectStore('syncQueue');
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || []);
    });
  }

  // Remove from sync queue
  async removeFromSyncQueue(id: string): Promise<void> {
    if (!this.db) await this.initialize();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['syncQueue'], 'readwrite');
      const store = transaction.objectStore('syncQueue');
      const request = store.delete(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  // Update retry count for sync item
  async updateSyncRetryCount(id: string, retryCount: number): Promise<void> {
    if (!this.db) await this.initialize();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['syncQueue'], 'readwrite');
      const store = transaction.objectStore('syncQueue');
      const getRequest = store.get(id);

      getRequest.onsuccess = () => {
        const item = getRequest.result;
        if (item) {
          item.retryCount = retryCount;
          const putRequest = store.put(item);
          putRequest.onerror = () => reject(putRequest.error);
          putRequest.onsuccess = () => resolve();
        } else {
          resolve();
        }
      };

      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  // Clear old cached data
  async clearOldCache(maxAge: number = 7 * 24 * 60 * 60 * 1000): Promise<void> {
    if (!this.db) await this.initialize();

    const cutoffTime = Date.now() - maxAge;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['cachedData'], 'readwrite');
      const store = transaction.objectStore('cachedData');
      const index = store.index('timestamp');
      const range = IDBKeyRange.upperBound(cutoffTime);
      const request = index.openCursor(range);

      request.onerror = () => reject(request.error);
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        } else {
          resolve();
        }
      };
    });
  }

  // Save user settings
  async saveUserSetting(key: string, value: any): Promise<void> {
    if (!this.db) await this.initialize();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['userSettings'], 'readwrite');
      const store = transaction.objectStore('userSettings');
      const request = store.put({ key, value, timestamp: Date.now() });

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  // Get user setting
  async getUserSetting(key: string): Promise<any> {
    if (!this.db) await this.initialize();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['userSettings'], 'readonly');
      const store = transaction.objectStore('userSettings');
      const request = store.get(key);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result?.value || null);
    });
  }

  // Get storage usage info
  async getStorageInfo(): Promise<{
    cachedItems: number;
    syncQueueItems: number;
    estimatedSize: number;
  }> {
    if (!this.db) await this.initialize();

    const cachedData = await this.getCachedDataByType('safety');
    const syncQueue = await this.getSyncQueue();

    return {
      cachedItems: cachedData.length,
      syncQueueItems: syncQueue.length,
      estimatedSize: Math.round((JSON.stringify(cachedData).length + JSON.stringify(syncQueue).length) / 1024) // KB
    };
  }
}

// Sync manager for handling online/offline synchronization
class SyncManager {
  private storage: OfflineStorageManager;
  private isOnline: boolean = navigator.onLine;
  private syncInProgress: boolean = false;

  constructor(storage: OfflineStorageManager) {
    this.storage = storage;
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.processSyncQueue();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  async processSyncQueue(): Promise<void> {
    if (!this.isOnline || this.syncInProgress) return;

    this.syncInProgress = true;
    console.log('Starting sync process...');

    try {
      const syncQueue = await this.storage.getSyncQueue();
      const MAX_RETRIES = 3;

      for (const item of syncQueue) {
        try {
          // Attempt to sync the item
          await this.syncItem(item);
          // Remove from queue on success
          await this.storage.removeFromSyncQueue(item.id);
          console.log(`Synced item: ${item.id}`);
        } catch (error) {
          console.error(`Failed to sync item ${item.id}:`, error);
          
          // Increment retry count
          const newRetryCount = item.retryCount + 1;
          
          if (newRetryCount >= MAX_RETRIES) {
            // Remove failed items after max retries
            await this.storage.removeFromSyncQueue(item.id);
            console.log(`Removed failed item after ${MAX_RETRIES} retries: ${item.id}`);
          } else {
            await this.storage.updateSyncRetryCount(item.id, newRetryCount);
          }
        }
      }
    } finally {
      this.syncInProgress = false;
      console.log('Sync process completed');
    }
  }

  private async syncItem(item: SyncQueue): Promise<void> {
    // This would make actual API calls to sync data
    // For now, we'll simulate the sync process
    console.log(`Syncing item: ${item.type} - ${item.action}`);
    
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.1) { // 90% success rate
          resolve();
        } else {
          reject(new Error('Sync failed'));
        }
      }, 100);
    });
  }

  async queueForSync(action: SyncQueue['action'], type: string, data: any): Promise<void> {
    await this.storage.addToSyncQueue(action, type, data);
    
    // Try to sync immediately if online
    if (this.isOnline) {
      this.processSyncQueue();
    }
  }
}

// Create and export singleton instances
const offlineStorage = new OfflineStorageManager();
const syncManager = new SyncManager(offlineStorage);

// Initialize storage on module load
offlineStorage.initialize().catch(console.error);

export { offlineStorage, syncManager, type CachedData, type SyncQueue };
