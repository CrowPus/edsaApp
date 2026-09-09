import { PaymentMethodId, PaymentResponse } from '../types/edsa';

export class PaymentService {
  /**
   * Simulates payment authorization via Orange Money, Afrimoney, or Bank Card
   * @param method PaymentMethodId
   * @param phoneOrAccount string
   * @param amountLe number
   * @param shouldSimulateFailure boolean
   */
  static async processPayment(
    method: PaymentMethodId,
    phoneOrAccount: string,
    amountLe: number,
    shouldSimulateFailure: boolean = false
  ): Promise<PaymentResponse> {
    // Realistic gateway network latency (1.2 seconds)
    await new Promise((resolve) => setTimeout(resolve, 1200));

    if (shouldSimulateFailure) {
      return {
        success: false,
        transactionReference: '',
        errorMessage: 'Payment was declined by the network provider (Simulated demo mode). Please check balance or PIN.',
        timestamp: new Date().toISOString(),
      };
    }

    const ref = `PAY-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    return {
      success: true,
      transactionReference: ref,
      amountLe,
      timestamp: new Date().toISOString(),
    };
  }
}
