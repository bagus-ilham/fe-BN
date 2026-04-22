export async function saveProductViaAdminApi(
  product: Record<string, unknown>,
  variants: Array<Record<string, unknown>>,
  images: string[],
) {
  const response = await fetch("/api/admin/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ product, variants, images }),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || "Gagal menyimpan produk");
  }
  return result.product;
}

export async function saveCategoryViaAdminApi(category: Record<string, unknown>) {
  const response = await fetch("/api/admin/categories", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(category),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || "Gagal menyimpan kategori");
  }

  return result.category;
}

export async function deleteCategoryViaAdminApi(id: string) {
  const response = await fetch(`/api/admin/categories?id=${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || "Gagal menghapus kategori");
  }
}

export async function saveCollectionViaAdminApi(collection: Record<string, unknown>) {
  const response = await fetch("/api/admin/collections", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(collection),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || "Gagal menyimpan koleksi");
  }

  return result.collection;
}

export async function deleteCollectionViaAdminApi(id: string) {
  const response = await fetch(`/api/admin/collections?id=${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || "Gagal menghapus koleksi");
  }
}

export async function savePromoCodeViaAdminApi(promoCode: Record<string, unknown>) {
  const response = await fetch("/api/admin/promo-codes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(promoCode),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || "Gagal menyimpan promo");
  }

  return result.promoCode;
}

export async function updateStockViaAdminApi(variantId: string, quantity: number) {
  const response = await fetch("/api/admin/inventory", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ variantId, quantity }),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || "Gagal memperbarui stok");
  }

  return result.inventory;
}
