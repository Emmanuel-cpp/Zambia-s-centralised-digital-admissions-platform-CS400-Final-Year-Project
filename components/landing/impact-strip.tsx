const STATS = [
  { value: '12+',    label: 'Higher learning institutions' },
  { value: '500+',   label: 'Programmes listed' },
  { value: '2,400+', label: 'Applications submitted' },
  { value: 'Free',   label: 'Always free for students' },
] as const;

export function ImpactStrip() {
  return (
    <section className="bg-brand-700">
      <div className="container py-10 sm:py-12 grid grid-cols-2 lg:grid-cols-4 gap-y-8">
        {STATS.map((stat, i) => (
          <div
            key={stat.label}
            className={`text-center px-3 sm:px-6 ${i < STATS.length - 1 ? 'lg:border-r lg:border-white/15' : ''}`}
          >
            <p className="font-display text-3xl sm:text-4xl text-white leading-none">
              {stat.value}
            </p>
            <p className="mt-2 text-xs sm:text-sm text-white/65 font-medium">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
