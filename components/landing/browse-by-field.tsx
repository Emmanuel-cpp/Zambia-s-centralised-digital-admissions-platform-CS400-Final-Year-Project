import Link from 'next/link';
import {
  Cpu, Stethoscope, Briefcase, GraduationCap, Scale,
  Wheat, Wrench, Palette, ArrowRight,
} from 'lucide-react';
import { SectionHeader } from './section-header';
import { ROUTES } from '@/lib/routes';

interface Field {
  name: string;
  programmes: number;
  icon: React.ComponentType<{ className?: string }>;
  /** Tailwind gradient classes for the icon tile */
  accent: string;
}

const FIELDS: Field[] = [
  { name: 'Engineering',    programmes: 64, icon: Wrench,      accent: 'from-amber-500 to-orange-600' },
  { name: 'Information Technology', programmes: 42, icon: Cpu,         accent: 'from-brand-500 to-brand-700' },
  { name: 'Health Sciences',programmes: 38, icon: Stethoscope, accent: 'from-rose-500 to-rose-700' },
  { name: 'Business',       programmes: 71, icon: Briefcase,   accent: 'from-blue-600 to-blue-800' },
  { name: 'Education',      programmes: 29, icon: GraduationCap, accent: 'from-violet-500 to-purple-700' },
  { name: 'Law',            programmes: 12, icon: Scale,       accent: 'from-slate-600 to-slate-800' },
  { name: 'Agriculture',    programmes: 23, icon: Wheat,       accent: 'from-lime-500 to-green-700' },
  { name: 'Arts & Humanities', programmes: 35, icon: Palette,  accent: 'from-pink-500 to-fuchsia-700' },
];

export function BrowseByField() {
  return (
    <section className="py-20 lg:py-24 bg-white">
      <div className="container">
        <SectionHeader
          eyebrow="Discover what fits you"
          title="Browse by field of study"
          description="Not sure which institution? Start with what interests you. Every field below is offered across multiple Zambian universities."
        />

        <div className="grid gap-4 sm:gap-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {FIELDS.map(field => {
            const Icon = field.icon;
            return (
              <Link
                key={field.name}
                href={ROUTES.programmes}
                className="group relative overflow-hidden rounded-xl border border-border bg-white p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-elevate hover:border-brand-200"
              >
                {/* Decorative gradient blob */}
                <div
                  aria-hidden
                  className={`absolute -bottom-12 -right-12 size-32 rounded-full bg-gradient-to-br ${field.accent} opacity-10 group-hover:opacity-20 transition-opacity duration-300 blur-xl`}
                />

                <div className="relative">
                  <div
                    className={`grid place-items-center size-11 rounded-lg bg-gradient-to-br ${field.accent} text-white shadow-soft mb-4`}
                  >
                    <Icon className="size-5" />
                  </div>

                  <h3 className="font-display text-lg text-ink leading-tight">
                    {field.name}
                  </h3>
                  <p className="mt-1 text-xs text-ink-50">
                    {field.programmes} programmes
                  </p>

                  <div className="mt-4 flex items-center gap-1 text-xs font-bold text-brand-700 opacity-0 group-hover:opacity-100 transition-opacity">
                    Explore
                    <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
