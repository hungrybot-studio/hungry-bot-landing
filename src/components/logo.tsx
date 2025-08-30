'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ className = '', size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-20 h-20',
    lg: 'w-24 h-24',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <motion.div
      className={`flex flex-col items-center ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Logo Image */}
      <div className={`${sizeClasses[size]} relative mb-2`}>
        <div className="w-full h-full bg-gradient-to-br from-blue-50 to-purple-50 rounded-full border-2 border-yellow-300 flex items-center justify-center shadow-lg">
          {/* Robot Chef Icon */}
          <div className="text-center">
            <div className="text-2xl mb-1">🤖</div>
            <div className="text-sm font-bold text-orange-700">CHEF</div>
          </div>
        </div>
      </div>
      
      {/* Logo Text */}
      <motion.h1
        className={`font-bold text-orange-700 ${textSizes[size]} tracking-wide`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        HungryBot
      </motion.h1>
    </motion.div>
  );
}
