import { getSupabaseAdmin } from "@/utils/supabase";
import { KitRow, KitItem } from "@/types/database";

export async function listAllKitsForAdmin() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("kits")
    .select(`
      *,
      kit_items (
        id,
        quantity,
        product_id,
        variant_id,
        products (name)
      )
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function saveKit(kit: Partial<KitRow>, items: Partial<KitItem>[]) {
  const supabase = getSupabaseAdmin();
  
  const { data: savedKit, error: kitError } = await supabase
    .from("kits")
    .upsert(kit)
    .select()
    .single();

  if (kitError) throw kitError;

  // Re-sync items
  if (items && items.length > 0) {
    // Delete old items
    await supabase.from("kit_items").delete().eq("kit_id", savedKit.id);
    
    // Insert new items
    const itemsToInsert = items.map(item => ({
      ...item,
      kit_id: savedKit.id
    }));
    
    const { error: itemsError } = await supabase
      .from("kit_items")
      .insert(itemsToInsert);

    if (itemsError) throw itemsError;
  }

  return savedKit;
}

export async function deleteKit(id: string) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("kits").delete().eq("id", id);
  if (error) throw error;
  return true;
}

export async function listActiveKits() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("kits")
    .select("id, name, created_at")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}
