"use client";

import { useState } from "react";
import { 
  Flag, 
  AlertTriangle, 
  X, 
  EyeIcon, 
  Loader2, 
  AlertCircle,
  RefreshCw,
  Clock,
  CheckCircle,
  Users,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { 
  useGetFlaggedAuctionsQuery, 
  useFlagAuctionMutation,
  useGetAuctionQuery,
  FlaggedAuction
} from "@/lib/adminApi";

const FLAG_BEHAVIOURS = [
  { value: 'misleading_listing', label: 'Misleading Listing' },
  { value: 'fraudulent_activity', label: 'Fraudulent Activity' },
  { value: 'policy_violation', label: 'Policy Violation' },
  { value: 'suspicious_pricing', label: 'Suspicious Pricing' },
  { value: 'duplicate_listing', label: 'Duplicate Listing' },
  { value: 'inappropriate_content', label: 'Inappropriate Content' },
  { value: 'other', label: 'Other' },
];

const FLAG_SEVERITIES = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

function fmt(date: string | null | undefined) {
  if (!date) return "—";
  return new Date(date).toLocaleString("en-GB", {
    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

function chf(val: string | null | undefined) {
  if (!val) return "—";
  return `CHF ${parseFloat(val).toLocaleString("de-CH", { minimumFractionDigits: 2 })}`;
}

// ── Shared Modal Components (Internal to this file for now) ────────────────────

function FlagModal({ auctionId, initialData, onClose, onConfirm }: { auctionId: number; initialData?: any; onClose: () => void; onConfirm: (data: { severity: string; behaviour_type: string; description: string }) => void }) {
  const [formData, setFormData] = useState({
    severity: initialData?.flag_severity || 'medium',
    behaviour_type: initialData?.flag_behaviour_type || 'misleading_listing',
    description: initialData?.flag_description || ''
  });

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-5 border-b border-gray-800 flex items-center justify-between bg-gray-950/50">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Flag size={18} className="text-amber-400" /> Update Flag Details
            </h2>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Modify violation parameters</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-800 rounded-lg transition text-gray-400">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Behaviour Type</label>
            <select 
              value={formData.behaviour_type}
              onChange={(e) => setFormData({...formData, behaviour_type: e.target.value})}
              className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-colors"
            >
              {FLAG_BEHAVIOURS.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Severity Level</label>
            <div className="flex gap-2">
              {FLAG_SEVERITIES.map(s => (
                <button
                  key={s.value}
                  onClick={() => setFormData({...formData, severity: s.value})}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all ${
                    formData.severity === s.value 
                      ? "bg-amber-900/40 border-purple-500 text-amber-300 shadow-lg shadow-amber-900/20" 
                      : "bg-gray-950 border-gray-800 text-gray-500 hover:border-gray-700"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Description / Reason</label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Provide details about the suspicious activity..."
              className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-colors resize-none"
            />
          </div>

          <button
            onClick={() => onConfirm(formData)}
            disabled={!formData.description}
            className="w-full flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all shadow-xl shadow-amber-900/20 active:scale-95 mt-4"
          >
            <CheckCircle size={18} />
            Update Violation Info
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Bidding Monitor Page ──────────────────────────────────────────────────

export default function SuspiciousBiddingDetection() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, refetch } = useGetFlaggedAuctionsQuery({ page });
  const totalPages = data ? Math.ceil(data.count / 8) : 1;
  const [selectedAuctionId, setSelectedAuctionId] = useState<number | null>(null);
  const [flaggingAuctionId, setFlaggingAuctionId] = useState<number | null>(null);
  const [flagMutation] = useFlagAuctionMutation();

  const handleUpdateFlag = async (details: any) => {
    if (!flaggingAuctionId) return;
    try {
      await flagMutation({ id: flaggingAuctionId, ...details }).unwrap();
      setFlaggingAuctionId(null);
      refetch();
    } catch (err) {
      alert("Failed to update flag details.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-9xl mx-auto space-y-6">
        <div className="sticky -top-10 z-40 bg-gray-950 pt-6 pb-4 flex flex-col gap-6 border-b border-gray-800/50 shadow-md shadow-gray-950">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-amber-500" />
                <h1 className="text-2xl font-bold">Suspicious Bidding Detection</h1>
              </div>
              <p className="text-gray-400 text-sm mt-1.5">
                Review and manage flagged auctions with unusual behavior
              </p>
            </div>
            <button onClick={() => refetch()} className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-sm transition">
              <RefreshCw size={14} className="text-gray-400" /> Refresh
            </button>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatBox label="Total Flagged" value={data?.count || 0} color="text-amber-400" icon={Flag} />
            <StatBox label="High Severity" value={data?.results.filter(a => a.flag_severity === 'high').length || 0} color="text-red-400" icon={AlertTriangle} />
            <StatBox label="Active Violations" value={data?.results.filter(a => a.status === 'active').length || 0} color="text-cyan-400" icon={Users} />
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-[#111113] border border-gray-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-280px)] min-h-[400px]">
            <table className="w-full text-sm text-left">
              <thead className="bg-[#18181b] sticky top-0 z-20 shadow-md">
                <tr>
                  <th className="px-6 py-5 font-semibold text-gray-400 uppercase tracking-wider text-[10px]">Auction</th>
                  <th className="px-6 py-5 font-semibold text-gray-400 uppercase tracking-wider text-[10px]">Violation Type</th>
                  <th className="px-6 py-5 font-semibold text-gray-400 uppercase tracking-wider text-[10px]">Reasoning</th>
                  <th className="px-6 py-5 font-semibold text-gray-400 uppercase tracking-wider text-[10px]">Severity</th>
                  <th className="px-6 py-5 font-semibold text-gray-400 uppercase tracking-wider text-[10px]">Flagged At</th>
                  <th className="px-6 py-5 font-semibold text-gray-400 uppercase tracking-wider text-[10px] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {isLoading && (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center">
                      <Loader2 className="h-8 w-8 text-amber-500 animate-spin mx-auto" />
                    </td>
                  </tr>
                )}
                {isError && (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center text-red-400">
                      <div className="flex flex-col items-center gap-3">
                        <AlertCircle size={32} />
                        <p className="font-medium">Failed to load flagged activity.</p>
                      </div>
                    </td>
                  </tr>
                )}
                {!isLoading && !isError && data?.results.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-800/30 transition group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {item.images?.[0] ? (
                          <img src={item.images[0].url} alt="" className="w-8 h-8 rounded-lg object-cover border border-gray-700" />
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-[10px] font-bold text-gray-500 border border-gray-700">NA</div>
                        )}
                        <div className="flex flex-col">
                          <span className="font-medium text-white line-clamp-1">{item.title}</span>
                          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{item.vehicle_brand} · #{item.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-semibold text-gray-300 capitalize">{item.flag_behaviour_type.replace(/_/g, ' ')}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-xs max-w-xs truncate">
                      {item.flag_description || "No notes provided"}
                    </td>
                    <td className="px-6 py-4">
                      <SeverityBadge severity={item.flag_severity} />
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-[10px] font-bold">
                      {fmt(item.flag_created_at)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          onClick={() => setSelectedAuctionId(item.id)}
                          className="p-2 hover:bg-gray-800 rounded-lg transition text-gray-400 hover:text-white" title="Quick View">
                          <EyeIcon size={16} />
                        </button>
                        <button 
                          onClick={() => setFlaggingAuctionId(item.id)}
                          className="p-2 hover:bg-amber-950/40 rounded-lg transition text-amber-500 hover:text-amber-400" title="Update Flag">
                          <Flag size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {data && totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-800 text-sm text-gray-400">
              <div>Page {page} of {totalPages} ({data.count} items)</div>
              <div className="flex items-center gap-1">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={!data.previous} className="p-1.5 bg-gray-800 rounded-lg hover:bg-gray-700 disabled:opacity-40"><ChevronLeft size={15} /></button>
                <span className="px-3 py-1 bg-gray-700 rounded-lg">{page}</span>
                <button onClick={() => setPage(p => p + 1)} disabled={!data.next} className="p-1.5 bg-gray-800 rounded-lg hover:bg-gray-700 disabled:opacity-40"><ChevronRight size={15} /></button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Flag Update Modal */}
      {flaggingAuctionId && (
        <FlagModal 
          auctionId={flaggingAuctionId} 
          initialData={data?.results.find(a => a.id === flaggingAuctionId)}
          onClose={() => setFlaggingAuctionId(null)} 
          onConfirm={handleUpdateFlag} 
        />
      )}

      {/* Auction Overview Modal */}
      {selectedAuctionId && (
        <AuctionOverviewModal 
          auctionId={selectedAuctionId} 
          onClose={() => setSelectedAuctionId(null)} 
        />
      )}
    </div>
  );
}

function StatBox({ label, value, color, icon: Icon }: { label: string; value: number; color: string; icon: any }) {
  return (
    <div className="bg-[#111113] border border-gray-800/50 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
      <div className={`p-3 rounded-xl bg-gray-900 ${color} shadow-inner`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="text-2xl font-bold text-white tracking-tight">{value}</div>
        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">{label}</div>
      </div>
    </div>
  );
}

function SeverityBadge({ severity }: { severity: string }) {
  const styles: any = {
    high: "bg-red-950/40 text-red-400 border-red-800/50",
    medium: "bg-amber-950/40 text-amber-400 border-amber-800/50",
    low: "bg-blue-950/40 text-blue-400 border-blue-800/50",
  };
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-widest border ${styles[severity] || styles.low}`}>
      {severity}
    </span>
  );
}

// ── Integrated Overview Modal ──────────────────────────────────────────────────

function AuctionOverviewModal({ auctionId, onClose }: { auctionId: number; onClose: () => void }) {
  const { data: auction, isLoading } = useGetAuctionQuery(auctionId);
  
  if (isLoading) return null; 

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-gray-950/50">
          <div>
            <h2 className="text-lg font-bold text-white">{auction?.title || "Auction Overview"}</h2>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">ID #{auctionId}</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-800 rounded-lg transition"><X size={18} className="text-gray-400" /></button>
        </div>
        
        <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
          {auction?.images?.[0] && (
            <img src={auction.images[0].url} className="w-full h-48 object-cover rounded-xl border border-gray-800" alt="" />
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
             <StatMini label="Brand" value={auction?.vehicle_brand} />
             <StatMini label="Model" value={auction?.vehicle_model} />
             <StatMini label="Year" value={auction?.vehicle_year} />
             <StatMini label="Mileage" value={`${auction?.vehicle_mileage?.toLocaleString()} km`} />
             <StatMini label="High Bid" value={chf(auction?.current_highest_bid)} color="text-emerald-400" />
             <StatMini label="Reserve" value={chf(auction?.reserve_price)} />
             <StatMini label="Ends At" value={fmt(auction?.ends_at)} />
             <StatMini label="Seller" value={auction?.created_by_email} />
          </div>

          <div className="space-y-2">
            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Description</h3>
            <p className="text-sm text-gray-300 leading-relaxed bg-gray-950 p-4 rounded-xl border border-gray-800">
              {auction?.description || "No description provided."}
            </p>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-800 bg-gray-950/50 flex justify-end">
          <button onClick={onClose} className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-xl text-xs uppercase tracking-widest transition">
            Close Overview
          </button>
        </div>
      </div>
    </div>
  );
}

function StatMini({ label, value, color }: { label: string; value: any; color?: string }) {
  return (
    <div className="bg-gray-950 border border-gray-800 rounded-xl p-3 flex flex-col gap-0.5">
      <div className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{label}</div>
      <div className={`text-xs font-bold truncate ${color || "text-white"}`}>{value || "—"}</div>
    </div>
  );
}