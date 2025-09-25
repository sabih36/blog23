
import React from 'react';

const SVGIcon: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = 'w-6 h-6' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    {children}
  </svg>
);

export const IconSearch: React.FC<{ className?: string }> = ({ className }) => (
  <SVGIcon className={className || 'w-5 h-5'}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </SVGIcon>
);

export const IconPencil: React.FC<{ className?: string }> = ({ className }) => (
  <SVGIcon className={className || 'w-5 h-5'}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
  </SVGIcon>
);

export const IconChevronLeft: React.FC<{ className?: string }> = ({ className }) => (
  <SVGIcon className={className || 'w-5 h-5'}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </SVGIcon>
);

export const IconSparkles: React.FC<{ className?: string }> = ({ className }) => (
  <SVGIcon className={className || 'w-5 h-5'}>
     <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18l-1.813-2.096a4.5 4.5 0 00-6.364-6.364l-1.091 1.091L1.813 8.096 3.904 9 4.995 7.909a4.5 4.5 0 006.364 6.364l1.091-1.091.06.06zM12 21l-1.091-1.091a4.5 4.5 0 00-6.364-6.364l-1.091 1.091L1.813 12.096 3.904 13l1.091-1.091a4.5 4.5 0 006.364 6.364l1.091-1.091.06.06zM21 12l-1.813 2.096a4.5 4.5 0 01-6.364 6.364l-1.091-1.091L10.813 16.096 12.904 15l-1.091-1.091a4.5 4.5 0 016.364-6.364l1.091 1.091L20.187 7.904 22.187 9z" />
  </SVGIcon>
);

export const IconLoader: React.FC<{ className?: string }> = ({ className }) => (
    <SVGIcon className={`animate-spin ${className || 'w-5 h-5'}`}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 12a8 8 0 018-8v0a8 8 0 018 8v0a8 8 0 01-8 8v0a8 8 0 01-8-8v0z" />
    </SVGIcon>
);
