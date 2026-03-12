// app/dealers/page.tsx
"use client";

import { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  FileText,
  X,
  Phone,
  MapPin,
  Mail,
  ShieldCheck,
  Ban,
  Trash2,
  Check,
  AlertCircle,
} from "lucide-react";

type Dealer = {
  id?: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  plan: "Enterprise" | "Pro" | "Basic";
  status: "active" | "pending" | "suspended";
  licenseVerified: boolean;
  auctions: number;
  wins: number;
  score: number;
};

const mockDealers: Dealer[] = [
  {
    id: "1",
    name: "Hans Mueller",
    company: "Mueller Auto AG",
    email: "hans@muellerauto.ch",
    phone: "+41 44 123 4567",
    address: "Zurich, Switzerland",
    plan: "Enterprise",
    status: "active",
    licenseVerified: true,
    auctions: 145,
    wins: 89,
    score: 98,
  },
  {
    id: "2",
    name: "Pierre Duboils",
    company: "Geneva Luxury Cars",
    email: "pierre@genevacar.ch",
    phone: "+41 22 22 456890",
    address: "Geneva, Switzerland",
    plan: "Pro",
    status: "active",
    licenseVerified: true,
    auctions: 87,
    wins: 52,
    score: 92,
  },
  {
    id: "3",
    name: "Marco Rossi",
    company: "Rossi Motors",
    email: "marco@rossi-motors.ch",
    phone: "+41 91 234 5678",
    address: "Lugano, Switzerland",
    plan: "Basic",
    status: "pending",
    licenseVerified: false,
    auctions: 0,
    wins: 0,
    score: 0,
  },
  {
    id: "4",
    name: "Klaus Weber",
    company: "Weber Automobile",
    email: "klaus@weber.ch",
    phone: "+41 61 345 6789",
    address: "Basel, Switzerland",
    plan: "Pro",
    status: "suspended",
    licenseVerified: true,
    auctions: 45,
    wins: 12,
    score: 45,
  },
];

