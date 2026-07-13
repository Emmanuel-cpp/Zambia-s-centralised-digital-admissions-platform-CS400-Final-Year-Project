'use client';

import * as React from 'react';
import { Check, Sparkles, Save, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { getToken, getAuthUser, saveAuth } from '@/lib/auth';
import { cn } from '@/lib/utils';

/**
 * Curated set of interest tags covering most career paths in Zambia.
 * Stored verbatim in the user's profile and sent to the LLM as-is.
 */
const INTEREST_OPTIONS = [
  'Engineering & Technology',
  'Information & Communication Technology',
  'Mining & Exploration',
  'Healthcare & Medicine',
  'Business & Entrepreneurship',
  'Finance & Accounting',
  'Law & Justice',
  'Education & Teaching',
  'Agriculture & Natural Resources',
  'Arts & Humanities',
  'Social Sciences',
  'Communications & Media',
  'Environment & Sustainability',
  'Tourism & Hospitality',
  'Public Service & Government',
];

const MAX_SELECTIONS = 5;

interface InterestsEditorProps {
  initialInterests: string[];
}

export function InterestsEditor({ initialInterests }: InterestsEditorProps) {
  const [selected, setSelected] = React.useState<string[]>(initialInterests);
  const [saving, setSaving]     = React.useState(false);
  const [saved, setSaved]       = React.useState(false);
  const [error, setError]       = React.useState<string | null>(null);

  // Track whether the user has changed anything from what was loaded
  const isDirty = React.useMemo(() => {
    if (selected.length !== initialInterests.length) return true;
    const a = [...selected].sort().join('|');
    const b = [...initialInterests].sort().join('|');
    return a !== b;
  }, [selected, initialInterests]);

  function toggle(tag: string) {
    setSelected(prev => {
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag);
      }
      if (prev.length >= MAX_SELECTIONS) {
        return prev; // ignore — at limit
      }
      return [...prev, tag];
    });
    setSaved(false);
    setError(null);
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSaved(false);

    try {
      const token = getToken();
      const response = await api.put<any>(
        '/profile',
        { interests: selected },
        token ?? undefined,
      );

      // Update local auth so other parts of the app see the new interests
      const current = getAuthUser();
      if (current && token) {
        saveAuth(token, {
          ...current,
          interests: response.user?.interests ?? selected,
        });
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err: any) {
      setError(err.message || 'Could not save your interests.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-xl border border-border bg-white p-5 sm:p-6 mb-6">
      <div className="flex items-start justify-between gap-4 mb-1">
        <div className="flex items-center gap-2.5">
          <div className="grid place-items-center size-9 rounded-md bg-brand-50 text-brand-700 shrink-0">
            <Sparkles className="size-4" />
          </div>
          <div>
            <h2 className="font-display text-lg text-ink leading-tight">
              Your interests
            </h2>
            <p className="text-xs text-ink-50 mt-0.5">
              Picking {MAX_SELECTIONS} or fewer helps our AI recommend the right programmes.
            </p>
          </div>
        </div>
        <p className="text-xs text-ink-50 shrink-0 mt-1">
          <strong className="text-ink">{selected.length}</strong> / {MAX_SELECTIONS}
        </p>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {INTEREST_OPTIONS.map(tag => {
          const isSelected = selected.includes(tag);
          const isDisabled = !isSelected && selected.length >= MAX_SELECTIONS;
          return (
            <button
              key={tag}
              type="button"
              onClick={() => toggle(tag)}
              disabled={isDisabled}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors',
                isSelected
                  ? 'bg-brand-600 border-brand-600 text-white hover:bg-brand-700'
                  : isDisabled
                    ? 'bg-ink-5 border-border text-ink-30 cursor-not-allowed'
                    : 'bg-white border-border text-ink-70 hover:bg-brand-50 hover:border-brand-200 hover:text-brand-700',
              )}
            >
              {isSelected && <Check className="size-3.5" strokeWidth={3} />}
              {tag}
            </button>
          );
        })}
      </div>

      {error && (
        <div className="mt-4 rounded-md bg-danger-soft border border-danger/20 px-3 py-2 flex items-start gap-2">
          <AlertCircle className="size-4 text-danger shrink-0 mt-0.5" />
          <p className="text-sm text-danger">{error}</p>
        </div>
      )}

      <div className="flex items-center justify-end gap-3 mt-5 pt-5 border-t border-border">
        {saved && (
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-success">
            <Check className="size-4" strokeWidth={3} />
            Saved
          </span>
        )}
        <Button
          onClick={handleSave}
          disabled={!isDirty || saving}
        >
          {saving ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Saving…
            </>
          ) : (
            <>
              <Save className="size-4" />
              Save interests
            </>
          )}
        </Button>
      </div>
    </section>
  );
}