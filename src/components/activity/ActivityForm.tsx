'use client';

import { useState } from 'react';
import { useRouter } from '@/compat/routing';
import { ActivityType } from '@/lib/types';
import { UNITS, CATEGORIES, EMISSION_FACTORS } from '@/lib/emissions/emissionFactors';
import { calculateCO2 } from '@/lib/carbontrack/calculations';
import { saveActivity } from '@/lib/carbontrack/storage';
import { getTodayString } from '@/lib/carbontrack/dateUtils';
import { useToast } from '../common/Toast';
import { AbsurdInputModal } from './AbsurdInputModal';
import { Leaf, Plus } from 'lucide-react';

const ACTIVITY_TYPES: ActivityType[] = [
  'Car travel', 'Bus', 'Flight', 'Electricity', 'Veg meal', 'Non-veg meal'
];

export function ActivityForm() {
  const router = useRouter();
  const { showToast } = useToast();
  
  const [type, setType] = useState<ActivityType>('Car travel');
  const [quantity, setQuantity] = useState<string>('');
  const [date, setDate] = useState<string>(getTodayString());
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingActivity, setPendingActivity] = useState<any>(null);

  const numQuantity = parseFloat(quantity) || 0;
  const estimatedCO2 = calculateCO2(type, numQuantity);
  const unit = UNITS[type];
  const factor = EMISSION_FACTORS[type];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (numQuantity <= 0) {
      showToast('Quantity must be greater than zero.', 'error');
      return;
    }

    const activityData = {
      id: crypto.randomUUID(),
      type,
      quantity: numQuantity,
      unit,
      category: CATEGORIES[type],
      emissionFactor: factor,
      co2: estimatedCO2,
      date,
      createdAt: Date.now(),
    };

    // Absurd input check
    if (numQuantity >= 10000 || estimatedCO2 >= 10000) {
      setPendingActivity(activityData);
      setIsModalOpen(true);
      return;
    }

    saveAndRedirect(activityData);
  };

  const saveAndRedirect = (activity: any) => {
    saveActivity(activity);
    showToast(`Logged ${activity.type}: ${activity.co2.toFixed(2)} kg CO2`, 'success');
    
    // Reset form and redirect
    setQuantity('');
    setIsModalOpen(false);
    setPendingActivity(null);
    router.push('/dashboard');
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 max-w-2xl mx-auto shadow-sm">
        
        <div className="space-y-6">
          {/* Activity Selector */}
          <div>
            <label className="block text-sm font-bold text-[#374151] mb-2">What did you do?</label>
            <div className="relative">
              <select 
                value={type} 
                onChange={(e) => setType(e.target.value as ActivityType)}
                className="block w-full rounded-xl border-[#D1D5DB] border bg-white px-4 py-3 text-[#111827] focus:border-[#10B981] focus:ring-[#10B981] sm:text-sm appearance-none outline-none"
              >
                {ACTIVITY_TYPES.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#6B7280]">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Quantity Input */}
            <div>
              <label className="block text-sm font-bold text-[#374151] mb-2">Quantity</label>
              <div className="relative">
                <input 
                  type="number" 
                  min="0" 
                  step="any"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="0"
                  required
                  className="block w-full rounded-xl border-[#D1D5DB] border bg-white px-4 py-3 text-[#111827] focus:border-[#10B981] focus:ring-[#10B981] sm:text-sm outline-none pr-16"
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                  <span className="text-[#6B7280] sm:text-sm">{unit}</span>
                </div>
              </div>
            </div>

            {/* Date Input */}
            <div>
              <label className="block text-sm font-bold text-[#374151] mb-2">Date</label>
              <input 
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                max={getTodayString()}
                required
                className="block w-full rounded-xl border-[#D1D5DB] border bg-white px-4 py-3 text-[#111827] focus:border-[#10B981] focus:ring-[#10B981] sm:text-sm outline-none"
              />
            </div>
          </div>

          {/* Live Preview */}
          <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-5 flex items-start gap-4">
            <div className="shrink-0 p-2 bg-[#D1FAE5] text-[#10B981] rounded-lg">
              <Leaf size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-[#6B7280] mb-1">Estimated impact</p>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl font-extrabold text-[#111827]">{estimatedCO2.toFixed(2)}</span>
                <span className="text-sm font-bold text-[#6B7280]">kg CO<sub>2</sub></span>
              </div>
              <p className="text-xs text-[#9CA3AF]">
                {numQuantity || 0} {unit} Ã— {factor.toFixed(2)} kg CO<sub>2</sub> per {unit.replace(/s$/, '')}
              </p>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-[#10B981] hover:bg-[#059669] text-white py-3.5 px-4 rounded-xl font-bold shadow-md shadow-[#10B981]/20 transition-all active:scale-[0.98]"
          >
            <Plus size={20} />
            Add Activity
          </button>
        </div>
      </form>

      {pendingActivity && (
        <AbsurdInputModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={() => saveAndRedirect(pendingActivity)}
          type={pendingActivity.type}
          quantity={pendingActivity.quantity}
          unit={pendingActivity.unit}
          co2={pendingActivity.co2}
        />
      )}
    </>
  );
}


