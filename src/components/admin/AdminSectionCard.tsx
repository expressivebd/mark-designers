'use client';

import Link from 'next/link';

type AdminSectionCardProps = {
  title: string;
  description: string;
  href: string;
};

const AdminSectionCard = ({ title, description, href }: AdminSectionCardProps) => {
  return (
    <Link
      href={href}
      className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm hover:border-accent hover:shadow-md transition-all"
    >
      <h3 className="text-lg font-playfair font-semibold text-primary">{title}</h3>
      <p className="mt-2 text-sm text-gray-600">{description}</p>
      <span className="mt-4 inline-flex text-sm font-medium text-accent">Manage</span>
    </Link>
  );
};

export default AdminSectionCard;
