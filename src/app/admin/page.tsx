import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminSectionCard from '@/components/admin/AdminSectionCard';

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Dashboard"
        description="Manage homepage content and all core sections from here."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <AdminSectionCard
          title="Homepage"
          description="Hero, About, Sustainability, and section shortcuts."
          href="/admin/homepage"
        />
        <AdminSectionCard
          title="About Page"
          description="Manage journey, stats, facilities, and expertise content."
          href="/admin/about"
        />
        <AdminSectionCard
          title="Contact Page"
          description="Manage contact addresses, phone numbers, emails, and map locations."
          href="/admin/contact"
        />
        <AdminSectionCard
          title="Our Facilities"
          description="Update facility cards and descriptions."
          href="/admin/our-facilities"
        />
        <AdminSectionCard
          title="Contents"
          description="Upload the navbar Catalog and Company Profile PDFs."
          href="/admin/contents"
        />
        <AdminSectionCard
          title="Products"
          description="Manage the product grid shown on the homepage."
          href="/admin/product-management"
        />
        <AdminSectionCard
          title="Certifications"
          description="Update certification logos and names."
          href="/admin/certification-management"
        />
        <AdminSectionCard
          title="Clients & Partners"
          description="Manage client logo carousel."
          href="/admin/client-management"
        />
        <AdminSectionCard
          title="News & Media"
          description="Publish and update news items."
          href="/admin/news-management"
        />
      </div>
    </div>
  );
}
