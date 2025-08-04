import React from 'react';
import { Armchair as Wheelchair, Eye, Ear, Volume2, Car, Navigation, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { AccessibilityInfo } from '../../types';

interface AccessibilityIndicatorProps {
  accessibilityInfo: AccessibilityInfo;
  compact?: boolean;
  showLabels?: boolean;
}

const AccessibilityIndicator: React.FC<AccessibilityIndicatorProps> = ({
  accessibilityInfo,
  compact = false,
  showLabels = true,
}) => {
  const features = [
    {
      key: 'wheelchairAccessible',
      icon: Wheelchair,
      label: 'Wheelchair Accessible',
      value: accessibilityInfo.wheelchairAccessible,
    },
    {
      key: 'audioGuide',
      icon: Volume2,
      label: 'Audio Guide',
      value: accessibilityInfo.audioGuide,
    },
    {
      key: 'brailleSignage',
      icon: Eye,
      label: 'Braille Signage',
      value: accessibilityInfo.brailleSignage,
    },
    {
      key: 'elevatorAccess',
      icon: Navigation,
      label: 'Elevator Access',
      value: accessibilityInfo.elevatorAccess,
    },
    {
      key: 'accessibleParking',
      icon: Car,
      label: 'Accessible Parking',
      value: accessibilityInfo.accessibleParking,
    },
    {
      key: 'signLanguageSupport',
      icon: Ear,
      label: 'Sign Language Support',
      value: accessibilityInfo.signLanguageSupport,
    },
  ];

  const getStatusIcon = (isAvailable: boolean) => {
    if (isAvailable) {
      return <CheckCircle className="h-3 w-3 text-green-500" />;
    }
    return <XCircle className="h-3 w-3 text-gray-400" />;
  };

  const getStatusColor = (isAvailable: boolean) => {
    return isAvailable ? 'text-green-600' : 'text-gray-400';
  };

  if (compact) {
    const availableFeatures = features.filter(feature => feature.value);
    const availableCount = availableFeatures.length;
    const totalCount = features.length;
    
    return (
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-1">
          {availableFeatures.slice(0, 3).map((feature) => {
            const IconComponent = feature.icon;
            return (
              <IconComponent
                key={feature.key}
                className="h-4 w-4 text-green-600"
                title={feature.label}
              />
            );
          })}
          {availableCount > 3 && (
            <span className="text-xs text-gray-500">+{availableCount - 3}</span>
          )}
        </div>
        <span className="text-sm text-gray-600">
          {availableCount}/{totalCount} accessible features
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <Wheelchair className="h-5 w-5 text-teal-600" />
        <h4 className="text-sm font-medium text-gray-900">Accessibility Features</h4>
      </div>
      
      <div className="grid grid-cols-1 gap-2">
        {features.map((feature) => {
          const IconComponent = feature.icon;
          return (
            <div key={feature.key} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <IconComponent className={`h-4 w-4 ${getStatusColor(feature.value)}`} />
                {showLabels && (
                  <span className={`text-sm ${getStatusColor(feature.value)}`}>
                    {feature.label}
                  </span>
                )}
              </div>
              {getStatusIcon(feature.value)}
            </div>
          );
        })}
      </div>

      {accessibilityInfo.notes && (
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900">Additional Notes</p>
              <p className="text-sm text-blue-700 mt-1">{accessibilityInfo.notes}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccessibilityIndicator;