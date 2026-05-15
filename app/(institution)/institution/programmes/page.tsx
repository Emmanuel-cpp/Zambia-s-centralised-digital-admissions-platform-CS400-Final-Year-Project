'use client';

import * as React from 'react';
import { Plus, Search, MoreVertical, Pencil, Trash2, Eye, X, Clock, Calendar } from 'lucide-react';
import { PageHeader } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getAdminProgrammes } from '@/lib/data';
import { cn } from '@/lib/utils';
import type { Programme } from '@/types/domain';

export default function InstitutionProgrammesPage() {
  const [programmes, setProgrammes] = React.useState<Programme[]>(() => getAdminProgrammes());
  const [search, setSearch] = React.useState('');
  const [openMenuId, setOpenMenuId] = React.useState<string | null>(null);

  const filtered = programmes.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.faculty.toLowerCase().includes(search.toLowerCase()),
  );

  function handleDelete(id: string) {
    if (confirm('Remove this programme? This cannot be undone.')) {
      setProgrammes(prev => prev.filter(p => p.id !== id));
    }
    setOpenMenuId(null);
  }

  return (
    <>
      <PageHeader
        eyebrow="Manage"
        title="Programmes"
        description="The programmes offered by your institution."
        actions={
          <Button onClick={() => alert('Create programme — coming with backend integration.')}>
            <Plus className="size-4" /> New programme
          </Button>
        }
      />

      {/* Search */}
      <div className="mb-5 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-ink-30" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search programmes…"
            className="pl-9 pr-9"
          />
          {search && (
            <button
              type="button" onClick={() => setSearch('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 grid place-items-center size-6 rounded-full text-ink-30 hover:bg-ink-5 hover:text-ink"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-10 text-center">
          <p className="font-display text-xl text-ink">No programmes match</p>
          <p className="text-sm text-ink-50 mt-2">
            {search ? 'Try a different search term.' : 'Click "New programme" to add one.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(prog => (
            <ProgrammeRow
              key={prog.id}
              programme={prog}
              menuOpen={openMenuId === prog.id}
              onMenuToggle={() => setOpenMenuId(openMenuId === prog.id ? null : prog.id)}
              onMenuClose={() => setOpenMenuId(null)}
              onDelete={() => handleDelete(prog.id)}
            />
          ))}
        </div>
      )}
    </>
  );
}

function ProgrammeRow({
  programme, menuOpen, onMenuToggle, onMenuClose, onDelete,
}: {
  programme: Programme;
  menuOpen: boolean;
  onMenuToggle: () => void;
  onMenuClose: () => void;
  onDelete: () => void;
}) {
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!menuOpen) return;
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) onMenuClose();
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen, onMenuClose]);

  return (
    <div className="rounded-xl border border-border bg-white p-5 flex items-start gap-4 hover:border-brand-200 transition-colors">
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1.5">
          <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-brand-700 bg-brand-50 rounded-full px-2 py-0.5">
            {programme.qualification}
          </span>
          <span className="text-xs text-ink-50">{programme.faculty}</span>
        </div>
        <h3 className="font-display text-lg text-ink leading-tight">{programme.name}</h3>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-50">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-3.5" /> {programme.durationYears} years · {programme.studyMode}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="size-3.5" /> {programme.intake}
          </span>
        </div>
      </div>

      <div className="relative shrink-0" ref={menuRef}>
        <button
          type="button"
          onClick={onMenuToggle}
          className={cn(
            'grid place-items-center size-9 rounded-md transition-colors',
            menuOpen ? 'bg-ink-10 text-ink' : 'text-ink-30 hover:bg-ink-5 hover:text-ink',
          )}
        >
          <MoreVertical className="size-4" />
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-full mt-1 min-w-[180px] rounded-md border border-border bg-white shadow-elevate py-1.5 z-10">
            <MenuButton icon={<Eye className="size-4" />}    label="View public page" onClick={onMenuClose} />
            <MenuButton icon={<Pencil className="size-4" />} label="Edit programme"   onClick={onMenuClose} />
            <div className="border-t border-border my-1" />
            <MenuButton icon={<Trash2 className="size-4" />} label="Delete"           onClick={onDelete} danger />
          </div>
        )}
      </div>
    </div>
  );
}

function MenuButton({ icon, label, onClick, danger }: {
  icon: React.ReactNode; label: string; onClick: () => void; danger?: boolean;
}) {
  return (
    <button
      type="button" onClick={onClick}
      className={cn(
        'flex items-center gap-2.5 w-full px-3.5 py-2 text-sm text-left transition-colors',
        danger ? 'text-danger hover:bg-danger-soft' : 'text-ink hover:bg-ink-5',
      )}
    >
      {icon}{label}
    </button>
  );
}
