'use client';

import { useEffect, useState } from 'react';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';
import { AppState, Settlement, SettlementStatus } from '@/lib/types';
import { addSettlement, getState, saveState } from '@/lib/storage';
import { formatCurrency, statusColor } from '@/lib/utils';
import { Landmark, Plus, Download } from 'lucide-react';

const statuses: SettlementStatus[] = ['pending', 'confirmed', 'payable', 'paid', 'canceled', 'clawback'];

export default function SettlementsPage() {
  const [state, setState] = useState<AppState | null>(null);
  const [filter, setFilter] = useState<SettlementStatus | 'all'>('all');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<Settlement>>({ status: 'pending', currency: 'USD', leadsCount: 1 });

  useEffect(() => {
    setState(getState());
  }, []);

  if (!state) return null;

  const filtered = state.settlements
    .filter((s) => filter === 'all' || s.status === filter)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const totalPayable = state.settlements
    .filter((s) => s.status === 'payable')
    .reduce((sum, s) => sum + s.amount, 0);

  const handleAdd = () => {
    if (!form.partnerId || !form.period || !form.amount) return;
    const next = addSettlement(state, {
      partnerId: form.partnerId,
      period: form.period,
      amount: Number(form.amount),
      currency: form.currency || 'USD',
      status: form.status || 'pending',
      leadsCount: Number(form.leadsCount) || 0,
    });
    setState(next);
    setShowForm(false);
    setForm({ status: 'pending', currency: 'USD', leadsCount: 1 });
  };

  const markPaid = (id: string) => {
    const next = {
      ...state,
      settlements: state.settlements.map((s) =>
        s.id === id ? { ...s, status: 'paid' as SettlementStatus, paidAt: new Date().toISOString() } : s
      ),
    };
    saveState(next);
    setState(next);
  };

  return (
    <div className="page-container">
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Settlements</h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">Track partner commissions and payouts.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download size={16} className="mr-2" /> Export
          </Button>
          <Button size="sm" onClick={() => setShowForm(true)}>
            <Plus size={16} className="mr-2" /> Add settlement
          </Button>
        </div>
      </header>

      <section className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <p className="text-sm text-slate-500 dark:text-slate-400">Total Payable</p>
          <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{formatCurrency(totalPayable)}</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500 dark:text-slate-400">Pending</p>
          <p className="mt-1 text-2xl font-bold text-amber-600">
            {formatCurrency(state.settlements.filter((s) => s.status === 'pending').reduce((sum, s) => sum + s.amount, 0))}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500 dark:text-slate-400">Paid This Month</p>
          <p className="mt-1 text-2xl font-bold text-emerald-600">
            {formatCurrency(state.settlements.filter((s) => s.status === 'paid').reduce((sum, s) => sum + s.amount, 0))}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500 dark:text-slate-400">Total Partners</p>
          <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{state.partners.length}</p>
        </Card>
      </section>

      {showForm && (
        <Card className="mb-6">
          <CardTitle className="mb-4">Record settlement</CardTitle>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Select value={form.partnerId} onChange={(e) => setForm({ ...form, partnerId: e.target.value })}>
              <option value="">Select partner</option>
              {state.partners.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </Select>
            <Input placeholder="Period (YYYY-MM)" value={form.period || ''} onChange={(e) => setForm({ ...form, period: e.target.value })} />
            <Input type="number" placeholder="Amount" value={form.amount || ''} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} />
            <Select value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })}>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </Select>
            <Input type="number" placeholder="Leads count" value={form.leadsCount || ''} onChange={(e) => setForm({ ...form, leadsCount: Number(e.target.value) })} />
            <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as SettlementStatus })}>
              {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
            </Select>
          </div>
          <div className="mt-4 flex gap-2">
            <Button onClick={handleAdd}>Save</Button>
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </Card>
      )}

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <CardTitle>Settlement Ledger</CardTitle>
          <Select value={filter} onChange={(e) => setFilter(e.target.value as SettlementStatus | 'all')}>
            <option value="all">All statuses</option>
            {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
          </Select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-slate-500 dark:border-slate-800 dark:text-slate-400">
              <tr>
                <th className="pb-3 font-medium">Partner</th>
                <th className="pb-3 font-medium">Period</th>
                <th className="pb-3 font-medium">Leads</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Created</th>
                <th className="pb-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => {
                const partner = state.partners.find((p) => p.id === s.partnerId);
                return (
                  <tr key={s.id} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                    <td className="py-3 font-medium text-slate-900 dark:text-white">{partner?.name || 'Unknown'}</td>
                    <td className="py-3 text-slate-600 dark:text-slate-400">{s.period}</td>
                    <td className="py-3 text-slate-600 dark:text-slate-400">{s.leadsCount}</td>
                    <td className="py-3 font-semibold text-slate-900 dark:text-white">{formatCurrency(s.amount, s.currency)}</td>
                    <td className="py-3"><Badge className={statusColor(s.status)}>{s.status}</Badge></td>
                    <td className="py-3 text-slate-500 dark:text-slate-400">{new Date(s.createdAt).toLocaleDateString()}</td>
                    <td className="py-3">
                      {s.status === 'payable' && (
                        <Button size="sm" onClick={() => markPaid(s.id)}>Mark paid</Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <p className="py-10 text-center text-sm text-slate-500">No settlements found.</p>}
      </Card>
    </div>
  );
}
