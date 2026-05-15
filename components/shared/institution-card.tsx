import Link from 'next/link';
import Image from 'next/image';
import { MapPin, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ROUTES } from '@/lib/routes';
import { formatShortDate } from '@/lib/format';
import type { Institution } from '@/types/domain';
import { cn } from '@/lib/utils';

interface InstitutionCardProps {
  institution: Institution;
}

export function InstitutionCard({ institution }: InstitutionCardProps) {
  const {
    slug, name, shortName, city, province, imageUrl, brandColor,
    tags, programmeCount, applicationDeadline, isAcceptingApplications,
  } = institution;

  const hasImage = !!imageUrl;

  return (
    <Card
      className={cn(
        'group overflow-hidden transition-all duration-300 p-0',
        isAcceptingApplications
          ? 'hover:-translate-y-1 hover:shadow-elevate cursor-pointer'
          : 'opacity-70',
      )}
    >
      <Link href={ROUTES.institution(slug)} className="block">
        {/* Banner — photo if available, otherwise gradient */}
        <div
          className="relative h-44 overflow-hidden"
          style={!hasImage ? {
            background: `linear-gradient(135deg, ${brandColor}, ${shadeColor(brandColor, -25)})`,
          } : undefined}
        >
          {hasImage && (
            <Image
              src={imageUrl}
              alt={`${name} campus`}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )}

          {/* Bottom gradient — for text legibility */}
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent"
          />
          {/* Top accent stripe — only shown when there IS an image */}
          {hasImage && (
            <div
              aria-hidden
              className="absolute top-0 inset-x-0 h-1"
              style={{ background: brandColor }}
            />
          )}

          {/* Status pill (top-right) */}
          <div className="absolute top-3 right-3">
            {isAcceptingApplications ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-600 text-white text-[11px] font-bold px-2.5 py-1">
                <span className="size-1.5 rounded-full bg-brand-200 animate-pulse" />
                Open
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-ink/80 text-white/80 text-[11px] font-bold px-2.5 py-1">
                Closed
              </span>
            )}
          </div>

          {/* Bottom content */}
          <div className="absolute bottom-3 left-4 right-4">
            <span className="text-white text-[10px] font-bold uppercase tracking-[0.12em] opacity-90">
              {shortName}
            </span>
            <h3 className="font-display text-xl text-white leading-tight mt-0.5 line-clamp-1">
              {name}
            </h3>
          </div>
        </div>

        {/* Body */}
        <div className="p-5">
          <p className="flex items-center gap-1.5 text-xs text-ink-50">
            <MapPin className="size-3.5 text-ink-30" />
            {city}, {province}
          </p>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="default">{tag}</Badge>
            ))}
          </div>
        </div>
      </Link>

      {/* Footer */}
      <div className="border-t border-border px-5 py-3.5 flex items-center justify-between gap-2">
        <span className="text-xs text-ink-50">
          {programmeCount} programmes
          {isAcceptingApplications && ` · Closes ${formatShortDate(applicationDeadline)}`}
        </span>
        {isAcceptingApplications ? (
          <Link
            href={ROUTES.institution(slug)}
            className="inline-flex items-center gap-1 text-xs font-bold text-brand-700 group/cta"
          >
            View
            <ArrowRight className="size-3.5 group-hover/cta:translate-x-0.5 transition-transform" />
          </Link>
        ) : (
          <span className="text-xs text-ink-30 font-medium">Closed</span>
        )}
      </div>
    </Card>
  );
}

/** Lighten/darken a hex colour by a percentage. */
function shadeColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(0, Math.min(255, (num >> 16) + amt));
  const G = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amt));
  const B = Math.max(0, Math.min(255, (num & 0x0000FF) + amt));
  return '#' + ((R << 16) | (G << 8) | B).toString(16).padStart(6, '0');
}
