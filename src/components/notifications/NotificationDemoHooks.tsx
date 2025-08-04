import { useEffect } from 'react';
import { notificationService } from './NotificationService';

// Hook to initialize real-time safety monitoring
export const useSafetyMonitoring = () => {
  useEffect(() => {
    // Initialize safety monitoring when component mounts
    const initializeSafety = async () => {
      try {
        // Request notification permissions
        if ('Notification' in window && Notification.permission === 'default') {
          await Notification.requestPermission();
        }

        // Connect to real-time services
        // This would typically connect to your WebSocket/Socket.IO server
        console.log('Safety monitoring initialized');
        
        // Demo: Show a welcome notification
        setTimeout(() => {
          notificationService.show({
            type: 'info',
            title: '🛡️ Safety Monitoring Active',
            message: 'SafeSolo is now monitoring your safety and ready to assist in emergencies.',
          });
        }, 2000);

      } catch (error) {
        console.error('Failed to initialize safety monitoring:', error);
      }
    };

    initializeSafety();
  }, []);
};

// Demo emergency alert function
export const triggerEmergencyDemo = () => {
  notificationService.showSOSAlert(
    'Demo User',
    { lat: 40.7128, lng: -74.0060 }, // New York coordinates
    { name: 'Demo User', phone: '+1-555-0123' }
  );
};

// Demo safety check-in function
export const triggerSafetyCheckInDemo = () => {
  notificationService.showSafetyCheckIn({
    name: 'Travel Buddy',
    status: 'Arrived safely at hotel'
  });
};

// Demo trip update function
export const triggerTripUpdateDemo = () => {
  notificationService.showTripUpdate(
    'NYC Adventure',
    'Flight delayed by 30 minutes. New departure time: 3:30 PM'
  );
};

// Demo weather alert function
export const triggerWeatherAlertDemo = () => {
  notificationService.showWeatherAlert(
    'high',
    'Severe thunderstorm warning in effect. Seek shelter immediately.',
    'New York, NY'
  );
};

// Demo location sharing function
export const triggerLocationShareDemo = () => {
  notificationService.showLocationShare(
    'Travel Companion',
    { lat: 40.7589, lng: -73.9851 } // Times Square coordinates
  );
};

// Demo booking confirmation function
export const triggerBookingConfirmationDemo = () => {
  notificationService.showBookingConfirmation(
    'Hotel',
    'The Plaza Hotel, New York - Check-in: Dec 15, 2024'
  );
};

// Demo payment update function
export const triggerPaymentUpdateDemo = (status: 'success' | 'failed' | 'pending' = 'success') => {
  notificationService.showPaymentUpdate(
    status,
    '$299.99',
    status === 'success' ? 'Hotel booking payment processed' : 
    status === 'failed' ? 'Payment failed - please try again' :
    'Processing your payment'
  );
};

// Demo travel advisory function
export const triggerTravelAdvisoryDemo = () => {
  notificationService.showTravelAdvisory(
    'France',
    'Exercise increased caution due to potential civil unrest in central Paris.',
    'medium'
  );
};

// Demo AI response function
export const triggerAIResponseDemo = () => {
  notificationService.showAIResponse(
    'Based on your preferences, I recommend visiting the Metropolitan Museum of Art today. It\'s less crowded on weekday mornings!',
    'Travel Suggestion'
  );
};

// Demo network status function
export const triggerNetworkStatusDemo = (isOnline: boolean = true) => {
  notificationService.showNetworkStatus(isOnline);
};

const NotificationDemoHooks = {
  useSafetyMonitoring,
  triggerEmergencyDemo,
  triggerSafetyCheckInDemo,
  triggerTripUpdateDemo,
  triggerWeatherAlertDemo,
  triggerLocationShareDemo,
  triggerBookingConfirmationDemo,
  triggerPaymentUpdateDemo,
  triggerTravelAdvisoryDemo,
  triggerAIResponseDemo,
  triggerNetworkStatusDemo
};

export default NotificationDemoHooks;
