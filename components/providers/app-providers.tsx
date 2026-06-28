'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<'admin' | 'partner'>('admin');
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const toggleRole = () => {
    const next = role === 'admin' ? 'partner' : 'admin';
    setRole(next);
    if (
      next === 'partner' &&
      pathname !== '/portal' &&
      !pathname.startsWith('/leads') &&
      !pathname.startsWith('/settlements') &&
      !pathname.startsWith('/settings')
    ) {
      router.push('/portal');
    } else if (next === 'admin' && pathname === '/portal') {
      router.push('/');
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar role={role} mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="flex flex-1 flex-col lg:ml-0">
        <Topbar role={role} onToggleRole={toggleRole} onOpenSidebar={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-6 lg:p-8 dark:bg-slate-950">
          {children}
        </main>
      </div>
    </div>
  );
}
