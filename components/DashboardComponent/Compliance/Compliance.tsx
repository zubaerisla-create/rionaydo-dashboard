// app/compliance/audit-logs/page.tsx
"use client";

import { useState } from "react";
import { Download, Search, Filter } from "lucide-react";

type AuditLog = {
  timestamp: string;
  admin: string;
  action: string;
  details: string;
  ip: string;
  actionColor?: "text-emerald-400" | "text-amber-400" | "text-red-400";
};

const mockAuditLogs: AuditLog[] = [
  {
    timestamp: "3/3/2026, 3:15:00 PM",
    admin: "Super Admin",
    action: "Suspended Dealer",
    details: "Suspended Klaus Weber for suspicious bidding",
    ip: "192.168.1.180",
    actionColor: "text-red-400",
  },
  {
    timestamp: "3/2/2026, 8:20:00 PM",
    admin: "Manager Admin",
    action: "Approved Dealer",
    details: "Approved registration for Marco Rossi",
    ip: "192.168.1.181",
    actionColor: "text-emerald-400",
  },
  {
    timestamp: "3/1/2026, 5:00:00 PM",
    admin: "Super Admin",
    action: "Updated Subscription",
    details: "Manually extended subscription for Hans Mueller",
    ip: "192.168.1.180",
    actionColor: "text-emerald-400",
  },
];

export default function AuditLogsPage() {
  const [search, setSearch] = useState("");

  const stats = {
    total: mockAuditLogs.length,
    today: 0,
    thisWeek: mockAuditLogs.length,
    uniqueAdmins: new Set(mockAuditLogs.map((log) => log.admin)).size,
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-9xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-emerald-600 flex items-center justify-center">
                <span className="text-xs font-bold">✓</span>
              </div>
              <h1 className="text-2xl font-bold">Compliance & Audit Logs</h1>
            </div>
            <p className="text-gray-400 text-sm mt-1">
              Complete audit trail of all administrative actions
            </p>
          </div>

          <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-sm transition">
            <Download size={16} />
            Export
          </button>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search logs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-gray-600 transition"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          </div>

          <div className="flex gap-3">
            <select className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gray-600 min-w-[160px]">
              <option>All Actions</option>
              <option>Suspended Dealer</option>
              <option>Approved Dealer</option>
              <option>Updated Subscription</option>
              <option>Login</option>
              <option>Role Change</option>
            </select>

            <select className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gray-600 min-w-[140px]">
              <option>All Time</option>
              <option>Today</option>
              <option>This Week</option>
              <option>This Month</option>
              <option>Last 30 Days</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-800/60">
                <tr>
                  <th className="px-6 py-4 font-medium">Timestamp</th>
                  <th className="px-6 py-4 font-medium">Admin</th>
                  <th className="px-6 py-4 font-medium">Action</th>
                  <th className="px-6 py-4 font-medium">Details</th>
                  <th className="px-6 py-4 font-medium">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {mockAuditLogs.map((log, index) => (
                  <tr key={index} className="hover:bg-gray-800/40 transition">
                    <td className="px-6 py-4 text-gray-300">{log.timestamp}</td>
                    <td className="px-6 py-4 font-medium">{log.admin}</td>
                    <td className={`px-6 py-4 font-medium ${log.actionColor || "text-gray-300"}`}>
                      {log.action}
                    </td>
                    <td className="px-6 py-4 text-gray-300">{log.details}</td>
                    <td className="px-6 py-4 text-gray-500 font-mono">{log.ip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stats Footer */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <StatBox label="Total Actions" value={stats.total} />
          <StatBox label="Today" value={stats.today} />
          <StatBox label="This Week" value={stats.thisWeek} />
          <StatBox label="Unique Admins" value={stats.uniqueAdmins} />
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-gray-400 mt-1">{label}</div>
    </div>
  );
}