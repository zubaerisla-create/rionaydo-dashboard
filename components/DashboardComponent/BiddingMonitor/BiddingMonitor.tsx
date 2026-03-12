// app/monitoring/suspicious-bids/page.tsx
"use client";

import { useState } from "react";
import { Flag, EyeOff, AlertTriangle, X } from "lucide-react";

type SuspiciousActivity = {
  id: string;
  dealer: string;
  auction: string;
  behaviorType: string;
  description: string;
  severity: "high" | "medium" | "low";
  time: string;
};

const mockSuspiciousActivities: SuspiciousActivity[] = [
  {
    id: "s1",
    dealer: "Klaus Weber",
    auction: "2021 BMW M4 Competition",
    behaviorType: "Rapid Repeated Bids",
    description: "15 bids placed within 2 minutes",
    severity: "high",
    time: "3/5/2026, 12:17:39 AM",
  },
  {
    id: "s2",
    dealer: "Pierre Duboils",
    auction: "2019 Ferrari 488 GTB",
    behaviorType: "Unusual Bidding Pattern",
    description: "Bidding only on own listed vehicles",
    severity: "medium",
    time: "3/4/2026, 11:47:39 PM",
  },
  {
    id: "s3",
    dealer: "Hans Mueller",
    auction: "2020 Porsche 911 Turbo S",
    behaviorType: "Multiple IP Addresses",
    description: "Same user detected from 3 different IPs",
    severity: "medium",
    time: "3/4/2026, 10:47:39 PM",
  },
];

export default function SuspiciousBiddingDetection() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-9xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-amber-500" />
              <h1 className="text-2xl font-bold">Suspicious Bidding Detection</h1>
            </div>
            <p className="text-gray-400 text-sm mt-1.5">
              Monitor and flag unusual bidding patterns
            </p>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-800/60">
                <tr>
                  <th className="px-6 py-4 font-medium">Dealer</th>
                  <th className="px-6 py-4 font-medium">Auction</th>
                  <th className="px-6 py-4 font-medium">Behavior Type</th>
                  <th className="px-6 py-4 font-medium">Description</th>
                  <th className="px-6 py-4 font-medium">Severity</th>
                  <th className="px-6 py-4 font-medium">Time</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {mockSuspiciousActivities.map((item) => (
                  <tr
                    key={item.id}
                    className={`hover:bg-gray-800/40 transition-colors ${
                      selected === item.id ? "bg-gray-800/60" : ""
                    }`}
                  >
                    <td className="px-6 py-4 font-medium">{item.dealer}</td>
                    <td className="px-6 py-4 text-gray-300">{item.auction}</td>
                    <td className="px-6 py-4">{item.behaviorType}</td>
                    <td className="px-6 py-4 text-gray-300 max-w-md">
                      {item.description}
                    </td>
                    <td className="px-6 py-4">
                      <SeverityBadge severity={item.severity} />
                    </td>
                    <td className="px-6 py-4 text-gray-400">{item.time}</td>
                    <td className="px-6 py-4 text-right space-x-1">
                      <ActionButton icon={Flag} title="Flag / Review" color="amber" />
                      <ActionButton icon={EyeOff} title="Ignore / Dismiss" color="gray" />
                      <ActionButton icon={AlertTriangle} title="Escalate" color="red" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination (placeholder) */}
        <div className="flex items-center justify-between text-sm text-gray-400">
          <div>Showing 1–{mockSuspiciousActivities.length} of many suspicious events</div>
          <div className="flex items-center gap-1">
            <button
              className="px-3 py-1.5 bg-gray-800 rounded-md hover:bg-gray-700 disabled:opacity-50"
              disabled
            >
              ←
            </button>
            <button className="px-3 py-1.5 bg-gray-700 rounded-md">1</button>
            <button className="px-3 py-1.5 bg-gray-800 rounded-md hover:bg-gray-700">2</button>
            <button className="px-3 py-1.5 bg-gray-800 rounded-md hover:bg-gray-700">3</button>
            <span className="px-2">...</span>
            <button className="px-3 py-1.5 bg-gray-800 rounded-md hover:bg-gray-700">18</button>
            <button className="px-3 py-1.5 bg-gray-800 rounded-md hover:bg-gray-700">
              →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SeverityBadge({ severity }: { severity: "high" | "medium" | "low" }) {
  const styles = {
    high: "bg-red-950 text-red-400 border-red-800",
    medium: "bg-amber-950 text-amber-400 border-amber-800",
    low: "bg-blue-950 text-blue-400 border-blue-800",
  };

  return (
    <span
      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border capitalize ${styles[severity]}`}
    >
      {severity}
    </span>
  );
}

function ActionButton({
  icon: Icon,
  title,
  color,
}: {
  icon: any;
  title: string;
  color: "amber" | "gray" | "red";
}) {
  const colors = {
    amber: "text-amber-400 hover:bg-amber-950/40 hover:text-amber-300",
    gray: "text-gray-400 hover:bg-gray-700 hover:text-gray-300",
    red: "text-red-400 hover:bg-red-950/40 hover:text-red-300",
  };

  return (
    <button
      className={`p-1.5 rounded-md transition ${colors[color]}`}
      title={title}
    >
      <Icon size={16} />
    </button>
  );
}