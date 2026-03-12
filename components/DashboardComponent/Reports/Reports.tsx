// app/analytics/page.tsx
"use client";

import { useState } from "react";
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
import { Download, FileText, FileBarChart } from "lucide-react";

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

const months = ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];

const revenueData = {
  labels: months,
  datasets: [
    {
      label: "Revenue (CHF)",
      data: [220000, 280000, 320000, 400000, 480000, 580000, 684000],
      borderColor: "#10b981",
      backgroundColor: "rgba(16, 185, 129, 0.2)",
      tension: 0.4,
      fill: true,
    },
  ],
};

const volumeData = {
  labels: months,
  datasets: [
    {
      label: "Auction Volume",
      data: [140, 170, 190, 210, 230, 250, 120],
      backgroundColor: "#10b981",
      borderColor: "#10b981",
      borderWidth: 1,
    },
  ],
};

const planDistribution = {
  labels: ["Pro", "Enterprise", "Basic"],
  datasets: [
    {
      data: [46, 27, 24],
      backgroundColor: ["#10b981", "#f59e0b", "#6b7280"],
      borderWidth: 1,
    },
  ],
};

export default function AnalyticsDashboard() {
  const [reportType, setReportType] = useState("Revenue Report");
  const [dateRange, setDateRange] = useState("Last 30 Days");

  const reportTypes = [
    "Revenue Report",
    "Dealer Activity",
    "Auction Success Rate",
    "Monthly Sales",
  ];

  const ranges = ["Last 30 Days", "Last 90 Days", "This Year", "Custom"];

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
                className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gray-600 min-w-[220px]"
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
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-sm transition">
              <Download size={16} /> Export CSV
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-sm transition">
              <FileBarChart size={16} /> Export PDF
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <KpiCard
            title="Total Revenue"
            value="CHF 2.84M"
            change="+12.5% vs last month"
            color="text-yellow-400"
          />
          <KpiCard
            title="Active Dealers"
            value="184"
            change="+8 new this month"
            color="text-emerald-400"
          />
          <KpiCard
            title="Completed Sales"
            value="892"
            change="71% success rate"
            color="text-emerald-400"
          />
          <KpiCard
            title="Avg. Vehicle Price"
            value="CHF 42.5K"
            change="+5.2% vs last month"
            color="text-emerald-400"
          />
        </div>

        {/* Main Chart Section */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-5">
            {reportType === "Revenue Report" || reportType === "Monthly Sales"
              ? "Revenue Trend"
              : reportType === "Auction Success Rate"
              ? "Auction Volume"
              : "Dealer Activity / Subscription Plan Distribution"}
          </h2>

          <div className="h-80">
            {reportType === "Revenue Report" || reportType === "Monthly Sales" ? (
              <Line
                data={revenueData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: {
                    y: { beginAtZero: true, grid: { color: "#374151" } },
                    x: { grid: { display: false } },
                  },
                }}
              />
            ) : reportType === "Auction Success Rate" ? (
              <Bar
                data={volumeData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: {
                    y: { beginAtZero: true, grid: { color: "#374151" } },
                    x: { grid: { display: false } },
                  },
                }}
              />
            ) : (
              <div className="flex flex-col md:flex-row gap-8 items-center justify-center h-full">
                <div className="w-64 h-64">
                  <Pie
                    data={planDistribution}
                    options={{
                      responsive: true,
                      maintainAspectRatio: true,
                      plugins: { legend: { display: false } },
                    }}
                  />
                </div>

                <div className="space-y-4 text-sm">
                  <PlanLegend color="#10b981" label="Pro" value="46%" dealers={89} />
                  <PlanLegend color="#f59e0b" label="Enterprise" value="27.2%" dealers={50} />
                  <PlanLegend color="#6b7280" label="Basic" value="24.5%" dealers={45} />
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
}: {
  title: string;
  value: string;
  change: string;
  color: string;
}) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <p className="text-sm text-gray-400 mb-1">{title}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-xs mt-2 text-gray-400">{change}</p>
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
    <div className="flex items-center gap-3">
      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color }} />
      <div>
        <div className="font-medium">{label}</div>
        <div className="text-xs text-gray-400">
          {dealers} dealers • {value}
        </div>
      </div>
    </div>
  );
}