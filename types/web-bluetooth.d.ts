/**
 * Minimal ambient declarations for the Web Bluetooth API.
 *
 * TypeScript's bundled DOM lib does not ship Web Bluetooth types yet, so
 * `navigator.bluetooth` and friends are declared here just enough to type
 * `bluetooth-service.ts`. If you'd rather use a community-maintained
 * package instead of this file, install `@types/web-bluetooth` and delete
 * this file (keep only one source of these globals).
 */

export {};

declare global {
  interface BluetoothLEScanFilterInit {
    services?: string[];
    name?: string;
    namePrefix?: string;
  }

  interface RequestDeviceOptions {
    filters?: BluetoothLEScanFilterInit[];
    optionalServices?: string[];
    acceptAllDevices?: boolean;
  }

  interface BluetoothRemoteGATTCharacteristic extends EventTarget {
    readonly uuid: string;
    readonly service?: BluetoothRemoteGATTService;
    writeValue(value: BufferSource): Promise<void>;
    readValue(): Promise<DataView>;
  }

  interface BluetoothRemoteGATTService extends EventTarget {
    readonly uuid: string;
    getCharacteristic(characteristic: string): Promise<BluetoothRemoteGATTCharacteristic>;
  }

  interface BluetoothRemoteGATTServer {
    readonly device: BluetoothDevice;
    readonly connected: boolean;
    connect(): Promise<BluetoothRemoteGATTServer>;
    disconnect(): void;
    getPrimaryService(service: string): Promise<BluetoothRemoteGATTService>;
  }

  /** Fired on a BluetoothDevice by watchAdvertisements(). */
  interface BluetoothAdvertisingEvent extends Event {
    readonly device: BluetoothDevice;
  }

  interface BluetoothDevice extends EventTarget {
    readonly id: string;
    readonly name?: string;
    readonly gatt?: BluetoothRemoteGATTServer;
    watchingAdvertisements?: boolean;
    watchAdvertisements?(options?: { signal?: AbortSignal }): Promise<void>;
    unwatchAdvertisements?(): Promise<void>;
  }

  interface Bluetooth extends EventTarget {
    requestDevice(options?: RequestDeviceOptions): Promise<BluetoothDevice>;
    getDevices?(): Promise<BluetoothDevice[]>;
    getAvailability?(): Promise<boolean>;
  }

  interface Navigator {
    readonly bluetooth?: Bluetooth;
  }
}