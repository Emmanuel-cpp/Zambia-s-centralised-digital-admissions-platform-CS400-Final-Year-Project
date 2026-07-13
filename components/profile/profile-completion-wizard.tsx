'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Check, Loader2 } from 'lucide-react';
import { StepPersonalInfo } from './steps/step-personal-info';
import { StepGrades }       from './steps/step-grades';
import { StepDocuments }    from './steps/step-documents';
import { StepDone }         from './steps/step-done';
import { currentUser }      from '@/lib/mock-data';
import { api }              from '@/lib/api';
import { getToken, getAuthUser, saveAuth } from '@/lib/auth';
import type { ProfileValues } from '@/lib/schemas/profile';
import type { GradeRequirement } from '@/types/domain';

const STEPS = [
  { label: 'Personal info' },
  { label: 'Grades' },
  { label: 'Documents' },
] as const;

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  sizeBytes: number;
}

// Storage keys for wizard state — kept in sessionStorage so they survive
// a page refresh but get cleared when the browser tab is closed.
const STORAGE_KEY_STEP     = 'zamadmit_wizard_step';
const STORAGE_KEY_PERSONAL = 'zamadmit_wizard_personal';
const STORAGE_KEY_GRADES   = 'zamadmit_wizard_grades';

function readStorage<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: unknown): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore quota errors
  }
}

function clearWizardStorage(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(STORAGE_KEY_STEP);
  sessionStorage.removeItem(STORAGE_KEY_PERSONAL);
  sessionStorage.removeItem(STORAGE_KEY_GRADES);
}

