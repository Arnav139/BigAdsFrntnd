import React from 'react';
import { cn } from '@/lib/utils';

type CardElement = React.ElementRef<'div'>;
type CardVariant = 'default' | 'outline' | 'ghost';

interface CardProps extends React.ComponentPropsWithoutRef<'div'> {
  variant?: CardVariant;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  noPadding?: boolean;
  isLoading?: boolean;
}

const Card = React.forwardRef<CardElement, CardProps>(
  (
    {
      variant = 'default',
      header,
      footer,
      children,
      className,
      noPadding = false,
      isLoading = false,
      ...props
    },
    ref
  ) => {
    const variants = {
      default: 'bg-white border border-gray-200',
      outline: 'border-2 border-gray-200 bg-transparent',
      ghost: 'border-none shadow-none bg-gray-50',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg shadow-sm transition-colors',
          variants[variant],
          className
        )}
        {...props}
      >
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-sm rounded-lg flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin" />
          </div>
        )}
        
        {header && (
          <div className="px-4 py-3 border-b border-gray-200">
            {header}
          </div>
        )}

        <div className={cn(!noPadding && 'p-4')}>
          {children}
        </div>

        {footer && (
          <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
            {footer}
          </div>
        )}
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;