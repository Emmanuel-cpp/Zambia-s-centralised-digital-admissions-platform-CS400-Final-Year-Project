'use client';

import * as React from 'react';
import {
  Smartphone, Loader2, AlertCircle, CheckCircle2, ShieldCheck, RotateCcw,
} from 'lucide-react';
import { api } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { cn } from '@/lib/utils';

interface PaymentDue {
  amount:             string;
  platform_fee:       string;
  institution_amount: string;
  currency:           string;
}

interface ApiPayment {
  id:        number;
  amount:    string;
  provider:  string;
  phone:     string;
  status:    'pending' | 'completed' | 'failed';
  reference: string;
}

interface StepPaymentProps {
  applicationId:   number;
  paymentDue:      PaymentDue;
  institutionName: string;
  /** Called after payment completes — parent redirects to the application */
  onPaid: () => void;
}

const PROVIDERS = [
  { value: 'mtn',    label: 'MTN MoMo',      accent: 'border-yellow-400 bg-yellow-50' },
  { value: 'airtel', label: 'Airtel Money',  accent: 'border-red-400 bg-red-50' },
  { value: 'zamtel', label: 'Zamtel Kwacha', accent: 'border-green-500 bg-green-50' },
] as const;

type Phase = 'form' | 'prompt' | 'success' | 'failed';

/**
 * Simulated mobile money payment step.
 *
 * Mirrors the real MoMo collection flow:
 *   1. form   — pick provider, enter the mobile money number
 *   2. prompt — "a payment request has been sent to your phone" (the moment
 *               a real customer receives the USSD PIN prompt)
 *   3. success / failed — the provider's verdict
 *
 * Sandbox rule: numbers ending 9999 always decline (testing the failure path).
 */
