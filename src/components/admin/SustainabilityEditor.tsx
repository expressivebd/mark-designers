'use client';

import SustainabilityCardEditor from './SustainabilityCardEditor';

type SustainabilityCard = {
  title: string;
  imageUrl: string;
  description: string;
  link: string;
};

type SustainabilityEditorProps = {
  items: SustainabilityCard[];
  onChange: (items: SustainabilityCard[]) => void;
};

const SustainabilityEditor = ({ items, onChange }: SustainabilityEditorProps) => {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {items.map((item, index) => (
        <SustainabilityCardEditor
          key={index}
          index={index}
          value={item}
          onChange={(value) => {
            const next = [...items];
            next[index] = value;
            onChange(next);
          }}
        />
      ))}
    </div>
  );
};

export default SustainabilityEditor;
