'use client';

import { Expense } from './types';

const STORAGE_KEY = 'expense-tracker-data';
export const MONTHLY_BUDGET = 2500;

const demoData: Expense[] = [
  { id: '1', amount: 45.5, category: 'Food', date: '2026-06-01', note: 'Grocery shopping' },
  { id: '2', amount: 120, category: 'Transport', date: '2026-06-03', note: 'Taxi to airport' },
  { id: '3', amount: 15, category: 'Subscriptions', date: '2026-06-05', note: 'Music streaming' },
  { id: '4', amount: 200, category: 'Healthcare', date: '2026-06-10', note: 'Dental checkup' },
  { id: '5', amount: 80, category: 'Food', date: '2026-06-12', note: 'Restaurant' },
  { id: '6', amount: 60, category: 'Shopping', date: '2026-06-15', note: 'Office supplies' },
];

export function getExpenses(): Expense[] {
  if (typeof window === 'undefined') return demoData;
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? (JSON.parse(raw) as Expense[]) : demoData;
}

export function saveExpenses(expenses: Expense[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
}

export function resetDemo(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(demoData));
}
