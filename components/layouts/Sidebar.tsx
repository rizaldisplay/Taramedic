/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/features/auth/authSlice";
import { AppDispatch } from "@/store";

import {
  ClipboardList,
  Activity,
  FileText,
  Calculator,
  LayoutDashboard,
  Pill,
  Settings,
  LogOut,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  UsersRound,
  Stethoscope,
  Tablets,
  User,
  UserRoundPlus,
  ShieldCheck,
  MapPin,
  Ticket,
  Search,
  CheckCircle2,
  PackageCheck,
  ClipboardCheck,
  ShoppingCart,
  Box,
  FileChartColumn,
  Hospital,
  Building,
  Scan,
  FlaskConical,
  Microscope,
} from "lucide-react";

interface SubNavItem {
  label: string;
  href: string;
}

interface NavGroupItem {
  id: string;
  icon: React.ElementType;
  label: string;
  href?: string;
  subItems?: SubNavItem[];
}

interface NavSection {
  sectionTitle?: string;
  items: NavGroupItem[];
}

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

// Structuring Menu Data for Clean Maintenance
const MENU_SECTIONS: NavSection[] = [
  {
    sectionTitle: "Pelayanan Pasien",
    items: [
      { id: "dashboard", icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
      {
        id: "administrasi",
        icon: ClipboardList,
        label: "Administrasi",
        subItems: [
          { label: "Pendaftaran Rajal", href: "/pendaftaran-rajal" },
          { label: "Penjadwalan Kunjungan", href: "/penjadwalan-kunjungan" },
          { label: "Rujukan Pasien", href: "/rujukan-pasien" },
        ],
      },
      {
        id: "antrean",
        icon: Ticket,
        label: "Antrean Publik",
        subItems: [
          { label: "Layar Antrean", href: "/layar-antrean" },
          { label: "Mesin Antrean", href: "/kiosq-pendaftaran" },
        ],
      },
      {
        id: "pelayanan-klinis",
        icon: Activity,
        label: "Pelayanan Klinis",
        subItems: [
          { label: "Poli Rawat Jalan", href: "/poli-rawat-jalan" },
          { label: "Pemeriksaan Perawat", href: "/pemeriksaan-perawat" },
          { label: "Pemeriksaan Dokter", href: "/pemeriksaan-dokter" },
        ],
      },
      { id: "farmasi-layanan", icon: Pill, label: "Farmasi", href: "/farmasi" },
      { id: "laboratorium-layanan", icon: FlaskConical, label: "Laboratorium", href: "/laboratorium" },
      { id: "radiologi-layanan", icon: Microscope, label: "Radiologi", href: "/radiologi" },
      { id: "kasir-layanan", icon: Calculator, label: "Kasir", href: "/kasir" },
    ],
  },
  {
    sectionTitle: "Manajemen Persetujuan",
    items: [
      {
        id: "otorasi",
        icon: ClipboardCheck,
        label: "Pusat Persetujuan",
        subItems: [
          { label: "Kotak Persetujuan", href: "/kotak-persetujuan" },
          { label: "Alur Persetujuan", href: "/alur-persetujuan" },
        ],
      },
    ],
  },
  {
    sectionTitle: "Logistik & Pengadaan",
    items: [
      {
        id: "logistik-pembelian-pengadaan",
        icon: ShoppingCart,
        label: "Pembelian & Pengadaan",
        subItems: [
          { label: "Pemasok & Mapping", href: "/pemasok-mapping" },
          { label: "Permintaan Pengadaan (PR)", href: "/permintaan-pengadaan" },
          { label: "Pesanan Pembelian (PO)", href: "/pesanan-pembelian" },
          { label: "Penerimaan", href: "/penerimaan" },
          { label: "Retur Pemasok", href: "/retur-pemasok" },
          { label: "Faktur Pemasok", href: "/faktur-pemasok" },
          { label: "Pembayaran", href: "/pembayaran" },
          { label: "Umur Utang Pemasok", href: "/umur-utang-pemasok" },
        ],
      },
      {
        id: "logistik-persediaan",
        icon: Box,
        label: "Persediaan",
        subItems: [
          { label: "Dashboard", href: "/persediaan-dashboard" },
          { label: "Obat", href: "/persediaan-obat" },
          { label: "Alkes & BMHP", href: "/persediaan-alkes-bmhp" },
          { label: "Alat Reuseable", href: "/persediaan-alat-reuseable" },
          { label: "Saldo & Batch", href: "/persediaan-saldo-batch" },
          { label: "Transaksi Stok", href: "/persediaan-transaksi-stok" },
          { label: "Persetujuan Opname", href: "/persediaan-persetujuan-opname" },
          { label: "Gudang", href: "/persediaan-gudang" },
        ],
      },
    ],
  },
  {
    sectionTitle: "Manajemen Klinik",
    items: [
      { id: "laporan", icon: FileChartColumn, label: "Laporan", href: "/laporan" },
      { id: "informasi-klinik", icon: Building, label: "Informasi Klinik", href: "/informasi-klinik" },
      {
        id: "organisasi",
        icon: Hospital,
        label: "Organisasi",
        subItems: [
          { label: "Unit & poli", href: "/organisasi-unit-poli" },
          { label: "Lokasi Pelayanan", href: "/organisasi-lokasi-pelayanan" },
          { label: "Loket Pelayanan", href: "/organisasi-loket-pelayanan" },
        ],
      },
      {
        id: "sdmk",
        icon: User,
        label: "SDMK",
        subItems: [
          { label: "Data SDMK", href: "/sdmk" },
          { label: "Divisi & Jabatan", href: "/divisi-jabatan" },
        ],
      },
    ],
  },
  {
    sectionTitle: "Data Master & Referensi",
    items: [
      { id: "master-data-pasien", icon: UserRoundPlus, label: "Master Data Pasien", href: "/master-data-pasien" },
      { id: "master-radiologi", icon: Scan, label: "Master Data Radiologi", href: "/master-data-radiologi" },
      {
        id: "master-klinis",
        icon: UsersRound,
        label: "Master Klinis",
        subItems: [
          { label: "Diagnosis", href: "/master-data-klinis-diagnosis" },
          { label: "Referensi Klinis", href: "/master-data-klinis-referensi" },
        ],
      },
      { id: "master-laboratorium", icon: FlaskConical, label: "Master Laboratorium", href: "/master-laboratorium" },
      {
        id: "master-data-farmasi",
        icon: Tablets,
        label: "Master Data Farmasi",
        subItems: [
          { label: "Produk Obat / KFA", href: "/masterdata/farmasi/produk-obat-kfa" },
          { label: "Tarif Obat", href: "/masterdata/farmasi/tarif-obat" },
          { label: "Formularium & Restriksi", href: "/masterdata/formularium" },
          { label: "Racikan", href: "/masterdata/racikan" },
          { label: "Signa, Rute & Satuan", href: "/masterdata/signa-rute-satuan" },
          { label: "Obat Khusus", href: "/masterdata/obat-khusus" },
        ],
      },
      // { id: "master-sdmk", icon: User, label: "Master SDMK", href: "/masterdata/sdmk" },
    ],
  },
  {
    sectionTitle: "Pengaturan Sistem",
    items: [
      { id: "pengguna", icon: ShieldCheck, label: "Pengguna & Hak Akses", href: "/pengguna-hak-akses" },
      {
        id: "settings",
        icon: Settings,
        label: "Pengaturan",
        subItems: [
          { label: "Printer & Thermal", href: "/settings/printer-thermal" },
          { label: "Metode Pembayaran", href: "/settings/metode-pembayaran" },
          { label: "Manajemen Perangkat Publik", href: "/settings/manajemen-perangkat-publik" },
        ],
      },
    ],
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = false, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const pathname = usePathname();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openAccordionId, setOpenAccordionId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Otomatis membuka menu aktif berdasarkan URL
  useEffect(() => {
    MENU_SECTIONS.forEach((section) => {
      section.items.forEach((item) => {
        if (item.subItems) {
          const isChildActive = item.subItems.some(
            (sub) => pathname === sub.href || pathname.startsWith(`${sub.href}/`)
          );
          if (isChildActive) {
            setOpenAccordionId(item.id);
          }
        }
      });
    });
  }, [pathname]);

  // Handle Logout
  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      router.push("/login");
    } catch (error) {
      console.error("Gagal melakukan logout:", error);
      router.push("/login");
    }
  };

  const toggleAccordion = (id: string) => {
    if (isCollapsed) {
      setIsCollapsed(false);
      setOpenAccordionId(id);
    } else {
      setOpenAccordionId((prev) => (prev === id ? null : id));
    }
  };

  // Filter menu berdasarkan kata kunci pencarian
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return MENU_SECTIONS;

    const query = searchQuery.toLowerCase();
    return MENU_SECTIONS.map((section) => {
      const filteredItems = section.items.filter((item) => {
        const matchParent = item.label.toLowerCase().includes(query);
        const matchChild = item.subItems?.some((sub) =>
          sub.label.toLowerCase().includes(query)
        );
        return matchParent || matchChild;
      });

      return { ...section, items: filteredItems };
    }).filter((section) => section.items.length > 0);
  }, [searchQuery]);

  return (
    <>
      {/* Backdrop Mobile */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        />
      )}

      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800
          flex flex-col justify-between flex-shrink-0 h-screen select-none
          transform transition-all duration-300 ease-in-out
          ${isOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0"}
          ${isCollapsed ? "lg:w-20" : "lg:w-64"}
        `}
      >
        {/* Toggle Expand/Collapse Button (Desktop) */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex absolute -right-3.5 top-7 w-7 h-7 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full items-center justify-center z-50 text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:border-cyan-300 dark:hover:border-cyan-500 shadow-sm transition-all"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        {/* Top Header Logo */}
        <div className={`h-16 flex items-center border-b border-slate-100 dark:border-slate-800 shrink-0 ${isCollapsed ? "justify-center px-0" : "justify-between px-5"}`}>
          <Link href="/dashboard" className="flex items-center">
            <img
              src={
                isCollapsed
                  ? "/logo/05%20Taramedic%20Logo%20-%20Biru%20Full%20Main%20Center.png"
                  : "/logo/06%20Taramedic%20Logo%20-%20Biru%20Full%20Horizontal.png"
              }
              alt="Logo Taramedic"
              className="h-9 w-auto object-contain transition-all dark:hidden"
            />
            <img
              src={
                isCollapsed
                  ? "/logo/03%20Taramedic%20Logo%20-%20Full%20Putih%20Main%20Center.png"
                  : "/logo/04%20Taramedic%20Logo%20-%20Full%20Putih%20Horizontal.png"
              }
              alt="Logo Taramedic"
              className="h-9 w-auto object-contain transition-all hidden dark:block"
            />
          </Link>
          <button
            onClick={onClose}
            className={`lg:hidden text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 p-1 ${isCollapsed ? "hidden" : ""}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Search Input */}
        {!isCollapsed && (
          <div className="px-4 pt-3 pb-1">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari menu..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:bg-white dark:focus:bg-slate-800 text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 text-xs"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        )}

        {/* Scrollable Navigation Menu */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-4 custom-scrollbar">
          {filteredSections.length === 0 ? (
            <div className="text-center py-6 text-xs text-slate-400 dark:text-slate-500">
              Menu tidak ditemukan
            </div>
          ) : (
            filteredSections.map((section, idx) => (
              <div key={idx} className="space-y-1">
                {/* Section Title */}
                {section.sectionTitle && !isCollapsed && (
                  <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 mb-1.5">
                    {section.sectionTitle}
                  </div>
                )}
                {isCollapsed && idx > 0 && <div className="border-t border-slate-100 dark:border-slate-800 my-2 mx-2" />}

                {/* Section Items */}
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const hasSub = item.subItems && item.subItems.length > 0;
                  const isParentActive = item.href ? pathname === item.href : false;
                  const isChildActive = hasSub
                    ? item.subItems?.some(
                        (sub) => pathname === sub.href || pathname.startsWith(`${sub.href}/`)
                      )
                    : false;
                  const isActive = isParentActive || isChildActive;
                  const isOpen = openAccordionId === item.id || searchQuery.length > 0;

                  return (
                    <div key={item.id} className="flex flex-col">
                      {/* Parent Item */}
                      {!hasSub && item.href ? (
                        <Link href={item.href} onClick={onClose}>
                          <div
                            title={isCollapsed ? item.label : undefined}
                            className={`flex items-center px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                              isActive
                                ? "bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-400 font-semibold"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-slate-200"
                            } ${isCollapsed ? "justify-center px-0" : ""}`}
                          >
                            <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-cyan-600 dark:text-cyan-400" : "text-slate-400 dark:text-slate-500"} ${!isCollapsed ? "mr-3" : ""}`} />
                            {!isCollapsed && <span className="text-xs leading-tight flex-1">{item.label}</span>}
                          </div>
                        </Link>
                      ) : (
                        <div
                          onClick={() => toggleAccordion(item.id)}
                          title={isCollapsed ? item.label : undefined}
                          className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                            isActive
                              ? "bg-cyan-50/80 dark:bg-cyan-950/50 text-cyan-700 dark:text-cyan-400 font-semibold"
                              : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-slate-200"
                          } ${isCollapsed ? "justify-center px-0" : ""}`}
                        >
                          <div className={`flex items-center ${isCollapsed ? "justify-center w-full" : ""}`}>
                            <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-cyan-600 dark:text-cyan-400" : "text-slate-400 dark:text-slate-500"} ${!isCollapsed ? "mr-3" : ""}`} />
                            {!isCollapsed && <span className="text-xs leading-tight">{item.label}</span>}
                          </div>
                          {hasSub && !isCollapsed && (
                            <ChevronDown
                              className={`w-3.5 h-3.5 text-slate-400 dark:text-slate-500 transition-transform duration-200 shrink-0 ${
                                isOpen ? "rotate-180 text-cyan-600 dark:text-cyan-400" : ""
                              }`}
                            />
                          )}
                        </div>
                      )}

                      {/* Sub Items Accordion */}
                      {hasSub && !isCollapsed && isOpen && (
                        <div className="ml-4 pl-3 border-l border-slate-200/80 dark:border-slate-800 my-1 space-y-1">
                          {item.subItems?.map((sub, subIdx) => {
                            const isSubActive = pathname === sub.href || pathname.startsWith(`${sub.href}/`);
                            return (
                              <Link key={subIdx} href={sub.href} onClick={onClose}>
                                <div
                                  className={`px-3 py-1.5 rounded-md text-xs transition-colors cursor-pointer block ${
                                    isSubActive
                                      ? "bg-cyan-50 dark:bg-cyan-950/60 font-semibold text-cyan-700 dark:text-cyan-400"
                                      : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/70 hover:text-slate-800 dark:hover:text-slate-200"
                                  }`}
                                >
                                  {sub.label}
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Bottom User / Logout Section */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 shrink-0 bg-white dark:bg-slate-900">
          <button
            onClick={handleLogout}
            title={isCollapsed ? "Logout" : undefined}
            className={`w-full flex items-center px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400 transition-colors group ${
              isCollapsed ? "justify-center px-0" : ""
            }`}
          >
            <LogOut className={`w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-red-500 transition-colors shrink-0 ${!isCollapsed ? "mr-3" : ""}`} />
            {!isCollapsed && <span className="text-xs font-medium">Keluar / Logout</span>}
          </button>

          {!isCollapsed && (
            <div className="mt-2 px-3 text-[10px] text-slate-400 dark:text-slate-500 flex justify-between items-center">
              <span>© 2026 Taramedic</span>
              <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded font-mono">v1.0.0</span>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};