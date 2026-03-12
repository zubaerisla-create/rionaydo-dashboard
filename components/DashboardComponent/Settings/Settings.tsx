// app/settings/system/page.tsx
// "use client" is needed because we are using controlled inputs + state

"use client"

import { useState } from 'react'

export default function SystemSettings() {

  const [form, setForm] = useState({
    minBidIncrement: "500",
    minReservePrice: "5000",
    basicPlan: "299",
    proPlan: "999",
    enterprisePlan: "2999",
    minAuctionHours: "24",
    maxAuctionHours: "168",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: send to backend / show toast / etc
    console.log("Saving settings:", form)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="mx-auto max-w-9xl space-y-10">

        {/* Title */}
        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold tracking-tight">System Settings</h1>
          <p className="text-gray-400 text-sm">
            Global configuration and system parameters
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">

          {/* Bidding Configuration */}
          <div className="bg-gray-900/70 border border-gray-800 rounded-xl overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-800">
              <h2 className="text-lg font-semibold flex items-center gap-2.5">
                <span className="text-emerald-400">$</span>
                Bidding Configuration
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

          {/* Subscription Pricing */}
          <div className="bg-gray-900/70 border border-gray-800 rounded-xl overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-800">
              <h2 className="text-lg font-semibold flex items-center gap-2.5">
                <span className="text-emerald-400">$</span>
                Subscription Pricing (Annual)
              </h2>
            </div>

            <div className="p-6 grid gap-6 sm:grid-cols-3">
              <SettingRow
                label="Basic Plan (CHF)"
                name="basicPlan"
                value={form.basicPlan}
                onChange={handleChange}
              />

              <SettingRow
                label="Pro Plan (CHF)"
                name="proPlan"
                value={form.proPlan}
                onChange={handleChange}
              />

              <SettingRow
                label="Enterprise Plan (CHF)"
                name="enterprisePlan"
                value={form.enterprisePlan}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Auction Duration Limits */}
          <div className="bg-gray-900/70 border border-gray-800 rounded-xl overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-800">
              <h2 className="text-lg font-semibold flex items-center gap-2.5">
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
                       text-white font-medium py-3.5 px-8 rounded-xl
                       transition-colors duration-150 shadow-lg shadow-emerald-950/40"
            >
              Save All Settings
            </button>
          </div>

        </form>
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