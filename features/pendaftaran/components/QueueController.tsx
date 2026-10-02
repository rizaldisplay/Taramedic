/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import {
  Settings2,
  Volume2,
  RefreshCw,
  Check,
  ChevronsRight,
  Info,
  Ticket,
  ChevronRight,
  AlertTriangle,
  ArrowRight,
  X,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchQueueStatus,
  callNextQueue,
  callNextSkipQueue,
  recallQueue,
  SkipQueue,
  startServingQueue,
  setActiveTab,
  selectNextInQueue,
  selectNextInSkipQueue,
} from "../slices/queueSlice";
import { showNotification } from "@/features/notification/notificationSlice";

import { getEcho } from "@/lib/realtime/echo";

export default function QueueController() {
  const dispatch = useAppDispatch();
  const {
    antreanSaatIni,
    daftarAntrean,
    daftarTerlewati,
    menunggu,
    terlewati,
    activeTab,
  } = useAppSelector((state) => state.queue);
  const nextTicket = useAppSelector(selectNextInQueue);
  const nextTicketSkip = useAppSelector(selectNextInSkipQueue);

  // State untuk menyimpan pilihan loket
  const MAX_VISIBLE_ITEMS = 5;
  const [selectedLoket, setSelectedLoket] = useState<number>(1);
  const [showBadge, setShowBadge] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<
    (typeof daftarAntrean)[number] | null
  >(null);
  const [isTakeoverModalOpen, setIsTakeoverModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const triggerBadge = () => {
    const badgeTimer = window.setTimeout(() => {
      setShowBadge(true);

      const hideTimer = window.setTimeout(() => {
        setShowBadge(false);
      }, 5000);

      return () => window.clearTimeout(hideTimer);
    }, 0);

    return () => window.clearTimeout(badgeTimer);
  };

  useEffect(() => {
    dispatch(fetchQueueStatus());

    const echo = getEcho();

    if (!echo) {
      return;
    }

    const channel = echo.channel("queue-board").listen(".queue.updated", () => {
      console.log("[Queue] 🔄 Antrean diperbarui dari Kiosk");

      dispatch(fetchQueueStatus());
    });

    return () => {
      channel.unsubscribe();
      echo.leave("queue-board");
    };
  }, [dispatch]);

  const filteredAntrean =
    activeTab == "Menunggu" ? daftarAntrean : daftarTerlewati;

  const handleCallNext = async (counterId: number) => {
    try {
      await dispatch(callNextQueue(counterId)).unwrap();

      dispatch(
        showNotification({
          title: "Berhasil Dipanggil",
          message: `Nomor antrean berhasil dipanggil.`,
          type: "success",
        }),
      );

      triggerBadge();
    } catch (error: any) {
      dispatch(
        showNotification({
          title: "Gagal Memanggil",
          message:
            typeof error === "string" ? error : "Terjadi kesalahan sistem.",
          type: "error",
        }),
      );
    }
  };

  const handleCallSkipNext = async (counterId: number) => {
    try {
      await dispatch(callNextSkipQueue(counterId)).unwrap();

      dispatch(
        showNotification({
          title: "Berhasil Dipanggil",
          message: `Nomor antrean terlewati berhasil dipanggil.`,
          type: "success",
        }),
      );
    } catch (error: any) {
      dispatch(
        showNotification({
          title: "Gagal Memanggil",
          message:
            typeof error === "string" ? error : "Terjadi kesalahan sistem.",
          type: "error",
        }),
      );
    }
  };

  const normalizeQueueActionPayload = (
    payload?: { counterId: number; ticketsId?: string } | string,
  ): { counterId: number; ticketsId?: string } => {
    if (typeof payload === "string") {
      return { counterId: selectedLoket, ticketsId: payload };
    }

    return payload ?? { counterId: selectedLoket, ticketsId: undefined };
  };

  const handleRecall = async (
    payload?: { counterId: number; ticketsId?: string } | string,
  ) => {
    const { counterId, ticketsId } = normalizeQueueActionPayload(payload);

    if (!ticketsId) {
      dispatch(
        showNotification({
          title: "Gagal Memanggil Ulang",
          message: "ID antrean tidak tersedia.",
          type: "error",
        }),
      );
      return;
    }

    try {
      await dispatch(recallQueue({ counterId, ticketsId }));

      dispatch(
        showNotification({
          title: "Berhasil Memanggil Ulang",
          message: `Nomor antrean berhasil dipanggil ulang.`,
          type: "success",
        }),
      );

      triggerBadge();
    } catch (error: any) {
      dispatch(
        showNotification({
          title: "Gagal Memanggil Ulang",
          message:
            typeof error === "string" ? error : "Terjadi kesalahan sistem.",
          type: "error",
        }),
      );
    }
  };

  const handleServing = async (
    payload?: { counterId: number; ticketsId?: string } | string,
  ) => {
    const { counterId, ticketsId } = normalizeQueueActionPayload(payload);

    if (!ticketsId) {
      dispatch(
        showNotification({
          title: "Gagal Merubah Status",
          message: "ID antrean tidak tersedia.",
          type: "error",
        }),
      );
      return;
    }

    try {
      await dispatch(startServingQueue({ counterId, ticketsId }));

      dispatch(
        showNotification({
          title: "Status Berhasil Diubah",
          message: `Pasien ditandai hadir dan mulai dilayani.`,
          type: "success",
        }),
      );
    } catch (error: any) {
      dispatch(
        showNotification({
          title: "Gagal Merubah Status",
          message:
            typeof error === "string" ? error : "Terjadi kesalahan sistem.",
          type: "error",
        }),
      );
    }
  };

  const handleSkip = async (
    payload?: { counterId: number; ticketsId?: string } | string,
  ) => {
    const { counterId, ticketsId } = normalizeQueueActionPayload(payload);

    if (!ticketsId) {
      dispatch(
        showNotification({
          title: "Gagal Melewati",
          message: "ID antrean tidak tersedia.",
          type: "error",
        }),
      );
      return;
    }

    try {
      await dispatch(SkipQueue({ counterId, ticketsId }));
      dispatch(
        showNotification({
          title: "Merubah Status Terlewati",
          message: `Nomor antrean berhasil diubah menjadi terlewati.`,
          type: "success",
        }),
      );
    } catch (error: any) {
      dispatch(
        showNotification({
          title: "Gagal Melewati",
          message:
            typeof error === "string" ? error : "Terjadi kesalahan sistem.",
          type: "error",
        }),
      );
    }
  };

  const handlePanggilUlang = () => {
    if (!antreanSaatIni?.id) {
      dispatch(
        showNotification({
          title: "Gagal Memanggil Ulang",
          message: "ID antrean tidak tersedia.",
          type: "error",
        }),
      );
      return;
    }

    // Cek apakah loket di dropdown berbeda dengan loket asal antrean
    if (selectedLoket !== antreanSaatIni?.nomorLoket) {
      setIsTakeoverModalOpen(true); // Munculkan modal
      return;
    }

    handleRecall({
      counterId: selectedLoket,
      ticketsId: antreanSaatIni.id,
    });
  };

  const konfirmasiAmbilAlih = () => {
    setIsTakeoverModalOpen(false);

    if (!antreanSaatIni?.id) {
      return;
    }

    handleRecall({
      counterId: selectedLoket,
      ticketsId: antreanSaatIni.id,
    });
  };

  return (
    <div className="w-full h-full flex flex-col p-5 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 tracking-wide">
          <Settings2 size={16} />
          KONTROLER PEMANGGIL
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <Settings2 size={16} />
        </button>
      </div>

      {/* Active Queue Card */}
      <div className="bg-[#0b2756] rounded-xl p-4 text-white mb-3 shadow-md relative overflow-hidden flex-shrink-0">
        <p className="text-xs font-medium text-gray-200 mb-2">
          NOMOR SAAT INI (LOKET {antreanSaatIni?.nomorLoket ?? selectedLoket})
        </p>
        <div className="flex justify-between items-start">
          <h1 className="text-5xl font-bold tracking-tight">
            {antreanSaatIni?.nomorAntrean ?? "-"}
          </h1>
          {showBadge && (
            <span className="bg-[#ffdb58] text-yellow-900 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
              <Volume2 size={12} /> Dipanggil
            </span>
          )}
        </div>
        <div className="mt-4 text-[11px] text-gray-300 flex flex-col gap-0.5">
          <p>Dipanggil : {antreanSaatIni?.waktuPanggil ?? ""}</p>
          <p>Pemanggilan ke-1 dari {antreanSaatIni?.pemanggilanKe ?? "0"}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2 mb-4 flex-shrink-0">
        {/* Pilihan Loket (Dipindah ke atas tombol Panggil) */}
        <div className="flex justify-between items-center bg-gray-50 border border-gray-200 rounded-lg p-2 mb-1">
          <label
            htmlFor="loket-select"
            className="text-xs font-semibold text-gray-600"
          >
            PILIH LOKET:
          </label>
          <select
            id="loket-select"
            value={selectedLoket}
            onChange={(e) => setSelectedLoket(Number(e.target.value))}
            className="text-sm font-medium border border-gray-300 rounded-md focus:border-cyan-500 focus:ring-cyan-500 py-1 px-3 bg-white text-gray-800 outline-none cursor-pointer"
          >
            <option value={1}>Loket 1</option>
            <option value={2}>Loket 2</option>
            <option value={3}>Loket 3</option>
            <option value={4}>Loket 4</option>
          </select>
        </div>

        {antreanSaatIni ? (
          <button
            onClick={handlePanggilUlang}
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg py-2.5 flex items-center justify-center gap-2 text-sm font-semibold transition-colors cursor-pointer"
          >
            <RefreshCw size={16} /> {antreanSaatIni?.nomorLoket != selectedLoket ? "Ambil Alih - " + antreanSaatIni?.nomorAntrean : "PANGGIL ULANG"} 
          </button>
        ) : (
          <button
            onClick={() => {
              activeTab == "Menunggu"
                ? handleCallNext(selectedLoket)
                : handleCallSkipNext(selectedLoket);
            }}
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg py-2.5 flex items-center justify-center gap-2 text-sm font-semibold transition-colors cursor-pointer"
          >
            <Volume2 size={18} /> PANGGIL BERIKUTNYA
          </button>
        )}

        <div className="grid grid-cols-2 gap-2 mt-1">
          <button
            onClick={() =>
              handleServing({
                counterId: selectedLoket,
                ticketsId: antreanSaatIni?.id,
              })
            }
            className="bg-green-50 hover:bg-green-100 border border-green-200 text-green-600 rounded-lg py-2 flex items-center justify-center gap-2 text-sm font-semibold transition-colors cursor-pointer"
          >
            <Check size={16} /> HADIR
          </button>
          <button
            onClick={() =>
              handleSkip({
                counterId: selectedLoket,
                ticketsId: antreanSaatIni?.id,
              })
            }
            className="bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-500 rounded-lg py-2 flex items-center justify-center gap-2 text-sm font-semibold transition-colors cursor-pointer"
          >
            <ChevronsRight size={16} /> LEWATI
          </button>
        </div>
      </div>

      {/* Info Alert */}
      <div className="bg-cyan-50 border border-cyan-100 rounded-lg p-3 flex gap-2 items-start mb-6 flex-shrink-0">
        <Info size={16} className="text-cyan-600 mt-0.5 shrink-0" />
        <p className="text-xs text-cyan-800 leading-relaxed">
          Tandai status pasien untuk membuka proses pendaftaran.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-3 flex-shrink-0">
        <button
          onClick={() => dispatch(setActiveTab("Menunggu"))}
          className={`flex-1 pb-2 text-xs font-semibold text-center transition-colors cursor-pointer ${
            activeTab === "Menunggu"
              ? "text-cyan-600 border-b-2 border-cyan-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          MENUNGGU ({menunggu})
        </button>
        <button
          onClick={() => dispatch(setActiveTab("Terlewati"))}
          className={`flex-1 pb-2 text-xs font-semibold text-center transition-colors cursor-pointer ${
            activeTab === "Terlewati"
              ? "text-cyan-600 border-b-2 border-cyan-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          TERLEWATI ({terlewati})
        </button>
      </div>

      {/* Queue List */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-1 mb-4 scrollbar-thin scrollbar-thumb-gray-200 custom-scrollbar">
        {filteredAntrean?.length === 0 ? (
          <p className="text-xs text-center text-gray-400 py-4">
            Tidak ada antrean {activeTab?.toLowerCase()}
          </p>
        ) : (
          // Gunakan .slice(0, MAX_VISIBLE_ITEMS) untuk membatasi array
          filteredAntrean.slice(0, MAX_VISIBLE_ITEMS).map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedTicket(item)}
              className={`flex justify-between items-center px-4 py-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                selectedTicket?.id === item.id
                  ? "bg-cyan-50 border-cyan-400 shadow-sm"
                  : "border-transparent border-b-gray-50 hover:bg-gray-50 hover:border-b-transparent"
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`${selectedTicket?.id === item.id ? "text-cyan-500" : "text-gray-400"}`}
                >
                  <Ticket size={20} />
                </div>

                <div className="flex flex-col gap-1">
                  <p className="text-sm font-bold text-gray-800 leading-none">
                    {item.nomorAntrean}
                  </p>
                  <p className="text-[11px] text-gray-500 flex items-center gap-1.5 leading-none">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        selectedTicket?.id === item.id
                          ? "bg-cyan-500"
                          : "bg-gray-300"
                      }`}
                    ></span>
                    {item.statusAntrean}
                  </p>
                </div>
              </div>

              <div className="text-right flex flex-col gap-1">
                <p className="text-[11px] text-gray-500 leading-none">
                  Diambil {item.waktuAmbil}
                </p>
                <p
                  className={`text-[12px] font-semibold leading-none ${
                    item.waitTimeColor || "text-green-500"
                  }`}
                >
                  {item.estimasiTunggu ?? "-"}
                </p>
              </div>
            </div>
          ))
        )}

        {/* Tampilkan tombol "Lihat Semua" HANYA jika total item lebih dari batas maksimal */}
        {filteredAntrean?.length > MAX_VISIBLE_ITEMS && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full mt-2 text-xs text-cyan-600 font-semibold flex items-center justify-center gap-1 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ChevronRight size={14} /> LIHAT SEMUA ({filteredAntrean.length})
          </button>
        )}
      </div>

      {/* Modal Lihat Semua */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md flex flex-col max-h-[80vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-800 text-lg">
                Semua Antrean {activeTab}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body (List Antrean Lengkap) */}
            <div className="p-4 overflow-y-auto space-y-2">
              {filteredAntrean.map((item) => (
                <div
                  key={`modal-${item.id}`}
                  onClick={() => {
                    setSelectedTicket(item);
                    setIsModalOpen(false); // Opsional: Tutup modal setelah memilih
                  }}
                  className={`flex justify-between items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedTicket?.id === item.id
                      ? "bg-cyan-50 border-cyan-300"
                      : "border-gray-100 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${selectedTicket?.id === item.id ? "bg-cyan-100 text-cyan-600" : "bg-gray-100 text-gray-500"}`}
                    >
                      <Ticket size={20} />
                    </div>
                    <div>
                      <p className="text-base font-bold text-gray-800">
                        {item.nomorAntrean}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.statusAntrean} • Diambil {item.waktuAmbil}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-xs font-semibold ${item.waitTimeColor || "text-green-500"}`}
                    >
                      {item.estimasiTunggu ?? "-"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Ambil Alih */}
      {isTakeoverModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Content */}
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                  <AlertTriangle size={22} strokeWidth={2.2} />
                </div>

                <div className="min-w-0">
                  <h3 className="text-lg font-bold text-gray-900">
                    Ambil Alih Antrean?
                  </h3>

                  <p className="mt-1 text-sm leading-relaxed text-gray-500">
                    Antrean ini sedang diproses oleh loket lain.
                  </p>
                </div>
              </div>

              {/* Queue Information */}
              <div className="mt-5 overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                {/* Queue Number */}
                <div className="border-b border-gray-200 bg-white px-4 py-4 text-center">
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                    Nomor Antrean
                  </p>

                  <p className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
                    {antreanSaatIni?.nomorAntrean}
                  </p>
                </div>

                {/* Transfer */}
                <div className="flex items-center justify-center gap-4 px-4 py-5">
                  {/* Current Counter */}
                  <div className="flex-1 text-center">
                    <p className="text-xs font-medium text-gray-400">
                      Sedang Diproses
                    </p>

                    <p className="mt-1 text-base font-bold text-gray-700">
                      Loket {antreanSaatIni?.nomorLoket}
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-gray-400 shadow-sm ring-1 ring-gray-200">
                    <ArrowRight size={17} />
                  </div>

                  {/* Target Counter */}
                  <div className="flex-1 text-center">
                    <p className="text-xs font-medium text-gray-400">
                      Akan Diambil Alih
                    </p>

                    <p className="mt-1 text-base font-bold text-cyan-600">
                      Loket {selectedLoket}
                    </p>
                  </div>
                </div>
              </div>

              {/* Warning */}
              <div className="mt-4 flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2.5 text-sm text-amber-700">
                <AlertTriangle size={16} className="mt-0.5 shrink-0" />

                <p className="leading-relaxed">
                  Pemanggilan pada loket sebelumnya akan dialihkan ke loket
                  Anda.
                </p>
              </div>

              {/* Confirmation */}
              <p className="mt-4 text-center text-sm text-gray-500">
                Apakah Anda yakin ingin melanjutkan?
              </p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-gray-100 bg-gray-50 px-6 py-4">
              <button
                type="button"
                onClick={() => setIsTakeoverModalOpen(false)}
                className="
            rounded-lg px-4 py-2.5
            text-sm font-semibold text-gray-600
            transition-colors
            hover:bg-gray-200
            focus:outline-none focus:ring-2 focus:ring-gray-300
          "
              >
                Batal
              </button>

              <button
                type="button"
                onClick={konfirmasiAmbilAlih}
                className="
            inline-flex items-center gap-2
            rounded-lg bg-amber-500 px-4 py-2.5
            text-sm font-semibold text-white
            shadow-sm
            transition-all
            hover:bg-amber-600
            hover:shadow
            focus:outline-none focus:ring-2 focus:ring-amber-400
            active:scale-[0.98]
          "
              >
                <Check size={17} strokeWidth={2.5} />
                Ya, Ambil Alih
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Next Up Section */}
      {activeTab == "Menunggu" ? (
        <div className="mt-auto flex-shrink-0 pt-2 border-t border-slate-100">
          <p className="text-xs font-semibold text-cyan-800 mb-2">
            BERIKUTNYA{" "}
            {antreanSaatIni ? `(SETELAH ${antreanSaatIni.nomorAntrean})` : ""}
          </p>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
            <div>
              <p className="text-base font-bold text-gray-800">
                {selectedTicket
                  ? selectedTicket.nomorAntrean
                  : (nextTicket?.nomorAntrean ?? "-")}
              </p>
              <p className="text-[10px] text-gray-500 flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-cyan-500"></span>{" "}
                {selectedTicket
                  ? selectedTicket.statusAntrean
                  : (nextTicket?.statusAntrean ?? "Tidak ada antrean")}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[11px] text-gray-500">
                Diambil{" "}
                {selectedTicket
                  ? selectedTicket.waktuAmbil
                  : (nextTicket?.waktuAmbil ?? "-")}
              </p>
              <p
                className={`text-[11px] font-medium ${selectedTicket ? selectedTicket.waitTimeColor : nextTicket?.waitTimeColor || "text-green-500"}`}
              >
                {selectedTicket
                  ? selectedTicket.estimasiTunggu
                  : (nextTicket?.estimasiTunggu ?? "-")}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-auto flex-shrink-0 pt-2 border-t border-slate-100">
          <p className="text-xs font-semibold text-cyan-800 mb-2">
            BERIKUTNYA{" "}
            {antreanSaatIni ? `(SETELAH ${antreanSaatIni.nomorAntrean})` : ""}
          </p>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
            <div>
              <p className="text-base font-bold text-gray-800">
                {nextTicketSkip?.nomorAntrean ?? "-"}
              </p>
              <p className="text-[10px] text-gray-500 flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-cyan-500"></span>{" "}
                {nextTicketSkip?.statusAntrean ?? "Tidak ada antrean"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[11px] text-gray-500">
                Diambil {nextTicketSkip?.waktuAmbil ?? "-"}
              </p>
              <p
                className={`text-[11px] font-medium ${nextTicketSkip?.waitTimeColor || "text-green-500"}`}
              >
                {nextTicketSkip?.estimasiTunggu ?? "-"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
