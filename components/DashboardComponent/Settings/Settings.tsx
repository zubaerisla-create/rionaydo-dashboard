"use client"

import { useState, useEffect } from 'react'
import { useGetPlansQuery, useUpdatePlanPriceMutation } from '@/lib/adminApi'
import { Loader2, Save, AlertCircle, CheckCircle2 } from 'lucide-react'

export default function SystemSettings() {
  const { data: plans, isLoading: plansLoading } = useGetPlansQuery();
  const [updatePrice, { isLoading: isUpdating }] = useUpdatePlanPriceMutation();
  const [prices, setPrices] = useState<Record<string, string>>({});
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

  const [form, setForm] = useState({
    minBidIncrement: "500",
    minReservePrice: "5000",
    minAuctionHours: "24",
    maxAuctionHours: "168",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handlePriceChange = (plan: string, value: string) => {
    setPrices(prev => ({ ...prev, [plan]: value }));
  }

  const handleSavePrice = async (plan: string) => {
    try {
      await updatePrice({ plan, price: prices[plan] }).unwrap();
      notify("Price updated successfully!");
    } catch (err) {
      notify("Failed to update price.", false);
    }
  }

  const notify = (msg: string, ok = true) => {
    setStatus({ msg, ok });
    setTimeout(() => setStatus(null), 3000);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Saving global settings:", form)
    notify("Global settings saved (local simulation)");
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
                          type="text"
                          value={prices[plan.plan] || ""}
                          onChange={(e) => handlePriceChange(plan.plan, e.target.value)}
                          className="w-full bg-gray-950 border border-gray-800 rounded-lg pl-14 pr-4 py-3 text-white font-bold focus:outline-none focus:border-emerald-500/50 transition-colors"
                        />
                      </div>
                      <button
                        onClick={() => handleSavePrice(plan.plan)}
                        disabled={isUpdating}
                        className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-emerald-600 hover:text-white text-gray-300 font-bold py-2.5 rounded-lg transition-all text-xs uppercase tracking-widest"
                      >
                        <Save size={14} />
                        Save {plan.plan} Price
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Bidding Configuration */}
            <div className="bg-[#111113] border border-gray-800 rounded-2xl overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-800">
                <h2 className="text-lg font-bold flex items-center gap-2.5 text-white">
                  <span className="text-emerald-400">⚡</span>
                  Auction Dynamics
                </h2>
              </div>

              <div className="p-6 space-y-6">
                <SettingRow
                  label="Minimum Bid Increment (CHF)"
                  name="minBidIncrement"
                  value={form.minBidIncrement}
                  onChange={handleChange}
                />

                <SettingRow
                  label="Minimum Reserve Price (CHF)"
                  name="minReservePrice"
                  value={form.minReservePrice}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Auction Duration Limits */}
            <div className="bg-[#111113] border border-gray-800 rounded-2xl overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-800">
                <h2 className="text-lg font-bold flex items-center gap-2.5 text-white">
                  <span className="text-cyan-400">⏱</span>
                  Auction Duration Limits
                </h2>
              </div>

              <div className="p-6 grid gap-6 sm:grid-cols-2">
                <SettingRow
                  label="Minimum Duration (hours)"
                  name="minAuctionHours"
                  value={form.minAuctionHours}
                  onChange={handleChange}
                />

                <SettingRow
                  label="Maximum Duration (hours)"
                  name="maxAuctionHours"
                  value={form.maxAuctionHours}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Save button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800
                         text-white font-bold py-4 px-8 rounded-2xl
                         transition-all duration-150 shadow-xl shadow-emerald-950/20 uppercase tracking-widest text-sm"
              >
                Apply System Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}


// ──────────────────────────────────────────────

type SettingRowProps = {
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

function SettingRow({ label, name, value, onChange }: SettingRowProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm text-gray-400 font-medium">
        {label}
      </label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className="
          w-full bg-gray-800/70 border border-gray-700 rounded-lg
          px-4 py-3 text-gray-100 text-sm font-medium
          focus:outline-none focus:border-emerald-600/60 focus:ring-1 focus:ring-emerald-600/30
          transition-all duration-150
        "
      />
    </div>
  )
}