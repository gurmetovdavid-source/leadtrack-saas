'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Gift,
  Users,
  UserCircle,
  Route,
  CalendarClock,
  Landmark,
  Globe,
  Settings,
  X,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  role: 'admin' | 'partner';
  mobileOpen: boolean;
  onClose: () => void;
}

const adminLinks = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/offers', label: 'Offers', icon: Gift },
  { href: '/partners', label: 'Partners', icon: Users },
  { href: '/leads', label: 'Leads', icon: UserCircle },
  { href: '/events', label: 'Events', icon: CalendarClock },
  { href: '/settlements', label: 'Settlements', icon: Landmark },
  { href: '/widget-demo', label: 'Widget Demo', icon: Globe },
  { href: '/settings', label: 'Settings', icon: Settings },
];

const partnerLinks = [
  { href: '/portal', label: 'Partner Portal', icon: LayoutDashboard },
  { href: '/leads', label: 'My Leads', icon: UserCircle },
  { href: '/settlements', label: 'My Settlements', icon: Landmark },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ role, mobileOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const links = role === 'admin' ? adminLinks : partnerLinks;

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed left-0 top-0 z-50 h-full w-64 transform border-r border-slate-200 bg-white transition-transform duration-200 ease-out dark:border-slate-800 dark:bg-slate-900 lg:static lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5 dark:border-slate-800">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
              <Route size={18} />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">LeadTrack</span>
          </Link>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 lg:hidden">
            <X size={20} />
          </button>
        </div>

        <div className="p-3">
          <div className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            {role === 'admin' ? 'Admin Console' : 'Partner Area'}
          </div>
          <nav className="space-y-1">
            {links.map((link) => {
              const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-400'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon size={18} />
                    {link.label}
                  </span>
                  {active && <ChevronRight size={14} />}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 border-t border-slate-200 p-4 dark:border-slate-800">
          <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Logged in as</p>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              {role === 'admin' ? 'Admin User' : 'Partner User'}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
