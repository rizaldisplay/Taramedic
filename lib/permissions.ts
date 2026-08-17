import { Role } from "@/types/role";

export const permissions = {
  dashboard: [
    Role.ADMIN,
    Role.DOKTER,
    Role.PERAWAT,
    Role.FARMASI,
  ],

  emr: [
    Role.ADMIN,
    Role.DOKTER,
    Role.PERAWAT,
  ],

  antrianPoli: [
    Role.ADMIN,
    Role.DOKTER,
    Role.PERAWAT,
  ],

  farmasi: [
    Role.ADMIN,
    Role.FARMASI,
  ],

  laporan: [
    Role.ADMIN,
    Role.DOKTER,
    Role.PERAWAT,
  ],

  pembayaran: [
    Role.ADMIN,
  ],

};