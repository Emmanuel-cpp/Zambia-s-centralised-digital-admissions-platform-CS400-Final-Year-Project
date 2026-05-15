'use client';

import { GraduationCap, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Programme, Institution } from '@/types/domain';
import { formatDate } from '@/lib/format';

interface StepConfirmProps {
  programme: Programme;
  institution: Institution;
  onContinue: () => void;
}

export function StepConfirm({ programme, institution, onContinue }: StepConfirmProps) {
  return (
    <div>
      <header className="mb-7">
        <p className="eyebrow mb-2">Step 1 of 6</p>
        <h1 className="font-display text-display-sm sm:text-display-md text-ink">
          Confirm your application
        </h1>
        <p className="mt-2 text-base text-ink-50 leading-relaxed">
          Review the programme below. Once you continue, your draft is saved and you can return to it any time.
        </p>
      </header>

      {/* Programme summary */}
      <div className="rounded-xl border border-border bg-white p-6 sm:p-7">
        <div className="flex items-start gap-4">
          <div className="grid place-items-center size-12 rounded-lg bg-brand-50 text-brand-600 shrink-0">
            <GraduationCap className="size-6" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-brand-700 mb-1">
              {programme.qualification}
            </p>
            <h2 className="font-display text-xl text-ink leading-tight">
              {programme.name}
            </h2>
            <p className="mt-1 text-sm text-ink-50">
              {institution.name} · {institution.city}
            </p>
          </div>
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-y-3 gap-x-6 pt-6 border-t border-border">
          <Row label="Faculty"  value={programme.faculty} />
          <Row label="Duration" value={`${programme.durationYears} years`} />
          <Row label="Mode"     value={programme.studyMode} />
          <Row label="Intake"   value={programme.intake} />
        </dl>
      </div>

      {/* Heads-up notice */}
      <div className="mt-5 rounded-lg border border-warning/30 bg-warning-soft p-4 flex items-start gap-3">
        <AlertCircle className="size-5 text-warning shrink-0 mt-0.5" />
        <div className="text-sm text-ink-70 leading-relaxed">
          <strong className="text-ink">Application closes {formatDate(institution.applicationDeadline)}.</strong>{' '}
          Make sure you have your NRC, ECZ certificate, and a passport photo ready before submitting.
        </div>
      </div>

      <div className="flex justify-end mt-8 pt-6 border-t border-border">
        <Button onClick={onContinue}>
          Start application
          <Check className="size-4" />
        </Button>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-50">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium text-ink">{value}</dd>
    </div>
  );
}
