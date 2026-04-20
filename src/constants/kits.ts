/** Dress Batik Modern product ID (prod_1) — referensi untuk integrasi. */
export const GLOW_PRODUCT_ID = "prod_1";

export interface Kit {
  id: string;
  name: string;
  price: number;
  oldPrice?: number; // Harga individual (tanpa diskon)
  products: string[]; // ID produk yang termasuk dalam set
  description: string; // Frasa pendukung (singkat)
  badge?: "kit" | "protocol";
  image?: string; // URL gambar kit (opsional)
  longDescription?: string;
  benefits?: string[];
  howToUse?: string;
  content?: {
    hero?: {
      title?: string;
      subtitle?: string;
      description?: string;
    };
    about?: {
      title?: string;
      paragraphs?: string[];
    };
    products?: {
      title?: string;
      description?: string;
    };
    benefits?: {
      title?: string;
      items?: Array<{
        title: string;
        description: string;
      }>;
    };
    usage?: {
      title?: string;
      instructions?: string[];
    };
    faq?: Array<{
      question: string;
      answer: string;
    }>;
  };
}

const kitsData = [
  {
    id: "kit_1",
    name: "Koleksi Lengkap benangbaju",
    products: ["prod_1", "prod_2", "prod_3", "prod_4", "prod_5"],
    description: "Semua keindahan koleksi benangbaju dalam satu paket hemat.",
    badge: "kit" as const,
    price: 1099000,
    oldPrice: 1375000,
    image: "/images/products/batik-dress.png",
    longDescription:
      "Paket lengkap yang menggabungkan seluruh koleksi benangbaju. Dari atasan elegan hingga bawahan serbaguna, semua yang Anda butuhkan untuk tampil percaya diri setiap hari.",
    content: {
      hero: {
        subtitle: "Gaya 360°",
        description:
          "Paket lengkap yang menggabungkan seluruh koleksi benangbaju.",
      },
      about: {
        title: "Tentang Koleksi Lengkap",
        paragraphs: [
          "Koleksi Lengkap benangbaju adalah paket yang menyatukan semua produk pilihan kami dalam satu penawaran eksklusif.",
          "Kombinasi strategis ini memadukan lima item esensial, masing-masing dengan fungsi dan estetikanya sendiri, bekerja bersama untuk memberikan kebebasan berpakaian yang total.",
        ],
      },
      products: {
        title: "Produk yang Termasuk",
        description:
          "Lima produk pilihan yang bekerja bersama untuk pilihan gaya sepanjang hari.",
      },
      benefits: {
        title: "Keunggulan Setiap Produk",
        items: [
          {
            title: "Atasan Linen Elegan",
            description:
              "Linen premium impor yang breathable dan ringan, sempurna untuk aktivitas harian yang padat.",
          },
          {
            title: "Dress Midi Batik Modern",
            description:
              "Batik kontemporer dalam potongan A-line yang flattering untuk berbagai bentuk tubuh.",
          },
          {
            title: "Blouse Katun Combed",
            description:
              "Katun combed 30s yang lembut di kulit, mudah dirawat, dan serbaguna untuk berbagai kesempatan.",
          },
          {
            title: "Rok Plisket Midi",
            description:
              "Plisket premium anti-kusut dengan siluet feminin yang mengalir dan elegan.",
          },
          {
            title: "Celana Kulot Linen",
            description:
              "Kulot linen dengan sirkulasi udara yang baik, nyaman seharian dan mudah dipadukan.",
          },
        ],
      },
    },
  },
  {
    id: "kit_2",
    name: "Set Kasual Harian",
    products: ["prod_2", "prod_4", "prod_5"], // Atasan Linen + Blouse + Kulot
    description: "Kombinasi sempurna untuk tampil santai tapi tetap stylish.",
    badge: "kit" as const,
    price: 629000,
    oldPrice: 787000,
    image: "/images/products/linen-atasan.png",
    longDescription:
      "Paket kasual harian yang memadukan kenyamanan dan gaya. Ideal untuk aktivitas sehari-hari yang membutuhkan tampilan rileks namun tetap rapi.",
    content: {
      hero: {
        subtitle: "Untuk Setiap Hari",
        description:
          "Kombinasi terpilih untuk tampilan kasual yang tetap stylish dan nyaman.",
      },
      about: {
        title: "Tentang Set Kasual Harian",
        paragraphs: [
          "Set Kasual Harian dirancang untuk perempuan aktif yang menginginkan tampilan yang mudah dipadukan dan nyaman dipakai seharian.",
          "Tiga item ini dipilih secara cermat agar saling melengkapi dalam berbagai kombinasi gaya.",
        ],
      },
      products: {
        title: "Produk yang Termasuk",
        description:
          "Tiga item kasual yang mudah dipadukan untuk tampilan sehari-hari.",
      },
      benefits: {
        title: "Keunggulan Setiap Produk",
        items: [
          {
            title: "Atasan Linen Elegan",
            description:
              "Bahan linen yang breathable dan ringan untuk aktivitas sepanjang hari.",
          },
          {
            title: "Blouse Katun Combed",
            description:
              "Katun combed yang lembut, mudah dirawat, dan cocok untuk berbagai kesempatan.",
          },
          {
            title: "Celana Kulot Linen",
            description:
              "Kulot nyaman dengan potongan longgar namun terstruktur untuk tampilan serbaguna.",
          },
        ],
      },
    },
  },
  {
    id: "kit_3",
    name: "Set Feminin Elegan",
    products: ["prod_1", "prod_3", "prod_4"], // Dress Batik + Rok Plisket + Blouse
    description: "Tampil anggun dan feminin untuk berbagai momen.",
    badge: "kit" as const,
    price: 859000,
    oldPrice: 1057000,
    image: "/images/products/pleated-skirt.png",
    longDescription:
      "Paket yang menonjolkan sisi feminin dan elegan Anda. Pilihan ideal untuk acara semi-formal, pertemuan keluarga, atau momen spesial.",
    content: {
      hero: {
        subtitle: "Elegan & Feminin",
        description:
          "Tiga item terpilih untuk tampilan yang anggun di berbagai kesempatan.",
      },
      about: {
        title: "Tentang Set Feminin Elegan",
        paragraphs: [
          "Set Feminin Elegan menggabungkan tiga item yang menonjolkan keanggunan alami perempuan Indonesia.",
          "Dari dress batik yang memukau hingga rok plisket yang mengalir, paket ini memberikan fleksibilitas gaya untuk berbagai momen.",
        ],
      },
      products: {
        title: "Produk yang Termasuk",
        description:
          "Tiga item feminin yang saling melengkapi untuk tampilan elegan.",
      },
      benefits: {
        title: "Keunggulan Setiap Produk",
        items: [
          {
            title: "Dress Midi Batik Modern",
            description:
              "Batik kontemporer dengan potongan A-line yang flattering untuk berbagai bentuk tubuh.",
          },
          {
            title: "Rok Plisket Midi",
            description:
              "Plisket premium anti-kusut dengan siluet mengalir yang feminin dan anggun.",
          },
          {
            title: "Blouse Katun Combed",
            description:
              "Blouse serbaguna yang mudah dipadukan dengan rok atau celana untuk tampilan berbeda.",
          },
        ],
      },
    },
  },
  {
    id: "kit_4",
    name: "Set Profesional Modern",
    products: ["prod_2", "prod_3", "prod_4"], // Atasan Linen + Rok Plisket + Blouse
    description: "Tampil profesional dan percaya diri di lingkungan kerja.",
    badge: "kit" as const,
    price: 699000,
    oldPrice: 867000,
    longDescription:
      "Paket yang dirancang untuk perempuan profesional yang menginginkan tampilan rapi dan berkarakter tanpa mengorbankan kenyamanan.",
    content: {
      hero: {
        subtitle: "Profesional & Percaya Diri",
        description:
          "Tampilan profesional lengkap yang nyaman dipakai sepanjang hari kerja.",
      },
      about: {
        title: "Tentang Set Profesional Modern",
        paragraphs: [
          "Set Profesional Modern adalah solusi gaya untuk perempuan karier yang menginginkan tampilan rapi, berwibawa, dan tetap nyaman.",
          "Tiga item ini dipilih untuk menciptakan berbagai kombinasi busana kerja yang stylish dan mudah dipadukan.",
        ],
      },
      products: {
        title: "Produk yang Termasuk",
        description:
          "Tiga item profesional yang memberikan kesan rapi dan berkarakter.",
      },
      benefits: {
        title: "Keunggulan Setiap Produk",
        items: [
          {
            title: "Atasan Linen Elegan",
            description:
              "Tampilan bersih dan rapi dengan kenyamanan linen yang breathable.",
          },
          {
            title: "Rok Plisket Midi",
            description:
              "Siluet profesional yang tetap feminin dengan bahan anti-kusut yang ideal untuk hari kerja panjang.",
          },
          {
            title: "Blouse Katun Combed",
            description:
              "Blouse yang memberikan tampilan profesional tanpa mengorbankan kenyamanan sepanjang hari.",
          },
        ],
      },
    },
  },
  {
    id: "kit_5",
    name: "Duo Atasan Favorit",
    products: ["prod_2", "prod_4"], // Atasan Linen + Blouse Katun
    description: "Dua atasan favorit untuk pilihan gaya yang mudah.",
    badge: "kit" as const,
    price: 419000,
    oldPrice: 508000,
    longDescription:
      "Set dua atasan pilihan yang saling melengkapi. Sempurna untuk memulai atau melengkapi koleksi benangbaju Anda.",
    content: {
      hero: {
        subtitle: "Dua Pilihan, Banyak Gaya",
        description:
          "Dua atasan terbaik yang mudah dipadukan dengan berbagai bawahan.",
      },
      about: {
        title: "Tentang Duo Atasan Favorit",
        paragraphs: [
          "Duo Atasan Favorit adalah paket dua atasan pilihan yang dirancang untuk saling melengkapi.",
          "Dua bahan berbeda — linen dan katun combed — memberikan variasi tekstur dan tampilan yang bisa disesuaikan dengan suasana.",
        ],
      },
      products: {
        title: "Produk yang Termasuk",
        description:
          "Dua atasan terbaik yang bekerja bersama untuk pilihan gaya harian.",
      },
      benefits: {
        title: "Keunggulan Setiap Produk",
        items: [
          {
            title: "Atasan Linen Elegan",
            description:
              "Linen premium yang ringan dan breathable untuk tampilan bersih sepanjang hari.",
          },
          {
            title: "Blouse Katun Combed",
            description:
              "Katun combed lembut yang memberikan kenyamanan maksimal di segala aktivitas.",
          },
        ],
      },
    },
  },
  {
    id: "kit_6",
    name: "Set Bawahan Serbaguna",
    products: ["prod_3", "prod_5"], // Rok Plisket + Kulot Linen
    description: "Dua bawahan premium yang mudah dipadukan dengan berbagai atasan.",
    badge: "kit" as const,
    price: 419000,
    oldPrice: 508000,
    longDescription:
      "Paket dua bawahan terpilih yang memberikan fleksibilitas gaya maksimal. Ideal untuk melengkapi lemari pakaian dengan pilihan bawahan yang serbaguna.",
    content: {
      hero: {
        subtitle: "Fleksibel & Serbaguna",
        description:
          "Dua bawahan premium yang mudah dipadukan dengan berbagai atasan di lemari Anda.",
      },
      about: {
        title: "Tentang Set Bawahan Serbaguna",
        paragraphs: [
          "Set Bawahan Serbaguna menggabungkan dua pilihan bawahan dengan karakter berbeda namun sama-sama versatile.",
          "Rok plisket yang feminin dan kulot linen yang modern bisa dipadukan dengan hampir semua atasan dalam lemari Anda.",
        ],
      },
      products: {
        title: "Produk yang Termasuk",
        description:
          "Dua bawahan serbaguna yang memperluas pilihan gaya Anda setiap hari.",
      },
      benefits: {
        title: "Keunggulan Setiap Produk",
        items: [
          {
            title: "Rok Plisket Midi",
            description:
              "Plisket anti-kusut dengan siluet feminin dan mengalir, cocok dari kantor hingga acara santai.",
          },
          {
            title: "Celana Kulot Linen",
            description:
              "Kulot linen modern yang nyaman, breathable, dan mudah dipadukan dengan berbagai atasan.",
          },
        ],
      },
    },
  },
];

export const KITS: Kit[] = kitsData;

