import { 
  Trophy, 
  Users, 
  TrendingUp, 
  Gift,
  Star
} from "lucide-react";

const topUsers = [
  { id: '1', tier: 'Platinum', points: 12500, profiles: { full_name: 'Dewi Lestari', email: 'dewi@example.com' } },
  { id: '2', tier: 'Gold', points: 8400, profiles: { full_name: 'Reza Rahadian', email: 'reza@example.com' } },
  { id: '3', tier: 'Silver', points: 3200, profiles: { full_name: 'Dian Sastro', email: 'dian@example.com' } },
];

const recentHistory = [
  { id: 'h1', points_change: 500, reason: 'Purchase #1024',      created_at: "2024-05-20T10:00:00Z",
      auth_users: { email: 'user1@example.com' } 
    },
    { 
      id: 'h2', 
      points_change: 100, 
      reason: 'Referral bonus', 
      created_at: "2024-05-20T09:00:00Z",
      auth_users: { email: 'user2@example.com' } 
    },
];

export default async function AdminLoyaltyPage() {
  

  type LoyaltyUserRow = {
    id: string;
    tier: string;
    points: number;
    profiles?: { full_name?: string | null; email?: string | null } | null;
  };
  type LoyaltyHistoryRow = {
    id: string;
    points_change: number;
    reason: string;
    created_at: string;
    auth_users?: { email?: string | null } | null;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-light text-brand-softblack tracking-tight">
            Loyalty & Referral
          </h2>
          <p className="text-xs text-brand-softblack/40 uppercase tracking-widest mt-1">
            Kelola poin, program referral, dan apresiasi pelanggan setia
          </p>
        </div>
        
        <div className="flex gap-2">
            <button type="button" className="bg-brand-green text-white px-6 py-3 text-[10px] uppercase tracking-[0.2em] font-medium rounded-sm hover:bg-brand-softblack transition-all flex items-center gap-2">
              <Gift size={14} />
              Buat Campaign Baru
            </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="surface-card p-6 rounded-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-brand-green/10 text-brand-green rounded-lg">
              <Trophy size={20} />
            </div>
            <span className="text-[10px] font-bold text-brand-green">+12%</span>
          </div>
          <div className="text-[10px] uppercase tracking-widest text-brand-softblack/40">Total Poin Diterbitkan</div>
          <div className="text-2xl font-light text-brand-softblack mt-1">1.2M</div>
        </div>
        <div className="surface-card p-6 rounded-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Users size={20} />
            </div>
          </div>
          <div className="text-[10px] uppercase tracking-widest text-brand-softblack/40">Referrer Aktif</div>
          <div className="text-2xl font-light text-brand-softblack mt-1">452</div>
        </div>
        <div className="surface-card p-6 rounded-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="text-[10px] uppercase tracking-widest text-brand-softblack/40">Poin Ditukar</div>
          <div className="text-2xl font-light text-brand-softblack mt-1">85.4K</div>
        </div>
        <div className="surface-card p-6 rounded-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <Star size={20} />
            </div>
          </div>
          <div className="text-[10px] uppercase tracking-widest text-brand-softblack/40">Konversi Referral</div>
          <div className="text-2xl font-light text-brand-softblack mt-1">8.5%</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Top Users Table */}
        <div className="lg:col-span-2 surface-card overflow-hidden rounded-sm">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-softblack/60">Pelanggan Teratas (Berdasarkan Poin)</h3>
            <button type="button" className="text-[10px] text-brand-green uppercase tracking-widest hover:underline">Lihat Semua</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-50 bg-brand-offwhite/30">
                  <th className="px-6 py-4 text-[9px] uppercase tracking-widest font-semibold text-brand-softblack/40">Pelanggan</th>
                  <th className="px-6 py-4 text-[9px] uppercase tracking-widest font-semibold text-brand-softblack/40">Tier</th>
                  <th className="px-6 py-4 text-[9px] uppercase tracking-widest font-semibold text-brand-softblack/40 text-right">Saldo Poin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {(topUsers as LoyaltyUserRow[] | null)?.map((user) => (
                  <tr key={user.id} className="hover:bg-brand-offwhite/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-brand-softblack">{user.profiles?.full_name || "Anonim"}</span>
                        <span className="text-[10px] text-brand-softblack/30">{user.profiles?.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <span className={`px-2 py-0.5 text-[8px] uppercase tracking-widest font-bold rounded-full ${
                         user.tier === 'Platinum' ? 'bg-purple-100 text-purple-600' :
                         user.tier === 'Gold' ? 'bg-amber-100 text-amber-600' :
                         'bg-slate-100 text-slate-500'
                       }`}>
                         {user.tier}
                       </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-xs font-bold text-brand-green">{user.points.toLocaleString()} PTS</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="surface-card rounded-sm flex flex-col">
          <div className="p-6 border-b border-gray-50">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-softblack/60">Aktivitas Terbaru</h3>
          </div>
          <div className="flex-1 p-6 space-y-6">
            {(recentHistory as LoyaltyHistoryRow[] | null)?.map((log) => (
              <div key={log.id} className="flex gap-4">
                <div className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${
                  log.points_change > 0 ? 'bg-brand-green' : 'bg-red-400'
                }`} />
                <div className="space-y-1">
                  <p className="text-[11px] text-brand-softblack">
                    <span className="font-bold">{log.points_change > 0 ? `+${log.points_change}` : log.points_change}</span> points {log.reason} 
                  </p>
                  <p className="text-[10px] text-brand-softblack/40">
                    {new Date(log.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} • {log.auth_users?.email}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
