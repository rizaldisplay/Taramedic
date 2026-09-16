/**
 * Minimal ambient declarations for the Web Bluetooth API.
 *
 * TypeScript's bundled `lib.dom.d.ts` does not ship Web Bluetooth types,
 * so `navigator.bluetooth` is `undefined` as far as the compiler knows.
 * These declarations cover exactly what `bluetooth-service.ts` uses.
 *
 * Alternative: `npm i -D @types/web-bluetooth` provides a fuller surface —
 * if you install it, this file can be deleted.
 */

export {};

declare global {
    interface BluetoothLEScanFilter {
        namePrefix?: string;
        name?: string;
        services?: Array<string | number>;
    }

    interface RequestDeviceOptions {
        filters: BluetoothLEScanFilter[];
        optionalServices?: Array<string | number>;
    }

    interface BluetoothRemoteGATTCharacteristic extends EventTarget {
        readonly uuid: string;
        readonly value?: DataView;
        writeValue(value: BufferSource): Promise<void>;
        readValue(): Promise<DataView>;
        startNotifications(): Promise<BluetoothRemoteGATTCharacteristic>;
        stopNotifications(): Promise<BluetoothRemoteGATTCharacteristic>;
    }

    interface BluetoothRemoteGATTService {
        readonly uuid: string;
        getCharacteristic(characteristic: string | number): Promise<BluetoothRemoteGATTCharacteristic>;
    }

    interface BluetoothRemoteGATTServer {
        readonly connected: boolean;
        readonly device: BluetoothDevice;
        connect(): Promise<BluetoothRemoteGATTServer>;
        disconnect(): void;
        getPrimaryService(service: string | number): Promise<BluetoothRemoteGATTService>;
    }

    interface BluetoothAdvertisingEvent extends Event {
        readonly device: BluetoothDevice;
    }

    interface BluetoothDeviceEventMap {
        advertisementreceived: BluetoothAdvertisingEvent;
        gattserverdisconnected: Event;
    }

    interface BluetoothDevice extends EventTarget {
        readonly id: string;
        readonly name?: string;
        readonly gatt?: BluetoothRemoteGATTServer;
        readonly watchingAdvertisements?: boolean;
        watchAdvertisements?(options?: { signal?: AbortSignal }): Promise<void>;
        unwatchAdvertisements?(): Promise<void>;
        addEventListener<K extends keyof BluetoothDeviceEventMap>(
            type: K,
            listener: (event: BluetoothDeviceEventMap[K]) => void,
            options?: boolean | AddEventListenerOptions,
        ): void;
        removeEventListener<K extends keyof BluetoothDeviceEventMap>(
            type: K,
            listener: (event: BluetoothDeviceEventMap[K]) => void,
            options?: boolean | EventListenerOptions,
        ): void;
    }

    interface Bluetooth extends EventTarget {
        requestDevice(options: RequestDeviceOptions): Promise<BluetoothDevice>;
        getDevices?(): Promise<BluetoothDevice[]>;
    }

    interface Navigator {
        bluetooth?: Bluetooth;
    }

    /** Our own app-level event, dispatched by BluetoothService on disconnect. */
    interface KioskPrinterDisconnectedDetail {
        device: BluetoothDevice;
    }

    interface WindowEventMap {
        'kiosk-printer-disconnected': CustomEvent<KioskPrinterDisconnectedDetail>;
    }
}