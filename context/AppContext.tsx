import React, { createContext, useContext, useState, useMemo } from 'react';
import {
  BuyElectricityDraft,
  GridStatusItem,
  Meter,
  MeterApplication,
  OutageReport,
  PaymentMethodId,
  Transaction,
  UserAccount,
  VendorAccount,
  TariffCategory,
  UserRole,
} from '../types/edsa';
import {
  DEMO_USER,
  PENDING_USER,
  DEMO_VENDOR,
  PENDING_VENDOR,
  GRID_STATUS_ITEMS,
  INITIAL_METERS,
  INITIAL_OUTAGES,
  INITIAL_TRANSACTIONS,
  INITIAL_METER_APPLICATIONS,
} from '../services/mockData';
import { TokenVendingService } from '../services/tokenVendingService';
import { OutageService } from '../services/outageService';
import { MeterService } from '../services/meterService';

interface AppContextType {
  // Authentication & Persona
  userRole: UserRole | null;
  setUserRole: (role: UserRole | null) => void;
  isLoggedIn: boolean;
  user: UserAccount | null;
  vendor: VendorAccount | null;
  loginAs: (
    role: 'guest' | 'user' | 'vendor',
    variant?: 'approved' | 'pending'
  ) => void;
  logout: () => void;

  // KYC & Vendor Registration
  registerCustomer: (userData: Partial<UserAccount>) => UserAccount;
  applyVendorAccount: (vendorData: Partial<VendorAccount>) => VendorAccount;
  adminToggleCustomerApproval: (approved: boolean) => void;
  adminToggleVendorApproval: (approved: boolean) => void;

  // Meters Management
  meters: Meter[];
  activeMeterId: string;
  activeMeter: Meter | undefined;
  setActiveMeterId: (id: string) => void;
  addMeter: (meter: Omit<Meter, 'id' | 'balanceKwh'>) => Meter;

  // New Meter Applications
  meterApplications: MeterApplication[];
  applyForNewMeter: (
    application: Omit<
      MeterApplication,
      'id' | 'applicationNumber' | 'status' | 'appliedDate'
    >
  ) => MeterApplication;

  // Vending & Purchase
  buyDraft: BuyElectricityDraft;
  updateBuyDraft: (partial: Partial<BuyElectricityDraft>) => void;
  resetBuyDraft: () => void;
  completePurchase: (options?: { simulateFailure?: boolean }) => Promise<{
    success: boolean;
    transaction?: Transaction;
    error?: string;
  }>;

  // Guest Fast Checkout
  guestCheckout: (params: {
    meterNumber: string;
    amountLe: number;
    paymentMethod: PaymentMethodId;
    paymentPhone?: string;
  }) => Promise<{
    success: boolean;
    transaction?: Transaction;
    error?: string;
  }>;

  // Vendor Vending Terminal & Bonus Exchange
  vendorVendForCustomer: (params: {
    customerMeterNumber: string;
    amountLe: number;
    customerPhone?: string;
    paymentSource: 'wallet' | 'direct';
  }) => Promise<{
    success: boolean;
    transaction?: Transaction;
    commissionEarnedLe: number;
    error?: string;
  }>;
  vendorExchangeBonusToCredit: () => {
    success: boolean;
    creditedLe: number;
    error?: string;
  };

  // Transactions & Outages
  transactions: Transaction[];
  outageReports: OutageReport[];
  gridStatus: GridStatusItem[];
  reportOutage: (data: {
    locationArea: string;
    streetAddress: string;
    issueType: OutageReport['issueType'];
    meterNumber?: string;
    contactPhone?: string;
    description?: string;
  }) => OutageReport;

  // System & Prototype Simulation
  simulateFailureMode: boolean;
  setSimulateFailureMode: (val: boolean) => void;
  lastGeneratedTransaction: Transaction | null;
}

