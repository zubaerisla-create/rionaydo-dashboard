"use client"

import { useState, useEffect } from 'react'
import {
  useGetPlansQuery,
  useUpdatePlanPriceMutation,
  useGetBidConfigQuery,
  useUpdateBidConfigMutation,
  useGetAuctionConfigQuery,
  useUpdateAuctionConfigMutation,
} from '@/lib/adminApi'
import { Loader2, Save, AlertCircle, CheckCircle2 } from 'lucide-react'

const formatDuration = (hours: number | undefined) => {
  if (hours === undefined) return "—";
  if (hours === 0) return "0 hours";
  
  const d = Math.floor(hours / 24);
  const h = hours % 24;
  
  if (d === 0) return `${h} ${h === 1 ? 'hour' : 'hours'}`;
  if (h === 0) return `${d} ${d === 1 ? 'day' : 'days'}`;
  
  return `${d} ${d === 1 ? 'day' : 'days'} ${h} ${h === 1 ? 'hour' : 'hours'}`;
};

export default function SystemSettings() {
  const { data: plans, isLoading: plansLoading } = useGetPlansQuery();
  const [updatePrice] = useUpdatePlanPriceMutation();
  
  // Bid Config
  const { data: bidConfig, isLoading: bidConfigLoading } = useGetBidConfigQuery();
  const [updateBidConfig, { isLoading: isBidConfigUpdating }] = useUpdateBidConfigMutation();
  
  // Auction Config
  const { data: auctionConfig, isLoading: auctionConfigLoading } = useGetAuctionConfigQuery();
  const [updateAuctionConfig, { isLoading: isAuctionConfigUpdating }] = useUpdateAuctionConfigMutation();

  const [prices, setPrices] = useState<Record<string, string>>({});
  const [updatingPlan, setUpdatingPlan] = useState<string | null>(null);
  const [bidIncrement, setBidIncrement] = useState<string>("");
  const [auctionDuration, setAuctionDuration] = useState({
    min: "",
    max: "",
  });
  const [status, setStatus] = useState<{ msg: string; ok: boolean } | null>(null);

  useEffect(() => {
    if (plans) {
      const p: Record<string, string> = {};
      plans.forEach(plan => {
        p[plan.plan] = plan.price;
      });
      setPrices(p);
    }
  }, [plans]);

  useEffect(() => {
    if (bidConfig) {
      setBidIncrement(bidConfig.min_bid_increment?.toString() || "");
    }
  }, [bidConfig]);

  useEffect(() => {
    if (auctionConfig) {
      setAuctionDuration({
        min: auctionConfig.min_auction_duration_hours?.toString() || "",
        max: auctionConfig.max_auction_duration_hours?.toString() || "",
      });
    }
  }, [auctionConfig]);

  const handlePriceChange = (plan: string, value: string) => {
    setPrices(prev => ({ ...prev, [plan]: value }));
  }

  const handleSavePrice = async (plan: string) => {
    const price = prices[plan]?.trim();

    if (!price || Number.isNaN(Number(price)) || Number(price) < 0) {
      notify("Please enter a valid plan price.", false);
      return;
    }

    setUpdatingPlan(plan);
    try {
      const updatedPlan = await updatePrice({ plan, price }).unwrap();
      setPrices(prev => ({ ...prev, [updatedPlan.plan]: updatedPlan.price }));
      notify("Price updated successfully!");
    } catch {
      notify("Failed to update price.", false);
    } finally {
      setUpdatingPlan(null);
    }
  }

  const handleSaveBidConfig = async () => {
    try {
      const minIncrement = parseInt(bidIncrement, 10);
      if (isNaN(minIncrement) || minIncrement < 0) {
        notify("Please enter a valid minimum bid increment.", false);
        return;
      }
      await updateBidConfig({ min_bid_increment: minIncrement }).unwrap();
      notify("Bid increment updated successfully!");
    } catch {
      notify("Failed to update bid increment.", false);
    }
  }

  const handleSaveAuctionConfig = async () => {
    try {
      const minHours = parseInt(auctionDuration.min, 10);
      const maxHours = parseInt(auctionDuration.max, 10);
      
      if (isNaN(minHours) || isNaN(maxHours) || minHours < 0 || maxHours < 0) {
        notify("Please enter valid auction duration values.", false);
        return;
      }

      if (minHours >= maxHours) {
        notify("Minimum duration must be less than maximum duration.", false);
        return;
      }

      await updateAuctionConfig({
        min_auction_duration_hours: minHours,
        max_auction_duration_hours: maxHours,
      }).unwrap();
      notify("Auction duration limits updated successfully!");
    } catch {
      notify("Failed to update auction duration limits.", false);
    }
  }

  const notify = (msg: string, ok = true) => {
    setStatus({ msg, ok });
    setTimeout(() => setStatus(null), 3000);
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="mx-auto max-w-9xl space-y-10">
        
        {/* Toast */}
        {status && (
          <div className={`fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium shadow-2xl animate-in fade-in slide-in-from-top-4 ${
            status.ok ? "bg-emerald-900/90 border border-emerald-700 text-emerald-300" : "bg-red-900/90 border border-red-700 text-red-300"
          }`}>
            {status.ok ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            {status.msg}
          </div>
        )}

        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold tracking-tight">System Settings</h1>
          <p className="text-gray-400 text-sm">
            Global configuration and subscription pricing parameters
          </p>
        </div>

        <div className="space-y-10 pb-10">
          {/* Subscription Pricing */}
          <div className="bg-[#111113] border border-gray-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-5 border-b border-gray-800 bg-gray-900/30">
              <h2 className="text-lg font-bold flex items-center gap-2.5 text-white">
                <span className="text-emerald-400 font-mono">$</span>
                Subscription Plans Pricing
              </h2>
            </div>

            <div className="p-6">
              {plansLoading ? (
                <div className="flex justify-center py-10"><Loader2 className="animate-spin text-emerald-500" /></div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {plans?.map((plan) => (
                    <div key={plan.id} className="p-5 bg-gray-900/50 border border-gray-800 rounded-xl space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="text-xs font-bold uppercase tracking-widest text-gray-500">{plan.plan} Plan</div>
                        <div className="text-[10px] font-mono text-gray-600">{plan.interval}ly</div>
                      </div>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm">{plan.currency.toUpperCase()}</span>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={prices[plan.plan] || ""}
                          onChange={(e) => handlePriceChange(plan.plan, e.target.value)}
                          className="w-full bg-gray-950 border border-gray-800 rounded-lg pl-14 pr-4 py-3 text-white font-bold focus:outline-none focus:border-emerald-500/50 transition-colors"
                        />
                      </div>
                      <button
                        onClick={() => handleSavePrice(plan.plan)}
                        disabled={updatingPlan !== null}
                        className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-emerald-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed text-gray-300 font-bold py-2.5 rounded-lg transition-all text-xs uppercase tracking-widest"
                      >
                        {updatingPlan === plan.plan ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                        {updatingPlan === plan.plan ? "Saving..." : `Save ${plan.plan} Price`}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-10">
            {/* Bidding Configuration - Auction Dynamics */}
            <div className="bg-[#111113] border border-gray-800 rounded-2xl overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-800 bg-gray-900/30">
                <h2 className="text-lg font-bold flex items-center gap-2.5 text-white">
                  <span className="text-emerald-400">⚡</span>
                  Auction Dynamics - Bid Configuration
                </h2>
              </div>

              <div className="p-6 space-y-6">
                {bidConfigLoading ? (
                  <div className="flex justify-center py-10"><Loader2 className="animate-spin text-emerald-500" /></div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <label className="block text-sm text-gray-400 font-medium">
                        Minimum Bid Increment (CHF)
                      </label>
                      <input
                        type="number"
                        value={bidIncrement}
                        onChange={(e) => setBidIncrement(e.target.value)}
                        className="
                          w-full bg-gray-800/70 border border-gray-700 rounded-lg
                          px-4 py-3 text-gray-100 text-sm font-medium
                          focus:outline-none focus:border-emerald-600/60 focus:ring-1 focus:ring-emerald-600/30
                          transition-all duration-150
                        "
                        min="0"
                      />
                  
                    </div>
                    <button
                      type="button"
                      onClick={handleSaveBidConfig}
                      disabled={isBidConfigUpdating}
                      className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-all text-sm uppercase tracking-widest"
                    >
                      <Save size={16} />
                      {isBidConfigUpdating ? "Saving..." : "Save Bid Configuration"}
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Auction Duration Limits */}
            <div className="bg-[#111113] border border-gray-800 rounded-2xl overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-800 bg-gray-900/30">
                <h2 className="text-lg font-bold flex items-center gap-2.5 text-white">
                  <span className="text-cyan-400">⏱</span>
                  Auction Duration Limits
                </h2>
              </div>

              <div className="p-6 space-y-6">
                {auctionConfigLoading ? (
                  <div className="flex justify-center py-10"><Loader2 className="animate-spin text-emerald-500" /></div>
                ) : (
                  <>
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label className="block text-sm text-gray-400 font-medium">
                          Minimum Duration (hours)
                        </label>
                        <input
                          type="number"
                          value={auctionDuration.min}
                          onChange={(e) => setAuctionDuration(prev => ({ ...prev, min: e.target.value }))}
                          className="
                            w-full bg-gray-800/70 border border-gray-700 rounded-lg
                            px-4 py-3 text-gray-100 text-sm font-medium
                            focus:outline-none focus:border-emerald-600/60 focus:ring-1 focus:ring-emerald-600/30
                            transition-all duration-150
                          "
                          min="0"
                        />
                        <p className="text-xs text-gray-500 mt-1">Minimum duration :  {formatDuration(auctionConfig?.min_auction_duration_hours)}</p>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm text-gray-400 font-medium">
                          Maximum Duration (hours)
                        </label>
                        <input
                          type="number"
                          value={auctionDuration.max}
                          onChange={(e) => setAuctionDuration(prev => ({ ...prev, max: e.target.value }))}
                          className="
                            w-full bg-gray-800/70 border border-gray-700 rounded-lg
                            px-4 py-3 text-gray-100 text-sm font-medium
                            focus:outline-none focus:border-emerald-600/60 focus:ring-1 focus:ring-emerald-600/30
                            transition-all duration-150
                          "
                          min="0"
                        />
                        <p className="text-xs text-gray-500 mt-1">Maximum duration :  {formatDuration(auctionConfig?.max_auction_duration_hours)}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleSaveAuctionConfig}
                      disabled={isAuctionConfigUpdating}
                      className="w-full flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-700 active:bg-cyan-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-all text-sm uppercase tracking-widest"
                    >
                      <Save size={16} />
                      {isAuctionConfigUpdating ? "Saving..." : "Save Auction Duration Limits"}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


// ──────────────────────────────────────────────

