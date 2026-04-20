import { CMSPage } from "@/types/database";

export const CMS_DEFAULT_SLUGS: Array<{ slug: string; title: string }> = [
  { slug: "home", title: "Beranda" },
  { slug: "about", title: "Tentang Kami" },
  { slug: "contact", title: "Kontak" },
  { slug: "legal-privacy", title: "Kebijakan Privasi" },
  { slug: "legal-terms", title: "Syarat dan Ketentuan" },
  { slug: "legal-returns", title: "Pengiriman dan Pengembalian" },
];

export const CMS_FALLBACK: Record<string, any> = {
  home: {
    slug: "home",
    title: "Beranda",
    seo_title: "benangbaju - Fashion Indonesia",
    seo_description: "Koleksi fashion Indonesia dari benangbaju.",
    blocks: [],
    is_published: false,
  },
  about: {
    slug: "about",
    title: "Tentang Kami",
    seo_title: "Tentang Kami | benangbaju",
    seo_description: "Cerita di balik benangbaju — brand fashion Indonesia yang lahir dari kecintaan pada mode dan kebanggaan terhadap perempuan Indonesia.",
    blocks: [
      {
        id: "about-hero",
        type: "hero",
        data: {
          eyebrow: "Cerita Kami",
          title: "Tentang benangbaju",
          subtitle: "Dirajut dari rasa, dihadirkan untuk perempuan Indonesia."
        }
      },
      {
        id: "about-rich-1",
        type: "rich_text",
        data: {
          content: "benangbaju lahir dari keyakinan sederhana namun kuat: setiap perempuan berhak berpakaian dengan nyaman, elegan, dan percaya diri — tanpa harus mengorbankan satu dari ketiganya.\n\nKami memulai dari rasa frustasi yang familiar: mencari pakaian bagus tapi sulit menemukan yang benar-benar pas di tubuh, sesuai dengan gaya hidup Indonesia yang dinamis. Dari sana, kami memutuskan untuk merancang sendiri.\n\nSetiap koleksi kami dirancang dengan mempertimbangkan kualitas bahan, kenyamanan pemakaian sepanjang hari, dan estetika yang timeless — bukan sekadar mengikuti tren yang lewat begitu saja."
        }
      },
      {
        id: "about-gallery",
        type: "gallery",
        data: {
          title: "Koleksi Kami",
          images: [
            { src: "https://gwnegdilmazoobpexlld.supabase.co/storage/v1/object/public/site-assets/laboratorio/laboratorio3.jpg", alt: "Koleksi benangbaju" },
            { src: "https://gwnegdilmazoobpexlld.supabase.co/storage/v1/object/public/site-assets/laboratorio/laboratorio1.jpg", alt: "Detail kain" }
          ]
        }
      },
      {
        id: "about-values",
        type: "faq",
        data: {
          title: "Nilai Kami",
          items: [
            { q: "Kualitas", a: "Setiap produk dibuat dari bahan pilihan yang telah melewati seleksi ketat — nyaman di kulit, tahan lama di waktu." },
            { q: "Ketulusan", a: "Kami merancang untuk perempuan nyata — bukan untuk foto di majalah. Kejujuran menjadi fondasi setiap keputusan." },
            { q: "Keberlanjutan", a: "Kami memilih bahan yang ramah lingkungan dan proses produksi yang bertanggung jawab." }
          ]
        }
      }
    ],
    is_published: true,
  },
  contact: {
    slug: "contact",
    title: "Layanan Pelanggan",
    seo_title: "Layanan Pelanggan | benangbaju",
    seo_description: "Hubungi tim benangbaju. Kami siap membantu pengalaman berbelanja fashion Anda.",
    blocks: [
      {
        id: "contact-hero",
        type: "hero",
        data: {
          eyebrow: "Bantuan",
          title: "Layanan Pelanggan",
          subtitle: "Kami di sini untuk memastikan pengalaman berbelanja Anda menyenangkan dari awal hingga akhir."
        }
      },
      {
        id: "contact-details",
        type: "rich_text",
        data: {
          content: "Email: halo@benangbaju.com (Balasan 1x24 jam)\nWhatsApp: (021) 5000-1234 (Senin-Jumat, 09.00-18.00)\nAlamat: Jl. Sudirman No. 123, Jakarta Selatan"
        }
      },
      {
        id: "contact-faq",
        type: "faq",
        data: {
          title: "Pertanyaan Umum",
          items: [
            { q: "Cara Pengiriman?", a: "Pengiriman dihitung otomatis saat checkout. Gratis ongkir di atas Rp 300.000." },
            { q: "Penukaran Produk?", a: "7 hari kalender setelah barang diterima." },
            { q: "Metode Pembayaran?", a: "Kartu Kredit, Transfer Bank, GoPay, OVO, Dana, dan QRIS." }
          ]
        }
      },
      {
        id: "contact-cta",
        type: "cta",
        data: {
          title: "Masih Ada Pertanyaan?",
          text: "Tim kami senang membantu Anda. Hubungi kami via email.",
          primaryLabel: "Kirim Email",
          primaryHref: "mailto:halo@benangbaju.com"
        }
      }
    ],
    is_published: true,
  },
  "legal-privacy": {
    slug: "legal-privacy",
    title: "Kebijakan Privasi",
    seo_title: "Kebijakan Privasi | benangbaju",
    seo_description: "Kebijakan privasi benangbaju.",
    blocks: [
      { id: "priv-hero", type: "hero", data: { title: "Kebijakan Privasi", subtitle: "Terakhir diperbarui: 17 April 2026" } },
      { id: "priv-txt", type: "rich_text", data: { content: "Kami sangat menjaga privasi data pelanggan kami..." } }
    ],
    is_published: true,
  },
  "legal-terms": {
    slug: "legal-terms",
    title: "Syarat dan Ketentuan",
    seo_title: "Syarat dan Ketentuan | benangbaju",
    seo_description: "Syarat dan ketentuan benangbaju.",
    blocks: [
      { id: "terms-hero", type: "hero", data: { title: "Syarat & Ketentuan", subtitle: "Aturan penggunaan layanan kami." } },
      { id: "terms-txt", type: "rich_text", data: { content: "Dengan berbelanja di benangbaju, Anda setuju dengan..." } }
    ],
    is_published: true,
  },
  "legal-returns": {
    slug: "legal-returns",
    title: "Pengiriman dan Pengembalian",
    seo_title: "Pengiriman dan Pengembalian | benangbaju",
    seo_description: "Kebijakan pengiriman dan pengembalian benangbaju.",
    blocks: [
      { id: "ret-hero", type: "hero", data: { title: "Pengiriman & Pengembalian", subtitle: "Kemudahan berbelanja tanpa khawatir." } },
      { id: "ret-txt", type: "rich_text", data: { content: "Kami menyediakan gratis ongkir dengan kupon tertentu. Penukaran produk maksimal 7 hari..." } }
    ],
    is_published: true,
  },
};

