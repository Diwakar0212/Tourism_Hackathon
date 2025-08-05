import React from 'react';
import { SafetyDashboard } from '../components/safety/SafetyDashboard';

const SafetyPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <SafetyDashboard />
    </div>
  );
};

export default SafetyPage;