const defaultDraft: BuyElectricityDraft = {
  meterId: 'mtr_001',
  meterNumber: '12345678901',
  meterNickname: 'Home - Freetown Central',
  customerName: 'Amadu Sesay',
  location: 'Siaka Stevens Street, Freetown',
  amountLe: 500,
  unitsKwh: 42.7,
  energyCostLe: 430.43,
  vatAmountLe: 64.57,
  serviceFeeLe: 5.0,
  tariffRatePerKwh: 10.07,
  tariffCategory: 'residential',
  paymentMethod: 'orange_money',
  paymentPhone: '+232 76 543 210',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<UserAccount | null>(null);
  const [vendor, setVendor] = useState<VendorAccount | null>(null);

  const [meters, setMeters] = useState<Meter[]>(INITIAL_METERS);
  const [activeMeterId, setActiveMeterId] = useState<string>('mtr_001');
  const [transactions, setTransactions] =
    useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [meterApplications, setMeterApplications] = useState<
    MeterApplication[]
  >(INITIAL_METER_APPLICATIONS);
  const [outageReports, setOutageReports] =
    useState<OutageReport[]>(INITIAL_OUTAGES);
  const [gridStatus] = useState<GridStatusItem[]>(GRID_STATUS_ITEMS);

  const [buyDraft, setBuyDraft] = useState<BuyElectricityDraft>(defaultDraft);
  const [simulateFailureMode, setSimulateFailureMode] =
    useState<boolean>(false);
  const [lastGeneratedTransaction, setLastGeneratedTransaction] =
    useState<Transaction | null>(INITIAL_TRANSACTIONS[0]);

  const activeMeter = useMemo(
    () => meters.find((m) => m.id === activeMeterId) || meters[0],
    [meters, activeMeterId]
  );

  const loginAs = (
    role: 'guest' | 'user' | 'vendor',
    variant: 'approved' | 'pending' = 'approved'
  ) => {
    setUserRole(role);
    if (role === 'guest') {
      setIsLoggedIn(false);
      setUser(null);
      setVendor(null);
      return;
    }
    setIsLoggedIn(true);
    if (role === 'user') {
      setUser(variant === 'approved' ? DEMO_USER : PENDING_USER);
      setVendor(null);
    } else {
      setVendor(variant === 'approved' ? DEMO_VENDOR : PENDING_VENDOR);
      setUser(null);
    }
  };

  const logout = () => {
    setUserRole(null);
    setIsLoggedIn(false);
  };

  const registerCustomer = (userData: Partial<UserAccount>): UserAccount => {
    const newUser: UserAccount = {
      id: `usr_${Date.now()}`,
      fullName: userData.fullName || 'New Customer',
      phoneNumber: userData.phoneNumber || '+232 76 000 000',
      email: userData.email || '',
      city: userData.city || 'Freetown',
      address: userData.address || '',
      idType: userData.idType || 'national_id',
      idNumber: userData.idNumber || '',
      verificationStatus: 'pending',
      loyaltyBonusBalanceKwh: 0,
      defaultMeterId: 'mtr_001',
    };
    setUser(newUser);
    setUserRole('user');
    setIsLoggedIn(true);
    return newUser;
  };

  const applyVendorAccount = (
    vendorData: Partial<VendorAccount>
  ): VendorAccount => {
    const newVendor: VendorAccount = {
      id: `vnd_${Date.now()}`,
      businessName: vendorData.businessName || 'New Agent Hub',
      agentName: vendorData.agentName || 'Agent',
      phoneNumber: vendorData.phoneNumber || '+232 76 000 000',
      email: vendorData.email || '',
      physicalAddress: vendorData.physicalAddress || '',
      district: vendorData.district || 'Western Area Urban',
      idType: vendorData.idType || 'national_id',
      idNumber: vendorData.idNumber || '',
      passportPhotoUrl: vendorData.passportPhotoUrl,
      shopPhotoUrl: vendorData.shopPhotoUrl,
      approvalStatus: 'pending',
      agentCode: `EDSA-AGT-${Math.floor(1000 + Math.random() * 9000)}`,
      walletBalanceLe: 500.0,
      bonusCommissionKwh: 0,
      bonusCommissionLe: 0,
      commissionRatePct: 5,
      totalVendedLe: 0,
      transactionsCount: 0,
    };
    setVendor(newVendor);
    setUserRole('vendor');
    setIsLoggedIn(true);
    return newVendor;
  };

  const adminToggleCustomerApproval = (approved: boolean) => {
    if (user) {
      setUser((prev) =>
        prev
          ? {
              ...prev,
              verificationStatus: approved ? 'approved' : 'rejected',
            }
          : null
      );
    }
  };

  const adminToggleVendorApproval = (approved: boolean) => {
    if (vendor) {
      setVendor((prev) =>
        prev
          ? {
              ...prev,
              approvalStatus: approved ? 'approved' : 'rejected',
            }
          : null
      );
    }
  };

  const addMeter = (meterData: Omit<Meter, 'id' | 'balanceKwh'>): Meter => {
    const newMeter: Meter = {
      ...meterData,
      id: `mtr_${Date.now()}`,
      balanceKwh: 0,
      isPrimary: meters.length === 0,
    };
    setMeters((prev) => [newMeter, ...prev]);
    return newMeter;
  };

  const applyForNewMeter = (
    appData: Omit<
      MeterApplication,
      'id' | 'applicationNumber' | 'status' | 'appliedDate'
    >
  ): MeterApplication => {
    const newApp: MeterApplication = {
      ...appData,
      id: `app_${Date.now()}`,
      applicationNumber: `MTR-APP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'submitted',
      appliedDate: new Date().toISOString().slice(0, 10),
      estimatedReadyDate: 'In 3-5 business days',
    };
    setMeterApplications((prev) => [newApp, ...prev]);
    return newApp;
  };

  const updateBuyDraft = (partial: Partial<BuyElectricityDraft>) => {
    setBuyDraft((prev) => ({
      ...prev,
      ...partial,
    }));
  };

  const resetBuyDraft = () => {
    setBuyDraft(defaultDraft);
  };

  const completePurchase = async (options?: {
    simulateFailure?: boolean;
  }): Promise<{
    success: boolean;
    transaction?: Transaction;
    error?: string;
  }> => {
    const shouldFail = options?.simulateFailure ?? simulateFailureMode;

    if (shouldFail) {
      return {
        success: false,
        error:
          'Payment declined by network operator: Insufficient funds or SIM push timeout. Please retry.',
      };
    }

    const amount = buyDraft.amountLe || 100;
    const category: TariffCategory = buyDraft.tariffCategory || 'residential';
    const breakdown = MeterService.calculateEstimatedUnits(
      amount,
      category,
      false
    );

    const isExistingMeter = meters.some(
      (m) => m.meterNumber === buyDraft.meterNumber
    );

    const newTx = TokenVendingService.vendElectricityToken({
      meterId:
        buyDraft.meterId ||
        (isExistingMeter ? activeMeterId : `mtr_${Date.now()}`),
      meterNumber: buyDraft.meterNumber || '12345678901',
      meterNickname:
        buyDraft.meterNickname ||
        (isExistingMeter ? activeMeter?.nickname : 'EDSA Meter'),
      customerName:
        buyDraft.customerName || user?.fullName || 'Amadu Sesay',
      amountLe: amount,
      paymentMethod: buyDraft.paymentMethod || 'orange_money',
      paymentPhone: buyDraft.paymentPhone || '+232 76 543 210',
      tariffCategory: category,
      isGuestPurchase: false,
    });

    setTransactions((prev) => [newTx, ...prev]);
    setLastGeneratedTransaction(newTx);

    // Update meter balance & user bonus loyalty points
    if (isExistingMeter) {
      setMeters((prev) =>
        prev.map((m) =>
          m.meterNumber === buyDraft.meterNumber
            ? {
                ...m,
                balanceKwh: Number(
                  (m.balanceKwh + breakdown.totalUnitsKwh).toFixed(1)
                ),
                lastRechargeDate: new Date().toISOString(),
              }
            : m
        )
      );
    }

    if (user && breakdown.bonusUnitsKwh > 0) {
      setUser((prev) =>
        prev
          ? {
              ...prev,
              loyaltyBonusBalanceKwh: Number(
                (
                  (prev.loyaltyBonusBalanceKwh || 0) + breakdown.bonusUnitsKwh
                ).toFixed(1)
              ),
            }
          : null
      );
    }

    return {
      success: true,
      transaction: newTx,
    };
  };

  const guestCheckout = async (params: {
    meterNumber: string;
    amountLe: number;
    paymentMethod: PaymentMethodId;
    paymentPhone?: string;
  }): Promise<{
    success: boolean;
    transaction?: Transaction;
    error?: string;
  }> => {
    if (simulateFailureMode) {
      return {
        success: false,
        error:
          'Payment Gateway Timeout: Unable to complete guest authorization with carrier. Please retry.',
      };
    }

    // Guests receive pure standard units with zero bonus units and strict privacy
    const newTx = TokenVendingService.vendElectricityToken({
      meterNumber: params.meterNumber,
      amountLe: params.amountLe,
      paymentMethod: params.paymentMethod,
      paymentPhone: params.paymentPhone,
      tariffCategory: 'residential',
      isGuestPurchase: true,
    });

    setTransactions((prev) => [newTx, ...prev]);
    setLastGeneratedTransaction(newTx);

    return {
      success: true,
      transaction: newTx,
    };
  };

  const vendorVendForCustomer = async (params: {
    customerMeterNumber: string;
    amountLe: number;
    customerPhone?: string;
    paymentSource: 'wallet' | 'direct';
  }): Promise<{
    success: boolean;
    transaction?: Transaction;
    commissionEarnedLe: number;
    error?: string;
  }> => {
    if (!vendor || vendor.approvalStatus !== 'approved') {
      return {
        success: false,
        commissionEarnedLe: 0,
        error:
          'Vendor Account is pending EDSA administrative authorization. Vending is restricted.',
      };
    }

    if (
      params.paymentSource === 'wallet' &&
      vendor.walletBalanceLe < params.amountLe
    ) {
      return {
        success: false,
        commissionEarnedLe: 0,
        error: `Insufficient wallet balance (Le ${vendor.walletBalanceLe.toLocaleString()}). Please top up your agent float.`,
      };
    }

    // Commission logic: 5% bonus is awarded to the Vendor!
    const commissionLe = Number((params.amountLe * 0.05).toFixed(2));
    const breakdown = MeterService.calculateEstimatedUnits(
      params.amountLe,
      'residential',
      false
    );
    const commissionKwh = breakdown.bonusUnitsKwh;

    const newTx = TokenVendingService.vendElectricityToken({
      meterNumber: params.customerMeterNumber,
      amountLe: params.amountLe,
      paymentMethod: 'orange_money',
      paymentPhone: params.customerPhone,
      tariffCategory: 'residential',
      isVendorVending: true,
      vendorAgentCode: vendor.agentCode,
    });

    setTransactions((prev) => [newTx, ...prev]);
    setLastGeneratedTransaction(newTx);

    // Update vendor wallet & accrued bonus commission
    setVendor((prev) => {
      if (!prev) return null;
      const newWallet =
        params.paymentSource === 'wallet'
          ? Number((prev.walletBalanceLe - params.amountLe).toFixed(2))
          : prev.walletBalanceLe;

      return {
        ...prev,
        walletBalanceLe: newWallet,
        bonusCommissionLe: Number(
          (prev.bonusCommissionLe + commissionLe).toFixed(2)
        ),
        bonusCommissionKwh: Number(
          (prev.bonusCommissionKwh + commissionKwh).toFixed(1)
        ),
        totalVendedLe: Number(
          (prev.totalVendedLe + params.amountLe).toFixed(2)
        ),
        transactionsCount: prev.transactionsCount + 1,
      };
    });

    return {
      success: true,
      transaction: newTx,
      commissionEarnedLe: commissionLe,
    };
  };

  const vendorExchangeBonusToCredit = (): {
    success: boolean;
    creditedLe: number;
    error?: string;
  } => {
    if (!vendor) return { success: false, creditedLe: 0 };
    if (vendor.bonusCommissionLe <= 0) {
      return {
        success: false,
        creditedLe: 0,
        error: 'No commission bonus balance available for exchange.',
      };
    }

    const exchangeAmount = vendor.bonusCommissionLe;
    setVendor((prev) =>
      prev
        ? {
            ...prev,
            walletBalanceLe: Number(
              (prev.walletBalanceLe + exchangeAmount).toFixed(2)
            ),
            bonusCommissionLe: 0,
            bonusCommissionKwh: 0,
          }
        : null
    );

    return {
      success: true,
      creditedLe: exchangeAmount,
    };
  };

  const reportOutage = (data: {
    locationArea: string;
    streetAddress: string;
    issueType: OutageReport['issueType'];
    meterNumber?: string;
    contactPhone?: string;
    description?: string;
  }): OutageReport => {
    const report = OutageService.createOutageReport({
      locationArea: data.locationArea,
      streetAddress: data.streetAddress,
      issueType: data.issueType,
      meterNumber: data.meterNumber,
      contactPhone: data.contactPhone || '+232 76 543 210',
      description: data.description || '',
    });
    setOutageReports((prev) => [report, ...prev]);
    return report;
  };

  return (
    <AppContext.Provider
      value={{
        userRole,
        setUserRole,
        isLoggedIn,
        user,
        vendor,
        loginAs,
        logout,
        registerCustomer,
        applyVendorAccount,
        adminToggleCustomerApproval,
        adminToggleVendorApproval,
        meters,
        activeMeterId,
        activeMeter,
        setActiveMeterId,
        addMeter,
        meterApplications,
        applyForNewMeter,
        buyDraft,
        updateBuyDraft,
        resetBuyDraft,
        completePurchase,
        guestCheckout,
        vendorVendForCustomer,
        vendorExchangeBonusToCredit,
        transactions,
        outageReports,
        gridStatus,
        reportOutage,
        simulateFailureMode,
        setSimulateFailureMode,
        lastGeneratedTransaction,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
