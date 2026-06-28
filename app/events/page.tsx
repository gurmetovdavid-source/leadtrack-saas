'use client';

import { useEffect, useState } from 'react';
import { Card, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';
import { AppState, LeadEvent } from '@/lib/types';
import { getState } from '@/lib/storage';
import { formatCurrency, formatDateTime, statusColor } from '@/lib/utils';
import { CalendarClock, Filter } from 'lucide-react';

const eventTypes = ['all', 'lead_submitted', 'booking_confirmed', 'payment', 'activation', 'visit_completed', 'cancellation', 'refund', 'clawback'];

export default function EventsPage() {
  const [state, setState] = useState<AppState | null>(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    setState(getState());
  }, []);

  if (!state) return null;

  const filtered = state.events
    .filter((e) => filter === 'all' || e.type === filter)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="page-container">
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Event Timeline</h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">Track every lead interaction from submission to conversion.</p>
        </div>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-slate-400" />
          <Select value={filter} onChange={(e) => setFilter(e.target.value)}>
            {eventTypes.map((t) => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}
          </Select>
        </div>
      </header>

      <Card>
        <div className="relative space-y-6 pl-4 before:absolute before:left-4 before:top-2 before:h-full before:w-px before:bg-slate-200 dark:before:bg-slate-800">
          {filtered.map((event) => (
            <EventItem key={event.id} event={event} leads={state.leads} />
          ))}
          {filtered.length === 0 && <p className="py-10 text-center text-sm text-slate-500">No events found.</p>}
        </div>
      </Card>
    </div>
  );
}

function EventItem({ event, leads }: { event: LeadEvent; leads: AppState['leads'] }) {
  const lead = leads.find((l) => l.id === event.leadId);
  return (
    <div className="relative pl-8">
      <div className="absolute left-0 top-1 flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <CalendarClock size={14} className="text-slate-400" />
      </div>
      <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-medium text-slate-900 dark:text-white">{event.message}</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {formatDateTime(event.createdAt)} · by {event.actor}
            {lead && (
              <span className="ml-2">
                · Lead: <span className="font-medium text-slate-700 dark:text-slate-300">{lead.firstName} {lead.lastName}</span>
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {event.amount && <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">+{formatCurrency(event.amount)}</span>}
          <Badge className={statusColor(event.type)}>{event.type.replace(/_/g, ' ')}</Badge>
        </div>
      </div>
    </div>
  );
}
