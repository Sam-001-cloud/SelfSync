
import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'h-8 w-8 text-lg',
    md: 'h-12 w-12 text-xl',
    lg: 'h-16 w-16 text-2xl',
  };

  return (
    <Link to="/" className={`flex items-center gap-3 ${className}`}>
      <div className={`relative ${sizeClasses[size]}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-full animate-breathe" />
        <div className="absolute inset-0.5 bg-white dark:bg-gray-900 rounded-full" />
        <div className="absolute inset-0 flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" className="w-3/4 h-3/4" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" 
              className="fill-primary" 
            />
          </svg>
        </div>
      </div>
      <div className="flex flex-col text-left">
        <span className="font-bold tracking-tight text-primary">Self<span className="text-secondary">Sync</span></span>
        {size === 'lg' && <span className="text-xs text-muted-foreground">Your Wellness Journey</span>}
      </div>
    </Link>
  );
};

export default Logo;
