'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AppState, Lead } from '@/lib/types';
import { getState } from '@/lib/storage';
import { formatCurrency, formatDate, statusColor } from '@/lib/utils';
import { TrendingUp, UserCircle, Landmark, Gift } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// Demo partner ID for portal view
const PORTAL_PARTNER_ID = 'p1';

export default function PartnerPortalPage() {
  const [state, setState] = useState<AppState | null>(null);

  useEffect(() => {
    setState(getState());
  }, []);

  if (!state) return null;

  const partner = state.partners.find((p) => p.id === PORTAL_PARTNER_ID);
  const myLeads = state.leads.filter((l) => l.partnerId === PORTAL_PARTNER_ID);
  const converted = myLeads.filter((l) => l.status === 'converted');
  const revenue = converted.reduce((sum, l) => sum + (l.value || 0), 0);
  const commissionEstimate = revenue * ((partner?.commissionRate || 0) / 100);

  const monthly = useMemo(() => {
    const map = new Map<string, { leads: number; revenue: number }>();
    myLeads.forEach((l) => {
      const key = l.createdAt.slice(0, 7);
      const entry = map.get(key) || { leads: 0, revenue: 0 };
      entry.leads += 1;
      if (l.status === 'converted' && l.value) entry.revenue += l.value;
      map.set(key, entry);
    });
    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => ({ month, ...data }));
  }, [myLeads]);

  return (
    <div className="page-container">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Partner Portal</h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">Welcome back, {partner?.name}. Here is your performance overview.</p>
      </header>

      <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Assigned Leads</p>
              <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{myLeads.length}</p>
            </div>
            <div className="rounded-lg bg-brand-50 p-2 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400">
              <UserCircle size={20} />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Conversions</p>
              <p className="mt-1 text-2xl font-bold text-emerald-600">{converted.length}</p>
            </div>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400">
              <TrendingUp size={20} />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Revenue Generated</p>
              <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{formatCurrency(revenue)}</p>
            </div>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
              <Gift size={20} />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Est. Commission</p>
              <p className="mt-1 text-2xl font-bold text-brand-600 dark:text-brand-400">{formatCurrency(commissionEstimate)}</p>
            </div>
            <div className="rounded-lg bg-amber-50 p-2 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400">
              <Landmark size={20} />
            </div>
          </div>
        </Card>
      </section>

      <section className="mb-8 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardTitle className="mb-4">Monthly Performance</CardTitle>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthly}>
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v: number, name: string) => [name === 'revenue' ? formatCurrency(v) : v, name]} />
                <Bar dataKey="leads" fill="#4f46e5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardTitle className="mb-4">My Recent Leads</CardTitle>
          <div className="space-y-3">
            {myLeads.slice(0, 5).map((lead) => (
              <LeadRow key={lead.id} lead={lead} />
            ))}
          </div>
        </Card>
      </section>

      <section>
        <Card>
          <div className="mb-4">
            <CardTitle>Settlement History</CardTitle>
            <CardDescription>Commissions calculated from converted leads.</CardDescription>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 text-slate-500 dark:border-slate-800 dark:text-slate-400">
                <tr>
                  <th className="pb-3 font-medium">Period</th>
                  <th className="pb-3 font-medium">Leads</th>
                  <th className="pb-3 font-medium">Amount</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {state.settlements
                  .filter((s) => s.partnerId === PORTAL_PARTNER_ID)
                  .map((s) => (
                    <tr key={s.id} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                      <td className="py-3 text-slate-900 dark:text-white">{s.period}</td>
                      <td className="py-3 text-slate-600 dark:text-slate-400">{s.leadsCount}</td>
                      <td className="py-3 font-semibold text-slate-900 dark:text-white">{formatCurrency(s.amount, s.currency)}</td>
                      <td className="py-3"><Badge className={statusColor(s.status)}>{s.status}</Badge></td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>
    </div>
  );
}

function LeadRow({ lead }: { lead: Lead }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-100 p-3 dark:border-slate-800">
      <div>
        <p className="font-medium text-slate-900 dark:text-white">{lead.firstName} {lead.lastName}</p>
        <p className="text-xs text-slate-500">{lead.email}</p>
      </div>
      <div className="text-right">
        <Badge className={statusColor(lead.status)}>{lead.status}</Badge>
        <p className="mt-1 text-xs text-slate-500">{formatDate(lead.createdAt)}</p>
      </div>
    </div>
  );
}
