'use client';

const AdminCard = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      {children}
    </div>
  );
};

export default AdminCard;
