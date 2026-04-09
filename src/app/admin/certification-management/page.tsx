import AdminPageHeader from '@/components/admin/AdminPageHeader';
import CertificationManager from '@/components/admin/CertificationManager';

export default function CertificationManagementAdmin() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Certification Management"
        description="Manage certification logos for the homepage carousel."
      />
      <CertificationManager />
    </div>
  );
}
