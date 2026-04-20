import AdminPageHeader from '@/components/admin/AdminPageHeader';
import ContactAddressManager from '@/components/admin/ContactAddressManager';

export default function ContactManagementAdmin() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Contact Management"
        description="Create, edit, and remove contact addresses for the contact page."
      />
      <ContactAddressManager />
    </div>
  );
}
