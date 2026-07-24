'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/routes';
import { loginSchema, type LoginValues } from '@/lib/schemas/auth';
import { api } from '@/lib/api';
import { saveAuth, type AuthUser } from '@/lib/auth';

export function LoginForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  async function onSubmit(values: LoginValues) {
    setServerError(null);

    try {
      const response = await api.post<{ user: AuthUser; token: string }>(
        '/login',
        {
          email:    values.email,
          password: values.password,
        },
      );

      // Persist token and user to localStorage
      saveAuth(response.token, response.user);

      const user = response.user;

      // Forced password change comes before everything else
      if (user.must_change_password) {
        router.push(ROUTES.changePassword);
      } else if (user.role === 'platform_admin') {
        router.push(ROUTES.platformDashboard);
      } else if (user.role === 'institution_admin') {
        router.push(ROUTES.institutionDashboard);
      } else if (!user.profile_complete) {
        router.push(ROUTES.welcome);
      } else {
        router.push(ROUTES.dashboard);
      }

    } catch (error: any) {
      setServerError(
        error.message || 'Invalid email or password. Please try again.',
      );
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email address</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Password</FormLabel>
                <Link
                  href="#"
                  className="text-xs text-brand-600 hover:underline font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Server-side error message */}
        {serverError && (
          <div className="rounded-md bg-danger-soft border border-danger/20 px-4 py-3">
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
              Signing in…
            </>
          ) : (
            'Sign in'
          )}
        </Button>
      </form>
    </Form>
  );
}