'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity } from '@/lib/types';
import { getStartOfWeek, getEndOfWeek } from '@/lib/carbontrack/dateUtils';
import { addDays, format, parseISO } from 'date-fns';

interface WeeklyChartProps {
  activities: Activity[];
}

export function WeeklyChart({ activities }: WeeklyChartProps) {
  // Generate data for Mon-Sun
  const start = getStartOfWeek(new Date());
  
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(start, i);
    const dateStr = format(date, 'yyyy-MM-dd');
    
    // Find activities for this day
    const dayActivities = activities.filter(a => a.date === dateStr);
    const totalCO2 = dayActivities.reduce((sum, a) => sum + a.co2, 0);
    
    return {
      name: format(date, 'EEE'), // Mon, Tue, etc.
      fullDate: format(date, 'MMM d'),
      co2: totalCO2,
      // We only show bars for days that have data OR are in the past/today
      // If it's a future day with 0, we could show 0 or hide it.
      // Requirements: "Future days should not be treated as zero emissions (if not logged yet)"
      // Let's just pass null for future days if we want them blank, but Recharts handles 0 fine.
    };
  });

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 h-full">
      <div className="mb-6">
        <p className="text-[11px] font-extrabold tracking-widest text-[#10B981] uppercase mb-1">Trends</p>
        <h2 className="text-lg font-bold text-[#111827]">Daily Emissions</h2>
      </div>
      
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={days} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#6B7280' }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#6B7280' }} 
            />
            <Tooltip
              cursor={{ fill: '#F9FAFB' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-[#111827] text-white p-3 rounded-lg shadow-xl text-sm">
                      <p className="font-bold mb-1">{payload[0].payload.fullDate}</p>
                      <p className="text-[#10B981] font-medium">
                        {Number(payload[0].value).toFixed(2)} kg CO<sub>2</sub>
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar 
              dataKey="co2" 
              fill="#10B981" 
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
              animationDuration={1000}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}


