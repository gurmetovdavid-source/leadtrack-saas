'use client';

import { useEffect, useState } from 'react';
import { Card, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AppState, Lead, LeadStatus } from '@/lib/types';
import { addLead, getState, updateLeadStatus } from '@/lib/storage';
import { formatCurrency, formatDate, initials, statusColor } from '@/lib/utils';
import { UserCircle, Plus, Search, Filter } from 'lucide-react';

const statuses: LeadStatus[] = ['new', 'contacted', 'qualified', 'converted', 'lost'];

export default function LeadsPage() {
  const [state, setState] = useState<AppState | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<Lead>>({ status: 'new', source: 'Direct' });

  useEffect(() => {
    setState(getState());
  }, []);

  if (!state) return null;

  const sources = Array.from(new Set(state.leads.map((l) => l.source)));

  const filtered = state.leads.filter((l) => {
    const fullName = `${l.firstName} ${l.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(search.toLowerCase()) || l.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || l.status === statusFilter;
    const matchesSource = sourceFilter === 'all' || l.source === sourceFilter;
    return matchesSearch && matchesStatus && matchesSource;
  });

  const handleAdd = () => {
    if (!form.firstName || !form.lastName || !form.email) return;
    const next = addLead(state, {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
      source: form.source || 'Direct',
      partnerId: form.partnerId,
      campaign: form.campaign,
      offerId: form.offerId,
      status: form.status || 'new',
      value: form.value ? Number(form.value) : undefined,
    });
    setState(next);
    setShowForm(false);
    setForm({ status: 'new', source: 'Direct' });
  };

  const handleStatusChange = (leadId: string, status: LeadStatus) => {
    const next = updateLeadStatus(state, leadId, status);
    setState(next);
  };

  return (
    <div className="page-container">
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Leads</h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">Track, qualify and convert customer leads.</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus size={16} className="mr-2" /> Add lead
        </Button>
      </header>

      {showForm && (
        <Card className="mb-6">
          <CardTitle className="mb-4">Add new lead</CardTitle>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Input placeholder="First name" value={form.firstName || ''} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
            <Input placeholder="Last name" value={form.lastName || ''} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
            <Input type="email" placeholder="Email" value={form.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <Input placeholder="Phone" value={form.phone || ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <Input placeholder="Source" value={form.source || ''} onChange={(e) => setForm({ ...form, source: e.target.value })} />
            <Input placeholder="Campaign (optional)" value={form.campaign || ''} onChange={(e) => setForm({ ...form, campaign: e.target.value })} />
            <Select value={form.offerId} onChange={(e) => setForm({ ...form, offerId: e.target.value })}>
              <option value="">Select offer</option>
              {state.offers.map((o) => <option key={o.id} value={o.id}>{o.title}</option>)}
            </Select>
            <Select value={form.partnerId} onChange={(e) => setForm({ ...form, partnerId: e.target.value })}>
              <option value="">Select partner</option>
              {state.partners.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </Select>
            <Input type="number" placeholder="Deal value" value={form.value || ''} onChange={(e) => setForm({ ...form, value: Number(e.target.value) })} />
          </div>
          <div className="mt-4 flex gap-2">
            <Button onClick={handleAdd}>Save lead</Button>
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </Card>
      )}

      <Card>
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search leads..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 lg:w-72"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Filter size={16} className="text-slate-400" />
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as LeadStatus | 'all')}>
              <option value="all">All statuses</option>
              {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
            </Select>
            <Select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)}>
              <option value="all">All sources</option>
              {sources.map((s) => <option key={s} value={s}>{s}</option>)}
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-slate-500 dark:border-slate-800 dark:text-slate-400">
              <tr>
                <th className="pb-3 font-medium">Lead</th>
                <th className="pb-3 font-medium">Source</th>
                <th className="pb-3 font-medium">Offer</th>
                <th className="pb-3 font-medium">Value</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Created</th>
                <th className="pb-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead) => {
                const offer = state.offers.find((o) => o.id === lead.offerId);
                return (
                  <tr key={lead.id} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          {initials(lead.firstName, lead.lastName)}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">{lead.firstName} {lead.lastName}</p>
                          <p className="text-xs text-slate-500">{lead.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-slate-600 dark:text-slate-400">{lead.source}</td>
                    <td className="py-3 text-slate-600 dark:text-slate-400">{offer?.title || '—'}</td>
                    <td className="py-3 font-medium text-slate-900 dark:text-white">{lead.value ? formatCurrency(lead.value) : '—'}</td>
                    <td className="py-3">
                      <Badge className={statusColor(lead.status)}>{lead.status}</Badge>
                    </td>
                    <td className="py-3 text-slate-500 dark:text-slate-400">{formatDate(lead.createdAt)}</td>
                    <td className="py-3">
                      <Select
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                        className="w-36"
                      >
                        {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                      </Select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <p className="py-10 text-center text-sm text-slate-500">No leads found.</p>}
      </Card>
    </div>
  );
}
