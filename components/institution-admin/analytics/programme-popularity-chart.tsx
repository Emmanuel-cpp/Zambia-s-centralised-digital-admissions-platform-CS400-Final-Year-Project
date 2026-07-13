'use client';

import * as React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

interface DataPoint {
  programme: string;
  count: number;
}

interface ProgrammePopularityChartProps {
  data: DataPoint[];
}

/**
 * Horizontal bar chart ranking programmes by application count.
 * Reveals which programmes are most in demand this cycle.
 */
export function ProgrammePopularityChart({ data }: ProgrammePopularityChartProps) {
  // Truncate long programme names for the Y axis label
  const formatted = React.useMemo(
    () => data.map(d => ({
      ...d,
      label: d.programme.length > 28 ? d.programme.slice(0, 28) + '…' : d.programme,
    })),
    [data],
  );

  const totalApplications = data.reduce((acc, d) => acc + d.count, 0);

  return (
    <div className="rounded-xl border border-border bg-white p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-ink text-sm">Programme popularity</h3>
          <p className="text-xs text-ink-50 mt-0.5">Applications per programme</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-ink-50">Programmes</p>
          <p className="font-display text-2xl text-ink leading-none mt-0.5">{data.length}</p>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="h-56 flex items-center justify-center text-sm text-ink-50">
          No applications yet
        </div>
      ) : (
        <div style={{ height: Math.max(180, data.length * 36) }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={formatted}
              layout="vertical"
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
              <XAxis
                type="number"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
                stroke="#9ca3af"
              />
              <YAxis
                type="category"
                dataKey="label"
                fontSize={11}
                width={170}
                tickLine={false}
                axisLine={false}
                stroke="#374151"
              />
              <Tooltip
                contentStyle={{
                  background: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: 8,
                  fontSize: 12,
                  padding: '8px 12px',
                }}
                cursor={{ fill: 'rgba(21, 128, 61, 0.06)' }}
              />
              <Bar
                dataKey="count"
                name="Applications"
                fill="#15803d"
                radius={[0, 4, 4, 0]}
                barSize={18}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}