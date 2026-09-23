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
  selectNextInSkipQueue
} from "../slices/queueSlice";
import { showNotification } from '@/features/notification/notificationSlice';

import { getEcho } from "@/lib/realtime/echo";

export default function QueueController() {
  const dispatch = useAppDispatch();
  const { antreanSaatIni, daftarAntrean, daftarTerlewati, menunggu, terlewati, activeTab } = useAppSelector((state) => state.queue);
  const nextTicket = useAppSelector(selectNextInQueue);
  const nextTicketSkip = useAppSelector(selectNextInSkipQueue);
  const [showBadge, setShowBadge] = useState(false);

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

  // Filtering data berdasarkan tab yang aktif di Redux State
  // const filteredAntrean = daftarAntrean.filter(
  //   (item) => item.statusAntrean === activeTab,
  // );
  const filteredAntrean = activeTab == 'Menunggu' ? daftarAntrean : daftarTerlewati;

  const handleCallNext = async (counterId: number) => {
    try {
      const result = await dispatch(callNextQueue(counterId)).unwrap();
      
      // Panggil notifikasi global!
      dispatch(showNotification({
        title: 'Berhasil Dipanggil',
        message: `Nomor antrean berhasil dipanggil .`,
        type: 'success'
      }));

      triggerBadge();
      
    } catch (error: any) {
      // Panggil notifikasi error global!
      dispatch(showNotification({
        title: 'Gagal Memanggil',
        message: typeof error === 'string' ? error : 'Terjadi kesalahan sistem.',
        type: 'error'
      }));
    }
  };

  const handleCallSkipNext = async (counterId: number) => {
    try {
      const result = await dispatch(callNextSkipQueue(counterId)).unwrap();
      
      // Panggil notifikasi global!
      dispatch(showNotification({
        title: 'Berhasil Dipanggil',
        message: `Nomor antrean terlewati berhasil dipanggil .`,
        type: 'success'
      }));
      
    } catch (error: any) {
      // Panggil notifikasi error global!
      dispatch(showNotification({
        title: 'Gagal Memanggil',
        message: typeof error === 'string' ? error : 'Terjadi kesalahan sistem.',
        type: 'error'
      }));
    }
  };

  const normalizeQueueActionPayload = (
    payload?: { counterId: number; ticketsId?: string } | string
  ): { counterId: number; ticketsId?: string } => {
    if (typeof payload === "string") {
      return { counterId: 1, ticketsId: payload };
    }

    return payload ?? { counterId: 1, ticketsId: undefined };
  };

  const handleRecall = async (
    payload?: { counterId: number; ticketsId?: string } | string
  ) => {
    const { counterId, ticketsId } = normalizeQueueActionPayload(payload);

    if (!ticketsId) {
      dispatch(showNotification({
        title: 'Gagal Memanggil Ulang',
        message: 'ID antrean tidak tersedia.',
        type: 'error'
      }));
      return;
    }

    try {
      const action = await dispatch(recallQueue({ counterId, ticketsId }));

      // Panggil notifikasi global!
      dispatch(showNotification({
        title: 'Berhasil Memanggil Ulang',
        message: `Nomor antrean berhasil dipanggil ulang.`,
        type: 'success'
      }));

      triggerBadge();

    } catch (error: any) {
      // Panggil notifikasi error global!
      dispatch(showNotification({
        title: 'Gagal Memanggil Ulang',
        message: typeof error === 'string' ? error : 'Terjadi kesalahan sistem.',
        type: 'error'
      }));
    }
  };

  const handleServing = async (
    payload?: { counterId: number; ticketsId?: string } | string
  ) => {
    const { counterId, ticketsId } = normalizeQueueActionPayload(payload);

    if (!ticketsId) {
      dispatch(showNotification({
        title: 'Gagal Memanggil Ulang',
        message: 'ID antrean tidak tersedia.',
        type: 'error'
      }));
      return;
    }

    try {
      const action = await dispatch(startServingQueue({ counterId, ticketsId }));

      // Panggil notifikasi global!
      dispatch(showNotification({
        title: 'Berhasil Memanggil Ulang',
        message: `Nomor antrean berhasil dipanggil ulang.`,
        type: 'success'
      }));

    } catch (error: any) {
      // Panggil notifikasi error global!
      dispatch(showNotification({
        title: 'Gagal Memanggil Ulang',
        message: typeof error === 'string' ? error : 'Terjadi kesalahan sistem.',
        type: 'error'
      }));
    }
  }

  const handleSkip = async (
    payload?: { counterId: number; ticketsId?: string } | string
  ) => {
    const { counterId, ticketsId } = normalizeQueueActionPayload(payload);

    if (!ticketsId) {
      dispatch(showNotification({
        title: 'Gagal Memanggil Ulang',
        message: 'ID antrean tidak tersedia.',
        type: 'error'
      }));
      return;
    }

    try {
      const action = await dispatch(SkipQueue({ counterId, ticketsId }));
      // Panggil notifikasi global!
      dispatch(showNotification({
        title: 'Merubah Status Terlewati',
        message: `Nomor antrean berhasil diubah menjadi terlewati.`,
        type: 'success'
      }));

    } catch (error: any) {
      // Panggil notifikasi error global!
      dispatch(showNotification({
        title: 'Gagal Memanggil Ulang',
        message: typeof error === 'string' ? error : 'Terjadi kesalahan sistem.',
        type: 'error'
      }));
    }
  }


  return (
    <div className="w-full h-full flex flex-col p-5 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 tracking-wide">
          <Settings2 size={16} />
          KONTROLER PEMANGGIL ANTREAN
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <Settings2 size={16} />
        </button>
      </div>

      {/* Active Queue Card */}
      <div className="bg-[#0b2756] rounded-xl p-4 text-white mb-3 shadow-md relative overflow-hidden flex-shrink-0">
        <p className="text-xs font-medium text-gray-200 mb-2">NOMOR SAAT INI</p>
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
        <button
          onClick={() => { activeTab == 'Menunggu' ? handleCallNext(nextTicket?.isPasienBaru ? 1 : 2) : handleCallSkipNext(nextTicket?.isPasienBaru ? 1 : 2) } }
          className="w-full bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg py-2.5 flex items-center justify-center gap-2 text-sm font-semibold transition-colors cursor-pointer"
        >
          <Volume2 size={18} /> PANGGIL BERIKUTNYA
        </button>
        <button
          onClick={() =>
            handleRecall({
              counterId: antreanSaatIni?.isPasienBaru ? 1 : 2,
              ticketsId: antreanSaatIni?.id,
            })
          }
          className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg py-2.5 flex items-center justify-center gap-2 text-sm font-semibold transition-colors cursor-pointer"
        >
          <RefreshCw size={16} /> PANGGIL ULANG
        </button>

        <div className="grid grid-cols-2 gap-2 mt-1">
          <button
            onClick={() => handleServing({
              counterId: antreanSaatIni?.isPasienBaru ? 1 : 2,
              ticketsId: antreanSaatIni?.id,
            })
          }
            className="bg-green-50 hover:bg-green-100 border border-green-200 text-green-600 rounded-lg py-2 flex items-center justify-center gap-2 text-sm font-semibold transition-colors cursor-pointer"
          >
            <Check size={16} /> HADIR
          </button>
          <button
            onClick={() => handleSkip({
              counterId: antreanSaatIni?.isPasienBaru ? 1 : 2,
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

      {/* Tabs (Perbaikan dispatch & active class) */}
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
            Tidak ada antrean {activeTab.toLowerCase()}
          </p>
        ) : (
          filteredAntrean.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg border-b border-gray-50 last:border-0"
            >
              <div className="flex items-center gap-3">
                <Ticket size={18} className="text-gray-400" />
                <div>
                  <p className="text-sm font-bold text-gray-800">
                    {item.nomorAntrean}
                  </p>
                  <p className="text-[10px] text-gray-500 flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-gray-400"></span>{" "}
                    {item.statusAntrean}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-gray-500">
                  Diambil {item.waktuAmbil}
                </p>
                <p
                  className={`text-[11px] font-medium ${item.waitTimeColor || "text-green-500"}`}
                >
                  {item.estimasiTunggu ?? "-"}
                </p>
              </div>
            </div>
          ))
        )}

        {filteredAntrean.length > 0 && (
          <button className="w-full mt-2 text-xs text-cyan-600 font-semibold flex items-center justify-center gap-1 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <ChevronRight size={14} /> LIHAT SEMUA
          </button>
        )}
      </div>

      {/* Next Up Section */}
      { activeTab == 'Menunggu' ?
        <div className="mt-auto flex-shrink-0 pt-2 border-t border-slate-100">
        <p className="text-xs font-semibold text-cyan-800 mb-2">
          BERIKUTNYA{" "}
          {antreanSaatIni ? `(SETELAH ${antreanSaatIni.nomorAntrean})` : ""}
        </p>
        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
          <div>
            <p className="text-base font-bold text-gray-800">
              {nextTicket?.nomorAntrean ?? "-"}
            </p>
            <p className="text-[10px] text-gray-500 flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-cyan-500"></span>{" "}
              {nextTicket?.statusAntrean ?? "Tidak ada antrean"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[11px] text-gray-500">
              Diambil {nextTicket?.waktuAmbil ?? "-"}
            </p>
            <p
              className={`text-[11px] font-medium ${nextTicket?.waitTimeColor || "text-green-500"}`}
            >
              {nextTicket?.estimasiTunggu ?? "-"}
            </p>
          </div>
        </div>
      </div>

      :

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
      }
      
    </div>
  );
}
function async(arg0: { counterId: any; ticketsId: any; }) {
  throw new Error("Function not implemented.");
}

