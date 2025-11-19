// app/dashboard/page.tsx
"use client";

import AdminLayout from "@/components/Layout/admin/AdminLayout";
import Table from "@/components/UI/Table/Table";
import QuickActions from "@/components/Features/Claims/QuickAction";
import RecentActivity from "@/components/Features/Claims/RecentActivity";
import { useEffect, useState } from "react";

import { claimDummy } from "@/lib/dataDummy";

import TableSection from "@/components/Features/Claims/TableSection";
import Link from "next/link";

import {
  BuildingOfficeIcon,
  UserGroupIcon,
  DocumentCheckIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";

export default function Dashboard() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalClaims: 0,
    pendingClaims: 0,
    approvedClaims: 0,
    rejectedClaims: 0,
    totalAmount: 0,
    fraudDetected: 0,
  });

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setData(claimDummy);
      setStats({
        totalClaims: 156,
        pendingClaims: 23,
        approvedClaims: 45,
        rejectedClaims: 12,
        totalAmount: 1250000000,
        fraudDetected: 8,
      });
      setLoading(false);
    }, 1500);
  }, []);

  const statsData = [
    {
      title: "Total Klaim",
      value: stats.totalClaims.toString(),
      icon: DocumentCheckIcon,
      color: "bg-blue-500",
      change: "+12%",
      trend: "up",
      description: "Bulan ini",
    },
    {
      title: "Pending Review",
      value: stats.pendingClaims.toString(),
      icon: ClockIcon,
      color: "bg-yellow-500",
      change: "+5%",
      trend: "up",
      description: "Menunggu verifikasi",
    },
    {
      title: "Disetujui",
      value: stats.approvedClaims.toString(),
      icon: CheckCircleIcon,
      color: "bg-green-500",
      change: "+15%",
      trend: "up",
      description: "Klaim tervalidasi",
    },
    {
      title: "Potensi Fraud",
      value: stats.fraudDetected.toString(),
      icon: ExclamationTriangleIcon,
      color: "bg-red-500",
      change: "-3%",
      trend: "down",
      description: "Perlu investigasi",
    },
    {
      title: "Total Nilai",
      value: `Rp ${(stats.totalAmount / 1000000).toFixed(1)}M`,
      icon: CurrencyDollarIcon,
      color: "bg-purple-500",
      change: "+8%",
      trend: "up",
      description: "Klaim aktif",
    },
  ];

  const handleRowClick = (row: any) => {
    console.log("Row clicked:", row);
    // Navigate to claim detail page
    // router.push(`/dashboard/claims/${row.id}`);
  };

  const handleViewDetails = (row: any) => {
    console.log("View details:", row);
    // Show detail modal or navigate to detail page
  };

  const handleApprove = (row: any) => {
    console.log("Approve claim:", row);
    // API call to approve claim
  };

  const handleReject = (row: any) => {
    console.log("Reject claim:", row);
    // API call to reject claim
  };

  const handleDownload = (row: any) => {
    console.log("Download documents:", row);
    // Download claim documents
  };

  return (
    <AdminLayout>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Dashboard Klaim
            </h1>
            <p className="text-gray-600 mt-2">
              Monitor dan kelola semua klaim BPJS secara real-time
            </p>
          </div>
          <div className="mt-4 lg:mt-0 flex space-x-3">
            <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors font-medium">
              Export Laporan
            </button>
            <a href=""></a>
          
            <Link href="/claim/create">
              <button className="bg-linear-to-r from-blue-500 to-green-500 text-white px-6 py-2 rounded-xl hover:shadow-lg transition-all duration-200 font-medium">
                + Klaim Baru
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Table Section - 3/4 width */}
        <div className="xl:col-span-3 space-y-6">
          {/* Quick Actions */}
          <QuickActions />

          <TableSection
            data={data}
            handleRowClick={handleRowClick}
            loading={loading}
          />
        </div>

        {/* Sidebar - 1/4 width */}
        <div className="xl:col-span-1 space-y-6">
          {/* Recent Activity */}
          <RecentActivity />

          {/* Fraud Alerts */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Alert Fraud
              </h3>
              <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">
                {stats.fraudDetected} Alert
              </span>
            </div>
            <div className="space-y-3">
              {data
                .filter((item) => item.fraudScore >= 70)
                .map((item, index) => (
                  <div
                    key={index}
                    className="p-3 bg-red-50 border border-red-200 rounded-lg"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-red-900 text-sm">
                        {item.id}
                      </span>
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {item.fraudScore}%
                      </span>
                    </div>
                    <p className="text-red-700 text-xs mb-2">
                      {item.patientName} - {item.faskes}
                    </p>
                    <button className="w-full bg-red-500 hover:bg-red-600 text-white text-xs py-1.5 rounded transition-colors">
                      Investigasi
                    </button>
                  </div>
                ))}
              {data.filter((item) => item.fraudScore >= 70).length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  <svg
                    className="w-8 h-8 mx-auto mb-2 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                  <p className="text-sm">Tidak ada alert fraud</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
