export type AdminQueryValue = string | number | undefined | null | false;

export function buildAdminHref(
  basePath: string,
  query: Record<string, AdminQueryValue>,
  overrides: Record<string, AdminQueryValue> = {},
  defaults: { page: number; pageSize: number } = { page: 1, pageSize: 20 },
) {
  const sp = new URLSearchParams();
  const merged = { ...query, ...overrides };

  Object.entries(merged).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "" || value === false) return;

    if (key === "page") {
      const page = Number(value);
      if (!Number.isFinite(page) || Math.trunc(page) <= defaults.page) return;
      sp.set("page", String(Math.trunc(page)));
      return;
    }

    if (key === "pageSize") {
      const pageSize = Number(value);
      if (!Number.isFinite(pageSize) || Math.trunc(pageSize) === defaults.pageSize) return;
      sp.set("pageSize", String(Math.trunc(pageSize)));
      return;
    }

    sp.set(key, String(value));
  });

  const qs = sp.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

