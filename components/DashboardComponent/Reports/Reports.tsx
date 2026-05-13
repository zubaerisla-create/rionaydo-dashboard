"use client";

import { useState, useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar, Pie } from "react-chartjs-2";
import { Download, FileText, FileBarChart, Loader2, AlertCircle } from "lucide-react";
import { 
  useGetDashboardStatsQuery, 
  useGetAuctionTrendsQuery, 
  useGetRevenueTrendsQuery, 
  useGetPlanBreakdownQuery 
} from "@/lib/adminApi";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

export default function AnalyticsDashboard() {
  const { data: stats, isLoading: statsLoading } = useGetDashboardStatsQuery();
  const { data: auctionTrends, isLoading: trendsLoading } = useGetAuctionTrendsQuery();
  const { data: revenueTrends, isLoading: revLoading } = useGetRevenueTrendsQuery();
  const { data: planBreakdown, isLoading: planLoading } = useGetPlanBreakdownQuery();

  const [reportType, setReportType] = useState("Revenue Report");
  const [dateRange, setDateRange] = useState("Last 30 Days");

  const reportTypes = [
    "Revenue Report",
    "Dealer Activity",
    "Auction Success Rate",
    "Monthly Sales",
  ];

  const ranges = ["Last 30 Days", "Last 90 Days", "This Year", "Custom"];

  // ── Data Mapping ────────────────────────────────────────────────────────────

  const revenueChartData = useMemo(() => {
    if (!revenueTrends) return { labels: [], datasets: [] };
    const labels = revenueTrends.revenue_trends.map(t => t.month_label);
    const data = revenueTrends.revenue_trends.map(t => parseFloat(t.revenue));
    return {
      labels,
      datasets: [{
        label: "Revenue (CHF)",
        data,
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.2)",
        tension: 0.4,
        fill: true,
      }],
    };
  }, [revenueTrends]);

  const volumeChartData = useMemo(() => {
    if (!auctionTrends) return { labels: [], datasets: [] };
    const labels = auctionTrends.auction_volume.map(t => t.month_label);
    const data = auctionTrends.auction_volume.map(t => t.created_count);
    return {
      labels,
      datasets: [{
        label: "Auction Volume",
        data,
        backgroundColor: "#10b981",
        borderColor: "#10b981",
        borderWidth: 1,
      }],
    };
  }, [auctionTrends]);

  const planChartData = useMemo(() => {
    if (!planBreakdown) return { labels: [], datasets: [] };
    return {
      labels: planBreakdown.plans.map(p => p.plan_name),
      datasets: [{
        data: planBreakdown.plans.map(p => p.total_subscribers),
        backgroundColor: ["#10b981", "#f59e0b", "#6b7280", "#3b82f6", "#ef4444"],
        borderWidth: 1,
      }],
    };
  }, [planBreakdown]);

  const isLoading = statsLoading || trendsLoading || revLoading || planLoading;

  const exportToCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";

    csvContent += "KPI Summary\n";
    csvContent += "Metric,Value\n";
    if (stats) {
      csvContent += `"Total Revenue (CHF)","${stats.total_revenue}"\n`;
      csvContent += `"Active Dealers","${stats.active_dealers}"\n`;
      csvContent += `"Total Auctions","${stats.total_auctions}"\n`;
      csvContent += `"Live Auctions","${stats.live_auctions}"\n`;
      csvContent += `"Completed Sales","${stats.completed_sales}"\n`;
      csvContent += `"Average Vehicle Price (CHF)","${stats.avg_vehicle_price}"\n`;
    }

    csvContent += "\nRevenue Trends\n";
    csvContent += "Month,Revenue (CHF)\n";
    revenueTrends?.revenue_trends.forEach(t => {
      csvContent += `"${t.month_label}",${t.revenue}\n`;
    });

    csvContent += "\nAuction Volume\n";
    csvContent += "Month,Auction Volume\n";
    auctionTrends?.auction_volume.forEach(t => {
      csvContent += `"${t.month_label}",${t.created_count}\n`;
    });

    csvContent += "\nPlan Breakdown\n";
    csvContent += "Plan,Subscribers,Percentage\n";
    planBreakdown?.plans.forEach(p => {
      csvContent += `"${p.plan_name}",${p.total_subscribers},"${p.percentage}%"\n`;
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "analytics_full_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.text("Analytics Full Report", 14, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

    autoTable(doc, {
      startY: 40,
      head: [["Metric", "Value"]],
      body: stats ? [
        ["Total Revenue (CHF)", stats.total_revenue],
        ["Active Dealers", stats.active_dealers.toString()],
        ["Total Auctions", stats.total_auctions.toString()],
        ["Live Auctions", stats.live_auctions.toString()],
        ["Completed Sales", stats.completed_sales.toString()],
        ["Average Vehicle Price (CHF)", stats.avg_vehicle_price],
      ] : [],
      theme: 'striped',
      headStyles: { fillColor: [16, 185, 129] },
      styles: { fontSize: 10 }
    });

    doc.addPage();
    doc.setFontSize(16);
    doc.text("Revenue Trends", 14, 22);
    autoTable(doc, {
      startY: 32,
      head: [["Month", "Revenue (CHF)"]],
      body: revenueTrends?.revenue_trends.map(t => [
        t.month_label,
        parseFloat(t.revenue).toLocaleString("de-CH", { minimumFractionDigits: 2 })
      ]) || [],
      theme: 'striped',
      headStyles: { fillColor: [16, 185, 129] },
      styles: { fontSize: 10 }
    });

    doc.addPage();
    doc.setFontSize(16);
    doc.text("Auction Volume", 14, 22);
    autoTable(doc, {
      startY: 32,
      head: [["Month", "Auction Volume"]],
      body: auctionTrends?.auction_volume.map(t => [t.month_label, t.created_count.toString()]) || [],
      theme: 'striped',
      headStyles: { fillColor: [16, 185, 129] },
      styles: { fontSize: 10 }
    });

    doc.addPage();
    doc.setFontSize(16);
    doc.text("Plan Breakdown", 14, 22);
    autoTable(doc, {
      startY: 32,
      head: [["Plan", "Subscribers", "Percentage"]],
      body: planBreakdown?.plans.map(p => [p.plan_name, p.total_subscribers.toString(), `${p.percentage}%`]) || [],
      theme: 'striped',
      headStyles: { fillColor: [16, 185, 129] },
      styles: { fontSize: 10 }
    });

    doc.save("analytics_full_report.pdf");
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-9xl mx-auto space-y-8">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gray-600 min-w-[220px] appearance-none"
              >
                {reportTypes.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </div>

            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gray-600 min-w-[160px]"
            >
              {ranges.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3">
            <button onClick={exportToCSV} className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-sm transition font-bold uppercase tracking-widest text-[10px]">
              <Download size={14} /> Export CSV
            </button>
            <button onClick={exportToPDF} className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-sm transition font-bold uppercase tracking-widest text-[10px]">
              <FileBarChart size={14} /> Export PDF
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <KpiCard
            title="Total Revenue"
            value={stats ? `CHF ${(parseFloat(stats.total_revenue) / 1000000).toFixed(2)}M` : "—"}
            change="Gross lifetime revenue"
            color="text-yellow-400"
            isLoading={statsLoading}
          />
          <KpiCard
            title="Active Dealers"
            value={stats?.active_dealers?.toString() || "—"}
            change="Verified business accounts"
            color="text-emerald-400"
            isLoading={statsLoading}
          />
          <KpiCard
            title="Completed Sales"
            value={stats?.completed_sales?.toString() || "—"}
            change={`${stats?.live_auctions || 0} currently live`}
            color="text-emerald-400"
            isLoading={statsLoading}
          />
          <KpiCard
            title="Avg. Vehicle Price"
            value={stats ? `CHF ${(parseFloat(stats.avg_vehicle_price) / 1000).toFixed(1)}K` : "—"}
            change="Market average per unit"
            color="text-emerald-400"
            isLoading={statsLoading}
          />
        </div>

        {/* Main Chart Section */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-white">
              {reportType === "Revenue Report" || reportType === "Monthly Sales"
                ? "Revenue Performance"
                : reportType === "Auction Success Rate"
                ? "Inventory Volume"
                : "Dealer Subscription Breakdown"}
            </h2>
            {isLoading && <Loader2 className="animate-spin text-gray-500" size={20} />}
          </div>

          <div className="h-[400px]">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="animate-spin text-emerald-500" size={40} />
              </div>
            ) : reportType === "Revenue Report" || reportType === "Monthly Sales" ? (
              <Line
                data={revenueChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: {
                    y: { beginAtZero: true, grid: { color: "rgba(255,255,255,0.05)" }, ticks: { color: "#9ca3af" } },
                    x: { grid: { display: false }, ticks: { color: "#9ca3af" } },
                  },
                }}
              />
            ) : reportType === "Auction Success Rate" ? (
              <Bar
                data={volumeChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: {
                    y: { beginAtZero: true, grid: { color: "rgba(255,255,255,0.05)" }, ticks: { color: "#9ca3af" } },
                    x: { grid: { display: false }, ticks: { color: "#9ca3af" } },
                  },
                }}
              />
            ) : (
              <div className="flex flex-col md:flex-row gap-12 items-center justify-center h-full">
                <div className="w-72 h-72">
                  <Pie
                    data={planChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: true,
                      plugins: { legend: { display: false } },
                    }}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {planBreakdown?.plans.map((p, i) => (
                    <PlanLegend 
                      key={p.plan_name}
                      color={["#10b981", "#f59e0b", "#6b7280", "#3b82f6", "#ef4444"][i % 5]} 
                      label={p.plan_name} 
                      value={`${p.percentage}%`} 
                      dealers={p.total_subscribers} 
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({
  title,
  value,
  change,
  color,
  isLoading
}: {
  title: string;
  value: string;
  change: string;
  color: string;
  isLoading?: boolean;
}) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 relative overflow-hidden group hover:border-gray-700 transition-colors">
      <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
        <FileText size={48} />
      </div>
      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">{title}</p>
      {isLoading ? (
        <div className="h-8 w-24 bg-gray-800 animate-pulse rounded mt-1" />
      ) : (
        <p className={`text-2xl font-black tracking-tight ${color}`}>{value}</p>
      )}
      <p className="text-[10px] mt-2 text-gray-500 font-medium">{change}</p>
    </div>
  );
}

function PlanLegend({
  color,
  label,
  value,
  dealers,
}: {
  color: string;
  label: string;
  value: string;
  dealers: number;
}) {
  return (
    <div className="flex items-center gap-4 bg-gray-950 p-4 rounded-xl border border-gray-800 min-w-[200px]">
      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
      <div>
        <div className="text-xs font-bold text-white uppercase tracking-wider">{label}</div>
        <div className="text-[10px] text-gray-500 font-bold">
          {dealers} Dealers · {value}
        </div>
      </div>
    </div>
  );
}
