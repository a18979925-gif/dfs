'use client';

/**
 * DESIGN SYSTEM - Color Palettes, Icons, and Styling Guide
 * Use these consistently throughout the app
 */

export const DESIGN_SYSTEM = {
  // Role-based color schemes
  colors: {
    dev: {
      primary: '#3b82f6', // Blue
      secondary: '#60a5fa',
      accent: '#0ea5e9',
      light: '#dbeafe',
      dark: '#1e40af',
      gradient: 'from-blue-600 to-indigo-600',
    },
    buyer: {
      primary: '#10b981', // Emerald
      secondary: '#34d399',
      accent: '#6ee7b7',
      light: '#d1fae5',
      dark: '#047857',
      gradient: 'from-emerald-600 to-teal-600',
    },
    viewer: {
      primary: '#64748b', // Slate
      secondary: '#94a3b8',
      accent: '#cbd5e1',
      light: '#f1f5f9',
      dark: '#334155',
      gradient: 'from-slate-600 to-slate-500',
    },
    status: {
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    },
  },

  // Shadows for depth
  shadows: {
    xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    glow: {
      dev: '0 0 20px rgba(59, 130, 246, 0.3)',
      buyer: '0 0 20px rgba(16, 185, 129, 0.3)',
      viewer: '0 0 20px rgba(100, 116, 139, 0.3)',
    },
  },

  // Border radius scale
  radius: {
    xs: '0.25rem',
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.25rem',
    full: '9999px',
  },

  // Spacing scale
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
  },

  // Typography
  typography: {
    h1: { size: '32px', weight: 700, lineHeight: '40px' },
    h2: { size: '28px', weight: 700, lineHeight: '36px' },
    h3: { size: '24px', weight: 600, lineHeight: '32px' },
    h4: { size: '20px', weight: 600, lineHeight: '28px' },
    h5: { size: '18px', weight: 600, lineHeight: '24px' },
    h6: { size: '16px', weight: 600, lineHeight: '24px' },
    body: { size: '16px', weight: 400, lineHeight: '24px' },
    bodySmall: { size: '14px', weight: 400, lineHeight: '20px' },
    caption: { size: '12px', weight: 500, lineHeight: '16px' },
    overline: { size: '11px', weight: 600, lineHeight: '16px', letterSpacing: '0.5px' },
  },

  // Animation presets
  animations: {
    fast: 'transition-all duration-150',
    normal: 'transition-all duration-300',
    slow: 'transition-all duration-500',
    smooth: 'ease-out',
  },
};

// ============= COMPONENT PRESETS =============

export const BUTTON_VARIANTS = {
  primary: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white',
  secondary: 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white',
  success: 'bg-emerald-600 hover:bg-emerald-700 text-white',
  warning: 'bg-amber-600 hover:bg-amber-700 text-white',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
  outline: 'border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900',
};

export const CARD_STYLES = {
  elevated: 'bg-white dark:bg-slate-900 rounded-2xl shadow-lg shadow-slate-900/5 border border-slate-200/50 dark:border-slate-800/50',
  outlined: 'bg-transparent rounded-2xl border-2 border-slate-200 dark:border-slate-700',
  filled: 'bg-slate-50 dark:bg-slate-800 rounded-2xl border-0',
  glass: 'bg-white/60 dark:bg-slate-900/60 backdrop-blur-lg rounded-2xl border border-slate-200/50 dark:border-slate-800/50',
};

export const BADGE_VARIANTS = {
  blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200',
  emerald: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200',
  amber: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200',
  red: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200',
  slate: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200',
};

export const INPUT_STYLES = {
  base: 'h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-sm',
  focused: 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-950',
};

// ============= HELPER UTILITIES =============

export function getGradient(role: 'dev' | 'buyer' | 'viewer') {
  return DESIGN_SYSTEM.colors[role].gradient;
}

export function getColor(role: 'dev' | 'buyer' | 'viewer', type: 'primary' | 'secondary' | 'accent' = 'primary') {
  return DESIGN_SYSTEM.colors[role][type];
}

export function getGlow(role: 'dev' | 'buyer' | 'viewer') {
  return DESIGN_SYSTEM.shadows.glow[role];
}

export function getStatusColor(status: 'success' | 'warning' | 'error' | 'info') {
  return DESIGN_SYSTEM.colors.status[status];
}

// Role detection from pathname
export function getRoleFromPath(pathname: string): 'dev' | 'buyer' | 'viewer' {
  if (pathname.includes('/dev')) return 'dev';
  if (pathname.includes('/buyer')) return 'buyer';
  return 'viewer';
}
