'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { Loader2, AlertCircle } from 'lucide-react';
import { ProgrammeForm, type ProgrammeFormValues } from '@/components/institution-admin/programme-form';
import { api } from '@/lib/api';
import { getToken } from '@/lib/auth';

/**
 * Shape returned by /api/admin/programmes/{id}
 */
interface ApiProgramme {
  id:             number;
  name:           string;
  qualification:  string;
  school:         string;
  duration_years: number;
  study_mode:     string;
  intake:         string;
  description:    string | null;
  requirements:   { subject: string; min_grade: number }[];
}

export default function EditProgrammePage() {
  const params = useParams<{ id: string }>();

  const [programme, setProgramme] = React.useState<ApiProgramme | null>(null);
  const [loading, setLoading]     = React.useState(true);
  const [error, setError]         = React.useState<string | null>(null);

  React.useEffect(() => {
    async function load() {
      try {
        const token = getToken();
        const data = await api.get<ApiProgramme>(
          `/admin/programmes/${params.id}`,
          token ?? undefined,
        );
        setProgramme(data);
      } catch (err: any) {
        setError(err.message || 'Could not load programme.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="size-6 text-brand-600 animate-spin" />
      </div>
    );
  }

  if (error || !programme) {
    return (
      <div className="rounded-xl border border-danger/30 bg-danger-soft p-5 flex items-start gap-3">
        <AlertCircle className="size-5 text-danger shrink-0 mt-0.5" />
        <p className="text-sm text-danger">{error || 'Programme not found.'}</p>
      </div>
    );
  }

  // Convert API shape to form shape (cast types for the enum-typed fields)
  const initialValues: Partial<ProgrammeFormValues> = {
    name:           programme.name,
    qualification:  programme.qualification as ProgrammeFormValues['qualification'],
    school:         programme.school,
    duration_years: programme.duration_years,
    study_mode:     programme.study_mode as ProgrammeFormValues['study_mode'],
    intake:         programme.intake,
    description:    programme.description,
    requirements:   programme.requirements,
  };

  return (
    <ProgrammeForm
      programmeId={programme.id}
      initialValues={initialValues}
      title={`Edit: ${programme.name}`}
      description="Update programme details and entry requirements."
    />
  );
}