'use client';

import { useEffect, useState } from 'react';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AppState, Offer } from '@/lib/types';
import { addOffer, getState, saveState } from '@/lib/storage';
import { formatCurrency, statusColor } from '@/lib/utils';
import { Gift, Plus, Search, SlidersHorizontal } from 'lucide-react';

const categories = ['Software', 'Services', 'Support', 'Marketing', 'Other'];

export default function OffersPage() {
  const [state, setState] = useState<AppState | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<Offer>>({
    category: categories[0],
    commissionType: 'percentage',
    currency: 'USD',
    status: 'active',
  });

  useEffect(() => {
    setState(getState());
  }, []);

  if (!state) return null;

  const filtered = state.offers.filter((o) => {
    const matchesSearch = o.title.toLowerCase().includes(search.toLowerCase()) || o.description.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || o.status === filter || o.category === filter;
    return matchesSearch && matchesFilter;
  });

  const handleAdd = () => {
    if (!form.title || !form.price || !form.commissionRate) return;
    const next = addOffer(state, {
      title: form.title,
      description: form.description || '',
      category: form.category || categories[0],
      price: Number(form.price),
      currency: form.currency || 'USD',
      commissionRate: Number(form.commissionRate),
      commissionType: form.commissionType || 'percentage',
      status: form.status || 'active',
    });
    setState(next);
    setShowForm(false);
    setForm({ category: categories[0], commissionType: 'percentage', currency: 'USD', status: 'active' });
  };

  return (
    <div className="page-container">
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Offers</h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">Manage partner offers, pricing and commission rules.</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus size={16} className="mr-2" /> New offer
        </Button>
      </header>

      {showForm && (
        <Card className="mb-6">
          <CardTitle>Create new offer</CardTitle>
          <CardDescription className="mb-4">Add an offer that partners can promote.</CardDescription>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Input placeholder="Offer title" value={form.title || ''} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <Select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </Select>
            <Input type="number" placeholder="Price" value={form.price || ''} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
            <Select value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })}>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </Select>
            <Input type="number" placeholder="Commission rate" value={form.commissionRate || ''} onChange={(e) => setForm({ ...form, commissionRate: Number(e.target.value) })} />
            <Select value={form.commissionType} onChange={(e) => setForm({ ...form, commissionType: e.target.value as Offer['commissionType'] })}>
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed</option>
            </Select>
            <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Offer['status'] })}>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="archived">Archived</option>
            </Select>
            <Input className="sm:col-span-2 lg:col-span-2" placeholder="Description" value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="mt-4 flex gap-2">
            <Button onClick={handleAdd}>Save offer</Button>
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </Card>
      )}

      <Card>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search offers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 sm:w-64"
            />
          </div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={16} className="text-slate-400" />
            <Select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="archived">Archived</option>
              <option value="Software">Software</option>
              <option value="Services">Services</option>
            </Select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((offer) => (
            <div
              key={offer.id}
              className="group relative rounded-xl border border-slate-200 bg-white p-5 transition-all hover:border-brand-300 hover:shadow-card dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="mb-3 flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400">
                  <Gift size={20} />
                </div>
                <Badge className={statusColor(offer.status)}>{offer.status}</Badge>
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">{offer.title}</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{offer.description}</p>
              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Price</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{formatCurrency(offer.price, offer.currency)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Commission</p>
                  <p className="text-sm font-semibold text-brand-600 dark:text-brand-400">
                    {offer.commissionType === 'percentage' ? `${offer.commissionRate}%` : formatCurrency(offer.commissionRate, offer.currency)}
                  </p>
                </div>
              </div>
              <div className="mt-3 inline-flex rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                {offer.category}
              </div>
            </div>
          ))}
        </div>
        {filtered.length === 0 && <p className="py-10 text-center text-sm text-slate-500">No offers found.</p>}
      </Card>
    </div>
  );
}
