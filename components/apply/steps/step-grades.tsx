'use client';

import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2 } from 'lucide-react';
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { StepFooter } from '../apply-wizard';
import { gradesSchema, type Grades } from '@/lib/schemas/application';
import type { Programme } from '@/types/domain';

interface StepGradesProps {
  programme: Programme;
  draft: Grades | undefined;
  onSubmit: (values: Grades) => void;
  onBack: () => void;
}

export function StepGrades({ programme, draft, onSubmit, onBack }: StepGradesProps) {
  // Pre-fill rows: drafted rows OR one row per required subject
  const initialRows = draft?.rows ?? programme.minRequirements.map(req => ({
    subject: req.subject,
    grade: req.minGrade,
  }));

  const form = useForm<Grades>({
    resolver: zodResolver(gradesSchema),
    defaultValues: { rows: initialRows },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'rows',
  });

  return (
    <div>
      <header className="mb-7">
        <p className="eyebrow mb-2">Step 3 of 6</p>
        <h1 className="font-display text-display-sm sm:text-display-md text-ink">
          Grade 12 ECZ results
        </h1>
        <p className="mt-2 text-base text-ink-50 leading-relaxed">
          Enter your subject grades on the ECZ scale (1 = distinction, 9 = failing).
          The minimum grades required for this programme are pre-filled — adjust them to
          match your actual results.
        </p>
      </header>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <div className="rounded-lg border border-border overflow-hidden">
            <div className="grid grid-cols-[1fr_100px_44px] gap-3 px-4 py-3 bg-surface-subtle border-b border-border">
              <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-50">Subject</p>
              <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-50">Grade</p>
              <span />
            </div>

            {fields.map((row, index) => (
              <div key={row.id} className="grid grid-cols-[1fr_100px_44px] gap-3 px-4 py-3 border-b border-border last:border-b-0 items-start">
                <FormField control={form.control} name={`rows.${index}.subject`} render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">Subject</FormLabel>
                    <FormControl><Input placeholder="e.g. Biology" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name={`rows.${index}.grade`} render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">Grade</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={9}
                        {...field}
                        onChange={e => field.onChange(e.target.valueAsNumber)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                  aria-label={`Remove ${form.getValues(`rows.${index}.subject`)}`}
                  className="text-ink-30 hover:text-danger"
                  disabled={fields.length === 1}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => append({ subject: '', grade: 5 })}
          >
            <Plus className="size-4" />
            Add subject
          </Button>

          <StepFooter onBack={onBack} primaryType="submit" />
        </form>
      </Form>
    </div>
  );
}
