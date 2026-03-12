'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu, X, Home, Users, Settings, FileText, BarChart3,
  LogOut, Gavel, TrendingUp, Shield, HeadphonesIcon, Briefcase, User, Bell
} from 'lucide-react';

const sidebarItems = [
  { name: 'Overview', href: '/dashboard', icon: Home },
  { name: 'Dealers', href: '/dashboard/dealers', icon: Users },
  { name: 'Auctions', href: '/dashboard/auctions', icon: Gavel },
  { name: 'Bidding Monitor', href: '/dashboard/bidding-monitor', icon: TrendingUp },
  { name: 'Subscriptions', href: '/dashboard/subscriptions', icon: FileText },
  { name: 'Reports', href: '/dashboard/reports', icon: BarChart3 },
  { name: 'Support', href: '/dashboard/support', icon: HeadphonesIcon },
  { name: 'Compliance', href: '/dashboard/compliance', icon: Shield },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  { name: 'Admin Management', href: '/dashboard/admin-management', icon: Briefcase },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; }

        .layout-root {
          display: flex;
          height: 100vh;
          background: #080810;
          font-family: 'DM Sans', sans-serif;
          overflow: hidden;
        }

        /* ── Sidebar ── */
        .sidebar {
          position: fixed;
          inset-y: 0;
          left: 0;
          z-index: 50;
          width: 256px;
          background: #0C0C18;
          border-right: 1px solid rgba(255,255,255,0.04);
          display: flex;
          flex-direction: column;
          transform: translateX(-100%);
          transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
        }
        .sidebar.open { transform: translateX(0); }
        @media (min-width: 1024px) {
          .sidebar { position: static; transform: none; }
        }

        /* Subtle grid texture */
        .sidebar::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
          background-size: 24px 24px;
          pointer-events: none;
        }

        /* Logo */
        .sidebar-logo {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 72px;
          padding: 0 20px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          position: relative;
          z-index: 1;
          flex-shrink: 0;
        }
        .logo-mark {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .logo-icon {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 14px;
          color: #fff;
          letter-spacing: -0.5px;
          box-shadow: 0 0 20px rgba(34,197,94,0.35);
          flex-shrink: 0;
        }
        .logo-text h2 {
          font-family: 'Syne', sans-serif;
          font-size: 15px;
          font-weight: 700;
          color: #f0f0f0;
          margin: 0;
          line-height: 1.2;
          letter-spacing: -0.3px;
        }
        .logo-text p {
          font-size: 10px;
          font-weight: 400;
          color: #4b5563;
          margin: 0;
          letter-spacing: 0.8px;
          text-transform: uppercase;
        }
        .sidebar-close {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: rgba(255,255,255,0.05);
          border: none;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.15s;
        }
        .sidebar-close:hover { background: rgba(255,255,255,0.1); color: #e5e7eb; }
        @media (min-width: 1024px) { .sidebar-close { display: none; } }

        /* Nav */
        .sidebar-nav {
          flex: 1;
          padding: 12px 10px;
          overflow-y: auto;
          position: relative;
          z-index: 1;
        }
        .sidebar-nav::-webkit-scrollbar { width: 4px; }
        .sidebar-nav::-webkit-scrollbar-track { background: transparent; }
        .sidebar-nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 4px; }

        .nav-section-label {
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          color: #374151;
          padding: 10px 14px 6px;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 9px 14px;
          border-radius: 10px;
          margin-bottom: 2px;
          text-decoration: none;
          color: #6b7280;
          font-size: 13.5px;
          font-weight: 400;
          transition: all 0.18s;
          position: relative;
          overflow: hidden;
        }
        .nav-link::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 10px;
          opacity: 0;
          transition: opacity 0.18s;
          background: linear-gradient(90deg, rgba(34,197,94,0.08) 0%, transparent 100%);
        }
        .nav-link:hover { color: #d1d5db; background: rgba(255,255,255,0.04); }
        .nav-link.active {
          color: #4ade80;
          background: rgba(34,197,94,0.08);
          font-weight: 500;
        }
        .nav-link.active::before { opacity: 1; }
        .nav-link.active .nav-icon { color: #4ade80; }

        .nav-icon {
          width: 16px;
          height: 16px;
          flex-shrink: 0;
          color: #4b5563;
          transition: color 0.18s;
        }
        .nav-link:hover .nav-icon { color: #9ca3af; }

        .nav-active-dot {
          margin-left: auto;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #4ade80;
          box-shadow: 0 0 8px rgba(74,222,128,0.7);
          animation: pulse-dot 2s ease-in-out infinite;
          flex-shrink: 0;
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.75); }
        }

        /* Profile card at bottom */
        .sidebar-footer {
          padding: 12px 10px;
          border-top: 1px solid rgba(255,255,255,0.05);
          position: relative;
          z-index: 1;
          flex-shrink: 0;
        }

        .profile-card {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 12px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          text-decoration: none;
          transition: all 0.2s;
          margin-bottom: 6px;
        }
        .profile-card:hover {
          background: rgba(255,255,255,0.06);
          border-color: rgba(255,255,255,0.1);
        }
        .profile-avatar {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          background: linear-gradient(135deg, rgba(34,197,94,0.3) 0%, rgba(16,163,74,0.15) 100%);
          border: 1px solid rgba(34,197,94,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Syne', sans-serif;
          font-size: 12px;
          font-weight: 700;
          color: #4ade80;
          flex-shrink: 0;
        }
        .profile-info { flex: 1; min-width: 0; }
        .profile-name {
          font-size: 12.5px;
          font-weight: 500;
          color: #e5e7eb;
          line-height: 1.3;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .profile-role {
          font-size: 10px;
          color: #4b5563;
          letter-spacing: 0.3px;
        }
        .profile-chevron {
          width: 14px;
          height: 14px;
          color: #374151;
          flex-shrink: 0;
        }

        .logout-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 8px 12px;
          border-radius: 10px;
          background: none;
          border: none;
          cursor: pointer;
          text-decoration: none;
          color: #4b5563;
          font-size: 12.5px;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.18s;
          margin-bottom: 2px;
        }
        .logout-btn:hover { color: #f87171; background: rgba(239,68,68,0.07); }
        .logout-btn svg { width: 14px; height: 14px; flex-shrink: 0; }

        .sidebar-version {
          font-size: 9.5px;
          color: #1f2937;
          padding: 4px 12px 0;
          letter-spacing: 0.4px;
        }

        /* ── Main area ── */
        .main-area {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          min-width: 0;
        }

        /* Header */
        .topbar {
          height: 64px;
          background: #0A0A14;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          display: flex;
          align-items: center;
          padding: 0 24px;
          gap: 16px;
          flex-shrink: 0;
        }

        .mobile-menu-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          border-radius: 9px;
          background: rgba(255,255,255,0.05);
          border: none;
          color: #9ca3af;
          cursor: pointer;
          transition: all 0.15s;
          flex-shrink: 0;
        }
        .mobile-menu-btn:hover { background: rgba(255,255,255,0.09); color: #f0f0f0; }
        @media (min-width: 1024px) { .mobile-menu-btn { display: none; } }

        .topbar-welcome { flex: 1; }
        .topbar-welcome p:first-child {
          font-size: 13.5px;
          font-weight: 500;
          color: #e5e7eb;
          margin: 0;
        }
        .topbar-welcome p:last-child {
          font-size: 11px;
          color: #4b5563;
          margin: 0;
          letter-spacing: 0.3px;
        }

        .topbar-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .notif-btn {
          position: relative;
          width: 34px;
          height: 34px;
          border-radius: 9px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.06);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.15s;
          text-decoration: none;
        }
        .notif-btn:hover { background: rgba(255,255,255,0.08); color: #d1d5db; }
        .notif-badge {
          position: absolute;
          top: 7px;
          right: 7px;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #22c55e;
          border: 1.5px solid #0A0A14;
          box-shadow: 0 0 6px rgba(34,197,94,0.6);
        }

        .topbar-email {
          display: none;
          font-size: 12px;
          color: #374151;
        }
        @media (min-width: 640px) { .topbar-email { display: block; } }

        .topbar-avatar {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          background: linear-gradient(135deg, rgba(34,197,94,0.25) 0%, rgba(16,163,74,0.1) 100%);
          border: 1px solid rgba(34,197,94,0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Syne', sans-serif;
          font-size: 12px;
          font-weight: 700;
          color: #4ade80;
          flex-shrink: 0;
          cursor: pointer;
          transition: all 0.2s;
        }
        .topbar-avatar:hover {
          border-color: rgba(34,197,94,0.5);
          box-shadow: 0 0 12px rgba(34,197,94,0.2);
        }

        /* Content */
        .page-content {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
        }
        .page-content::-webkit-scrollbar { width: 5px; }
        .page-content::-webkit-scrollbar-track { background: transparent; }
        .page-content::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.07); border-radius: 4px; }

        /* Overlay for mobile */
        .sidebar-overlay {
          display: none;
          position: fixed;
          inset: 0;
          z-index: 40;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(2px);
        }
        .sidebar-overlay.show { display: block; }
        @media (min-width: 1024px) { .sidebar-overlay { display: none !important; } }
      `}</style>

      <div className="layout-root">
        {/* Mobile overlay */}
        <div
          className={`sidebar-overlay ${sidebarOpen ? 'show' : ''}`}
          onClick={() => setSidebarOpen(false)}
        />

        {/* Sidebar */}
        <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          {/* Logo */}
          <div className="sidebar-logo">
            <div className="logo-mark">
              <div className="logo-icon">SC</div>
              <div className="logo-text">
                <h2>SwissCarExchange</h2>
                <p>Admin Control</p>
              </div>
            </div>
            <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>
              <X size={14} />
            </button>
          </div>

          {/* Nav */}
          <nav className="sidebar-nav">
            <div className="nav-section-label">Main Menu</div>
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="nav-icon" />
                  {item.name}
                  {isActive && <span className="nav-active-dot" />}
                </Link>
              );
            })}
          </nav>

          {/* Footer / Profile */}
          <div className="sidebar-footer">
            <Link href="/dashboard/profile" className="profile-card" onClick={() => setSidebarOpen(false)}>
              <div className="profile-avatar">ZU</div>
              <div className="profile-info">
                <div className="profile-name">Zubaer Islam</div>
                <div className="profile-role">Super Admin</div>
              </div>
              <User size={14} className="profile-chevron" />
            </Link>

            <Link href="/login" className="logout-btn">
              <LogOut size={14} />
              Sign out
            </Link>

            <div className="sidebar-version">v2.0.1</div>
          </div>
        </aside>

        {/* Main */}
        <div className="main-area">
          <header className="topbar">
            <button className="mobile-menu-btn" onClick={() => setSidebarOpen(true)}>
              <Menu size={18} />
            </button>

            <div className="topbar-welcome">
              <p>Welcome back, Zubaer</p>
              <p>Super Admin · {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
            </div>

            <div className="topbar-right">
          
              <span className="topbar-email">zubaerislam703@gmail.com</span>
              <div className="topbar-avatar">ZA</div>
            </div>
          </header>

          <main className="page-content">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}