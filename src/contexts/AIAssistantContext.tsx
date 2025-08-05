import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AIAssistantContextType {
  isAssistantOpen: boolean;
  openAssistant: () => void;
  closeAssistant: () => void;
  toggleAssistant: () => void;
}

const AIAssistantContext = createContext<AIAssistantContextType | undefined>(undefined);

interface AIAssistantProviderProps {
  children: ReactNode;
}

export const AIAssistantProvider: React.FC<AIAssistantProviderProps> = ({ children }) => {
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  const openAssistant = () => setIsAssistantOpen(true);
  const closeAssistant = () => setIsAssistantOpen(false);
  const toggleAssistant = () => setIsAssistantOpen(prev => !prev);

  const contextValue: AIAssistantContextType = {
    isAssistantOpen,
    openAssistant,
    closeAssistant,
    toggleAssistant,
  };

  return (
    <AIAssistantContext.Provider value={contextValue}>
      {children}
    </AIAssistantContext.Provider>
  );
};

export const useAIAssistant = (): AIAssistantContextType => {
  const context = useContext(AIAssistantContext);
  if (!context) {
    throw new Error('useAIAssistant must be used within an AIAssistantProvider');
  }
  return context;
};
