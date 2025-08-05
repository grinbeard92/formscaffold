import React from 'react';
import { cn } from '@/utils/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card = {
  Root: React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, children, ...props }, ref) => (
      <div
        ref={ref}
        className={cn(
          'bg-card text-card-foreground rounded-lg border p-10 shadow-sm',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    ),
  ),

  Header: React.forwardRef<HTMLDivElement, CardHeaderProps>(
    ({ className, children, ...props }, ref) => (
      <div
        ref={ref}
        className={cn('flex flex-col space-y-1.5 p-6', className)}
        {...props}
      >
        {children}
      </div>
    ),
  ),

  Title: React.forwardRef<HTMLParagraphElement, CardTitleProps>(
    ({ className, children, ...props }, ref) => (
      <h3
        ref={ref}
        className={cn(
          'text-2xl leading-none font-semibold tracking-tight',
          className,
        )}
        {...props}
      >
        {children}
      </h3>
    ),
  ),

  Content: React.forwardRef<HTMLDivElement, CardContentProps>(
    ({ className, children, ...props }, ref) => (
      <div ref={ref} className={cn('p-6 pt-0', className)} {...props}>
        {children}
      </div>
    ),
  ),
};

Card.Root.displayName = 'Card.Root';
Card.Header.displayName = 'Card.Header';
Card.Title.displayName = 'Card.Title';
Card.Content.displayName = 'Card.Content';
