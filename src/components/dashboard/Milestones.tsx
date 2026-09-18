import { Check, Trophy } from 'lucide-react';
import { MILESTONES } from '@/lib/carbontrack/milestones';

interface MilestonesProps {
  unlockedIds: string[];
}

export function Milestones({ unlockedIds }: MilestonesProps) {
  const unlocked = new Set(unlockedIds);

  return (
    <section className="mb-6 rounded-2xl border border-[#DDDCD2] bg-[#FFFDF8] p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-[#F8EAD5] p-2 text-[#A16628]">
            <Trophy size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#19352F]">Milestones</h2>
            <p className="text-sm text-[#6D7771]">Small wins that keep your momentum visible.</p>
          </div>
        </div>
        <span className="whitespace-nowrap text-sm font-bold text-[#A16628]">
          🏆 {unlockedIds.length} achievements unlocked
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {MILESTONES.map((milestone) => {
          const isUnlocked = unlocked.has(milestone.id);
          return (
            <div
              key={milestone.id}
              className={`rounded-xl border p-4 ${
                isUnlocked
                  ? 'border-[#E8C98F] bg-[#FFF8EA]'
                  : 'border-[#DDDCD2] bg-[#F3F0E8] opacity-60'
              }`}
            >
              <div className="mb-3 flex items-center justify-between">
                <Trophy size={18} className={isUnlocked ? 'text-[#A16628]' : 'text-[#8A918B]'} />
                {isUnlocked && <Check size={17} className="text-[#2F6F59]" />}
              </div>
              <h3 className="font-bold text-[#19352F]">{milestone.title}</h3>
              <p className="mt-1 text-xs leading-5 text-[#6D7771]">{milestone.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}