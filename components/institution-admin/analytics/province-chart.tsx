'use client';

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

interface DataPoint {
  province: string;
  count: number;
}

interface ProvinceChartProps {
  data: DataPoint[];
}

/**
 * Vertical bar chart of applicants by home province.
 * Shows geographic reach across Zambia's 10 provinces.
 */
export function ProvinceChart({ data }: ProvinceChartProps) {
  const totalProvinces = data.length;

  return (
    <div className="rounded-xl border border-border bg-white p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-ink text-sm">Applicants by province</h3>
          <p className="text-xs text-ink-50 mt-0.5">Geographic reach</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-ink-50">Provinces</p>
          <p className="font-display text-2xl text-ink leading-none mt-0.5">{totalProvinces}</p>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="h-56 flex items-center justify-center text-sm text-ink-50">
          No applicants with recorded province yet
        </div>
      ) : (
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis
                dataKey="province"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                stroke="#9ca3af"
                angle={-25}
                textAnchor="end"
                height={50}
                interval={0}
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
                cursor={{ fill: 'rgba(21, 128, 61, 0.06)' }}
              />
              <Bar
                dataKey="count"
                name="Applicants"
                fill="#15803d"
                radius={[4, 4, 0, 0]}
                barSize={22}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}