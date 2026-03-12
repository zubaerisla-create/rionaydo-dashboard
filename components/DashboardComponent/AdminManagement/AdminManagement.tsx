// app/administrators/page.tsx
"use client"

import { useState } from 'react'
import {
  Plus,
  UserPlus,
  UserCircle,
  Mail,
  Shield,
  Activity,
  Users,
  Power,
  UserX,
} from 'lucide-react'

type Admin = {
  name: string
  email: string
  role: 'super admin' | 'manager' | 'moderator'
  status: 'Active' | 'Inactive'
  created: string
  lastLogin: string
}

const initialAdmins: Admin[] = [
  {
    name: 'Super Admin',
    email: 'admin@swisscar.ch',
    role: 'super admin',
    status: 'Inactive',
    created: '2025-01-01',
    lastLogin: '3/5/2026, 12:57:42 AM',
  },
  {
    name: 'Manager Admin',
    email: 'manager@swisscar.ch',
    role: 'manager',
    status: 'Active',
    created: '2025-02-01',
    lastLogin: '3/4/2026, 11:57:42 PM',
  },
  {
    name: 'Moderator',
    email: 'mod@swisscar.ch',
    role: 'moderator',
    status: 'Active',
    created: '2025-02-15',
    lastLogin: '3/4/2026, 10:57:42 PM',
  },
]

export default function AdminManagement() {
  const [admins, setAdmins] = useState(initialAdmins)
  const [showCreateModal, setShowCreateModal] = useState(false)

  const stats = {
    total: admins.length,
    active: admins.filter(a => a.status === 'Active').length,
    superAdmins: admins.filter(a => a.role === 'super admin').length,
  }

  const roleColors = {
    'super admin': 'bg-amber-950 text-amber-400 border-amber-800/70',
    manager: 'bg-emerald-950 text-emerald-400 border-emerald-800/70',
    moderator: 'bg-blue-950 text-blue-400 border-blue-800/70',
  }

  const statusColors = {
    Active: 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60',
    Inactive: 'bg-gray-800 text-gray-300 border-gray-700',
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 ">
      <div className="mx-auto max-w-9xl space-y-8">

        {/* Header + Create button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Administrator Management</h1>
            <p className="text-gray-400 text-sm mt-1">
              Create and manage admin accounts
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 rounded-lg font-medium transition shadow-md"
          >
            <Plus size={18} />
            Create Admin
          </button>
        </div>

        {/* Table */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-800/60">
                <tr>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Email</th>
                  <th className="px-6 py-4 font-medium">Role</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Created</th>
                  <th className="px-6 py-4 font-medium">Last Login</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {admins.map((admin, i) => (
                  <tr key={i} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium">{admin.name}</td>
                    <td className="px-6 py-4 text-gray-300">{admin.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${roleColors[admin.role]}`}
                      >
                        {admin.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${statusColors[admin.status]}`}
                      >
                        {admin.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400">{admin.created}</td>
                    <td className="px-6 py-4 text-gray-400">{admin.lastLogin}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        className={`text-sm font-medium hover:underline ${
                          admin.status === 'Active' ? 'text-red-400' : 'text-emerald-400'
                        }`}
                      >
                        {admin.status === 'Active' ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            icon={Users}
            label="Total Admins"
            value={stats.total}
            color="text-cyan-400"
          />
          <StatCard
            icon={Activity}
            label="Active Admins"
            value={stats.active}
            color="text-emerald-400"
          />
          <StatCard
            icon={Shield}
            label="Super Admins"
            value={stats.superAdmins}
            color="text-amber-400"
          />
        </div>
      </div>

      {/* Create Admin Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-800">
              <h2 className="text-xl font-semibold">Create New Administrator</h2>
              <p className="text-gray-400 text-sm mt-1">
                Enter the details of the new administrator.
              </p>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  defaultValue="John Doe"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-600/60"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  defaultValue="john@swisscar.ch"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-600/60"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  defaultValue="Secure password"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-600/60"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Role
                </label>
                <select className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-600/60">
                  <option>Super Admin</option>
                  <option>Manager</option>
                  <option>Moderator</option>
                </select>
              </div>
            </div>

            <div className="px-6 py-5 border-t border-gray-800">
              <button
                onClick={() => setShowCreateModal(false)}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-lg transition"
              >
                <UserPlus size={18} />
                Create Administrator
              </button>
            </div>
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
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-center gap-4">
      <div className={`p-3 rounded-lg ${color.replace('text-', 'bg-')}/10`}>
        <Icon className={`h-6 w-6 ${color}`} />
      </div>
      <div>
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-sm text-gray-400">{label}</div>
      </div>
    </div>
  )
}