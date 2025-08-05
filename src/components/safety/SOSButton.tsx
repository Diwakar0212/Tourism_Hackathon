import React, { useState, useEffect, useRef } from 'react';
import { useSafety } from '../../contexts/SafetyContext';
import Card from '../common/Card';
import Button from '../common/Button';
import Modal from '../common/Modal';
import Badge from '../common/Badge';
import { AlertTriangle, Shield, Phone, MapPin, Clock, X } from 'lucide-react';

export const SOSButton: React.FC = () => {
  const { 
    activeSOS, 
    triggerSOS, 
    cancelSOS, 
    currentLocation, 
    emergencyContacts,
    safetySettings 
  } = useSafety();

  const [isCountdownActive, setIsCountdownActive] = useState(false);
  const [countdown, setCountdown] = useState(safetySettings.sosCountdown);
  const [sosMessage, setSOSMessage] = useState('');
  const [isSOSModalOpen, setIsSOSModalOpen] = useState(false);
  
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const sosTriggeredRef = useRef(false);

  // Reset countdown when settings change
  useEffect(() => {
    setCountdown(safetySettings.sosCountdown);
  }, [safetySettings.sosCountdown]);

  // Handle countdown logic
  useEffect(() => {
    if (isCountdownActive && countdown > 0) {
      countdownIntervalRef.current = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            // Trigger SOS when countdown reaches 0
            if (!sosTriggeredRef.current) {
              sosTriggeredRef.current = true;
              handleSOSTrigger();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
    }

    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, [isCountdownActive, countdown]);

  const startSOSCountdown = () => {
    setIsCountdownActive(true);
    sosTriggeredRef.current = false;
    setCountdown(safetySettings.sosCountdown);
  };

  const cancelSOSCountdown = () => {
    setIsCountdownActive(false);
    setCountdown(safetySettings.sosCountdown);
    sosTriggeredRef.current = false;
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
  };

  const handleSOSTrigger = async () => {
    try {
      setIsCountdownActive(false);
      await triggerSOS(sosMessage || undefined);
      setSOSMessage('');
    } catch (error) {
      console.error('Failed to trigger SOS:', error);
      // Reset state on error
      setIsCountdownActive(false);
      setCountdown(safetySettings.sosCountdown);
      sosTriggeredRef.current = false;
    }
  };

  const handleSOSCancel = async () => {
    try {
      await cancelSOS();
    } catch (error) {
      console.error('Failed to cancel SOS:', error);
    }
  };

  const formatElapsedTime = (timestamp: number) => {
    const elapsed = Date.now() - timestamp;
    const minutes = Math.floor(elapsed / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Quick SOS (immediate trigger)
  const handleQuickSOS = () => {
    setIsSOSModalOpen(true);
  };

  const confirmQuickSOS = async () => {
    setIsSOSModalOpen(false);
    await handleSOSTrigger();
  };

  if (activeSOS) {
    return (
      <div className="space-y-4">
        {/* Active SOS Alert */}
        <Card className="p-6 bg-red-50 border-red-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-full">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-red-900">SOS Alert Active</h2>
                <p className="text-sm text-red-700">
                  Emergency services and contacts have been notified
                </p>
              </div>
            </div>
            <Badge variant="error" className="animate-pulse">
              ACTIVE
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="font-semibold text-red-900 mb-2">Alert Details</h3>
              <div className="space-y-2 text-sm text-red-800">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Duration: {formatElapsedTime(activeSOS.timestamp)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>
                    Location: {activeSOS.location.latitude.toFixed(6)}, {activeSOS.location.longitude.toFixed(6)}
                  </span>
                </div>
                {activeSOS.message && (
                  <div>
                    <span className="font-medium">Message:</span> {activeSOS.message}
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-red-900 mb-2">Response Status</h3>
              <div className="space-y-2 text-sm text-red-800">
                <div>Emergency Services: Notified</div>
                <div>Emergency Contacts: {emergencyContacts.length} notified</div>
                <div>Responders: {activeSOS.responders.length} responding</div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleSOSCancel}
              variant="outline"
              className="border-red-300 text-red-700 hover:bg-red-50"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel Alert (False Alarm)
            </Button>
            
            <Button
              onClick={() => {
                const url = `https://maps.google.com/maps?q=${activeSOS.location.latitude},${activeSOS.location.longitude}`;
                window.open(url, '_blank');
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              <MapPin className="h-4 w-4 mr-2" />
              View Location on Map
            </Button>
          </div>
        </Card>

        {/* Safety Tips during Emergency */}
        <Card className="p-4 bg-blue-50 border-blue-200">
          <h4 className="font-medium text-blue-900 mb-2">Emergency Tips</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Stay calm and in a safe location if possible</li>
            <li>• Keep your phone charged and with you</li>
            <li>• Follow instructions from emergency responders</li>
            <li>• Cancel the alert only if it's truly a false alarm</li>
          </ul>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* SOS Button */}
      <Card className="p-6">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Emergency SOS</h2>
          <p className="text-gray-600 mb-6">
            Press and hold for {safetySettings.sosCountdown} seconds to trigger an emergency alert
          </p>

          {isCountdownActive ? (
            <div className="space-y-4">
              <div className="relative inline-flex items-center justify-center">
                <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75"></div>
                <div className="relative bg-red-600 text-white rounded-full w-32 h-32 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold">{countdown}</div>
                    <div className="text-sm">Triggering SOS</div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <textarea
                  value={sosMessage}
                  onChange={(e) => setSOSMessage(e.target.value)}
                  placeholder="Optional: Add emergency message..."
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                  rows={2}
                />
                
                <Button
                  onClick={cancelSOSCountdown}
                  variant="outline"
                  size="lg"
                  className="w-full border-red-300 text-red-700 hover:bg-red-50"
                >
                  Cancel SOS
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-center gap-4">
                <Button
                  onMouseDown={startSOSCountdown}
                  onMouseUp={cancelSOSCountdown}
                  onMouseLeave={cancelSOSCountdown}
                  onTouchStart={startSOSCountdown}
                  onTouchEnd={cancelSOSCountdown}
                  className="bg-red-600 hover:bg-red-700 text-white rounded-full w-32 h-32 text-lg font-bold"
                  disabled={!currentLocation || emergencyContacts.length === 0}
                >
                  <div className="text-center">
                    <AlertTriangle className="h-8 w-8 mx-auto mb-1" />
                    <div>SOS</div>
                  </div>
                </Button>
              </div>

              <Button
                onClick={handleQuickSOS}
                variant="outline"
                className="w-full border-red-300 text-red-700 hover:bg-red-50"
                disabled={!currentLocation || emergencyContacts.length === 0}
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Immediate SOS (No Countdown)
              </Button>

              {(!currentLocation || emergencyContacts.length === 0) && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2 text-yellow-800 text-sm">
                    <AlertTriangle className="h-4 w-4" />
                    <div>
                      {!currentLocation && 'Location tracking required. '}
                      {emergencyContacts.length === 0 && 'Add emergency contacts first.'}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Emergency Contacts Summary */}
      {emergencyContacts.length > 0 && (
        <Card className="p-4">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Phone className="h-4 w-4 text-teal-600" />
            Emergency Contacts ({emergencyContacts.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {emergencyContacts.slice(0, 4).map((contact) => (
              <div key={contact.id} className="flex items-center gap-2 text-sm text-gray-600">
                <div className={`w-2 h-2 rounded-full ${contact.isPrimary ? 'bg-teal-500' : 'bg-gray-400'}`} />
                <span>{contact.name}</span>
                {contact.isPrimary && <Badge variant="success" className="text-xs">Primary</Badge>}
              </div>
            ))}
            {emergencyContacts.length > 4 && (
              <div className="text-sm text-gray-500">
                +{emergencyContacts.length - 4} more contacts
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Safety Information */}
      <Card className="p-4 bg-orange-50 border-orange-200">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-orange-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-orange-900">How SOS Works</h4>
            <ul className="text-sm text-orange-700 mt-1 space-y-1">
              <li>• Press and hold the SOS button for {safetySettings.sosCountdown} seconds</li>
              <li>• Your location and emergency message will be sent to all contacts</li>
              <li>• Local emergency services will be automatically notified</li>
              <li>• You can cancel within the countdown period if triggered accidentally</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Quick SOS Confirmation Modal */}
      <Modal
        isOpen={isSOSModalOpen}
        onClose={() => setIsSOSModalOpen(false)}
        title="Confirm Emergency SOS"
      >
        <div className="space-y-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span className="font-medium text-red-900">Emergency Alert</span>
            </div>
            <p className="text-sm text-red-700">
              This will immediately notify emergency services and your emergency contacts. 
              Only use this if you're in genuine danger.
            </p>
          </div>

          <textarea
            value={sosMessage}
            onChange={(e) => setSOSMessage(e.target.value)}
            placeholder="Optional: Describe your emergency..."
            className="w-full p-3 border border-gray-300 rounded-lg resize-none"
            rows={3}
          />

          <div className="flex gap-3">
            <Button
              onClick={confirmQuickSOS}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Trigger Emergency SOS
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsSOSModalOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SOSButton;