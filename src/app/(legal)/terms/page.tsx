import type { Metadata } from "next";
import { getPublishedCMSPageBySlug } from "@/lib/cms-service";
import CMSBlocksRenderer from "@/components/cms/CMSBlocksRenderer";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan | benangbaju",
  description: "Syarat dan ketentuan penggunaan website benangbaju.",
};

export default async function TermosPage() {
  const cmsPage = await getPublishedCMSPageBySlug("legal-terms");
  
  if (cmsPage && cmsPage.blocks.length > 0) {
    return (
      <main className="bg-brand-offwhite page-shell">
        <CMSBlocksRenderer blocks={cmsPage.blocks} />
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
          Syarat & Ketentuan
        </h1>
        <p className="text-brand-offwhite/50 text-xs font-light mt-3 tracking-wider">
          Berlaku mulai 1 Januari 2025
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="text-sm text-brand-softblack/70 leading-relaxed space-y-4">
          <p>
            Selamat datang di benangbaju. Dengan mengakses situs ini dan membeli produk kami,
            Anda menyetujui syarat yang tercantum di bawah ini. Syarat ini bertujuan untuk
            memastikan keamanan hukum kedua belah pihak dan transparansi dalam hubungan kami dengan Anda.
          </p>

          <section className="pt-6">
            <h2 className="text-base font-medium uppercase tracking-[0.15em] mb-4 text-brand-softblack border-b border-brand-softblack/10 pb-2">
              1. Objek dan Sifat Layanan
            </h2>
            <p>
              benangbaju adalah brand fashion lokal Indonesia yang berfokus pada pakaian
              berkualitas dengan desain kontemporer. Semua konten di situs ini, termasuk
              deskripsi produk dan teks informatif, memiliki tujuan memberikan informasi
              yang akurat dan transparan kepada pelanggan.
            </p>
          </section>

          <section className="pt-6">
            <h2 className="text-base font-medium uppercase tracking-[0.15em] mb-4 text-brand-softblack border-b border-brand-softblack/10 pb-2">
              2. Hak Kekayaan Intelektual
            </h2>
            <p>
              Semua konten di situs ini (teks, logo, gambar, video, dan desain) adalah
              milik eksklusif benangbaju atau mitranya. Dilarang keras untuk mereproduksi,
              menyalin, atau mengeksploitasi secara komersial materi apa pun tanpa otorisasi
              tertulis terlebih dahulu, dengan ancaman sanksi hukum yang berlaku.
            </p>
          </section>

          <section className="pt-6">
            <h2 className="text-base font-medium uppercase tracking-[0.15em] mb-4 text-brand-softblack border-b border-brand-softblack/10 pb-2">
              3. Kebijakan Pembelian dan Pembayaran
            </h2>
            <ul className="list-none space-y-3 ml-2">
              <li className="flex gap-2">
                <span className="text-brand-green">—</span>
                <span><strong>Harga:</strong> Harga yang ditampilkan berlaku pada saat tampil dan dapat berubah tanpa pemberitahuan sebelumnya (kecuali untuk pesanan yang sudah dikonfirmasi).</span>
              </li>
              <li className="flex gap-2">
                <span className="text-brand-green">—</span>
                <span><strong>Ketersediaan Stok:</strong> Konfirmasi pesanan bergantung pada ketersediaan stok. Kami akan segera menginformasikan jika ada ketidaktersediaan.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-brand-green">—</span>
                <span><strong>Pembayaran:</strong> Kami menggunakan gateway pembayaran yang aman. benangbaju tidak menyimpan data kartu kredit di server kami.</span>
              </li>
            </ul>
          </section>

          <section className="pt-6">
            <h2 className="text-base font-medium uppercase tracking-[0.15em] mb-4 text-brand-softblack border-b border-brand-softblack/10 pb-2">
              4. Kebijakan Pengiriman
            </h2>
            <p>
              Waktu pengiriman adalah estimasi yang diberikan oleh mitra kurir kami. Periode
              dihitung dari konfirmasi pembayaran. Setiap penundaan akibat masalah logistik
              eksternal akan dikomunikasikan kepada pelanggan secara proaktif.
            </p>
          </section>

          <section className="pt-6">
            <h2 className="text-base font-medium uppercase tracking-[0.15em] mb-4 text-brand-softblack border-b border-brand-softblack/10 pb-2">
              5. Hak Pengembalian dan Penukaran
            </h2>
            <p className="mb-3">Sesuai dengan Undang-Undang Perlindungan Konsumen:</p>
            <ul className="list-none space-y-2 ml-2">
              <li className="flex gap-2">
                <span className="text-brand-green">—</span>
                <span>Pelanggan memiliki waktu hingga 7 (tujuh) hari kalender setelah penerimaan untuk membatalkan pembelian, dengan syarat produk masih dalam kondisi original.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-brand-green">—</span>
                <span>Produk yang sudah dipakai atau label yang sudah dilepas tidak dapat dikembalikan demi alasan keamanan dan integritas produk.</span>
              </li>
            </ul>
          </section>

          <section className="pt-6">
            <h2 className="text-base font-medium uppercase tracking-[0.15em] mb-4 text-brand-softblack border-b border-brand-softblack/10 pb-2">
              6. Batasan Tanggung Jawab
            </h2>
            <p>
              benangbaju tidak bertanggung jawab atas penggunaan produk yang tidak sesuai dengan
              panduan perawatan yang tercantum pada label pakaian.
            </p>
          </section>

          <section className="pt-6">
            <h2 className="text-base font-medium uppercase tracking-[0.15em] mb-4 text-brand-softblack border-b border-brand-softblack/10 pb-2">
              7. Yurisdiksi
            </h2>
            <p>
              Pengadilan Negeri Jakarta Selatan dipilih untuk menyelesaikan perselisihan
              yang timbul dari syarat ini, sesuai hukum yang berlaku di Republik Indonesia.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

