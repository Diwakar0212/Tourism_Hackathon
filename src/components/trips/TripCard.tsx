import React from 'react';
import { Calendar, MapPin, Users, DollarSign, Leaf } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import { Trip } from '../../types';

interface TripCardProps {
  trip: Trip;
  onViewTrip: (tripId: string) => void;
  onEditTrip?: (tripId: string) => void;
}

const TripCard: React.FC<TripCardProps> = ({ trip, onViewTrip, onEditTrip }) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(date));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'planning':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getDuration = () => {
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <Card hover clickable onClick={() => onViewTrip(trip.id)} className="overflow-hidden">
      <div className="relative">
        {/* Trip Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{trip.title}</h3>
            <div className="flex items-center text-gray-600 mb-2">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="text-sm">{trip.destination}</span>
            </div>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(trip.status)}`}>
            {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
          </span>
        </div>

        {/* Trip Details */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <div className="text-sm">
              <p className="text-gray-900 font-medium">{formatDate(trip.startDate)}</p>
              <p className="text-gray-500">{getDuration()} days</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4 text-gray-500" />
            <div className="text-sm">
              <p className="text-gray-900 font-medium">₹{trip.budget.toLocaleString()}</p>
              <p className="text-gray-500">Budget</p>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            {trip.travelers.length > 1 && (
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">{trip.travelers.length} travelers</span>
              </div>
            )}
            
            {trip.carbonFootprint && (
              <div className="flex items-center space-x-1">
                <Leaf className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600">
                  {trip.carbonFootprint.total.toFixed(1)} kg CO₂
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar (for active trips) */}
        {trip.status === 'active' && (
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Trip Progress</span>
              <span>Day 3 of {getDuration()}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-teal-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(3 / getDuration()) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-2">
          <Button
            variant="primary"
            size="sm"
            fullWidth
            onClick={(e) => {
              e.stopPropagation();
              onViewTrip(trip.id);
            }}
          >
            View Details
          </Button>
          {onEditTrip && trip.status === 'planning' && (
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEditTrip(trip.id);
              }}
            >
              Edit
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default TripCard;