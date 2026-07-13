'use client';

import * as React from 'react';
import { Plus, Trash2, ArrowRight, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { GradeRequirement } from '@/types/domain';

interface Props {
  grades: GradeRequirement[];
  onNext: (grades: GradeRequirement[]) => void;
  onBack: () => void;
}

export function StepGrades({ grades: initial, onNext, onBack }: Props) {
  const [grades, setGrades] = React.useState<GradeRequirement[]>(
    initial.length > 0
      ? initial
      : [{ subject: '', minGrade: 5 }],
  );
  const [error, setError] = React.useState('');

  function addRow() {
    setGrades(g => [...g, { subject: '', minGrade: 5 }]);
  }

  function removeRow(i: number) {
    setGrades(g => g.filter((_, idx) => idx !== i));
  }

  function updateRow(i: number, patch: Partial<GradeRequirement>) {
    setGrades(g => g.map((row, idx) => idx === i ? { ...row, ...patch } : row));
  }

  function handleNext() {
    const valid = grades.filter(g => g.subject.trim() !== '');
    if (valid.length === 0) {
      setError('Add at least one subject and grade.');
      return;
    }
    onNext(valid);
  }

  return (
    <div>
      <header className="mb-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-brand-600 mb-1.5">
          Step 2 of 3
        </p>
        <h2 className="font-display text-display-sm text-ink">Grade 12 ECZ results</h2>
        <p className="mt-1.5 text-sm text-ink-50">
          Enter your subjects and grades. ECZ scale: 1 = distinction, 9 = failing.
          Lower is better.
        </p>
      </header>

      <div className="rounded-lg border border-border overflow-hidden mb-3">
        <div className="grid grid-cols-[1fr_100px_44px] gap-3 px-4 py-3 bg-surface-subtle border-b border-border">
          <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-50">Subject</p>
          <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-50">Grade</p>
          <span />
        </div>

        {grades.map((row, i) => (
          <div
            key={i}
            className="grid grid-cols-[1fr_100px_44px] gap-3 px-4 py-3 border-b border-border last:border-b-0 items-center"
          >
            <Input
              value={row.subject}
              onChange={e => updateRow(i, { subject: e.target.value })}
              placeholder="e.g. Mathematics"
            />
            <Input
              type="number"
              min={1}
              max={9}
              value={row.minGrade}
              onChange={e => updateRow(i, { minGrade: Number(e.target.value) })}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeRow(i)}
              disabled={grades.length === 1}
              className="text-ink-30 hover:text-danger"
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
      </div>

      <Button type="button" variant="outline" size="sm" onClick={addRow} className="mb-5">
        <Plus className="size-4" />
        Add subject
      </Button>

      {error && <p className="text-sm text-danger mb-4">{error}</p>}

      <div className="flex gap-3">
        <Button type="button" variant="outline" size="lg" onClick={onBack} className="flex-1">
          <ArrowLeft className="size-4" />
          Back
        </Button>
        <Button type="button" size="lg" onClick={handleNext} className="flex-1">
          Continue
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
