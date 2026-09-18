import Link from '@/compat/routing';
import { ArrowRight, Sparkles } from 'lucide-react';
import { formatWeekLabel } from '@/lib/carbontrack/dateUtils';

interface FootprintHeroProps {
  total: number;
  target: number;
}

export function FootprintHero({ total, target }: FootprintHeroProps) {
  const delta = Math.max(target - total, 0);
  const isOnTrack = total <= target;
  const overage = Math.max(total - target, 0);

  const statusMessage = total === 0
    ? 'Log your first activity to begin tracking.'
    : isOnTrack
      ? `You're ${delta.toFixed(1)} kg under your weekly goal.`
      : `Youâ€™ve exceeded your target by ${overage.toFixed(1)} kg.`;

  return (
    <div className="bg-gradient-to-br from-[#111827] via-[#182235] to-[#0f172a] text-white rounded-[28px] p-8 sm:p-10 relative overflow-hidden h-full flex flex-col justify-between shadow-[0_20px_60px_rgba(15,23,42,0.18)]">
      <div className="absolute -top-16 right-0 w-72 h-72 bg-[#34D399] rounded-full blur-[120px] opacity-20" />
      <div className="absolute bottom-0 left-0 w-56 h-56 bg-[#10B981] rounded-full blur-[100px] opacity-15" />

      <div className="relative z-10">
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <span className="bg-white/10 text-[#D1FAE5] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.18em] backdrop-blur-sm border border-white/10">
            This Week
          </span>
          <span className="text-white/60 text-sm font-medium">
            {formatWeekLabel()}
          </span>
        </div>

        <div className="mb-2">
          <p className="text-white/70 text-sm font-medium mb-2">Your Carbon Footprint</p>
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-[-0.06em] tabular-nums">
              {total.toFixed(2)}
            </span>
            <span className="text-xl sm:text-2xl font-bold text-[#34D399]">kg CO<sub>2</sub></span>
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-[#D1FAE5]/80 bg-white/5 w-fit px-4 py-2.5 rounded-xl border border-white/10 backdrop-blur-sm">
          <Sparkles size={16} className="text-[#34D399]" />
          <span>{statusMessage}</span>
        </div>

        <Link
          href="/log"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-white text-[#111827] px-4 py-2.5 text-sm font-semibold shadow-lg shadow-black/10 transition-transform hover:-translate-y-0.5"
        >
          Log activity
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}


