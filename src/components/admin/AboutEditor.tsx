'use client';

import StatsEditor from './StatsEditor';

type AboutData = {
  text: string;
  stats: Array<{ label: string; number: number; suffix: string }>;
};

type AboutEditorProps = {
  value: AboutData;
  onChange: (value: AboutData) => void;
};

const AboutEditor = ({ value, onChange }: AboutEditorProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-primary">About Text</label>
        <textarea
          value={value.text}
          onChange={(event) => onChange({ ...value, text: event.target.value })}
          className="w-full rounded-sm border border-slate-200 px-3 py-2 text-sm"
          rows={5}
        />
      </div>
      <StatsEditor
        stats={value.stats}
        onChange={(stats) => onChange({ ...value, stats })}
      />
    </div>
  );
};

export default AboutEditor;
