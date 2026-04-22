import { getSupabaseAdmin } from "@/utils/supabase";

type VipInput = {
  email: string;
  fullName: string;
  phone?: string | null;
};

export async function upsertVipEntry(input: VipInput) {
  const supabaseAdmin = getSupabaseAdmin();
  const email = input.email.trim().toLowerCase();
  const fullName = input.fullName.trim();
  const phone = input.phone?.trim() || null;

  const payload: Record<string, string> = {
    email,
    full_name: fullName,
  };

  if (phone) {
    payload.phone = phone;
  }

  let result = await supabaseAdmin
    .from("vip_list")
    .upsert(payload, { onConflict: "email" })
    .select()
    .single();

  const isPhoneSchemaIssue =
    result.error &&
    (result.error.message?.includes("column \"phone\"") ||
      result.error.message?.includes("Could not find the 'phone' column") ||
      result.error.code === "42703");

  if (isPhoneSchemaIssue) {
    const { phone: _ignored, ...fallbackPayload } = payload;
    result = await supabaseAdmin
      .from("vip_list")
      .upsert(fallbackPayload, { onConflict: "email" })
      .select()
      .single();
  }

  if (result.error || !result.data) {
    return {
      ok: false as const,
      error: result.error?.message || "Failed to upsert VIP entry",
    };
  }

  return {
    ok: true as const,
    data: result.data,
  };
}
