import type { Metadata } from 'next';
import {
  Check, Users, Clock, BarChart3, ShieldCheck,
  Mail, Phone, MapPin,
} from 'lucide-react';
import { institutions } from '@/lib/mock-data';
import { PartnershipForm } from '@/components/forms/partnership-form';

export const metadata: Metadata = {
  title: 'For institutions',
  description: 'Partner with ZamAdmit to digitise your admissions process. Reach more qualified applicants and reduce administrative burden.',
};

const BENEFITS = [
  {
    icon: Users,
    title: 'Reach more qualified applicants',
    desc: 'Tap into the entire ZamAdmit applicant pool. Recommendations match students to programmes they actually qualify for, reducing review noise.',
  },
  {
    icon: Clock,
    title: 'Cut admissions admin by 60%',
    desc: 'Centralised dashboard, automated document routing, and one-click decisions. Your team focuses on judgement, not paperwork.',
  },
  {
    icon: BarChart3,
    title: 'Real-time intake analytics',
    desc: 'Track applications by programme, see where applicants drop off, and forecast intake numbers — all in one place.',
  },
  {
    icon: ShieldCheck,
    title: 'Built for the Zambian context',
    desc: 'ECZ grade integration, NRC validation, and compliance with Zambian higher education regulations from day one.',
  },
] as const;

const ONBOARDING_STEPS = [
  {
    num: 1,
    title: 'Initial conversation',
    desc: 'A 30-minute discovery call so we understand your intake cycle, programmes, and current pain points.',
  },
  {
    num: 2,
    title: 'Partnership agreement',
    desc: 'A simple MoU outlining the partnership terms. No setup fees, no per-applicant charges for the launch cycle.',
  },
  {
    num: 3,
    title: 'Account provisioning',
    desc: 'We set up your institution account, programmes, and admin users. You receive secure login credentials by email.',
  },
  {
    num: 4,
    title: 'Go live',
    desc: 'Your institution appears on ZamAdmit and starts receiving applications. Our team is on hand throughout your first cycle.',
  },
] as const;

