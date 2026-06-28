'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AppState, LeadEvent, Settlement } from '@/lib/types';
import { getState, resetDemo } from '@/lib/storage';
import { formatCurrency, formatDate, formatDateTime, statusColor } from '@/lib/utils';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import {
  Users,
  Gift,
  UserCircle,
  Landmark,
  TrendingUp,
  RotateCcw,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
} from 'lucide-react';
import Link from 'next/link';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#8b5cf6'];

export default function DashboardPage() {
  const [state, setState] = useState<AppState | null>(null);

  useEffect(() => {
    setState(getState());
  }, []);

  if (!state) return null;

  const totalLeads = state.leads.length;
  const convertedLeads = state.leads.filter((l) => l.status === 'converted').length;
  const conversionRate = totalLeads ? Math.round((convertedLeads / totalLeads) * 100) : 0;
  const totalRevenue = state.leads.reduce((sum, l) => sum + (l.value || 0), 0);
  const activePartners = state.partners.filter((p) => p.status === 'active').length;
  const pendingSettlements = state.settlements
    .filter((s) => s.status === 'payable' || s.status === 'pending')
    .reduce((sum, s) => sum + s.amount, 0);

  const leadsByStatus = useMemo(() => {
    const groups: Record<string, number> = {};
    state.leads.forEach((l) => {
      groups[l.status] = (groups[l.status] || 0) + 1;
    });
    return Object.entries(groups).map(([name, value]) => ({ name, value }));
  }, [state.leads]);

  const leadsBySource = useMemo(() => {
    const groups: Record<string, number> = {};
    state.leads.forEach((l) => {
      groups[l.source] = (groups[l.source] || 0) + 1;
    });
    return Object.entries(groups)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [state.leads]);

  const revenueTrend = useMemo(() => {
    const map = new Map<string, number>();
    state.leads.forEach((l) => {
      if (l.status === 'converted' && l.value) {
        const key = l.createdAt.slice(0, 7);
        map.set(key, (map.get(key) || 0) + l.value);
      }
    });
    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, amount]) => ({ month, amount }));
  }, [state.leads]);

  const recentEvents = [...state.events].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);
  const recentSettlements = [...state.settlements]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  return (
    <div className="page-container">
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Dashboard</h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">Overview of partners, leads, conversions and settlements.</p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => setState(resetDemo())}>
          <RotateCcw size={16} className="mr-2" /> Reset demo
        </Button>
      </header>

      <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Total Leads" value={totalLeads.toString()} change="+12%" up icon={UserCircle} />
        <KpiCard label="Conversion Rate" value={`${conversionRate}%`} change="+4%" up icon={TrendingUp} />
        <KpiCard label="Total Revenue" value={formatCurrency(totalRevenue)} change="+8%" up icon={Activity} />
        <KpiCard label="Active Partners" value={activePartners.toString()} change="+2" up icon={Users} />
      </section>

      <section className="mb-8 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <CardTitle>Revenue Trend</CardTitle>
            <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">+12% vs last month</Badge>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueTrend}>
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={(v) => `$${v}`} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v: number) => formatCurrency(v)} />
                <Line type="monotone" dataKey="amount" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardTitle className="mb-4">Leads by Status</CardTitle>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={leadsByStatus} dataKey="value" nameKey="name" outerRadius={90} innerRadius={50}>
                  {leadsByStatus.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {leadsByStatus.map((s, i) => (
              <div key={s.name} className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                {s.name} ({s.value})
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="mb-8 grid gap-4 lg:grid-cols-3">
        <Card>
          <CardTitle className="mb-4">Leads by Source</CardTitle>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={leadsBySource} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#4f46e5" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <CardTitle>Recent Events</CardTitle>
            <Link href="/events" className="text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {recentEvents.map((e) => (
              <EventRow key={e.id} event={e} />
            ))}
            {recentEvents.length === 0 && <p className="py-6 text-center text-sm text-slate-500">No events yet.</p>}
          </div>
        </Card>
      </section>

      <section>
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <CardTitle>Pending Settlements</CardTitle>
              <CardDescription>Commissions ready to be paid to partners.</CardDescription>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{formatCurrency(pendingSettlements)}</p>
              <p className="text-xs text-slate-500">Total pending</p>
            </div>
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
                </tr>
              </thead>
              <tbody>
                {recentSettlements.map((s) => {
                  const partner = state.partners.find((p) => p.id === s.partnerId);
                  return (
                    <tr key={s.id} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                      <td className="py-3 font-medium text-slate-900 dark:text-white">{partner?.name || 'Unknown'}</td>
                      <td className="py-3 text-slate-600 dark:text-slate-400">{s.period}</td>
                      <td className="py-3 text-slate-600 dark:text-slate-400">{s.leadsCount}</td>
                      <td className="py-3 font-semibold text-slate-900 dark:text-white">{formatCurrency(s.amount)}</td>
                      <td className="py-3">
                        <Badge className={statusColor(s.status)}>{s.status}</Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </section>
    </div>
  );
}

function KpiCard({
  label,
  value,
  change,
  up,
  icon: Icon,
}: {
  label: string;
  value: string;
  change: string;
  up: boolean;
  icon: React.ElementType;
}) {
  return (
    <Card className="relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
          <div className={`mt-2 flex items-center gap-1 text-xs font-medium ${up ? 'text-emerald-600' : 'text-rose-600'}`}>
            {up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {change}
            <span className="text-slate-400 font-normal"> vs last month</span>
          </div>
        </div>
        <div className="rounded-xl bg-brand-50 p-2.5 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400">
          <Icon size={20} />
        </div>
      </div>
    </Card>
  );
}

function EventRow({ event }: { event: LeadEvent }) {
  const status = event.type;
  return (
    <div className="flex items-start gap-3 rounded-lg border border-slate-100 p-3 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50">
      <div className={`mt-0.5 h-2 w-2 rounded-full ${statusColor(status).split(' ')[0]}`} />
      <div className="flex-1">
        <p className="text-sm font-medium text-slate-900 dark:text-white">{event.message}</p>
        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
          {formatDateTime(event.createdAt)} · by {event.actor}
        </p>
      </div>
      <Badge className={statusColor(status)}>{event.type.replace(/_/g, ' ')}</Badge>
    </div>
  );
}
