import type { Metadata } from 'next';
import { LandingHero } from '@/components/landing/landing-hero';
import { HowItWorks } from '@/components/landing/how-it-works';
import { AudiencePanels } from '@/components/landing/audience-panels';
import { FeaturedInstitutions } from '@/components/landing/featured-institutions';
import { Faq } from '@/components/landing/faq';
import { CtaBanner } from '@/components/landing/cta-banner';

export const metadata: Metadata = {
  title: 'ZamAdmit — Zambia\'s Digital Admissions Platform',
  description: 'Apply to universities and colleges across Zambia with a single profile. One application, every institution.',
};

export default function HomePage() {
  return (
    <>
      <LandingHero />
      <HowItWorks />
      <AudiencePanels />
      <FeaturedInstitutions />
      <Faq />
      <CtaBanner />
    </>
  );
}