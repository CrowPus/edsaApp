export type TariffCategory = 'residential' | 'commercial';

export type PaymentMethodId = 'orange_money' | 'afrimoney' | 'card';

export type IdDocumentType = 'national_id' | 'passport' | 'nin' | 'voter_id';

export type UserRole = 'guest' | 'user' | 'vendor';

export type VerificationStatus = 'unsubmitted' | 'pending' | 'approved' | 'rejected';

export type OutageIssueType =
  | 'blackout'
  | 'phase_problem'
  | 'low_voltage'
  | 'transformer'
  | 'fallen_cable'
  | 'other';

export type OutageType = OutageIssueType;

export interface Meter {
  id: string;
  meterNumber: string;
  nickname: string;
  location: string;
  tariffCategory: TariffCategory;
  balanceKwh: number;
  lastRechargeDate?: string;
  isPrimary?: boolean;
  customerName: string;
}

export interface PaymentOption {
  id: PaymentMethodId;
  name: string;
  provider: string;
  iconName: string;
  color: string;
  feePercentage: number;
  description: string;
}

export interface TariffBreakdown {
  unitsKwh: number;
  bonusUnitsKwh: number;
  totalUnitsKwh: number;
  energyCostLe: number;
  vatAmountLe: number;
  serviceFeeLe: number;
  totalAmountLe: number;
  ratePerKwh: number;
  tariffCategory: TariffCategory;
  isGuestPurchase?: boolean;
}

export interface PaymentResponse {
  success: boolean;
  transactionReference: string;
  tokenNumber?: string;
  unitsKwh?: number;
  amountLe?: number;
  errorMessage?: string;
  timestamp: string;
}

export interface Transaction {
  id: string;
  referenceNumber: string;
  tokenNumber: string;
  meterId: string;
  meterNumber: string;
  meterNickname: string;
  customerName: string;
  unitsKwh: number;
  bonusUnitsKwh?: number;
  amountLe: number;
  energyCostLe: number;
  vatAmountLe: number;
  serviceFeeLe: number;
  tariffCategory: TariffCategory;
  paymentMethod: PaymentMethodId;
  paymentPhone?: string;
  status: 'completed' | 'pending' | 'failed';
  createdAt: string;
  isGuestPurchase?: boolean;
  isVendorVending?: boolean;
  vendorAgentCode?: string;
}

export interface OutageReport {
  id: string;
  ticketNumber: string;
  referenceCode?: string;
  locationArea: string;
  streetAddress: string;
  issueType: OutageType;
  description: string;
  status: 'received' | 'investigating' | 'technicians_dispatched' | 'resolved';
  reportedAt: string;
  estimatedResolutionTime: string;
  meterNumber?: string;
  contactPhone?: string;
  assignedTeam?: string;
}

export interface GridStatusItem {
  id: string;
  region: string;
  regionName?: string;
  status: 'normal' | 'load_shedding' | 'fault' | 'maintenance';
  availableCapacityMw: number;
  currentLoadMw: number;
  lastUpdated: string;
  bulletin: string;
  substations: { name: string; status: 'online' | 'offline' | 'degraded' }[];
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'token' | 'meter' | 'outage' | 'payment' | 'tariffs';
}

export interface EdsaOffice {
  id: string;
  name: string;
  district: string;
  address: string;
  phone: string;
  hours: string;
  services: string[];
}

export interface UserAccount {
  id: string;
  fullName: string;
  phoneNumber: string;
  email?: string;
  city?: string;
  address?: string;
  idType?: IdDocumentType;
  idNumber?: string;
  idPhotoUrl?: string;
  passportPhotoUrl?: string;
  verificationStatus: VerificationStatus;
  loyaltyBonusBalanceKwh?: number;
  defaultMeterId?: string;
}

export interface VendorAccount {
  id: string;
  businessName: string;
  agentName: string;
  phoneNumber: string;
  email?: string;
  physicalAddress: string;
  district: string;
  idType: IdDocumentType;
  idNumber: string;
  passportPhotoUrl?: string;
  shopPhotoUrl?: string;
  approvalStatus: VerificationStatus;
  agentCode?: string;
  walletBalanceLe: number;
  bonusCommissionKwh: number;
  bonusCommissionLe: number;
  commissionRatePct: number;
  totalVendedLe: number;
  transactionsCount: number;
}

export type MeterApplicationStatus =
  | 'submitted'
  | 'document_verified'
  | 'site_inspected'
  | 'ready_for_pickup'
  | 'collected'
  | 'rejected';

export interface MeterApplication {
  id: string;
  applicationNumber: string;
  userId?: string;
  applicantName: string;
  applicantPhone: string;
  applicantIdType: IdDocumentType;
  applicantIdNumber: string;
  premisesAddress: string;
  district: string;
  propertyType: 'residential' | 'commercial' | 'industrial';
  connectionType: 'single_phase_5_30a' | 'three_phase_10_100a';
  useDefaultDetails?: boolean;
  status: MeterApplicationStatus;
  pickupOfficeLocation: string;
  appliedDate: string;
  estimatedReadyDate?: string;
  notes?: string;
  meterSerialNumber?: string;
}

export interface BuyElectricityDraft {
  meterId?: string;
  meterNumber?: string;
  meterNickname?: string;
  customerName?: string;
  location?: string;
  tariffCategory?: TariffCategory;
  customMeterNumber?: string;
  amountLe?: number;
  unitsKwh?: number;
  bonusUnitsKwh?: number;
  energyCostLe?: number;
  vatAmountLe?: number;
  serviceFeeLe?: number;
  tariffRatePerKwh?: number;
  paymentMethod?: PaymentMethodId;
  paymentPhone?: string;
  paymentPhoneOrAccount?: string;
  cardNumber?: string;
  cardExpiry?: string;
  cardCvv?: string;
  generatedToken?: string;
  transactionId?: string;
  isGuest?: boolean;
}
