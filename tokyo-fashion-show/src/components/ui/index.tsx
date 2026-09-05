import React, { useState, useEffect } from 'react';

export function Button({ className = '', variant = 'default', size = 'default', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'default' | 'outline' | 'ghost' | 'destructive', size?: 'default' | 'sm' | 'lg' }) {
  const base = "inline-flex items-center justify-center font-mono text-xs font-bold transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 uppercase tracking-wider";
  
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground text-muted-foreground",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90"
  };
  
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-8 px-3",
    lg: "h-12 px-8 text-sm"
  };

  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props} />
  );
}

export function Input({ className = '', ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input 
      className={`flex h-10 w-full border-2 border-border bg-background px-3 py-2 text-sm font-mono ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-colors ${className}`}
      {...props} 
    />
  );
}

export function Textarea({ className = '', ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea 
      className={`flex min-h-[80px] w-full border-2 border-border bg-background px-3 py-2 text-sm font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-colors resize-none ${className}`}
      {...props} 
    />
  );
}

export function Badge({ children, className = '', variant = 'default' }: { children: React.ReactNode, className?: string, variant?: 'default' | 'outline' }) {
  const base = "inline-flex items-center px-2 py-0.5 text-[10px] font-mono font-bold transition-colors uppercase tracking-widest";
  const variants = {
    default: "bg-primary text-primary-foreground",
    outline: "border border-primary text-primary"
  };
  return (
    <div className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
}
