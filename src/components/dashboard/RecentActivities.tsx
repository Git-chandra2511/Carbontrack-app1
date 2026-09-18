import { Activity } from '@/lib/types';
import { Leaf, Plane, Zap, Car, Bus, Utensils, CircleHelp } from 'lucide-react';
import Link from '@/compat/routing';

interface RecentActivitiesProps {
  activities: Activity[];
}

const getIcon = (type: string) => {
  switch (type) {
    case 'Car travel': return <Car size={16} />;
    case 'Bus': return <Bus size={16} />;
    case 'Flight': return <Plane size={16} />;
    case 'Electricity': return <Zap size={16} />;
    case 'Veg meal': return <Leaf size={16} />;
    case 'Non-veg meal': return <Utensils size={16} />;
    default: return <CircleHelp size={16} />;
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Transport': return 'bg-[#DBEAF6] text-[#3175A0]';
    case 'Energy': return 'bg-[#DFF2E6] text-[#10B981]';
    case 'Food': return 'bg-[#F8EAD5] text-[#A16628]';
    default: return 'bg-gray-100 text-gray-500';
  }
};

export function RecentActivities({ activities }: RecentActivitiesProps) {
  const recent = activities.slice(0, 5);

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 h-full flex flex-col">
      <div className="flex justify-between items-end mb-6">
        <div>
          <p className="text-[11px] font-extrabold tracking-widest text-[#10B981] uppercase mb-1">Recent Activity</p>
          <h2 className="text-lg font-bold text-[#111827]">What you've logged</h2>
        </div>
        <Link href="/history" className="text-sm font-bold text-[#10B981] hover:underline">
          View all
        </Link>
      </div>

      {recent.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-[#6B7280] text-sm py-8 text-center bg-[#F9FAFB] rounded-xl border border-dashed border-[#E5E7EB]">
          No activities logged yet.<br/>Start tracking your footprint today.
        </div>
      ) : (
        <div className="space-y-3">
          {recent.map(activity => (
            <div key={activity.id} className="flex items-center gap-3 p-3 bg-white border border-[#E5E7EB] rounded-xl hover:shadow-sm transition-shadow">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${getCategoryColor(activity.category)}`}>
                {getIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[#111827] text-sm truncate">{activity.type}</p>
                <p className="text-xs text-[#6B7280]">
                  {activity.quantity} {activity.unit} &middot; {new Date(activity.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="font-bold text-[#111827]">{activity.co2.toFixed(2)} kg</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


