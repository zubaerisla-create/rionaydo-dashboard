// app/auctions/live/page.tsx
"use client";

import { useState } from "react";
import {
  Eye,
  Pause,
  SquareX,
  Flag,
  Trash2,
  Play,
  Clock,
  Gavel,
  Users,
} from "lucide-react";

type Auction = {
  id: string;
  title: string;
  yearMakeModel: string;
  seller: string;
  currentBid: number;
  reserve: number;
  reserveMet: boolean;
  bidders: number;
  status: "live";
  timeLeft: string; // simplified string like "1h 59m"
  timeLeftSeconds?: number; // for potential countdown
};

const mockLiveAuctions: Auction[] = [
  {
    id: "a1",
    title: "2020 Porsche 911 Turbo S",
    yearMakeModel: "2020 Porsche 911 Turbo S",
    seller: "Hans Mueller",
    currentBid: 185000,
    reserve: 180000,
    reserveMet: true,
    bidders: 12,
    status: "live",
    timeLeft: "1h 59m",
    timeLeftSeconds: 7199,
  },
  {
    id: "a2",
    title: "2019 Ferrari 488 GTB",
    yearMakeModel: "2019 Ferrari 488 GTB",
    seller: "Pierre Duboils",
    currentBid: 245000,
    reserve: 250000,
    reserveMet: false,
    bidders: 8,
    status: "live",
    timeLeft: "4h 59m",
    timeLeftSeconds: 17939,
  },
  {
    id: "a3",
    title: "2021 BMW M4 Competition",
    yearMakeModel: "2021 BMW M4 Competition",
    seller: "Hans Mueller",
    currentBid: 78000,
    reserve: 75000,
    reserveMet: true,
    bidders: 15,
    status: "live",
    timeLeft: "0h 59m",
    timeLeftSeconds: 3540,
  },
];

