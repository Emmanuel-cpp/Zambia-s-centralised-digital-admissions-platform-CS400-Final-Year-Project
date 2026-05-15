import type { Metadata } from 'next';
import { DM_Sans, DM_Serif_Display } from 'next/font/google';
import '@/styles/globals.css';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

const dmSerif = DM_Serif_Display({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'ZamAdmit — Zambia\'s Digital Admissions Platform',
    template: '%s · ZamAdmit',
  },
  description:
    'Apply to universities and colleges across Zambia with a single profile. ZamAdmit is the centralised admissions portal for higher learning institutions.',
  metadataBase: new URL('https://zamadmit.ac.zm'),
  openGraph: {
    title: 'ZamAdmit',
    description: 'One application. Every institution.',
    type: 'website',
    locale: 'en_ZM',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${dmSerif.variable}`}>
      <body className="min-h-screen bg-surface text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
