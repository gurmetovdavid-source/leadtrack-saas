'use client';

import { useEffect, useState } from 'react';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AppState } from '@/lib/types';
import { getState, resetDemo, saveState } from '@/lib/storage';
import { ShieldCheck, User, RotateCcw, Moon, Sun } from 'lucide-react';

export default function SettingsPage() {
  const [state, setState] = useState<AppState | null>(null);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setState(getState());
    setDark(document.documentElement.classList.contains('dark'));
  }, []);

  if (!state) return null;

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    if (next) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  };

  return (
    <div className="page-container">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Settings</h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">Manage demo preferences and application data.</p>
      </header>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardTitle className="mb-1">Demo Profile</CardTitle>
          <CardDescription className="mb-6">The current demo user role and access level.</CardDescription>
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-xl font-bold text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">
              JD
            </div>
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">John Doe</p>
              <p className="text-sm text-slate-500">john@leadtrack.example</p>
              <Badge className="mt-2 bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">
                <ShieldCheck size={12} className="mr-1" /> Admin + Partner access
              </Badge>
            </div>
          </div>
        </Card>

        <Card>
          <CardTitle className="mb-1">Appearance</CardTitle>
          <CardDescription className="mb-6">Toggle between light and dark mode.</CardDescription>
          <Button variant="outline" onClick={toggleTheme}>
            {dark ? <Sun size={16} className="mr-2" /> : <Moon size={16} className="mr-2" />}
            {dark ? 'Switch to light mode' : 'Switch to dark mode'}
          </Button>
        </Card>

        <Card>
          <CardTitle className="mb-1">Reset Demo Data</CardTitle>
          <CardDescription className="mb-6">Restore the initial demo dataset.</CardDescription>
          <Button variant="secondary" onClick={() => setState(resetDemo())}>
            <RotateCcw size={16} className="mr-2" /> Reset demo
          </Button>
        </Card>

        <Card>
          <CardTitle className="mb-1">Data Overview</CardTitle>
          <CardDescription className="mb-6">Summary of records stored in the demo.</CardDescription>
          <div className="grid grid-cols-2 gap-4">
            <Stat label="Partners" value={state.partners.length} />
            <Stat label="Offers" value={state.offers.length} />
            <Stat label="Leads" value={state.leads.length} />
            <Stat label="Events" value={state.events.length} />
            <Stat label="Settlements" value={state.settlements.length} />
          </div>
        </Card>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50">
      <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
    </div>
  );
}