export function StepPayment({
  applicationId, paymentDue, institutionName, onPaid,
}: StepPaymentProps) {
  const [provider, setProvider] = React.useState<string>('mtn');
  const [phone, setPhone]       = React.useState('');
  const [phase, setPhase]       = React.useState<Phase>('form');
  const [busy, setBusy]         = React.useState(false);
  const [error, setError]       = React.useState<string | null>(null);
  const [payment, setPayment]   = React.useState<ApiPayment | null>(null);

  const phoneValid = /^[0-9+]{10,15}$/.test(phone.trim());

  async function handlePay() {
    setBusy(true);
    setError(null);

    try {
      const token = getToken();

      // Leg 1 — initiate the collection request
      const created = await api.post<ApiPayment>('/payments', {
        application_id: applicationId,
        provider,
        phone: phone.trim(),
      }, token ?? undefined);
      setPayment(created);

      // The customer-approves-on-handset moment
      setPhase('prompt');

      // Simulate the handset round-trip (real providers take 5–30s)
      await new Promise(r => setTimeout(r, 2800));

      // Leg 2 — the provider callback
      try {
        await api.post(`/payments/${created.id}/confirm`, {}, token ?? undefined);
        setPhase('success');
        setTimeout(onPaid, 1800); // brief celebration, then redirect
      } catch (err: any) {
        setPhase('failed');
        setError(err.message || 'Payment was declined by the provider.');
      }
    } catch (err: any) {
      setPhase('form');
      setError(err.message || 'Could not start the payment. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  function retry() {
    setPhase('form');
    setError(null);
    setPayment(null);
  }

  /* ── Phase: waiting on handset ── */
  if (phase === 'prompt') {
    return (
      <div className="rounded-xl border border-border bg-white p-8 text-center">
        <div className="relative mx-auto mb-5 size-16">
          <Smartphone className="size-16 text-brand-600" />
          <span className="absolute -top-1 -right-1 size-4 rounded-full bg-warning animate-pulse" />
        </div>
        <h2 className="font-display text-xl text-ink mb-2">Check your phone</h2>
        <p className="text-sm text-ink-50 leading-relaxed max-w-sm mx-auto">
          A payment request for <strong className="text-ink">K{paymentDue.amount}</strong> has
          been sent to <strong className="text-ink">{phone}</strong>.
          Enter your mobile money PIN to approve it.
        </p>
        <div className="flex items-center justify-center gap-2 mt-6 text-sm text-ink-50">
          <Loader2 className="size-4 animate-spin text-brand-600" />
          Waiting for approval…
        </div>
        {payment && (
          <p className="text-xs text-ink-30 mt-4 tabular-nums">Ref: {payment.reference}</p>
        )}
      </div>
    );
  }

  /* ── Phase: success ── */
  if (phase === 'success') {
    return (
      <div className="rounded-xl border border-success/30 bg-success-soft p-8 text-center">
        <CheckCircle2 className="size-12 text-success mx-auto mb-4" />
        <h2 className="font-display text-xl text-ink mb-2">Payment received</h2>
        <p className="text-sm text-ink-70 leading-relaxed">
          K{paymentDue.amount} paid. Your application has been submitted
          to {institutionName}.
        </p>
        {payment && (
          <p className="text-xs text-ink-50 mt-3 tabular-nums">Receipt ref: {payment.reference}</p>
        )}
        <div className="flex items-center justify-center gap-2 mt-5 text-xs text-ink-50">
          <Loader2 className="size-3.5 animate-spin" />
          Taking you to your application…
        </div>
      </div>
    );
  }

  /* ── Phase: failed ── */
  if (phase === 'failed') {
    return (
      <div className="rounded-xl border border-danger/30 bg-danger-soft p-8 text-center">
        <AlertCircle className="size-12 text-danger mx-auto mb-4" />
        <h2 className="font-display text-xl text-ink mb-2">Payment failed</h2>
        <p className="text-sm text-ink-70 leading-relaxed max-w-sm mx-auto">
          {error || 'The payment could not be completed.'} Your application has been
          saved as a draft — you can try again.
        </p>
        <button
          type="button"
          onClick={retry}
          className="inline-flex items-center gap-1.5 mt-5 px-5 py-2 rounded-md bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700"
        >
          <RotateCcw className="size-4" />
          Try again
        </button>
      </div>
    );
  }

  /* ── Phase: form ── */
  return (
    <div>
      <h1 className="font-display text-display-sm text-ink mb-2">Pay the application fee</h1>
      <p className="text-sm text-ink-50 leading-relaxed mb-6">
        Your application is saved. It will be submitted to {institutionName} as
        soon as the application fee is paid.
      </p>

      {/* Fee summary */}
      <div className="rounded-xl border border-border bg-white p-5 mb-6">
        <div className="flex items-baseline justify-between">
          <p className="text-sm font-semibold text-ink">Application fee</p>
          <p className="font-display text-2xl text-ink tabular-nums">
            K{paymentDue.amount}
          </p>
        </div>
        <p className="text-xs text-ink-50 mt-1">
          Paid via mobile money · {institutionName}
        </p>
      </div>

      {/* Provider picker */}
      <p className="text-sm font-semibold text-ink mb-2.5">Pay with</p>
      <div className="grid grid-cols-3 gap-2 mb-5">
        {PROVIDERS.map(p => (
          <button
            key={p.value}
            type="button"
            onClick={() => setProvider(p.value)}
            className={cn(
              'rounded-lg border-2 px-3 py-3 text-sm font-semibold text-ink transition-colors text-center',
              provider === p.value
                ? p.accent
                : 'border-border bg-white hover:border-ink-20',
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Phone */}
      <label className="block text-sm font-semibold text-ink mb-1.5" htmlFor="momo-phone">
        Mobile money number
      </label>
      <input
        id="momo-phone"
        type="tel"
        inputMode="tel"
        value={phone}
        onChange={e => setPhone(e.target.value)}
        placeholder="e.g. 0977123456"
        className="w-full h-11 rounded-md border border-input bg-surface-subtle px-3 text-sm focus-visible:outline-none focus-visible:border-brand-600 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-brand-600/10"
      />
      <p className="text-xs text-ink-50 mt-1.5">
        The payment request will be sent to this number.
      </p>

      {error && (
        <div className="mt-4 rounded-md bg-danger-soft border border-danger/20 px-3 py-2.5 flex items-start gap-2">
          <AlertCircle className="size-4 text-danger shrink-0 mt-0.5" />
          <p className="text-sm text-danger">{error}</p>
        </div>
      )}

      <button
        type="button"
        onClick={handlePay}
        disabled={!phoneValid || busy}
        className="w-full mt-6 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-md bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {busy
          ? <Loader2 className="size-4 animate-spin" />
          : <ShieldCheck className="size-4" />}
        Pay K{paymentDue.amount}
      </button>

      <p className="flex items-center justify-center gap-1.5 text-xs text-ink-30 mt-4">
        <ShieldCheck className="size-3.5" />
        Secured by ZamAdmit Pay
      </p>
    </div>
  );
}