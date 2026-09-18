'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { MobileHeader } from './MobileHeader';
import { usePathname } from '@/compat/routing';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile drawer on navigation
  useEffect(() => {
    setIsMobileDrawerOpen(false);
  }, [pathname]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.08),_transparent_30%),_#F9FAFB] text-[#111827]">
      <div className="hidden md:block">
        <Sidebar 
          isCollapsed={isSidebarCollapsed} 
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
        />
      </div>

      {/* Mobile Drawer */}
      {isMobileDrawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsMobileDrawerOpen(false)}
          />
          <div className="relative z-50 h-full w-[260px] bg-white shadow-xl animate-in slide-in-from-left">
            <Sidebar 
              isCollapsed={false} 
              onToggleCollapse={() => {}} 
              isMobile={true}
              onCloseMobile={() => setIsMobileDrawerOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <MobileHeader onMenuClick={() => setIsMobileDrawerOpen(true)} />
        
        <main className="min-w-0 flex-1 overflow-y-auto p-0 no-scrollbar">
          <div
            className={
              pathname === '/' || pathname === '/dashboard'
                ? 'm-0 h-full w-full max-w-none p-0'
                : 'max-w-5xl mx-auto p-4 md:p-8 lg:p-10 w-full h-full'
            }
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
