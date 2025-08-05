import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X } from 'lucide-react';
import { useAIAssistant } from '../../contexts/AIAssistantContext';
import { cn } from '../../utils/styles';

interface FloatingAIButtonProps {
  className?: string;
}

const FloatingAIButton: React.FC<FloatingAIButtonProps> = ({ className }) => {
  const { isAssistantOpen, toggleAssistant } = useAIAssistant();

  return (
    <motion.div
      className={cn(
        "fixed bottom-6 right-6 z-50",
        className
      )}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
        type: "spring", 
        stiffness: 500, 
        damping: 30,
        delay: 1 
      }}
    >
      <motion.button
        onClick={toggleAssistant}
        className={cn(
          "group relative w-14 h-14 rounded-full shadow-lg transition-all duration-300",
          "flex items-center justify-center",
          "focus:outline-none focus:ring-4 focus:ring-primary-200",
          isAssistantOpen 
            ? "bg-red-500 hover:bg-red-600 text-white" 
            : "bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white"
        )}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label={isAssistantOpen ? "Close AI Assistant" : "Open AI Assistant"}
      >
        <AnimatePresence mode="wait">
          {isAssistantOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="h-6 w-6" />
            </motion.div>
          ) : (
            <motion.div
              key="bot"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Bot className="h-6 w-6" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulse effect when closed */}
        {!isAssistantOpen && (
          <motion.div
            className="absolute inset-0 rounded-full bg-primary-400"
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 1.4, opacity: 0 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut"
            }}
          />
        )}

        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-secondary-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
          {isAssistantOpen ? "Close Assistant" : "AI Assistant"}
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-secondary-900"></div>
        </div>
      </motion.button>
    </motion.div>
  );
};

export default FloatingAIButton;
