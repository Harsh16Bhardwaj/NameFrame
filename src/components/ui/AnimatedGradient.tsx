import React from 'react';

interface AnimatedGradientProps {
  className?: string;
  children?: React.ReactNode;
}

export const AnimatedGradient: React.FC<AnimatedGradientProps> = ({ 
  className = "", 
  children 
}) => {
  return (
    <div className={`animate-gradient-slow ${className}`}>
      {children}
    </div>
  );
};