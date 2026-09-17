import { StatusPasien, JenisPenjamin } from '@/types/common'; // Sesuaikan path

interface GenerateQueueParams {
    lastNumber: number;
    jenisPenjamin?: JenisPenjamin;
    statusPasien?: StatusPasien;
}

/**
 * Men-generate nomor antrean dengan format Prefix + 3 Digit Angka (Contoh: A081)
 */
export const generateQueueNumber = ({
    lastNumber,
    jenisPenjamin,
    statusPasien
}: GenerateQueueParams): string => {
    // Logic penentuan prefix bisa disesuaikan dengan business rule klinik
    // Default menggunakan 'A' sesuai gambar screenshot (A081)
    let prefix = 'A'; 
    
    if (jenisPenjamin === 'Umum') {
        prefix = 'B';
    } else if (jenisPenjamin === 'Asuransi Lain') {
        prefix = 'C';
    }

    const nextNumber = lastNumber + 1;
    // Pad dengan angka 0 di depan agar selalu 3 digit (001, 081, 999)
    const formattedNumber = nextNumber.toString().padStart(3, '0');

    return `${prefix}${formattedNumber}`;
};