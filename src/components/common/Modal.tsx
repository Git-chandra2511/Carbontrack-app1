import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children, icon }: ModalProps) {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      <div 
        className="fixed inset-0 bg-[#111827]/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 sm:p-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-[#9CA3AF] hover:text-[#111827] transition-colors p-2 rounded-full hover:bg-[#F9FAFB]"
        >
          <X size={20} />
        </button>
        
        <div className="flex gap-4 items-start mb-6">
          {icon && (
            <div className="shrink-0 w-12 h-12 bg-[#FFFBEB] text-[#F59E0B] rounded-full flex items-center justify-center">
              {icon}
            </div>
          )}
          <div className="flex-1 pt-1">
            <h2 className="text-xl font-bold text-[#111827]">{title}</h2>
          </div>
        </div>
        
        <div>
          {children}
        </div>
      </div>
    </div>
  );
}


