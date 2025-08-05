import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedSectionBackgroundProps {
  variant?: 'light' | 'white' | 'gradient';
  className?: string;
  children: React.ReactNode;
}

const AnimatedSectionBackground: React.FC<AnimatedSectionBackgroundProps> = ({ 
  variant = 'white', 
  className = '',
  children
}) => {
  const getBackgroundClass = () => {
    switch (variant) {
      case 'light':
        return 'bg-gray-50';
      case 'gradient':
        return '';
      case 'white':
      default:
        return 'bg-white';
    }
  };

  return (
    <div className={`relative ${getBackgroundClass()} ${className}`}>
      {/* Subtle animated background elements - Teal/Green theme */}
      {variant === 'gradient' && (
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'linear-gradient(135deg, rgba(13, 148, 136, 0.02) 0%, rgba(16, 185, 129, 0.03) 50%, rgba(6, 182, 212, 0.02) 100%)',
              'linear-gradient(135deg, rgba(16, 185, 129, 0.02) 0%, rgba(6, 182, 212, 0.03) 50%, rgba(13, 148, 136, 0.02) 100%)',
              'linear-gradient(135deg, rgba(6, 182, 212, 0.02) 0%, rgba(13, 148, 136, 0.03) 50%, rgba(16, 185, 129, 0.02) 100%)',
              'linear-gradient(135deg, rgba(13, 148, 136, 0.02) 0%, rgba(16, 185, 129, 0.03) 50%, rgba(6, 182, 212, 0.02) 100%)',
            ]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
      
      {variant !== 'gradient' && (
        <>
          {/* Floating subtle elements - Teal/Green theme */}
          <motion.div
            className="absolute w-32 h-32 bg-teal-100/30 rounded-full blur-xl"
            animate={{
              x: [0, 30, -20, 0],
              y: [0, -20, 10, 0],
              scale: [1, 1.1, 0.9, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{ top: '10%', left: '5%' }}
          />
          
          <motion.div
            className="absolute w-24 h-24 bg-emerald-100/20 rounded-full blur-xl"
            animate={{
              x: [0, -25, 15, 0],
              y: [0, 15, -10, 0],
              scale: [1, 0.9, 1.2, 1],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 5
            }}
            style={{ top: '60%', right: '8%' }}
          />
          
          <motion.div
            className="absolute w-20 h-20 bg-cyan-100/25 rounded-full blur-xl"
            animate={{
              x: [0, 20, -15, 0],
              y: [0, -15, 20, 0],
              scale: [1, 1.3, 0.8, 1],
            }}
            transition={{
              duration: 22,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 10
            }}
            style={{ bottom: '15%', left: '50%' }}
          />
        </>
      )}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default AnimatedSectionBackground;
