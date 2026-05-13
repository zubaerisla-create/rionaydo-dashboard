"use client";

import { useState } from "react";
import {
  Eye, Pause, Play, Flag, Trash2, X, Clock, Users,
  Gavel, ChevronLeft, ChevronRight, Loader2, AlertCircle,
  RefreshCw, TrendingUp, CheckCircle, AlertTriangle
} from "lucide-react";
import {
  useGetAuctionListQuery,
  useGetAuctionQuery,
  useGetAuctionBidsQuery,
  usePauseAuctionMutation,
  useResumeAuctionMutation,
  useFlagAuctionMutation,
  useUnflagAuctionMutation,
  useRemoveAuctionMutation,
  AuctionListItem,
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

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    active: "bg-emerald-950 text-emerald-400 border-emerald-800",
    sold: "bg-blue-950 text-blue-400 border-blue-800",
    unsold: "bg-gray-800 text-gray-400 border-gray-700",
    paused: "bg-amber-950 text-amber-400 border-amber-800",
    removed: "bg-red-950 text-red-400 border-red-800",
  };
  return (
    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${colors[status] ?? colors.unsold}`}>
      {status}
    </span>
  );
}

// ── Flag Modal ───────────────────────────────────────────────────────────────

function FlagModal({ auctionId, onClose, onConfirm }: { auctionId: number; onClose: () => void; onConfirm: (data: { severity: string; behaviour_type: string; description: string }) => void }) {
  const [formData, setFormData] = useState({
    severity: 'medium',
    behaviour_type: 'misleading_listing',
    description: ''
  });

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-5 border-b border-gray-800 flex items-center justify-between bg-gray-950/50">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Flag size={18} className="text-purple-400" /> Flag Auction
            </h2>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Specify violation details</p>
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
              onChange={(e) => setFormData({ ...formData, behaviour_type: e.target.value })}
              className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-colors"
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
                  onClick={() => setFormData({ ...formData, severity: s.value })}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all ${formData.severity === s.value
                      ? "bg-purple-900/40 border-purple-500 text-purple-300 shadow-lg shadow-purple-900/20"
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
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Provide details about why this auction is being flagged..."
              className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-colors resize-none"
            />
          </div>

          <button
            onClick={() => onConfirm(formData)}
            disabled={!formData.description}
            className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all shadow-xl shadow-purple-900/20 active:scale-95 mt-4"
          >
            <AlertTriangle size={18} />
            Flag Auction Now
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Bid History Panel ─────────────────────────────────────────────────────────

function BidHistory({ auctionId }: { auctionId: number }) {
  const [bidPage, setBidPage] = useState(1);
  const { data, isLoading, isError } = useGetAuctionBidsQuery({ auctionId, page: bidPage });
  const totalPages = data ? Math.ceil(data.count / 8) : 1;

  if (isLoading) return <div className="flex justify-center py-8"><Loader2 size={20} className="text-emerald-400 animate-spin" /></div>;
  if (isError) return <div className="text-red-400 text-sm py-4 flex items-center gap-2"><AlertCircle size={16} /> Failed to load bids.</div>;
  if (!data?.results.length) return <div className="text-gray-500 text-sm py-4 text-center">No bids yet.</div>;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-500">{data.count} total bids</span>
        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <button onClick={() => setBidPage(p => Math.max(1, p - 1))} disabled={!data.previous} className="p-1 bg-gray-800 rounded hover:bg-gray-700 disabled:opacity-40"><ChevronLeft size={13} /></button>
            <span className="text-xs text-gray-400 px-2">{bidPage}/{totalPages}</span>
            <button onClick={() => setBidPage(p => p + 1)} disabled={!data.next} className="p-1 bg-gray-800 rounded hover:bg-gray-700 disabled:opacity-40"><ChevronRight size={13} /></button>
          </div>
        )}
      </div>
      {data.results.map((bid, i) => (
        <div key={i} className="flex justify-between items-center bg-gray-950 p-3 rounded-lg border border-gray-800 text-sm">
          <div>
            <div className="font-medium text-gray-200">{bid.bidder_email}</div>
            <div className="text-xs text-gray-500 mt-0.5">
              {new Date(bid.created_at).toLocaleString("en-GB")} · +{chf(bid.increment)}
            </div>
          </div>
          <div className="text-emerald-400 font-semibold">{chf(bid.amount)}</div>
        </div>
      ))}
    </div>
  );
}

// ── Auction Detail Modal ──────────────────────────────────────────────────────

function AuctionDetailModal({ auctionId, onClose }: { auctionId: number; onClose: () => void }) {
  const { data: auction, isLoading, isError } = useGetAuctionQuery(auctionId);
  const [tab, setTab] = useState<"info" | "bids">("info");
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [showFlagModal, setShowFlagModal] = useState(false);

  const [pause, { isLoading: pausing }] = usePauseAuctionMutation();
  const [resume, { isLoading: resuming }] = useResumeAuctionMutation();
  const [flag, { isLoading: flagging }] = useFlagAuctionMutation();
  const [unflag, { isLoading: unflagging }] = useUnflagAuctionMutation();
  const [remove, { isLoading: removing }] = useRemoveAuctionMutation();
  const [confirmRemove, setConfirmRemove] = useState(false);

  const notify = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const act = async (fn: () => Promise<any>, msg: string, close = false) => {
    try { await fn(); notify(msg); if (close) onClose(); }
    catch { notify("Action failed.", false); }
  };

  const handleFlagConfirm = async (details: any) => {
    setShowFlagModal(false);
    await act(() => flag({ id: auctionId, ...details }).unwrap(), "Auction flagged.");
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden relative">
          {toast && (
            <div className={`absolute top-4 right-4 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium shadow-lg ${toast.ok ? "bg-emerald-900 border border-emerald-700 text-emerald-300" : "bg-red-900 border border-red-700 text-red-300"}`}>
              {toast.ok ? <CheckCircle size={15} /> : <AlertCircle size={15} />} {toast.msg}
            </div>
          )}

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
            <div>
              <h2 className="text-lg font-semibold text-white">{auction?.title ?? "Auction Detail"}</h2>
              {auction && <p className="text-xs text-gray-500 mt-0.5">ID #{auction.id} · {auction.created_by_email}</p>}
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-gray-800 rounded-lg transition"><X size={18} className="text-gray-400" /></button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-800 px-6">
            {(["info", "bids"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`py-3 px-4 text-sm font-medium capitalize border-b-2 transition ${tab === t ? "border-emerald-500 text-emerald-400" : "border-transparent text-gray-500 hover:text-gray-300"}`}>
                {t === "bids" && auction ? `Bids (${auction.bid_raise_count})` : t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto max-h-[55vh]">
            {isLoading && <div className="flex justify-center py-16"><Loader2 size={24} className="text-emerald-400 animate-spin" /></div>}
            {isError && <div className="flex items-center justify-center gap-2 text-red-400 py-16"><AlertCircle size={18} /> Failed to load auction.</div>}

            {auction && tab === "info" && (
              <div className="space-y-5">
                {/* Image */}
                {auction.images[0] && (
                  <img src={auction.images[0].url} alt={auction.title} className="w-full h-40 object-cover rounded-xl border border-gray-700" onError={e => (e.currentTarget.style.display = "none")} />
                )}

                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                  <StatusBadge status={auction.status} />
                  {auction.is_flagged && <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border bg-red-950 text-red-400 border-red-800">Flagged</span>}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {[
                    ["Brand", auction.vehicle_brand],
                    ["Model", auction.vehicle_model],
                    ["Year", auction.vehicle_year],
                    ["Mileage", `${auction.vehicle_mileage?.toLocaleString()} km`],
                    ["Fuel", auction.vehicle_fuel_type],
                    ["Category", auction.vehicle_category],
                    ["Location", auction.vehicle_location],
                    ["VIN", auction.vehicle_vin_number],
                    ["Reserve", chf(auction.reserve_price)],
                    ["Buy Now", chf(auction.buy_now_price)],
                    ["Highest Bid", chf(auction.current_highest_bid)],
                    ["Bidders", auction.bidder_count],
                    ["Views", auction.view_count],
                    ["Bid Raises", auction.bid_raise_count],
                    ["Ends At", fmt(auction.ends_at)],
                    ["Starts At", fmt(auction.starts_at)],
                  ].map(([label, val]) => (
                    <div key={String(label)} className="bg-gray-800/50 rounded-lg p-2.5">
                      <div className="text-xs text-gray-500 mb-0.5">{label}</div>
                      <div className="text-gray-200 font-medium capitalize">{String(val)}</div>
                    </div>
                  ))}
                </div>

                {auction.description && (
                  <div className="bg-gray-800/50 rounded-lg p-3">
                    <div className="text-xs text-gray-500 mb-1">Description</div>
                    <p className="text-sm text-gray-300 leading-relaxed">{auction.description}</p>
                  </div>
                )}
              </div>
            )}

            {auction && tab === "bids" && <BidHistory auctionId={auction.id} />}
          </div>

          {/* Actions */}
          {auction && !confirmRemove && (
            <div className="px-6 py-4 border-t border-gray-800 flex flex-wrap gap-2">
              {auction.status === "active" && (
                <ActionBtn label="Pause" icon={<Pause size={13} />} loading={pausing}
                  cls="bg-amber-900 hover:bg-amber-800 text-amber-300 border border-amber-700"
                  onClick={() => act(() => pause(auction.id).unwrap(), "Auction paused.")} />
              )}
              {auction.status === "paused" && (
                <ActionBtn label="Resume" icon={<Play size={13} />} loading={resuming}
                  cls="bg-emerald-900 hover:bg-emerald-800 text-emerald-300 border border-emerald-700"
                  onClick={() => act(() => resume(auction.id).unwrap(), "Auction resumed.")} />
              )}
              {!auction.is_flagged ? (
                <ActionBtn label="Flag" icon={<Flag size={13} />} loading={flagging}
                  cls="bg-purple-900 hover:bg-purple-800 text-purple-300 border border-purple-700"
                  onClick={() => setShowFlagModal(true)} />
              ) : (
                <ActionBtn label="Unflag" icon={<Flag size={13} />} loading={unflagging}
                  cls="bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700"
                  onClick={() => act(() => unflag(auction.id).unwrap(), "Auction unflagged.")} />
              )}
              <ActionBtn label="Remove" icon={<Trash2 size={13} />} loading={false}
                cls="bg-red-950 hover:bg-red-900 text-red-400 border border-red-800"
                onClick={() => setConfirmRemove(true)} />
            </div>
          )}

          {auction && confirmRemove && (
            <div className="px-6 py-4 border-t border-gray-800">
              <div className="bg-red-950 border border-red-800 rounded-xl p-4">
                <p className="text-sm text-red-300 mb-3">Remove this auction listing? This action cannot be undone.</p>
                <div className="flex gap-3">
                  <button onClick={() => act(() => remove(auction.id).unwrap(), "Auction removed.", true)} disabled={removing}
                    className="flex items-center gap-1.5 px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition disabled:opacity-50">
                    {removing ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />} Confirm Remove
                  </button>
                  <button onClick={() => setConfirmRemove(false)} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm transition">Cancel</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {showFlagModal && <FlagModal auctionId={auctionId} onClose={() => setShowFlagModal(false)} onConfirm={handleFlagConfirm} />}
    </>
  );
}

function ActionBtn({ label, icon, loading, cls, onClick }: { label: string; icon: React.ReactNode; loading: boolean; cls: string; onClick: () => void }) {
  return (
    <button onClick={onClick} disabled={loading} className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium transition disabled:opacity-50 ${cls}`}>
      {loading ? <Loader2 size={13} className="animate-spin" /> : icon} {label}
    </button>
  );
}

