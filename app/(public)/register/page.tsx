import Link from 'next/link';
import { AuthShell } from '@/components/layout/auth-shell';
import { RegisterForm } from '@/components/forms/register-form';
import { ROUTES } from '@/lib/routes';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create account',
  description: 'Create your free ZamAdmit profile and start applying to institutions across Zambia.',
};

export default function RegisterPage() {
  return (
    <AuthShell
      title="Create your account"
      subtitle="Free to join. Takes about five minutes."
      footer={
        <>
          Already have an account?{' '}
          <Link href={ROUTES.login} className="text-brand-600 font-semibold hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <RegisterForm />
    </AuthShell>
  );
}