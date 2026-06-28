export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
export type EventType = 'lead_submitted' | 'booking_confirmed' | 'payment' | 'activation' | 'visit_completed' | 'cancellation' | 'refund' | 'clawback';
export type SettlementStatus = 'pending' | 'confirmed' | 'payable' | 'paid' | 'canceled' | 'clawback';
export type UserRole = 'admin' | 'partner';

export interface Partner {
  id: string;
  name: string;
  email: string;
  type: 'affiliate' | 'agency' | 'sales_agent' | 'distributor';
  website?: string;
  commissionRate: number;
  status: 'active' | 'inactive';
  joinedAt: string;
  avatar?: string;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  commissionRate: number;
  commissionType: 'fixed' | 'percentage';
  status: 'active' | 'paused' | 'archived';
  createdAt: string;
}

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  source: string;
  partnerId?: string;
  campaign?: string;
  offerId?: string;
  status: LeadStatus;
  value?: number;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface LeadEvent {
  id: string;
  leadId: string;
  type: EventType;
  amount?: number;
  message: string;
  createdAt: string;
  actor: string;
}

export interface Settlement {
  id: string;
  partnerId: string;
  period: string;
  amount: number;
  currency: string;
  status: SettlementStatus;
  leadsCount: number;
  createdAt: string;
  paidAt?: string;
}

export interface AppState {
  partners: Partner[];
  offers: Offer[];
  leads: Lead[];
  events: LeadEvent[];
  settlements: Settlement[];
}
