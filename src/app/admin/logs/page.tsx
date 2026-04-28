import Link from "next/link";
import { listAdminLogsPaged, type AdminLogItem } from "@/lib/log-service";
import { Search, Filter, Terminal, FileEdit, Trash2, PlusCircle, Activity } from "lucide-react";
import AdminPagination from "@/components/admin/AdminPagination";
import { buildAdminHref } from "@/lib/admin/build-admin-href";

type AdminAuditLogsPageProps = {
  searchParams?: Promise<{
    page?: string;
    pageSize?: string;
    q?: string;
    action?: string;
  }>;
};

const actionFilters = ["CREATE", "UPDATE", "DELETE"] as const;

function resolveInt(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.trunc(parsed) : fallback;
}

function resolveAction(value: string | undefined): string | undefined {
  if (!value) return undefined;
  if (actionFilters.includes(value as (typeof actionFilters)[number])) return value;
  return undefined;
}

const actionConfig: Record<string, { bg: string; text: string; dot: string; iconEl: React.ReactNode }> = {
  DELETE: { bg: "bg-red-50", text: "text-red-500", dot: "bg-red-400", iconEl: <Trash2 size={15} /> },
  CREATE: { bg: "bg-emerald-50", text: "text-emerald-600", dot: "bg-emerald-400", iconEl: <PlusCircle size={15} /> },
  UPDATE: { bg: "bg-sky-50", text: "text-sky-600", dot: "bg-sky-400", iconEl: <FileEdit size={15} /> },
};

const basePath = "/admin/logs";

export default async function AdminAuditLogsPage({ searchParams }: AdminAuditLogsPageProps) {
  const params = searchParams ? await searchParams : undefined;
  const page = Math.max(resolveInt(params?.page, 1), 1);
  const pageSize = Math.min(Math.max(resolveInt(params?.pageSize, 20), 10), 100);
  const q = params?.q?.trim() || "";
  const action = resolveAction(params?.action);

  const result = await listAdminLogsPaged({ page, pageSize, q, action });
  const logs = result.data;
  const total = result.total;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const query = { page: safePage, pageSize, q, action };
  
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-brand-softblack/[0.06] p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-[9px] uppercase tracking-[0.3em] text-brand-softblack/30">Admin Audit Trail</p>
          <h2 className="text-xl font-light text-brand-softblack tracking-tight">Log Aktivitas Admin</h2>
          <p className="text-[11px] text-brand-softblack/40">Semua tindakan yang dilakukan oleh administrator</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2.5 bg-[#F4F2EF] rounded-xl border border-brand-softblack/[0.06] text-[10px] text-brand-softblack/50 self-start">
          <Activity size={13} />
          <span>{total} total log</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl border border-brand-softblack/[0.06] p-4 flex flex-col md:flex-row gap-3">
        <form action="/admin/logs" method="get" className="relative flex-1">
          {action && <input type="hidden" name="action" value={action} />}
          {pageSize !== 20 && <input type="hidden" name="pageSize" value={String(pageSize)} />}
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-softblack/25" size={15} />
          <input 
            type="text" name="q" defaultValue={q}
            placeholder="Cari aksi, tabel, atau target ID..."
            className="w-full bg-[#F4F2EF] rounded-xl py-2.5 pl-10 pr-4 text-sm text-brand-softblack placeholder:text-brand-softblack/30 focus:ring-1 focus:ring-brand-gold/40 outline-none transition-all border border-transparent focus:border-brand-gold/20"
          />
        </form>
        <div className="flex items-center gap-2 flex-wrap">
          {actionFilters.map((af) => {
            const cfg = actionConfig[af];
            return (
              <Link
                key={af}
                href={buildAdminHref(basePath, query, { page: 1, action: af })}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[9px] uppercase tracking-widest transition-all border ${
                  action === af
                    ? `${cfg.bg} ${cfg.text} border-current/30 font-semibold shadow-sm`
                    : "bg-[#F4F2EF] text-brand-softblack/55 border-transparent hover:bg-brand-champagne/40"
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                {af}
              </Link>
            );
          })}
          <Link
            href={buildAdminHref(basePath, query, { page: 1, q: undefined, action: undefined })}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[9px] uppercase tracking-widest text-brand-softblack/40 hover:text-brand-softblack bg-[#F4F2EF] hover:bg-brand-champagne/40 transition-all"
          >
            <Filter size={11} />
            Reset
          </Link>
        </div>
      </div>

      {/* Logs List */}
      <div className="bg-white rounded-2xl border border-brand-softblack/[0.06] overflow-hidden">
        <div className="divide-y divide-brand-softblack/[0.04]">
          {logs?.map((log: AdminLogItem) => {
            const actionKey = actionFilters.find(af => log.action.includes(af)) || "UPDATE";
            const cfg = actionConfig[actionKey];
            return (
              <div key={log.id} className="p-5 flex items-start gap-4 hover:bg-brand-offwhite/50 transition-colors group">
                <div className={`mt-0.5 w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${cfg.bg} ${cfg.text}`}>
                  {cfg.iconEl}
                </div>
                
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-brand-softblack uppercase tracking-wider">
                        {log.profiles?.full_name || "System"}
                      </span>
                      <span className="text-brand-softblack/15">·</span>
                      <span className={`text-[9px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider border ${cfg.bg} ${cfg.text}`}
                        style={{ borderColor: "currentColor", opacity: 0.9 }}
                      >
                        {log.action}
                      </span>
                    </div>
                    <span className="text-[9px] text-brand-softblack/30 uppercase tracking-wider flex-shrink-0">
                      {new Date(log.created_at).toLocaleString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  
                  <p className="text-[11px] text-brand-softblack/55 leading-relaxed">
                    {typeof log.payload === "string" ? log.payload : JSON.stringify(log.payload)}
                    {" "}pada{" "}
                    <span className="font-semibold text-brand-softblack/80">{log.target_table}</span>
                    {log.target_id && <span className="text-brand-softblack/35"> (ID: {log.target_id})</span>}
                  </p>
                </div>
                
                <button className="opacity-0 group-hover:opacity-100 p-2 text-brand-softblack/20 hover:text-brand-softblack hover:bg-[#F4F2EF] rounded-xl transition-all flex-shrink-0">
                  <Terminal size={14} />
                </button>
              </div>
            );
          })}
          {(!logs || logs.length === 0) && (
            <div className="p-16 text-center">
              <Activity size={32} className="mx-auto mb-3 text-brand-softblack/15" />
              <p className="text-sm text-brand-softblack/40">
                {q || action ? "Tidak ada aktivitas yang cocok dengan filter." : "Belum ada aktivitas admin yang tercatat."}
              </p>
            </div>
          )}
        </div>

        <AdminPagination
          basePath="/admin/logs"
          page={safePage}
          pageSize={pageSize}
          total={total}
          query={{ q, action }}
        />
      </div>
    </div>
  );
}