export default function LiveAuctionsMonitor() {
  const [selectedAuction, setSelectedAuction] = useState<Auction | null>(null);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-9xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Live Auctions Monitor</h1>
          <p className="text-gray-400 text-sm mt-1">
            Real-time auction oversight and control
          </p>
        </div>

        {/* Table */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-800/60">
                <tr>
                  <th className="px-6 py-4 font-medium">Vehicle</th>
                  <th className="px-6 py-4 font-medium">Seller</th>
                  <th className="px-6 py-4 font-medium">Current Bid</th>
                  <th className="px-6 py-4 font-medium">Reserve</th>
                  <th className="px-6 py-4 font-medium">Bidders</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Time Left</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {mockLiveAuctions.map((auction) => (
                  <tr
                    key={auction.id}
                    className="hover:bg-gray-800/40 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium">{auction.yearMakeModel}</td>
                    <td className="px-6 py-4 text-gray-300">{auction.seller}</td>
                    <td className="px-6 py-4">
                      CHF {auction.currentBid.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        CHF {auction.reserve.toLocaleString()}
                        <ReserveBadge met={auction.reserveMet} />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">{auction.bidders}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={auction.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-orange-300">
                        <Clock size={15} /> {auction.timeLeft}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedAuction(auction)}
                        className="p-1.5 hover:bg-gray-700 rounded-md transition"
                        title="View details"
                      >
                        <Eye size={16} className="text-gray-400" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Simple pagination placeholder */}
        <div className="flex items-center justify-between text-sm text-gray-400">
          <div>Showing 1–{mockLiveAuctions.length} of many live auctions</div>
          <div className="flex gap-1">
            <button className="px-3 py-1 bg-gray-800 rounded hover:bg-gray-700 disabled:opacity-50" disabled>
              ←
            </button>
            <button className="px-3 py-1 bg-gray-700 rounded">1</button>
            <button className="px-3 py-1 bg-gray-800 rounded hover:bg-gray-700">2</button>
            <button className="px-3 py-1 bg-gray-800 rounded hover:bg-gray-700">3</button>
            <span>...</span>
            <button className="px-3 py-1 bg-gray-800 rounded hover:bg-gray-700">18</button>
            <button className="px-3 py-1 bg-gray-800 rounded hover:bg-gray-700">→</button>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedAuction && (
        <AuctionDetailModal
          auction={selectedAuction}
          onClose={() => setSelectedAuction(null)}
        />
      )}
    </div>
  );
}

function ReserveBadge({ met }: { met: boolean }) {
  return (
    <span
      className={`text-xs font-medium px-2 py-0.5 rounded-full border ${
        met
          ? "bg-emerald-950 text-emerald-400 border-emerald-800"
          : "bg-amber-950 text-amber-400 border-amber-800"
      }`}
    >
      {met ? "Met" : "Not Met"}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-950 text-red-400 border border-red-800">
      {status}
    </span>
  );
}

// ──────────────────────────────────────────────

type AuctionDetailModalProps = {
  auction: Auction;
  onClose: () => void;
};

function AuctionDetailModal({ auction, onClose }: AuctionDetailModalProps) {
  const bidHistory = [
    {
      bidder: "Pierre Duboils",
      amount: 185000,
      time: "3/5/2026, 12:39:53 AM",
      type: "manual",
    },
    {
      bidder: "Klaus Weber",
      amount: 182000,
      time: "3/5/2026, 12:34:53 AM",
      type: "auto",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-lg overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">{auction.title}</h2>
            <p className="text-sm text-gray-400 mt-0.5">
              Auction ID: {auction.id}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-800 rounded-full"
          >
            <SquareX size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-sm">
          <div className="grid grid-cols-2 gap-5">
            <div>
              <div className="text-gray-400 mb-1">Seller</div>
              <div className="font-medium">{auction.seller}</div>
            </div>
            <div>
              <div className="text-gray-400 mb-1">Status</div>
              <StatusBadge status={auction.status} />
            </div>

            <div>
              <div className="text-gray-400 mb-1">Current Bid</div>
              <div className="font-bold text-lg">
                CHF {auction.currentBid.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-gray-400 mb-1">Reserve Price</div>
              <div className="font-medium">
                CHF {auction.reserve.toLocaleString()}
              </div>
            </div>

            <div>
              <div className="text-gray-400 mb-1 flex items-center gap-1.5">
                <Users size={15} /> Total Bidders
              </div>
              <div>{auction.bidders}</div>
            </div>
            <div>
              <div className="text-gray-400 mb-1 flex items-center gap-1.5">
                <Clock size={15} /> Time Remaining
              </div>
              <div className="text-orange-300 font-medium">{auction.timeLeft}</div>
            </div>
          </div>

          {/* Bid History */}
          <div>
            <h3 className="text-base font-semibold mb-3">Bid History</h3>
            <div className="space-y-3">
              {bidHistory.map((bid, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center bg-gray-950 p-3 rounded-lg border border-gray-800"
                >
                  <div>
                    <div className="font-medium">{bid.bidder}</div>
                    <div className="text-xs text-gray-500">{bid.time} • {bid.type}</div>
                  </div>
                  <div className="text-emerald-400 font-medium">
                    CHF {bid.amount.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-5 border-t border-gray-800 flex flex-wrap gap-3 justify-end">
          <button className="flex items-center gap-1.5 px-4 py-2 bg-amber-950 hover:bg-amber-900 border border-amber-800 text-amber-300 rounded-lg text-sm font-medium transition">
            <Pause size={16} /> Pause Auction
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 bg-blue-950 hover:bg-blue-900 border border-blue-800 text-blue-300 rounded-lg text-sm font-medium transition">
            <Gavel size={16} /> Force Close
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 bg-purple-950 hover:bg-purple-900 border border-purple-800 text-purple-300 rounded-lg text-sm font-medium transition">
            <Flag size={16} /> Flag
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 bg-red-950 hover:bg-red-900 border border-red-800 text-red-300 rounded-lg text-sm font-medium transition">
            <Trash2 size={16} /> Remove Listing
          </button>
        </div>
      </div>
    </div>
  );
}