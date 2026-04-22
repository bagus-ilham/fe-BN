import { getSupabaseAdmin } from "@/utils/supabase";

type ProfileLite = {
  id: string;
  full_name: string | null;
};

export type AdminLogItem = {
  id: string;
  action: string;
  target_table: string | null;
  target_id: string | null;
  payload: unknown;
  created_at: string;
  admin_id: string | null;
  profiles: ProfileLite | null;
};

export type InventoryMovementItem = {
  id: string;
  created_at: string;
  created_by: string | null;
  quantity_change: number;
  quantity_after: number;
  reason: string | null;
  product_variants: {
    sku: string | null;
    color_name: string | null;
    size: string | null;
    products: { name: string | null } | null;
  } | null;
  profiles: ProfileLite | null;
};

async function getProfilesByIds(userIds: string[]) {
  if (userIds.length === 0) return new Map<string, ProfileLite>();

  const supabase = getSupabaseAdmin();
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name")
    .in("id", userIds);

  return new Map((profiles || []).map((profile) => [profile.id, profile as ProfileLite]));
}

function collectIds<T>(rows: T[], getId: (row: T) => string | null | undefined) {
  return Array.from(new Set(rows.map(getId).filter((id): id is string => Boolean(id))));
}

export async function listAdminLogs() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("admin_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) throw error;
  const logs = (data || []) as Array<{
    id: string;
    action: string;
    target_table: string | null;
    target_id: string | null;
    payload: unknown;
    created_at: string;
    admin_id: string | null;
  }>;
  const adminIds = collectIds(logs, (log) => log.admin_id);

  if (adminIds.length === 0) {
    return logs.map((log) => ({ ...log, profiles: null })) as AdminLogItem[];
  }

  const profileMap = await getProfilesByIds(adminIds);

  return logs.map((log) => ({
    ...log,
    profiles: log.admin_id ? profileMap.get(log.admin_id) ?? null : null,
  })) as AdminLogItem[];
}

export async function listAdminLogsPaged(params: {
  page: number;
  pageSize: number;
  action?: string;
  q?: string;
}): Promise<{
  data: AdminLogItem[];
  total: number;
  page: number;
  pageSize: number;
}> {
  const pageSize = Math.min(Math.max(params.pageSize || 20, 10), 100);
  const page = Math.max(params.page || 1, 1);
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const supabase = getSupabaseAdmin();
  let query = supabase
    .from("admin_logs")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (params.action) {
    query = query.eq("action", params.action);
  }

  const q = params.q?.trim();
  if (q) {
    const escaped = q.replaceAll("%", "\\%").replaceAll("_", "\\_");
    query = query.or(
      `action.ilike.%${escaped}%,target_table.ilike.%${escaped}%,target_id.ilike.%${escaped}%`
    );
  }

  const { data, error, count } = await query;
  if (error) throw error;

  const logs = (data || []) as Array<{
    id: string;
    action: string;
    target_table: string | null;
    target_id: string | null;
    payload: unknown;
    created_at: string;
    admin_id: string | null;
  }>;

  const adminIds = collectIds(logs, (log) => log.admin_id);
  const profileMap = await getProfilesByIds(adminIds);

  return {
    data: logs.map((log) => ({
      ...log,
      profiles: log.admin_id ? profileMap.get(log.admin_id) ?? null : null,
    })) as AdminLogItem[],
    total: count || 0,
    page,
    pageSize,
  };
}

export async function listInventoryMovements() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("inventory_movements")
    .select(`
      *,
      product_variants (
        sku,
        color_name,
        size,
        products (name)
      )
    `)
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) throw error;
  const movements = (data || []) as Array<{
    id: string;
    created_at: string;
    created_by: string | null;
    quantity_change: number;
    quantity_after: number;
    reason: string | null;
    product_variants: {
      sku: string | null;
      color_name: string | null;
      size: string | null;
      products: { name: string | null } | null;
    } | null;
  }>;
  const createdByIds = collectIds(movements, (movement) => movement.created_by);

  if (createdByIds.length === 0) {
    return movements.map((movement) => ({ ...movement, profiles: null })) as InventoryMovementItem[];
  }

  const profileMap = await getProfilesByIds(createdByIds);

  return movements.map((movement) => ({
    ...movement,
    profiles: movement.created_by ? profileMap.get(movement.created_by) ?? null : null,
  })) as InventoryMovementItem[];
}
