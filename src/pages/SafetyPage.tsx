import React, { useState } from 'react';
import { 
  Shield, 
  Phone, 
  MapPin, 
  Users, 
  AlertTriangle,
  Clock,
  CheckCircle,
  Settings
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import SOSButton from '../components/safety/SOSButton';

const SafetyPage: React.FC = () => {
  const [emergencyContacts, setEmergencyContacts] = useState([
    { id: '1', name: 'Mom', phone: '+91 98765 43210', relationship: 'Mother', isPrimary: true },
    { id: '2', name: 'Sister', phone: '+91 87654 32109', relationship: 'Sister', isPrimary: false },
  ]);

  const [safetyChecks, setSafetyChecks] = useState([
    { id: '1', time: '2:00 PM', status: 'completed', location: 'Red Fort, Delhi' },
    { id: '2', time: '6:00 PM', status: 'pending', location: 'India Gate, Delhi' },
    { id: '3', time: '10:00 PM', status: 'pending', location: 'Hotel Taj Palace' },
  ]);

  const handleEmergencyTrigger = (type: string, location?: GeolocationPosition) => {
    console.log('Emergency triggered:', type, location);
    // In a real app, this would send SOS alerts, contact emergency services, etc.
    alert(`SOS Alert Sent! Type: ${type}. Emergency contacts will be notified immediately.`);
  };

  const emergencyServices = [
    { name: 'Police', number: '100', description: 'For immediate law enforcement assistance' },
    { name: 'Ambulance', number: '108', description: 'Medical emergency services' },
    { name: 'Women Helpline', number: '1091', description: 'Dedicated support for women in distress' },
    { name: 'National Emergency', number: '112', description: 'Universal emergency number for all services' },
  ];

  const safetyTips = [
    'Share your location with trusted contacts regularly',
    'Keep emergency numbers easily accessible',
    'Trust your instincts - if something feels wrong, leave',
    'Stay in well-lit, populated areas especially at night',
    'Have backup plans for transportation',
    'Keep your phone charged and carry a power bank',
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-16 md:pt-20 pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-12 w-12 text-red-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Safety Center</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your personal safety command center. Quick access to emergency services, 
            safety features, and peace of mind for you and your loved ones.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - SOS & Quick Actions */}
          <div className="lg:col-span-1 space-y-6">
            {/* SOS Button */}
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
                Emergency SOS
              </h2>
              <SOSButton onEmergencyTrigger={handleEmergencyTrigger} />
            </Card>

            {/* Emergency Services */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Numbers</h3>
              <div className="space-y-3">
                {emergencyServices.map((service, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{service.name}</p>
                      <p className="text-sm text-gray-600">{service.description}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.location.href = `tel:${service.number}`}
                      icon={<Phone className="h-4 w-4" />}
                    >
                      {service.number}
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Middle Column - Safety Checks & Live Status */}
          <div className="lg:col-span-1 space-y-6">
            {/* Safety Check-ins */}
            <Card>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Safety Check-ins</h3>
                <Button size="sm" variant="ghost" icon={<Settings className="h-4 w-4" />}>
                  Configure
                </Button>
              </div>
              
              <div className="space-y-3">
                {safetyChecks.map((check) => (
                  <div key={check.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-md">
                    <div className="flex-shrink-0">
                      {check.status === 'completed' ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <Clock className="h-5 w-5 text-yellow-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">{check.time}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          check.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {check.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {check.location}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Button variant="outline" fullWidth className="mt-4">
                Add Check-in
              </Button>
            </Card>

            {/* Current Status */}
            <Card className="bg-green-50 border-green-200">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-green-900">Status: Safe</h4>
                  <p className="text-sm text-green-700">
                    Last location shared: 5 minutes ago
                  </p>
                  <p className="text-sm text-green-700">
                    Current location: India Gate, New Delhi
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Emergency Contacts & Safety Tips */}
          <div className="lg:col-span-1 space-y-6">
            {/* Emergency Contacts */}
            <Card>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Emergency Contacts</h3>
                <Button size="sm" variant="ghost">
                  Manage
                </Button>
              </div>

              <div className="space-y-3">
                {emergencyContacts.map((contact) => (
                  <div key={contact.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-teal-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {contact.name}
                          {contact.isPrimary && (
                            <span className="ml-2 text-xs bg-orange-100 text-orange-800 px-2 py-0.5 rounded">
                              Primary
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-gray-600">{contact.relationship}</p>
                        <p className="text-sm text-gray-500">{contact.phone}</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.location.href = `tel:${contact.phone}`}
                    >
                      Call
                    </Button>
                  </div>
                ))}
              </div>

              <Button variant="outline" fullWidth className="mt-4">
                Add New Contact
              </Button>
            </Card>

            {/* Safety Tips */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                Safety Tips
              </h3>
              <div className="space-y-2">
                {safetyTips.map((tip, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="flex-shrink-0 w-1.5 h-1.5 bg-teal-500 rounded-full mt-2"></div>
                    <p className="text-sm text-gray-700">{tip}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafetyPage;