'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Expense } from '@/lib/types';
import { getExpenses, MONTHLY_BUDGET, resetDemo, saveExpenses } from '@/lib/storage';
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { DollarSign, Plus, RotateCcw, Trash2, TrendingUp, Wallet } from 'lucide-react';

const categories = ['Food', 'Transport', 'Subscriptions', 'Healthcare', 'Shopping', 'Entertainment', 'Other'];
const categoryColors = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#64748B'];

export default function ExpensePage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [form, setForm] = useState<Partial<Expense>>({ category: categories[0], date: new Date().toISOString().slice(0, 10) });

  useEffect(() => {
    setExpenses(getExpenses());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) saveExpenses(expenses);
  }, [expenses, loaded]);

  const total = useMemo(() => expenses.reduce((sum, e) => sum + e.amount, 0), [expenses]);
  const remaining = MONTHLY_BUDGET - total;
  const byCategory = useMemo(() => {
    const map = new Map<string, number>();
    expenses.forEach((e) => map.set(e.category, (map.get(e.category) || 0) + e.amount));
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [expenses]);

  const byDate = useMemo(() => {
    const map = new Map<string, number>();
    expenses.forEach((e) => map.set(e.date, (map.get(e.date) || 0) + e.amount));
    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, amount]) => ({ date, amount }));
  }, [expenses]);

  const addExpense = () => {
    if (!form.amount || !form.category || !form.date) return;
    const newExpense: Expense = {
      id: Date.now().toString(),
      amount: Number(form.amount),
      category: form.category,
      date: form.date,
      note: form.note || '',
    };
    setExpenses((prev) => [newExpense, ...prev]);
    setForm({ category: categories[0], date: new Date().toISOString().slice(0, 10), note: '' });
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  if (!loaded) return null;

  return (
    <main className="min-h-screen p-6 md:p-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Expense Tracker</h1>
            <p className="mt-2 text-slate-600">Track spending, set budgets, and see where money goes</p>
          </div>
          <Button variant="secondary" onClick={() => { resetDemo(); setExpenses(getExpenses()); }}>
            <RotateCcw size={16} className="mr-2" /> Reset demo
          </Button>
        </header>

        <section className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <p className="text-sm font-medium text-slate-500">Total spent</p>
            <p className="mt-1 text-2xl font-bold">${total.toFixed(2)}</p>
          </Card>
          <Card>
            <p className="text-sm font-medium text-slate-500">Monthly budget</p>
            <p className="mt-1 text-2xl font-bold">${MONTHLY_BUDGET}</p>
          </Card>
          <Card>
            <p className="text-sm font-medium text-slate-500">Remaining</p>
            <p className={`mt-1 text-2xl font-bold ${remaining < 0 ? 'text-danger' : 'text-primary'}`}>
              ${remaining.toFixed(2)}
            </p>
          </Card>
          <Card>
            <p className="text-sm font-medium text-slate-500">Transactions</p>
            <p className="mt-1 text-2xl font-bold">{expenses.length}</p>
          </Card>
        </section>

        <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Add expense</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <Input type="number" placeholder="Amount" value={form.amount || ''} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} />
            <Select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {categories.map((c) => (<option key={c} value={c}>{c}</option>))}
            </Select>
            <Input type="date" value={form.date || ''} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            <Input className="sm:col-span-2 lg:col-span-2" placeholder="Note (optional)" value={form.note || ''} onChange={(e) => setForm({ ...form, note: e.target.value })} />
          </div>
          <div className="mt-4">
            <Button onClick={addExpense}>
              <Plus size={16} className="mr-2" /> Add expense
            </Button>
          </div>
        </section>

        <section className="mb-8 grid gap-6 lg:grid-cols-2">
          <Card>
            <CardTitle>Spending by category</CardTitle>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={byCategory} dataKey="value" nameKey="name" outerRadius={90}>
                    {byCategory.map((_, i) => <Cell key={i} fill={categoryColors[i % categoryColors.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
          <Card>
            <CardTitle>Spending over time</CardTitle>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byDate}>
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="amount" fill="#10B981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </section>

        <section>
          <Card>
            <CardTitle>Recent transactions</CardTitle>
            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-200 text-slate-500">
                  <tr>
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Category</th>
                    <th className="pb-3 font-medium">Note</th>
                    <th className="pb-3 font-medium">Amount</th>
                    <th className="pb-3 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((e) => (
                    <tr key={e.id} className="border-b border-slate-100 last:border-0">
                      <td className="py-3">{e.date}</td>
                      <td className="py-3">
                        <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium">{e.category}</span>
                      </td>
                      <td className="py-3 text-slate-600">{e.note || '—'}</td>
                      <td className="py-3 font-semibold">${e.amount.toFixed(2)}</td>
                      <td className="py-3 text-right">
                        <button onClick={() => deleteExpense(e.id)} className="text-slate-400 hover:text-danger">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {expenses.length === 0 && <p className="py-8 text-center text-slate-500">No expenses yet.</p>}
            </div>
          </Card>
        </section>
      </div>
    </main>
  );
}
