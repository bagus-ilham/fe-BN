import { getAdminLoyaltyOverview } from "@/lib/user-service";
import { Trophy, Users, TrendingUp, Gift, Star, Crown } from "lucide-react";

export default async function AdminLoyaltyPage() {
  const { topUsers, recentHistory, stats } = await getAdminLoyaltyOverview(10);

  type LoyaltyUserRow = {
    id: string; user_id: string; tier: string; points: number;
    profiles?: { full_name?: string | null; email?: string | null } | null;
  };
  type LoyaltyHistoryRow = {
    id: string; user_id: string; points_change: number; reason: string;
    created_at: string;
    auth_users?: { email?: string | null } | null;
  };

  const normalizedTopUsers: LoyaltyUserRow[] = (topUsers || []) as LoyaltyUserRow[];
  const normalizedRecentHistory: LoyaltyHistoryRow[] = (recentHistory || []) as LoyaltyHistoryRow[];

  const tierConfig: Record<string, { classes: string; dot: string }> = {
    Platinum: { classes: "bg-purple-50 text-purple-600 border-purple-200/70", dot: "bg-purple-400" },
    Gold:     { classes: "bg-amber-50 text-amber-600 border-amber-200/70",   dot: "bg-amber-400" },
    Silver:   { classes: "bg-slate-50 text-slate-500 border-slate-200/70",   dot: "bg-slate-400" },
    Bronze:   { classes: "bg-orange-50 text-orange-500 border-orange-200/70", dot: "bg-orange-400" },
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-brand-softblack/[0.06] p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-[9px] uppercase tracking-[0.3em] text-brand-softblack/30">Loyalty Program</p>
          <h2 className="text-xl font-light text-brand-softblack tracking-tight">Loyalty & Referral</h2>
          <p className="text-[11px] text-brand-softblack/40">Kelola poin dan apresiasi pelanggan setia benangbaju</p>
        </div>
        <button type="button" className="group inline-flex items-center gap-2 bg-brand-softblack text-white px-5 py-2.5 rounded-xl text-[10px] uppercase tracking-widest hover:bg-brand-green transition-all shadow-lg shadow-brand-softblack/20 self-start">
          <Gift size={13} className="group-hover:scale-110 transition-transform" />
          Buat Campaign Baru
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Poin Diterbitkan (30 Hari)", value: stats.totalPointsIssued.toLocaleString("id-ID"), icon: Trophy, iconClass: "bg-brand-champagne/60 text-brand-green" },
          { label: "Member Loyalty Aktif", value: stats.activeMembers.toLocaleString("id-ID"), icon: Users, iconClass: "bg-amber-50 text-amber-500" },
          { label: "Poin Ditukar (30 Hari)", value: stats.totalPointsRedeemed.toLocaleString("id-ID"), icon: TrendingUp, iconClass: "bg-sky-50 text-sky-500" },
          { label: "Rasio Redeem Poin", value: `${stats.referralConversionRate.toFixed(1)}%`, icon: Star, iconClass: "bg-purple-50 text-purple-500" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-2xl border border-brand-softblack/[0.06] p-5 flex items-center gap-3">
              <div className={`p-2.5 rounded-xl flex-shrink-0 ${stat.iconClass}`}>
                <Icon size={17} strokeWidth={1.5} />
              </div>
              <div className="min-w-0">
                <div className="text-[9px] uppercase tracking-[0.2em] text-brand-softblack/40 mb-1 leading-tight">{stat.label}</div>
                <div className="text-xl font-light text-brand-softblack">{stat.value}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Top Users Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-brand-softblack/[0.06] overflow-hidden">
          <div className="px-6 py-4 border-b border-brand-softblack/[0.05] flex items-center justify-between bg-[#F4F2EF]/30">
            <h3 className="text-[9px] uppercase tracking-[0.25em] font-semibold text-brand-softblack/40">Pelanggan Teratas (Berdasarkan Poin)</h3>
            <button type="button" className="text-[9px] text-brand-green uppercase tracking-widest hover:underline">Lihat Semua</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-brand-softblack/[0.04]">
                  <th className="px-6 py-3.5 text-[9px] uppercase tracking-[0.25em] font-semibold text-brand-softblack/35">Pelanggan</th>
                  <th className="px-6 py-3.5 text-[9px] uppercase tracking-[0.25em] font-semibold text-brand-softblack/35">Tier</th>
                  <th className="px-6 py-3.5 text-[9px] uppercase tracking-[0.25em] font-semibold text-brand-softblack/35 text-right">Saldo Poin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-softblack/[0.04]">
                {normalizedTopUsers.map((user, index) => {
                  const tier = user.tier || "Bronze";
                  const tierCfg = tierConfig[tier] || tierConfig.Bronze;
                  return (
                    <tr key={user.id} className="hover:bg-brand-offwhite/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-lg bg-[#F4F2EF] flex items-center justify-center text-[9px] font-bold text-brand-softblack/50 flex-shrink-0">
                            {index + 1}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[12px] font-medium text-brand-softblack">{user.profiles?.full_name || "Anonim"}</span>
                            <span className="text-[9px] text-brand-softblack/30">{user.profiles?.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[9px] uppercase tracking-wider font-semibold border rounded-full ${tierCfg.classes}`}>
                          <Crown size={9} />
                          {tier}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm font-bold text-brand-green">{user.points.toLocaleString("id-ID")}</span>
                        <span className="text-[9px] text-brand-softblack/30 ml-1">pts</span>
                      </td>
                    </tr>
                  );
                })}
                {normalizedTopUsers.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-14 text-center">
                      <Trophy size={28} className="mx-auto mb-3 text-brand-softblack/15" />
                      <p className="text-sm text-brand-softblack/35">Belum ada data loyalty.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl border border-brand-softblack/[0.06] flex flex-col overflow-hidden">
          <div className="px-6 py-4 border-b border-brand-softblack/[0.05] bg-[#F4F2EF]/30">
            <h3 className="text-[9px] uppercase tracking-[0.25em] font-semibold text-brand-softblack/40">Aktivitas Poin Terbaru</h3>
          </div>
          <div className="flex-1 p-5 space-y-4 overflow-y-auto">
            {normalizedRecentHistory.map((log) => (
              <div key={log.id} className="flex gap-3 items-start">
                <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${log.points_change > 0 ? "bg-emerald-400" : "bg-red-400"}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-brand-softblack leading-snug">
                    <span className={`font-bold ${log.points_change > 0 ? "text-emerald-600" : "text-red-500"}`}>
                      {log.points_change > 0 ? `+${log.points_change}` : log.points_change}
                    </span>
                    {" "}pts — {log.reason}
                  </p>
                  <p className="text-[9px] text-brand-softblack/30 mt-0.5 truncate">
                    {new Date(log.created_at).toLocaleString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} • {log.auth_users?.email}
                  </p>
                </div>
              </div>
            ))}
            {normalizedRecentHistory.length === 0 && (
              <p className="text-[11px] text-brand-softblack/35 italic text-center py-8">Belum ada aktivitas loyalty terbaru.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
