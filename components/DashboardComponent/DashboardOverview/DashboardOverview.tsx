"use client";

import { TrendingUp, DollarSign, Users, Gavel, Zap, CheckCircle2, Activity, Loader2, PieChart } from 'lucide-react';
import { 
  useGetDashboardStatsQuery, 
  useGetAuctionTrendsQuery, 
  useGetRevenueTrendsQuery, 
  useGetPlanBreakdownQuery 
} from '@/lib/adminApi';

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useGetDashboardStatsQuery();
  const { data: auctionTrends, isLoading: trendsLoading } = useGetAuctionTrendsQuery();
  const { data: revenueTrends, isLoading: revLoading } = useGetRevenueTrendsQuery();
  const { data: planBreakdown, isLoading: planLoading } = useGetPlanBreakdownQuery();

  // ────────────────────────────────────────────────
  // Map API data to chart formats
  // ────────────────────────────────────────────────
  
  const revenueData = revenueTrends?.revenue_trends.map(item => ({
    month: item.month_label,
    value: parseFloat(item.revenue)
  })) || [];

  const auctionVolumeData = auctionTrends?.auction_volume.map(item => ({
    month: item.month_label,
    count: item.created_count
  })) || [];

  const maxRevenue = Math.max(...revenueData.map(d => d.value), 1000) * 1.2;
  const maxVolume = Math.max(...auctionVolumeData.map(d => d.count), 10) * 1.2;

  if (statsLoading || trendsLoading || revLoading || planLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-10 w-10 text-emerald-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-gray-100 font-sans">
      <div className="max-w-9xl mx-auto space-y-6">

        {/* ─── Top KPI cards ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          <KpiCard
            title="Total Revenue"
            value={parseFloat(stats?.total_revenue || "0").toLocaleString()}
            prefix="CHF"
            icon={<DollarSign className="h-5 w-5 text-emerald-400" />}
          />
          <KpiCard
            title="Active Dealers"
            value={stats?.active_dealers.toString() || "0"}
            icon={<Users className="h-5 w-5 text-cyan-400" />}
          />
          <KpiCard
            title="Total Auctions"
            value={stats?.total_auctions.toString() || "0"}
            icon={<Gavel className="h-5 w-5 text-violet-400" />}
          />

          {/* Mini cards in one block */}
          <div className="bg-[#111113] rounded-xl border border-gray-800/50 p-4 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <MiniKpi
              title="Live Auctions"
              value={stats?.live_auctions.toString() || "0"}
              icon={<Zap className="h-5 w-5 text-rose-400" />}
            />
            <MiniKpi
              title="Completed Sales"
              value={stats?.completed_sales.toString() || "0"}
              icon={<CheckCircle2 className="h-5 w-5 text-emerald-400" />}
            />
          </div>
        </div>

        {/* Average price and Plan Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <KpiCard
            title="Avg. Vehicle Price"
            value={parseFloat(stats?.avg_vehicle_price || "0").toLocaleString()}
            prefix="CHF"
            icon={<Activity className="h-5 w-5 text-indigo-400" />}
            className="lg:col-span-1"
          />
          
          {/* Plan Breakdown Card */}
          <div className="lg:col-span-2 bg-[#111113] rounded-xl border border-gray-800/50 p-5 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-purple-400" />
                <h3 className="font-semibold">Subscription Breakdown</h3>
              </div>
              <span className="text-xs text-gray-500">Active Plans</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {planBreakdown?.plans.map((plan, i) => (
                <div key={i} className="bg-gray-900/40 rounded-lg p-3 border border-gray-800/50">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-300">{plan.plan_name}</span>
                    <span className="text-xs text-emerald-400">{plan.percentage}%</span>
                  </div>
                  <div className="text-xl font-bold">{plan.total_subscribers}</div>
                  <div className="mt-2 w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${plan.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── Charts ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6">

          {/* Revenue Overview */}
          <div className="bg-[#111113] rounded-xl border border-gray-800/50 p-5 md:p-6">
            <h3 className="text-lg font-semibold mb-5">Revenue Overview</h3>
            
            <div className="flex">
              <div className="flex flex-col justify-between text-xs text-gray-500 pr-3 py-1 h-64">
                <span>{(maxRevenue).toLocaleString()}</span>
                <span>{(maxRevenue * 0.75).toLocaleString()}</span>
                <span>{(maxRevenue * 0.5).toLocaleString()}</span>
                <span>{(maxRevenue * 0.25).toLocaleString()}</span>
                <span>0</span>
              </div>
              
              <div className="flex-1 h-64 relative">
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div key={i} className="border-t border-gray-800/50 w-full h-0" />
                  ))}
                </div>

                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <polyline
                    points={revenueData
                      .map((d, i) => {
                        const x = (i / (Math.max(revenueData.length - 1, 1))) * 100;
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
                  
                  <polygon
                    points={`0,100 ${revenueData
                      .map((d, i) => {
                        const x = (i / (Math.max(revenueData.length - 1, 1))) * 100;
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

                <div className="absolute inset-0 flex justify-between items-end px-1">
                  {revenueData.map((d, i) => {
                    const bottom = (d.value / maxRevenue) * 100;
                    return (
                      <div key={i} className="relative group" style={{ height: `${bottom}%`, alignSelf: 'flex-end', width: `${100 / revenueData.length}%` }}>
                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-emerald-500 rounded-full group-hover:scale-150 transition-transform" />
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-emerald-400 text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-gray-700 z-10">
                          CHF {d.value.toLocaleString()}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex justify-between text-xs text-gray-500 mt-3 pl-12">
              {revenueData.map((d, i) => (
                <span key={i} className="w-8 text-center">{d.month}</span>
              ))}
            </div>
          </div>

          {/* Auction Volume */}
          <div className="bg-[#111113] rounded-xl border border-gray-800/50 p-5 md:p-6">
            <h3 className="text-lg font-semibold mb-5">Auction Volume</h3>
            
            <div className="flex">
              <div className="flex flex-col justify-between text-xs text-gray-500 pr-3 py-1 h-64">
                <span>{Math.round(maxVolume)}</span>
                <span>{Math.round(maxVolume * 0.75)}</span>
                <span>{Math.round(maxVolume * 0.5)}</span>
                <span>{Math.round(maxVolume * 0.25)}</span>
                <span>0</span>
              </div>
              
              <div className="flex-1 h-64 relative">
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div key={i} className="border-t border-gray-800/50 w-full h-0" />
                  ))}
                </div>

                <div className="absolute inset-0 flex items-end justify-around px-2">
                  {auctionVolumeData.map((item, i) => {
                    const heightPercent = (item.count / maxVolume) * 100;
                    return (
                      <div
                        key={i}
                        className="relative group flex-1 flex justify-center items-end h-full"
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-emerald-400 text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-gray-700 z-10">
                          {item.count} auctions
                        </div>
                        
                        <div
                          className="w-3/4 rounded-t transition-all duration-300 bg-emerald-700/70 group-hover:bg-emerald-600/80"
                          style={{ 
                            height: `${Math.max(heightPercent, 2)}%`,
                          }}
                        >
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex justify-between text-xs text-gray-500 mt-3 pl-12">
              {auctionVolumeData.map((d, i) => (
                <span key={i} className="w-8 text-center">{d.month}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Growth banner */}
        <div className="bg-gradient-to-r from-emerald-950/60 via-teal-950/40 to-emerald-950/60 rounded-xl border border-emerald-800/30 p-5 md:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-sm text-emerald-300/90">Current Performance</p>
            <p className="text-3xl font-bold text-emerald-400 tracking-tight">Active Growth</p>
          </div>
          <div className="bg-emerald-500/15 p-4 rounded-full">
            <TrendingUp className="h-7 w-7 text-emerald-400" />
          </div>
          <div className="text-right">
            <p className="text-sm text-emerald-300/90">Monitor analytics in real-time</p>
          </div>
        </div>
      </div>
    </div>
  );
}

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