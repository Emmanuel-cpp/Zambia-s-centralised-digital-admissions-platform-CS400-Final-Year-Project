'use client';

import * as React from 'react';
import {
  Upload, FileText, Image as ImageIcon, Check, AlertCircle,
  Trash2, FileCheck2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatBytes, formatDate } from '@/lib/format';
import type { Document } from '@/types/domain';
import { cn } from '@/lib/utils';

const DOCUMENT_TYPES = [
  { value: 'nrc',                label: 'National Registration Card (NRC)' },
  { value: 'certificate',        label: 'Grade 12 Certificate' },
  { value: 'transcript',         label: 'Academic Transcript' },
  { value: 'photo',              label: 'Passport Photo' },
  { value: 'birth_certificate',  label: 'Birth Certificate' },
  { value: 'other',              label: 'Other' },
] as const;

interface Props {
  initialDocuments: Document[];
}

export function DocumentsManager({ initialDocuments }: Props) {
  const [docs, setDocs] = React.useState<Document[]>(initialDocuments);
  const [dragOver, setDragOver] = React.useState(false);
  const [selectedType, setSelectedType] = React.useState<typeof DOCUMENT_TYPES[number]['value']>('nrc');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const newDocs: Document[] = Array.from(files).map((file, i) => ({
      id: `tmp-${Date.now()}-${i}`,
      name: file.name,
      type: selectedType,
      sizeBytes: file.size,
      uploadedAt: new Date().toISOString(),
      verified: false,
    }));
    setDocs(prev => [...newDocs, ...prev]);
  }

  function handleDelete(id: string) {
    setDocs(prev => prev.filter(d => d.id !== id));
  }

  return (
    <div className="grid lg:grid-cols-[1fr_360px] gap-8">
      {/* ── Documents list (LEFT) ── */}
      <div>
        <div className="flex items-end justify-between mb-4">
          <h2 className="text-lg font-semibold text-ink">
            Uploaded documents <span className="text-ink-50 font-normal">({docs.length})</span>
          </h2>
        </div>

        {docs.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-surface-subtle p-10 text-center">
            <FileCheck2 className="size-8 text-ink-30 mx-auto mb-3" />
            <h3 className="font-display text-lg text-ink mb-1">No documents yet</h3>
            <p className="text-sm text-ink-50 max-w-sm mx-auto">
              Upload your NRC, ECZ certificate, and a passport photo to get started.
              Each document only needs to be uploaded once.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {docs.map(doc => (
              <DocumentRow key={doc.id} document={doc} onDelete={() => handleDelete(doc.id)} />
            ))}
          </div>
        )}

        {/* Verified callout */}
        {docs.length > 0 && docs.every(d => d.verified) && (
          <div className="mt-5 flex items-start gap-3 rounded-lg bg-success-soft border border-success/20 p-4">
            <Check className="size-5 text-success shrink-0 mt-0.5" strokeWidth={3} />
            <div>
              <p className="text-sm font-semibold text-ink">All documents verified</p>
              <p className="text-xs text-ink-70 mt-0.5">
                Your documents will be automatically attached to every application.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── Upload panel (RIGHT) ── */}
      <aside className="lg:sticky lg:top-24 self-start">
        <div className="rounded-xl border border-border bg-white p-5 sm:p-6">
          <h3 className="text-sm font-semibold text-ink mb-1">Upload new document</h3>
          <p className="text-xs text-ink-50 mb-5">PDF, JPG, or PNG. Max 5 MB per file.</p>

          {/* Document type select */}
          <div className="mb-3">
            <label className="block text-xs font-semibold text-ink-50 mb-1.5">Document type</label>
            <select
              value={selectedType}
              onChange={e => setSelectedType(e.target.value as typeof selectedType)}
              className="flex h-10 w-full rounded-md border border-input bg-surface-subtle px-3 py-2 text-sm focus-visible:outline-none focus-visible:border-brand-600 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-brand-600/10"
            >
              {DOCUMENT_TYPES.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          {/* Drop zone */}
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => {
              e.preventDefault();
              setDragOver(false);
              handleFiles(e.dataTransfer.files);
            }}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              'rounded-lg border-2 border-dashed p-6 text-center cursor-pointer transition-colors',
              dragOver
                ? 'border-brand-500 bg-brand-50'
                : 'border-border bg-surface-subtle hover:border-brand-300 hover:bg-brand-50/40',
            )}
          >
            <Upload className="size-7 mx-auto mb-2 text-ink-30" />
            <p className="text-sm font-medium text-ink">Click to upload or drag here</p>
            <p className="text-xs text-ink-50 mt-1">Files are stored securely</p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
              onChange={e => handleFiles(e.target.files)}
            />
          </div>

          {/* Helper note */}
          <div className="mt-5 flex items-start gap-2 text-xs text-ink-50">
            <AlertCircle className="size-3.5 text-ink-30 shrink-0 mt-0.5" />
            Documents are reused across all your applications — no need to upload them per institution.
          </div>
        </div>
      </aside>
    </div>
  );
}

/* ─────────────────────────────────
   Document row
───────────────────────────────── */

function DocumentRow({
  document, onDelete,
}: { document: Document; onDelete: () => void }) {
  const isImage = document.type === 'photo';

  return (
    <div className="flex items-center gap-4 p-4 rounded-lg border border-border bg-white hover:border-brand-200 transition-colors">
      <div className="grid place-items-center size-10 rounded-md bg-brand-50 text-brand-600 shrink-0">
        {isImage ? <ImageIcon className="size-4" /> : <FileText className="size-4" />}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-ink truncate">{document.name}</p>
        <p className="text-xs text-ink-50 mt-0.5">
          {formatBytes(document.sizeBytes)} · Uploaded {formatDate(document.uploadedAt)}
        </p>
      </div>

      {document.verified ? (
        <Badge variant="success" className="hidden sm:inline-flex">
          <Check className="size-3" strokeWidth={3} />
          Verified
        </Badge>
      ) : (
        <Badge variant="warning" className="hidden sm:inline-flex">Pending</Badge>
      )}

      <button
        type="button"
        onClick={onDelete}
        aria-label={`Delete ${document.name}`}
        className="grid place-items-center size-9 rounded-md text-ink-30 hover:text-danger hover:bg-danger-soft transition-colors"
      >
        <Trash2 className="size-4" />
      </button>
    </div>
  );
}
