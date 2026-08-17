import AdminPageHeader from '@/components/admin/AdminPageHeader';
import SisterConcernManager from '@/components/admin/SisterConcernManager';

export default function SisterConcernsAdmin() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Our Facilities"
        description="Manage facilities for homepage, listing, and detail pages from one place."
      />
      <SisterConcernManager />
    </div>
  );
}
