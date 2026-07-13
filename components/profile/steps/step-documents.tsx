'use client';

import * as React from 'react';
import {
  Upload, FileText, Image as ImageIcon,
  ArrowRight, ArrowLeft, X, Loader2, AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getToken, getAuthUser } from '@/lib/auth';

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  sizeBytes: number;
}

interface Props {
  onNext: (files: UploadedFile[]) => void;
  onBack: () => void;
}

type DocType = 'nrc_front' | 'nrc_back' | 'certificate' | 'photo';

const REQUIRED_DOCS: { type: DocType; label: string; hint: string }[] = [
  {
    type:  'nrc_front',
    label: 'NRC — Front side',
    hint:  'Clear photo showing your NRC number, name, photo, and date of birth.',
  },
  {
    type:  'nrc_back',
    label: 'NRC — Back side',
    hint:  'Clear photo showing your signature and place of birth.',
  },
  {
    type:  'certificate',
    label: 'Grade 12 Certificate / Statement of Results',
    hint:  'Your official ECZ Grade 12 certificate or statement of results.',
  },
  {
    type:  'photo',
    label: 'Passport photo',
    hint:  'A recent passport-style photo showing only your face.',
  },
];

export function StepDocuments({ onNext, onBack }: Props) {
  const [files, setFiles] = React.useState<UploadedFile[]>([]);
  const [error, setError] = React.useState('');

  function handleUploaded(file: UploadedFile) {
    setFiles(prev => {
      const filtered = prev.filter(f => f.type !== file.type);
      return [...filtered, file];
    });
    setError('');
  }

  function removeFile(type: DocType) {
    setFiles(prev => prev.filter(f => f.type !== type));
  }

  function handleNext() {
    const uploadedTypes = files.map(f => f.type);
    const missing = REQUIRED_DOCS.filter(d => !uploadedTypes.includes(d.type));

    if (missing.length > 0) {
      const labels = missing.map(d => d.label);
      setError(`Please upload and verify all 4 documents. Missing: ${labels.join(', ')}.`);
      return;
    }

    onNext(files);
  }

  return (
    <div>
      <header className="mb-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-brand-600 mb-1.5">
          Step 3 of 3
        </p>
        <h2 className="font-display text-display-sm text-ink">Upload documents</h2>
        <p className="mt-1.5 text-sm text-ink-50 leading-relaxed">
          Each document is verified by AI on your device — your files stay private.
          PDF, JPG, or PNG. Max 5 MB each.
        </p>
      </header>

      <div className="space-y-3 mb-6">
        {REQUIRED_DOCS.map(doc => (
          <DocSlot
            key={doc.type}
            type={doc.type}
            label={doc.label}
            hint={doc.hint}
            uploaded={files.find(f => f.type === doc.type)}
            onUploaded={handleUploaded}
            onRemove={() => removeFile(doc.type)}
          />
        ))}
      </div>

      {error && (
        <p className="text-sm text-danger mb-4">{error}</p>
      )}

      <div className="flex gap-3">
        <Button type="button" variant="outline" size="lg" onClick={onBack} className="flex-1">
          <ArrowLeft className="size-4" />
          Back
        </Button>
        <Button type="button" size="lg" onClick={handleNext} className="flex-1">
          Complete profile
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────
   DocSlot — handles one document
───────────────────────────────── */

interface DocSlotProps {
  type:       DocType;
  label:      string;
  hint:       string;
  uploaded?:  UploadedFile;
  onUploaded: (file: UploadedFile) => void;
  onRemove:   () => void;
}

type ProgressStage = 'idle' | 'verifying' | 'uploading';

function DocSlot({ type, label, hint, uploaded, onUploaded, onRemove }: DocSlotProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [stage, setStage] = React.useState<ProgressStage>('idle');
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const isImage = type === 'photo';

  async function handleFileSelect(fileList: FileList | null) {
  if (!fileList || fileList.length === 0) return;
  const file = fileList[0];

  setErrorMessage(null);
  setStage('verifying');

  try {
    const user  = getAuthUser();
    const token = getToken();

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    // For NRC front, send the user's typed NRC so the backend
    // can verify it matches the OCR-detected one
    if (type === 'nrc_front' && user?.nrc) {
      formData.append('user_nrc', user.nrc);
    }

    const response = await fetch('http://localhost:8000/api/documents', {
      method:  'POST',
      headers: {
        'Accept':        'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      setErrorMessage(data.message || 'Verification failed. Please try again.');
      setStage('idle');
      return;
    }

    onUploaded({
      id:        `${type}-${Date.now()}`,
      name:      file.name,
      type,
      sizeBytes: file.size,
    });
    setStage('idle');

  } catch (err: any) {
    console.error('Document upload error:', err);
    setErrorMessage(err.message || 'Something went wrong. Please try again.');
    setStage('idle');
  }
}

  /* ── Uploaded + verified ── */
  if (uploaded) {
    return (
      <div className="flex items-center gap-3 p-3.5 rounded-lg border border-success/30 bg-success-soft">
        <div className="grid place-items-center size-9 rounded-md bg-success text-white shrink-0">
          {isImage ? <ImageIcon className="size-4" /> : <FileText className="size-4" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-ink truncate">{uploaded.name}</p>
          <p className="text-xs text-success font-medium">✓ Verified — {label}</p>
        </div>
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${label}`}
          title={`Remove ${label}`}
          className="grid place-items-center size-7 rounded-full text-ink-30 hover:bg-ink-10 hover:text-danger transition-colors"
        >
          <X className="size-3.5" />
        </button>
      </div>
    );
  }

  /* ── Working state ── */
  if (stage !== 'idle') {
    return (
      <div className="flex items-center gap-3 p-3.5 rounded-lg border-2 border-dashed border-brand-300 bg-brand-50/40">
        <div className="grid place-items-center size-9 rounded-md bg-brand-100 text-brand-600 shrink-0">
          <Loader2 className="size-4 animate-spin" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-ink">{label}</p>
          <p className="text-xs text-brand-700 font-medium">
            {stage === 'verifying' && 'Verifying… please wait, this may take a few seconds'}
            {stage === 'uploading' && 'Saving document…'}
          </p>
        </div>
      </div>
    );
  }

  /* ── Empty / rejected state ── */
  return (
    <div
      onClick={() => inputRef.current?.click()}
      className={cn(
        'flex items-center gap-3 p-3.5 rounded-lg border-2 border-dashed cursor-pointer transition-colors',
        errorMessage
          ? 'border-danger/40 bg-danger-soft hover:border-danger/60'
          : 'border-border hover:border-brand-300 hover:bg-brand-50/40',
      )}
    >
      <div className={cn(
        'grid place-items-center size-9 rounded-md shrink-0',
        errorMessage ? 'bg-danger/10 text-danger' : 'bg-ink-5 text-ink-30',
      )}>
        {errorMessage
          ? <AlertCircle className="size-4" />
          : <Upload className="size-4" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-ink">
          {label}
          <span className="text-danger ml-1">*</span>
        </p>
        <p className={cn(
          'text-xs mt-0.5 leading-relaxed',
          errorMessage ? 'text-danger font-medium' : 'text-ink-50',
        )}>
          {errorMessage || hint}
        </p>
      </div>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept=".pdf,.jpg,.jpeg,.png"
        aria-label={`Upload ${label}`}
        title={`Upload ${label}`}
        onChange={e => handleFileSelect(e.target.files)}
      />
    </div>
  );
}