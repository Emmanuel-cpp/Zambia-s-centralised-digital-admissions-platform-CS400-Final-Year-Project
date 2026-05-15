'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FileText, Image as ImageIcon, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StepFooter } from '../apply-wizard';
import { documents } from '@/lib/mock-data';
import { ROUTES } from '@/lib/routes';
import { formatBytes } from '@/lib/format';
import { cn } from '@/lib/utils';

interface StepDocumentsProps {
  draft: string[] | undefined;
  onSubmit: (documentIds: string[]) => void;
  onBack: () => void;
}

export function StepDocuments({ draft, onSubmit, onBack }: StepDocumentsProps) {
  // Default: all documents pre-selected (most students will want to attach everything)
  const initial = draft ?? documents.map(d => d.id);
  const [selected, setSelected] = useState<Set<string>>(new Set(initial));
  const [error, setError] = useState<string | null>(null);

  function toggle(id: string) {
    setError(null);
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleSubmit() {
    if (selected.size === 0) {
      setError('Attach at least one document to continue.');
      return;
    }
    onSubmit(Array.from(selected));
  }

  return (
    <div>
      <header className="mb-7">
        <p className="eyebrow mb-2">Step 5 of 6</p>
        <h1 className="font-display text-display-sm sm:text-display-md text-ink">
          Attach your documents
        </h1>
        <p className="mt-2 text-base text-ink-50 leading-relaxed">
          Select the documents you want to send with this application. They&apos;re reused from your profile.
        </p>
      </header>

      {documents.length === 0 ? (
        <EmptyDocuments />
      ) : (
        <>
          <div className="space-y-2.5">
            {documents.map(doc => {
              const isSelected = selected.has(doc.id);
              const isImage = doc.type === 'photo';
              return (
                <button
                  key={doc.id}
                  type="button"
                  onClick={() => toggle(doc.id)}
                  className={cn(
                    'w-full flex items-center gap-4 p-4 rounded-lg border text-left transition-all',
                    isSelected
                      ? 'border-brand-300 bg-brand-50/40'
                      : 'border-border bg-white hover:border-ink-20',
                  )}
                >
                  <div className={cn(
                    'grid place-items-center size-10 rounded-md shrink-0',
                    isSelected ? 'bg-brand-600 text-white' : 'bg-ink-5 text-ink-50',
                  )}>
                    {isImage ? <ImageIcon className="size-4" /> : <FileText className="size-4" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-ink truncate">{doc.name}</p>
                    <p className="text-xs text-ink-50 mt-0.5">
                      {formatBytes(doc.sizeBytes)} · {doc.verified ? 'Verified' : 'Pending review'}
                    </p>
                  </div>

                  <div
                    className={cn(
                      'grid place-items-center size-5 rounded-md border-2 shrink-0 transition-colors',
                      isSelected ? 'bg-brand-600 border-brand-600' : 'border-ink-20',
                    )}
                  >
                    {isSelected && <Check className="size-3 text-white" strokeWidth={3} />}
                  </div>
                </button>
              );
            })}
          </div>

          <p className="text-xs text-ink-50 mt-4">
            Need to upload a new document?{' '}
            <Link href={ROUTES.documents} className="font-semibold text-brand-700 hover:underline">
              Manage documents →
            </Link>
          </p>

          {error && (
            <p className="mt-3 text-xs font-medium text-danger">{error}</p>
          )}
        </>
      )}

      <StepFooter
        onBack={onBack}
        primaryType="button"
        onPrimary={handleSubmit}
      />
    </div>
  );
}

function EmptyDocuments() {
  return (
    <div className="rounded-lg border border-dashed border-border bg-surface-subtle p-10 text-center">
      <p className="font-display text-lg text-ink mb-2">No documents uploaded yet</p>
      <p className="text-sm text-ink-50 mb-5 max-w-sm mx-auto">
        Upload your NRC, ECZ certificate, and a passport photo before continuing.
      </p>
      <Button asChild variant="primary">
        <Link href={ROUTES.documents}>Upload documents</Link>
      </Button>
    </div>
  );
}
