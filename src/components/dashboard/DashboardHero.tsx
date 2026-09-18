'use client';

import Link from '@/compat/routing';
import { useEffect, useState } from 'react';
import { ArrowUpRight, Leaf, Sparkles } from 'lucide-react';

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4';

function FadeIn({
  children,
  delay,
  duration = 1000,
}: {
  children: React.ReactNode;
  delay: number;
  duration?: number;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(true), delay);
    return () => window.clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className="transition-opacity"
      style={{ opacity: visible ? 1 : 0, transitionDuration: `${duration}ms` }}
    >
      {children}
    </div>
  );
}

function AnimatedHeading() {
  const [visible, setVisible] = useState(false);
  const lines = ['Track your impact.', 'Build a lighter future.'];
  const charDelay = 30;

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(true), 200);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <h1
      className="mb-4 text-4xl font-normal leading-[0.98] tracking-[-0.04em] text-white md:text-5xl lg:text-6xl xl:text-7xl"
      aria-label={lines.join(' ')}
    >
      {lines.map((line, lineIndex) => (
        <span key={line} className="block whitespace-nowrap">
          {Array.from(line).map((character, charIndex) => (
            <span
              key={`${line}-${charIndex}`}
              aria-hidden="true"
              className="inline-block transition-[opacity,transform]"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateX(0)' : 'translateX(-18px)',
                transitionDuration: '500ms',
                transitionDelay: `${lineIndex * line.length * charDelay + charIndex * charDelay}ms`,
              }}
            >
              {character === ' ' ? '\u00A0' : character}
            </span>
          ))}
        </span>
      ))}
    </h1>
  );
}

interface DashboardHeroProps {
  total: number;
  target: number;
  activityCount: number;
}

export function DashboardHero({ total, target, activityCount }: DashboardHeroProps) {
  const targetProgress = target > 0 ? Math.min((total / target) * 100, 100) : 0;
  const remaining = Math.max(target - total, 0);

  return (
    <section className="relative isolate flex min-h-[calc(100svh-3.5rem)] w-full flex-col overflow-hidden bg-black text-white">
      <video
        className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover"
        src={VIDEO_URL}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
      />

      <nav className="relative z-10 px-6 pt-6 md:px-12 lg:px-16">
        <div className="liquid-glass relative flex items-center justify-between rounded-xl px-3 py-2 sm:px-4">
          <Link href="/dashboard" className="flex items-center gap-2.5 text-white">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#10B981] shadow-lg shadow-[#10B981]/30">
              <Leaf size={17} />
            </span>
            <span className="hidden text-sm font-semibold tracking-tight sm:inline">CarbonTrack</span>
          </Link>

          <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-6 lg:gap-8 md:flex">
            {[
              ['Dashboard', '/dashboard'],
              ['Insights', '/analytics'],
              ['History', '/history'],
              ['About', '/about'],
            ].map(([item, href]) => (
              <a
                key={item}
                href={href}
                className="text-xs text-white transition-colors hover:text-gray-300 lg:text-sm"
              >
                {item}
              </a>
            ))}
          </div>

          <Link href="/log" className="rounded-lg bg-white px-4 py-2 text-xs font-semibold text-black transition-colors hover:bg-gray-100 sm:px-6 sm:text-sm">
            Log activity
          </Link>
        </div>
      </nav>

      <div className="relative z-10 flex min-h-0 flex-1 flex-col justify-end px-6 pb-8 sm:pb-10 md:px-12 lg:px-16 lg:pb-14">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-end lg:gap-8">
          <div className="max-w-3xl">
            <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#A7F3D0]">
              <Sparkles size={14} />
              Your personal climate dashboard
            </div>
            <AnimatedHeading />
            <FadeIn delay={800}>
              <p className="mb-5 max-w-xl text-sm leading-6 text-gray-300 sm:text-base md:text-lg">
                Turn everyday choices into measurable progress toward a lower-carbon lifestyle.
              </p>
            </FadeIn>
            <FadeIn delay={1200}>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/log"
                  className="rounded-lg bg-white px-8 py-3 font-medium text-black transition-colors hover:bg-gray-100"
                >
                  Log an activity
                </Link>
                <Link
                  href="/analytics"
                  className="liquid-glass rounded-lg border border-white/20 px-8 py-3 font-medium text-white transition-colors hover:bg-white hover:text-black"
                >
                  View insights
                </Link>
              </div>
            </FadeIn>
          </div>

          <div className="flex items-end justify-start lg:justify-end">
            <FadeIn delay={1400}>
              <div className="liquid-glass w-full max-w-sm rounded-2xl border border-white/20 p-4 sm:p-5">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#A7F3D0]">
                      Weekly pulse
                    </p>
                    <p className="mt-1 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                      {total.toFixed(1)} <span className="text-sm font-normal text-white/60">kg CO₂</span>
                    </p>
                  </div>
                  <span className="rounded-full border border-[#A7F3D0]/20 bg-[#A7F3D0]/10 px-2 py-1 text-[10px] font-semibold text-[#A7F3D0]">
                    Live
                  </span>
                </div>
                <div className="mb-2 flex items-center justify-between text-xs text-white/65">
                  <span>{activityCount} {activityCount === 1 ? 'activity' : 'activities'} logged</span>
                  <span>{targetProgress.toFixed(0)}% of goal</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/15">
                  <div className="h-full rounded-full bg-[#34D399] transition-all duration-700" style={{ width: `${targetProgress}%` }} />
                </div>
                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="text-white/55">{remaining.toFixed(1)} kg remaining</span>
                  <Link href="/analytics" className="inline-flex items-center gap-1 font-semibold text-[#A7F3D0] hover:text-white">
                    See breakdown <ArrowUpRight size={13} />
                  </Link>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
