import AdminPageHeader from '@/components/admin/AdminPageHeader';
import CollectionManager from '@/components/admin/CollectionManager';

export default function ClientManagementAdmin() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Client Management"
        description="Manage client and partner logos."
      />
      <CollectionManager
        title="Client"
        endpoint="/api/admin/clients"
        folder="clients"
        fields={[
          { name: 'name', label: 'Name', type: 'text' },
          { name: 'logoUrl', label: 'Logo', type: 'image' },
        ]}
      />
    </div>
  );
}