export default function DealerManagement() {
  const [selectedDealer, setSelectedDealer] = useState<Dealer | null>(null);

  const winRate = selectedDealer
    ? selectedDealer.auctions > 0
      ? Math.round((selectedDealer.wins / selectedDealer.auctions) * 100)
      : 0
    : 0;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-9xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Dealer Management</h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage dealer accounts and verifications
          </p>
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search dealers..."
              className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-gray-600"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <select className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gray-600 min-w-[140px]">
            <option>All Status</option>
            <option>Active</option>
            <option>Pending</option>
            <option>Suspended</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-800/60">
                <tr>
                  <th className="px-6 py-4 font-medium">Dealer Name</th>
                  <th className="px-6 py-4 font-medium">Company</th>
                  <th className="px-6 py-4 font-medium">Plan</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-center">License</th>
                  <th className="px-6 py-4 font-medium text-center">Auctions</th>
                  <th className="px-6 py-4 font-medium text-center">Wins</th>
                  <th className="px-6 py-4 font-medium text-center">Score</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {mockDealers.map((dealer) => (
                  <tr
                    key={dealer.id}
                    className="hover:bg-gray-800/50 transition cursor-pointer"
                    onClick={() => setSelectedDealer(dealer)}
                  >
                    <td className="px-6 py-4 font-medium">{dealer.name}</td>
                    <td className="px-6 py-4 text-gray-300">{dealer.company}</td>
                    <td className="px-6 py-4">{dealer.plan}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={dealer.status} />
                    </td>
                    <td className="px-6 py-4 text-center">
                      {dealer.licenseVerified ? (
                        <CheckCircle2 className="inline h-5 w-5 text-emerald-500" />
                      ) : (
                        <XCircle className="inline h-5 w-5 text-red-500" />
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">{dealer.auctions}</td>
                    <td className="px-6 py-4 text-center">{dealer.wins}</td>
                    <td className="px-6 py-4 text-center font-medium">{dealer.score}</td>
                    <td className="px-6 py-4 text-right space-x-1">
                      <button className="p-1.5 hover:bg-gray-700 rounded transition">
                        <FileText className="h-4 w-4 text-gray-400" />
                      </button>
                      <button className="p-1.5 hover:bg-gray-700 rounded transition">
                        <Eye className="h-4 w-4 text-gray-400" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {selectedDealer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-lg overflow-hidden shadow-2xl">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{selectedDealer.name}</h2>
                  <div className="text-sm text-gray-400 mt-0.5 flex items-center gap-2">
                    <span>{selectedDealer.company}</span>
                    <span>•</span>
                    <Mail className="h-3.5 w-3.5" />
                    <span>{selectedDealer.email}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedDealer(null)}
                  className="p-1.5 hover:bg-gray-800 rounded-full transition"
                >
                  <X className="h-5 w-5 text-gray-400" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-5 text-sm">
                  <div>
                    <div className="text-gray-400 mb-1">Status</div>
                    <StatusBadge status={selectedDealer.status} bigger />
                  </div>
                  <div>
                    <div className="text-gray-400 mb-1">Subscription Plan</div>
                    <div className="font-medium">{selectedDealer.plan}</div>
                  </div>

                  <div>
                    <div className="text-gray-400 mb-1 flex items-center gap-1.5">
                      <Phone className="h-4 w-4" /> Phone
                    </div>
                    <div>{selectedDealer.phone}</div>
                  </div>
                  <div>
                    <div className="text-gray-400 mb-1 flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" /> Address
                    </div>
                    <div>{selectedDealer.address}</div>
                  </div>

                  <div>
                    <div className="text-gray-400 mb-1">License Verified</div>
                    <div className={selectedDealer.licenseVerified ? "text-emerald-400" : "text-red-400"}>
                      {selectedDealer.licenseVerified ? "Yes" : "No"}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400 mb-1">Activity Score</div>
                    <div className="font-medium">{selectedDealer.score}/100</div>
                  </div>
                </div>

                {/* Stats */}
                <div className="bg-gray-950 rounded-lg p-5 border border-gray-800">
                  <div className="grid grid-cols-3 text-center gap-2">
                    <div>
                      <div className="text-2xl font-bold">{selectedDealer.auctions}</div>
                      <div className="text-xs text-gray-400 mt-1">Total Auctions</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{selectedDealer.wins}</div>
                      <div className="text-xs text-gray-400 mt-1">Total Wins</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{winRate}%</div>
                      <div className="text-xs text-gray-400 mt-1">Win Rate</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="px-6 py-4 border-t border-gray-800 flex flex-wrap gap-3 justify-end">
                {selectedDealer.status === "active" && (
                  <>
                    <button className="flex items-center gap-1.5 px-4 py-2 bg-red-950 hover:bg-red-900 border border-red-800 text-red-300 rounded-lg transition text-sm font-medium">
                      <Ban size={16} /> Suspend
                    </button>
                    <button className="flex items-center gap-1.5 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition text-sm font-medium">
                      <Trash2 size={16} /> Delete
                    </button>
                  </>
                )}

                {selectedDealer.status === "pending" && (
                  <>
                    <button className="flex items-center gap-1.5 px-4 py-2 bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 rounded-lg transition text-sm font-medium">
                      <Check size={16} /> Approve
                    </button>
                    <button className="flex items-center gap-1.5 px-4 py-2 bg-red-950 hover:bg-red-900 border border-red-800 text-red-300 rounded-lg transition text-sm font-medium">
                      <XCircle size={16} /> Reject
                    </button>
                    <button className="flex items-center gap-1.5 px-4 py-2 bg-blue-950 hover:bg-blue-900 border border-blue-800 text-blue-300 rounded-lg transition text-sm font-medium">
                      <ShieldCheck size={16} /> Verify License
                    </button>
                    <button className="flex items-center gap-1.5 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition text-sm font-medium">
                      <Trash2 size={16} /> Delete
                    </button>
                  </>
                )}

                {selectedDealer.status === "suspended" && (
                  <>
                    <button className="flex items-center gap-1.5 px-4 py-2 bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 rounded-lg transition text-sm font-medium">
                      <Check size={16} /> Activate
                    </button>
                    <button className="flex items-center gap-1.5 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition text-sm font-medium">
                      <Trash2 size={16} /> Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({
  status,
  bigger = false,
}: {
  status: Dealer["status"];
  bigger?: boolean;
}) {
  const base = "inline-flex items-center rounded-full font-medium border capitalize";
  const size = bigger ? "px-3.5 py-1 text-sm" : "px-2.5 py-0.5 text-xs";

  const styles = {
    active: "bg-emerald-950 text-emerald-400 border-emerald-800",
    pending: "bg-amber-950 text-amber-400 border-amber-800",
    suspended: "bg-red-950 text-red-400 border-red-800",
  };

  const labels = {
    active: "active",
    pending: "pending",
    suspended: "suspended",
  };

  return (
    <span className={`${base} ${size} ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}