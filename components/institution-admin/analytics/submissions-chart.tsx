'use client';

import * as React from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

interface DataPoint {
  date: string;
  count: number;
}

interface SubmissionsChartProps {
  data: DataPoint[];
}

/**
 * Daily applications received over the last 30 days.
 * Shows momentum and helps spot enrolment surges/dips.
 */
export function SubmissionsChart({ data }: SubmissionsChartProps) {
  // Format dates as short labels like "5 Jun" for the X axis
  const formatted = React.useMemo(
    () => data.map(d => ({
      ...d,
      label: new Date(d.date).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
      }),
    })),
    [data],
  );

  const total = data.reduce((acc, d) => acc + d.count, 0);
  const peak  = Math.max(...data.map(d => d.count), 0);

  return (
    <div className="rounded-xl border border-border bg-white p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-ink text-sm">Applications over time</h3>
          <p className="text-xs text-ink-50 mt-0.5">Last 30 days</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-ink-50">Total</p>
          <p className="font-display text-2xl text-ink leading-none mt-0.5">{total}</p>
        </div>
      </div>

      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={formatted} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis
              dataKey="label"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
              minTickGap={20}
              stroke="#9ca3af"
            />
            <YAxis
              fontSize={10}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
              stroke="#9ca3af"
            />
            <Tooltip
              contentStyle={{
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: 8,
                fontSize: 12,
                padding: '8px 12px',
              }}
              labelStyle={{ color: '#374151', fontWeight: 600 }}
              cursor={{ stroke: '#15803d', strokeWidth: 1, strokeDasharray: '4 4' }}
            />
            <Line
              type="monotone"
              dataKey="count"
              name="Applications"
              stroke="#15803d"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#15803d' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="text-xs text-ink-50 mt-3 pt-3 border-t border-border">
        Peak day: <strong className="text-ink">{peak}</strong> {peak === 1 ? 'application' : 'applications'}
      </p>
    </div>
  );
}