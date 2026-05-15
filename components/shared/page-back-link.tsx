import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface PageBackLinkProps {
  href: string;
  label: string;
}

export function PageBackLink({ href, label }: PageBackLinkProps) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-50 hover:text-brand-700 transition-colors group"
    >
      <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
      {label}
    </Link>
  );
}
