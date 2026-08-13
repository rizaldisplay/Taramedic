import { useState } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, ChevronRight, MoreVertical, Edit2,
  History, AlertCircle, FileText, FolderOpen,
  CheckCircle2, Circle, Clock, Mic, Search, Filter,
  Plus, X, Trash2, Pill, Save, Camera,
  Thermometer, Heart, Wind, Droplets, Scale, Activity,
  ChevronDown, ChevronUp, Share2, ClipboardList,
} from 'lucide-react';
import BottomNav from '@/components/layouts/MobileBottomNav';

// ─── types ────────────────────────────────────────────────────────────────────
type MainView = 'overview' | 'exam';
type ExamTab = 'pemeriksaan' | 'diagnosis' | 'tindakan' | 'resep' | 'lainnya';

// ─── static data ──────────────────────────────────────────────────────────────
const patient = {
  nama: 'Budi Santoso',
  rm: 'RM2505200001',
  info: 'Laki-laki, 45 Tahun (20/05/1980)',
  pembayaran: 'BPJS Kesehatan',
};

const kunjunganSekarang = {
  noAntrean: 'PU-012',
  tanggal: '20 Mei 2025, 09:15',
  poli: 'Poli Umum',
  dokter: 'dr. Andi Wijaya',
  status: 'Pemeriksaan',
};

const ringkasanSteps = [
  { label: 'Registrasi',         time: '20 Mei 2025, 08:45', done: true,  active: false },
  { label: 'Pemeriksaan Awal',   time: '20 Mei 2025, 08:50', done: true,  active: false },
  { label: 'Pemeriksaan Dokter', time: 'Sedang berlangsung',  done: false, active: true  },
  { label: 'Farmasi',            time: '—',                  done: false, active: false },
  { label: 'Kasir',              time: '—',                  done: false, active: false },
  { label: 'Selesai',            time: '—',                  done: false, active: false },
];

const riwayatSebelumnya = [
  { tanggal: '15 Mei 2025', poli: 'Poli Umum', dokter: 'dr. Andi Wijaya' },
  { tanggal: '02 Mei 2025', poli: 'Poli Umum', dokter: 'dr. Andi Wijaya' },
];

const vitalSigns = [
  { icon: Heart,       color: '#2563EB', bg: '#EFF6FF', label: 'Tekanan Darah', value: '120/80', unit: 'mmHg' },
  { icon: Activity,    color: '#DC2626', bg: '#FEF2F2', label: 'Nadi',           value: '82',      unit: 'x/menit' },
  { icon: Wind,        color: '#0EA5E9', bg: '#F0F9FF', label: 'Respirasi',      value: '20',      unit: 'x/menit' },
  { icon: Thermometer, color: '#D97706', bg: '#FFFBEB', label: 'Suhu',           value: '36.7',    unit: '°C' },
  { icon: Droplets,    color: '#0EA5E9', bg: '#F0F9FF', label: 'SpO2',           value: '98',      unit: '%' },
  { icon: Scale,       color: '#059669', bg: '#F0FDF4', label: 'Berat Badan',    value: '65',      unit: 'kg' },
];

const diagnosisData = {
  primer:   [{ kode: 'J20.9', nama: 'Acute bronchitis, unspecified' }],
  sekunder: [{ kode: 'Z00.8', nama: 'Other general medical examination' }],
  komorbid:    [] as { kode: string; nama: string }[],
  komplikasi:  [] as { kode: string; nama: string }[],
};

const tindakanAll = [
  { kode: '89.52', nama: 'Konsultasi' },
  { kode: '93.94', nama: 'Pemeriksaan Fisik Lengkap' },
  { kode: '96.03', nama: 'Nebulizer' },
  { kode: '94.09', nama: 'Terapi Cairan Intravena' },
  { kode: '86.22', nama: 'EKG' },
  { kode: '86.23', nama: 'Tindakan Minor (Jalur Lokal)' },
];

// ─── animation ────────────────────────────────────────────────────────────────
const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };
const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };

