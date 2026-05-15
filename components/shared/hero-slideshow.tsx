'use client';

import * as React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface HeroSlideshowProps {
  /** Array of image paths from the /public folder, e.g. ['/images/hero/slide-1.jpg'] */
  images: string[];
  /** Alt text describing the slideshow as a whole (for screen readers) */
  alt: string;
  /** Milliseconds between slides. Default 6000 (6s) */
  intervalMs?: number;
  /** Cross-fade duration in ms. Default 1500 */
  fadeMs?: number;
  className?: string;
}

/**
 * Background slideshow with cross-fade transitions.
 *
 * - Auto-advances on a timer
 * - Pauses when the browser tab is hidden (saves battery)
 * - Respects prefers-reduced-motion (shows just the first image)
 * - First image is preloaded with priority for fast LCP
 * - Decorative — does not steal focus or screen-reader attention beyond the alt
 */
export function HeroSlideshow({
  images,
  alt,
  intervalMs = 6000,
  fadeMs = 1500,
  className,
}: HeroSlideshowProps) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [reducedMotion, setReducedMotion] = React.useState(false);

  // Detect reduced motion preference
  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Auto-advance with tab-visibility pause
  React.useEffect(() => {
    if (reducedMotion || images.length <= 1) return;

    let timeoutId: ReturnType<typeof setTimeout>;

    function scheduleNext() {
      timeoutId = setTimeout(() => {
        if (!document.hidden) {
          setActiveIndex(i => (i + 1) % images.length);
        }
        scheduleNext();
      }, intervalMs);
    }

    scheduleNext();
    return () => clearTimeout(timeoutId);
  }, [images.length, intervalMs, reducedMotion]);

  return (
    <div className={cn('absolute inset-0 overflow-hidden', className)} aria-hidden>
      {images.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 transition-opacity ease-in-out"
          style={{
            opacity: i === activeIndex ? 1 : 0,
            transitionDuration: `${fadeMs}ms`,
          }}
        >
          <Image
            src={src}
            alt={i === 0 ? alt : ''}
            fill
            sizes="100vw"
            priority={i === 0}
            quality={85}
            className="object-cover object-center"
          />
        </div>
      ))}
    </div>
  );
}
