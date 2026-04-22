import { supabase } from "@/utils/supabase";
import { CmsPage, CmsPageVersion, SiteSettingsRow } from "@/types/database";

export async function listCMSPagesForAdmin(): Promise<CmsPage[]> {
  const { data, error } = await supabase
    .from("cms_pages")
    .select("*")
    .order("slug", { ascending: true });

  if (error) {
    console.error("Error fetching CMS pages:", error);
    return [];
  }

  return data || [];
}

export async function getCMSPageBySlugForAdmin(slug: string): Promise<CmsPage | null> {
  const { data, error } = await supabase
    .from("cms_pages")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    if (error.code !== "PGRST116") {
      console.error(`Error fetching CMS page ${slug}:`, error);
    }
    return null;
  }

  return data;
}

export async function listCMSPageVersionsForAdmin(pageId: string): Promise<CmsPageVersion[]> {
  const { data, error } = await supabase
    .from("cms_page_versions")
    .select("*")
    .eq("page_id", pageId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(`Error fetching versions for page ${pageId}:`, error);
    return [];
  }

  return data || [];
}

export async function getPublishedCMSPageBySlug(slug: string): Promise<CmsPage | null> {
  const { data, error } = await supabase
    .from("cms_pages")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (error) {
    if (error.code !== "PGRST116") {
      console.error(`Error fetching published CMS page ${slug}:`, error);
    }
    return null;
  }

  return data;
}

export async function saveCMSPage(page: Partial<CmsPage>) {
  const { data, error } = await supabase
    .from("cms_pages")
    .upsert({
      ...page,
      updated_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) {
    console.error("Error saving CMS page:", error);
    throw error;
  }

  return data;
}

export async function getSiteSettings() {
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", "current")
    .single();
  
  if (error) {
    if (error.code !== "PGRST116") {
      console.error("Error fetching site settings:", error);
    }
    return null;
  }
  return data as SiteSettingsRow;
}

export async function saveSiteSettings(settings: Partial<SiteSettingsRow>) {
  const { data, error } = await supabase
    .from("site_settings")
    .upsert({ id: "current", ...settings, updated_at: new Date().toISOString() })
    .select()
    .single();

  if (error) {
    console.error("Error saving site settings:", error);
    throw error;
  }
  return data as SiteSettingsRow;
}

