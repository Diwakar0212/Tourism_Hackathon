// Notification types
export interface NotificationData {
  type: 'emergency' | 'safety' | 'trip' | 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  persistent?: boolean;
  action?: () => void;
  actionLabel?: string;
  location?: {
    lat: number;
    lng: number;
  };
  contactInfo?: {
    name: string;
    phone?: string;
    email?: string;
  };
  metadata?: {
    tripId?: string;
    userId?: string;
    emergencyType?: 'sos' | 'medical' | 'security' | 'natural_disaster';
    severity?: 'low' | 'medium' | 'high' | 'critical';
  };
}

// Notification service class
class NotificationService {
  private static instance: NotificationService;

  private constructor() {}

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Show notification using custom event
  public show(data: NotificationData): void {
    const event = new CustomEvent('showNotification', {
      detail: data
    });
    document.dispatchEvent(event);
  }

  // Predefined notification methods
  public showEmergencyAlert(
    message: string,
    contactInfo?: NotificationData['contactInfo'],
    location?: NotificationData['location']
  ): void {
    this.show({
      type: 'emergency',
      title: '🚨 Emergency Alert',
      message,
      persistent: true,
      contactInfo,
      location,
      metadata: {
        emergencyType: 'sos',
        severity: 'critical'
      }
    });
  }

  public showSafetyCheckIn(userInfo: { name: string; status: string }): void {
    this.show({
      type: 'safety',
      title: '✅ Safety Check-in',
      message: `${userInfo.name} has checked in safely: ${userInfo.status}`,
      metadata: {
        severity: 'low'
      }
    });
  }

  public showTripUpdate(tripName: string, update: string): void {
    this.show({
      type: 'trip',
      title: `📍 Trip Update: ${tripName}`,
      message: update,
    });
  }

  public showLocationShare(
    sharedBy: string,
    location: NotificationData['location']
  ): void {
    this.show({
      type: 'info',
      title: '📍 Location Shared',
      message: `${sharedBy} has shared their location with you`,
      location,
      action: () => {
        if (location) {
          const mapUrl = `https://maps.google.com/?q=${location.lat},${location.lng}`;
          window.open(mapUrl, '_blank');
        }
      },
      actionLabel: 'View on Map'
    });
  }

  public showSOSAlert(
    fromUser: string,
    location?: NotificationData['location'],
    contactInfo?: NotificationData['contactInfo']
  ): void {
    this.show({
      type: 'emergency',
      title: '🆘 SOS ALERT',
      message: `${fromUser} has triggered an SOS alert and needs immediate assistance!`,
      persistent: true,
      location,
      contactInfo,
      metadata: {
        emergencyType: 'sos',
        severity: 'critical'
      }
    });
  }

  public showWeatherAlert(
    severity: 'low' | 'medium' | 'high',
    message: string,
    location?: string
  ): void {
    const severityEmoji = {
      low: '⚠️',
      medium: '🌩️',
      high: '🚨'
    };

    this.show({
      type: severity === 'high' ? 'emergency' : 'warning',
      title: `${severityEmoji[severity]} Weather Alert${location ? ` - ${location}` : ''}`,
      message,
      persistent: severity === 'high',
      metadata: {
        severity,
        emergencyType: 'natural_disaster'
      }
    });
  }

  public showTravelAdvisory(
    country: string,
    advisory: string,
    severity: 'low' | 'medium' | 'high'
  ): void {
    this.show({
      type: severity === 'high' ? 'warning' : 'info',
      title: `🏛️ Travel Advisory - ${country}`,
      message: advisory,
      metadata: {
        severity
      }
    });
  }

  public showBookingConfirmation(
    bookingType: string,
    details: string
  ): void {
    this.show({
      type: 'success',
      title: '✅ Booking Confirmed',
      message: `Your ${bookingType} booking has been confirmed: ${details}`,
    });
  }

  public showPaymentUpdate(
    status: 'success' | 'failed' | 'pending',
    amount: string,
    details?: string
  ): void {
    const statusConfig = {
      success: { type: 'success' as const, emoji: '✅', title: 'Payment Successful' },
      failed: { type: 'error' as const, emoji: '❌', title: 'Payment Failed' },
      pending: { type: 'info' as const, emoji: '⏳', title: 'Payment Pending' }
    };

    const config = statusConfig[status];
    
    this.show({
      type: config.type,
      title: `${config.emoji} ${config.title}`,
      message: `Amount: ${amount}${details ? `\n${details}` : ''}`,
    });
  }

  public showNetworkStatus(isOnline: boolean): void {
    this.show({
      type: isOnline ? 'success' : 'warning',
      title: isOnline ? '🌐 Back Online' : '📡 Connection Lost',
      message: isOnline 
        ? 'Your internet connection has been restored'
        : 'You are currently offline. Some features may be limited.',
    });
  }

  public showAIResponse(response: string, context?: string): void {
    this.show({
      type: 'info',
      title: '🤖 AI Assistant',
      message: context ? `${context}: ${response}` : response,
    });
  }

  // Clear all notifications
  public clearAll(): void {
    const event = new CustomEvent('clearAllNotifications');
    document.dispatchEvent(event);
  }
}

// Export singleton instance
export const notificationService = NotificationService.getInstance();
export default NotificationService;
