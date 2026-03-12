// app/dashboard/page.tsx
// or pages/dashboard.tsx  ─ depending on whether you use app router or pages router

import { TrendingUp, DollarSign, Users, Gavel, Zap, CheckCircle2, Activity } from 'lucide-react';

export default function Dashboard() {
  // ────────────────────────────────────────────────
  // Sample data matching the image specifications
  // ────────────────────────────────────────────────
  const revenueData = [
    { month: 'Sep', value: 285000 },
    { month: 'Oct', value: 318000 },
    { month: 'Nov', value: 345000 },
    { month: 'Dec', value: 392000 },
    { month: 'Jan', value: 458000 },
    { month: 'Feb', value: 535000 },
    { month: 'Mar', value: 685000 },
  ];

  const auctionVolumeData = [
    { month: 'Sep', count: 120 },
    { month: 'Oct', count: 172 },
    { month: 'Nov', count: 198 },
    { month: 'Dec', count: 235 },
    { month: 'Jan', count: 262 },
    { month: 'Feb', count: 288 },
    { month: 'Mar', count: 325 },
  ];

  const maxRevenue = 800000; // Y-axis max for revenue
  const maxVolume = 600; // Y-axis max for auction volume

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-gray-100 font-sans">
      <div className="max-w-9xl mx-auto space-y-6">

        {/* ─── Top KPI cards ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          <KpiCard
            title="Total Revenue"
            value="2,847,950"
            prefix="CHF"
            icon={<DollarSign className="h-5 w-5 text-emerald-400" />}
          />
          <KpiCard
            title="Active Dealers"
            value="184"
            icon={<Users className="h-5 w-5 text-cyan-400" />}
          />
          <KpiCard
            title="Total Auctions"
            value="1256"
            icon={<Gavel className="h-5 w-5 text-violet-400" />}
          />

          {/* Mini cards in one block */}
          <div className="bg-[#111113] rounded-xl border border-gray-800/50 p-4 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <MiniKpi
              title="Live Auctions"
              value="23"
              icon={<Zap className="h-5 w-5 text-rose-400" />}
            />
            <MiniKpi
              title="Completed Sales"
              value="892"
              icon={<CheckCircle2 className="h-5 w-5 text-emerald-400" />}
            />
          </div>
        </div>

        {/* Average price standalone card */}
        <KpiCard
          title="Avg. Vehicle Price"
          value="42,500"
          prefix="CHF"
          icon={<Activity className="h-5 w-5 text-indigo-400" />}
          className="max-w-sm"
        />

        {/* ─── Charts ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6">

          {/* Revenue Overview */}
          <div className="bg-[#111113] rounded-xl border border-gray-800/50 p-5 md:p-6">
            <h3 className="text-lg font-semibold mb-5">Revenue Overview</h3>
            
            {/* Y-axis labels */}
            <div className="flex">
              <div className="flex flex-col justify-between text-xs text-gray-500 pr-3 py-1 h-64">
                <span>800,000</span>
                <span>600,000</span>
                <span>400,000</span>
                <span>200,000</span>
                <span>0</span>
              </div>
              
              {/* Chart area with line */}
              <div className="flex-1 h-64 relative">
                {/* Grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div key={i} className="border-t border-gray-800/50 w-full h-0" />
                  ))}
                </div>

                {/* SVG line chart */}
                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                  {/* Line */}
                  <polyline
                    points={revenueData
                      .map((d, i) => {
                        const x = (i / (revenueData.length - 1)) * 100;
                        const y = 100 - (d.value / maxRevenue) * 95;
                        return `${x},${y}`;
                      })
                      .join(' ')}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  
                  {/* Area under line */}
                  <polygon
                    points={`0,100 ${revenueData
                      .map((d, i) => {
                        const x = (i / (revenueData.length - 1)) * 100;
                        const y = 100 - (d.value / maxRevenue) * 95;
                        return `${x},${y}`;
                      })
                      .join(' ')} 100,100`}
                    fill="url(#revenueGradient)"
                    opacity="0.3"
                  />
                  
                  <defs>
                    <linearGradient id="revenueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Data points */}
                <div className="absolute inset-0 flex justify-between items-end px-1">
                  {revenueData.map((d, i) => {
                    const bottom = (d.value / maxRevenue) * 100;
                    return (
                      <div key={i} className="relative group" style={{ height: `${bottom}%`, alignSelf: 'flex-end' }}>
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-emerald-500 rounded-full group-hover:scale-150 transition-transform" />
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-emerald-400 text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-gray-700">
                          CHF {d.value.toLocaleString()}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* X-axis labels */}
            <div className="flex justify-between text-xs text-gray-500 mt-3 pl-12">
              {revenueData.map(d => (
                <span key={d.month}>{d.month}</span>
              ))}
            </div>
          </div>

          {/* Auction Volume - FIXED VERSION */}
          <div className="bg-[#111113] rounded-xl border border-gray-800/50 p-5 md:p-6">
            <h3 className="text-lg font-semibold mb-5">Auction Volume</h3>
            
            {/* Y-axis labels */}
            <div className="flex">
              <div className="flex flex-col justify-between text-xs text-gray-500 pr-3 py-1 h-64">
                <span>600</span>
                <span>480</span>
                <span>360</span>
                <span>240</span>
                <span>120</span>
                <span>0</span>
              </div>
              
              {/* Chart area with bars */}
              <div className="flex-1 h-64 relative">
                {/* Grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="border-t border-gray-800/50 w-full h-0" />
                  ))}
                </div>

                {/* Bars container - FIXED: Using flex with proper alignment */}
                <div className="absolute inset-0 flex items-end justify-around px-2">
                  {auctionVolumeData.map((item, i) => {
                    // Calculate height percentage based on max volume (600)
                    const heightPercent = (item.count / maxVolume) * 100;
                    const isCurrent = item.month === 'Mar';
                    
                    return (
                      <div
                        key={i}
                        className="relative group flex-1 flex justify-center items-end h-full"
                      >
                        {/* Tooltip */}
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-emerald-400 text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-gray-700 z-10">
                          {item.count} auctions
                        </div>
                        
                        {/* Bar - with explicit height from data */}
                        <div
                          className={`w-3/4 rounded-t transition-all duration-300 ${
                            isCurrent
                              ? 'bg-emerald-500 group-hover:bg-emerald-400'
                              : 'bg-emerald-700/70 group-hover:bg-emerald-600/80'
                          }`}
                          style={{ 
                            height: `${heightPercent}%`,
                            minHeight: '4px' // Ensure very small values are visible
                          }}
                        >
                          {/* Show count on bar for larger screens */}
                          <span className="hidden md:block text-[10px] text-center text-white/70 pt-1">
                            {item.count}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* DEBUG: Show data values (remove in production) */}
                <div className="absolute -bottom-6 left-0 right-0 flex justify-around text-[8px] text-gray-600">
                  {auctionVolumeData.map((item, i) => (
                    <span key={i}>{item.count}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* X-axis labels */}
            <div className="flex justify-between text-xs text-gray-500 mt-3 pl-12">
              {auctionVolumeData.map(d => (
                <span key={d.month}>{d.month}</span>
              ))}
            </div>

            {/* Data summary */}
            <div className="mt-4 pt-4 border-t border-gray-800/50 grid grid-cols-4 gap-2 text-xs">
              <div>
                <p className="text-gray-500">Total</p>
                <p className="text-emerald-400 font-semibold">1,600</p>
              </div>
              <div>
                <p className="text-gray-500">Peak</p>
                <p className="text-emerald-400 font-semibold">Mar (325)</p>
              </div>
              <div>
                <p className="text-gray-500">Average</p>
                <p className="text-emerald-400 font-semibold">228.6</p>
              </div>
              <div>
                <p className="text-gray-500">vs Max</p>
                <p className="text-emerald-400 font-semibold">54.2%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Growth banner */}
        <div className="bg-gradient-to-r from-emerald-950/60 via-teal-950/40 to-emerald-950/60 rounded-xl border border-emerald-800/30 p-5 md:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-sm text-emerald-300/90">Monthly Growth Rate</p>
            <p className="text-3xl font-bold text-emerald-400 tracking-tight">+12.5%</p>
          </div>
          <div className="bg-emerald-500/15 p-4 rounded-full">
            <TrendingUp className="h-7 w-7 text-emerald-400" />
          </div>
          <div className="text-right">
            <p className="text-sm text-emerald-300/90">Trending upward</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Reusable components ───
function KpiCard({
  title,
  value,
  prefix = '',
  icon,
  className = '',
}: {
  title: string;
  value: string;
  prefix?: string;
  icon: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-[#111113] rounded-xl border border-gray-800/50 p-5 flex flex-col ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-gray-400">{title}</p>
        <div className="bg-gray-800/60 p-2.5 rounded-lg">{icon}</div>
      </div>
      <p className="text-3xl font-bold tracking-tight">
        {prefix && <span className="text-2xl font-semibold mr-1">{prefix}</span>}
        {value}
      </p>
    </div>
  );
}

function MiniKpi({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3.5">
      <div className="bg-gray-800/60 p-2.5 rounded-lg">{icon}</div>
      <div>
        <p className="text-xs text-gray-400">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}