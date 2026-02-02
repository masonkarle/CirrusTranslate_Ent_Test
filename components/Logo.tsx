
import React from 'react';

interface LogoProps {
  className?: string;
  light?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = "h-8", light = false }) => {
  const color = light ? "white" : "black";
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg viewBox="0 0 160 100" className="h-full w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 80C40 80 80 60 110 20" stroke={color} strokeWidth="4" strokeLinecap="round" />
        <path d="M15 88C50 88 90 68 120 28" stroke={color} strokeWidth="4" strokeLinecap="round" />
        <path d="M20 96C60 96 100 76 130 36" stroke={color} strokeWidth="4" strokeLinecap="round" />
      </svg>
      <span className={`text-2xl font-medium tracking-tight ${light ? 'text-white' : 'text-slate-900'}`}>
        Cirrus<span className="font-normal">Translate</span>
      </span>
    </div>
  );
};

export default Logo;
