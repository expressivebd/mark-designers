'use client';

type AdminPageHeaderProps = {
  title: string;
  description?: string;
};

const AdminPageHeader = ({ title, description }: AdminPageHeaderProps) => {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-playfair font-bold text-primary">{title}</h1>
      {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
    </div>
  );
};

export default AdminPageHeader;
