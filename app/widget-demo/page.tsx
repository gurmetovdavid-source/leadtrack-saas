'use client';

import { useState } from 'react';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Code, Globe } from 'lucide-react';

export default function WidgetDemoPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', source: 'affiliate-pro' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const embedCode = `<script
  src="https://leadtrack.example.com/widget.js"
  data-api-key="YOUR_API_KEY"
  data-offer="o1"
  data-source="affiliate-pro"
></script>`;

  return (
    <div className="page-container">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Embedded Widget Demo</h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">Preview how partners capture leads on their websites.</p>
      </header>

      <section className="mb-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardTitle className="mb-1">Partner Website</CardTitle>
          <CardDescription className="mb-6">This is how the widget looks embedded on a partner landing page.</CardDescription>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900/50">
            <div className="mb-4 flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <Globe size={16} />
              <span className="text-sm">example-partner.com/special-offer</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Get a free consultation</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Fill out the form and our team will reach out within 24 hours.</p>

            {submitted ? (
              <div className="mt-6 rounded-lg bg-emerald-50 p-4 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300">
                <div className="flex items-center gap-2">
                  <CheckCircle size={18} />
                  <span className="font-medium">Thank you! Your lead has been tracked.</span>
                </div>
                <p className="mt-1 text-xs">Source: affiliate-pro · Offer: Consultation Package</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input placeholder="First name" required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
                  <Input placeholder="Last name" required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
                </div>
                <Input type="email" placeholder="Work email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                <Button type="submit" className="w-full">Request demo</Button>
                <p className="text-center text-xs text-slate-400">Powered by LeadTrack</p>
              </form>
            )}
          </div>
        </Card>

        <Card>
          <CardTitle className="mb-1">Installation Code</CardTitle>
          <CardDescription className="mb-6">Copy this script to any website to start collecting attributed leads.</CardDescription>
          <div className="relative rounded-xl bg-slate-900 p-4 text-sm text-slate-200">
            <pre className="overflow-x-auto whitespace-pre-wrap break-all">{embedCode}</pre>
            <button
              onClick={() => navigator.clipboard.writeText(embedCode)}
              className="absolute right-3 top-3 rounded-md bg-slate-800 px-2 py-1 text-xs text-white hover:bg-slate-700"
            >
              Copy
            </button>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <Badge className="bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">API key</Badge>
              Validates the partner domain before accepting leads.
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">Source tracking</Badge>
              Automatically attributes the lead to the right partner and campaign.
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
