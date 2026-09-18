'use client';

import Link from '@/compat/routing';
import { useEffect, useState } from 'react';
import { Activity, Settings } from '@/lib/types';
import { DashboardHero } from '@/components/dashboard/DashboardHero';
import { FootprintHero } from '@/components/dashboard/FootprintHero';
import { RecentActivities } from '@/components/dashboard/RecentActivities';
import { StatCard } from '@/components/dashboard/StatCard';
import { TargetProgress } from '@/components/dashboard/TargetProgress';
import { WeeklyChart } from '@/components/dashboard/WeeklyChart';
import { Milestones } from '@/components/dashboard/Milestones';
import { PageHeader } from '@/components/layout/PageHeader';
import { isInCurrentWeek } from '@/lib/carbontrack/dateUtils';
import { getActivities, getSettings } from '@/lib/carbontrack/storage';
import { updateAchievements } from '@/lib/carbontrack/milestones';
import { Activity as ActivityIcon, Car, Plus, Utensils, Zap } from 'lucide-react';

export default function Dashboard() {
  const [isClient, setIsClient] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [settings, setSettings] = useState<Settings>({ weeklyTarget: 25, weekStartsOn: 'monday' });
  const [weeklyActivities, setWeeklyActivities] = useState<Activity[]>([]);
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);

  useEffect(() => {
    setIsClient(true);
    const loadedActivities = getActivities();
    const loadedSettings = getSettings();

    setActivities(loadedActivities);
    setSettings(loadedSettings);
    setUnlockedAchievements(updateAchievements(loadedActivities, loadedSettings));

    const currentWeekData = loadedActivities.filter((a) => isInCurrentWeek(a.date));
    setWeeklyActivities(currentWeekData);
  }, []);

  if (!isClient) return <div className="animate-pulse flex-1 bg-gray-100 rounded-xl" />;

  const totalCO2 = weeklyActivities.reduce((sum, a) => sum + a.co2, 0);

  const transportCO2 = weeklyActivities
    .filter((a) => a.category === 'Transport')
    .reduce((sum, a) => sum + a.co2, 0);
  const energyCO2 = weeklyActivities
    .filter((a) => a.category === 'Energy')
    .reduce((sum, a) => sum + a.co2, 0);
  const foodCO2 = weeklyActivities
    .filter((a) => a.category === 'Food')
    .reduce((sum, a) => sum + a.co2, 0);

  return (
    <div className="m-0 w-full animate-in fade-in duration-500 pb-12">
      <DashboardHero
        total={totalCO2}
        target={settings.weeklyTarget}
        activityCount={weeklyActivities.length}
      />

      <div className="px-4 pt-8 md:px-8 lg:px-10">
        <PageHeader
          title="Good day"
          subtitle="Here's your carbon footprint for this week."
          action={
            <Link
              href="/log"
              className="inline-flex items-center gap-2 rounded-xl bg-[#111827] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#1F2937]"
            >
              <Plus size={16} />
              Log activity
            </Link>
          }
        />

        <Milestones unlockedIds={unlockedAchievements} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 min-h-[300px]">
            <FootprintHero total={totalCO2} target={settings.weeklyTarget} />
          </div>
          <div className="min-h-[300px]">
            <TargetProgress total={totalCO2} target={settings.weeklyTarget} />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard title="Transport" value={`${transportCO2.toFixed(1)}`} subtitle="kg CO₂" icon={<Car size={20} />} />
          <StatCard title="Energy" value={`${energyCO2.toFixed(1)}`} subtitle="kg CO₂" icon={<Zap size={20} />} />
          <StatCard title="Food" value={`${foodCO2.toFixed(1)}`} subtitle="kg CO₂" icon={<Utensils size={20} />} />
          <StatCard title="Activities" value={`${weeklyActivities.length}`} subtitle="This week" icon={<ActivityIcon size={20} />} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="min-h-[350px]">
            <WeeklyChart activities={weeklyActivities} />
          </div>
          <div className="min-h-[350px]">
            <RecentActivities activities={activities} />
          </div>
        </div>
      </div>
    </div>
  );
}