// ─── reusable components ──────────────────────────────────────────────────────
function TextArea({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-foreground">{label}</label>
      <div className="relative">
        <textarea
          rows={3}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder ?? 'Ketik di sini...'}
          className="w-full px-3.5 py-3 pr-9 border border-border rounded-xl bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none"
        />
        <button className="absolute right-3 top-3 text-muted-foreground hover:text-primary">
          <Mic className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function SaveBtn({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="w-full py-3.5 bg-primary text-white font-semibold rounded-full text-sm flex items-center justify-center gap-2 shadow-md shadow-primary/25"
    >
      <Save className="w-4 h-4" />
      {label}
    </motion.button>
  );
}

// ─── TAB: Pemeriksaan ─────────────────────────────────────────────────────────
function TabPemeriksaan() {
  const [keluhanUtama, setKeluhanUtama]   = useState('Batuk disertai demam sejak 2 hari yang lalu.');
  const [rpsNow,       setRpsNow]         = useState('Pasien mengalami batuk berdahak, disertai demam sejak 2 hari yang lalu. Tidal ada sesak napas. Nafsu makan menurun.');
  const [rpsDahulu,    setRpsDahulu]      = useState('Tidak ada riwayat penyakit kronis.');
  const [alergi,       setAlergi]         = useState('Tidak ada alergi obat maupun makanan.');
  const [objektif,     setObjektif]       = useState('Keadaan umum compos mentis, TD 120/80 mmHg, nadi 82x/menit, suhu 36.7°C, RR 20x/menit, SpO2 98%.');

  return (
    <div className="flex flex-col gap-5 px-4 py-4">
      {/* Tanda Vital */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-foreground">Tanda Vital</h3>
          <span className="text-[10px] text-muted-foreground">Input Terakhir: 20 Mei 2025, 09:10</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {vitalSigns.map(({ icon: Icon, color, bg, label, value, unit }) => (
            <div key={label} className="bg-white rounded-xl border border-border/50 shadow-sm px-3 py-2.5 flex flex-col gap-0.5">
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: bg }}>
                  <Icon className="w-3.5 h-3.5" style={{ color }} />
                </div>
                <span className="text-xs font-bold text-foreground">{value}</span>
              </div>
              <span className="text-[9px] text-muted-foreground">{unit}</span>
              <span className="text-[9px] font-medium text-foreground leading-tight">{label}</span>
            </div>
          ))}
        </div>
        <button className="mt-2 text-xs text-primary font-medium flex items-center gap-0.5">
          Lihat Semua <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <TextArea label="Keluhan Utama" value={keluhanUtama} onChange={setKeluhanUtama}
        placeholder="Keluhan utama pasien..." />

      {/* Anamnesis */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-bold text-foreground">Anamnesis</h3>
        <TextArea label="Riwayat Penyakit Sekarang" value={rpsNow} onChange={setRpsNow} />
        <TextArea label="Riwayat Penyakit Dahulu" value={rpsDahulu} onChange={setRpsDahulu} />
        <TextArea label="Alergi" value={alergi} onChange={setAlergi} />
      </div>

      <TextArea label="Pemeriksaan Fisik (Objektif)" value={objektif} onChange={setObjektif} />

      <SaveBtn label="Simpan Pemeriksaan" />
    </div>
  );
}

// ─── TAB: Diagnosis ───────────────────────────────────────────────────────────
type DiagFilter = 'Primer' | 'Sekunder' | 'Komorbid' | 'Komplikasi';

function TabDiagnosis() {
  const [filter, setFilter]         = useState<DiagFilter>('Primer');
  const [catatan, setCatatan]       = useState('Pasien dengan batuk akut tanpa komplikasi berat.');
  const [search, setSearch]         = useState('');
  const [diagnoses, setDiagnoses]   = useState(diagnosisData);

  const filters: DiagFilter[] = ['Primer', 'Sekunder', 'Komorbid', 'Komplikasi'];
  const filterKey: Record<DiagFilter, keyof typeof diagnosisData> = {
    Primer: 'primer', Sekunder: 'sekunder', Komorbid: 'komorbid', Komplikasi: 'komplikasi',
  };

  const removeItem = (key: keyof typeof diagnosisData, idx: number) => {
    setDiagnoses(prev => ({ ...prev, [key]: prev[key].filter((_, i) => i !== idx) }));
  };

  return (
    <div className="flex flex-col gap-4 px-4 py-4">
      {/* Search */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Cari kode / nama diagnosis"
            className="w-full pl-9 pr-4 py-2.5 border border-border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>
        <button className="w-10 h-10 rounded-xl border border-border bg-white flex items-center justify-center text-muted-foreground">
          <Filter className="w-4 h-4" />
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1.5">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filter === f ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Diagnosis list per category */}
      {(['primer','sekunder','komorbid','komplikasi'] as (keyof typeof diagnosisData)[]).map(key => {
        const label = key.charAt(0).toUpperCase() + key.slice(1);
        const items = diagnoses[key];
        return (
          <div key={key} className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-foreground">Diagnosis {label}</h3>
            </div>
            {items.length === 0 ? (
              <div className="flex items-center justify-between py-2.5 px-3.5 border border-dashed border-border rounded-xl bg-muted/30">
                <span className="text-xs text-muted-foreground">Tidak ada {label.toLowerCase()}</span>
                <button className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <Plus className="w-3.5 h-3.5 text-primary" />
                </button>
              </div>
            ) : (
              items.map((d, i) => (
                <div key={i} className="flex items-center gap-2 bg-white border border-border/50 rounded-xl px-3.5 py-2.5">
                  <div className="flex-1">
                    <p className="text-xs font-bold text-foreground">{d.kode}</p>
                    <p className="text-[11px] text-muted-foreground">{d.nama}</p>
                  </div>
                  {key === 'primer' && <Edit2 className="w-3.5 h-3.5 text-primary mr-1" />}
                  <button onClick={() => removeItem(key, i)}>
                    <X className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                  </button>
                </div>
              ))
            )}
          </div>
        );
      })}

      <TextArea label="Catatan Diagnosis" value={catatan} onChange={setCatatan} />
      <SaveBtn label="Simpan Diagnosis" />
    </div>
  );
}

// ─── TAB: Tindakan ────────────────────────────────────────────────────────────
function TabTindakan() {
  const [search, setSearch]         = useState('');
  const [selected, setSelected]     = useState<string[]>(['89.52']);
  const [catatan, setCatatan]       = useState('Konsultasi dan evaluasi keluhan pasien.');

  const filtered = tindakanAll.filter(t =>
    t.nama.toLowerCase().includes(search.toLowerCase()) || t.kode.includes(search)
  );

  const toggle = (kode: string) => {
    setSelected(prev => prev.includes(kode) ? prev.filter(k => k !== kode) : [...prev, kode]);
  };

  return (
    <div className="flex flex-col gap-4 px-4 py-4">
      {/* Search */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Cari kode / nama tindakan"
            className="w-full pl-9 pr-4 py-2.5 border border-border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>
        <button className="w-10 h-10 rounded-xl border border-border bg-white flex items-center justify-center">
          <Filter className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Tindakan list */}
      <div className="flex flex-col gap-2">
        {filtered.map(t => {
          const isSelected = selected.includes(t.kode);
          return (
            <div key={t.kode} className="flex items-center gap-3 bg-white border border-border/50 rounded-xl px-3.5 py-3">
              <div className="flex-1">
                <p className="text-xs font-bold text-foreground">{t.kode}</p>
                <p className="text-[11px] text-muted-foreground">{t.nama}</p>
              </div>
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => toggle(t.kode)}
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                  isSelected ? 'bg-primary text-white' : 'border border-border text-muted-foreground hover:border-primary'
                }`}
              >
                {isSelected ? <CheckCircle2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </motion.button>
            </div>
          );
        })}
      </div>

      {/* Tindakan terpilih */}
      {selected.length > 0 && (
        <div className="flex flex-col gap-2">
          <h3 className="text-xs font-bold text-foreground">Tindakan Terpilih ({selected.length})</h3>
          {selected.map(kode => {
            const t = tindakanAll.find(x => x.kode === kode);
            if (!t) return null;
            return (
              <div key={kode} className="flex items-center gap-2 bg-primary/5 border border-primary/20 rounded-xl px-3.5 py-2.5">
                <div className="flex-1">
                  <p className="text-xs font-bold text-primary">{t.kode}</p>
                  <p className="text-[11px] text-foreground">{t.nama}</p>
                </div>
                <button onClick={() => toggle(kode)}>
                  <X className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      <TextArea label="Catatan Tindakan" value={catatan} onChange={setCatatan} />
      <SaveBtn label="Simpan Tindakan" />
    </div>
  );
}

// ─── TAB: e-Resep ─────────────────────────────────────────────────────────────
interface Obat {
  id: number; nama: string; dosis: string; frekuensi: string;
  jumlah: string; aturan: string; catatan: string;
}

function TabResep() {
  const [subTab, setSubTab] = useState<'non-racikan' | 'racikan'>('non-racikan');
  const [obats, setObats]   = useState<Obat[]>([
    { id: 1, nama: 'Paracetamol 500 mg', dosis: '1 tablet', frekuensi: '3 x sehari',
      jumlah: '10 tablet', aturan: 'Sesudah makan', catatan: 'Jika demam atau nyeri' },
  ]);
  const [search, setSearch] = useState('');

  const removeObat = (id: number) => setObats(prev => prev.filter(o => o.id !== id));

  const addObat = () => {
    setObats(prev => [...prev, {
      id: Date.now(), nama: 'Obat Baru', dosis: '1 tablet', frekuensi: '1 x sehari',
      jumlah: '5 tablet', aturan: 'Sebelum makan', catatan: '',
    }]);
  };

  return (
    <div className="flex flex-col gap-4 px-4 py-4">
      {/* Sub-tabs */}
      <div className="flex bg-muted rounded-xl p-1 gap-1">
        {(['non-racikan', 'racikan'] as const).map(t => (
          <button
            key={t}
            onClick={() => setSubTab(t)}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-colors ${
              subTab === t ? 'bg-white text-foreground shadow-sm' : 'text-muted-foreground'
            }`}
          >
            {t === 'non-racikan' ? 'Non Racikan' : 'Racikan'}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Cari obat / nama generik"
          className="w-full pl-9 pr-4 py-2.5 border border-border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
        />
        <button className="absolute right-3 top-1/2 -translate-y-1/2">
          <Camera className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Obat list */}
      {obats.map(obat => (
        <div key={obat.id} className="bg-white border border-border/50 rounded-2xl p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Pill className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold text-foreground">{obat.nama}</span>
            </div>
            <button onClick={() => removeObat(obat.id)} className="w-7 h-7 rounded-full bg-red-50 flex items-center justify-center">
              <Trash2 className="w-3.5 h-3.5 text-red-500" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex flex-col gap-0.5">
              <span className="text-muted-foreground">Dosis</span>
              <span className="font-medium text-foreground">{obat.dosis}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-muted-foreground">Frekuensi</span>
              <span className="font-medium text-foreground">{obat.frekuensi}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-muted-foreground">Jumlah</span>
              <span className="font-medium text-foreground">{obat.jumlah}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-muted-foreground">Aturan Pakai</span>
              <span className="font-medium text-foreground">{obat.aturan}</span>
            </div>
          </div>
          {obat.catatan && (
            <div className="bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
              <span className="text-[11px] text-amber-700">Catatan: {obat.catatan}</span>
            </div>
          )}
        </div>
      ))}

      {/* Tambah Obat */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={addObat}
        className="w-full py-3 border-2 border-dashed border-primary/40 text-primary text-sm font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-primary/5 transition-colors"
      >
        <Plus className="w-4 h-4" />
        Tambah Obat
      </motion.button>

      {/* Summary */}
      <div className="bg-white border border-border/50 rounded-xl px-4 py-3 flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Total Item</p>
          <p className="text-sm font-bold text-foreground">{obats.length} Obat</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Status Resep</p>
          <p className="text-xs font-semibold text-amber-600">Menunggu Farmasi</p>
        </div>
      </div>

      <SaveBtn label="Simpan Resep" />
    </div>
  );
}

// ─── TAB: Lainnya ─────────────────────────────────────────────────────────────
function TabLainnya() {
  return (
    <div className="flex flex-col gap-4 px-4 py-4">
      <div className="bg-white rounded-2xl border border-border/50 shadow-sm p-4 text-center py-10">
        <FolderOpen className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
        <p className="text-sm font-medium text-foreground">Dokumen & Lampiran</p>
        <p className="text-xs text-muted-foreground mt-1">Belum ada dokumen dilampirkan</p>
        <motion.button
          whileTap={{ scale: 0.97 }}
          className="mt-4 px-5 py-2.5 bg-primary text-white text-xs font-semibold rounded-full"
        >
          Tambah Dokumen
        </motion.button>
      </div>
    </div>
  );
}

// ─── OVERVIEW ────────────────────────────────────────────────────────────────
function Overview({ onStartExam }: { onStartExam: () => void }) {
  const [, setLocation] = useLocation();

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col gap-4 px-4 py-4 pb-28">

      {/* Patient card */}
      <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-border/50 shadow-sm px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <span className="text-lg font-bold text-primary">BS</span>
          </div>
          <div className="flex-1">
            <p className="text-base font-bold text-foreground">{patient.nama}</p>
            <p className="text-xs text-primary font-semibold">{patient.rm}</p>
            <p className="text-xs text-muted-foreground">{patient.info}</p>
            <span className="inline-block mt-1 text-[10px] bg-green-50 text-green-700 border border-green-200 rounded-full px-2 py-0.5 font-semibold">
              {patient.pembayaran}
            </span>
          </div>
          <button className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
            <Edit2 className="w-3.5 h-3.5 text-primary" />
          </button>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-4 gap-2 mt-4 pt-4 border-t border-border/50">
          {[
            { icon: History,     label: 'Riwayat\nKunjungan',  color: '#2563EB', bg: '#EFF6FF' },
            { icon: AlertCircle, label: 'Alergi',               color: '#DC2626', bg: '#FEF2F2' },
            { icon: FileText,    label: 'Riwayat\nPenyakit',    color: '#D97706', bg: '#FFFBEB' },
            { icon: FolderOpen,  label: 'Dokumen',              color: '#7C3AED', bg: '#F5F3FF' },
          ].map(({ icon: Icon, label, color, bg }) => (
            <motion.button
              key={label}
              whileTap={{ scale: 0.90 }}
              className="flex flex-col items-center gap-1.5"
            >
              <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ backgroundColor: bg }}>
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <span className="text-[9px] font-medium text-foreground text-center leading-tight whitespace-pre-line">{label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Kunjungan Saat Ini */}
      <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-border/50 shadow-sm px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-foreground">Kunjungan Saat Ini</h3>
          <span className="text-[10px] bg-blue-100 text-primary border border-blue-200 rounded-full px-2.5 py-0.5 font-semibold">
            Sedang Diperiksa
          </span>
        </div>
        <div className="grid grid-cols-2 gap-y-2.5 text-xs">
          <div>
            <p className="text-muted-foreground">No. Antrean</p>
            <p className="font-bold text-primary">{kunjunganSekarang.noAntrean}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Tanggal &amp; Waktu</p>
            <p className="font-semibold text-foreground">{kunjunganSekarang.tanggal}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Poli</p>
            <p className="font-semibold text-foreground">{kunjunganSekarang.poli}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Dokter</p>
            <p className="font-semibold text-foreground">{kunjunganSekarang.dokter}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Status</p>
            <p className="font-semibold text-foreground">{kunjunganSekarang.status}</p>
          </div>
        </div>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onStartExam}
          className="mt-4 w-full py-3 bg-primary text-white text-sm font-semibold rounded-full shadow-md shadow-primary/25"
        >
          Mulai Pemeriksaan
        </motion.button>
      </motion.div>

      {/* Ringkasan Kunjungan */}
      <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-border/50 shadow-sm px-4 py-4">
        <h3 className="text-sm font-bold text-foreground mb-4">Ringkasan Kunjungan</h3>
        <div className="flex flex-col gap-0">
          {ringkasanSteps.map((step, i) => (
            <div key={step.label} className="flex gap-3">
              {/* Timeline line + dot */}
              <div className="flex flex-col items-center w-6 flex-shrink-0">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                  step.done   ? 'bg-primary'          :
                  step.active ? 'border-2 border-primary bg-white' :
                  'border-2 border-border bg-white'
                }`}>
                  {step.done && <CheckCircle2 className="w-3 h-3 text-white" />}
                  {step.active && <Circle className="w-2 h-2 text-primary fill-primary" />}
                </div>
                {i < ringkasanSteps.length - 1 && (
                  <div className={`w-0.5 flex-1 min-h-[24px] my-0.5 ${step.done ? 'bg-primary' : 'bg-border'}`} />
                )}
              </div>
              {/* Label */}
              <div className="pb-5 flex-1">
                <p className={`text-xs font-semibold ${step.active ? 'text-primary' : step.done ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {step.label}
                  {step.active && (
                    <span className="ml-2 text-[9px] bg-blue-100 text-primary px-1.5 py-0.5 rounded-full font-semibold">
                      Sedang berlangsung
                    </span>
                  )}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{step.time}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Riwayat Sebelumnya */}
      <motion.div variants={fadeUp} className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground">Riwayat Kunjungan Sebelumnya</h3>
          <button className="text-xs text-primary font-medium">Lihat Semua</button>
        </div>
        {riwayatSebelumnya.map((r, i) => (
          <div key={i} className="bg-white rounded-2xl border border-border/50 shadow-sm px-4 py-3 flex items-center gap-3">
            <div className="flex-1">
              <p className="text-xs font-bold text-foreground">{r.tanggal}</p>
              <p className="text-[11px] text-muted-foreground">{r.poli} · {r.dokter}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}

// ─── EXAMINATION VIEW (5 tabs) ────────────────────────────────────────────────
function ExaminationView({ onBack }: { onBack: () => void }) {
  const [tab, setTab] = useState<ExamTab>('pemeriksaan');

  const tabs: { key: ExamTab; label: string }[] = [
    { key: 'pemeriksaan', label: 'Pemeriksaan' },
    { key: 'diagnosis',   label: 'Diagnosis' },
    { key: 'tindakan',    label: 'Tindakan' },
    { key: 'resep',       label: 'Resep' },
    { key: 'lainnya',     label: 'Lainnya' },
  ];

  return (
    <div className="flex flex-col min-h-[100dvh] bg-[#F5F7FA]">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-border/60 px-4 pt-10 pb-0">
        <div className="flex items-center gap-3 pb-3">
          <button onClick={onBack} className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
            <ChevronLeft className="w-4 h-4 text-primary" />
          </button>
          <h1 className="flex-1 text-base font-bold text-foreground">Pemeriksaan</h1>
          <button className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
            <Activity className="w-4 h-4 text-primary" />
          </button>
        </div>
        {/* Tabs */}
        <div className="flex overflow-x-auto no-scrollbar">
          {tabs.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex-shrink-0 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
                tab === key
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto pb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22 }}
          >
            {tab === 'pemeriksaan' && <TabPemeriksaan />}
            {tab === 'diagnosis'   && <TabDiagnosis />}
            {tab === 'tindakan'    && <TabTindakan />}
            {tab === 'resep'       && <TabResep />}
            {tab === 'lainnya'     && <TabLainnya />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── ROOT PAGE ────────────────────────────────────────────────────────────────
export default function RMEPage() {
  const [, setLocation] = useLocation();
  const [view, setView] = useState<MainView>('overview');

  return (
    <div className="min-h-[100dvh] bg-[#F5F7FA] flex flex-col">
      <AnimatePresence mode="wait">
        {view === 'overview' ? (
          <motion.div
            key="overview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col flex-1"
          >
            {/* Overview header */}
            <div className="sticky top-0 z-40 bg-white border-b border-border/60 px-4 pt-10 pb-3 flex items-center gap-3">
              <button
                onClick={() => setLocation('/antrean')}
                className="w-8 h-8 rounded-full bg-accent flex items-center justify-center"
              >
                <ChevronLeft className="w-4 h-4 text-primary" />
              </button>
              <h1 className="flex-1 text-base font-bold text-foreground">Rekam Medis Elektronik</h1>
              <button className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                <MoreVertical className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <Overview onStartExam={() => setView('exam')} />
            </div>

            <BottomNav />
          </motion.div>
        ) : (
          <motion.div
            key="exam"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
            className="flex-1"
          >
            <ExaminationView onBack={() => setView('overview')} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
