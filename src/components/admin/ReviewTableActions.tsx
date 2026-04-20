"use client";

import { useState } from "react";
import { Check, X, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface ReviewTableActionsProps {
  reviewId: string;
  currentStatus: string;
}

export default function ReviewTableActions({ reviewId, currentStatus }: ReviewTableActionsProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleUpdateStatus = async (status: "approved" | "rejected") => {
    setLoading(true);
    // Simulate network delay
    await new Promise(r => setTimeout(r, 800));
    
    try {
      console.log(`Mock: Updated review ${reviewId} to ${status}`);
      router.refresh();
    } catch (err) {
      alert("Gagal memperbarui ulasan (Simulasi).");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-end gap-2">
      {loading ? (
        <Loader2 size={16} className="animate-spin text-brand-green mr-4" />
      ) : (
        <>
          {currentStatus !== "approved" && (
            <button
              onClick={() => handleUpdateStatus("approved")}
              className="p-2 border border-brand-green/20 text-brand-green hover:bg-brand-green hover:text-white transition-all rounded-full group/btn"
              title="Setujui Ulasan"
            >
              <Check size={14} className="group-hover/btn:scale-110 transition-transform" />
            </button>
          )}
          {currentStatus !== "rejected" && (
            <button
              onClick={() => handleUpdateStatus("rejected")}
              className="p-2 border border-red-100 text-red-400 hover:bg-red-400 hover:text-white transition-all rounded-full group/btn"
              title="Tolak Ulasan"
            >
              <X size={14} className="group-hover/btn:scale-110 transition-transform" />
            </button>
          )}
        </>
      )}
    </div>
  );
}
