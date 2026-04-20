'use client';
import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Lock, Camera, ArrowLeft, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Skeleton from '@/components/ui/Skeleton';
import { useCart } from '@/context/CartContext';
import ProfileSidebar from '@/components/profile/ProfileSidebar';
import ProfileDashboard from '@/components/profile/ProfileDashboard';
import Link from 'next/link';
import { Mail, Phone, MapPin, Trash2, Edit3, CheckCircle2, Truck, Plus } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useCart();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState("dashboard");
  const [profile, setProfile] = useState({
    full_name: 'Mock User',
    avatar_url: '',
    email: 'mock@example.com',
  });

  const [fullNameError, setFullNameError] = useState<string | null>(null);
  const [passwordSection, setPasswordSection] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  useEffect(() => {
    // Simulate API fetch
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const getInitials = useCallback((name: string): string => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }, []);

  const handleAvatarUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Silakan pilih gambar yang valid');
      return;
    }

    setUploadingAvatar(true);
    setTimeout(() => {
      showToast('Foto profil berhasil diperbarui');
      setUploadingAvatar(false);
    }, 1500);
  }, [showToast]);

  const handleUpdate = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile.full_name.trim()) {
      setFullNameError('Nama lengkap wajib diisi');
      return;
    }

    setUpdating(true);
    setTimeout(() => {
      showToast('Profil berhasil diperbarui');
      setUpdating(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 1000);
  }, [profile.full_name, showToast]);

  const handleLogout = useCallback(() => {
    showToast("Berhasil keluar.");
    router.push('/');
  }, [router, showToast]);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-offwhite py-32 px-4 md:px-6">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12">
          <Skeleton className="w-full lg:w-80 h-[600px]" />
          <div className="flex-1 space-y-8">
            <Skeleton className="h-12 w-64" />
            <div className="grid grid-cols-3 gap-6">
              <Skeleton className="h-40" />
              <Skeleton className="h-40" />
              <Skeleton className="h-40" />
            </div>
            <Skeleton className="h-[400px] w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-brand-offwhite pt-32 pb-24 px-4 md:px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">

        {/* Breadcrumb/Back */}
        <div className="mb-10">
          <Link href="/" className="group flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-brand-softblack/40 hover:text-brand-gold transition-colors">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Kembali ke Beranda
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* SIDEBAR */}
          <ProfileSidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            user={{ name: profile.full_name, email: profile.email, avatar: profile.avatar_url }}
            onLogout={handleLogout}
          />

          <div className="flex-1 w-full min-h-[600px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                {activeTab === "dashboard" && (
                  <ProfileDashboard user={{ name: profile.full_name }} />
                )}

                {activeTab === "account" && (
                  <div className="space-y-12">
                    <div className="surface-card p-10 md:p-14 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/[0.02] rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                      
                      <div className="relative z-10">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
                          <div>
                            <h3 className="text-sm uppercase tracking-[0.4em] font-bold text-brand-softblack mb-2">Informasi Profil</h3>
                            <p className="text-[10px] text-brand-softblack/40 uppercase tracking-widest">Perbarui detail identitas dan foto profil Anda</p>
                          </div>
                          {success && (
                            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="px-6 py-2 bg-emerald-50 text-emerald-600 text-[10px] uppercase tracking-widest font-bold border border-emerald-100 rounded-full">
                              Disimpan
                            </motion.div>
                          )}
                        </div>

                        <form onSubmit={handleUpdate} className="space-y-16">
                          <div className="flex flex-col md:flex-row items-center gap-12 pb-16 border-b border-stone-50">
                            <div className="relative group cursor-pointer">
                              <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-brand-gold/20 to-transparent">
                                <div className="w-full h-full rounded-full bg-stone-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-xl">
                                  {profile.avatar_url ? (
                                    <Image src={profile.avatar_url} alt="Profile" fill className="object-cover" />
                                  ) : (
                                    <span className="text-4xl font-light text-brand-softblack/20 font-serif italic">{getInitials(profile.full_name)}</span>
                                  )}
                                </div>
                              </div>
                              <button 
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute inset-1 bg-brand-softblack/40 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-full backdrop-blur-[2px]"
                              >
                                <Camera size={24} strokeWidth={1.5} />
                                <span className="text-[8px] uppercase tracking-widest mt-2 font-bold">Ubah</span>
                              </button>
                              <input type="file" ref={fileInputRef} onChange={handleAvatarUpload} className="hidden" accept="image/*" />
                            </div>
                            
                            <div className="text-center md:text-left space-y-2">
                              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-softblack">Foto Profil</p>
                              <p className="text-[10px] text-brand-softblack/40 leading-relaxed max-w-xs">
                                Gunakan gambar berkualitas tinggi (JPG/PNG). <br/>Maksimal ukuran file 2MB.
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
                            <div className="space-y-4 relative group">
                              <label className="text-[10px] uppercase tracking-[0.3em] text-brand-gold font-bold">Nama Lengkap</label>
                              <input 
                                type="text" 
                                value={profile.full_name} 
                                onChange={(e) => setProfile({...profile, full_name: e.target.value})}
                                className="w-full bg-transparent border-b border-stone-100 py-4 text-sm text-brand-softblack focus:border-brand-gold outline-none transition-all duration-500 font-light tracking-wide" 
                              />
                              <div className="absolute bottom-0 left-0 h-0.5 bg-brand-gold w-0 group-focus-within:w-full transition-all duration-700" />
                            </div>

                            <div className="space-y-4 opacity-60">
                              <label className="text-[10px] uppercase tracking-[0.3em] text-brand-softblack/40 font-bold flex items-center gap-2">
                                <Lock size={12} />
                                Alamat Email
                              </label>
                              <input 
                                type="email" 
                                value={profile.email} 
                                disabled 
                                className="w-full bg-transparent border-b border-stone-100 py-4 text-sm text-brand-softblack cursor-not-allowed font-light" 
                              />
                            </div>
                          </div>

                          <div className="pt-8">
                            <button 
                              type="submit" 
                              disabled={updating}
                              className="px-14 py-5 bg-brand-softblack text-brand-offwhite text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-brand-gold transition-all duration-500 disabled:opacity-50 relative overflow-hidden group shadow-lg shadow-brand-softblack/5"
                            >
                              <div className="absolute inset-0 bg-white/5 -translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
                              <span className="relative z-10">{updating ? "Menyimpan..." : "Simpan Perubahan"}</span>
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>

                    <div className="surface-card p-10 md:p-14 border-l-4 border-l-brand-gold relative overflow-hidden">
                      <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-brand-gold/5 rounded-full blur-2xl" />
                      
                      <div className="relative z-10 space-y-8">
                        <div>
                          <h3 className="text-sm uppercase tracking-[0.4em] font-bold text-brand-softblack mb-2">Keamanan Akun</h3>
                          <p className="text-[10px] text-brand-softblack/40 uppercase tracking-widest">Kelola autentikasi dan akses akun Anda</p>
                        </div>

                        {!passwordSection ? (
                          <div className="flex items-center justify-between p-8 bg-stone-50/50 border border-stone-100/50">
                            <div>
                              <p className="text-[11px] text-brand-softblack/60 font-medium mb-1">Kata Sandi Akun</p>
                              <p className="text-[9px] uppercase tracking-widest text-brand-softblack/30">Terakhir diubah 3 bulan lalu</p>
                            </div>
                            <button onClick={() => setPasswordSection(true)} className="px-6 py-3 bg-white border border-stone-200 text-[9px] uppercase tracking-widest text-brand-softblack font-bold hover:border-brand-gold hover:text-brand-gold transition-all duration-300">
                              Ubah Sandi
                            </button>
                          </div>
                        ) : (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }} 
                            animate={{ opacity: 1, height: 'auto' }} 
                            className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500 overflow-hidden"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-4">
                                  <label className="text-[10px] uppercase tracking-[0.3em] text-brand-gold font-bold">Kata Sandi Baru</label>
                                  <input type="password" placeholder="••••••••" className="w-full bg-transparent border-b border-stone-100 py-4 text-xs outline-none focus:border-brand-gold transition-all" />
                                </div>
                                <div className="space-y-4">
                                  <label className="text-[10px] uppercase tracking-[0.3em] text-brand-gold font-bold">Konfirmasi Sandi</label>
                                  <input type="password" placeholder="••••••••" className="w-full bg-transparent border-b border-stone-100 py-4 text-xs outline-none focus:border-brand-gold transition-all" />
                                </div>
                            </div>
                            <div className="flex gap-6">
                                <button className="px-10 py-4 bg-brand-gold text-white text-[9px] uppercase tracking-[0.4em] font-bold hover:shadow-lg transition-all">
                                  Konfirmasi
                                </button>
                                <button onClick={() => setPasswordSection(false)} className="px-10 py-4 text-[9px] uppercase tracking-[0.4em] font-bold text-brand-softblack/40 hover:text-brand-softblack transition-colors">
                                  Batal
                                </button>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </div>
                )}


                {activeTab === "orders" && (
                  <div className="space-y-8">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm uppercase tracking-[0.4em] font-bold text-brand-softblack mb-2">Riwayat Pesanan</h3>
                        <p className="text-[10px] text-brand-softblack/40 uppercase tracking-widest">Pantau status dan detail belanja Anda</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {[
                        { id: "#BB-9921", date: "12 April 2024", status: "Sedang Dikirim", total: "Rp 850.000", items: [
                          { name: "Sutra Dress Emerald", price: "Rp 450.000", image: "https://thenblank.com/cdn/shop/files/70A2411_800x.jpg?v=1712818241" },
                          { name: "Pashmina Silk Cream", price: "Rp 250.000", image: "https://thenblank.com/cdn/shop/files/70A2312_800x.jpg?v=1712818241" },
                          { name: "Gold Brooch", price: "Rp 150.000", image: "https://thenblank.com/cdn/shop/files/70A2215_800x.jpg?v=1712818241" }
                        ]},
                        { id: "#BB-9845", date: "28 Maret 2024", status: "Selesai", total: "Rp 1.250.000", items: [
                          { name: "Luxury Abaya Black", price: "Rp 1.250.000", image: "https://thenblank.com/cdn/shop/files/70A2111_800x.jpg?v=1712818241" }
                        ]},
                      ].map((order, idx) => (
                        <motion.div 
                          key={order.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="surface-card overflow-hidden group border-stone-100 hover:border-brand-gold/30 transition-all duration-500"
                        >
                          <div className="bg-stone-50/50 p-6 flex flex-wrap items-center justify-between gap-4 border-b border-stone-100">
                            <div className="flex items-center gap-8">
                              <div>
                                <p className="text-[9px] uppercase tracking-widest text-brand-softblack/40 mb-1">ID Pesanan</p>
                                <p className="text-sm font-bold text-brand-softblack">{order.id}</p>
                              </div>
                              <div className="w-px h-8 bg-stone-200 hidden md:block" />
                              <div>
                                <p className="text-[9px] uppercase tracking-widest text-brand-softblack/40 mb-1">Tanggal</p>
                                <p className="text-xs font-medium text-brand-softblack">{order.date}</p>
                              </div>
                              <div className="w-px h-8 bg-stone-200 hidden md:block" />
                              <div>
                                <p className="text-[9px] uppercase tracking-widest text-brand-softblack/40 mb-1">Status</p>
                                <div className="flex items-center gap-2">
                                  {order.status === 'Selesai' ? (
                                    <CheckCircle2 size={12} className="text-emerald-500" />
                                  ) : (
                                    <Truck size={12} className="text-brand-gold animate-pulse" />
                                  )}
                                  <span className={`text-[10px] uppercase tracking-widest font-bold ${order.status === 'Selesai' ? 'text-emerald-500' : 'text-brand-gold'}`}>
                                    {order.status}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-[9px] uppercase tracking-widest text-brand-softblack/40 mb-1">Total</p>
                              <p className="text-sm font-bold text-brand-gold">{order.total}</p>
                            </div>
                          </div>
                          
                          <div className="p-6 space-y-6">
                            {order.items.map((item, i) => (
                              <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <div className="w-16 h-20 bg-stone-100 relative overflow-hidden flex-shrink-0">
                                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                                  </div>
                                  <div>
                                    <p className="text-xs font-medium text-brand-softblack uppercase tracking-wider">{item.name}</p>
                                    <p className="text-[10px] text-brand-softblack/40 mt-1">QTY: 1 • {item.price}</p>
                                  </div>
                                </div>
                                <button className="px-6 py-2 border border-stone-100 text-[9px] uppercase tracking-widest text-brand-softblack/60 hover:border-brand-gold hover:text-brand-gold transition-colors">
                                  Review
                                </button>
                              </div>
                            ))}
                          </div>

                          <div className="bg-stone-50/30 p-4 flex justify-end gap-4 border-t border-stone-100">
                             <button className="text-[9px] uppercase tracking-widest font-bold text-brand-softblack/40 hover:text-brand-softblack transition-colors">
                               Detail Pesanan
                             </button>
                             <button className="text-[9px] uppercase tracking-widest font-bold text-brand-gold hover:opacity-70 transition-colors">
                               Beli Lagi
                             </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "address" && (
                  <div className="space-y-8">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm uppercase tracking-[0.4em] font-bold text-brand-softblack mb-2">Alamat Pengiriman</h3>
                        <p className="text-[10px] text-brand-softblack/40 uppercase tracking-widest">Kelola lokasi pengiriman pesanan Anda</p>
                      </div>
                      <button className="flex items-center gap-2 px-6 py-3 bg-brand-softblack text-brand-offwhite text-[9px] uppercase tracking-widest font-bold hover:bg-brand-gold transition-colors shadow-lg">
                        <Plus size={14} />
                        Tambah Alamat
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {[
                        { type: 'Rumah Utama', name: 'Mock User', phone: '+62 812 3456 7890', address: 'Jl. Kemang Raya No. 12, Mampang Prapatan, Jakarta Selatan, 12730', isDefault: true },
                        { type: 'Kantor', name: 'Mock User', phone: '+62 812 3456 7890', address: 'SCBD District 8, Treasury Tower Lt. 15, Senayan, Jakarta Selatan, 12190', isDefault: false },
                      ].map((addr, idx) => (
                        <motion.div 
                          key={idx}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.1 }}
                          className={`surface-card p-8 relative group transition-all duration-500 ${addr.isDefault ? 'border-brand-gold/30 ring-1 ring-brand-gold/5' : 'hover:border-stone-200'}`}
                        >
                          <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center gap-3">
                              <span className={`px-3 py-1 text-[8px] uppercase tracking-widest font-bold rounded-sm ${addr.isDefault ? 'bg-brand-gold text-white' : 'bg-stone-100 text-brand-softblack/40'}`}>
                                {addr.type}
                              </span>
                              {addr.isDefault && (
                                <span className="text-[8px] uppercase tracking-widest font-bold text-brand-gold">Utama</span>
                              )}
                            </div>
                            <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button className="p-2 text-brand-softblack/30 hover:text-brand-gold transition-colors"><Edit3 size={14} /></button>
                              {!addr.isDefault && <button className="p-2 text-brand-softblack/30 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>}
                            </div>
                          </div>

                          <div className="space-y-4">
                            <p className="text-sm font-bold text-brand-softblack uppercase tracking-widest">{addr.name}</p>
                            <div className="flex items-center gap-3 text-brand-softblack/60">
                              <Phone size={12} className="text-brand-gold/40" />
                              <p className="text-xs font-light">{addr.phone}</p>
                            </div>
                            <div className="flex items-start gap-3 text-brand-softblack/60">
                              <MapPin size={12} className="text-brand-gold/40 mt-1" />
                              <p className="text-xs font-light leading-relaxed">{addr.address}</p>
                            </div>
                          </div>

                          {!addr.isDefault && (
                            <button className="mt-8 text-[9px] uppercase tracking-[0.2em] font-bold text-brand-softblack/30 hover:text-brand-gold transition-colors w-full py-3 border border-dashed border-stone-200 hover:border-brand-gold/40 rounded-sm">
                              Jadikan Alamat Utama
                            </button>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "wishlist" && (
                  <div className="space-y-8">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm uppercase tracking-[0.4em] font-bold text-brand-softblack mb-2">Favorit Anda</h3>
                        <p className="text-[10px] text-brand-softblack/40 uppercase tracking-widest">Koleksi kurasi gaya impian Anda</p>
                      </div>
                      <button className="text-[10px] uppercase tracking-widest text-brand-gold font-bold hover:underline">
                        Pindahkan Semua ke Keranjang
                      </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {[
                        { name: "Sutra Dress Emerald", price: "Rp 450.000", image: "https://thenblank.com/cdn/shop/files/70A2411_800x.jpg?v=1712818241" },
                        { name: "Pashmina Silk Cream", price: "Rp 250.000", image: "https://thenblank.com/cdn/shop/files/70A2312_800x.jpg?v=1712818241" },
                        { name: "Gold Brooch", price: "Rp 150.000", image: "https://thenblank.com/cdn/shop/files/70A2215_800x.jpg?v=1712818241" },
                        { name: "Luxury Abaya Black", price: "Rp 1.250.000", image: "https://thenblank.com/cdn/shop/files/70A2111_800x.jpg?v=1712818241" },
                      ].map((item, idx) => (
                        <motion.div 
                          key={idx}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="group"
                        >
                          <div className="relative aspect-[3/4] bg-stone-100 mb-4 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-700">
                             <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
                             <div className="absolute inset-0 bg-brand-softblack/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                             <button className="absolute bottom-4 left-4 right-4 py-3 bg-white text-brand-softblack text-[9px] uppercase tracking-widest font-bold translate-y-12 group-hover:translate-y-0 transition-transform duration-500 shadow-lg">
                               Tambah ke Keranjang
                             </button>
                             <button className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                               <Trash2 size={12} />
                             </button>
                          </div>
                          <p className="text-[10px] uppercase tracking-widest text-brand-softblack/50 mb-1">Edisi Terbatas</p>
                          <h4 className="text-xs font-bold text-brand-softblack uppercase tracking-wider mb-2">{item.name}</h4>
                          <p className="text-xs font-light text-brand-gold">{item.price}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
}
