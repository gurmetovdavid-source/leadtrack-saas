# LeadTrack — Multi-Partner SaaS Platform

A production-ready demo of a **multi-partner SaaS platform** with lead tracking, attribution, commission management, and settlement workflows. Built as a portfolio piece inspired by a real Upwork brief.

🌐 **Live demo:** [leadtrack-saas.vercel.app](https://leadtrack-saas.vercel.app)

---

## What the client asked for

A web-based SaaS platform that connects multiple websites, partners, and sales channels into one central system:

- **Offer catalog** — partners promote products and services.
- **Lead management** — capture, qualify, and convert customer leads.
- **Partner portal** — partners see assigned leads, performance, and commissions.
- **Admin dashboard** — operators manage partners, offers, commissions, settlements, and reports.
- **Event tracking** — timeline of lead submission, booking, payment, activation, cancellation, refund, and clawback events.
- **Attribution** — track which website, partner, campaign, or channel generated the lead.
- **Settlement ledger** — pending, confirmed, payable, paid, canceled, and clawback transactions.
- **Embeddable widget** — script-based lead capture form for external websites.
- **Role-based access control** — admin and partner views.

---

## What was built

This demo delivers the full MVP scope requested in the first milestone:

| Module | Features |
|---|---|
| **Dashboard** | KPI cards, revenue trend, leads by status, leads by source, recent events, pending settlements |
| **Offers** | Offer catalog with pricing, commission rules, categories, status, add/edit workflow |
| **Partners** | Partner directory, performance stats, commission rates, partner type badges |
| **Leads** | Lead table with search, filters, status updates, source attribution, deal value |
| **Events** | Event timeline with filters, actor tracking, automatic event generation |
| **Settlements** | Settlement ledger, status workflow, mark-as-paid, payable totals |
| **Partner Portal** | Self-service view for partners: leads, conversions, revenue, commissions, settlements |
| **Widget Demo** | Embedded lead-capture form preview + installation code snippet |
| **Settings** | Theme toggle, demo reset, data overview |

---

## Tech stack

- **Next.js 14** with App Router
- **TypeScript**
- **Tailwind CSS**
- **Recharts** for analytics
- **Lucide React** for icons
- **localStorage** for demo persistence (no backend required for the demo)

---

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000

---

## Demo accounts

The demo runs in the browser. Use the **Admin / Partner view** toggle in the top bar to switch between:

- **Admin view** — full access to dashboard, offers, partners, leads, events, settlements, widget demo.
- **Partner view** — limited partner portal with assigned leads and settlement history.

---

## Design highlights

- Clean, modern SaaS UI with a focused indigo brand color.
- Responsive layout with collapsible sidebar.
- Consistent color-coded status badges for leads, events, and settlements.
- Accessible contrast and readable typography.
- Subtle shadows and rounded surfaces without over-decoration.

---

## License

MIT
