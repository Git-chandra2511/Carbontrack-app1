'use client';

import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { getSettings, saveSettings, getActivities } from '@/lib/carbontrack/storage';
import { getDaysElapsed, getDaysRemaining, isInCurrentWeek } from '@/lib/carbontrack/dateUtils';
import { Settings } from '@/lib/types';
import { useToast } from '@/components/common/Toast';
import { Target, CheckCircle2 } from 'lucide-react';
import Link from '@/compat/routing';

export default function TargetPage() {
  const { showToast } = useToast();
  const [isClient, setIsClient] = useState(false);
  const [settings, setSettings] = useState<Settings>({ weeklyTarget: 25, weekStartsOn: 'monday' });
  const [tempTarget, setTempTarget] = useState<string>('25');
  const [weeklyCO2, setWeeklyCO2] = useState(0);

  useEffect(() => {
    setIsClient(true);
    const s = getSettings();
    setSettings(s);
    setTempTarget(s.weeklyTarget.toString());

    const activities = getActivities();
    const currentWeekActivities = activities.filter(a => isInCurrentWeek(a.date));
    const total = currentWeekActivities.reduce((sum, a) => sum + a.co2, 0);
    setWeeklyCO2(total);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newTarget = parseFloat(tempTarget);
    if (newTarget > 0) {
      const newSettings = { ...settings, weeklyTarget: newTarget };
      saveSettings(newSettings);
      setSettings(newSettings);
      showToast('Weekly target updated successfully', 'success');
    } else {
      showToast('Target must be greater than zero', 'error');
    }
  };

  if (!isClient) return <div className="animate-pulse flex-1 bg-gray-100 rounded-xl"></div>;

  const percentage = Math.min((weeklyCO2 / settings.weeklyTarget) * 100, 100);
  const remaining = Math.max(settings.weeklyTarget - weeklyCO2, 0);
  const isExceeded = weeklyCO2 > settings.weeklyTarget;
  
  const daysElapsed = getDaysElapsed(settings.weekStartsOn === 'monday' ? 1 : 0);
  const daysRemaining = getDaysRemaining(settings.weekStartsOn === 'monday' ? 1 : 0);

  return (
    <div className="animate-in fade-in duration-500 pb-12 max-w-3xl mx-auto">
      <PageHeader 
        title="Weekly Target" 
        subtitle="Set a goal to keep your emissions in check." 
      />

      {isExceeded && (
        <div className="bg-[#FEF2F2] border-2 border-[#FECACA] rounded-2xl p-6 mb-8 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
          <div className="shrink-0 w-12 h-12 bg-[#FCA5A5] text-[#991B1B] rounded-full flex items-center justify-center">
            <Target size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-[#991B1B] text-lg font-bold mb-1">âš ï¸ Weekly target exceeded</h3>
            <p className="text-[#7F1D1D] text-sm leading-relaxed">
              You've reached <strong>{weeklyCO2.toFixed(1)} kg CO<sub>2</sub></strong>. Your target was <strong>{settings.weeklyTarget} kg</strong>.<br/>
              That's okay â€” awareness is the first step. Consider lower-carbon choices for your next activities.
            </p>
          </div>
          <div className="shrink-0">
            <Link 
              href="/breakdown"
              className="inline-flex px-4 py-2 bg-white text-[#991B1B] border border-[#FCA5A5] rounded-xl font-bold hover:bg-[#FEF2F2] transition-colors"
            >
              View Breakdown
            </Link>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <form onSubmit={handleSave} className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#111827] mb-2">Set Your Target</h2>
            <p className="text-sm text-[#6B7280] mb-6">Choose a realistic weekly limit for your carbon emissions.</p>
            
            <div className="relative mb-6">
              <input 
                type="number"
                min="1"
                step="0.5"
                value={tempTarget}
                onChange={(e) => setTempTarget(e.target.value)}
                className="block w-full text-3xl font-extrabold rounded-xl border-[#D1D5DB] border bg-white px-4 py-6 text-[#111827] focus:border-[#10B981] focus:ring-[#10B981] outline-none"
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-6">
                <span className="text-[#9CA3AF] font-bold text-xl">kg CO<sub>2</sub></span>
              </div>
            </div>
          </div>
          
          <button 
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-[#111827] hover:bg-[#374151] text-white py-3.5 px-4 rounded-xl font-bold transition-all active:scale-[0.98]"
          >
            <CheckCircle2 size={20} />
            Update Target
          </button>
        </form>

        <div className="bg-[#111827] text-white rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#10B981] rounded-full filter blur-[60px] opacity-20 translate-x-1/3 -translate-y-1/3"></div>
          
          <div>
            <h2 className="text-lg font-bold text-white mb-6">Current Progress</h2>
            
            <div className="flex justify-between items-end mb-2">
              <span className="text-[#9CA3AF] text-sm font-medium">This Week</span>
              <span className="text-3xl font-extrabold tabular-nums leading-none">{weeklyCO2.toFixed(1)}</span>
            </div>
            
            <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden relative mb-6">
              <div 
                className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out ${
                  isExceeded ? 'bg-[#EF4444]' : 'bg-[#10B981]'
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                <p className="text-xs text-[#9CA3AF] mb-1">Target</p>
                <p className="font-bold">{settings.weeklyTarget} kg</p>
              </div>
              <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                <p className="text-xs text-[#9CA3AF] mb-1">{isExceeded ? 'Exceeded by' : 'Remaining'}</p>
                <p className={`font-bold ${isExceeded ? 'text-[#FCA5A5]' : 'text-[#D1FAE5]'}`}>
                  {isExceeded ? (weeklyCO2 - settings.weeklyTarget).toFixed(1) : remaining.toFixed(1)} kg
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-white/10 flex justify-between text-sm">
            <span className="text-[#D1FAE5]">{daysElapsed} days elapsed</span>
            <span className="text-[#9CA3AF]">{daysRemaining} days left</span>
          </div>
        </div>
      </div>
    </div>
  );
}


