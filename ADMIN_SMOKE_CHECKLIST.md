# Admin E2E Smoke Checklist

Tujuan checklist ini adalah memastikan source of truth admin konsisten:
UI admin -> API route/service -> Supabase -> render ulang FE.

## Quick run 10-15 menit

Ikuti urutan ini untuk verifikasi cepat:

1. Jalankan app (`npm run dev`) dan login admin.
2. Buka DevTools -> Network (filter `api/admin`).
3. Uji write-path berurutan:
   - `/admin/categories` (create + edit + delete satu data uji)
   - `/admin/collections` (create + edit + delete satu data uji)
   - `/admin/discounts` (create + edit satu promo uji)
   - `/admin/inventory` (ubah stok satu variant)
4. Setelah tiap aksi:
   - pastikan request `2xx`
   - refresh halaman
   - pastikan data tetap (persisted)
5. Buka halaman read domain baru:
   - `/admin/flash-sales`
   - `/admin/automation`
   - `/admin/kits`
   - `/admin/returns`
   - `/admin/logs`
   - `/admin/inventory/logs`
   pastikan data nyata tampil atau empty-state (tanpa data palsu).

## Cara pakai

- Jalankan per domain dari atas ke bawah.
- Setiap aksi tulis wajib diverifikasi dengan refresh halaman.
- Jika tidak ada data, pastikan empty-state tampil (bukan data palsu).

## Global checks (semua halaman admin)

- [ ] Halaman bisa dibuka tanpa error runtime.
- [ ] Data utama berasal dari query Supabase/API, bukan angka hardcoded.
- [ ] Empty-state muncul saat data kosong.
- [ ] Refresh browser tetap menampilkan hasil yang sama (persisted).
- [ ] Tidak ada error 4xx/5xx di Network untuk request utama.

## Categories

- [ ] Buka `/admin/categories`, daftar kategori tampil.
- [ ] Tambah kategori baru, submit sukses.
- [ ] Refresh halaman, kategori baru tetap ada.
- [ ] Edit kategori, simpan, refresh, nilai terbaru tetap ada.
- [ ] Hapus kategori, refresh, data hilang dari daftar.

## Collections

- [ ] Buka `/admin/collections`, daftar koleksi tampil.
- [ ] Tambah koleksi baru, submit sukses.
- [ ] Refresh halaman, koleksi baru tetap ada.
- [ ] Edit koleksi, simpan, refresh, nilai terbaru tetap ada.
- [ ] Hapus koleksi, refresh, data hilang dari daftar.

## Discounts / Promo codes

- [ ] Buka `/admin/discounts`, promo codes tampil.
- [ ] Tambah promo code valid (percentage/fixed), submit sukses.
- [ ] Refresh halaman, promo code baru tetap ada.
- [ ] Edit promo code, simpan, refresh, perubahan tetap ada.
- [ ] Uji payload invalid (mis. percentage > 100), API menolak.

## Inventory

- [ ] Buka `/admin/inventory`, data stok variant tampil.
- [ ] Ubah stok satu variant, blur input, update sukses.
- [ ] Refresh halaman, stok terbaru tetap sama.
- [ ] Input invalid (negatif/non-integer) ditolak API.

## Inventory logs

- [ ] Buka `/admin/inventory/logs`, log tampil atau empty-state.
- [ ] Setelah update stok, cek ada jejak log baru bila sistem mencatat movement.

## Flash sales

- [ ] Buka `/admin/flash-sales`, stats dan tabel tampil.
- [ ] Jika data kosong, empty-state muncul tanpa angka palsu.

## Automation

- [ ] Buka `/admin/automation`, sequence tampil.
- [ ] Jika data kosong, empty-state muncul.

## Kits

- [ ] Buka `/admin/kits`, data kit tampil.
- [ ] Jika data kosong, empty-state muncul.

## Returns

- [ ] Buka `/admin/returns`, data retur tampil.
- [ ] Jika data kosong, empty-state muncul.

## Admin logs

- [ ] Buka `/admin/logs`, audit log tampil.
- [ ] Jika data kosong, empty-state muncul.

## Final gate

- [ ] Jalankan lint untuk file yang diubah.
- [ ] Tidak ada data bisnis hardcoded baru di `src/app/admin/**`.
- [ ] Semua write-path domain di atas terbukti persisted setelah refresh.
