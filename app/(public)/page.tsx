import { LandingHero } from '@/components/landing/landing-hero';
import { HowItWorks } from '@/components/landing/how-it-works';
import { AudiencePanels } from '@/components/landing/audience-panels';
import { FeaturedInstitutions } from '@/components/landing/featured-institutions';
import { Faq } from '@/components/landing/faq';
import { CtaBanner } from '@/components/landing/cta-banner';

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
