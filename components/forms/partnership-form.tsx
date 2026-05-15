'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, Loader2, Send } from 'lucide-react';
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  partnershipInquirySchema, STUDENT_VOLUME_OPTIONS,
  type PartnershipInquiry,
} from '@/lib/schemas/partnership';

export function PartnershipForm() {
  const [submitted, setSubmitted] = React.useState(false);

  const form = useForm<PartnershipInquiry>({
    resolver: zodResolver(partnershipInquirySchema),
    defaultValues: {
      fullName: '', workEmail: '', jobTitle: '', institutionName: '',
      phone: '', message: '',
      studentVolume: undefined as unknown as PartnershipInquiry['studentVolume'],
    },
  });

  async function onSubmit(values: PartnershipInquiry) {
    // Mock submit — when backend is ready, POST to /api/partnerships
    console.log('partnership inquiry', values);
    await new Promise(r => setTimeout(r, 900));
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-success/20 bg-success-soft p-8 text-center">
        <div className="grid place-items-center size-14 rounded-full bg-success text-white mx-auto mb-4">
          <CheckCircle2 className="size-7" />
        </div>
        <h3 className="font-display text-display-sm text-ink mb-2">
          Inquiry sent
        </h3>
        <p className="text-base text-ink-70 max-w-sm mx-auto leading-relaxed">
          Thanks for reaching out. A member of our partnerships team will get back to you within
          two working days.
        </p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField control={form.control} name="fullName" render={({ field }) => (
            <FormItem>
              <FormLabel>Full name</FormLabel>
              <FormControl><Input placeholder="Dr. Joyce Mwila" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="jobTitle" render={({ field }) => (
            <FormItem>
              <FormLabel>Job title</FormLabel>
              <FormControl><Input placeholder="Director of Admissions" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <FormField control={form.control} name="institutionName" render={({ field }) => (
          <FormItem>
            <FormLabel>Institution</FormLabel>
            <FormControl><Input placeholder="University of …" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField control={form.control} name="workEmail" render={({ field }) => (
            <FormItem>
              <FormLabel>Work email</FormLabel>
              <FormControl><Input type="email" placeholder="you@institution.ac.zm" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="phone" render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl><Input placeholder="+260 …" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <FormField control={form.control} name="studentVolume" render={({ field }) => (
          <FormItem>
            <FormLabel>Estimated annual applicant volume</FormLabel>
            <FormControl>
              <select
                {...field}
                className="flex h-10 w-full rounded-md border border-input bg-surface-subtle px-3 py-2 text-sm focus-visible:outline-none focus-visible:border-brand-600 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-brand-600/10"
              >
                <option value="" disabled>Select…</option>
                {STUDENT_VOLUME_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </FormControl>
            <FormDescription>Helps us tailor our response. Rough estimates are fine.</FormDescription>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="message" render={({ field }) => (
          <FormItem>
            <FormLabel>Tell us about your admissions process</FormLabel>
            <FormControl>
              <textarea
                {...field}
                rows={5}
                placeholder="What does your current intake process look like? Anything specific you're hoping ZamAdmit can solve?"
                className="w-full rounded-md border border-input bg-surface-subtle px-3 py-2 text-sm text-ink leading-relaxed resize-y min-h-[120px] placeholder:text-ink-30 focus-visible:outline-none focus-visible:border-brand-600 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-brand-600/10"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <Button type="submit" size="lg" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Sending…
            </>
          ) : (
            <>
              <Send className="size-4" />
              Request a partnership
            </>
          )}
        </Button>

        <p className="text-xs text-ink-50 text-center">
          We respond within two working days. Your details stay private.
        </p>
      </form>
    </Form>
  );
}
