'use client';

import { useEffect, useState, useMemo } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { getActivities, getSettings } from '@/lib/carbontrack/storage';
import { Activity, Settings } from '@/lib/types';
import { EmptyState } from '@/components/common/EmptyState';
import { BarChart3, Lightbulb, TrendingDown, Zap } from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { endOfWeek, format, isWithinInterval, startOfWeek, subDays, subWeeks } from 'date-fns';

const CATEGORY_COLORS = {
  Transport: '#3175A0',
  Energy: '#10B981',
  Food: '#A16628'
};

export default function AnalyticsPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [settings, setSettings] = useState<Settings>({ weeklyTarget: 25, weekStartsOn: 'monday' });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setActivities(getActivities());
    setSettings(getSettings());
  }, []);

  // Prepare data for last 14 days trend
  const trendData = useMemo(() => {
    if (!activities.length) return [];
    
    const data = [];
    for (let i = 13; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dateStr = format(date, 'yyyy-MM-dd');
      
      const dayActivities = activities.filter(a => a.date === dateStr);
      const co2 = dayActivities.reduce((sum, a) => sum + a.co2, 0);
      
      data.push({
        date: format(date, 'MMM d'),
        co2: Number(co2.toFixed(2))
      });
    }
    return data;
  }, [activities]);

  // Prepare data for category distribution
  const categoryData = useMemo(() => {
    if (!activities.length) return [];
    
    const transport = activities.filter(a => a.category === 'Transport').reduce((sum, a) => sum + a.co2, 0);
    const energy = activities.filter(a => a.category === 'Energy').reduce((sum, a) => sum + a.co2, 0);
    const food = activities.filter(a => a.category === 'Food').reduce((sum, a) => sum + a.co2, 0);
    
    return [
      { name: 'Transport', value: Number(transport.toFixed(2)), fill: CATEGORY_COLORS.Transport },
      { name: 'Energy', value: Number(energy.toFixed(2)), fill: CATEGORY_COLORS.Energy },
      { name: 'Food', value: Number(food.toFixed(2)), fill: CATEGORY_COLORS.Food },
    ].filter(d => d.value > 0);
  }, [activities]);

  // Prepare data for top activities
  const topActivities = useMemo(() => {
    if (!activities.length) return [];
    
    const grouped = activities.reduce((acc, curr) => {
      acc[curr.type] = (acc[curr.type] || 0) + curr.co2;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(grouped)
      .map(([name, co2]) => ({ name, co2: Number(co2.toFixed(2)) }))
      .sort((a, b) => b.co2 - a.co2)
      .slice(0, 5);
  }, [activities]);

  const smartInsights = useMemo(() => {
    const weekStartsOn = settings.weekStartsOn === 'sunday' ? 0 : 1;
    const currentWeekStart = startOfWeek(new Date(), { weekStartsOn });
    const currentWeekEnd = endOfWeek(new Date(), { weekStartsOn });
    const previousWeekStart = startOfWeek(subWeeks(new Date(), 1), { weekStartsOn });
    const previousWeekEnd = endOfWeek(subWeeks(new Date(), 1), { weekStartsOn });
    const currentWeekActivities = activities.filter((activity) => {
      const date = new Date(`${activity.date}T00:00:00`);
      return isWithinInterval(date, { start: currentWeekStart, end: currentWeekEnd });
    });
    const previousWeekActivities = activities.filter((activity) => {
      const date = new Date(`${activity.date}T00:00:00`);
      return isWithinInterval(date, { start: previousWeekStart, end: previousWeekEnd });
    });
    const categoryTotals = currentWeekActivities.reduce<Record<string, number>>((totals, activity) => {
      totals[activity.category] = (totals[activity.category] ?? 0) + activity.co2;
      return totals;
    }, {});
    const currentTotal = currentWeekActivities.reduce((total, activity) => total + activity.co2, 0);
    const previousTotal = previousWeekActivities.reduce((total, activity) => total + activity.co2, 0);
    const largestCategory = Object.entries(categoryTotals).sort(([, first], [, second]) => second - first)[0];
    const energyPercentage = currentTotal > 0 ? Math.round(((categoryTotals.Energy ?? 0) / currentTotal) * 100) : 0;

    return {
      largestCategory: largestCategory ? `${largestCategory[0]} is your largest emission category this week.` : null,
      weekComparison: previousTotal > 0 && currentTotal < previousTotal
        ? 'Your emissions are lower than last week.'
        : previousTotal > 0 && currentTotal > previousTotal
          ? 'Your emissions are higher than last week.'
          : 'Log another week to compare your emissions.',
      energyPercentage: currentTotal > 0 ? `Electricity contributed ${energyPercentage}% of your footprint.` : null,
    };
  }, [activities, settings.weekStartsOn]);

  if (!isClient) return <div className="animate-pulse flex-1 bg-gray-100 rounded-xl"></div>;

  if (activities.length === 0) {
    return (
      <div className="animate-in fade-in duration-500 pb-12 h-full flex flex-col">
        <PageHeader title="Analytics" subtitle="Deep dive into your carbon footprint trends." />
        <div className="flex-1">
          <EmptyState 
            icon={<BarChart3 size={32} />}
            title="No data to analyze"
            description="Start logging your daily activities to unlock detailed charts, trends, and category breakdowns."
          />
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 pb-12">
      <PageHeader 
        title="Analytics" 
        subtitle="Deep dive into your carbon footprint trends." 
      />
      
      <div className="space-y-6">

        <div className="bg-[#FFFDF8] border border-[#DDDCD2] rounded-2xl p-6 shadow-sm">
          <div className="flex items-start gap-3 mb-5">
            <div className="rounded-xl bg-[#DCEBE1] p-2 text-[#2F6F59]">
              <Lightbulb size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#19352F]">Smart Insights</h2>
              <p className="text-sm text-[#6D7771]">Simple observations from your activity data.</p>
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {smartInsights.largestCategory && (
              <div className="flex items-start gap-3 rounded-xl bg-[#F3F0E8] p-4">
                <BarChart3 size={18} className="mt-0.5 shrink-0 text-[#D85C4A]" />
                <p className="text-sm font-medium leading-5 text-[#19352F]">{smartInsights.largestCategory}</p>
              </div>
            )}
            <div className="flex items-start gap-3 rounded-xl bg-[#F3F0E8] p-4">
              <TrendingDown size={18} className="mt-0.5 shrink-0 text-[#2F6F59]" />
              <p className="text-sm font-medium leading-5 text-[#19352F]">{smartInsights.weekComparison}</p>
            </div>
            {smartInsights.energyPercentage && (
              <div className="flex items-start gap-3 rounded-xl bg-[#F3F0E8] p-4">
                <Zap size={18} className="mt-0.5 shrink-0 text-[#D6A546]" />
                <p className="text-sm font-medium leading-5 text-[#19352F]">{smartInsights.energyPercentage}</p>
              </div>
            )}
          </div>
        </div>
        
        {/* 14-Day Trend Chart */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-[#111827]">14-Day Emission Trend</h2>
            <p className="text-sm text-[#6B7280]">Your daily CO<sub>2</sub> output over the last two weeks</p>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                <Tooltip 
                  cursor={{ stroke: '#10B981', strokeWidth: 1, strokeDasharray: '5 5' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="co2" 
                  name="kg CO2"
                  stroke="#10B981" 
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#10B981', strokeWidth: 0 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                  animationDuration={1000}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Distribution */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm">
            <div className="mb-2">
              <h2 className="text-lg font-bold text-[#111827]">All-Time Breakdown</h2>
            </div>
            <div className="h-[250px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    animationDuration={1000}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [`${value} kg`, 'CO2']}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Activities */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-[#111827]">Highest-Emission Activities</h2>
            </div>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topActivities} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                  <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#111827', fontWeight: 600 }} />
                  <Tooltip 
                    cursor={{ fill: '#F9FAFB' }}
                    formatter={(value: number) => [`${value} kg`, 'CO2']}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="co2" fill="#F59E0B" radius={[0, 4, 4, 0]} maxBarSize={30} animationDuration={1000} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}


