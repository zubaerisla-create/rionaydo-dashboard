// app/subscriptions/page.tsx
"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, CreditCard, Building, DollarSign, TrendingUp, AlertCircle, X } from "lucide-react";

type Subscription = {
  dealer: string;
  plan: "Enterprise" | "Pro" | "Basic";
  status: "active" | "payment failed";
  amount: number;
  startDate: string;
  endDate: string;
  paymentMethod: "Credit Card" | "Bank Transfer";
};

const mockSubscriptions: Subscription[] = [
  {
    dealer: "Hans Mueller",
    plan: "Enterprise",
    status: "active",
    amount: 2999,
    startDate: "2025-11-15",
    endDate: "2026-11-15",
    paymentMethod: "Credit Card",
  },
  {
    dealer: "Pierre Duboils",
    plan: "Pro",
    status: "active",
    amount: 999,
    startDate: "2026-01-01",
    endDate: "2027-01-01",
    paymentMethod: "Bank Transfer",
  },
  {
    dealer: "Klaus Weber",
    plan: "Pro",
    status: "payment failed",
    amount: 998, // slightly different to show failed case
    startDate: "2025-09-01",
    endDate: "2026-09-01",
    paymentMethod: "Credit Card",
  },
];

export default function SubscriptionManagement() {
  const [selectedSub, setSelectedSub] = useState<Subscription | null>(null);

  const totalRevenue = mockSubscriptions.reduce((sum, sub) => sum + sub.amount, 0);
  const activeCount = mockSubscriptions.filter(s => s.status === "active").length;
  const failedCount = mockSubscriptions.filter(s => s.status === "payment failed").length;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-9xl mx-auto space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <StatCard
            title="Total Revenue"
            value={`CHF ${totalRevenue.toLocaleString()}`}
            icon={DollarSign}
            trend="neutral"
            color="yellow"
          />
          <StatCard
            title="Active Subscriptions"
            value={activeCount.toString()}
            icon={TrendingUp}
            trend="up"
            color="green"
          />
          <StatCard
            title="Failed Payments"
            value={failedCount.toString()}
            icon={AlertCircle}
            trend="down"
            color="red"
          />
        </div>

        {/* Table Section */}
        <div className="space-y-3">
          <div>
            <h2 className="text-xl font-bold">Subscription Management</h2>
            <p className="text-gray-400 text-sm mt-1">
              Monitor and manage dealer subscriptions
            </p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-800/60">
                  <tr>
                    <th className="px-6 py-4 font-medium">Dealer</th>
                    <th className="px-6 py-4 font-medium">Plan</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Amount</th>
                    <th className="px-6 py-4 font-medium">Start Date</th>
                    <th className="px-6 py-4 font-medium">End Date</th>
                    <th className="px-6 py-4 font-medium">Payment Method</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {mockSubscriptions.map((sub) => (
                    <tr key={sub.dealer} className="hover:bg-gray-800/40 transition">
                      <td className="px-6 py-4 font-medium">{sub.dealer}</td>
                      <td className="px-6 py-4">{sub.plan}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={sub.status} />
                      </td>
                      <td className="px-6 py-4">CHF {sub.amount.toLocaleString()}</td>
                      <td className="px-6 py-4">{sub.startDate}</td>
                      <td className="px-6 py-4">{sub.endDate}</td>
                      <td className="px-6 py-4">{sub.paymentMethod}</td>
                      <td className="px-6 py-4 text-right space-x-3 text-sm">
                        <button
                          onClick={() => setSelectedSub(sub)}
                          className="text-blue-400 hover:text-blue-300 transition"
                        >
                          Manage
                        </button>
                        <button className="text-red-400 hover:text-red-300 transition">
                          Refund
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination placeholder */}
          <div className="flex items-center justify-between text-sm text-gray-400">
            <div>Showing 1–{mockSubscriptions.length} of many subscriptions</div>
            <div className="flex gap-1">
              <button className="px-3 py-1 bg-gray-800 rounded hover:bg-gray-700 disabled:opacity-50" disabled>←</button>
              <button className="px-3 py-1 bg-gray-700 rounded">1</button>
              <button className="px-3 py-1 bg-gray-800 rounded hover:bg-gray-700">2</button>
              <button className="px-3 py-1 bg-gray-800 rounded hover:bg-gray-700">3</button>
              <span className="px-2">...</span>
              <button className="px-3 py-1 bg-gray-800 rounded hover:bg-gray-700">18</button>
              <button className="px-3 py-1 bg-gray-800 rounded hover:bg-gray-700">→</button>
            </div>
          </div>
        </div>
      </div>

      {/* Manage Subscription Modal */}
      {selectedSub && (
        <ManageSubscriptionModal
          subscription={selectedSub}
          onClose={() => setSelectedSub(null)}
        />
      )}
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  color,
}: {
  title: string;
  value: string;
  icon: any;
  trend: "up" | "down" | "neutral";
  color: "green" | "red" | "yellow";
}) {
  const colors = {
    green: "text-emerald-400 bg-emerald-950/40 border-emerald-800/50",
    red: "text-red-400 bg-red-950/40 border-red-800/50",
    yellow: "text-amber-400 bg-amber-950/40 border-amber-800/50",
  };

  const icons = {
    up: <TrendingUp className="h-4 w-4 text-emerald-400" />,
    down: <AlertCircle className="h-4 w-4 text-red-400" />,
    neutral: null,
  };

  return (
    <div className={`bg-gray-900 border ${colors[color]} rounded-xl p-5 shadow-sm`}>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm text-gray-400">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${colors[color].split(" ")[1]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      {trend !== "neutral" && (
        <div className="mt-3 flex items-center gap-1 text-xs">
          {icons[trend]}
          <span>{trend === "up" ? "+12% this month" : "1 overdue"}</span>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: Subscription["status"] }) {
  const isActive = status === "active";
  return (
    <span
      className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${
        isActive
          ? "bg-emerald-950 text-emerald-400 border-emerald-800"
          : "bg-red-950 text-red-400 border-red-800"
      }`}
    >
      {isActive ? "active" : "payment failed"}
    </span>
  );
}

type ManageModalProps = {
  subscription: Subscription;
  onClose: () => void;
};

function ManageSubscriptionModal({ subscription, onClose }: ManageModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-md overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Manage Subscription</h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-800 rounded-full transition"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 text-sm">
          <div className="space-y-2">
            <div className="font-medium">Dealer: {subscription.dealer}</div>
            <div>Current Plan: <span className="font-medium">{subscription.plan}</span></div>
          </div>

          {/* Change Plan */}
          <div className="space-y-3">
            <label className="block text-gray-300 font-medium">Change Plan</label>
            <select className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gray-600">
              <option>Enterprise - CHF 2999/y</option>
              <option>Pro - CHF 999/y</option>
              <option>Basic - CHF 499/y</option>
            </select>
            <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 rounded-lg transition">
              Update Plan
            </button>
          </div>

          {/* Extend Subscription */}
          <div className="space-y-3 pt-4 border-t border-gray-800">
            <label className="block text-gray-300 font-medium">Extend Subscription</label>
            <input
              type="number"
              defaultValue={30}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gray-600"
              min={1}
            />
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition">
              Extend Subscription
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}