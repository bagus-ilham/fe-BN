import type { Metadata } from "next";
import { getPublishedCMSPageBySlug } from "@/lib/cms-service";
import CMSBlocksRenderer from "@/components/cms/CMSBlocksRenderer";

export const metadata: Metadata = {
  title: "Pengiriman & Pengembalian | benangbaju",
  description: "Kebijakan pengiriman, penukaran, dan pengembalian barang benangbaju.",
};

export default async function TrocasPage() {
  const cmsPage = await getPublishedCMSPageBySlug("legal-returns");
  
  if (cmsPage && Array.isArray(cmsPage.blocks) && cmsPage.blocks.length > 0) {
    return (
      <main className="bg-brand-offwhite page-shell">
        <CMSBlocksRenderer blocks={cmsPage.blocks as any[]} />
      </main>
    );
  }

  return (
    <main className="bg-brand-offwhite page-shell">
      {/* Hero */}
      <div className="bg-brand-softblack py-16 px-6 text-center">
        <span className="inline-block text-[10px] uppercase tracking-[0.4em] text-brand-gold font-light mb-4">
          Legal
        </span>
        <h1 className="text-3xl md:text-4xl font-extralight uppercase tracking-[0.15em] text-brand-offwhite">
          Pengiriman & Pengembalian
        </h1>
        <p className="text-brand-offwhite/50 text-xs font-light mt-3 tracking-wider">
          Berlaku mulai 1 Januari 2025
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="text-sm text-brand-softblack/70 leading-relaxed space-y-4">
          <p>
            Di benangbaju, kami berupaya memberikan keunggulan dari desain hingga pengiriman.
            Berikut panduan kami untuk memastikan pengalaman berbelanja yang transparan dan aman.
          </p>

          <section className="pt-6">
            <h2 className="text-base font-medium uppercase tracking-[0.15em] mb-4 text-brand-softblack border-b border-brand-softblack/10 pb-2">
              1. Kebijakan Pengiriman
            </h2>
            <ul className="list-none space-y-3 ml-2">
              <li className="flex gap-2">
                <span className="text-brand-green">—</span>
                <span><strong>Pemrosesan:</strong> Setelah konfirmasi pembayaran, pesanan Anda disiapkan untuk pengiriman dalam 1–2 hari kerja.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-brand-green">—</span>
                <span><strong>Waktu Pengiriman:</strong> Waktu pengiriman bervariasi sesuai wilayah dan metode pengiriman yang dipilih saat checkout. Periode dihitung dari tanggal posting produk.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-brand-green">—</span>
                <span><strong>Pelacakan:</strong> Anda akan menerima nomor resi via email untuk memantau setiap langkah perjalanan pesanan Anda.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-brand-green">—</span>
                <span><strong>Gratis Ongkir:</strong> Nikmati gratis ongkos kirim untuk pembelian di atas Rp 300.000 ke seluruh Indonesia.</span>
              </li>
            </ul>
          </section>

          <section className="pt-6">
            <h2 className="text-base font-medium uppercase tracking-[0.15em] mb-4 text-brand-softblack border-b border-brand-softblack/10 pb-2">
              2. Hak Pengembalian
            </h2>
            <p className="mb-3">
              Sesuai Undang-Undang Perlindungan Konsumen, Anda berhak membatalkan pembelian
              hingga 7 (tujuh) hari kalender setelah penerimaan.
            </p>

            <div className="bg-brand-champagne/40 p-5 border-l-2 border-brand-green my-6">
              <p className="font-medium mb-2 text-brand-softblack text-xs uppercase tracking-[0.15em]">
                Syarat Pengembalian:
              </p>
              <p>
                Pengembalian hanya diterima jika produk dalam kondisi sempurna — label masih
                terpasang, belum dipakai, dan dalam kemasan original. Produk yang sudah digunakan
                atau labelnya dilepas tidak dapat dikembalikan demi kualitas dan higienitas produk.
              </p>
            </div>
          </section>

          <section className="pt-6">
            <h2 className="text-base font-medium uppercase tracking-[0.15em] mb-4 text-brand-softblack border-b border-brand-softblack/10 pb-2">
              3. Penukaran karena Cacat atau Kerusakan
            </h2>
            <p className="mb-3">
              Jika produk Anda tiba dalam kondisi rusak atau terdapat cacat produksi:
            </p>
            <ul className="list-none space-y-2 ml-2">
              <li className="flex gap-2">
                <span className="text-brand-green">—</span>
                <span>
                  Kirim foto atau video produk ke{" "}
                  <a
                    href="mailto:halo@benangbaju.com"
                    className="text-brand-green hover:underline transition"
                  >
                    halo@benangbaju.com
                  </a>{" "}
                  dalam 30 hari setelah penerimaan.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-brand-green">—</span>
                <span>benangbaju akan menanggung biaya pengiriman untuk penukaran dengan item yang sama.</span>
              </li>
            </ul>
          </section>

          <section className="pt-6">
            <h2 className="text-base font-medium uppercase tracking-[0.15em] mb-4 text-brand-softblack border-b border-brand-softblack/10 pb-2">
              4. Kebijakan Pengembalian Dana
            </h2>
            <p className="mb-3">
              Pengembalian dana akan diproses setelah produk kembali ke pusat distribusi kami:
            </p>
            <ul className="list-none space-y-2 ml-2">
              <li className="flex gap-2">
                <span className="text-brand-green">—</span>
                <span><strong>Kartu Kredit:</strong> Pengembalian akan dimintakan ke operator dan mungkin muncul di 1–2 tagihan berikutnya.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-brand-green">—</span>
                <span><strong>Transfer Bank:</strong> Pengembalian dana ke rekening asal dalam 3 hari kerja.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-brand-green">—</span>
                <span><strong>Ongkos Kirim:</strong> Biaya pengiriman tidak dapat dikembalikan dalam kasus pengembalian tanpa cacat, sesuai peraturan yang berlaku.</span>
              </li>
            </ul>
          </section>

          <section className="pt-6">
            <h2 className="text-base font-medium uppercase tracking-[0.15em] mb-4 text-brand-softblack border-b border-brand-softblack/10 pb-2">
              5. Pesanan Tidak Terkirim
            </h2>
            <p>
              Jika pesanan kembali karena kesalahan alamat yang didaftarkan pelanggan atau
              upaya pengiriman yang berulang kali gagal, biaya pengiriman ulang menjadi
              tanggung jawab pembeli.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

