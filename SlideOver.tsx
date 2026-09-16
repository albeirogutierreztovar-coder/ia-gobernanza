import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface SlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  description?: string;
}

export function SlideOver({ isOpen, onClose, title, children, description }: SlideOverProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
      <div className="absolute inset-0 overflow-hidden">
        {/* Background overlay */}
        <div 
          ref={overlayRef}
          className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
          onClick={handleOverlayClick}
          aria-hidden="true"
        />

        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
          {/* Slide-over panel */}
          <div className="pointer-events-auto w-screen max-w-2xl transform transition-transform duration-500 ease-in-out">
            <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-2xl">
              
              {/* Header */}
              <div className="bg-slate-50 px-6 py-6 border-b border-slate-200">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900" id="slide-over-title">
                      {title}
                    </h2>
                    {description && (
                      <p className="mt-1 text-sm text-slate-500">
                        {description}
                      </p>
                    )}
                  </div>
                  <div className="ml-3 flex h-7 items-center">
                    <button
                      type="button"
                      className="rounded-md bg-slate-50 text-slate-400 hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                      onClick={onClose}
                    >
                      <span className="sr-only">Cerrar panel</span>
                      <X className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="relative flex-1 px-6 py-6">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
