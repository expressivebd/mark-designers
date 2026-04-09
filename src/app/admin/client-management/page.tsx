import AdminPageHeader from '@/components/admin/AdminPageHeader';
import ClientManager from '@/components/admin/ClientManager';

export default function ClientManagementAdmin() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Client Management"
        description="Manage client and partner logos."
      />
      <ClientManager />
    </div>
  );
}
