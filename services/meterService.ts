import { TariffBreakdown, TariffCategory } from '../types/edsa';

export class MeterService {
  /**
   * EDSA Sierra Leone Tariff Model:
   * Residential: ~ Le 10.07 effective per kWh (incl. subsidised baseline)
   * Commercial: ~ Le 11.71 effective per kWh
   * GST (VAT): 15%
   * Fixed Service fee: Le 5.00
   *
   * Bonus Mechanism:
   * - Registered Customer: +5% Loyalty Bonus kWh
   * - Guest: 0% Bonus
   * - Vendor: Standard units to customer, 5% bonus is converted to Vendor Commission
   */
  static calculateEstimatedUnits(
    amountLe: number,
    tariff: TariffCategory = 'residential',
    isGuest: boolean = false
  ): TariffBreakdown {
    const ratePerKwh = tariff === 'commercial' ? 11.71 : 10.07;
    const serviceFee = 5.0;

    if (amountLe <= serviceFee) {
      return {
        unitsKwh: 0,
        bonusUnitsKwh: 0,
        totalUnitsKwh: 0,
        energyCostLe: 0,
        vatAmountLe: 0,
        serviceFeeLe: amountLe,
        totalAmountLe: amountLe,
        ratePerKwh,
        tariffCategory: tariff,
        isGuestPurchase: isGuest,
      };
    }

    const netPurchasingPower = amountLe - serviceFee;
    const energyCost = Number((netPurchasingPower / 1.15).toFixed(2));
    const vatAmount = Number((netPurchasingPower - energyCost).toFixed(2));
    const rawUnits = Number((energyCost / ratePerKwh).toFixed(1));

    // Guests get 0 bonus. Registered customers get +5% bonus units.
    const bonusUnits = isGuest ? 0 : Number((rawUnits * 0.05).toFixed(1));
    const totalUnits = Number((rawUnits + bonusUnits).toFixed(1));

    return {
      unitsKwh: rawUnits,
      bonusUnitsKwh: bonusUnits,
      totalUnitsKwh: totalUnits,
      energyCostLe: energyCost,
      vatAmountLe: vatAmount,
      serviceFeeLe: serviceFee,
      totalAmountLe: amountLe,
      ratePerKwh,
      tariffCategory: tariff,
      isGuestPurchase: isGuest,
    };
  }

  static validateMeterNumber(meterNumber: string): boolean {
    const cleaned = meterNumber.replace(/\D/g, '');
    return cleaned.length === 11;
  }

  static formatMeterNumber(meterNumber: string): string {
    const cleaned = meterNumber.replace(/\D/g, '');
    if (cleaned.length === 11) {
      return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 8)} ${cleaned.slice(8)}`;
    }
    return cleaned;
  }
}