export default function ForInstitutionsPage() {
  // Show first 5 institutions as "current partners"
  const partners = institutions.slice(0, 5);

  return (
    <div className="bg-surface min-h-screen">
      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-800 via-brand-700 to-brand-600 text-white pt-24 lg:pt-28">
        <div aria-hidden className="absolute -top-32 -right-32 size-96 rounded-full bg-white/[0.04] blur-3xl" />
        <div aria-hidden className="absolute bottom-0 left-1/4 size-72 rounded-full bg-brand-300/10 blur-3xl" />

        <div className="container relative py-14 lg:py-20 grid lg:grid-cols-[1.2fr_1fr] gap-12 items-center">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-3.5 py-1.5 text-xs font-semibold text-white">
              <span className="size-1.5 rounded-full bg-brand-300" />
              For higher learning institutions
            </span>

            <h1 className="mt-5 font-display text-display-md sm:text-display-lg lg:text-display-xl text-white leading-[1.05] tracking-tight">
              Modern admissions, built for{' '}
              <span className="text-brand-300 italic">Zambian institutions</span>.
            </h1>

            <p className="mt-5 text-base sm:text-lg text-white/80 leading-relaxed max-w-xl">
              Reach more qualified applicants, reduce administrative burden, and run your entire intake
              cycle from one digital dashboard. Partner with ZamAdmit to bring your admissions online.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm text-white/85">
              <span className="inline-flex items-center gap-2">
                <Check className="size-4 text-brand-300" strokeWidth={3} />
                No setup fees
              </span>
              <span className="inline-flex items-center gap-2">
                <Check className="size-4 text-brand-300" strokeWidth={3} />
                Onboarding in 2 weeks
              </span>
              <span className="inline-flex items-center gap-2">
                <Check className="size-4 text-brand-300" strokeWidth={3} />
                Dedicated support
              </span>
            </div>
          </div>

          {/* Partner logos / institution names */}
          <div className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-white/55 mb-4">
              Partnering with leading institutions
            </p>
            <div className="grid grid-cols-2 gap-3">
              {partners.map(inst => (
                <div
                  key={inst.id}
                  className="flex items-center gap-2.5 rounded-lg bg-white/5 border border-white/10 px-3 py-2.5"
                >
                  <span className="grid place-items-center size-8 rounded-md bg-white/10 text-brand-300 font-display text-xs shrink-0">
                    {inst.shortName.slice(0, 2)}
                  </span>
                  <span className="text-xs font-semibold text-white/85 truncate">
                    {inst.shortName}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Benefits ─── */}
      <section className="container py-20 lg:py-24">
        <div className="max-w-2xl mb-12">
          <p className="eyebrow mb-3">Why partner with us</p>
          <h2 className="font-display text-display-md text-ink leading-tight">
            Everything you need to run a modern admissions cycle.
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          {BENEFITS.map(benefit => {
            const Icon = benefit.icon;
            return (
              <div
                key={benefit.title}
                className="rounded-xl border border-border bg-white p-6 sm:p-7"
              >
                <div className="grid place-items-center size-11 rounded-lg bg-brand-50 text-brand-600 mb-4">
                  <Icon className="size-5" />
                </div>
                <h3 className="font-display text-xl text-ink mb-2 leading-tight">
                  {benefit.title}
                </h3>
                <p className="text-base text-ink-50 leading-relaxed">
                  {benefit.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── Onboarding process ─── */}
      <section className="bg-surface-subtle py-20 lg:py-24 border-y border-border">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <p className="eyebrow mb-3">What partnership looks like</p>
            <h2 className="font-display text-display-md text-ink leading-tight">
              From first call to live in two weeks.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {ONBOARDING_STEPS.map(step => (
              <div
                key={step.num}
                className="rounded-xl bg-white border border-border p-6"
              >
                <div className="grid place-items-center size-11 rounded-lg bg-brand-600 font-display text-lg text-white mb-4">
                  {step.num}
                </div>
                <h3 className="font-display text-base text-ink mb-1.5 leading-tight">
                  {step.title}
                </h3>
                <p className="text-sm text-ink-50 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Contact form + sidebar ─── */}
      <section className="container py-20 lg:py-24">
        <div className="grid lg:grid-cols-[1fr_360px] gap-10 lg:gap-14 items-start">
          {/* Form */}
          <div className="order-2 lg:order-1">
            <p className="eyebrow mb-3">Get in touch</p>
            <h2 className="font-display text-display-md text-ink leading-tight mb-3">
              Tell us about your institution.
            </h2>
            <p className="text-base text-ink-50 mb-8 max-w-xl">
              Fill in the form and a member of our partnerships team will reach out within
              two working days.
            </p>

            <PartnershipForm />
          </div>

          {/* Contact info sidebar */}
          <aside className="order-1 lg:order-2 lg:sticky lg:top-24 self-start">
            <div className="rounded-xl bg-ink text-white p-7">
              <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-white/55 mb-4">
                Or reach us directly
              </p>

              <div className="space-y-5">
                <ContactItem
                  icon={<Mail className="size-4" />}
                  label="Email"
                  value="partnerships@zamadmit.ac.zm"
                  href="mailto:partnerships@zamadmit.ac.zm"
                />
                <ContactItem
                  icon={<Phone className="size-4" />}
                  label="Phone"
                  value="+260 211 222 333"
                  href="tel:+260211222333"
                />
                <ContactItem
                  icon={<MapPin className="size-4" />}
                  label="Office"
                  value="Copperbelt University, Kitwe"
                />
              </div>

              <div className="mt-7 pt-6 border-t border-white/10">
                <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-white/55 mb-2">
                  Office hours
                </p>
                <p className="text-sm text-white/85 leading-relaxed">
                  Monday – Friday<br />
                  08:00 – 17:00 CAT
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

function ContactItem({
  icon, label, value, href,
}: { icon: React.ReactNode; label: string; value: string; href?: string }) {
  const Wrapper: React.ElementType = href ? 'a' : 'div';
  const props = href ? { href } : {};
  return (
    <Wrapper {...props} className="flex items-start gap-3 group">
      <div className="grid place-items-center size-9 rounded-md bg-white/10 text-brand-300 shrink-0 group-hover:bg-brand-600 group-hover:text-white transition-colors">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold text-white/45 uppercase tracking-[0.06em]">{label}</p>
        <p className="text-sm font-medium text-white truncate">{value}</p>
      </div>
    </Wrapper>
  );
}
