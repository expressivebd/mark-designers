import AdminPageHeader from '@/components/admin/AdminPageHeader';
import CollectionManager from '@/components/admin/CollectionManager';

export default function NewsManagementAdmin() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="News Management"
        description="Create and update news items for the homepage."
      />
      <CollectionManager
        title="News"
        endpoint="/api/admin/news"
        folder="news"
        fields={[
          { name: 'title', label: 'Title', type: 'text' },
          { name: 'date', label: 'Date', type: 'date' },
          { name: 'excerpt', label: 'Excerpt', type: 'textarea' },
          { name: 'imageUrl', label: 'Image', type: 'image' },
          { name: 'link', label: 'Link', type: 'text', placeholder: '/news' },
        ]}
      />
    </div>
  );
}
