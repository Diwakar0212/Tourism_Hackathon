import React, { useState, useEffect } from 'react';
import { useSafety } from '../../contexts/SafetyContext';
import Card from '../common/Card';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { MapPin, Navigation, AlertTriangle, Shield, Clock, Battery } from 'lucide-react';

export const LocationTracker: React.FC = () => {
  const {
    currentLocation,
    isTrackingEnabled,
    locationHistory,
    startLocationTracking,
    stopLocationTracking,
    error
  } = useSafety();

  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [accuracy, setAccuracy] = useState<string>('Unknown');

  useEffect(() => {
    // Get battery level if available
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setBatteryLevel(Math.round(battery.level * 100));
        
        battery.addEventListener('levelchange', () => {
          setBatteryLevel(Math.round(battery.level * 100));
        });
      }).catch(() => {
        // Battery API not available
      });
    }
  }, []);

  useEffect(() => {
    if (currentLocation) {
      if (currentLocation.accuracy < 10) {
        setAccuracy('High');
      } else if (currentLocation.accuracy < 50) {
        setAccuracy('Medium');
      } else {
        setAccuracy('Low');
      }
    }
  }, [currentLocation]);

  const formatCoordinates = (lat: number, lng: number) => {
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const getLocationAge = (timestamp: number) => {
    const ageMs = Date.now() - timestamp;
    const ageMinutes = Math.floor(ageMs / 60000);
    
    if (ageMinutes < 1) return 'Just now';
    if (ageMinutes < 60) return `${ageMinutes}m ago`;
    
    const ageHours = Math.floor(ageMinutes / 60);
    if (ageHours < 24) return `${ageHours}h ago`;
    
    const ageDays = Math.floor(ageHours / 24);
    return `${ageDays}d ago`;
  };

  return (
    <div className="space-y-6">
      {/* Current Status */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Navigation className="h-5 w-5 text-teal-600" />
            Location Tracking
          </h2>
          <Badge 
            variant={isTrackingEnabled ? 'success' : 'warning'}
            className="flex items-center gap-1"
          >
            <div className={`w-2 h-2 rounded-full ${isTrackingEnabled ? 'bg-green-500' : 'bg-yellow-500'}`} />
            {isTrackingEnabled ? 'Active' : 'Inactive'}
          </Badge>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Current Location */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-teal-600" />
              Current Location
            </h3>
            
            {currentLocation ? (
              <div className="space-y-2">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Coordinates:</span><br />
                  {formatCoordinates(currentLocation.latitude, currentLocation.longitude)}
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Accuracy:</span> {accuracy} ({currentLocation.accuracy.toFixed(0)}m)
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Last Updated:</span> {getLocationAge(currentLocation.timestamp)}
                </div>
                {currentLocation.address && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Address:</span><br />
                    {currentLocation.address}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-gray-500 text-sm">
                {isTrackingEnabled ? 'Getting location...' : 'Location tracking is disabled'}
              </div>
            )}
          </div>

          {/* System Status */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Shield className="h-4 w-4 text-teal-600" />
              System Status
            </h3>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">GPS Signal:</span>
                <Badge variant={accuracy === 'High' ? 'success' : accuracy === 'Medium' ? 'warning' : 'error'}>
                  {accuracy}
                </Badge>
              </div>
              
              {batteryLevel !== null && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 flex items-center gap-1">
                    <Battery className="h-3 w-3" />
                    Battery:
                  </span>
                  <Badge variant={batteryLevel > 20 ? 'success' : 'warning'}>
                    {batteryLevel}%
                  </Badge>
                </div>
              )}
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Location History:</span>
                <span className="font-medium">{locationHistory.length} points</span>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-3">
          {!isTrackingEnabled ? (
            <Button 
              onClick={startLocationTracking}
              className="flex items-center gap-2"
              disabled={!navigator.geolocation}
            >
              <Navigation className="h-4 w-4" />
              Start Tracking
            </Button>
          ) : (
            <Button 
              onClick={stopLocationTracking}
              variant="outline"
              className="flex items-center gap-2"
            >
              Stop Tracking
            </Button>
          )}
          
          {currentLocation && (
            <Button
              variant="outline"
              onClick={() => {
                const url = `https://maps.google.com/maps?q=${currentLocation.latitude},${currentLocation.longitude}`;
                window.open(url, '_blank');
              }}
              className="flex items-center gap-2"
            >
              <MapPin className="h-4 w-4" />
              View on Map
            </Button>
          )}
        </div>
      </Card>

      {/* Location History */}
      {locationHistory.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-teal-600" />
            Recent Locations
          </h3>
          
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {locationHistory.slice(-10).reverse().map((location) => (
              <div 
                key={location.timestamp} 
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">
                    {formatCoordinates(location.latitude, location.longitude)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatTimestamp(location.timestamp)} • Accuracy: {location.accuracy.toFixed(0)}m
                  </div>
                </div>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const url = `https://maps.google.com/maps?q=${location.latitude},${location.longitude}`;
                    window.open(url, '_blank');
                  }}
                  className="ml-3"
                >
                  <MapPin className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
          
          {locationHistory.length > 10 && (
            <div className="text-center mt-4">
              <Button variant="outline" size="sm">
                View All {locationHistory.length} Locations
              </Button>
            </div>
          )}
        </Card>
      )}

      {/* Info Card */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900">Privacy & Battery</h4>
            <p className="text-sm text-blue-700 mt-1">
              Your location is securely stored and only shared with your emergency contacts when needed. 
              Location tracking may impact battery life.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
