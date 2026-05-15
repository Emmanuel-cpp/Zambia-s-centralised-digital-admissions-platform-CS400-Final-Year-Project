import Link from 'next/link';
import { Logo } from './logo';
import { ROUTES } from '@/lib/routes';

const FOOTER_COLUMNS = [
  {
    title: 'Students',
    links: [
      { label: 'Create account',       href: ROUTES.register },
      { label: 'Browse institutions',  href: ROUTES.institutions },
      { label: 'Browse programmes',    href: ROUTES.programmes },
      { label: 'How it works',         href: '/#how-it-works' },
      { label: 'FAQs',                 href: '/#faq' },
    ],
  },
  {
    title: 'Institutions',
    links: [
      { label: 'Partner with us',     href: ROUTES.forInstitutions },
      { label: 'Why ZamAdmit',        href: ROUTES.forInstitutions + '#benefits' },
      { label: 'Onboarding process',  href: ROUTES.forInstitutions + '#onboarding' },
      { label: 'Contact partnerships', href: ROUTES.forInstitutions + '#contact' },
    ],
  },
  {
    title: 'Platform',
    links: [
      { label: 'About ZamAdmit',  href: '#' },
      { label: 'Privacy policy',  href: '#' },
      { label: 'Terms of service',href: '#' },
      { label: 'Contact us',      href: ROUTES.forInstitutions },
    ],
  },
] as const;

export function PublicFooter() {
  return (
    <footer className="bg-ink text-white/70">
      <div className="container py-14 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          {/* Brand column */}
          <div>
            <Logo variant="light" />
            <p className="mt-4 text-sm leading-relaxed max-w-[260px] text-white/55">
              Zambia&apos;s centralised digital admissions platform for higher learning institutions.
            </p>
          </div>

          {/* Link columns */}
          {FOOTER_COLUMNS.map(col => (
            <div key={col.title}>
              <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-white/40 mb-4">
                {col.title}
              </h3>
              <ul className="space-y-2.5">
                {col.links.map(link => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/55 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom strip */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-white/35">
          <span>© 2025 ZamAdmit. A CBU CS400 academic project.</span>
          <div className="flex items-center gap-4">
            {/* Discreet admin sign-in — not promoted, but accessible */}
            <Link
              href={ROUTES.institutionDashboard}
              className="hover:text-white/70 transition-colors"
              title="Institution administrator sign in"
            >
              Admin sign in
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
