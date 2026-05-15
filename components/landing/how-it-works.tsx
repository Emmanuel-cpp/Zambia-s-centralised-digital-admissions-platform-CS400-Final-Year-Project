import { SectionHeader } from './section-header';

const STEPS = [
  {
    num: 1,
    title: 'Create your free profile',
    desc: 'Enter your personal details, NRC, and Grade 12 ECZ results once. This becomes your master application profile.',
  },
  {
    num: 2,
    title: 'Upload your documents',
    desc: 'Upload your certificates, transcript, NRC, and passport photo once. They are securely stored and reused everywhere.',
  },
  {
    num: 3,
    title: 'Discover programmes',
    desc: 'Browse open institutions or let our recommendation engine suggest programmes that match your grades and interests.',
  },
  {
    num: 4,
    title: 'Apply and track',
    desc: 'Submit to multiple institutions in minutes. Track every application — submitted, under review, or accepted — in real time.',
  },
] as const;

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 lg:py-24 bg-white">
      <div className="container">
        <SectionHeader
          eyebrow="The process"
          title="How ZamAdmit works"
          description="Modelled on the world's leading admissions platforms — simplified for the Zambian context."
        />

        <div className="relative grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {/* Connecting line (desktop only) */}
          <div
            aria-hidden
            className="hidden lg:block absolute top-[26px] left-[12%] right-[12%] h-px bg-[repeating-linear-gradient(to_right,theme(colors.brand.200)_0,theme(colors.brand.200)_8px,transparent_8px,transparent_16px)]"
          />

          {STEPS.map(step => (
            <div
              key={step.num}
              className="relative rounded-lg border border-border bg-surface-subtle p-6"
            >
              <div className="grid place-items-center size-12 rounded-xl bg-brand-600 font-display text-xl text-white mb-4">
                {step.num}
              </div>
              <h3 className="text-base font-semibold text-ink mb-1.5 font-sans">
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
  );
}
