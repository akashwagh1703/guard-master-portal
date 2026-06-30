import { useState } from "react";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { cn } from "../../utils/cn";
import Badge from "./Badge";
import EmptyState from "./EmptyState";
import Pagination from "./Pagination";

export default function DataTable({
  columns,
  data,
  searchable = true,
  searchPlaceholder = "Search...",
  pagination = true,
  selectable = false,
  onRowClick,
  emptyTitle = "No records found",
  actions,
}) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  let filtered = data.filter((row) =>
    Object.values(row).some((v) => String(v).toLowerCase().includes(search.toLowerCase()))
  );

  if (sortKey) {
    filtered = [...filtered].sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey];
      const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true });
      return sortDir === "asc" ? cmp : -cmp;
    });
  }

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = pagination ? filtered.slice((page - 1) * pageSize, page * pageSize) : filtered;

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };

  const toggleAll = () => {
    setSelected(selected.length === paginated.length ? [] : paginated.map((r) => r.id));
  };

  const toggleRow = (id) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-100/80 shadow-sm overflow-hidden animate-fade-in-up">
      {(searchable || actions) && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 border-b border-slate-100">
          {searchable && (
            <input
              type="search"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full sm:w-72 px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          )}
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-100 sticky top-0">
            <tr>
              {selectable && (
                <th className="px-4 py-3 w-10">
                  <input type="checkbox" checked={selected.length === paginated.length && paginated.length > 0} onChange={toggleAll} className="rounded" />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn("px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider", col.className)}
                >
                  {col.sortable !== false ? (
                    <button onClick={() => toggleSort(col.key)} className="flex items-center gap-1 hover:text-slate-700 cursor-pointer">
                      {col.label}
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  ) : col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0)}>
                  <EmptyState title={emptyTitle} />
                </td>
              </tr>
            ) : (
              paginated.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => onRowClick?.(row)}
                  className={cn(
                    "hover:bg-slate-50 transition-colors",
                    onRowClick && "cursor-pointer"
                  )}
                >
                  {selectable && (
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <input type="checkbox" checked={selected.includes(row.id)} onChange={() => toggleRow(row.id)} className="rounded" />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td key={col.key} className={cn("px-4 py-3.5 text-slate-700", col.className)}>
                      {col.render ? col.render(row) : col.badge ? <Badge status={row[col.key]}>{row[col.key]}</Badge> : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && filtered.length > 0 && (
        <div className="border-t border-slate-100">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
}

export function ActionMenu({ items }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button onClick={(e) => { e.stopPropagation(); setOpen(!open); }} className="p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer">
        <MoreHorizontal className="h-4 w-4 text-slate-500" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 z-20 bg-white rounded-lg border border-slate-200 shadow-lg py-1 min-w-[140px]">
            {items.map((item, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); item.onClick?.(); setOpen(false); }}
                className={cn(
                  "w-full px-3 py-2 text-sm text-left hover:bg-slate-50 cursor-pointer",
                  item.danger ? "text-red-600" : "text-slate-700"
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
