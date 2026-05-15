import type { Metadata } from 'next';
import { PageHeader } from '@/components/layout/app-shell';
import { DocumentsManager } from '@/components/documents/documents-manager';
import { documents } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Documents',
};

export default function DocumentsPage() {
  return (
    <div>
      <PageHeader
        title="Documents"
        description="Upload once, reuse across every application. We'll attach them automatically."
      />
      <DocumentsManager initialDocuments={documents} />
    </div>
  );
}
