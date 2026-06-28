'use client';

import { AppState, Lead, LeadEvent, LeadStatus, Offer, Partner, Settlement } from './types';

const STORAGE_KEY = 'leadtrack-data-v1';

const now = new Date();
const daysAgo = (n: number) => {
  const d = new Date(now);
  d.setDate(d.getDate() - n);
  return d.toISOString();
};

const demoPartners: Partner[] = [
  { id: 'p1', name: 'AffiliatePro', email: 'team@affiliatepro.com', type: 'affiliate', website: 'affiliatepro.com', commissionRate: 12, status: 'active', joinedAt: daysAgo(90) },
  { id: 'p2', name: 'MarketGurus', email: 'hello@marketgurus.io', type: 'agency', website: 'marketgurus.io', commissionRate: 15, status: 'active', joinedAt: daysAgo(60) },
  { id: 'p3', name: 'Sarah Jenkins', email: 'sarah@directleads.co', type: 'sales_agent', commissionRate: 10, status: 'active', joinedAt: daysAgo(45) },
  { id: 'p4', name: 'GlobalDistributors', email: 'partners@globaldist.com', type: 'distributor', commissionRate: 8, status: 'inactive', joinedAt: daysAgo(120) },
  { id: 'p5', name: 'TechReview Blog', email: 'ads@techreview.blog', type: 'affiliate', website: 'techreview.blog', commissionRate: 10, status: 'active', joinedAt: daysAgo(30) },
];

const demoOffers: Offer[] = [
  { id: 'o1', title: 'SaaS Starter Plan', description: 'All-in-one business management software for small teams.', category: 'Software', price: 99, currency: 'USD', commissionRate: 20, commissionType: 'percentage', status: 'active', createdAt: daysAgo(120) },
  { id: 'o2', title: 'Consultation Package', description: '1-on-1 strategy session with a certified consultant.', category: 'Services', price: 250, currency: 'USD', commissionRate: 25, commissionType: 'percentage', status: 'active', createdAt: daysAgo(90) },
  { id: 'o3', title: 'Enterprise Audit', description: 'Full business process audit and optimization roadmap.', category: 'Services', price: 1200, currency: 'USD', commissionRate: 100, commissionType: 'fixed', status: 'active', createdAt: daysAgo(60) },
  { id: 'o4', title: 'Premium Support', description: 'Priority support and onboarding for new customers.', category: 'Support', price: 49, currency: 'USD', commissionRate: 15, commissionType: 'percentage', status: 'paused', createdAt: daysAgo(30) },
];

const demoLeads: Lead[] = [
  { id: 'l1', firstName: 'James', lastName: 'Carter', email: 'james.carter@acme.co', source: 'AffiliatePro', partnerId: 'p1', campaign: 'summer2026', offerId: 'o1', status: 'converted', value: 99, createdAt: daysAgo(12), updatedAt: daysAgo(2), notes: 'Paid for the first month.' },
  { id: 'l2', firstName: 'Emily', lastName: 'Nguyen', email: 'emily@designlab.com', source: 'MarketGurus', partnerId: 'p2', campaign: 'webinar-may', offerId: 'o2', status: 'qualified', value: 250, createdAt: daysAgo(8), updatedAt: daysAgo(3) },
  { id: 'l3', firstName: 'Michael', lastName: 'Ross', email: 'mike.ross@legalinc.com', source: 'Direct', status: 'new', value: 1200, createdAt: daysAgo(2), updatedAt: daysAgo(2) },
  { id: 'l4', firstName: 'Sophia', lastName: 'Lopez', email: 'sophia@startup.io', source: 'TechReview Blog', partnerId: 'p5', campaign: 'review-feature', offerId: 'o1', status: 'contacted', value: 99, createdAt: daysAgo(5), updatedAt: daysAgo(4) },
  { id: 'l5', firstName: 'Daniel', lastName: 'Kim', email: 'daniel@retailplus.com', source: 'Sarah Jenkins', partnerId: 'p3', campaign: 'cold-outreach-q2', offerId: 'o3', status: 'converted', value: 1200, createdAt: daysAgo(18), updatedAt: daysAgo(4), notes: 'Closed enterprise audit.' },
  { id: 'l6', firstName: 'Olivia', lastName: 'Martinez', email: 'olivia@healthtech.com', source: 'AffiliatePro', partnerId: 'p1', campaign: 'summer2026', offerId: 'o2', status: 'lost', value: 250, createdAt: daysAgo(22), updatedAt: daysAgo(6) },
  { id: 'l7', firstName: 'William', lastName: 'Turner', email: 'will@fintech.co', source: 'MarketGurus', partnerId: 'p2', campaign: 'linkedin-ads', offerId: 'o1', status: 'new', value: 99, createdAt: daysAgo(1), updatedAt: daysAgo(1) },
  { id: 'l8', firstName: 'Ava', lastName: 'Patel', email: 'ava@eduplatform.org', source: 'TechReview Blog', partnerId: 'p5', campaign: 'review-feature', offerId: 'o1', status: 'qualified', value: 99, createdAt: daysAgo(6), updatedAt: daysAgo(2) },
];

