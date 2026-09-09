import { TariffCategory, Transaction, PaymentMethodId } from '../types/edsa';
import { MeterService } from './meterService';

export class TokenVendingService {
  /**
   * Generates a 20-digit Standard Transfer Specification (STS) Token
   * Formatted in 5 groups of 4 digits: `XXXX XXXX XXXX XXXX XXXX`
   */
  static generateStsToken(): string {
    const groups: string[] = [];
    for (let i = 0; i < 5; i++) {
      const group = Math.floor(1000 + Math.random() * 9000).toString();
      groups.push(group);
    }
    return groups.join(' ');
  }

  /**
   * Generates a unique EDSA Transaction Reference Code
   */
  static generateReferenceCode(): string {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const randomHex = Math.floor(10000 + Math.random() * 90000).toString();
    return `EDSA-${dateStr}-${randomHex}`;
  }

  /**
   * Formats token with dashes or spaces for meter keypad entry
   */
  static formatTokenForDisplay(token: string): string {
    const cleaned = token.replace(/[^0-9]/g, '');
    return cleaned.match(/.{1,4}/g)?.join(' ') || token;
  }

  /**
   * Vends a simulated electricity token for a transaction
   */
  static vendElectricityToken(params: {
    meterId?: string;
    meterNumber: string;
    meterNickname?: string;
    customerName?: string;
    amountLe: number;
    paymentMethod: PaymentMethodId;
    paymentPhone?: string;
    tariffCategory?: TariffCategory;
    isGuestPurchase?: boolean;
    isVendorVending?: boolean;
    vendorAgentCode?: string;
  }): Transaction {
    const category = params.tariffCategory || 'residential';
    const breakdown = MeterService.calculateEstimatedUnits(
      params.amountLe,
      category,
      params.isGuestPurchase || false
    );

    const token = this.generateStsToken();
    const txId = `tx_${Date.now()}_${Math.floor(100 + Math.random() * 900)}`;
    const reference = this.generateReferenceCode();

    return {
      id: txId,
      referenceNumber: reference,
      tokenNumber: token,
      meterId: params.meterId || `mtr_custom_${params.meterNumber.slice(-4)}`,
      meterNumber: params.meterNumber,
      meterNickname: params.isGuestPurchase
        ? 'EDSA Meter'
        : params.meterNickname || 'EDSA Meter',
      customerName: params.isGuestPurchase
        ? 'Guest Customer'
        : params.customerName || 'EDSA Customer',
      unitsKwh: breakdown.unitsKwh,
      bonusUnitsKwh: breakdown.bonusUnitsKwh,
      amountLe: params.amountLe,
      energyCostLe: breakdown.energyCostLe,
      vatAmountLe: breakdown.vatAmountLe,
      serviceFeeLe: breakdown.serviceFeeLe,
      tariffCategory: category,
      paymentMethod: params.paymentMethod,
      paymentPhone: params.paymentPhone,
      status: 'completed',
      createdAt: new Date().toISOString(),
      isGuestPurchase: params.isGuestPurchase,
      isVendorVending: params.isVendorVending,
      vendorAgentCode: params.vendorAgentCode,
    };
  }
}
