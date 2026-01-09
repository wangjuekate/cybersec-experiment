import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  primary?: boolean;
  disabled?: boolean;
  className?: string;
}

export function Button({ 
  children, 
  onClick, 
  primary = false, 
  disabled = false,
  className = ''
}: ButtonProps) {
  const buttonClass = primary ? 'btn-primary' : 'btn-secondary';
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${buttonClass} ${className}`}
    >
      {children}
    </button>
  );
}
