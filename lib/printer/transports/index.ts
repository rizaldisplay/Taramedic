import type { PrinterTransportType } from '@/types/printer';
import { BluetoothTransport } from './bluetooth';
import { UsbTransport } from './usb';
import type { PrinterTransport } from './types';

export type { PrinterTransport } from './types';

export const TRANSPORT_TYPES: PrinterTransportType[] = ['bluetooth', 'usb'];

export const TRANSPORT_LABEL: Record<PrinterTransportType, string> = {
  bluetooth: 'Bluetooth',
  usb: 'USB',
};

export function createTransports(): Record<PrinterTransportType, PrinterTransport> {
  return {
    bluetooth: new BluetoothTransport(),
    usb: new UsbTransport(),
  };
}