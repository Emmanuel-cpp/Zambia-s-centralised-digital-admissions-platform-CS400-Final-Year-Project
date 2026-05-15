'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { StepFooter } from '../apply-wizard';
import {
  personalInfoSchema, PROVINCES, type PersonalInfo,
} from '@/lib/schemas/application';

interface StepPersonalProps {
  draft: PersonalInfo | undefined;
  onSubmit: (values: PersonalInfo) => void;
  onBack: () => void;
}

export function StepPersonal({ draft, onSubmit, onBack }: StepPersonalProps) {
  const form = useForm<PersonalInfo>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: draft ?? {
      firstName: '', lastName: '', dateOfBirth: '',
      nrc: '', phone: '', province: undefined as unknown as PersonalInfo['province'],
    },
  });

  return (
    <div>
      <header className="mb-7">
        <p className="eyebrow mb-2">Step 2 of 6</p>
        <h1 className="font-display text-display-sm sm:text-display-md text-ink">
          Personal information
        </h1>
        <p className="mt-2 text-base text-ink-50">
          We&apos;ll send all of this to the institution along with your application.
        </p>
      </header>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField control={form.control} name="firstName" render={({ field }) => (
              <FormItem>
                <FormLabel>First name</FormLabel>
                <FormControl><Input placeholder="Emmanuel" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="lastName" render={({ field }) => (
              <FormItem>
                <FormLabel>Last name</FormLabel>
                <FormControl><Input placeholder="Siamoonga" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>

          <FormField control={form.control} name="dateOfBirth" render={({ field }) => (
            <FormItem>
              <FormLabel>Date of birth</FormLabel>
              <FormControl><Input type="date" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="nrc" render={({ field }) => (
            <FormItem>
              <FormLabel>NRC Number</FormLabel>
              <FormControl><Input placeholder="123456/78/9" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="phone" render={({ field }) => (
            <FormItem>
              <FormLabel>Phone number</FormLabel>
              <FormControl><Input placeholder="+260 97X XXX XXX" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="province" render={({ field }) => (
            <FormItem>
              <FormLabel>Province</FormLabel>
              <FormControl>
                <select
                  {...field}
                  className="flex h-10 w-full rounded-md border border-input bg-surface-subtle px-3 py-2 text-sm focus-visible:outline-none focus-visible:border-brand-600 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-brand-600/10"
                >
                  <option value="" disabled>Select your province</option>
                  {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <StepFooter onBack={onBack} primaryType="submit" />
        </form>
      </Form>
    </div>
  );
}
