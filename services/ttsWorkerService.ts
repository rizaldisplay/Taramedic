/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
'use client'; // Wajib karena mengakses objek Worker browser

let workerInstance: Worker | null = null;
const pendingRequests = new Map<number, { resolve: Function, reject: Function, timeoutId: NodeJS.Timeout }>();
let requestSequence = 0; //[cite: 7]

const getWorker = (): Worker => {
    if (typeof window === 'undefined') throw new Error("Worker hanya bisa berjalan di browser");
    if (!workerInstance) {
        // Asumsi offline-tts-worker.js sudah dipindahkan ke direktori /public atau di-bundle khusus
        workerInstance = new Worker(new URL('/tts/offline-tts-worker.js', window.location.origin), { type: 'module' }); //[cite: 7]
        
        workerInstance.addEventListener('message', ({ data }) => {
            if (data?.type === 'status') {
                window.dispatchEvent(new CustomEvent('offline-tts-status', { detail: data })); //[cite: 7]
                return;
            }
            const request = pendingRequests.get(data?.requestId); //[cite: 7]
            if (!request) return;

            pendingRequests.delete(data.requestId);
            clearTimeout(request.timeoutId);

            if (data.type === 'error') {
                request.reject(new Error(data.message)); //[cite: 7]
            } else if (data.type === 'audio') {
                // Proses konversi pcm (Float32Array) ke WAV blob di sini
                // Menggunakan fungsi wavBlob() dari file aslinya[cite: 7]
                request.resolve(new Blob([data.pcm], { type: 'audio/wav' })); 
            } else {
                request.resolve(true); //[cite: 7]
            }
        });
    }
    return workerInstance;
};

export const requestTTS = (type: string, payload = {}): Promise<any> => {
    return new Promise((resolve, reject) => {
        const requestId = ++requestSequence;
        const timeoutId = setTimeout(() => {
            pendingRequests.delete(requestId);
            reject(new Error('TTS offline melewati batas waktu 90 detik.')); //[cite: 7]
        }, 90000);

        pendingRequests.set(requestId, { resolve, reject, timeoutId });
        getWorker().postMessage({ type, requestId, ...payload }); //[cite: 7]
    });
};