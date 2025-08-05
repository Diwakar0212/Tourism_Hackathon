import React, { useState, useEffect } from 'react';
import { useSafety } from '../../contexts/SafetyContext';
import Card from '../common/Card';
import Button from '../common/Button';
import Badge from '../common/Badge';
import Modal from '../common/Modal';
import FormInput from '../forms/FormInput';
import FormSelect from '../forms/FormSelect';
import { CheckCircle, AlertTriangle, Clock, MapPin, MessageSquare, Calendar, Settings } from 'lucide-react';

export const SafetyCheckIn: React.FC = () => {
  const { 
    checkIns, 
    performCheckIn, 
    safetySettings, 
    updateSafetySettings,
    scheduleAutoCheckIn,
    cancelAutoCheckIn,
    currentLocation 
  } = useSafety();

  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [checkInStatus, setCheckInStatus] = useState<'safe' | 'needs_help' | 'emergency'>('safe');
  const [checkInMessage, setCheckInMessage] = useState('');
  const [newInterval, setNewInterval] = useState(safetySettings.autoCheckInInterval.toString());
  const [nextCheckInTime, setNextCheckInTime] = useState<Date | null>(null);

  const statusOptions = [
    { value: 'safe', label: 'Safe & Well', color: 'text-green-600', bgColor: 'bg-green-50' },
    { value: 'needs_help', label: 'Need Assistance', color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
    { value: 'emergency', label: 'Emergency', color: 'text-red-600', bgColor: 'bg-red-50' }
  ];

  // Calculate next check-in time
  useEffect(() => {
    const lastCheckIn = checkIns[0];
    if (lastCheckIn && safetySettings.autoCheckInInterval > 0) {
      const next = new Date(lastCheckIn.timestamp + (safetySettings.autoCheckInInterval * 60 * 1000));
      setNextCheckInTime(next);
    }
  }, [checkIns, safetySettings.autoCheckInInterval]);

  const handleCheckIn = async () => {
    try {
      await performCheckIn(checkInStatus, checkInMessage || undefined);
      setIsCheckInModalOpen(false);
      setCheckInMessage('');
      setCheckInStatus('safe');
    } catch (error) {
      console.error('Failed to perform check-in:', error);
    }
  };

  const handleUpdateSettings = async () => {
    try {
      const interval = parseInt(newInterval);
      if (interval > 0) {
        await updateSafetySettings({ autoCheckInInterval: interval });
        if (interval !== safetySettings.autoCheckInInterval) {
          scheduleAutoCheckIn(interval);
        }
      } else {
        cancelAutoCheckIn();
      }
      setIsSettingsModalOpen(false);
    } catch (error) {
      console.error('Failed to update settings:', error);
    }
  };

  const getStatusInfo = (status: string) => {
    return statusOptions.find(opt => opt.value === status) || statusOptions[0];
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const getTimeSinceLastCheckIn = () => {
    if (checkIns.length === 0) return 'Never';
    
    const lastCheckIn = checkIns[0];
    const elapsed = Date.now() - lastCheckIn.timestamp;
    const hours = Math.floor(elapsed / (1000 * 60 * 60));
    const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ago`;
    }
    return `${minutes}m ago`;
  };

  const isOverdue = () => {
    if (!nextCheckInTime) return false;
    return Date.now() > nextCheckInTime.getTime();
  };

  const lastCheckIn = checkIns[0];

  return (
    <div className="space-y-6">
      {/* Quick Check-in */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Safety Check-in</h2>
          <Button
            onClick={() => setIsSettingsModalOpen(true)}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{checkIns.length}</div>
            <div className="text-sm text-gray-600">Total Check-ins</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-teal-600">
              {getTimeSinceLastCheckIn()}
            </div>
            <div className="text-sm text-gray-600">Last Check-in</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${isOverdue() ? 'text-red-600' : 'text-gray-900'}`}>
              {nextCheckInTime ? (
                <div className="flex items-center justify-center gap-1">
                  <Clock className="h-5 w-5" />
                  {isOverdue() ? 'Overdue' : 'On Time'}
                </div>
              ) : (
                'Manual'
              )}
            </div>
            <div className="text-sm text-gray-600">Status</div>
          </div>
        </div>

        {/* Last Check-in Status */}
        {lastCheckIn && (
          <div className={`p-4 rounded-lg mb-6 ${getStatusInfo(lastCheckIn.status).bgColor}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full bg-white`}>
                  {lastCheckIn.status === 'safe' ? (
                    <CheckCircle className={`h-5 w-5 ${getStatusInfo(lastCheckIn.status).color}`} />
                  ) : (
                    <AlertTriangle className={`h-5 w-5 ${getStatusInfo(lastCheckIn.status).color}`} />
                  )}
                </div>
                <div>
                  <div className={`font-semibold ${getStatusInfo(lastCheckIn.status).color}`}>
                    {getStatusInfo(lastCheckIn.status).label}
                  </div>
                  <div className="text-sm text-gray-600">
                    {formatTimestamp(lastCheckIn.timestamp)}
                  </div>
                  {lastCheckIn.message && (
                    <div className="text-sm text-gray-700 mt-1">
                      "{lastCheckIn.message}"
                    </div>
                  )}
                </div>
              </div>
              <Badge variant={lastCheckIn.status === 'safe' ? 'success' : lastCheckIn.status === 'needs_help' ? 'warning' : 'error'}>
                {getStatusInfo(lastCheckIn.status).label}
              </Badge>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Button
            onClick={() => {
              setCheckInStatus('safe');
              setIsCheckInModalOpen(true);
            }}
            className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
            disabled={!currentLocation}
          >
            <CheckCircle className="h-4 w-4" />
            I'm Safe
          </Button>
          
          <Button
            onClick={() => {
              setCheckInStatus('needs_help');
              setIsCheckInModalOpen(true);
            }}
            className="bg-yellow-600 hover:bg-yellow-700 flex items-center gap-2"
            disabled={!currentLocation}
          >
            <AlertTriangle className="h-4 w-4" />
            Need Help
          </Button>
          
          <Button
            onClick={() => {
              setCheckInStatus('emergency');
              setIsCheckInModalOpen(true);
            }}
            className="bg-red-600 hover:bg-red-700 flex items-center gap-2"
            disabled={!currentLocation}
          >
            <AlertTriangle className="h-4 w-4" />
            Emergency
          </Button>
        </div>

        {!currentLocation && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 text-yellow-800 text-sm">
              <MapPin className="h-4 w-4" />
              <span>Location tracking required for check-ins.</span>
            </div>
          </div>
        )}
      </Card>

      {/* Auto Check-in Info */}
      {safetySettings.autoCheckInInterval > 0 && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900">Automatic Check-ins</h4>
              <p className="text-sm text-blue-700 mt-1">
                You're scheduled to check in every {safetySettings.autoCheckInInterval} minutes.
                {nextCheckInTime && (
                  <span className={isOverdue() ? 'text-red-600 font-medium' : ''}>
                    {' '}Next check-in: {nextCheckInTime.toLocaleString()}
                  </span>
                )}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Recent Check-ins */}
      {checkIns.length > 1 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-teal-600" />
            Recent Check-ins
          </h3>
          
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {checkIns.slice(1, 11).map((checkIn) => {
              const statusInfo = getStatusInfo(checkIn.status);
              return (
                <div key={checkIn.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`p-1 rounded-full ${statusInfo.bgColor}`}>
                      {checkIn.status === 'safe' ? (
                        <CheckCircle className={`h-4 w-4 ${statusInfo.color}`} />
                      ) : (
                        <AlertTriangle className={`h-4 w-4 ${statusInfo.color}`} />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{statusInfo.label}</div>
                      <div className="text-sm text-gray-600">
                        {formatTimestamp(checkIn.timestamp)}
                      </div>
                      {checkIn.message && (
                        <div className="text-sm text-gray-700 mt-1">"{checkIn.message}"</div>
                      )}
                    </div>
                  </div>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const url = `https://maps.google.com/maps?q=${checkIn.location.latitude},${checkIn.location.longitude}`;
                      window.open(url, '_blank');
                    }}
                  >
                    <MapPin className="h-3 w-3" />
                  </Button>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Check-in Modal */}
      <Modal
        isOpen={isCheckInModalOpen}
        onClose={() => {
          setIsCheckInModalOpen(false);
          setCheckInMessage('');
        }}
        title="Safety Check-in"
      >
        <div className="space-y-4">
          <div className={`p-4 rounded-lg ${getStatusInfo(checkInStatus).bgColor}`}>
            <div className="flex items-center gap-3">
              {checkInStatus === 'safe' ? (
                <CheckCircle className={`h-6 w-6 ${getStatusInfo(checkInStatus).color}`} />
              ) : (
                <AlertTriangle className={`h-6 w-6 ${getStatusInfo(checkInStatus).color}`} />
              )}
              <div>
                <div className={`font-semibold ${getStatusInfo(checkInStatus).color}`}>
                  {getStatusInfo(checkInStatus).label}
                </div>
                <div className="text-sm text-gray-600">
                  Your contacts will be notified of your status
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <FormSelect
              value={checkInStatus}
              onChange={(value: any) => setCheckInStatus(value)}
              options={statusOptions.map(opt => ({
                value: opt.value,
                label: opt.label
              }))}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Message (Optional)
            </label>
            <textarea
              value={checkInMessage}
              onChange={(e) => setCheckInMessage(e.target.value)}
              placeholder="Add any additional details about your status..."
              className="w-full p-3 border border-gray-300 rounded-lg resize-none"
              rows={3}
            />
          </div>

          {currentLocation && (
            <div className="text-sm text-gray-600 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-green-600" />
              <span>Location will be included: {currentLocation.latitude.toFixed(4)}, {currentLocation.longitude.toFixed(4)}</span>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleCheckIn}
              disabled={!currentLocation}
              className="flex-1"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Send Check-in
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setIsCheckInModalOpen(false);
                setCheckInMessage('');
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Settings Modal */}
      <Modal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        title="Check-in Settings"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Auto Check-in Interval (minutes)
            </label>
            <FormInput
              type="number"
              value={newInterval}
              onChange={(value: any) => setNewInterval(value)}
              placeholder="0 to disable auto check-in"
            />
            <p className="text-xs text-gray-500 mt-1">
              Set to 0 to disable automatic check-ins. Recommended: 60-180 minutes for travel.
            </p>
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900 text-sm">How Auto Check-ins Work</h4>
            <ul className="text-xs text-blue-700 mt-1 space-y-1">
              <li>• Automatic "safe" check-ins are sent at regular intervals</li>
              <li>• If you miss a check-in, your contacts are notified</li>
              <li>• You can still send manual check-ins anytime</li>
              <li>• Emergency check-ins immediately alert all contacts</li>
            </ul>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleUpdateSettings}
              className="flex-1"
            >
              Save Settings
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsSettingsModalOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
