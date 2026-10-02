import type { PairedDevice } from '@/types/printer';
import type { PrinterTransport } from './types';

declare global {
  interface Navigator {
    usb: USB;
  }

  interface USBConnectionEvent {
    device: USBDevice;
  }

  interface USBDevice {
    readonly vendorId: number;
    readonly productId: number;
    readonly manufacturerName?: string;
    readonly productName?: string;
    readonly serialNumber?: string;
    readonly opened: boolean;
    readonly configuration: USBConfiguration | null;
    open(): Promise<void>;
    close(): Promise<void>;
    selectConfiguration(configurationValue: number): Promise<void>;
    claimInterface(interfaceNumber: number): Promise<void>;
    releaseInterface(interfaceNumber: number): Promise<void>;
    selectAlternateInterface(interfaceNumber: number, alternateSetting: number): Promise<void>;
    transferOut(endpointNumber: number, data: BufferSource): Promise<USBOutTransferResult>;
    clearHalt(direction: USBDirection, endpointNumber: number): Promise<void>;
    forget?(): Promise<void>;
  }

  interface USBConfiguration {
    readonly interfaces: USBInterface[];
  }

  interface USBInterface {
    readonly interfaceNumber: number;
    readonly alternates: USBAlternateInterface[];
  }

  interface USBAlternateInterface {
    readonly alternateSetting: number;
    readonly interfaceClass: number;
    readonly endpoints: USBEndpoint[];
  }

  interface USBEndpoint {
    readonly endpointNumber: number;
    readonly direction: USBDirection;
    readonly type: USBTransferType;
  }

  type USBDirection = 'in' | 'out';
  type USBTransferType = 'bulk' | 'interrupt' | 'isochronous' | 'control';

  interface USBOutTransferResult {
    status: USBTransferStatus;
  }

  type USBTransferStatus = 'ok' | 'stall' | 'babble' | 'overflow' | 'notSupported' | 'transferError';

  interface USB {
    requestDevice(options: { filters?: UsbDeviceFilter[] }): Promise<USBDevice>;
    getDevices(): Promise<USBDevice[]>;
    addEventListener(type: 'connect' | 'disconnect', listener: (event: USBConnectionEvent) => void): void;
    removeEventListener(type: 'connect' | 'disconnect', listener: (event: USBConnectionEvent) => void): void;
  }
}

/**
 * Filter dialog pemilihan perangkat. Dibiarkan kosong karena banyak printer
 * thermal murah melaporkan class vendor-specific (0xFF), bukan Printer (0x07).
 * Chrome tetap menyembunyikan perangkat yang dilindungi (keyboard, flashdisk, dll).
 * Untuk mempersempit, isi mis. `[{ vendorId: 0x0416 }, { classCode: 0x07 }]`.
 */
interface UsbDeviceFilter {
  vendorId?: number;
  productId?: number;
  classCode?: number;
  subclassCode?: number;
  protocolCode?: number;
  serialNumber?: string;
}

const USB_FILTERS: UsbDeviceFilter[] = [];

const USB_PRINTER_CLASS = 0x07;

/** Kelas yang diblokir WebUSB: audio, HID, mass storage, smart card, video, A/V, wireless. */
const PROTECTED_CLASSES = new Set([0x01, 0x03, 0x08, 0x0b, 0x0e, 0x10, 0xe0]);
const CHUNK_SIZE = 16 * 1024;

interface EndpointTarget {
  interfaceNumber: number;
  alternateSetting: number;
  endpointNumber: number;
  isPrinterClass: boolean;
}

const hex = (value: number) => value.toString(16).padStart(4, '0');

function usbDeviceId(device: USBDevice): string {
  return `usb:${hex(device.vendorId)}:${hex(device.productId)}:${device.serialNumber ?? ''}`;
}

function usbDeviceName(device: USBDevice): string {
  return (
    device.productName ||
    device.manufacturerName ||
    `USB ${hex(device.vendorId)}:${hex(device.productId)}`
  );
}

/** Cari endpoint bulk OUT; interface class Printer didahulukan. */
function findBulkOutEndpoint(device: USBDevice): EndpointTarget | null {
  const configuration = device.configuration;

  if (!configuration) {
    return null;
  }

  const targets: EndpointTarget[] = [];

  for (const usbInterface of configuration.interfaces) {
    for (const alternate of usbInterface.alternates) {
      if (PROTECTED_CLASSES.has(alternate.interfaceClass)) {
        continue; // claimInterface pada kelas ini selalu SecurityError
      }

      for (const endpoint of alternate.endpoints) {
        if (endpoint.direction === 'out' && endpoint.type === 'bulk') {
          targets.push({
            interfaceNumber: usbInterface.interfaceNumber,
            alternateSetting: alternate.alternateSetting,
            endpointNumber: endpoint.endpointNumber,
            isPrinterClass: alternate.interfaceClass === USB_PRINTER_CLASS,
          });
        }
      }
    }
  }

  targets.sort((a, b) => Number(b.isPrinterClass) - Number(a.isPrinterClass));

  return targets[0] ?? null;
}

