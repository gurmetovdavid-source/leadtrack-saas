import { EventType, LeadStatus, Offer, Partner, SettlementStatus } from './types';

export function formatCurrency(value: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value);
}

export function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatDateTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function statusColor(status: LeadStatus | SettlementStatus | EventType | Offer['status'] | Partner['status']) {
  const map: Record<string, string> = {
    new: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    contacted: 'bg-info/10 text-info',
    qualified: 'bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300',
    converted: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    lost: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
    pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    confirmed: 'bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300',
    payable: 'bg-info/10 text-info',
    paid: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    canceled: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    clawback: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
    active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    inactive: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    paused: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    archived: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    lead_submitted: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    booking_confirmed: 'bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300',
    payment: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    activation: 'bg-info/10 text-info',
    visit_completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    cancellation: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
    refund: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  };
  return map[status] || 'bg-slate-100 text-slate-700';
}

export function typeColor(type: string) {
  const map: Record<string, string> = {
    affiliate: 'bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300',
    agency: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    sales_agent: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    distributor: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  };
  return map[type] || 'bg-slate-100 text-slate-700';
}

export function initials(first: string, last: string) {
  return `${first[0] || ''}${last[0] || ''}`.toUpperCase();
}
