import React from "react";
import {
  Link2,
  FileText,
  Image as ImageIcon,
  Eye,
  Download,
  MoreVertical,
  Info,
} from "lucide-react";

interface ExternalDocument {
  id: string;
  name: string;
  fileName: string;
  fileSize: string;
  type: "pdf" | "image";
  category: string;
  uploadDate: string;
  uploadedBy: {
    name: string;
    role: string;
  };
}

const documentsData: ExternalDocument[] = [
  {
    id: "1",
    name: "Surat Rujukan dari RS Melati",
    fileName: "rujukan-rs-melati.pdf",
    fileSize: "523 KB",
    type: "pdf",
    category: "Surat / Rujukan",
    uploadDate: "16/08/2026 09:15 WIB",
    uploadedBy: {
      name: "Siti Rahma, A.Md.Kep",
      role: "Perawat",
    },
  },
  {
    id: "2",
    name: "Persetujuan Tindakan (Scan)",
    fileName: "persetujuan-tindakan.jpg",
    fileSize: "1.2 MB",
    type: "image",
    category: "Persetujuan",
    uploadDate: "16/08/2026 09:25 WIB",
    uploadedBy: {
      name: "Siti Rahma, A.Md.Kep",
      role: "Perawat",
    },
  },
];

export const ExternalDocumentsSection: React.FC = () => {
  return (
    <div className="rounded-xl border border-sky-100 bg-sky-50/20 p-5 space-y-4">
      {/* Header Section */}
      <div className="flex items-center space-x-2">
        <Link2 className="h-5 w-5 text-sky-600" />
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wide text-sky-700">
            Dokumen Eksternal
          </h2>
          <p className="text-xs text-gray-500">
            Dokumen dari sumber luar atau lampiran pendukung (pdf, gambar, dll).
          </p>
        </div>
      </div>

      {/* Document Table */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-[11px] font-semibold text-gray-500 uppercase">
                <th className="py-3 px-4">Nama Dokumen</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4">Tanggal Unggah</th>
                <th className="py-3 px-4">Diunggah Oleh</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {documentsData.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50/60 transition-colors">
                  {/* Nama Dokumen & File Info */}
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      {/* File Icon Badge */}
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                          doc.type === "pdf"
                            ? "bg-red-50 text-red-600 border border-red-100"
                            : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                        }`}
                      >
                        {doc.type === "pdf" ? (
                          <span className="text-[10px] font-bold">PDF</span>
                        ) : (
                          <ImageIcon className="h-4 w-4" />
                        )}
                      </div>

                      <div>
                        <p className="font-semibold text-gray-900">{doc.name}</p>
                        <p className="text-[11px] text-gray-400">
                          {doc.fileName} ({doc.fileSize})
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Kategori Badge */}
                  <td className="py-3 px-4">
                    <span className="inline-block rounded-md bg-sky-50 px-2.5 py-1 text-[11px] font-medium text-sky-700 border border-sky-100">
                      {doc.category}
                    </span>
                  </td>

                  {/* Tanggal Unggah */}
                  <td className="py-3 px-4 text-gray-600">{doc.uploadDate}</td>

                  {/* Diunggah Oleh */}
                  <td className="py-3 px-4">
                    <p className="font-medium text-gray-800">{doc.uploadedBy.name}</p>
                    <p className="text-[11px] text-gray-400">{doc.uploadedBy.role}</p>
                  </td>

                  {/* Aksi */}
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center space-x-1">
                      <button
                        title="Lihat Dokumen"
                        className="rounded-lg p-1.5 text-sky-600 hover:bg-sky-50 transition-colors border border-sky-100"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        title="Unduh"
                        className="rounded-lg p-1.5 text-sky-600 hover:bg-sky-50 transition-colors border border-sky-100"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button
                        title="Opsi Lainnya"
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Alert Regulation Banner */}
      <div className="flex items-start space-x-3 rounded-lg border border-sky-200 bg-sky-50/80 p-3 text-xs text-sky-900">
        <Info className="h-4 w-4 text-sky-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          Data klinis seperti anamnesis, pemeriksaan fisik, diagnosis, tindakan, resep, dan CPPT tersimpan dalam sistem secara terstruktur sesuai regulasi Kemenkes dan terintegrasi dengan SATUSEHAT.
        </p>
      </div>
    </div>
  );
};

export default ExternalDocumentsSection;