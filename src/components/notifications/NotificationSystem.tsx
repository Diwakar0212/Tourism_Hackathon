import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, CheckCircle, Info, AlertCircle, MapPin, Phone } from 'lucide-react';
import Button from '../common/Button';
import Card from '../common/Card';

interface Notification {
  id: string;
  type: 'emergency' | 'info' | 'success' | 'warning';
  title: string;
  message: string;
  timestamp: Date;
  action?: () => void;
  actionLabel?: string;
  persistent?: boolean;
  location?: {
    lat: number;
    lng: number;
  };
  contactInfo?: {
    name: string;
    phone?: string;
  };
}

interface NotificationSystemProps {
  maxNotifications?: number;
}

const NotificationSystem: React.FC<NotificationSystemProps> = ({ 
  maxNotifications = 5 
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Listen for custom notification events
    const handleShowNotification = (event: CustomEvent) => {
      const notification: Notification = {
        id: Date.now().toString(),
        timestamp: new Date(),
        ...event.detail
      };
      
      addNotification(notification);
    };

    document.addEventListener('showNotification', handleShowNotification as EventListener);

    return () => {
      document.removeEventListener('showNotification', handleShowNotification as EventListener);
    };
  }, []);

  const addNotification = (notification: Notification) => {
    setNotifications(prev => {
      const newNotifications = [notification, ...prev];
      
      // Keep only the most recent notifications
      if (newNotifications.length > maxNotifications) {
        return newNotifications.slice(0, maxNotifications);
      }
      
      return newNotifications;
    });

    // Auto-remove non-persistent notifications after 10 seconds
    if (!notification.persistent) {
      setTimeout(() => {
        removeNotification(notification.id);
      }, 10000);
    }
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'emergency':
        return <AlertTriangle className="h-6 w-6 text-red-500" />;
      case 'success':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-6 w-6 text-yellow-500" />;
      default:
        return <Info className="h-6 w-6 text-blue-500" />;
    }
  };

  const getNotificationStyles = (type: string) => {
    switch (type) {
      case 'emergency':
        return 'border-red-200 bg-red-50 animate-pulse';
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      default:
        return 'border-blue-200 bg-blue-50';
    }
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleEmergencyResponse = (notification: Notification) => {
    // Show emergency response options
    const response = window.confirm(
      `Emergency Alert from ${notification.contactInfo?.name}\n\n` +
      `${notification.message}\n\n` +
      `Would you like to call emergency services or contact them directly?`
    );

    if (response) {
      if (notification.contactInfo?.phone) {
        window.location.href = `tel:${notification.contactInfo.phone}`;
      } else {
        // Call emergency services
        window.location.href = 'tel:911';
      }
    }
  };

  const showLocationOnMap = (location: { lat: number; lng: number }) => {
    const mapUrl = `https://maps.google.com/?q=${location.lat},${location.lng}`;
    window.open(mapUrl, '_blank');
  };

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-md">
      {notifications.map((notification) => (
        <Card
          key={notification.id}
          className={`${getNotificationStyles(notification.type)} shadow-lg transform transition-all duration-300 ease-in-out`}
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-1">
              {getNotificationIcon(notification.type)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">
                    {notification.title}
                  </h4>
                  <p className="text-sm text-gray-700 mt-1">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {formatTime(notification.timestamp)}
                  </p>
                </div>
                
                <button
                  onClick={() => removeNotification(notification.id)}
                  className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Emergency-specific controls */}
              {notification.type === 'emergency' && (
                <div className="mt-3 space-y-2">
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => handleEmergencyResponse(notification)}
                      icon={<Phone className="h-3 w-3" />}
                    >
                      Respond
                    </Button>
                    
                    {notification.location && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => showLocationOnMap(notification.location!)}
                        icon={<MapPin className="h-3 w-3" />}
                      >
                        Location
                      </Button>
                    )}
                  </div>
                  
                  {notification.contactInfo && (
                    <div className="text-xs text-gray-600">
                      Contact: {notification.contactInfo.name}
                      {notification.contactInfo.phone && (
                        <span className="ml-2">
                          📞 {notification.contactInfo.phone}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Action button for non-emergency notifications */}
              {notification.action && notification.type !== 'emergency' && (
                <div className="mt-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={notification.action}
                  >
                    {notification.actionLabel || 'View'}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Card>
      ))}
      
      {/* Clear all button if there are multiple notifications */}
      {notifications.length > 1 && (
        <div className="text-center">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setNotifications([])}
            className="text-xs"
          >
            Clear All
          </Button>
        </div>
      )}
    </div>
  );
};

export default NotificationSystem;
