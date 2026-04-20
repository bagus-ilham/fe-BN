import type { Metadata } from "next";
import { getPublishedCMSPageBySlug } from "@/lib/cms-service";
import CMSBlocksRenderer from "@/components/cms/CMSBlocksRenderer";

export const metadata: Metadata = {
  title: "Kebijakan Privasi | benangbaju",
  description: "Kebijakan privasi dan perlindungan data benangbaju.",
};

export default async function PrivacidadePage() {
  const cmsPage = await getPublishedCMSPageBySlug("legal-privacy");
  
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
          Kebijakan Privasi
        </h1>
        <p className="text-brand-offwhite/50 text-xs font-light mt-3 tracking-wider">
          Berlaku mulai 1 Januari 2025
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="text-sm text-brand-softblack/70 leading-relaxed space-y-4">
          <p>
            benangbaju menghargai kepercayaan yang Anda berikan ketika berbagi
            data pribadi Anda. Kebijakan Privasi ini menjelaskan bagaimana kami
            mengumpulkan, menggunakan, menyimpan, dan melindungi informasi Anda,
            sesuai dengan Undang-Undang Perlindungan Data Pribadi (UU PDP) No. 27 Tahun 2022.
          </p>

          <section className="pt-6">
            <h2 className="text-base font-medium uppercase tracking-[0.15em] mb-4 text-brand-softblack border-b border-brand-softblack/10 pb-2">
              1. Pengumpulan Informasi
            </h2>
            <p className="mb-3">
              Kami mengumpulkan informasi yang diperlukan untuk memproses pesanan Anda:
            </p>
            <ul className="list-none space-y-2 ml-2">
              <li className="flex gap-2"><span className="text-brand-green">—</span><span><strong>Data Registrasi:</strong> Nama lengkap, email, nomor telepon, dan alamat pengiriman.</span></li>
              <li className="flex gap-2"><span className="text-brand-green">—</span><span><strong>Data Pembayaran:</strong> Diproses terenkripsi oleh gateway pembayaran kami. benangbaju tidak menyimpan data kartu kredit Anda.</span></li>
              <li className="flex gap-2"><span className="text-brand-green">—</span><span><strong>Data Navigasi:</strong> Cookie dan alamat IP untuk meningkatkan performa situs dan memahami preferensi belanja Anda.</span></li>
            </ul>
          </section>

          <section className="pt-6">
            <h2 className="text-base font-medium uppercase tracking-[0.15em] mb-4 text-brand-softblack border-b border-brand-softblack/10 pb-2">
              2. Tujuan Penggunaan Data
            </h2>
            <p className="mb-3">Data Anda digunakan semata-mata untuk:</p>
            <ul className="list-none space-y-2 ml-2">
              <li className="flex gap-2"><span className="text-brand-green">—</span><span>Memproses dan mengirimkan pesanan benangbaju Anda.</span></li>
              <li className="flex gap-2"><span className="text-brand-green">—</span><span>Mengirim komunikasi tentang status pembelian Anda.</span></li>
              <li className="flex gap-2"><span className="text-brand-green">—</span><span>Melakukan aktivitas pemasaran dan berita brand (hanya dengan persetujuan Anda).</span></li>
              <li className="flex gap-2"><span className="text-brand-green">—</span><span>Memastikan keamanan situs dan mencegah penipuan.</span></li>
            </ul>
          </section>

          <section className="pt-6">
            <h2 className="text-base font-medium uppercase tracking-[0.15em] mb-4 text-brand-softblack border-b border-brand-softblack/10 pb-2">
              3. Berbagi Data
            </h2>
            <p className="mb-3">
              benangbaju tidak menjual atau menyewakan data pribadi Anda. Kami berbagi
              informasi dengan pihak ketiga hanya bila benar-benar diperlukan untuk operasional:
            </p>
            <ul className="list-none space-y-2 ml-2">
              <li className="flex gap-2"><span className="text-brand-green">—</span><span><strong>Gateway Pembayaran:</strong> Untuk memproses transaksi keuangan.</span></li>
              <li className="flex gap-2"><span className="text-brand-green">—</span><span><strong>Jasa Pengiriman:</strong> Untuk memastikan produk tiba di alamat yang tepat.</span></li>
              <li className="flex gap-2"><span className="text-brand-green">—</span><span><strong>Otoritas Hukum:</strong> Jika ada permintaan pengadilan atau kewajiban yang diatur undang-undang.</span></li>
            </ul>
          </section>

          <section className="pt-6">
            <h2 className="text-base font-medium uppercase tracking-[0.15em] mb-4 text-brand-softblack border-b border-brand-softblack/10 pb-2">
              4. Keamanan Informasi
            </h2>
            <p>
              Kami menerapkan langkah-langkah keamanan teknis dan organisasional,
              seperti protokol SSL (Secure Socket Layer), untuk memastikan data Anda
              ditransmisikan dengan aman dan terlindungi dari akses yang tidak sah.
            </p>
          </section>

          <section className="pt-6">
            <h2 className="text-base font-medium uppercase tracking-[0.15em] mb-4 text-brand-softblack border-b border-brand-softblack/10 pb-2">
              5. Hak Anda (UU PDP)
            </h2>
            <p className="mb-3">Anda sebagai subjek data berhak untuk, kapan saja:</p>
            <ul className="list-none space-y-2 ml-2">
              <li className="flex gap-2"><span className="text-brand-green">—</span><span>Mengonfirmasi keberadaan pemrosesan dan mengakses data Anda.</span></li>
              <li className="flex gap-2"><span className="text-brand-green">—</span><span>Meminta koreksi data yang tidak lengkap atau sudah kedaluwarsa.</span></li>
              <li className="flex gap-2"><span className="text-brand-green">—</span><span>Mencabut persetujuan untuk komunikasi pemasaran.</span></li>
              <li className="flex gap-2"><span className="text-brand-green">—</span><span>Meminta penghapusan data Anda dari database kami (kecuali saat penyimpanan diwajibkan oleh hukum).</span></li>
            </ul>
          </section>

          <section className="pt-6">
            <h2 className="text-base font-medium uppercase tracking-[0.15em] mb-4 text-brand-softblack border-b border-brand-softblack/10 pb-2">
              6. Penggunaan Cookie
            </h2>
            <p>
              Kami menggunakan cookie untuk mempersonalisasi pengalaman Anda. Anda dapat
              menonaktifkan cookie di pengaturan browser, meskipun hal ini mungkin
              memengaruhi beberapa fungsionalitas website benangbaju.
            </p>
          </section>

          <section className="pt-6">
            <h2 className="text-base font-medium uppercase tracking-[0.15em] mb-4 text-brand-softblack border-b border-brand-softblack/10 pb-2">
              7. Perubahan Kebijakan
            </h2>
            <p>
              benangbaju berhak memperbarui Kebijakan Privasi ini sesuai kebutuhan
              untuk mencerminkan perubahan dalam praktik kami atau alasan hukum.
              Kami menyarankan untuk membaca dokumen ini secara berkala.
            </p>
          </section>

          <section className="pt-6">
            <h2 className="text-base font-medium uppercase tracking-[0.15em] mb-4 text-brand-softblack border-b border-brand-softblack/10 pb-2">
              8. Kontak & Pejabat Data
            </h2>
            <p>
              Untuk pertanyaan tentang pemrosesan data Anda, silakan hubungi
              tim kami melalui email:{" "}
              <a href="mailto:halo@benangbaju.com" className="text-brand-green hover:underline transition">
                halo@benangbaju.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

