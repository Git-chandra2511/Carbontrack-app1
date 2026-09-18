import Link from '@/compat/routing';
import { usePathname } from '@/compat/routing';
import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  History,
  Info,
  LayoutDashboard,
  Leaf,
  PieChart,
  PlusCircle,
  Settings,
  Target,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { formatWeekLabel, isInCurrentWeek } from '@/lib/carbontrack/dateUtils';
import { getActivities } from '@/lib/carbontrack/storage';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobile?: boolean;
  onCloseMobile?: () => void;
}

const NAV_ITEMS = [
  { group: 'MAIN' },
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Log Activity', path: '/log', icon: PlusCircle },
  { name: 'History', path: '/history', icon: History },
  { group: 'INSIGHTS' },
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  { name: 'Category Breakdown', path: '/breakdown', icon: PieChart },
  { name: 'Weekly Target', path: '/target', icon: Target },
  { group: 'OTHER' },
  { name: 'Settings', path: '/settings', icon: Settings },
  { name: 'About', path: '/about', icon: Info },
];

export function Sidebar({ isCollapsed, onToggleCollapse, isMobile, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const [weeklyTotal, setWeeklyTotal] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const activities = getActivities();
    const total = activities
      .filter((activity) => isInCurrentWeek(activity.date))
      .reduce((acc, curr) => acc + curr.co2, 0);
    setWeeklyTotal(total);
  }, [pathname]);

  return (
    <aside 
      className={`h-full bg-[#F7F4EC] border-r border-[#D9D8CE] flex flex-col transition-all duration-300 ${
        isCollapsed && !isMobile ? 'w-[76px]' : 'w-[260px]'
      }`}
    >
      {/* Brand */}
      <div className="h-[76px] flex items-center px-5 border-b border-[#D9D8CE] shrink-0 justify-between">
        <div className="flex items-center gap-3 overflow-hidden whitespace-nowrap">
          <div className="w-8 h-8 rounded-lg bg-[#10B981] text-white flex items-center justify-center shrink-0">
            <Leaf size={18} />
          </div>
          {(!isCollapsed || isMobile) && (
            <div className="flex flex-col animate-in fade-in duration-300">
              <span className="font-bold text-[#19352F] leading-tight text-lg">CarbonTrack</span>
              <span className="text-[10px] text-[#6D7771] font-medium uppercase tracking-wider">Personal Dashboard</span>
            </div>
          )}
        </div>
        
        {isMobile && (
          <button onClick={onCloseMobile} className="p-2 -mr-2 text-[#6B7280] hover:bg-[#F9FAFB] rounded-md">
            <X size={20} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-1 no-scrollbar">
        {NAV_ITEMS.map((item, index) => {
          if (item.group) {
            if (isCollapsed && !isMobile) return <div key={index} className="h-6" />; // Spacer when collapsed
            return (
              <div key={index} className="px-3 pt-4 pb-1 text-xs font-bold text-[#A07D43] tracking-wider">
                {item.group}
              </div>
            );
          }

          const isActive = pathname === item.path || (pathname === '/' && item.path === '/dashboard');
          const Icon = item.icon as any;

          return (
            <Link 
              key={item.name} 
              href={item.path as string}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group relative ${
                isActive 
                  ? 'bg-[#DCEBE1] text-[#1F4F40] font-semibold' 
                  : 'text-[#6D7771] hover:bg-[#ECE8DD] hover:text-[#19352F]'
              }`}
              title={isCollapsed && !isMobile ? item.name : undefined}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#D85C4A] rounded-r-full" />
              )}
              
              <Icon size={20} className={`shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-[#10B981]' : ''}`} />
              
              {(!isCollapsed || isMobile) && (
                <span className="whitespace-nowrap animate-in fade-in duration-300">
                  {item.name}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-[#E5E7EB] shrink-0 bg-[#F9FAFB]">
        {(!isCollapsed || isMobile) ? (
          <div className="animate-in fade-in duration-300 rounded-2xl border border-[#E5E7EB] bg-white px-3 py-2 shadow-sm">
            <div className="text-[10px] uppercase tracking-[0.14em] text-[#6B7280] font-semibold mb-1">
              {isClient ? 'This week' : 'Loading'}
            </div>
              <div className="font-bold text-[#19352F] flex items-baseline gap-1">
              <span className="text-lg tabular-nums">{isClient ? weeklyTotal.toFixed(1) : '0.0'}</span>
              <span className="text-sm text-[#6B7280] font-normal">kg CO<sub>2</sub></span>
            </div>
            <div className="mt-1 text-[11px] text-[#6B7280]">
              {isClient ? formatWeekLabel() : '...'}
            </div>
          </div>
        ) : (
          <div className="flex justify-center text-[#10B981]">
            <Leaf size={20} />
          </div>
        )}
      </div>

      {/* Collapse Toggle */}
      {!isMobile && (
        <button 
          onClick={onToggleCollapse}
          className="absolute -right-3 top-10 w-6 h-6 bg-white border border-[#E5E7EB] rounded-full flex items-center justify-center text-[#6B7280] hover:text-[#111827] hover:shadow-sm transition-all z-10"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      )}
    </aside>
  );
}