export async function listCMSPagesForAdmin(): Promise<CMSPage[]> {
  const pages: CMSPage[] = [];
  
  for (const item of CMS_DEFAULT_SLUGS) {
    const fallback = CMS_FALLBACK[item.slug];
    pages.push({
      id: `mock-${item.slug}`,
      slug: item.slug,
      title: item.title,
      seo_title: fallback?.seo_title ?? null,
      seo_description: fallback?.seo_description ?? null,
      blocks: fallback?.blocks ?? [],
      is_published: fallback?.is_published ?? false,
      updated_by: null,
      created_at: new Date(0).toISOString(),
      updated_at: new Date(0).toISOString(),
    });
  }

  return pages.sort((a, b) => a.slug.localeCompare(b.slug));
}

export async function getCMSPageBySlugForAdmin(slug: string): Promise<CMSPage | null> {
  const fallback = CMS_FALLBACK[slug];
  if (!fallback) return null;
  
  return {
    id: `mock-${slug}`,
    slug,
    title: fallback.title,
    seo_title: fallback.seo_title ?? null,
    seo_description: fallback.seo_description ?? null,
    blocks: fallback.blocks ?? [],
    is_published: fallback.is_published ?? false,
    updated_by: null,
    created_at: new Date(0).toISOString(),
    updated_at: new Date(0).toISOString(),
  };
}

export async function listCMSPageVersionsForAdmin(slug: string): Promise<any[]> {
  return []; // Mock: no versions for clean start
}

export async function getPublishedCMSPageBySlug(slug: string): Promise<CMSPage | null> {
  const fallback = CMS_FALLBACK[slug];
  if (!fallback) return null;
  
  return {
    id: `mock-pub-${slug}`,
    slug,
    title: fallback.title,
    seo_title: fallback.seo_title ?? null,
    seo_description: fallback.seo_description ?? null,
    blocks: fallback.blocks ?? [],
    is_published: true,
    updated_by: null,
    created_at: new Date(0).toISOString(),
    updated_at: new Date(0).toISOString(),
  };
}
