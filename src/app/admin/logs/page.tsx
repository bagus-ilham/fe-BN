import Link from "next/link";
import { listAdminLogsPaged, type AdminLogItem } from "@/lib/log-service";
import { Search, Filter, Terminal, FileEdit, Trash2, PlusCircle } from "lucide-react";
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
    <div className="space-y-8">
      {/* Header */}
      <div className="surface-card border border-gray-100/80 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <p className="text-[10px] uppercase tracking-[0.25em] text-brand-softblack/35">
            Admin Audit Trail
          </p>
          <h2 className="text-2xl font-light text-brand-softblack tracking-tight">
            Log Aktivitas Admin
          </h2>
          <p className="text-xs text-brand-softblack/40 uppercase tracking-widest mt-1">
            Audit trail semua tindakan yang dilakukan oleh administrator
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="surface-card border border-gray-100/80 p-4 flex flex-col md:flex-row gap-4">
        <form action="/admin/logs" method="get" className="relative flex-1">
          {action && <input type="hidden" name="action" value={action} />}
          {pageSize !== 20 && <input type="hidden" name="pageSize" value={String(pageSize)} />}
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-softblack/20" size={18} />
          <input 
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Cari aksi / target table / target id..."
            className="w-full bg-white border border-gray-100 py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-brand-green/30"
          />
        </form>
        <div className="flex items-center gap-2">
          {actionFilters.map((actionFilter) => (
            <Link
              key={actionFilter}
              href={buildAdminHref(basePath, query, { page: 1, action: actionFilter })}
              className={`px-4 py-3 border text-xs uppercase tracking-widest transition-colors ${
                action === actionFilter
                  ? "bg-brand-softblack text-white border-brand-softblack"
                  : "bg-white text-brand-softblack/60 border-gray-100 hover:bg-brand-offwhite"
              }`}
            >
              {actionFilter}
            </Link>
          ))}
          <Link
            href={buildAdminHref(basePath, query, { page: 1, q: undefined, action: undefined })}
            className="px-4 py-3 border border-gray-100 bg-white text-xs uppercase tracking-widest text-brand-softblack/60 flex items-center gap-2 hover:bg-brand-offwhite transition-colors"
          >
            <Filter size={16} />
            Reset
          </Link>
        </div>
      </div>

      {/* Logs List */}
      <div className="surface-card border border-gray-100/80 p-0 overflow-hidden">
        <div className="divide-y divide-gray-50">
          {logs?.map((log: AdminLogItem) => (
            <div key={log.id} className="p-6 flex items-start gap-4 hover:bg-brand-offwhite/10 transition-colors group">
              <div className={`mt-1 w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                log.action.includes('DELETE') ? 'bg-red-50 text-red-500' :
                log.action.includes('CREATE') ? 'bg-green-50 text-brand-green' :
                'bg-blue-50 text-blue-500'
              }`}>
                {log.action.includes('DELETE') ? <Trash2 size={18} /> :
                 log.action.includes('CREATE') ? <PlusCircle size={18} /> :
                 <FileEdit size={18} />}
              </div>
              
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-brand-softblack uppercase tracking-widest">
                      {log.profiles?.full_name || 'System'}
                    </span>
                    <span className="text-brand-softblack/20">•</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-sm font-bold uppercase tracking-[0.15em] ${
                      log.action.includes('DELETE') ? 'bg-red-50 text-red-500' :
                      log.action.includes('CREATE') ? 'bg-green-50 text-brand-green' :
                      'bg-blue-50 text-blue-500'
                    }`}>
                      {log.action}
                    </span>
                  </div>
                  <span className="text-[10px] text-brand-softblack/30 uppercase tracking-widest">
                    {new Date(log.created_at).toLocaleString('id-ID')}
                  </span>
                </div>
                
                <p className="text-sm text-brand-softblack/70 font-light">
                  {typeof log.payload === 'string' ? log.payload : JSON.stringify(log.payload)} pada <span className="font-medium text-brand-softblack">{log.target_table}</span> (ID: {log.target_id})
                </p>
              </div>
              
              <button className="opacity-0 group-hover:opacity-100 p-2 text-brand-softblack/20 hover:text-brand-softblack transition-all">
                <Terminal size={16} />
              </button>
            </div>
          ))}
          {(!logs || logs.length === 0) && (
            <div className="p-12 text-center text-sm text-brand-softblack/40 italic">
              {q || action
                ? "Tidak ada aktivitas yang cocok dengan filter saat ini."
                : "Belum ada aktivitas admin yang tercatat."}
            </div>
          )}
        </div>
      </div>

      <div className="surface-card border border-gray-100/80 overflow-hidden">
        <AdminPagination
          basePath="/admin/logs"
          page={safePage}
          pageSize={pageSize}
          total={total}
          query={{
            q,
            action,
          }}
        />
      </div>
    </div>
  );
}
