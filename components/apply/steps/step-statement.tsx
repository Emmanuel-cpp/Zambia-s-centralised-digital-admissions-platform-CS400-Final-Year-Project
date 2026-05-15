'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form';
import { StepFooter } from '../apply-wizard';
import { personalStatementSchema, type PersonalStatement } from '@/lib/schemas/application';
import { cn } from '@/lib/utils';

interface StepStatementProps {
  draft: string | undefined;
  onSubmit: (value: string) => void;
  onBack: () => void;
}

const MIN = 150;
const MAX = 3000;

export function StepStatement({ draft, onSubmit, onBack }: StepStatementProps) {
  const form = useForm<PersonalStatement>({
    resolver: zodResolver(personalStatementSchema),
    defaultValues: { statement: draft ?? '' },
  });

  const value = form.watch('statement') ?? '';
  const charCount = value.length;
  const tooShort = charCount > 0 && charCount < MIN;
  const tooLong  = charCount > MAX;

  return (
    <div>
      <header className="mb-7">
        <p className="eyebrow mb-2">Step 4 of 6</p>
        <h1 className="font-display text-display-sm sm:text-display-md text-ink">
          Personal statement
        </h1>
        <p className="mt-2 text-base text-ink-50 leading-relaxed">
          Tell the admissions committee why this programme is the right fit for you.
          Speak about your interests, experiences, and what you hope to do after graduating.
        </p>
      </header>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(values => onSubmit(values.statement))} className="space-y-4">
          <FormField control={form.control} name="statement" render={({ field }) => (
            <FormItem>
              <FormLabel className="sr-only">Personal statement</FormLabel>
              <FormControl>
                <textarea
                  {...field}
                  rows={14}
                  placeholder="Start writing here…"
                  className={cn(
                    'w-full rounded-md border border-input bg-surface-subtle px-4 py-3 text-sm text-ink leading-relaxed resize-y min-h-[280px]',
                    'placeholder:text-ink-30',
                    'focus-visible:outline-none focus-visible:border-brand-600 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-brand-600/10',
                  )}
                />
              </FormControl>
              <div className="flex items-center justify-between gap-3 mt-1.5">
                <FormMessage />
                <p className={cn(
                  'text-xs ml-auto tabular-nums',
                  tooShort && 'text-warning',
                  tooLong && 'text-danger',
                  !tooShort && !tooLong && 'text-ink-50',
                )}>
                  {charCount} / {MAX} characters
                  {tooShort && ` · ${MIN - charCount} more needed`}
                </p>
              </div>
            </FormItem>
          )} />

          <StepFooter onBack={onBack} primaryType="submit" />
        </form>
      </Form>
    </div>
  );
}