// ── Row Actions ───────────────────────────────────────────────────────────────

function AuctionRowActions({ auction, onView }: { auction: AuctionListItem; onView: () => void }) {
  const [pause, { isLoading: pausing }] = usePauseAuctionMutation();
  const [resume, { isLoading: resuming }] = useResumeAuctionMutation();

  return (
    <div className="flex items-center gap-1 justify-end">
      <button onClick={onView} title="View" className="p-1.5 hover:bg-gray-700 rounded-lg transition"><Eye size={15} className="text-gray-400" /></button>
      {auction.status === "active" && (
        <button onClick={() => pause(auction.id)} disabled={pausing} title="Pause" className="p-1.5 hover:bg-amber-900 rounded-lg transition disabled:opacity-50">
          {pausing ? <Loader2 size={14} className="text-amber-400 animate-spin" /> : <Pause size={14} className="text-amber-400" />}
        </button>
      )}
      {auction.status === "paused" && (
        <button onClick={() => resume(auction.id)} disabled={resuming} title="Resume" className="p-1.5 hover:bg-emerald-900 rounded-lg transition disabled:opacity-50">
          {resuming ? <Loader2 size={14} className="text-emerald-400 animate-spin" /> : <Play size={14} className="text-emerald-400" />}
        </button>
      )}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function AuctionsMonitor() {
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const { data, isLoading, isError, refetch, isFetching } = useGetAuctionListQuery({ page });
  const totalPages = data ? Math.ceil(data.count / 8) : 1;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-9xl mx-auto space-y-6 relative">
        <div className="sticky -top-10 z-40 bg-gray-950 pt-6 pb-4 flex flex-col gap-6 border-b border-gray-800/50 shadow-md shadow-gray-950">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Auctions Monitor</h1>
              <p className="text-gray-400 text-sm mt-1">Real-time auction oversight and control</p>
            </div>
            <button 
              onClick={() => refetch()} 
              disabled={isFetching}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-sm transition disabled:opacity-50"
            >
              <RefreshCw size={14} className={`text-gray-400 ${isFetching ? 'animate-spin' : ''}`} /> 
              {isFetching ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>

          {/* Stats */}
          {data && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Total", value: data.count, color: "text-cyan-400" },
                { label: "Active", value: data.results.filter(a => a.status === "active").length, color: "text-emerald-400" },
                { label: "Sold", value: data.results.filter(a => a.status === "sold").length, color: "text-blue-400" },
                { label: "Unsold", value: data.results.filter(a => a.status === "unsold").length, color: "text-gray-400" },
              ].map(s => (
                <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3">
                  <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
                  <div className="text-xs text-gray-500">{s.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Table */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-280px)] min-h-[400px]">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-800 sticky top-0 z-20 shadow-md">
                <tr>
                  <th className="px-6 py-4 font-medium text-gray-300">Vehicle</th>
                  <th className="px-6 py-4 font-medium text-gray-300">Seller</th>
                  <th className="px-6 py-4 font-medium text-gray-300">Highest Bid</th>
                  <th className="px-6 py-4 font-medium text-gray-300">Reserve</th>
                  <th className="px-6 py-4 font-medium text-gray-300 text-center">Bidders</th>
                  <th className="px-6 py-4 font-medium text-gray-300">Status</th>
                  <th className="px-6 py-4 font-medium text-gray-300">Ends At</th>
                  <th className="px-6 py-4 font-medium text-gray-300 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {isLoading && (
                  <tr><td colSpan={8} className="px-6 py-16 text-center"><Loader2 size={24} className="text-emerald-400 animate-spin mx-auto" /></td></tr>
                )}
                {isError && (
                  <tr><td colSpan={8} className="px-6 py-16 text-center text-red-400">
                    <div className="flex items-center justify-center gap-2"><AlertCircle size={18} /> Failed to load auctions.</div>
                  </td></tr>
                )}
                {data?.results.map(auction => (
                  <tr key={auction.id} className="hover:bg-gray-800/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-200">{auction.title}</div>
                      <div className="text-xs text-gray-500">{auction.vehicle_brand} · #{auction.id}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-xs">{auction.created_by_email}</td>
                    <td className="px-6 py-4 font-medium text-emerald-400">{chf(auction.current_highest_bid)}</td>
                    <td className="px-6 py-4 text-gray-300">{chf(auction.reserve_price)}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="flex items-center justify-center gap-1 text-gray-300">
                        <Users size={13} className="text-gray-500" /> {auction.total_bidders}
                      </span>
                    </td>
                    <td className="px-6 py-4"><StatusBadge status={auction.status} /></td>
                    <td className="px-6 py-4 text-gray-400 text-xs">
                      <div className="flex items-center gap-1"><Clock size={12} className="text-orange-400" /> {fmt(auction.ends_at)}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <AuctionRowActions auction={auction} onView={() => setSelectedId(auction.id)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {data && totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-800 text-sm text-gray-400">
              <div>Page {page} of {totalPages} ({data.count} auctions)</div>
              <div className="flex items-center gap-1">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={!data.previous} className="p-1.5 bg-gray-800 rounded-lg hover:bg-gray-700 disabled:opacity-40"><ChevronLeft size={15} /></button>
                <span className="px-3 py-1 bg-gray-700 rounded-lg">{page}</span>
                <button onClick={() => setPage(p => p + 1)} disabled={!data.next} className="p-1.5 bg-gray-800 rounded-lg hover:bg-gray-700 disabled:opacity-40"><ChevronRight size={15} /></button>
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedId !== null && (
        <AuctionDetailModal auctionId={selectedId} onClose={() => setSelectedId(null)} />
      )}
    </div>
  );
}
