import { StatusAntrean } from '../common';

interface ItemAntrean {
    id: string;
    nomorAntrean: string;
    statusAntrean: StatusAntrean;
    waktuAmbil: string;
    waktuPanggil?: string | null;
    estimasiTunggu: string | null;
    waitTimeColor: string;
    isPasienBaru: boolean;
    pemanggilanKe: number;
}

interface StatusAntreanHarian {
    menunggu: number;
    terlewati: number;
    antreanSaatIni: ItemAntrean | null;
    daftarAntrean: ItemAntrean[];
    daftarTerlewati: ItemAntrean[];
}

export type { ItemAntrean, StatusAntreanHarian };