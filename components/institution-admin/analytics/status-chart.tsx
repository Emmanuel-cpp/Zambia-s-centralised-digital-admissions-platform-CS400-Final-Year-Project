'use client';

import * as React from 'react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
} from 'recharts';

interface StatusDataPoint {
  status: string;
  count: number;
}

interface StatusChartProps {
  data: StatusDataPoint[];
}

const STATUS_META: Record<string, { label: string; color: string }> = {
  submitted:    { label: 'Submitted',    color: '#3b82f6' }, // blue
  under_review: { label: 'Under review', color: '#a855f7' }, // purple
  accepted:     { label: 'Accepted',     color: '#16a34a' }, // green
  rejected:     { label: 'Rejected',     color: '#ef4444' }, // red
  waitlisted:   { label: 'Waitlisted',   color: '#f59e0b' }, // amber
};

/**
 * Donut chart showing how applications are distributed across statuses.
 * Useful for spotting bottlenecks (e.g. too many stuck in "submitted").
 */
export function StatusChart({ data }: StatusChartProps) {
  const total = data.reduce((acc, d) => acc + d.count, 0);

  // Filter to only non-zero statuses, but keep order
  const slices = data
    .filter(d => d.count > 0)
    .map(d => ({
      ...d,
      label: STATUS_META[d.status]?.label ?? d.status,
      color: STATUS_META[d.status]?.color ?? '#9ca3af',
    }));

  return (
    <div className="rounded-xl border border-border bg-white p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-ink text-sm">Status distribution</h3>
          <p className="text-xs text-ink-50 mt-0.5">Workflow snapshot</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-ink-50">Total</p>
          <p className="font-display text-2xl text-ink leading-none mt-0.5">{total}</p>
        </div>
      </div>

      {total === 0 ? (
        <div className="h-56 flex items-center justify-center text-sm text-ink-50">
          No applications yet
        </div>
      ) : (
        <>
          <div className="h-56 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={slices}
                  dataKey="count"
                  nameKey="label"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  strokeWidth={0}
                >
                  {slices.map((slice, i) => (
                    <Cell key={i} fill={slice.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: 8,
                    fontSize: 12,
                    padding: '8px 12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <p className="font-display text-2xl text-ink leading-none">{total}</p>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-50 mt-1">
                  Total
                </p>
              </div>
            </div>
          </div>

          {/* Legend */}
          <ul className="grid grid-cols-2 gap-x-3 gap-y-1.5 mt-4 pt-4 border-t border-border">
            {slices.map(slice => (
              <li key={slice.status} className="flex items-center gap-2 text-xs">
                <span
                  className="size-2.5 rounded-sm shrink-0"
                  style={{ background: slice.color }}
                />
                <span className="text-ink-70 flex-1 truncate">{slice.label}</span>
                <span className="text-ink font-semibold">{slice.count}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}