export function ProfileCompletionWizard() {
  const [stepIndex, setStepIndex] = React.useState(0);
  const [done, setDone]           = React.useState(false);
  const [saving, setSaving]       = React.useState(false);
  const [error, setError]         = React.useState<string | null>(null);

  const [personalData, setPersonalData] = React.useState<ProfileValues | null>(null);
  const [gradesData,   setGradesData]   = React.useState<GradeRequirement[]>(currentUser.grades);

  const token    = getToken();
  const authUser = getAuthUser();

  /* Restore state on first render */
  React.useEffect(() => {
    const savedStep     = readStorage<number>(STORAGE_KEY_STEP);
    const savedPersonal = readStorage<ProfileValues>(STORAGE_KEY_PERSONAL);
    const savedGrades   = readStorage<GradeRequirement[]>(STORAGE_KEY_GRADES);

    if (savedStep !== null && savedStep >= 0 && savedStep < STEPS.length) {
      setStepIndex(savedStep);
    }
    if (savedPersonal) {
      setPersonalData(savedPersonal);
    }
    if (savedGrades && savedGrades.length > 0) {
      setGradesData(savedGrades);
    }
  }, []);

  /* Persist on every change */
  React.useEffect(() => {
    writeStorage(STORAGE_KEY_STEP, stepIndex);
  }, [stepIndex]);

  React.useEffect(() => {
    if (personalData) writeStorage(STORAGE_KEY_PERSONAL, personalData);
  }, [personalData]);

  React.useEffect(() => {
    if (gradesData.length > 0) writeStorage(STORAGE_KEY_GRADES, gradesData);
  }, [gradesData]);

  function next() {
    setStepIndex(i => Math.min(i + 1, STEPS.length - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function back() {
    setStepIndex(i => Math.max(i - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handlePersonalNext(values: ProfileValues) {
    setPersonalData(values);
    setSaving(true);
    setError(null);

    try {
      await api.put('/profile', {
        first_name:    values.firstName,
        last_name:     values.lastName,
        nrc:           values.nrc,
        phone:         values.phone,
        province:      values.province,
        date_of_birth: values.dateOfBirth,
      }, token ?? undefined);

      const updatedUser     = await api.get<any>('/user', token ?? undefined);
      const currentAuthUser = getAuthUser();
      if (currentAuthUser && updatedUser) {
        saveAuth(token!, {
          ...currentAuthUser,
          nrc:      updatedUser.nrc,
          phone:    updatedUser.phone,
          province: updatedUser.province,
        });
      }

      next();
    } catch (err: any) {
      setError(err.message || 'Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  function handleGradesNext(grades: GradeRequirement[]) {
    setGradesData(grades);
    next();
  }

  async function handleDocumentsNext(_files: UploadedFile[]) {
    setSaving(true);
    setError(null);

    try {
      if (gradesData.length > 0) {
        await api.post('/profile/grades', {
          grades: gradesData.map(g => ({
            subject: g.subject,
            grade:   g.minGrade,
          })),
        }, token ?? undefined);
      }

      const updatedUser     = await api.get<any>('/user', token ?? undefined);
      const currentAuthUser = getAuthUser();
      if (currentAuthUser && updatedUser) {
        saveAuth(token!, {
          ...currentAuthUser,
          profile_complete: updatedUser.profile_complete,
          nrc:      updatedUser.nrc,
          phone:    updatedUser.phone,
          province: updatedUser.province,
        });
      }

      clearWizardStorage();
      setDone(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  if (done) {
    return (
      <div className="min-h-screen bg-surface-subtle flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-[480px] bg-white rounded-2xl border border-border shadow-card px-7 py-8 sm:px-8">
          <StepDone />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-subtle flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-[480px]">
        <div className="mb-6">
          <p className="text-center text-sm font-medium text-ink-50 mb-4">
            Complete your profile
          </p>
          <ol className="flex items-center gap-1">
            {STEPS.map((step, i) => {
              const isDone   = i < stepIndex;
              const isActive = i === stepIndex;
              return (
                <li key={step.label} className="flex-1 flex items-center gap-1">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={cn(
                      'grid place-items-center size-7 rounded-full text-xs font-bold shrink-0 transition-colors',
                      isDone   && 'bg-brand-100 text-brand-700',
                      isActive && 'bg-brand-600 text-white',
                      !isDone && !isActive && 'bg-ink-10 text-ink-50',
                    )}>
                      {isDone
                        ? <Check className="size-3.5" strokeWidth={3} />
                        : i + 1}
                    </div>
                    <span className={cn(
                      'text-xs font-semibold hidden sm:inline truncate',
                      isActive ? 'text-ink' : 'text-ink-50',
                    )}>
                      {step.label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={cn(
                      'flex-1 h-px transition-colors',
                      isDone ? 'bg-brand-300' : 'bg-ink-10',
                    )} />
                  )}
                </li>
              );
            })}
          </ol>
        </div>

        <div className="bg-white rounded-2xl border border-border shadow-card px-7 py-8 sm:px-8">
          {stepIndex === 0 && (
            <StepPersonalInfo
              profile={{
                ...currentUser,
                firstName:   personalData?.firstName       || authUser?.first_name || '',
                lastName:    personalData?.lastName        || authUser?.last_name  || '',
                email:       personalData?.email           || authUser?.email      || '',
                phone:       personalData?.phone           || authUser?.phone      || '',
                nrc:         personalData?.nrc             || authUser?.nrc        || '',
                province:    (personalData?.province as any) || (authUser?.province as any) || '',
                dateOfBirth: personalData?.dateOfBirth     || '',
              }}
              onNext={handlePersonalNext}
            />
          )}
          {stepIndex === 1 && (
            <StepGrades
              grades={gradesData}
              onNext={handleGradesNext}
              onBack={back}
            />
          )}
          {stepIndex === 2 && (
            <StepDocuments
              onNext={handleDocumentsNext}
              onBack={back}
            />
          )}

          {saving && (
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-ink-50">
              <Loader2 className="size-4 animate-spin" />
              Saving your profile…
            </div>
          )}

          {error && (
            <div className="mt-4 rounded-md bg-danger-soft border border-danger/20 px-4 py-3">
              <p className="text-sm text-danger">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}