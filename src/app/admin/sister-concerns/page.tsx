import AdminPageHeader from '@/components/admin/AdminPageHeader';
import CollectionManager from '@/components/admin/CollectionManager';

export default function SisterConcernsAdmin() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Sister Concerns"
        description="Manage the sister concern cards shown on the homepage."
      />
      <CollectionManager
        title="Sister Concern"
        endpoint="/api/admin/sister-concerns"
        folder="sister-concerns"
        fields={[
          { name: 'name', label: 'Name', type: 'text' },
          { name: 'imageUrl', label: 'Image', type: 'image' },
          { name: 'description', label: 'Description', type: 'textarea' },
          { name: 'link', label: 'Link', type: 'text', placeholder: '/sister-concerns' },
        ]}
      />
    </div>
  );
}