const demoEvents: LeadEvent[] = [
  { id: 'e1', leadId: 'l1', type: 'lead_submitted', message: 'Lead submitted via AffiliatePro landing page', createdAt: daysAgo(12), actor: 'system' },
  { id: 'e2', leadId: 'l1', type: 'booking_confirmed', message: 'Demo call booked for James Carter', createdAt: daysAgo(10), actor: 'Admin' },
  { id: 'e3', leadId: 'l1', type: 'payment', amount: 99, message: 'First payment received', createdAt: daysAgo(2), actor: 'system' },
  { id: 'e4', leadId: 'l2', type: 'lead_submitted', message: 'Lead submitted via MarketGurus webinar', createdAt: daysAgo(8), actor: 'system' },
  { id: 'e5', leadId: 'l2', type: 'activation', message: 'Account activated for trial', createdAt: daysAgo(3), actor: 'system' },
  { id: 'e6', leadId: 'l5', type: 'lead_submitted', message: 'Lead submitted by Sarah Jenkins', createdAt: daysAgo(18), actor: 'Sarah Jenkins' },
  { id: 'e7', leadId: 'l5', type: 'booking_confirmed', message: 'Enterprise audit kickoff scheduled', createdAt: daysAgo(14), actor: 'Admin' },
  { id: 'e8', leadId: 'l5', type: 'payment', amount: 1200, message: 'Enterprise audit paid in full', createdAt: daysAgo(4), actor: 'system' },
];

const demoSettlements: Settlement[] = [
  { id: 's1', partnerId: 'p1', period: '2026-05', amount: 312.5, currency: 'USD', status: 'paid', leadsCount: 4, createdAt: daysAgo(35), paidAt: daysAgo(30) },
  { id: 's2', partnerId: 'p2', period: '2026-05', amount: 187.5, currency: 'USD', status: 'paid', leadsCount: 2, createdAt: daysAgo(35), paidAt: daysAgo(30) },
  { id: 's3', partnerId: 'p3', period: '2026-05', amount: 100, currency: 'USD', status: 'payable', leadsCount: 1, createdAt: daysAgo(5) },
  { id: 's4', partnerId: 'p1', period: '2026-06', amount: 39.8, currency: 'USD', status: 'confirmed', leadsCount: 1, createdAt: daysAgo(2) },
  { id: 's5', partnerId: 'p2', period: '2026-06', amount: 62.5, currency: 'USD', status: 'pending', leadsCount: 1, createdAt: daysAgo(1) },
];

const defaultState: AppState = {
  partners: demoPartners,
  offers: demoOffers,
  leads: demoLeads,
  events: demoEvents,
  settlements: demoSettlements,
};

export function getState(): AppState {
  if (typeof window === 'undefined') return defaultState;
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? (JSON.parse(raw) as AppState) : defaultState;
}

export function saveState(state: AppState): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function resetDemo(): AppState {
  if (typeof window === 'undefined') return defaultState;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultState));
  return defaultState;
}

export function addLead(state: AppState, lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): AppState {
  const newLead: Lead = {
    ...lead,
    id: `l${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const newEvent: LeadEvent = {
    id: `e${Date.now()}`,
    leadId: newLead.id,
    type: 'lead_submitted',
    message: `Lead submitted via ${newLead.source}`,
    createdAt: new Date().toISOString(),
    actor: 'system',
  };
  const next = { ...state, leads: [newLead, ...state.leads], events: [newEvent, ...state.events] };
  saveState(next);
  return next;
}

export function updateLeadStatus(state: AppState, leadId: string, status: Lead['status'], note?: string): AppState {
  const leads = state.leads.map((l) => (l.id === leadId ? { ...l, status, updatedAt: new Date().toISOString(), notes: note ?? l.notes } : l));
  const event: LeadEvent = {
    id: `e${Date.now()}`,
    leadId,
    type: mapStatusToEvent(status),
    message: `Status updated to ${status}${note ? `: ${note}` : ''}`,
    createdAt: new Date().toISOString(),
    actor: 'Admin',
  };
  const next = { ...state, leads, events: [event, ...state.events] };
  saveState(next);
  return next;
}

function mapStatusToEvent(status: LeadStatus): LeadEvent['type'] {
  switch (status) {
    case 'converted':
      return 'payment';
    case 'lost':
      return 'cancellation';
    default:
      return 'lead_submitted';
  }
}

export function addOffer(state: AppState, offer: Omit<Offer, 'id' | 'createdAt'>): AppState {
  const newOffer: Offer = { ...offer, id: `o${Date.now()}`, createdAt: new Date().toISOString() };
  const next = { ...state, offers: [newOffer, ...state.offers] };
  saveState(next);
  return next;
}

export function addPartner(state: AppState, partner: Omit<Partner, 'id' | 'joinedAt'>): AppState {
  const newPartner: Partner = { ...partner, id: `p${Date.now()}`, joinedAt: new Date().toISOString() };
  const next = { ...state, partners: [newPartner, ...state.partners] };
  saveState(next);
  return next;
}

export function addSettlement(state: AppState, settlement: Omit<Settlement, 'id' | 'createdAt'>): AppState {
  const newSettlement: Settlement = { ...settlement, id: `s${Date.now()}`, createdAt: new Date().toISOString() };
  const next = { ...state, settlements: [newSettlement, ...state.settlements] };
  saveState(next);
  return next;
}
