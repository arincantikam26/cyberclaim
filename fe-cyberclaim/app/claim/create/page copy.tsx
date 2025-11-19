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
      //   await createClaim({
      //     ...data,
      //     amount: parseFloat(data.amount)
      //   });

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
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Buat Klaim Baru</h1>
          <p className="text-gray-600 mt-2">
            Isi formulir di bawah untuk mengajukan klaim BPJS baru
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
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
