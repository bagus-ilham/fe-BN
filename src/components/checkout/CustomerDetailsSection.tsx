"use client";

import type { AddressData } from "@/utils/validation";

const ESTADOS = [
  "Aceh", "Bali", "Banten", "Bengkulu", "DI Yogyakarta", "DKI Jakarta", "Gorontalo", "Jambi", "Jawa Barat", "Jawa Tengah", "Jawa Timur", "Kalimantan Barat", "Kalimantan Selatan", "Kalimantan Tengah", "Kalimantan Timur", "Kalimantan Utara", "Kepulauan Bangka Belitung", "Kepulauan Riau", "Lampung", "Maluku", "Maluku Utara", "Nusa Tenggara Barat", "Nusa Tenggara Timur", "Papua", "Papua Barat", "Papua Barat Daya", "Papua Pegunungan", "Papua Selatan", "Papua Tengah", "Riau", "Sulawesi Barat", "Sulawesi Selatan", "Sulawesi Tengah", "Sulawesi Tenggara", "Sulawesi Utara", "Sumatera Barat", "Sumatera Selatan", "Sumatera Utara"
];

interface CustomerDetailsSectionProps {
  // Nilai
  email: string;
  fullName: string;
  phone: string;
  address: AddressData;
  initialEmail?: string;
  isLoadingZIP: boolean;
  errors: Record<string, string>;
  // Handlers
  setEmail: (v: string) => void;
  setFullName: (v: string) => void;
  handlePhoneChange: (v: string) => void;
  handleZIPChange: (v: string) => void;
  handleZIPBlur: () => void;
  validateField: (field: string, value: string | AddressData) => void;
  touchField: (field: string) => void;
  updateAddressField: (field: keyof AddressData, value: string, currentAddress: AddressData) => void;
  setAddress: React.Dispatch<React.SetStateAction<AddressData>>;
  touched: Record<string, boolean>;
  // Kelas dasar input
  inputBase: string;
  inputOk: string;
  inputErr: string;
  // Callback opsional
  onEmailBlur?: (email: string) => void;
  onPhoneBlur?: (phone: string) => void;
}

