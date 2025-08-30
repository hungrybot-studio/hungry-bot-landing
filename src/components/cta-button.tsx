'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { trackCTAClick } from '@/lib/analytics';

interface CTAButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  buttonText: string;
  location: string;
  disabled?: boolean;
  type?: 'button' | 'submit';
}

export function CTAButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className,
  buttonText,
  location,
  disabled = false,
  type = 'button',
}: CTAButtonProps) {
  const handleClick = () => {
    trackCTAClick(buttonText, location);
    onClick?.();
  };

  const baseClasses = 'font-medium rounded-lg transition-all duration-200 transform focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500 hover:scale-105',
    secondary: 'bg-white hover:bg-gray-50 text-primary-600 border-2 border-primary-600 focus:ring-primary-500 hover:scale-105',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-gray-500',
  };
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <motion.button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      data-analytics="cta_click"
      data-button-text={buttonText}
      data-location={location}
    >
      {children}
    </motion.button>
  );
}