export class UsbTransport implements PrinterTransport {
  readonly type = 'usb' as const;

  private device: USBDevice | null = null;
  private target: EndpointTarget | null = null;
  private disconnectHandler: (() => void) | null = null;

  private readonly handleUsbDisconnect = (event: USBConnectionEvent) => {
    if (event.device !== this.device) {
      return;
    }

    this.stopListening();
    this.device = null;
    this.target = null;
    this.disconnectHandler?.();
  };

  isSupported(): boolean {
    return typeof navigator !== 'undefined' && 'usb' in navigator;
  }

  isConnected(): boolean {
    return Boolean(this.device?.opened && this.target);
  }

  setDisconnectHandler(handler: (() => void) | null): void {
    this.disconnectHandler = handler;
  }

  async pair(): Promise<PairedDevice | null> {
    let device: USBDevice;

    try {
      device = await navigator.usb.requestDevice({ filters: USB_FILTERS });
    } catch (error) {
      if (error instanceof DOMException && error.name === 'NotFoundError') {
        return null; // dialog dibatalkan
      }

      throw error;
    }

    return this.attach(device);
  }

  async reconnect(saved: PairedDevice): Promise<PairedDevice | null> {
    const devices = await navigator.usb.getDevices();
    const device = devices.find((item) => usbDeviceId(item) === saved.id);

    return device ? this.attach(device) : null;
  }

  async write(data: Uint8Array): Promise<void> {
    const device = this.device;
    const target = this.target;

    if (!device || !target || !device.opened) {
      throw new Error('Printer USB belum tersambung.');
    }

    for (let offset = 0; offset < data.length; offset += CHUNK_SIZE) {
      const result = await device.transferOut(
        target.endpointNumber,
        data.slice(offset, offset + CHUNK_SIZE),
      );

      if (result.status !== 'ok') {
        if (result.status === 'stall') {
          await device.clearHalt('out', target.endpointNumber);
        }

        throw new Error(`Pengiriman data USB gagal (${result.status}).`);
      }
    }
  }

  async disconnect(): Promise<void> {
    await this.release();
  }

  async forget(saved?: PairedDevice): Promise<void> {
    const current = this.device;

    await this.release();

    const targets: USBDevice[] = current ? [current] : [];

    if (!current && saved) {
      const devices = await navigator.usb.getDevices();
      targets.push(...devices.filter((item) => usbDeviceId(item) === saved.id));
    }

    for (const target of targets) {
      await target.forget?.();
    }
  }

  private async attach(device: USBDevice): Promise<PairedDevice> {
    await this.release();

    if (!device.opened) {
      await device.open();
    }

    try {
      if (device.configuration === null) {
        await device.selectConfiguration(1);
      }

      const target = findBulkOutEndpoint(device);

      if (!target) {
        throw new Error('Endpoint tulis USB tidak ditemukan. Pastikan ini printer thermal.');
      }

      await device.claimInterface(target.interfaceNumber);

      if (target.alternateSetting !== 0) {
        await device.selectAlternateInterface(target.interfaceNumber, target.alternateSetting);
      }

      this.target = target;
    } catch (error) {
      console.error('[USB printer] gagal membuka perangkat', error);
      await device.close().catch(() => undefined);
      throw error;
    }

    this.device = device;
    navigator.usb.addEventListener('disconnect', this.handleUsbDisconnect);

    return { id: usbDeviceId(device), name: usbDeviceName(device) };
  }

  private stopListening(): void {
    navigator.usb.removeEventListener('disconnect', this.handleUsbDisconnect);
  }

  private async release(): Promise<void> {
    const device = this.device;
    const target = this.target;

    this.stopListening();
    this.device = null;
    this.target = null;

    if (!device) {
      return;
    }

    try {
      if (target) {
        await device.releaseInterface(target.interfaceNumber);
      }
    } catch {
      // interface mungkin sudah dilepas saat kabel dicabut
    }

    try {
      await device.close();
    } catch {
      // perangkat mungkin sudah hilang
    }
  }
}