import { useEffect, useRef, useState } from 'react';
import { ArrowRight, X } from 'lucide-react';

export interface GuidedTourStep {
  tab: string;
  title: string;
  desc: string;
}

interface GuidedTourProps {
  steps: GuidedTourStep[];
  activeStep: number | null;
  onPrevious: () => void;
  onNext: () => void;
  onSkip: () => void;
  onNeverShowAgain: () => void;
}

export default function GuidedTour({ steps, activeStep, onPrevious, onNext, onSkip, onNeverShowAgain }: GuidedTourProps) {
  const panelRef = useRef<HTMLElement>(null);
  const onNextRef = useRef(onNext);
  const onSkipRef = useRef(onSkip);
  onNextRef.current = onNext;
  onSkipRef.current = onSkip;
  const [position, setPosition] = useState({ left: 16, top: 16 });
  const step = activeStep === null ? undefined : steps[activeStep];
  const compact = typeof window !== 'undefined' && window.innerWidth < 768;

  useEffect(() => {
    if (!step) return;
    const target = document.getElementById(`tour-target-page-${step.tab}`);
    if (!target) {
      onNextRef.current();
      return;
    }

    const oldOutline = target.style.outline;
    const oldOutlineOffset = target.style.outlineOffset;
    const oldBorderRadius = target.style.borderRadius;
    target.style.outline = '3px solid #2dd4bf';
    target.style.outlineOffset = '3px';
    target.style.borderRadius = '1rem';
    target.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });

    const updatePosition = () => {
      if (window.innerWidth < 768) return;
      const rect = target.getBoundingClientRect();
      const panelWidth = Math.min(360, window.innerWidth - 32);
      const panelHeight = panelRef.current?.offsetHeight || 220;
      const left = Math.max(16, Math.min(rect.right - panelWidth, window.innerWidth - panelWidth - 16));
      const below = rect.bottom + 12;
      const top = below + panelHeight < window.innerHeight - 16 ? below : Math.max(16, rect.top - panelHeight - 12);
      setPosition({ left, top });
    };
    const frame = requestAnimationFrame(updatePosition);
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    panelRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onSkipRef.current();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
      document.removeEventListener('keydown', onKeyDown);
      target.style.outline = oldOutline;
      target.style.outlineOffset = oldOutlineOffset;
      target.style.borderRadius = oldBorderRadius;
    };
  }, [step?.tab, step?.title, step?.desc, activeStep]);

  if (!step || activeStep === null) return null;
  const isLast = activeStep === steps.length - 1;

  return (
    <section
      ref={panelRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="false"
      aria-labelledby="guided-tour-title"
      aria-describedby="guided-tour-description"
      data-testid="guided-tour-panel"
      dir="rtl"
      className={`fixed z-[1000] w-[min(22.5rem,calc(100vw-2rem))] max-h-[45dvh] overflow-y-auto rounded-2xl border border-teal-400/70 bg-slate-950/95 p-4 text-right text-slate-100 shadow-2xl shadow-slate-950/40 backdrop-blur-md outline-none ${compact ? 'bottom-3 left-3 right-3 w-auto' : ''}`}
      style={compact ? { paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' } : position}
    >
      <header className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <p className="text-[11px] font-bold text-teal-300">راهنمای داخل برنامه · {activeStep + 1} از {steps.length}</p>
          <h2 id="guided-tour-title" className="mt-1 text-sm font-black">{step.title}</h2>
        </div>
        <button type="button" aria-label="بستن راهنما" onClick={onSkip} className="grid min-h-10 min-w-10 place-items-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white">
          <X className="h-4 w-4" />
        </button>
      </header>
      <p id="guided-tour-description" className="mt-3 text-xs leading-6 text-slate-300">{step.desc}</p>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <button type="button" onClick={onNeverShowAgain} className="min-h-10 text-[11px] font-bold text-slate-400 underline underline-offset-4 hover:text-slate-200">دیگر نمایش داده نشود</button>
        <div className="flex items-center gap-2">
          {activeStep > 0 && <button type="button" onClick={onPrevious} className="min-h-10 rounded-lg border border-slate-700 px-3 text-xs font-bold text-slate-200 hover:bg-slate-800">قبلی</button>}
          <button type="button" onClick={onNext} className="flex min-h-10 items-center gap-1.5 rounded-lg bg-teal-400 px-4 text-xs font-black text-slate-950 hover:bg-teal-300">
            {isLast ? 'پایان' : 'بعدی'}{!isLast && <ArrowRight className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>
      <button type="button" onClick={onSkip} className="mt-2 min-h-9 text-[11px] font-bold text-slate-500 hover:text-slate-300">رد کردن این راهنما</button>
    </section>
  );
}
