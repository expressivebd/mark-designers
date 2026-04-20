import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AboutPageController from '@/components/admin/AboutPageController';

export default function AboutAdminPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="About Page Control"
        description="Manage journey text, stats, facilities, and expertise for the About page."
      />
      <AboutPageController />
    </div>
  );
}
