/* eslint-disable @typescript-eslint/no-explicit-any */
import type { PairedDevice } from '@/types/printer';
import type { PrinterTransport } from './types';

/**
 * Service UUID yang umum dipakai printer thermal BLE (RPP02, Feasycom, dan
 * modul generik). Web Bluetooth hanya mengizinkan akses ke service yang
 * didaftarkan di sini, jadi tambahkan UUID lain bila printer Anda memakainya.
 */
const PRINTER_SERVICES = [
  '000018f0-0000-1000-8000-00805f9b34fb',
  '0000ff00-0000-1000-8000-00805f9b34fb',
  '0000ffe0-0000-1000-8000-00805f9b34fb',
  '0000fff0-0000-1000-8000-00805f9b34fb',
  'e7810a71-73ae-499d-8c15-faa9aef0c3f2',
  '49535343-fe7d-4ae5-8fa9-9fafd205e455',
];

/** Ukuran paket aman untuk MTU BLE default (23 byte - 3 byte header). */
const CHUNK_SIZE = 20;
const CHUNK_DELAY_MS = 20;

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

function isNotFoundError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'NotFoundError';
}

async function findWritableCharacteristic(
  server: BluetoothRemoteGATTServer,
): Promise<BluetoothRemoteGATTCharacteristic> {
  const services = await server.getPrimaryServices();

  for (const service of services) {
    const characteristics = await service.getCharacteristics();
    const writable = characteristics.find(
      (item: { properties: { write: any; writeWithoutResponse: any; }; }) => item.properties.write || item.properties.writeWithoutResponse,
    );

    if (writable) {
      return writable;
    }
  }

  throw new Error('Karakteristik tulis tidak ditemukan. Pastikan perangkat ini printer thermal BLE.');
}

export class BluetoothTransport implements PrinterTransport {
  readonly type = 'bluetooth' as const;

  private device: BluetoothDevice | null = null;
  private characteristic: BluetoothRemoteGATTCharacteristic | null = null;
  private disconnectHandler: (() => void) | null = null;

  private readonly handleGattDisconnected = () => {
    this.characteristic = null;
    this.disconnectHandler?.();
  };

  isSupported(): boolean {
    return typeof navigator !== 'undefined' && 'bluetooth' in navigator;
  }

  private getBluetooth(): Bluetooth | null {
    if (typeof navigator === 'undefined') {
      return null;
    }

    return navigator.bluetooth ?? null;
  }

  isConnected(): boolean {
    return Boolean(this.device?.gatt?.connected && this.characteristic);
  }

  setDisconnectHandler(handler: (() => void) | null): void {
    this.disconnectHandler = handler;
  }

  async pair(): Promise<PairedDevice | null> {
    const bluetooth = this.getBluetooth();

    if (!bluetooth) {
      return null;
    }

    let device: BluetoothDevice;

    try {
      device = await bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: PRINTER_SERVICES,
      });
    } catch (error) {
      if (isNotFoundError(error)) {
        return null; // dialog dibatalkan
      }

      throw error;
    }

    return this.attach(device);
  }

  async reconnect(saved: PairedDevice): Promise<PairedDevice | null> {
    const bluetooth = this.getBluetooth();

    // getDevices() belum tersedia di semua versi Chrome; kalau tidak ada,
    // pengguna harus memasangkan ulang lewat dialog.
    if (!bluetooth || typeof bluetooth.getDevices !== 'function') {
      return null;
    }

    const devices = await bluetooth.getDevices();
    const device = devices.find((item) => item.id === saved.id);

    return device ? this.attach(device) : null;
  }

  async write(data: Uint8Array): Promise<void> {
    const characteristic = this.characteristic;

    if (!characteristic || !this.device?.gatt?.connected) {
      throw new Error('Printer Bluetooth belum tersambung.');
    }

    // Utamakan write dengan response: lebih lambat sedikit tapi buffer printer aman.
    const withResponse = characteristic.properties.write;

    for (let offset = 0; offset < data.length; offset += CHUNK_SIZE) {
      const chunk = data.slice(offset, offset + CHUNK_SIZE);

      if (withResponse) {
        await characteristic.writeValue(chunk);
      } else {
        await characteristic.writeValueWithoutResponse(chunk);
      }

      await sleep(CHUNK_DELAY_MS);
    }
  }

  async disconnect(): Promise<void> {
    this.release();
  }

  async forget(saved?: PairedDevice): Promise<void> {
    const current = this.device;

    this.release();

    const targets: BluetoothDevice[] = current ? [current] : [];
    const bluetooth = this.getBluetooth();

    if (!current && saved && bluetooth && typeof bluetooth.getDevices === 'function') {
      const devices = await bluetooth.getDevices();
      targets.push(...devices.filter((item) => item.id === saved.id));
    }

    for (const target of targets) {
      // forget() baru ada di Chrome terbaru.
      await (target as BluetoothDevice & { forget?: () => Promise<void> }).forget?.();
    }
  }

  private async attach(device: BluetoothDevice): Promise<PairedDevice> {
    this.release();

    if (!device.gatt) {
      throw new Error('Perangkat Bluetooth ini tidak mendukung GATT.');
    }

    device.addEventListener('gattserverdisconnected', this.handleGattDisconnected);

    try {
      const server = await device.gatt.connect();
      this.characteristic = await findWritableCharacteristic(server);
      this.device = device;
    } catch (error) {
      device.removeEventListener('gattserverdisconnected', this.handleGattDisconnected);
      device.gatt.disconnect();
      throw error;
    }

    return { id: device.id, name: device.name || 'Printer Bluetooth' };
  }

  private release(): void {
    const device = this.device;

    this.characteristic = null;
    this.device = null;

    if (device) {
      device.removeEventListener('gattserverdisconnected', this.handleGattDisconnected);

      if (device.gatt?.connected) {
        device.gatt.disconnect();
      }
    }
  }
}