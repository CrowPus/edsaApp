import { GRID_STATUS_ITEMS, INITIAL_OUTAGES, FAQ_ITEMS } from './mockData';
import { GridStatusItem, OutageReport, OutageType, FAQItem } from '../types/edsa';

export class OutageService {
  static createOutageReport(params: {
    locationArea: string;
    streetAddress: string;
    issueType: OutageType;
    meterNumber?: string;
    contactPhone?: string;
    description?: string;
  }): OutageReport {
    const codeNumber = Math.floor(1000 + Math.random() * 9000);
    const ticketNumber = `OUT-SL-${codeNumber}`;

    return {
      id: `out_${Date.now()}`,
      ticketNumber,
      referenceCode: ticketNumber,
      locationArea: params.locationArea,
      streetAddress: params.streetAddress,
      issueType: params.issueType,
      meterNumber: params.meterNumber,
      contactPhone: params.contactPhone || '+232 76 543 210',
      description: params.description || '',
      status: 'received',
      reportedAt: new Date().toISOString(),
      estimatedResolutionTime: 'Within 2 - 4 hours',
    };
  }

  static createReport(params: {
    locationArea: string;
    streetAddress: string;
    issueType: OutageType;
    meterNumber?: string;
    contactPhone: string;
    description?: string;
  }): OutageReport {
    return this.createOutageReport(params);
  }

  static getOutageTypeLabel(type: OutageType): string {
    switch (type) {
      case 'blackout':
        return 'Total Area Blackout';
      case 'phase_problem':
        return 'Phase / Partial Power Issue';
      case 'low_voltage':
        return 'Low Voltage / Fluctuating Power';
      case 'transformer':
        return 'Transformer Sparking / Fault';
      case 'fallen_cable':
        return 'Fallen Cable / Damaged Pole';
      case 'other':
      default:
        return 'Other Electrical Fault';
    }
  }

  static getStatusBadge(status: OutageReport['status']): {
    label: string;
    color: string;
    bgColor: string;
  } {
    switch (status) {
      case 'received':
        return {
          label: 'Report Received',
          color: '#2563EB',
          bgColor: '#EFF6FF',
        };
      case 'investigating':
        return {
          label: 'Under Investigation',
          color: '#D97706',
          bgColor: '#FEF3C7',
        };
      case 'technicians_dispatched':
        return {
          label: 'Crew Dispatched',
          color: '#EA580C',
          bgColor: '#FFF7ED',
        };
      case 'resolved':
        return {
          label: 'Power Restored',
          color: '#059669',
          bgColor: '#ECFDF5',
        };
      default:
        return {
          label: 'Processing',
          color: '#64748B',
          bgColor: '#F1F5F9',
        };
    }
  }

  static getGridStatus(): GridStatusItem[] {
    return GRID_STATUS_ITEMS;
  }

  static getMockOutages(): OutageReport[] {
    return INITIAL_OUTAGES;
  }

  static getSupportFaqs(): FAQItem[] {
    return FAQ_ITEMS;
  }
}
