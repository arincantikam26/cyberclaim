// app/dashboard/faskes/claims/create/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ClaimForm } from "@/components/Features/Claims/ClaimForm";
import AdminLayout from "@/components/Layout/admin/AdminLayout";
// import { createClaim } from '@/lib/api/claims';

export default function CreateClaimPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    setLoading(true);

    try {
      // Create FormData for file upload
      const formData = new FormData();

      // Append all form fields
      Object.keys(data).forEach((key) => {
        if (key === "claimFile" && data.claimFile) {
          formData.append("file", data.claimFile);
        } else if (key !== "claimFile") {
          formData.append(key, data[key]);
        }
      });

      //   await createClaim(formData);

      router.push("/dashboard/faskes/my-claims");
      // Bisa tambahkan toast notification di sini
    } catch (error) {
      console.error("Failed to create claim:", error);
      // Handle error (show toast, etc.)
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Upload Klaim Baru
            </h1>
            <p className="text-gray-600 mt-2">
              Upload dokumen klaim BPJS dan isi informasi yang diperlukan
            </p>
          </div>

          <ClaimForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={loading}
            mode="create"
          />
        </div>
      </div>
    </AdminLayout>
  );
}
