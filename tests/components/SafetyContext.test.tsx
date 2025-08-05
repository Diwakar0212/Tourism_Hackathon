import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SafetyProvider, useSafety } from '../../src/contexts/SafetyContext';
import { AuthProvider } from '../../src/contexts/AuthContext';

// Mock Firebase
vi.mock('../../src/config/firebase', () => ({
  auth: {},
  db: {},
}));

// Mock geolocation
const mockGeolocation = {
  getCurrentPosition: vi.fn(),
  watchPosition: vi.fn(),
  clearWatch: vi.fn(),
};

// Test component to access safety context
const TestComponent = () => {
  const { 
    currentLocation, 
    isTrackingEnabled, 
    emergencyContacts,
    startLocationTracking,
    addEmergencyContact,
    performCheckIn 
  } = useSafety();

  return (
    <div>
      <div data-testid="tracking-status">
        {isTrackingEnabled ? 'Tracking Active' : 'Tracking Inactive'}
      </div>
      <div data-testid="location">
        {currentLocation ? 'Location Available' : 'No Location'}
      </div>
      <div data-testid="contacts-count">
        Contacts: {emergencyContacts.length}
      </div>
      <button 
        data-testid="start-tracking" 
        onClick={startLocationTracking}
      >
        Start Tracking
      </button>
      <button 
        data-testid="add-contact" 
        onClick={() => addEmergencyContact({
          name: 'Test Contact',
          phone: '+1234567890',
          relationship: 'friend',
          isPrimary: false
        })}
      >
        Add Contact
      </button>
      <button 
        data-testid="check-in" 
        onClick={() => performCheckIn('safe', 'Test check-in')}
      >
        Check In
      </button>
    </div>
  );
};

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>
    <SafetyProvider>
      {children}
    </SafetyProvider>
  </AuthProvider>
);

describe('SafetyContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(global, 'navigator', {
      value: {
        geolocation: mockGeolocation,
      },
      writable: true,
    });
  });

  it('should render with initial state', () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    expect(screen.getByTestId('tracking-status')).toHaveTextContent('Tracking Inactive');
    expect(screen.getByTestId('location')).toHaveTextContent('No Location');
    expect(screen.getByTestId('contacts-count')).toHaveTextContent('Contacts: 0');
  });

  it('should handle location tracking', async () => {
    mockGeolocation.watchPosition.mockImplementation((success) => {
      success({
        coords: {
          latitude: 40.7128,
          longitude: -74.0060,
          accuracy: 10,
        },
        timestamp: Date.now(),
      });
      return 1;
    });

    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    fireEvent.click(screen.getByTestId('start-tracking'));

    await waitFor(() => {
      expect(screen.getByTestId('tracking-status')).toHaveTextContent('Tracking Active');
      expect(screen.getByTestId('location')).toHaveTextContent('Location Available');
    });
  });

  it('should handle emergency contact addition', async () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    fireEvent.click(screen.getByTestId('add-contact'));

    // Note: In a real test, we'd need to mock Firebase properly
    // This is a basic structure for testing the safety context
  });

  it('should handle safety check-ins', async () => {
    mockGeolocation.watchPosition.mockImplementation((success) => {
      success({
        coords: {
          latitude: 40.7128,
          longitude: -74.0060,
          accuracy: 10,
        },
        timestamp: Date.now(),
      });
      return 1;
    });

    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    // First enable location tracking
    fireEvent.click(screen.getByTestId('start-tracking'));

    await waitFor(() => {
      screen.getByText('Location Available');
    });

    // Then perform check-in
    fireEvent.click(screen.getByTestId('check-in'));

    // Note: In a real test, we'd verify the check-in was recorded
  });
});
