'use client';

type StatItem = {
  label: string;
  number: number;
  suffix: string;
};

type StatsEditorProps = {
  stats: StatItem[];
  onChange: (stats: StatItem[]) => void;
};

const StatsEditor = ({ stats, onChange }: StatsEditorProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {stats.map((stat, index) => (
        <div key={index} className="rounded-md border border-slate-200 p-4 space-y-3">
          <h4 className="text-sm font-semibold text-primary">Stat {index + 1}</h4>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-primary">Label</label>
            <input
              type="text"
              value={stat.label}
              onChange={(event) => {
                const next = [...stats];
                next[index] = { ...next[index], label: event.target.value };
                onChange(next);
              }}
              className="w-full rounded-sm border border-slate-200 px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-primary">Number</label>
            <input
              type="number"
              value={stat.number}
              onChange={(event) => {
                const next = [...stats];
                next[index] = { ...next[index], number: Number(event.target.value) };
                onChange(next);
              }}
              className="w-full rounded-sm border border-slate-200 px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-primary">Suffix</label>
            <input
              type="text"
              value={stat.suffix}
              onChange={(event) => {
                const next = [...stats];
                next[index] = { ...next[index], suffix: event.target.value };
                onChange(next);
              }}
              className="w-full rounded-sm border border-slate-200 px-3 py-2 text-sm"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsEditor;
