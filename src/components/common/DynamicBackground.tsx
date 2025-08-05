import React from 'react';
import { motion } from 'framer-motion';

interface DynamicBackgroundProps {
  variant?: 'gradient' | 'mesh' | 'particles' | 'geometric' | 'waves';
  className?: string;
  opacity?: number;
}

const DynamicBackground: React.FC<DynamicBackgroundProps> = ({ 
  variant = 'gradient', 
  className = '', 
  opacity = 1 
}) => {
  const renderBackground = () => {
    switch (variant) {
      case 'mesh':
        return (
          <div className="absolute inset-0 overflow-hidden">
            {/* Animated Gradient Mesh - Teal/Green theme */}
            <motion.div
              className="absolute inset-0"
              animate={{
                background: [
                  'linear-gradient(45deg, rgba(20, 184, 166, 0.15), rgba(16, 185, 129, 0.2), rgba(6, 182, 212, 0.15))',
                  'linear-gradient(90deg, rgba(16, 185, 129, 0.15), rgba(6, 182, 212, 0.2), rgba(34, 197, 94, 0.15))',
                  'linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(34, 197, 94, 0.2), rgba(20, 184, 166, 0.15))',
                  'linear-gradient(180deg, rgba(34, 197, 94, 0.15), rgba(20, 184, 166, 0.2), rgba(16, 185, 129, 0.15))',
                  'linear-gradient(45deg, rgba(20, 184, 166, 0.15), rgba(16, 185, 129, 0.2), rgba(6, 182, 212, 0.15))',
                ]
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            
            {/* Floating orbs - Teal/Green theme */}
            <motion.div
              className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-teal-300/20 to-emerald-300/25 blur-3xl"
              animate={{
                x: [0, 100, -50, 0],
                y: [0, -100, 50, 0],
                scale: [1, 1.2, 0.8, 1],
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{ top: '10%', left: '10%' }}
            />
            
            <motion.div
              className="absolute w-80 h-80 rounded-full bg-gradient-to-r from-cyan-300/15 to-teal-300/20 blur-3xl"
              animate={{
                x: [0, -80, 60, 0],
                y: [0, 80, -40, 0],
                scale: [1, 0.8, 1.3, 1],
              }}
              transition={{
                duration: 30,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 5
              }}
              style={{ top: '60%', right: '10%' }}
            />
            
            <motion.div
              className="absolute w-64 h-64 rounded-full bg-gradient-to-r from-emerald-300/18 to-cyan-300/18 blur-3xl"
              animate={{
                x: [0, 60, -80, 0],
                y: [0, -60, 80, 0],
                scale: [1, 1.1, 0.9, 1],
              }}
              transition={{
                duration: 22,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 10
              }}
              style={{ bottom: '20%', left: '50%' }}
            />
          </div>
        );

      case 'particles':
        return (
          <div className="absolute inset-0 overflow-hidden">
            {/* Base gradient - Teal/Green theme */}
            <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-white to-emerald-50" />
            
            {/* Animated particles - Teal/Green theme */}
            {Array.from({ length: 50 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-teal-400/25 rounded-full"
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                }}
                animate={{
                  x: [
                    Math.random() * window.innerWidth,
                    Math.random() * window.innerWidth,
                    Math.random() * window.innerWidth,
                  ],
                  y: [
                    Math.random() * window.innerHeight,
                    Math.random() * window.innerHeight,
                    Math.random() * window.innerHeight,
                  ],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: Math.random() * 20 + 10,
                  repeat: Infinity,
                  ease: "linear",
                  delay: Math.random() * 5,
                }}
              />
            ))}
            
            {/* Larger floating elements - Teal/Green theme */}
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={`large-${i}`}
                className="absolute w-4 h-4 bg-emerald-300/15 rounded-full blur-sm"
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                }}
                animate={{
                  x: [
                    Math.random() * window.innerWidth,
                    Math.random() * window.innerWidth,
                  ],
                  y: [
                    Math.random() * window.innerHeight,
                    Math.random() * window.innerHeight,
                  ],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: Math.random() * 15 + 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: Math.random() * 3,
                }}
              />
            ))}
          </div>
        );

      case 'geometric':
        return (
          <div className="absolute inset-0 overflow-hidden">
            {/* Base gradient - Teal/Green theme */}
            <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-white to-emerald-50" />
            
            {/* Animated geometric shapes - Teal/Green theme */}
            <motion.div
              className="absolute top-20 left-20 w-32 h-32 border-2 border-teal-200/25 rotate-45"
              animate={{ rotate: [45, 405] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            
            <motion.div
              className="absolute top-40 right-32 w-24 h-24 bg-emerald-200/15 rounded-full"
              animate={{ 
                scale: [1, 1.2, 1],
                x: [0, 20, 0],
                y: [0, -10, 0]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            
            <motion.div
              className="absolute bottom-32 left-40 w-20 h-20 bg-cyan-200/20"
              style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
              animate={{ 
                rotate: [0, 180, 360],
                scale: [1, 0.8, 1]
              }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />
            
            <motion.div
              className="absolute bottom-20 right-20 w-28 h-28 border-2 border-teal-300/25"
              style={{ clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' }}
              animate={{ 
                rotate: [0, -360],
                opacity: [0.2, 0.5, 0.2]
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />
            
            {/* Grid pattern - Teal theme */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0" style={{
                backgroundImage: `
                  linear-gradient(rgba(20, 184, 166, 0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(20, 184, 166, 0.1) 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px'
              }} />
            </div>
          </div>
        );

      case 'waves':
        return (
          <div className="absolute inset-0 overflow-hidden">
            {/* Animated wave layers - Teal/Green theme */}
            <motion.div
              className="absolute inset-0 opacity-15"
              style={{
                background: `radial-gradient(ellipse at center, 
                  rgba(20, 184, 166, 0.2) 0%, 
                  rgba(16, 185, 129, 0.15) 50%, 
                  rgba(6, 182, 212, 0.1) 100%)`
              }}
              animate={{
                background: [
                  `radial-gradient(ellipse at 20% 50%, rgba(20, 184, 166, 0.2) 0%, rgba(16, 185, 129, 0.15) 50%, rgba(6, 182, 212, 0.1) 100%)`,
                  `radial-gradient(ellipse at 80% 20%, rgba(16, 185, 129, 0.2) 0%, rgba(6, 182, 212, 0.15) 50%, rgba(34, 197, 94, 0.1) 100%)`,
                  `radial-gradient(ellipse at 40% 80%, rgba(6, 182, 212, 0.2) 0%, rgba(34, 197, 94, 0.15) 50%, rgba(20, 184, 166, 0.1) 100%)`,
                  `radial-gradient(ellipse at 20% 50%, rgba(20, 184, 166, 0.2) 0%, rgba(16, 185, 129, 0.15) 50%, rgba(6, 182, 212, 0.1) 100%)`,
                ]
              }}
              transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
            />
            
            {/* SVG Wave patterns - Teal theme */}
            <svg className="absolute bottom-0 left-0 w-full h-64" viewBox="0 0 1200 320" preserveAspectRatio="none">
              <motion.path
                fill="rgba(20, 184, 166, 0.08)"
                animate={{
                  d: [
                    "M0,128L48,144C96,160,192,192,288,192C384,192,480,160,576,149.3C672,139,768,149,864,170.7C960,192,1056,224,1152,224C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                    "M0,160L48,170.7C96,181,192,203,288,197.3C384,192,480,160,576,154.7C672,149,768,171,864,181.3C960,192,1056,192,1152,181.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                    "M0,128L48,144C96,160,192,192,288,192C384,192,480,160,576,149.3C672,139,768,149,864,170.7C960,192,1056,224,1152,224C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                  ]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              />
            </svg>
            
            <svg className="absolute bottom-0 left-0 w-full h-48" viewBox="0 0 1200 320" preserveAspectRatio="none">
              <motion.path
                fill="rgba(16, 185, 129, 0.06)"
                animate={{
                  d: [
                    "M0,224L48,208C96,192,192,160,288,160C384,160,480,192,576,197.3C672,203,768,181,864,170.7C960,160,1056,160,1152,170.7C1248,181,1344,203,1392,213.3L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                    "M0,192L48,197.3C96,203,192,213,288,208C384,203,480,181,576,170.7C672,160,768,160,864,176C960,192,1056,224,1152,240C1248,256,1344,256,1392,256L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                    "M0,224L48,208C96,192,192,160,288,160C384,160,480,192,576,197.3C672,203,768,181,864,170.7C960,160,1056,160,1152,170.7C1248,181,1344,203,1392,213.3L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                  ]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              />
            </svg>
          </div>
        );

      default: // gradient - Teal/Green theme
        return (
          <motion.div
            className="absolute inset-0"
            animate={{
              background: [
                'linear-gradient(45deg, rgba(20, 184, 166, 0.04), rgba(16, 185, 129, 0.06), rgba(6, 182, 212, 0.04))',
                'linear-gradient(90deg, rgba(16, 185, 129, 0.04), rgba(6, 182, 212, 0.06), rgba(34, 197, 94, 0.04))',
                'linear-gradient(135deg, rgba(6, 182, 212, 0.04), rgba(34, 197, 94, 0.06), rgba(20, 184, 166, 0.04))',
                'linear-gradient(180deg, rgba(34, 197, 94, 0.04), rgba(20, 184, 166, 0.06), rgba(16, 185, 129, 0.04))',
                'linear-gradient(45deg, rgba(20, 184, 166, 0.04), rgba(16, 185, 129, 0.06), rgba(6, 182, 212, 0.04))',
              ]
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        );
    }
  };

  return (
    <div 
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      style={{ opacity }}
    >
      {renderBackground()}
    </div>
  );
};

export default DynamicBackground;
