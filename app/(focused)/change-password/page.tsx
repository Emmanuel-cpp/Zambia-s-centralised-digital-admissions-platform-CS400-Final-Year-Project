'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, AlertCircle, KeyRound, LogOut, ShieldAlert } from 'lucide-react';
import {
  Form, FormControl, FormField, FormItem, FormLabel,
  FormMessage, FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/layout/logo';
import { api } from '@/lib/api';
import { getToken, getAuthUser, saveAuth, clearAuth } from '@/lib/auth';
import { ROUTES, homeRouteFor } from '@/lib/routes';

const schema = z.object({
  current_password: z.string().min(1, 'Current password is required'),
  new_password:     z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Za-z]/, 'Password must contain at least one letter')
    .regex(/\d/, 'Password must contain at least one number'),
  new_password_confirmation: z.string(),
}).refine(
  (data) => data.new_password === data.new_password_confirmation,
  { message: 'Passwords do not match', path: ['new_password_confirmation'] },
);

type FormValues = z.infer<typeof schema>;


export default function ChangePasswordPage() {
  const router = useRouter();
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [authChecked, setAuthChecked] = React.useState(false);
  const [forced, setForced]           = React.useState(false);

  React.useEffect(() => {
    const user = getAuthUser();
    if (!user) {
      router.replace(ROUTES.login);
      return;
    }
    setForced(!!user.must_change_password);
    setAuthChecked(true);
  }, [router]);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      current_password: '',
      new_password: '',
      new_password_confirmation: '',
    },
  });

  async function handleSignOut() {
    try {
      const token = getToken();
      if (token) {
        await api.post('/logout', {}, token);
      }
    } catch {
      // Ignore — clear local auth regardless
    } finally {
      clearAuth();
      router.push(ROUTES.login);
    }
  }

  async function onSubmit(values: FormValues) {
    setServerError(null);

    try {
      const token = getToken();

      await api.post('/change-password', {
        current_password:          values.current_password,
        new_password:              values.new_password,
        new_password_confirmation: values.new_password_confirmation,
      }, token ?? undefined);

      // Refresh user
      const updatedUser = await api.get<any>('/user', token ?? undefined);
      const current     = getAuthUser();
      if (current && updatedUser) {
        saveAuth(token!, {
          ...current,
          must_change_password: updatedUser.must_change_password,
        });
      }

      router.push(homeRouteFor(updatedUser?.role ?? current?.role));

    } catch (err: any) {
      setServerError(err.message || 'Could not change password. Please try again.');
    }
  }

  if (!authChecked) {
    return (
      <div className="min-h-screen grid place-items-center">
        <Loader2 className="size-6 text-brand-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-subtle flex flex-col">
      {/* Top bar — fixed at top edge, full-width */}
      <header className="bg-white border-b border-border">
        <div className="container h-16 flex items-center justify-between">
          <Logo />
          <button
            type="button"
            onClick={handleSignOut}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-semibold text-danger hover:bg-danger-soft transition-colors"
          >
            <LogOut className="size-4" />
            Sign out
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center px-4 py-10">
        <div className="w-full max-w-[460px]">

          {/* Mandatory security banner */}
          {forced && (
            <div className="mb-5 rounded-xl bg-warning text-white p-4 flex items-start gap-3 shadow-soft">
              <ShieldAlert className="size-5 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-bold leading-tight">
                  Password change required
                </p>
                <p className="text-xs text-white/90 mt-1 leading-relaxed">
                  For security, you must change your temporary password before
                  accessing your account. This step cannot be skipped.
                </p>
              </div>
            </div>
          )}

          {/* Main card */}
          <div className="bg-white rounded-2xl border border-border shadow-card px-7 py-7 sm:px-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="grid place-items-center size-11 rounded-xl bg-brand-50 text-brand-600">
                <KeyRound className="size-5" />
              </div>
              <div>
                <h1 className="font-display text-xl text-ink leading-tight">
                  {forced ? 'Set a new password' : 'Change your password'}
                </h1>
                <p className="text-xs text-ink-50 mt-0.5">
                  Choose a password only you know.
                </p>
              </div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="current_password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder={forced ? 'Your temporary password' : 'Enter your current password'}
                          autoComplete="current-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="new_password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="At least 8 characters"
                          autoComplete="new-password"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Must contain at least one letter and one number.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="new_password_confirmation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm new password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Re-enter your new password"
                          autoComplete="new-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {serverError && (
                  <div className="rounded-md bg-danger-soft border border-danger/20 px-4 py-3 flex items-start gap-2.5">
                    <AlertCircle className="size-4 text-danger shrink-0 mt-0.5" />
                    <p className="text-sm text-danger font-medium">{serverError}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  size="lg"
                  className="w-full mt-2"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Updating password…
                    </>
                  ) : (
                    'Update password'
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </main>
    </div>
  );
}