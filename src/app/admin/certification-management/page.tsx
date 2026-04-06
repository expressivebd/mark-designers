import AdminPageHeader from '@/components/admin/AdminPageHeader';
import CollectionManager from '@/components/admin/CollectionManager';

export default function CertificationManagementAdmin() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Certification Management"
        description="Manage certification logos for the homepage carousel."
      />
      <CollectionManager
        title="Certification"
        endpoint="/api/admin/certifications"
        folder="certifications"
        fields={[
          { name: 'name', label: 'Name', type: 'text' },
          { name: 'logoUrl', label: 'Logo', type: 'image' },
        ]}
      />
    </div>
  );
}
