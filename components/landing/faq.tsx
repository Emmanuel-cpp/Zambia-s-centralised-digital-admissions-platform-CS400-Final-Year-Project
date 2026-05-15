'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const FAQS = [
  {
    q: 'Is ZamAdmit free to use for students?',
    a: 'Yes — completely free. ZamAdmit charges no application fee to students. Individual institutions may have their own admission fees payable directly to the institution, but the ZamAdmit platform itself is always free.',
  },
  {
    q: 'Which institutions are on ZamAdmit?',
    a: 'Currently 12 higher learning institutions are on the platform, including CBU, UNZA, Mulungushi University, ZAOU, and Northrise University. We are onboarding more institutions each cycle.',
  },
  {
    q: 'How does document upload work?',
    a: 'You upload each document — NRC, Grade 12 certificate, transcript, passport photo — once to your profile. When you apply to any institution, ZamAdmit automatically attaches the relevant documents.',
  },
  {
    q: 'How does the recommendation engine work?',
    a: 'Once you enter your Grade 12 ECZ subject grades and declare your academic interests, our algorithm compares your profile against the minimum requirements of every programme. Programmes where you meet or exceed requirements are ranked by alignment with your interests.',
  },
  {
    q: 'What happens after I submit an application?',
    a: 'Your application is securely transmitted to the institution. You can track the status in real time — Submitted, Under Review, Accepted, or Rejected. You will receive an email notification at each stage.',
  },
  {
    q: 'Can I apply to multiple institutions at once?',
    a: 'Yes. You can apply to as many institutions as you wish. Your core profile is reused for each application; you only personalise the statement per programme.',
  },
] as const;

function FaqItem({ q, a, defaultOpen }: { q: string; a: string; defaultOpen?: boolean }) {
  const [open, setOpen] = React.useState(!!defaultOpen);

  return (
    <div className="border-b border-border py-5">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-4 text-left text-[15px] font-semibold text-ink"
      >
        {q}
        <ChevronDown
          className={cn(
            'size-5 text-ink-50 shrink-0 transition-transform duration-200',
            open && 'rotate-180',
          )}
        />
      </button>
      {open && (
        <p className="mt-3 text-sm text-ink-50 leading-relaxed pr-8 animate-fade-in-up">
          {a}
        </p>
      )}
    </div>
  );
}

export function Faq() {
  return (
    <section id="faq" className="py-20 lg:py-24 bg-surface-subtle">
      <div className="container grid lg:grid-cols-[340px_1fr] gap-10 lg:gap-20 items-start">
        {/* Left column */}
        <div>
          <p className="eyebrow mb-3">Common questions</p>
          <h2 className="font-display text-display-md text-ink">
            Everything you need to know
          </h2>
          <p className="mt-3 text-base text-ink-50 leading-relaxed">
            Can&apos;t find your answer?{' '}
            <a href="#" className="text-brand-600 font-semibold">Contact us</a>
          </p>

          <div className="mt-7 rounded-lg bg-brand-50 p-5">
            <p className="text-sm font-semibold text-brand-700 mb-1.5">Need help?</p>
            <p className="text-sm text-ink-50 leading-relaxed">
              Our support team is available Monday–Friday, 8am–5pm CAT. Reach us at{' '}
              <strong className="text-ink">support@zamadmit.ac.zm</strong>
            </p>
          </div>
        </div>

        {/* Right column — FAQ list */}
        <div>
          {FAQS.map((faq, i) => (
            <FaqItem key={faq.q} q={faq.q} a={faq.a} defaultOpen={i === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}
