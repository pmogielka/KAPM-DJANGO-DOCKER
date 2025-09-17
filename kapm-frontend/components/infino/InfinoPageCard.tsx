'use client';

import React from 'react';
import { ChevronRight, MoreVertical } from 'lucide-react';

interface InfinoPageCardProps {
  title?: string;
  titleIcon?: React.ReactNode;
  subtitle?: string;
  actions?: React.ReactNode;
  toolbar?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export default function InfinoPageCard({
  title,
  titleIcon,
  subtitle,
  actions,
  toolbar,
  children,
  className = '',
  noPadding = false
}: InfinoPageCardProps) {
  return (
    <div className={`il-card ${className}`}>
      {/* Card Header */}
      {(title || actions || toolbar) && (
        <div
          className="il-card-header"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.5rem',
            borderBottom: '1px solid var(--infino-border)',
            minHeight: '60px'
          }}
        >
          <div className="flex-1">
            {title && (
              <h3 className="il-card-title">
                {titleIcon && <span style={{ color: 'var(--infino-primary)' }}>{titleIcon}</span>}
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-sm mt-1" style={{ color: 'var(--infino-text-secondary)' }}>
                {subtitle}
              </p>
            )}
          </div>

          {/* Toolbar Section */}
          {toolbar && (
            <div className="flex items-center space-x-2 mr-4">
              {toolbar}
            </div>
          )}

          {/* Actions Section */}
          {actions && (
            <div className="flex items-center space-x-2">
              {actions}
            </div>
          )}
        </div>
      )}

      {/* Card Body */}
      <div className={noPadding ? '' : 'il-card-body'}>
        {children}
      </div>
    </div>
  );
}

// Sub-component for toolbar buttons
export function InfinoPageCardToolbar({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center space-x-2">
      {children}
    </div>
  );
}

// Sub-component for action buttons
export function InfinoPageCardActions({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center space-x-2">
      {children}
    </div>
  );
}

// Aliases for dashboard compatibility
export const Card = InfinoPageCard;

export function CardHeader({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`px-6 py-4 border-b ${className}`} style={{ borderColor: 'var(--infino-border)' }}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <h3 className={`text-lg font-semibold ${className}`} style={{ color: 'var(--infino-text-primary)' }}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`text-sm mt-1 ${className}`} style={{ color: 'var(--infino-text-muted)' }}>
      {children}
    </p>
  );
}

export function CardContent({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`px-6 py-4 ${className}`}>
      {children}
    </div>
  );
}

export function Button({
  children,
  variant = 'default',
  size = 'default',
  asChild = false,
  className = '',
  ...props
}: {
  children: React.ReactNode;
  variant?: 'default' | 'ghost' | 'primary' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
  className?: string;
  [key: string]: any;
}) {
  const sizeClasses = {
    default: 'px-4 py-2',
    sm: 'px-3 py-1 text-sm',
    lg: 'px-6 py-3 text-lg',
    icon: 'p-2'
  };

  const variantClasses = {
    default: 'il-btn',
    primary: 'il-btn il-btn-primary',
    secondary: 'il-btn il-btn-secondary',
    ghost: 'hover:bg-gray-100 transition-colors rounded'
  };

  const Component = asChild ? 'div' : 'button';

  return (
    <Component
      className={`${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}

export function Badge({
  children,
  variant = 'default',
  className = ''
}: {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'danger';
  className?: string;
}) {
  const variantClasses = {
    default: 'il-badge',
    secondary: 'il-badge il-badge-secondary',
    success: 'il-badge il-badge-success',
    warning: 'il-badge il-badge-warning',
    danger: 'il-badge il-badge-danger'
  };

  return (
    <span className={`${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
}