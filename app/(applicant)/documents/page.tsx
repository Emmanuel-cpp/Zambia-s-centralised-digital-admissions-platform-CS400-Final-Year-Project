'use client';

import * as React from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { PageHeader } from '@/components/layout/app-shell';
import { DocumentsManager } from '@/components/documents/documents-manager';
import { api } from '@/lib/api';
import { getToken } from '@/lib/auth';
import type { Document } from '@/types/domain';

/**
 * Shape returned by Laravel /api/documents
 */
interface ApiDocument {
  id: number;
  name: string;
  type: string;
  path: string;
  size_bytes: number;
  verified: boolean;
  verification_status: string;
  confidence_score: number | null;
  created_at: string;
}

/**
 * Map the Laravel response to the Document shape the UI expects.
 */
function mapDocument(api: ApiDocument): Document {
  return {
    id:         String(api.id),
    name:       api.name,
    type:       api.type as Document['type'],
    sizeBytes:  api.size_bytes,
    uploadedAt: api.created_at,
    verified:   api.verified,
  };
}

export default function DocumentsPage() {
  const [documents, setDocuments] = React.useState<Document[]>([]);
  const [loading, setLoading]     = React.useState(true);
  const [error, setError]         = React.useState<string | null>(null);

  React.useEffect(() => {
    async function load() {
      try {
        const token = getToken();
        const data = await api.get<ApiDocument[]>('/documents', token ?? undefined);
        setDocuments(data.map(mapDocument));
      } catch (err: any) {
        setError(err.message || 'Could not load your documents.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div>
      <PageHeader
        title="Documents"
        description="Upload once, reuse across every application. We'll attach them automatically to all your applications."
      />

      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="size-6 text-brand-600 animate-spin" />
        </div>
      )}

      {error && !loading && (
        <div className="rounded-xl border border-danger/30 bg-danger-soft p-5 flex items-start gap-3">
          <AlertCircle className="size-5 text-danger shrink-0 mt-0.5" />
          <p className="text-sm text-danger">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <DocumentsManager initialDocuments={documents} />
      )}
    </div>
  );
}