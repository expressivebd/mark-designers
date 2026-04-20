'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

const navItems = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'Homepage', href: '/admin/homepage' },
  { label: 'About', href: '/admin/about' },
  { label: 'Sister Concerns', href: '/admin/sister-concerns' },
  { label: 'Products', href: '/admin/product-management' },
  { label: 'Certifications', href: '/admin/certification-management' },
  { label: 'Clients', href: '/admin/client-management' },
  { label: 'News', href: '/admin/news-management' },
];

const AdminShell = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-64 bg-primary text-white px-6 py-8 hidden lg:flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-playfair font-bold">Admin Panel</h1>
          <p className="text-sm text-accent mt-2">Mark Designers</p>
        </div>
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-sm px-3 py-2 text-sm font-medium transition-colors ${
                  isActive ? 'bg-accent text-white' : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="rounded-sm border border-accent/60 px-3 py-2 text-sm font-medium text-accent hover:bg-accent hover:text-white"
        >
          Sign Out
        </button>
      </aside>
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 lg:hidden">
          <div>
            <h1 className="text-lg font-playfair font-bold text-primary">Admin Panel</h1>
            <p className="text-xs text-accent">Mark Designers</p>
          </div>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="rounded-sm border border-accent/60 px-3 py-2 text-xs font-medium text-accent"
          >
            Sign Out
          </button>
        </div>
        <div className="flex-1 px-6 py-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminShell;
