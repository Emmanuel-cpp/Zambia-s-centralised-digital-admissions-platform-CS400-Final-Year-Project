import Link from 'next/link';
import { AuthShell } from '@/components/layout/auth-shell';
import { LoginForm } from '@/components/forms/login-form';
import { ROUTES } from '@/lib/routes';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign in',
  description: 'Sign in to your ZamAdmit account to track applications and discover programmes.',
};

export default function LoginPage() {
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to your ZamAdmit account."
      footer={
        <>
          New to ZamAdmit?{' '}
          <Link href={ROUTES.register} className="text-brand-600 font-semibold hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthShell>
  );
}