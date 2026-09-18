'use client';

import { useEffect, useState, useMemo } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { getActivities } from '@/lib/carbontrack/storage';
import { Activity } from '@/lib/types';
import { EmptyState } from '@/components/common/EmptyState';
import { PieChart as PieChartIcon, Car, Zap, Utensils } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const CATEGORY_COLORS = {
  Transport: '#3175A0',
  Energy: '#10B981',
  Food: '#A16628'
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Transport': return <Car size={24} />;
    case 'Energy': return <Zap size={24} />;
    case 'Food': return <Utensils size={24} />;
    default: return null;
  }
};

export default function BreakdownPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setActivities(getActivities());
  }, []);

  const data = useMemo(() => {
    if (!activities.length) return { total: 0, items: [] };
    
    const transport = activities.filter(a => a.category === 'Transport').reduce((sum, a) => sum + a.co2, 0);
    const transportCount = activities.filter(a => a.category === 'Transport').length;
    
    const energy = activities.filter(a => a.category === 'Energy').reduce((sum, a) => sum + a.co2, 0);
    const energyCount = activities.filter(a => a.category === 'Energy').length;
    
    const food = activities.filter(a => a.category === 'Food').reduce((sum, a) => sum + a.co2, 0);
    const foodCount = activities.filter(a => a.category === 'Food').length;
    
    const total = transport + energy + food;
    
    const items = [
      { name: 'Transport', co2: transport, count: transportCount, percent: total ? (transport/total)*100 : 0 },
      { name: 'Energy', co2: energy, count: energyCount, percent: total ? (energy/total)*100 : 0 },
      { name: 'Food', co2: food, count: foodCount, percent: total ? (food/total)*100 : 0 }
    ].sort((a, b) => b.co2 - a.co2); // Sort by largest emitter

    return { total, items };
  }, [activities]);

  if (!isClient) return <div className="animate-pulse flex-1 bg-gray-100 rounded-xl"></div>;

  if (activities.length === 0) {
    return (
      <div className="animate-in fade-in duration-500 pb-12 h-full flex flex-col">
        <PageHeader title="Carbon Breakdown" subtitle="See where your emissions are coming from." />
        <div className="flex-1">
          <EmptyState 
            icon={<PieChartIcon size={32} />}
            title="No breakdown available"
            description="Log some activities to see your carbon footprint distributed by category."
          />
        </div>
      </div>
    );
  }

  const chartData = data.items
    .filter(d => d.co2 > 0)
    .map(d => ({ name: d.name, value: Number(d.co2.toFixed(2)), fill: CATEGORY_COLORS[d.name as keyof typeof CATEGORY_COLORS] }));

  return (
    <div className="animate-in fade-in duration-500 pb-12">
      <PageHeader 
        title="Carbon Breakdown" 
        subtitle="See where your emissions are coming from." 
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-white border border-[#E5E7EB] rounded-3xl p-6 sm:p-10 shadow-sm">
        
        {/* Large Donut Chart */}
        <div className="h-[300px] sm:h-[400px] w-full relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={window.innerWidth < 640 ? 80 : 120}
                outerRadius={window.innerWidth < 640 ? 120 : 160}
                paddingAngle={3}
                dataKey="value"
                animationDuration={1000}
                stroke="none"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [`${value} kg`, 'CO2']}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
              />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Center Text */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <span className="block text-4xl sm:text-5xl font-extrabold text-[#111827] tabular-nums">
                {data.total.toFixed(1)}
              </span>
              <span className="text-sm font-bold text-[#6B7280] uppercase tracking-wider">
                Total kg CO<sub>2</sub>
              </span>
            </div>
          </div>
        </div>

        {/* Category Cards */}
        <div className="flex flex-col gap-4">
          {data.items.map(item => (
            <div key={item.name} className="flex items-center gap-4 p-5 bg-[#F9FAFB] rounded-2xl border border-[#E5E7EB] hover:bg-white transition-colors group">
              <div 
                className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 text-white shadow-inner"
                style={{ backgroundColor: CATEGORY_COLORS[item.name as keyof typeof CATEGORY_COLORS] }}
              >
                {getCategoryIcon(item.name)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-lg font-bold text-[#111827] uppercase tracking-wide">{item.name}</h3>
                  <span className="text-2xl font-extrabold text-[#111827]">{item.percent.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-[#6B7280]">{item.count} {item.count === 1 ? 'activity' : 'activities'}</p>
                  <p className="text-sm font-bold text-[#6B7280]">{item.co2.toFixed(2)} kg CO<sub>2</sub></p>
                </div>
                
                {/* Progress bar */}
                <div className="w-full bg-[#E5E7EB] h-1.5 rounded-full mt-3 overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{ 
                      width: `${item.percent}%`,
                      backgroundColor: CATEGORY_COLORS[item.name as keyof typeof CATEGORY_COLORS] 
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}


