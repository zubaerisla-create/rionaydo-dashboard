"use client"

import { useState } from 'react'
import {
  Plus,
  UserPlus,
  Shield,
  Activity,
  Users,
  Loader2,
  X,
  AlertCircle,
  Mail,
  Lock
} from 'lucide-react'
import { useGetAdminsQuery, useCreateAdminMutation, AdminAccount } from '@/lib/adminApi'

function fmtDate(date: string) {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function AdminManagement() {
  const { data: admins, isLoading, isError } = useGetAdminsQuery();
  const [createAdmin, { isLoading: isCreating }] = useCreateAdminMutation();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'admin' as AdminAccount['role']
  });

  const adminList = admins?.results || [];

  const stats = {
    total: adminList.length,
    superAdmins: adminList.filter(a => a.role === 'super_admin').length,
    admins: adminList.filter(a => a.role === 'admin').length,
  }

  const roleColors = {
    super_admin: 'bg-amber-950/40 text-amber-400 border-amber-800/50',
    admin: 'bg-emerald-950/40 text-emerald-400 border-emerald-800/50',
    moderator: 'bg-blue-950/40 text-blue-400 border-blue-800/50',
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createAdmin(formData).unwrap();
      setShowCreateModal(false);
      setFormData({ email: '', password: '', role: 'admin' });
      alert("Administrator created successfully!");
    } catch (err) {
      alert("Failed to create administrator.");
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="mx-auto max-w-9xl space-y-8">
        <div className="sticky top-0 z-40 bg-gray-950 pt-6 pb-4 flex flex-col gap-8 border-b border-gray-800/50 shadow-md shadow-gray-950">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Administrator Management</h1>
              <p className="text-gray-400 text-sm mt-1">
                Maintain system security and staff access levels
              </p>
            </div>

            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition shadow-xl shadow-emerald-900/20 active:scale-95"
            >
              <Plus size={18} />
              Add Administrator
            </button>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              icon={Users}
              label="Total Staff"
              value={stats.total}
              color="text-cyan-400"
            />
            <StatCard
              icon={Shield}
              label="Super Admins"
              value={stats.superAdmins}
              color="text-amber-400"
            />
            <StatCard
              icon={Activity}
              label="Standard Admins"
              value={stats.admins}
              color="text-emerald-400"
            />
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-[#111113] border border-gray-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-900/50 border-b border-gray-800">
                <tr>
                  <th className="px-6 py-5 font-semibold text-gray-400 uppercase tracking-wider text-[10px]">Email Address</th>
                  <th className="px-6 py-5 font-semibold text-gray-400 uppercase tracking-wider text-[10px]">Access Level</th>
                  <th className="px-6 py-5 font-semibold text-gray-400 uppercase tracking-wider text-[10px]">Date Joined</th>
                  <th className="px-6 py-5 font-semibold text-gray-400 uppercase tracking-wider text-[10px] text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {isLoading && (
                  <tr>
                    <td colSpan={4} className="px-6 py-20 text-center">
                      <Loader2 className="h-8 w-8 text-emerald-500 animate-spin mx-auto" />
                    </td>
                  </tr>
                )}
                {isError && (
                  <tr>
                    <td colSpan={4} className="px-6 py-20 text-center text-red-400">
                      <div className="flex flex-col items-center gap-3">
                        <AlertCircle size={32} />
                        <p className="font-medium">Failed to load staff accounts.</p>
                      </div>
                    </td>
                  </tr>
                )}
                {!isLoading && !isError && adminList.map((admin) => (
                  <tr key={admin.id} className="hover:bg-gray-800/30 transition group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-400 border border-gray-700">
                          {admin.email.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-white">{admin.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${roleColors[admin.role] || roleColors.admin}`}>
                        {admin.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 font-medium">{fmtDate(admin.created_at)}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-white transition">
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create Admin Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-gray-800 flex items-center justify-between bg-gray-950/50">
              <div>
                <h2 className="text-lg font-bold text-white">New Administrator</h2>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Provision Staff Account</p>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="p-1.5 hover:bg-gray-800 rounded-lg transition text-gray-400">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Mail size={12} /> Email Address
                </label>
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="admin@example.com"
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Lock size={12} /> Secure Password
                </label>
                <input
                  required
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="••••••••"
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Shield size={12} /> Access Role
                </label>
                <select 
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value as AdminAccount['role']})}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                >
                  <option value="admin">Standard Administrator</option>
                  <option value="super_admin">Super Administrator</option>
                  <option value="moderator">Content Moderator</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isCreating}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all shadow-xl shadow-emerald-900/20 active:scale-95 mt-4"
              >
                {isCreating ? <Loader2 size={18} className="animate-spin" /> : <UserPlus size={18} />}
                Provision Account
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: any
  label: string
  value: number
  color: string
}) {
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
  )
}