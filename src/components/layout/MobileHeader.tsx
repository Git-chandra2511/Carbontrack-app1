import { Menu, Leaf } from 'lucide-react';

interface MobileHeaderProps {
  onMenuClick: () => void;
}

export function MobileHeader({ onMenuClick }: MobileHeaderProps) {
  return (
    <header className="md:hidden h-14 bg-white border-b border-[#E5E7EB] flex items-center px-4 shrink-0 sticky top-0 z-40">
      <button 
        onClick={onMenuClick}
        className="p-2 -ml-2 text-[#6B7280] hover:text-[#111827] focus:outline-none"
        aria-label="Open menu"
      >
        <Menu size={24} />
      </button>
      
      <div className="flex-1 flex justify-center items-center gap-2">
        <Leaf size={18} className="text-[#10B981]" />
        <span className="font-bold text-[#111827]">CarbonTrack</span>
      </div>
      
      <div className="w-10" /> {/* Spacer for centering */}
    </header>
  );
}