export default function CustomerDetailsSection({
  email,
  fullName,
  phone,
  address,
  initialEmail,
  isLoadingZIP,
  errors,
  setEmail,
  setFullName,
  handlePhoneChange,
  handleZIPChange,
  handleZIPBlur,
  validateField,
  touchField,
  updateAddressField,
  setAddress,
  inputBase: base,
  inputOk: ok,
  inputErr: err,
  onEmailBlur,
  onPhoneBlur,
}: CustomerDetailsSectionProps) {
  return (
    <>
      {/* Kontak & Informasi Diri */}
      <div className="p-5 md:p-6 border border-gray-100 bg-white rounded-sm">
        <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-brand-softblack/70 mb-6">
          Informasi Kontak
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* E-mail */}
          <div>
            <label className="text-[10px] uppercase tracking-widest block mb-3 opacity-70 font-medium text-brand-softblack">
              Email <span className="text-red-500">*</span>
            </label>
            {initialEmail ? (
              <input
                type="email"
                value={initialEmail}
                disabled
                className={`${base} border-gray-200 text-brand-softblack/60 cursor-not-allowed`}
              />
            ) : (
              <>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => {
                    touchField("email");
                    validateField("email", email);
                    onEmailBlur?.(email);
                  }}
                  placeholder="email@anda.com"
                  className={`${base} ${errors.email ? err : ok}`}
                />
                {errors.email && (
                  <p className="text-[10px] text-red-500 mt-2">{errors.email}</p>
                )}
              </>
            )}
          </div>

          {/* Nama lengkap */}
          <div>
            <label className="text-[10px] uppercase tracking-widest block mb-3 opacity-70 font-medium text-brand-softblack">
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              onBlur={() => {
                touchField("fullName");
                validateField("fullName", fullName);
              }}
              placeholder="Nama depan dan belakang"
              className={`${base} ${errors.fullName ? err : ok}`}
            />
            {errors.fullName && (
              <p className="text-[10px] text-red-500 mt-2">{errors.fullName}</p>
            )}
          </div>

          {/* Nomor Telepon */}
          <div className="md:col-span-2">
            <label className="text-[10px] uppercase tracking-widest block mb-3 opacity-70 font-medium text-brand-softblack">
              Nomor WhatsApp <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              onBlur={() => {
                touchField("phone");
                validateField("phone", phone);
                onPhoneBlur?.(phone);
              }}
              placeholder="0812-XXXX-XXXX"
              maxLength={15}
              className={`${base} ${errors.phone ? err : ok}`}
            />
            {errors.phone && (
              <p className="text-[10px] text-red-500 mt-2">{errors.phone}</p>
            )}
          </div>
        </div>
      </div>

      {/* Alamat pengiriman */}
      <div className="p-5 md:p-6 border border-gray-100 bg-white rounded-sm">
        <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-brand-softblack/70 mb-6">
          Alamat Pengiriman
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* ZIP / Kode Pos */}
          <div>
            <label className="text-[10px] uppercase tracking-widest block mb-3 opacity-70 font-medium text-brand-softblack">
              Kode Pos <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={address.zip}
                onChange={(e) => handleZIPChange(e.target.value)}
                onBlur={() => {
                  touchField("zip");
                  void handleZIPBlur();
                  validateField("address", address);
                }}
                placeholder="Contoh: 12930"
                maxLength={5}
                className={`${base} pr-12 ${errors.zip ? err : ok}`}
              />
              {isLoadingZIP && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-brand-green border-t-transparent" />
                </div>
              )}
            </div>
            {isLoadingZIP && (
              <p className="text-[10px] text-brand-softblack/70 mt-2">
                Mencari alamat...
              </p>
            )}
            {errors.zip && (
              <p className="text-[10px] text-red-500 mt-2">{errors.zip}</p>
            )}
          </div>

          {/* Rua */}
          <div>
            <label className="text-[10px] uppercase tracking-widest block mb-3 opacity-70 font-medium text-brand-softblack">
              Nama Jalan / Perumahan <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={address.street}
              onChange={(e) => updateAddressField("street", e.target.value, address)}
              onBlur={() => {
                touchField("street");
                validateField("address", address);
              }}
              placeholder="Nama jalan, blok, atau kompleks"
              className={`${base} ${errors.street ? err : ok}`}
            />
            {errors.street && (
              <p className="text-[10px] text-red-500 mt-2">{errors.street}</p>
            )}
          </div>

          {/* Número */}
          <div>
            <label className="text-[10px] uppercase tracking-widest block mb-3 opacity-70 font-medium text-brand-softblack">
              Nomor Rumah <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={address.number}
              onChange={(e) => updateAddressField("number", e.target.value, address)}
              onBlur={() => {
                touchField("number");
                validateField("address", address);
              }}
              placeholder="Contoh: 12B"
              className={`${base} ${errors.number ? err : ok}`}
            />
            {errors.number && (
              <p className="text-[10px] text-red-500 mt-2">{errors.number}</p>
            )}
          </div>

          {/* Complemento */}
          <div>
            <label className="text-[10px] uppercase tracking-widest block mb-3 opacity-70 font-medium text-brand-softblack">
              Patokan / Informasi Tambahan{" "}
              <span className="font-normal text-brand-softblack/50">(opsional)</span>
            </label>
            <input
              type="text"
              value={address.complement}
              onChange={(e) =>
                setAddress((prev) => ({ ...prev, complement: e.target.value }))
              }
              placeholder="Contoh: Dekat masjid, warna cat biru"
              className={`${base} ${ok}`}
            />
          </div>

          {/* Bairro */}
          <div>
            <label className="text-[10px] uppercase tracking-widest block mb-3 opacity-70 font-medium text-brand-softblack">
              Kecamatan / Kelurahan <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={address.neighborhood}
              onChange={(e) =>
                updateAddressField("neighborhood", e.target.value, address)
              }
              onBlur={() => {
                touchField("neighborhood");
                validateField("address", address);
              }}
              placeholder="Masukkan kecamatan/kelurahan"
              className={`${base} ${errors.neighborhood ? err : ok}`}
            />
            {errors.neighborhood && (
              <p className="text-[10px] text-red-500 mt-2">
                {errors.neighborhood}
              </p>
            )}
          </div>

          {/* Cidade */}
          <div>
            <label className="text-[10px] uppercase tracking-widest block mb-3 opacity-70 font-medium text-brand-softblack">
              Kota / Kabupaten <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={address.city}
              onChange={(e) => updateAddressField("city", e.target.value, address)}
              onBlur={() => {
                touchField("city");
                validateField("address", address);
              }}
              placeholder="Masukkan kota/kabupaten"
              className={`${base} ${errors.city ? err : ok}`}
            />
            {errors.city && (
              <p className="text-[10px] text-red-500 mt-2">{errors.city}</p>
            )}
          </div>

          {/* Estado */}
          <div>
            <label className="text-[10px] uppercase tracking-widest block mb-3 opacity-70 font-medium text-brand-softblack">
              Provinsi <span className="text-red-500">*</span>
            </label>
            <select
              value={address.state}
              onChange={(e) => updateAddressField("state", e.target.value, address)}
              onBlur={() => {
                touchField("state");
                validateField("address", address);
              }}
              className={`${base} ${errors.state ? err : ok}`}
            >
              <option value="">Pilih Provinsi</option>
              {ESTADOS.map((uf) => (
                <option key={uf} value={uf}>
                  {uf}
                </option>
              ))}
            </select>
            {errors.state && (
              <p className="text-[10px] text-red-500 mt-2">{errors.state}</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
