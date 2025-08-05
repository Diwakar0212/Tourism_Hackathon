import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { useAIAssistant } from '../../contexts/AIAssistantContext';
import { useAuth } from '../../contexts/AuthContext';
import AIAssistant from './AIAssistant';

const GlobalAIAssistant: React.FC = () => {
  const { isAssistantOpen, closeAssistant } = useAIAssistant();
  const { userProfile } = useAuth();

  // Create user context for the AI assistant
  const userContext = {
    location: { city: 'Unknown', country: 'Unknown' }, // This could be enhanced with user's location
    currentTrip: null, // This could be enhanced to track current trip
    preferences: userProfile?.preferences || {},
  };

  return (
    <AnimatePresence>
      {isAssistantOpen && (
        <AIAssistant
          isOpen={isAssistantOpen}
          onClose={closeAssistant}
          userContext={userContext}
        />
      )}
    </AnimatePresence>
  );
};

export default GlobalAIAssistant;
