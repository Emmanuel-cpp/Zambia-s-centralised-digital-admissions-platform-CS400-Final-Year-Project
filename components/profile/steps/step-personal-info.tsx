'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import {
  profileSchema, PROVINCES, type ProfileValues,
} from '@/lib/schemas/profile';
import type { UserProfile } from '@/types/domain';

interface Props {
  profile: UserProfile;
  onNext: (values: ProfileValues) => void;
}

export function StepPersonalInfo({ profile, onNext }: Props) {
  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName:   profile.firstName,
      lastName:    profile.lastName,
      email:       profile.email,
      phone:       profile.phone,
      nrc:         profile.nrc,
      dateOfBirth: profile.dateOfBirth,
      province:    profile.province as ProfileValues['province'],
    },
  });

  return (
    <div>
      <header className="mb-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-brand-600 mb-1.5">
          Step 1 of 3
        </p>
        <h2 className="font-display text-display-sm text-ink">Personal information</h2>
        <p className="mt-1.5 text-sm text-ink-50">
          This information will be attached to every application you submit.
        </p>
      </header>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onNext)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField control={form.control} name="firstName" render={({ field }) => (
              <FormItem>
                <FormLabel>First name</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="lastName" render={({ field }) => (
              <FormItem>
                <FormLabel>Last name</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>

          <FormField control={form.control} name="email" render={({ field }) => (
            <FormItem>
              <FormLabel>Email address</FormLabel>
              <FormControl><Input type="email" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField control={form.control} name="phone" render={({ field }) => (
              <FormItem>
                <FormLabel>Phone number</FormLabel>
                <FormControl><Input placeholder="+260 97X XXX XXX" {...field} /></FormControl>
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
          </div>

          <FormField control={form.control} name="dateOfBirth" render={({ field }) => (
            <FormItem>
              <FormLabel>Date of birth</FormLabel>
              <FormControl><Input type="date" {...field} /></FormControl>
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

          <div className="pt-2">
            <Button type="submit" size="lg" className="w-full">
              Continue
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
