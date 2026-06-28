'use client';

import { useEffect, useState } from 'react';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AppState, Partner } from '@/lib/types';
import { addPartner, getState } from '@/lib/storage';
import { formatDate, initials, statusColor, typeColor } from '@/lib/utils';
import { Users, Plus, Search, Mail, Globe } from 'lucide-react';

const partnerTypes = ['affiliate', 'agency', 'sales_agent', 'distributor'];

export default function PartnersPage() {
  const [state, setState] = useState<AppState | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<Partner>>({ type: 'affiliate', status: 'active', commissionRate: 10 });

  useEffect(() => {
    setState(getState());
  }, []);

  if (!state) return null;

  const filtered = state.partners.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.email.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || p.type === filter || p.status === filter;
    return matchesSearch && matchesFilter;
  });

  const handleAdd = () => {
    if (!form.name || !form.email || !form.commissionRate) return;
    const next = addPartner(state, {
      name: form.name,
      email: form.email,
      type: form.type || 'affiliate',
      website: form.website,
      commissionRate: Number(form.commissionRate),
      status: form.status || 'active',
    });
    setState(next);
    setShowForm(false);
    setForm({ type: 'affiliate', status: 'active', commissionRate: 10 });
  };

  const partnerStats = (partnerId: string) => {
    const leads = state.leads.filter((l) => l.partnerId === partnerId);
    const converted = leads.filter((l) => l.status === 'converted');
    const revenue = converted.reduce((sum, l) => sum + (l.value || 0), 0);
    return { leads: leads.length, converted: converted.length, revenue };
  };

  return (
    <div className="page-container">
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Partners</h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">Manage affiliates, agencies and sales agents.</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus size={16} className="mr-2" /> Add partner
        </Button>
      </header>

      {showForm && (
        <Card className="mb-6">
          <CardTitle>Add partner</CardTitle>
          <CardDescription className="mb-4">Invite a new partner to the program.</CardDescription>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Input placeholder="Partner name" value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input type="email" placeholder="Email" value={form.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <Input placeholder="Website (optional)" value={form.website || ''} onChange={(e) => setForm({ ...form, website: e.target.value })} />
            <Select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as Partner['type'] })}>
              {partnerTypes.map((t) => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
            </Select>
            <Input type="number" placeholder="Commission rate (%)" value={form.commissionRate || ''} onChange={(e) => setForm({ ...form, commissionRate: Number(e.target.value) })} />
            <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Partner['status'] })}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </Select>
          </div>
          <div className="mt-4 flex gap-2">
            <Button onClick={handleAdd}>Save partner</Button>
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </Card>
      )}

      <Card>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search partners..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 sm:w-64"
            />
          </div>
          <Select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All types</option>
            {partnerTypes.map((t) => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </Select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => {
            const stats = partnerStats(p.id);
            return (
              <div key={p.id} className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">
                      {initials(p.name, '')}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">{p.name}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{p.email}</p>
                    </div>
                  </div>
                  <Badge className={statusColor(p.status)}>{p.status}</Badge>
                </div>

                <div className="mb-4 flex flex-wrap gap-2">
                  <Badge className={typeColor(p.type)}>{p.type.replace('_', ' ')}</Badge>
                  <Badge className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">{p.commissionRate}% commission</Badge>
                </div>

                <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
                  <div className="text-center">
                    <p className="text-lg font-bold text-slate-900 dark:text-white">{stats.leads}</p>
                    <p className="text-xs text-slate-500">Leads</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-slate-900 dark:text-white">{stats.converted}</p>
                    <p className="text-xs text-slate-500">Won</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">${Math.round(stats.revenue)}</p>
                    <p className="text-xs text-slate-500">Revenue</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>Joined {formatDate(p.joinedAt)}</span>
                  {p.website && (
                    <a href={`https://${p.website}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-brand-600 hover:underline dark:text-brand-400">
                      <Globe size={12} /> {p.website}
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {filtered.length === 0 && <p className="py-10 text-center text-sm text-slate-500">No partners found.</p>}
      </Card>
    </div>
  );
}
