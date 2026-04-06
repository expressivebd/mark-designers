'use client';

import UploadField from './UploadField';

type SustainabilityCard = {
  title: string;
  imageUrl: string;
  description: string;
  link: string;
};

type SustainabilityCardEditorProps = {
  index: number;
  value: SustainabilityCard;
  onChange: (value: SustainabilityCard) => void;
};

const SustainabilityCardEditor = ({ index, value, onChange }: SustainabilityCardEditorProps) => {
  return (
    <div className="rounded-md border border-slate-200 p-4 space-y-3">
      <h4 className="text-sm font-semibold text-primary">Card {index + 1}</h4>
      <UploadField
        label="Image"
        value={value.imageUrl}
        accept="image/*"
        folder="sustainability"
        onChange={(url) => onChange({ ...value, imageUrl: url })}
      />
      <div className="space-y-2">
        <label className="block text-sm font-medium text-primary">Title</label>
        <input
          type="text"
          value={value.title}
          onChange={(event) => onChange({ ...value, title: event.target.value })}
          className="w-full rounded-sm border border-slate-200 px-3 py-2 text-sm"
        />
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-primary">Description</label>
        <textarea
          value={value.description}
          onChange={(event) => onChange({ ...value, description: event.target.value })}
          className="w-full rounded-sm border border-slate-200 px-3 py-2 text-sm"
          rows={3}
        />
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-primary">Link</label>
        <input
          type="text"
          value={value.link}
          onChange={(event) => onChange({ ...value, link: event.target.value })}
          className="w-full rounded-sm border border-slate-200 px-3 py-2 text-sm"
        />
      </div>
    </div>
  );
};

export default SustainabilityCardEditor;
