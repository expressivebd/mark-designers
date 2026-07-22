import AdminPageHeader from '@/components/admin/AdminPageHeader';
import SiteContentsManager from '@/components/admin/SiteContentsManager';

export default function ContentsAdmin() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Contents"
        description="Upload site-wide files shown on the main website, such as the navbar Catalog and Company Profile downloads."
      />
      <SiteContentsManager />
    </div>
  );
}
