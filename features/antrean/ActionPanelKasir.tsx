'use client';

import React from 'react';
import { Volume2, Check, X, Lock, User, CheckCircle, AlertTriangle } from 'lucide-react';

const LastCallItem = ({ no, name, time, status }: { no: string, name: string, time: string, status: string }) => {
    const isSelesai = status === 'Selesai';

    return (
        <div className="flex items-center justify-between text-sm py-1.5">
            <div className="flex items-center gap-3">
                <span className="font-bold text-slate-900 w-8">{no}</span>
                <span className="text-slate-600 truncate w-24">{name}</span>
            </div>
            <div className="flex items-center gap-4">
                <span className="text-xs text-slate-500">{time}</span>
                <span className={`text-xs font-medium flex items-center w-[72px] justify-start ${isSelesai ? 'text-emerald-600' : 'text-amber-500'}`}>
                    {isSelesai ? <CheckCircle className="w-3.5 h-3.5 mr-1.5" /> : <AlertTriangle className="w-3.5 h-3.5 mr-1.5" />}
                    {status}
                </span>
            </div>
        </div>
    );
};

export const ActionPanel = () => {
    return (
        <div className="w-[340px] flex-shrink-0 space-y-4">
            {/* Active Call Card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden relative">
                <div className="h-1 bg-cyan-500 w-full absolute top-0 left-0"></div>
                <div className="p-5 pt-6">
                    <div className="text-[11px] font-bold text-cyan-600 uppercase tracking-wider mb-2">SEDANG DIPANGGIL</div>
                    <div className="flex justify-between items-start mb-5">
                        <div>
                            <h3 className="text-4xl font-bold text-cyan-600 mb-1">A013</h3>
                            <h4 className="text-[17px] font-bold text-slate-900 flex items-center gap-1 mb-1">
                                Rizka Amalia <span className="text-pink-500 font-normal text-xl leading-none">♀</span>
                            </h4>
                            <div className="text-[13px] text-slate-500 space-y-0.5">
                                <p>RM-000036 • Perempuan, 8 thn</p>
                                <p>BPJS Kesehatan • Poli Anak</p>
                            </div>
                        </div>
                        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center border-2 border-slate-100 shadow-sm overflow-hidden flex-shrink-0">
                            <User className="w-6 h-6 text-slate-300" />
                        </div>
                    </div>

                    {/* Billing Info Block */}
                    <div className="border border-slate-100 rounded-lg p-4 mb-5 space-y-2.5 relative">
                        <div className="absolute top-2 right-2 bg-emerald-50 text-emerald-700 font-medium text-[10px] px-2 py-0.5 rounded-full">Siap Dibayar</div>
                        <div className="text-sm font-semibold text-cyan-700">BILLING #BL-20260816-013</div>
                        <div className="text-[13px] text-slate-600 space-y-1">
                            <div className="flex justify-between">
                                <span>Total Billing</span>
                                <span className="font-semibold text-slate-900">Rp 250.000</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Ditanggung BPJS</span>
                                <span className="font-semibold text-slate-900">Rp 250.000</span>
                            </div>
                            <div className="flex justify-between border-t border-slate-100 pt-1 mt-1">
                                <span>Tanggungan Pasien</span>
                                <span className="font-bold text-lg text-slate-950">Rp 0</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-cyan-50 rounded-lg p-2.5 border border-cyan-100 mb-5 flex justify-center items-center">
                        <div className="flex items-center text-cyan-700 font-medium text-sm">
                            <Volume2 className="w-4 h-4 mr-2" /> Panggilan ke-1
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex gap-3">
                            <button className="flex-1 flex items-center justify-center py-2.5 border border-emerald-500 text-emerald-600 rounded-lg text-sm font-semibold hover:bg-emerald-50 transition-colors">
                                <Check className="w-4 h-4 mr-2" /> Hadir
                            </button>
                            <button className="flex-1 flex items-center justify-center py-2.5 border border-red-200 text-red-500 rounded-lg text-sm font-semibold hover:bg-red-50 transition-colors">
                                <X className="w-4 h-4 mr-2" /> Lewati
                            </button>
                        </div>
                        <button className="w-full flex flex-col items-center justify-center py-2.5 bg-slate-50 border border-slate-100 text-slate-400 rounded-lg cursor-not-allowed mt-2">
                            <div className="flex items-center text-sm font-semibold mb-0.5">
                                <Lock className="w-4 h-4 mr-2" /> Mulai Proses Pembayaran
                            </div>
                            <div className="text-[10px] text-slate-400">Tandai hadir terlebih dahulu untuk memulai proses</div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Next Patient Card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex justify-between items-center">
                <div>
                    <div className="text-[11px] font-bold text-emerald-500 uppercase tracking-wider mb-1">BERIKUTNYA</div>
                    <div className="flex items-center gap-3">
                        <div className="text-xl font-bold text-amber-500">A014</div>
                        <div className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                            Fathan Alfarizi
                            <span className="text-cyan-500 font-normal text-base">♂</span>
                        </div>
                    </div>
                </div>
                <div className="text-xs text-slate-500">2 item obat • Menunggu</div>
            </div>

            {/* Last Called List */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">PANGGILAN TERAKHIR</div>
                <div className="space-y-1">
                    <LastCallItem no="A011" name="Andi Saputra" time="08:30 WIB" status="Selesai" />
                    <LastCallItem no="A012" name="Dewi Lestari" time="08:38 WIB" status="Selesai" />
                    <LastCallItem no="A010" name="Budi Santoso" time="08:25 WIB" status="Dilewati" />
                </div>
            </div>
        </div>
    );
};