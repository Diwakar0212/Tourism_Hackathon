import React, { useState, useEffect } from 'react';
import { AlertTriangle, Phone, MapPin, Users } from 'lucide-react';
import Button from '../common/Button';
import Card from '../common/Card';

interface SOSButtonProps {
  onEmergencyTrigger: (type: string, location?: GeolocationPosition) => void;
  isActive?: boolean;
}

const SOSButton: React.FC<SOSButtonProps> = ({ onEmergencyTrigger, isActive = false }) => {
  const [isPressed, setIsPressed] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [location, setLocation] = useState<GeolocationPosition | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(position);
          setLocationError(null);
        },
        (error) => {
          setLocationError('Location access denied. SOS will work without location.');
          console.error('Geolocation error:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        }
      );
    }
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdown === 0 && isPressed) {
      // Trigger SOS
      handleSOSTrigger('emergency');
      setIsPressed(false);
    }
    return () => clearTimeout(timer);
  }, [countdown, isPressed]);

  const handleSOSPress = () => {
    if (isPressed) {
      // Cancel SOS
      setIsPressed(false);
      setCountdown(0);
    } else {
      // Start countdown
      setIsPressed(true);
      setCountdown(3);
    }
  };

  const handleSOSTrigger = (type: string) => {
    onEmergencyTrigger(type, location || undefined);
    // Trigger vibration if available
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200, 100, 200]);
    }
  };

  const quickActions = [
    {
      id: 'police',
      label: 'Police',
      icon: AlertTriangle,
      color: 'bg-red-600 hover:bg-red-700',
      action: () => handleSOSTrigger('police'),
    },
    {
      id: 'medical',
      label: 'Medical',
      icon: Phone,
      color: 'bg-blue-600 hover:bg-blue-700',
      action: () => handleSOSTrigger('medical'),
    },
    {
      id: 'harassment',
      label: 'Harassment',
      icon: Users,
      color: 'bg-purple-600 hover:bg-purple-700',
      action: () => handleSOSTrigger('harassment'),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Main SOS Button */}
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <button
            onClick={handleSOSPress}
            className={`relative w-32 h-32 rounded-full shadow-lg transition-all duration-300 transform ${
              isPressed
                ? 'bg-red-600 scale-110 animate-pulse'
                : 'bg-red-500 hover:bg-red-600 hover:scale-105'
            } ${isActive ? 'ring-4 ring-red-200' : ''}`}
            style={{
              background: isPressed 
                ? `conic-gradient(from 0deg, #dc2626 ${((3 - countdown) / 3) * 360}deg, #ef4444 ${((3 - countdown) / 3) * 360}deg)`
                : undefined
            }}
          >
            <div className="flex flex-col items-center justify-center h-full text-white">
              <AlertTriangle className="h-8 w-8 mb-1" />
              <span className="text-lg font-bold">
                {isPressed ? countdown : 'SOS'}
              </span>
            </div>
          </button>
          
          {isPressed && (
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setIsPressed(false);
                  setCountdown(0);
                }}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            {isPressed 
              ? `Sending SOS in ${countdown} seconds...`
              : 'Press and hold for 3 seconds to send SOS'
            }
          </p>
          {location && (
            <div className="flex items-center justify-center mt-2 text-xs text-green-600">
              <MapPin className="h-3 w-3 mr-1" />
              <span>Location detected</span>
            </div>
          )}
          {locationError && (
            <p className="text-xs text-orange-600 mt-1">{locationError}</p>
          )}
        </div>
      </div>

      {/* Quick Action Buttons */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 gap-3">
          {quickActions.map((action) => {
            const IconComponent = action.icon;
            return (
              <Button
                key={action.id}
                onClick={action.action}
                className={`${action.color} text-white justify-start`}
                fullWidth
                icon={<IconComponent className="h-4 w-4" />}
              >
                {action.label}
              </Button>
            );
          })}
        </div>
      </Card>

      {/* Safety Information */}
      <Card className="bg-blue-50 border-blue-200">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-blue-900">Safety Information</h4>
            <p className="text-sm text-blue-700 mt-1">
              Your SOS alert will be sent to your emergency contacts and local authorities. 
              Your location will be shared to help responders find you quickly.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SOSButton;