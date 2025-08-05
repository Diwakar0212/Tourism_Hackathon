import React, { useState } from 'react';
import { useSafety } from '../../contexts/SafetyContext';
import { LocationTracker } from './LocationTracker';
import { SOSButton } from './SOSButton';
import { EmergencyContacts } from './EmergencyContacts';
import { SafetyCheckIn } from './SafetyCheckIn';
import Card from '../common/Card';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { 
  Shield, 
  MapPin, 
  Users, 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  Settings,
  Activity
} from 'lucide-react';

export const SafetyDashboard: React.FC = () => {
  const { 
    currentLocation,
    isTrackingEnabled, 
    emergencyContacts,
    checkIns,
    activeSOS,
    safetySettings,
    isLoading
  } = useSafety();

  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      icon: <Activity className="h-4 w-4" />
    },
    {
      id: 'sos',
      label: 'Emergency SOS',
      icon: <AlertTriangle className="h-4 w-4" />
    },
    {
      id: 'checkin',
      label: 'Check-ins',
      icon: <MessageSquare className="h-4 w-4" />
    },
    {
      id: 'location',
      label: 'Location',
      icon: <MapPin className="h-4 w-4" />
    },
    {
      id: 'contacts',
      label: 'Contacts',
      icon: <Users className="h-4 w-4" />
    }
  ];

  const getOverallSafetyStatus = () => {
    if (activeSOS) return { status: 'emergency', label: 'Emergency Active', color: 'error' };
    
    const recentCheckIn = checkIns[0];
    if (recentCheckIn) {
      const isRecent = (Date.now() - recentCheckIn.timestamp) < (safetySettings.autoCheckInInterval * 60 * 1000 * 1.5);
      
      if (recentCheckIn.status === 'emergency') {
        return { status: 'emergency', label: 'Emergency Reported', color: 'error' };
      } else if (recentCheckIn.status === 'needs_help') {
        return { status: 'warning', label: 'Assistance Needed', color: 'warning' };
      } else if (recentCheckIn.status === 'safe' && isRecent) {
        return { status: 'safe', label: 'Safe & Secure', color: 'success' };
      }
    }
    
    if (!isTrackingEnabled || emergencyContacts.length === 0) {
      return { status: 'setup', label: 'Setup Required', color: 'warning' };
    }
    
    return { status: 'active', label: 'Monitoring Active', color: 'info' };
  };

  const safetyStatus = getOverallSafetyStatus();

  const getSetupProgress = () => {
    let completed = 0;
    let total = 4;
    
    if (isTrackingEnabled) completed++;
    if (emergencyContacts.length > 0) completed++;
    if (checkIns.length > 0) completed++;
    if (safetySettings.autoCheckInInterval > 0) completed++;
    
    return { completed, total, percentage: Math.round((completed / total) * 100) };
  };

  const setupProgress = getSetupProgress();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading safety features...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Safety Center</h1>
          <p className="text-gray-600">Your personal safety monitoring dashboard</p>
        </div>
        <Badge 
          variant={safetyStatus.color as any}
          className="flex items-center gap-2 px-3 py-2"
        >
          <Shield className="h-4 w-4" />
          {safetyStatus.label}
        </Badge>
      </div>

      {/* Active Emergency Alert */}
      {activeSOS && (
        <Card className="p-4 bg-red-50 border-red-200 border-l-4 border-l-red-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-red-600 animate-pulse" />
              <div>
                <h3 className="font-semibold text-red-900">Emergency SOS Active</h3>
                <p className="text-sm text-red-700">
                  Alert triggered at {new Date(activeSOS.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
            <Button
              size="sm"
              onClick={() => setActiveTab('sos')}
              className="bg-red-600 hover:bg-red-700"
            >
              Manage Alert
            </Button>
          </div>
        </Card>
      )}

      {/* Setup Progress */}
      {setupProgress.percentage < 100 && (
        <Card className="p-4 bg-yellow-50 border-yellow-200">
          <div className="flex items-start gap-3">
            <Settings className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-medium text-yellow-900">Complete Your Safety Setup</h3>
              <p className="text-sm text-yellow-700 mb-3">
                {setupProgress.completed} of {setupProgress.total} safety features configured ({setupProgress.percentage}%)
              </p>
              <div className="w-full bg-yellow-200 rounded-full h-2 mb-3">
                <div 
                  className="bg-yellow-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${setupProgress.percentage}%` }}
                ></div>
              </div>
              <div className="space-y-1 text-sm text-yellow-800">
                {!isTrackingEnabled && <div>• Enable location tracking</div>}
                {emergencyContacts.length === 0 && <div>• Add emergency contacts</div>}
                {checkIns.length === 0 && <div>• Perform your first safety check-in</div>}
                {safetySettings.autoCheckInInterval === 0 && <div>• Configure automatic check-ins</div>}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${isTrackingEnabled ? 'bg-green-100' : 'bg-gray-100'}`}>
                    <MapPin className={`h-5 w-5 ${isTrackingEnabled ? 'text-green-600' : 'text-gray-400'}`} />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Location</div>
                    <div className="font-semibold">
                      {isTrackingEnabled ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-blue-100">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Contacts</div>
                    <div className="font-semibold">{emergencyContacts.length}</div>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-teal-100">
                    <MessageSquare className="h-5 w-5 text-teal-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Check-ins</div>
                    <div className="font-semibold">{checkIns.length}</div>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-purple-100">
                    <Clock className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Auto Check-in</div>
                    <div className="font-semibold">
                      {safetySettings.autoCheckInInterval > 0 
                        ? `${safetySettings.autoCheckInInterval}m`
                        : 'Off'
                      }
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              
              {checkIns.length > 0 ? (
                <div className="space-y-3">
                  {checkIns.slice(0, 5).map((checkIn) => (
                    <div key={checkIn.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className={`p-2 rounded-full ${
                        checkIn.status === 'safe' ? 'bg-green-100' :
                        checkIn.status === 'needs_help' ? 'bg-yellow-100' : 'bg-red-100'
                      }`}>
                        {checkIn.status === 'safe' ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <AlertTriangle className={`h-4 w-4 ${
                            checkIn.status === 'needs_help' ? 'text-yellow-600' : 'text-red-600'
                          }`} />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          {checkIn.status === 'safe' ? 'Safe Check-in' :
                           checkIn.status === 'needs_help' ? 'Assistance Needed' : 'Emergency Report'}
                        </div>
                        <div className="text-sm text-gray-600">
                          {new Date(checkIn.timestamp).toLocaleString()}
                        </div>
                        {checkIn.message && (
                          <div className="text-sm text-gray-700 mt-1">"{checkIn.message}"</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No Activity Yet</h4>
                  <p className="text-gray-600 mb-4">Start with your first safety check-in</p>
                  <Button onClick={() => setActiveTab('checkin')}>
                    Make First Check-in
                  </Button>
                </div>
              )}
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4">
                <h3 className="font-medium text-gray-900 mb-3">Quick Safety Actions</h3>
                <div className="space-y-2">
                  <Button
                    onClick={() => setActiveTab('checkin')}
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                    Send "I'm Safe" Check-in
                  </Button>
                  <Button
                    onClick={() => setActiveTab('sos')}
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <AlertTriangle className="h-4 w-4 mr-2 text-red-600" />
                    Emergency SOS
                  </Button>
                </div>
              </Card>

              <Card className="p-4">
                <h3 className="font-medium text-gray-900 mb-3">Current Location</h3>
                {currentLocation ? (
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600">
                      <div>Lat: {currentLocation.latitude.toFixed(6)}</div>
                      <div>Lng: {currentLocation.longitude.toFixed(6)}</div>
                      <div>Accuracy: {currentLocation.accuracy.toFixed(0)}m</div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const url = `https://maps.google.com/maps?q=${currentLocation.latitude},${currentLocation.longitude}`;
                        window.open(url, '_blank');
                      }}
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      View on Map
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Location not available</p>
                    <Button
                      size="sm"
                      onClick={() => setActiveTab('location')}
                      className="mt-2"
                    >
                      Enable Tracking
                    </Button>
                  </div>
                )}
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'sos' && <SOSButton />}
        {activeTab === 'checkin' && <SafetyCheckIn />}
        {activeTab === 'location' && <LocationTracker />}
        {activeTab === 'contacts' && <EmergencyContacts />}
      </div>
    </div>
  );
};
