'use client';

type HeadlineInputProps = {
  headlines: string[];
  onChange: (headlines: string[]) => void;
};

const HeadlineInput = ({ headlines, onChange }: HeadlineInputProps) => {
  return (
    <div className="space-y-3">
      {headlines.map((headline, index) => (
        <div key={index} className="flex items-center gap-2">
          <input
            type="text"
            value={headline}
            onChange={(event) => {
              const next = [...headlines];
              next[index] = event.target.value;
              onChange(next);
            }}
            className="w-full rounded-sm border border-slate-200 px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={() => {
              const next = headlines.filter((_, i) => i !== index);
              onChange(next.length ? next : ['']);
            }}
            className="rounded-sm border border-red-200 px-3 py-2 text-xs font-medium text-red-600"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...headlines, ''])}
        className="rounded-sm border border-slate-200 px-3 py-2 text-xs font-medium text-primary"
      >
        Add Headline
      </button>
    </div>
  );
};

export default HeadlineInput;
