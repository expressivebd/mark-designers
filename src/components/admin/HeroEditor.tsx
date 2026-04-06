'use client';

import UploadField from './UploadField';
import HeadlineInput from './HeadlineInput';

type HeroData = {
  videoUrl: string;
  headlines: string[];
  subheadline: string;
};

type HeroEditorProps = {
  value: HeroData;
  onChange: (value: HeroData) => void;
};

const HeroEditor = ({ value, onChange }: HeroEditorProps) => {
  return (
    <div className="space-y-4">
      <UploadField
        label="Hero Video"
        value={value.videoUrl}
        accept="video/*"
        folder="hero"
        onChange={(url) => onChange({ ...value, videoUrl: url })}
      />
      <div className="space-y-2">
        <label className="block text-sm font-medium text-primary">Headlines</label>
        <HeadlineInput
          headlines={value.headlines}
          onChange={(headlines) => onChange({ ...value, headlines })}
        />
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-primary">Subheadline</label>
        <textarea
          value={value.subheadline}
          onChange={(event) => onChange({ ...value, subheadline: event.target.value })}
          className="w-full rounded-sm border border-slate-200 px-3 py-2 text-sm"
          rows={3}
        />
      </div>
    </div>
  );
};

export default HeroEditor;
