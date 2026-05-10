"use client";

import { useState } from "react";
import { FileText, Search, ChevronLeft, ChevronRight, Loader2, AlertCircle } from "lucide-react";
import { useGetAuditLogsQuery } from "@/lib/adminApi";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function fmt(date: string) {
  return new Date(date).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getActionColor(action: string) {
  if (action.includes("suspend") || action.includes("delete") || action.includes("remove")) return "text-red-400";
  if (action.includes("approve") || action.includes("reactivate") || action.includes("login")) return "text-emerald-400";
  if (action.includes("update") || action.includes("flag")) return "text-amber-400";
  return "text-blue-400";
}

export default function AuditLogsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useGetAuditLogsQuery({ page });

  const totalPages = data ? Math.ceil(data.count / 10) : 1;

  const handleExportPDF = () => {
    if (!data?.results) return;

    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.text("Compliance & Audit Report", 14, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
    doc.text(`Total Log Entries: ${data.count}`, 14, 35);

    // Table
    const tableData = data.results.map((log) => [
      fmt(log.created_at),
      log.actor_email,
      log.action.toUpperCase().replace(/_/g, ' '),
      log.description,
      log.ip_address
    ]);

    autoTable(doc, {
      startY: 45,
      head: [["Timestamp", "Admin", "Action", "Details", "IP Address"]],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [16, 185, 129] }, // Emerald-500
      styles: { fontSize: 8 }
    });

    doc.save(`audit-logs-report-${new Date().getTime()}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-9xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-emerald-600 flex items-center justify-center">
                <span className="text-xs font-bold text-white">✓</span>
              </div>
              <h1 className="text-2xl font-bold">Compliance & Audit Logs</h1>
            </div>
            <p className="text-gray-400 text-sm mt-1">
              Complete audit trail of all administrative actions
            </p>
          </div>

          <button 
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm transition font-bold shadow-lg shadow-emerald-900/20"
          >
            <FileText size={16} />
            Export PDF
          </button>
        </div>

        {/* Table */}
        <div className="bg-[#111113] border border-gray-800 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-800/60">
                <tr>
                  <th className="px-6 py-4 font-medium text-gray-400 text-[10px] uppercase tracking-wider">Timestamp</th>
                  <th className="px-6 py-4 font-medium text-gray-400 text-[10px] uppercase tracking-wider">Admin</th>
                  <th className="px-6 py-4 font-medium text-gray-400 text-[10px] uppercase tracking-wider">Action</th>
                  <th className="px-6 py-4 font-medium text-gray-400 text-[10px] uppercase tracking-wider">Details</th>
                  <th className="px-6 py-4 font-medium text-gray-400 text-[10px] uppercase tracking-wider">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {isLoading && (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center">
                      <Loader2 className="h-6 w-6 text-emerald-500 animate-spin mx-auto" />
                    </td>
                  </tr>
                )}
                {isError && (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center text-red-400">
                      <div className="flex items-center justify-center gap-2">
                        <AlertCircle size={18} />
                        Failed to load audit logs.
                      </div>
                    </td>
                  </tr>
                )}
                {!isLoading && !isError && data?.results.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-800/40 transition group">
                    <td className="px-6 py-4 text-gray-300 group-hover:text-white transition-colors">{fmt(log.created_at)}</td>
                    <td className="px-6 py-4 font-medium text-gray-200">
                      <div className="flex flex-col">
                        <span>{log.actor_email}</span>
                        {log.actor_role && <span className="text-[10px] text-gray-500 uppercase tracking-wider">{log.actor_role}</span>}
                      </div>
                    </td>
                    <td className={`px-6 py-4 font-bold uppercase text-[10px] tracking-widest ${getActionColor(log.action)}`}>
                      {log.action.replace(/_/g, ' ')}
                    </td>
                    <td className="px-6 py-4 text-gray-300 leading-relaxed max-w-md">{log.description}</td>
                    <td className="px-6 py-4 text-gray-500 font-mono text-xs">{log.ip_address}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {data && totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-800 bg-gray-900/30 text-xs text-gray-500">
              <div>
                Showing page {page} of {totalPages} ({data.count} logs)
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={!data.previous}
                  className="p-1.5 bg-gray-800 rounded-lg hover:bg-gray-700 disabled:opacity-40 transition"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="px-3 py-1 bg-gray-700 text-gray-200 rounded-lg font-medium">{page}</span>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!data.next}
                  className="p-1.5 bg-gray-800 rounded-lg hover:bg-gray-700 disabled:opacity-40 transition"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Summary Stats */}
        {data && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatBox label="Total Logged Actions" value={data.count} color="text-cyan-400" />
            <StatBox label="Today's Activity" value={data.results.filter(l => new Date(l.created_at).toDateString() === new Date().toDateString()).length} color="text-emerald-400" />
            <StatBox label="System Logins" value={data.results.filter(l => l.action === "admin_login").length} color="text-purple-400" />
            <StatBox label="Security Alerts" value={data.results.filter(l => l.action.includes("suspend") || l.action.includes("flag")).length} color="text-red-400" />
          </div>
        )}
      </div>
    </div>
  );
}

function StatBox({ label, value, color }: { label: string; value: number; color?: string }) {
  return (
    <div className="bg-[#111113] border border-gray-800/50 rounded-xl p-5 flex flex-col gap-1 shadow-sm">
      <div className={`text-2xl font-bold ${color || "text-white"}`}>{value}</div>
      <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</div>
    </div>
  );
}
