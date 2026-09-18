import { Target, Info } from 'lucide-react';
import { getDaysElapsed, getDaysRemaining } from '@/lib/carbontrack/dateUtils';

interface TargetProgressProps {
  total: number;
  target: number;
}

export function TargetProgress({ total, target }: TargetProgressProps) {
  const percentage = Math.min((total / target) * 100, 100);
  const remaining = Math.max(target - total, 0);
  const isExceeded = total > target;
  
  const daysElapsed = getDaysElapsed();
  const daysRemaining = getDaysRemaining();

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Target size={18} className="text-[#10B981]" />
          <h3 className="text-sm font-bold text-[#6B7280] uppercase tracking-wider">Weekly Target</h3>
        </div>
        
        <div className="flex items-end gap-2 mb-6 mt-4">
          <span className="text-4xl font-extrabold text-[#111827] leading-none tabular-nums">
            {total.toFixed(1)}
          </span>
          <span className="text-xl text-[#9CA3AF] font-medium leading-none pb-0.5">
            / {target} kg
          </span>
        </div>
      </div>

      <div>
        <div className="flex justify-between text-sm font-medium mb-2">
          <span className={isExceeded ? 'text-[#EF4444]' : 'text-[#111827]'}>
            {percentage.toFixed(1)}%
          </span>
          <span className="text-[#6B7280]">
            {isExceeded ? 'Target Exceeded' : `${remaining.toFixed(1)} kg remaining`}
          </span>
        </div>
        
        <div className="h-3 w-full bg-[#F3F4F6] rounded-full overflow-hidden relative mb-4">
          <div 
            className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out ${
              isExceeded ? 'bg-[#EF4444]' : 'bg-[#10B981]'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="flex items-start gap-2 bg-[#F9FAFB] p-3 rounded-lg border border-[#E5E7EB]">
          <Info size={16} className="text-[#9CA3AF] shrink-0 mt-0.5" />
          <p className="text-xs text-[#6B7280] leading-relaxed">
            <strong className="text-[#111827]">{daysElapsed}</strong> days elapsed. You have <strong className="text-[#111827]">{daysRemaining}</strong> days remaining in this cycle.
          </p>
        </div>
      </div>
    </div>
  );
}


