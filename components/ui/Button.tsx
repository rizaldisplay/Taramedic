'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

// Varian gaya visual
export type ButtonVariant = 
  | 'primary'      // Cyan/Blue utama
  | 'secondary'    // White dengan border
  | 'danger'       // Rose/Red untuk pembatalan atau hapus
  | 'ghost'        // Tanpa border/background
  | 'success';     // Emerald/Green untuk aksi sukses

// Ukuran button
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-cyan-600 text-white hover:bg-cyan-700 active:bg-cyan-800 border-transparent shadow-xs',
  secondary: 'bg-white text-slate-700 hover:bg-slate-50 active:bg-slate-100 border-slate-200 shadow-xs',
  danger: 'bg-rose-50/60 text-rose-700 hover:bg-rose-100/70 active:bg-rose-200/50 border-rose-200 shadow-xs',
  ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 active:bg-slate-200 border-transparent',
  success: 'bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 border-transparent shadow-xs',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-3.5 py-2 text-xs font-bold',
  lg: 'px-5 py-2.5 text-sm font-bold',
};

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  disabled,
  type = 'button',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center gap-2 rounded-lg border font-semibold transition-all cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none';
  
  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      
      {children && <span>{children}</span>}
      
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
};