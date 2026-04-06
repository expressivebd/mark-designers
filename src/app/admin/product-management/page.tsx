import AdminPageHeader from '@/components/admin/AdminPageHeader';
import CollectionManager from '@/components/admin/CollectionManager';

export default function ProductManagementAdmin() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Product Management"
        description="Manage the product cards displayed on the homepage."
      />
      <CollectionManager
        title="Product"
        endpoint="/api/admin/products"
        folder="products"
        fields={[
          { name: 'name', label: 'Name', type: 'text' },
          { name: 'imageUrl', label: 'Image', type: 'image' },
        ]}
      />
    </div>
  );
}
