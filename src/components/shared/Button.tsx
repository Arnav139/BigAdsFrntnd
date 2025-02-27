import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'outline2' | 'outline3';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  loading?: boolean;
  color?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  loading,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors';
  
  const variants = {
    primary: 'bg-[rgba(113,0,132,0.5)] text-white hover:bg-[rgb(0, 0, 56)] focus:ring-indigo-500',
    secondary: 'bg-gray-300 text-gray-700 border border-gray-300 hover:bg-gray-200 focus:ring-gray-500',
    outline: 'border border-gray-300 text-white hover:bg-[rgb(0,0,56)] hover:outline-[rgb(0,0,56)] focus:ring-indigo-500',
    outline2: 'border border-indigo-600 border-1 text-gray-100 bg-[rgb(113,0,132)] hover:bg-[rgb(0,0,56)] hover:text-white hover:outline-[rgb(0,0,56)] focus:ring-indigo-500',
    outline3: 'border border-indigo-600 border-1 text-gray-100 bg-[rgb(76,0,109)] hover:bg-[rgb(0,0,56)] hover:text-white hover:outline-[rgb(0,0,56)] focus:ring-indigo-500',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      disabled={loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {Icon && !loading && <Icon className="mr-2 -ml-1 h-4 w-4" />}
      {children}
    </button>
  );
};

export default Button;