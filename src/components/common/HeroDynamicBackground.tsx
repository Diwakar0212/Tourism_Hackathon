import React from 'react';
import { motion } from 'framer-motion';

interface HeroDynamicBackgroundProps {
  className?: string;
}

const HeroDynamicBackground: React.FC<HeroDynamicBackgroundProps> = ({ className = '' }) => {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Primary animated gradient - Trusty Teal/Green theme */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'linear-gradient(135deg, rgba(20, 184, 166, 0.92) 0%, rgba(15, 118, 110, 0.95) 50%, rgba(13, 148, 136, 0.92) 100%)',
            'linear-gradient(135deg, rgba(15, 118, 110, 0.92) 0%, rgba(17, 94, 89, 0.95) 50%, rgba(19, 78, 74, 0.92) 100%)',
            'linear-gradient(135deg, rgba(134, 239, 172, 0.85) 0%, rgba(20, 184, 166, 0.92) 50%, rgba(15, 118, 110, 0.92) 100%)',
            'linear-gradient(135deg, rgba(20, 184, 166, 0.92) 0%, rgba(15, 118, 110, 0.95) 50%, rgba(13, 148, 136, 0.92) 100%)',
          ]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Floating geometric elements - Teal/Green theme */}
      <motion.div
        className="absolute w-72 h-72 rounded-full bg-white/8 backdrop-blur-sm border border-white/10"
        initial={{ x: -100, y: 50 }}
        animate={{
          x: ['-100px', '50px', '0px', '-100px'],
          y: ['50px', '-30px', '80px', '50px'],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ top: '20%', left: '5%' }}
      />

      <motion.div
        className="absolute w-96 h-96 rounded-full bg-gradient-to-br from-white/3 to-white/8 backdrop-blur-lg border border-white/5"
        initial={{ x: 100, y: -50 }}
        animate={{
          x: ['100px', '-30px', '20px', '100px'],
          y: ['-50px', '20px', '-10px', '-50px'],
          scale: [1, 0.8, 1.1, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ top: '40%', right: '10%' }}
      />

      {/* Smaller floating orbs - Teal theme */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-4 h-4 bg-white/15 rounded-full backdrop-blur-sm border border-white/10"
          initial={{
            x: Math.random() * 100,
            y: Math.random() * 100,
          }}
          animate={{
            x: [
              Math.random() * 100,
              Math.random() * 100 + 50,
              Math.random() * 100,
            ],
            y: [
              Math.random() * 100,
              Math.random() * 100 + 30,
              Math.random() * 100,
            ],
            scale: [1, 1.5, 1],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: Math.random() * 10 + 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 5,
          }}
          style={{
            top: `${Math.random() * 80 + 10}%`,
            left: `${Math.random() * 80 + 10}%`,
          }}
        />
      ))}

      {/* Animated grid overlay - Teal theme */}
      <motion.div
        className="absolute inset-0 opacity-8"
        style={{
          backgroundImage: `
            linear-gradient(rgba(13, 148, 136, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(13, 148, 136, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
        animate={{
          backgroundPosition: ['0px 0px', '60px 60px', '0px 0px']
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Wave-like SVG overlay - Teal theme */}
      <div className="absolute bottom-0 left-0 w-full h-32 opacity-15">
        <svg className="w-full h-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <motion.path
            fill="rgba(13, 148, 136, 0.25)"
            animate={{
              d: [
                "M0,60 Q150,30 300,60 T600,60 T900,60 T1200,60 L1200,120 L0,120 Z",
                "M0,80 Q150,50 300,80 T600,40 T900,80 T1200,60 L1200,120 L0,120 Z",
                "M0,60 Q150,90 300,60 T600,80 T900,60 T1200,80 L1200,120 L0,120 Z",
                "M0,60 Q150,30 300,60 T600,60 T900,60 T1200,60 L1200,120 L0,120 Z",
              ]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </svg>
      </div>

      {/* Radial glow effects */}
      <motion.div
        className="absolute w-80 h-80 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
          top: '10%',
          left: '20%',
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <motion.div
        className="absolute w-96 h-96 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, transparent 70%)',
          bottom: '20%',
          right: '15%',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3
        }}
      />
    </div>
  );
};

export default HeroDynamicBackground;
