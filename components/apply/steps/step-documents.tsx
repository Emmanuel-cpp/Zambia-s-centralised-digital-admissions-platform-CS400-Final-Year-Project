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

const MAX = 3000;

export function StepStatement({ draft, onSubmit, onBack }: StepStatementProps) {
  const form = useForm<PersonalStatement>({
    resolver: zodResolver(personalStatementSchema),
    defaultValues: { statement: draft ?? '' },
  });

  const value = form.watch('statement') ?? '';
  const charCount = value.length;
  const tooLong = charCount > MAX;

  return (
    <div>
      <header className="mb-7">
        <p className="eyebrow mb-2">Step 2 of 3</p>
        <h1 className="font-display text-display-sm sm:text-display-md text-ink">
          Personal statement <span className="text-ink-50 font-normal text-base">(optional)</span>
        </h1>
        <p className="mt-2 text-base text-ink-50 leading-relaxed">
          If you&apos;d like to, tell the admissions committee why this programme is a good fit
          for you. This is completely optional — it won&apos;t affect your chances of being selected.
          You can skip this step.
        </p>
      </header>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(values => onSubmit(values.statement ?? ''))}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="statement"
            render={({ field }) => (
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
                    tooLong ? 'text-danger' : 'text-ink-50',
                  )}>
                    {charCount} / {MAX} characters
                  </p>
                </div>
              </FormItem>
            )}
          />

          <StepFooter
            onBack={onBack}
            primaryType="submit"
            primaryLabel={charCount === 0 ? 'Skip and continue' : 'Continue'}
          />
        </form>
      </Form>
    </div>
  );
}