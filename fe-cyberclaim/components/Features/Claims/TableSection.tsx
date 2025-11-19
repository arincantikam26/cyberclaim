import Table from "@/components/UI/Table/Table";
import { claimDummy } from "@/lib/dataDummy";
import { BuildingOffice2Icon } from "@heroicons/react/16/solid";



export const columns = [
  {
    key: "id",
    label: "ID Klaim",
    sortable: true,
    filterable: true,
    width: "140px",
    render: (value: string, row: any) => (
      <div className="flex items-center space-x-2">
        <div
          className={`w-2 h-2 rounded-full ${
            row.priority === "urgent"
              ? "bg-red-500"
              : row.priority === "high"
              ? "bg-orange-500"
              : "bg-green-500"
          }`}
        ></div>
        <span className="font-mono text-sm font-medium">{value}</span>
      </div>
    ),
  },
  {
    key: "patientName",
    label: "Nama Pasien",
    sortable: true,
    filterable: true,
    render: (value: string, row: any) => (
      <div>
        <div className="font-medium text-gray-900">{value}</div>
        <div className="text-xs text-gray-500">{row.bpjsNumber}</div>
      </div>
    ),
  },
  {
    key: "faskes",
    label: "Faskes",
    sortable: true,
    filterable: true,
    render: (value: string) => (
      <div className="flex items-center space-x-2">
        <BuildingOffice2Icon className="h-4 w-4 text-gray-400" />
        <span className="text-sm">{value}</span>
      </div>
    ),
  },
  {
    key: "diagnosis",
    label: "Diagnosis",
    sortable: true,
    filterable: true,
    render: (value: string, row: any) => (
      <div>
        <div className="text-sm font-medium">{value}</div>
        <div className="text-xs text-gray-500">{row.procedure}</div>
      </div>
    ),
  },
  {
    key: "amount",
    label: "Nilai Klaim",
    sortable: true,
    align: "right" as const,
    render: (value: number) => (
      <div className="text-right">
        <div className="font-semibold text-green-600">
          Rp {value.toLocaleString("id-ID")}
        </div>
      </div>
    ),
  },
  {
    key: "status",
    label: "Status",
    sortable: true,
    filterable: true,
    align: "center" as const,
    width: "120px",
    render: (value: string, row: any) => {
      const statusConfig = {
        pending: {
          color: "bg-yellow-100 text-yellow-800 border-yellow-200",
          label: "Pending",
        },
        approved: {
          color: "bg-green-100 text-green-800 border-green-200",
          label: "Disetujui",
        },
        rejected: {
          color: "bg-red-100 text-red-800 border-red-200",
          label: "Ditolak",
        },
        verified: {
          color: "bg-blue-100 text-blue-800 border-blue-200",
          label: "Terverifikasi",
        },
      };

      const config =
        statusConfig[value as keyof typeof statusConfig] ||
        statusConfig.pending;

      return (
        <span
          className={`
            inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
            ${config.color}
          `}
        >
          {config.label}
        </span>
      );
    },
  },
  {
    key: "fraudScore",
    label: "Fraud Score",
    sortable: true,
    align: "center" as const,
    width: "100px",
    render: (value: number) => (
      <div className="flex flex-col items-center">
        <div
          className={`w-12 h-2 rounded-full ${
            value >= 70
              ? "bg-red-500"
              : value >= 30
              ? "bg-yellow-500"
              : "bg-green-500"
          }`}
        ></div>
        <span
          className={`text-xs font-medium mt-1 ${
            value >= 70
              ? "text-red-600"
              : value >= 30
              ? "text-yellow-600"
              : "text-green-600"
          }`}
        >
          {value}%
        </span>
      </div>
    ),
  },
  {
    key: "submissionDate",
    label: "Tanggal",
    sortable: true,
    align: "center" as const,
    width: "120px",
    render: (value: string, row: any) => (
      <div className="text-center text-sm">
        <div className="text-gray-900">
          {new Date(value).toLocaleDateString("id-ID")}
        </div>
        {row.verificationDate && (
          <div className="text-xs text-gray-500">
            ✓ {new Date(row.verificationDate).toLocaleDateString("id-ID")}
          </div>
        )}
      </div>
    ),
  },
  {
    key: "actions",
    label: "Aksi",
    align: "center" as const,
    width: "120px",
    render: (value: any, row: any) => (
      <div className="flex justify-center space-x-1">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleViewDetails(row);
          }}
          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          title="Lihat Detail"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
        </button>

        {row.status === "pending" && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleApprove(row);
              }}
              className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              title="Setujui Klaim"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleReject(row);
              }}
              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Tolak Klaim"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDownload(row);
          }}
          className="p-1.5 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          title="Download Dokumen"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </button>
      </div>
    ),
  },
];

export default function TableSection({
  data,
  handleRowClick,
  loading,
}: any) {

    const customEmptyState = (
        <tr>
          <td colSpan={columns.length} className="px-6 py-16 text-center">
            <div className="flex flex-col items-center justify-center">
              <div className="w-24 h-24 bg-linear-to-r from-blue-100 to-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Belum Ada Data Klaim</h3>
              <p className="text-gray-500 mb-4">Tidak ada klaim yang perlu diverifikasi saat ini</p>
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors">
                + Upload Klaim Baru
              </button>
            </div>
          </td>
        </tr>
      );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 lg:mb-0">
            Daftar Klaim Terbaru
          </h2>
          <div className="flex space-x-3">
            <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Semua Status</option>
              <option>Pending</option>
              <option>Disetujui</option>
              <option>Ditolak</option>
              <option>Terverifikasi</option>
            </select>
            <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Semua Prioritas</option>
              <option>Urgent</option>
              <option>High</option>
              <option>Normal</option>
            </select>
          </div>
        </div>
      </div>

      <Table
        columns={columns}
        data={data}
        pageSize={8}
        searchable={true}
        filterable={true}
        onRowClick={handleRowClick}
        loading={loading}
        striped={true}
        hoverable={true}
        emptyState={customEmptyState}
      />
    </div>
  );
}
