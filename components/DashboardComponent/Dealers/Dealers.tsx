"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { showToast } from "@/lib/toastSlice";
import {
  Search,
  Eye,
  CheckCircle,
  XCircle,
  Trash2,
  RefreshCw,
  ArrowUpCircle,
  ChevronLeft,
  ChevronRight,
  User,
  Phone,
  MapPin,
  Globe,
  FileText,
  Gavel,
  TrendingUp,
  Activity,
  X,
  Loader2,
  AlertCircle,
  Shield,
  Lock,
} from "lucide-react";
import {
  useGetUserListQuery,
  useGetUserQuery,
  useApproveUserMutation,
  useSuspendUserMutation,
  useDeleteUserMutation,
  useReactivateUserMutation,
  useUpgradeToDealerMutation,
  UserListItem,
} from "@/lib/adminApi";

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmt(date: string) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function statusColor(status: string) {
  switch (status) {
    case "approved":
      return "bg-emerald-950 text-emerald-400 border-emerald-800";
    case "pending":
      return "bg-amber-950 text-amber-400 border-amber-800";
    case "suspended":
      return "bg-red-950 text-red-400 border-red-800";
    default:
      return "bg-gray-800 text-gray-400 border-gray-700";
  }
}

function roleColor(role: string) {
  switch (role) {
    case "dealer":
      return "bg-purple-950 text-purple-400 border-purple-800";
    case "bidder":
      return "bg-blue-950 text-blue-400 border-blue-800";
    default:
      return "bg-gray-800 text-gray-400 border-gray-700";
  }
}

// ── User Detail Modal ─────────────────────────────────────────────────────────

function UserDetailModal({
  userId,
  onClose,
}: {
  userId: number;
  onClose: () => void;
}) {
  const { data: user, isLoading, isError } = useGetUserQuery(userId);
  const [approve, { isLoading: approvingUser }] = useApproveUserMutation();
  const [suspend, { isLoading: suspendingUser }] = useSuspendUserMutation();
  const [reactivate, { isLoading: reactivatingUser }] =
    useReactivateUserMutation();
  const [upgradeToDealer, { isLoading: upgradingUser }] =
    useUpgradeToDealerMutation();
  const [deleteUser, { isLoading: deletingUser }] = useDeleteUserMutation();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const dispatch = useDispatch();

  const handleAction = async (
    action: () => any,
    successMsg: string
  ) => {
    try {
      await action().unwrap();
      dispatch(showToast({ message: successMsg, type: "success" }));
    } catch (err: any) {
      dispatch(showToast({ 
        message: err?.data?.message || "Action failed. Please try again.", 
        type: "error" 
      }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <h2 className="text-lg font-semibold text-white">User Profile</h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-800 rounded-lg transition"
          >
            <X size={18} className="text-gray-400" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto max-h-[80vh]">
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={28} className="text-emerald-400 animate-spin" />
            </div>
          )}
          {isError && (
            <div className="flex items-center justify-center py-20 gap-2 text-red-400">
              <AlertCircle size={20} />
              <span>Failed to load user details.</span>
            </div>
          )}
          {user && (
            <div className="space-y-6">
              {/* Profile Header */}
              <div className="flex items-start gap-5">
                {user.profile.photo_url ? (
                  <img
                    src={user.profile.photo_url}
                    alt={user.profile.full_name}
                    className="w-16 h-16 rounded-xl object-cover border border-gray-700"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-900 to-emerald-950 border border-emerald-800 flex items-center justify-center">
                    <User size={24} className="text-emerald-400" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-white truncate">
                    {user.profile.full_name || user.profile.company || "—"}
                  </h3>
                  <p className="text-sm text-gray-400 mt-0.5">{user.email}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
               
                    <span
                      className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${statusColor(user.approval_status)}`}
                    >
                      {user.approval_status}
                    </span>
              
                  </div>
                </div>
              </div>

              {/* Details Sections */}
              <div className="space-y-6">
                {/* Account & Security */}
                <div>
                  <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-3 px-1">Account & Security</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <InfoRow
                      icon={<User size={14} />}
                      label="User Type"
                      value={<span className="capitalize font-medium">{user.user_type}</span>}
                    />
                    <InfoRow
                      icon={<Shield size={14} />}
                      label="UID"
                      value={user.profile.uid || "—"}
                    />
                    <InfoRow
                      icon={<CheckCircle size={14} />}
                      label="Email Status"
                      value={
                        <span className={user.is_email_verified ? "text-emerald-400" : "text-amber-400"}>
                          {user.is_email_verified ? "Verified" : "Unverified"}
                        </span>
                      }
                    />
                    <InfoRow
                      icon={<Lock size={14} />}
                      label="Two-Factor Auth"
                      value={user.is_two_factor_enabled ? <span className="text-emerald-400">Enabled</span> : <span className="text-gray-500">Disabled</span>}
                    />
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-3 px-1">Contact Information</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <InfoRow
                      icon={<Phone size={14} />}
                      label="Phone Number"
                      value={user.profile.phone || "—"}
                    />
                    <InfoRow
                      icon={<Globe size={14} />}
                      label="Website"
                      value={user.profile.website ? (
                        <a href={user.profile.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                          {user.profile.website}
                        </a>
                      ) : "—"}
                    />
                    <div className="sm:col-span-2">
                      <InfoRow
                        icon={<MapPin size={14} />}
                        label="Primary Address"
                        value={user.profile.address || "—"}
                      />
                    </div>
                  </div>
                </div>

                {/* Company & Documents */}
                {(user.profile.company || user.profile.license_url || user.profile.id_document_url) && (
                  <div>
                    <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-3 px-1">Company & Verification</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {user.profile.company && (
                        <div className="sm:col-span-2">
                          <InfoRow
                            icon={<Activity size={14} />}
                            label="Registered Company"
                            value={user.profile.company}
                          />
                        </div>
                      )}
                      {user.profile.license_url && (
                        <a
                          href={user.profile.license_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 bg-gray-800/40 hover:bg-gray-800/60 border border-gray-700/50 rounded-xl p-3 transition group"
                        >
                          <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg group-hover:scale-110 transition-transform">
                            <FileText size={18} />
                          </div>
                          <div>
                            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Business License</div>
                            <div className="text-sm text-blue-400 font-medium">View Document</div>
                          </div>
                        </a>
                      )}
                      {user.profile.id_document_url && (
                        <a
                          href={user.profile.id_document_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 bg-gray-800/40 hover:bg-gray-800/60 border border-gray-700/50 rounded-xl p-3 transition group"
                        >
                          <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg group-hover:scale-110 transition-transform">
                            <FileText size={18} />
                          </div>
                          <div>
                            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">ID Verification</div>
                            <div className="text-sm text-purple-400 font-medium">View Document</div>
                          </div>
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Statistics */}
                <div>
                  <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-3 px-1">Activity Metrics</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <StatMini label="Total Bids" value={user.stats.total_bids} icon={<Gavel size={16} />} color="text-blue-400" />
                    <StatMini label="Wins" value={user.stats.auctions_won} icon={<TrendingUp size={16} />} color="text-emerald-400" />
                    <StatMini label="Created" value={user.stats.auctions_created} icon={<Activity size={16} />} color="text-purple-400" />
                    <StatMini label="Active" value={user.stats.active_auctions} icon={<RefreshCw size={16} />} color="text-amber-400" />
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-800/50">
                   <p className="text-[10px] text-gray-600 font-medium">Member since {fmt(user.created_at)}</p>
                </div>
              </div>

              {/* Confirm Delete */}
              {confirmDelete && (
                <div className="bg-red-950 border border-red-800 rounded-xl p-4">
                  <p className="text-sm text-red-300 mb-3">
                    Are you sure you want to permanently delete this user? This action cannot be undone.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={async () => {
                        await handleAction(
                          () => deleteUser(user.id),
                          "User deleted successfully."
                        );
                        setConfirmDelete(false);
                        onClose();
                      }}
                      disabled={deletingUser}
                      className="flex items-center gap-1.5 px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition disabled:opacity-50"
                    >
                      {deletingUser ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                      Confirm Delete
                    </button>
                    <button
                      onClick={() => setConfirmDelete(false)}
                      className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm font-medium transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {user && !confirmDelete && (
          <div className="px-6 py-4 border-t border-gray-800 flex flex-wrap gap-2">
            {user.approval_status === "pending" && (
              <ActionBtn
                label="Approve User"
                icon={<CheckCircle size={14} />}
                colorClass="bg-emerald-700 hover:bg-emerald-600 text-white"
                loading={approvingUser}
                onClick={() => handleAction(() => approve(user.id), "User approved!")}
              />
            )}
            {user.approval_status === "approved" && user.is_active && (
              <ActionBtn
                label="Suspend User"
                icon={<XCircle size={14} />}
                colorClass="bg-amber-900 hover:bg-amber-800 text-amber-300 border border-amber-700"
                loading={suspendingUser}
                onClick={() => handleAction(() => suspend(user.id), "User suspended.")}
              />
            )}
            {!user.is_active && (
              <ActionBtn
                label="Reactivate User"
                icon={<RefreshCw size={14} />}
                colorClass="bg-blue-900 hover:bg-blue-800 text-blue-300 border border-blue-700"
                loading={reactivatingUser}
                onClick={() => handleAction(() => reactivate(user.id), "User reactivated!")}
              />
            )}
       
            <ActionBtn
              label="Delete User"
              icon={<Trash2 size={14} />}
              colorClass="bg-red-950 hover:bg-red-900 text-red-400 border border-red-800"
              loading={false}
              onClick={() => setConfirmDelete(true)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2.5 bg-gray-800/50 rounded-lg p-3">
      <span className="text-gray-400 mt-0.5 flex-shrink-0">{icon}</span>
      <div>
        <div className="text-xs text-gray-500 mb-0.5">{label}</div>
        <div className="text-sm text-gray-200">{value}</div>
      </div>
    </div>
  );
}

function StatMini({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-3 flex flex-col gap-1">
      <span className={`${color}`}>{icon}</span>
      <div className="text-xl font-bold text-white">{value}</div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  );
}

function ActionBtn({
  label,
  icon,
  colorClass,
  loading,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  colorClass: string;
  loading: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium transition disabled:opacity-50 ${colorClass}`}
    >
      {loading ? <Loader2 size={13} className="animate-spin" /> : icon}
      {label}
    </button>
  );
}

// ── Inline Row Actions ────────────────────────────────────────────────────────

function RowActions({
  user,
  onView,
}: {
  user: UserListItem;
  onView: () => void;
}) {
  const [approve, { isLoading: ap }] = useApproveUserMutation();
  const [suspend, { isLoading: su }] = useSuspendUserMutation();
  const [reactivate, { isLoading: re }] = useReactivateUserMutation();
  const dispatch = useDispatch();

  const handleInlineAction = async (action: () => any, msg: string) => {
    try {
      await action().unwrap();
      dispatch(showToast({ message: msg, type: "success" }));
    } catch (err: any) {
      dispatch(showToast({ 
        message: err?.data?.message || "Action failed.", 
        type: "error" 
      }));
    }
  };

  return (
    <div className="flex items-center gap-1.5 justify-end">
      <button
        onClick={onView}
        title="View details"
        className="p-1.5 hover:bg-gray-700 rounded-lg transition"
      >
        <Eye size={15} className="text-gray-400" />
      </button>
      {user.approval_status === "pending" && (
        <button
          onClick={() => handleInlineAction(() => approve(user.id), "User approved!")}
          disabled={ap}
          title="Approve"
          className="p-1.5 hover:bg-emerald-900 rounded-lg transition disabled:opacity-50"
        >
          {ap ? (
            <Loader2 size={15} className="text-emerald-400 animate-spin" />
          ) : (
            <CheckCircle size={15} className="text-emerald-400" />
          )}
        </button>
      )}
      {user.is_active && user.approval_status !== "pending" && (
        <button
          onClick={() => handleInlineAction(() => suspend(user.id), "User suspended.")}
          disabled={su}
          title="Suspend"
          className="p-1.5 hover:bg-amber-900 rounded-lg transition disabled:opacity-50"
        >
          {su ? (
            <Loader2 size={15} className="text-amber-400 animate-spin" />
          ) : (
            <XCircle size={15} className="text-amber-400" />
          )}
        </button>
      )}
      {!user.is_active && (
        <button
          onClick={() => handleInlineAction(() => reactivate(user.id), "User reactivated!")}
          disabled={re}
          title="Reactivate"
          className="p-1.5 hover:bg-blue-900 rounded-lg transition disabled:opacity-50"
        >
          {re ? (
            <Loader2 size={15} className="text-blue-400 animate-spin" />
          ) : (
            <RefreshCw size={15} className="text-blue-400" />
          )}
        </button>
      )}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

export default function UserManagement() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const { data, isLoading, isError, refetch, isFetching } = useGetUserListQuery({
    page,
    search: debouncedSearch,
    role: roleFilter,
  });

  const handleSearch = (val: string) => {
    setSearch(val);
    clearTimeout((handleSearch as any)._t);
    (handleSearch as any)._t = setTimeout(() => {
      setDebouncedSearch(val);
      setPage(1);
    }, 400);
  };

  const totalPages = data ? Math.ceil(data.count / 8) : 1;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-9xl mx-auto space-y-6">
        <div className="sticky -top-10 z-40 bg-gray-950 pt-6 pb-4 flex flex-col gap-6 border-b border-gray-800/50 shadow-md shadow-gray-950">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
              <p className="text-gray-400 text-sm mt-1">
                Manage bidders, dealers and their approval status
              </p>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setPage(1);
                }}
                className="px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm focus:outline-none focus:border-emerald-600/60 text-gray-200"
              >
                <option value="">All Roles</option>
                <option value="bidder">Bidder</option>
                <option value="dealer">Dealer</option>
              </select>

              <div className="relative">
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                />
                <input
                  type="text"
                  placeholder="Search by email…"
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm focus:outline-none focus:border-emerald-600/60 w-56"
                />
              </div>
              <button
                onClick={() => refetch()}
                disabled={isFetching}
                className="p-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition disabled:opacity-50"
                title="Refresh"
              >
                <RefreshCw size={15} className={`text-gray-400 ${isFetching ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Stats strip */}
          {data && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <MiniStat label="Total Users" value={data.count} color="text-cyan-400" />
              <MiniStat
                label="Active"
                value={data.results.filter((u) => u.is_active).length}
                color="text-emerald-400"
              />
              <MiniStat
                label="Pending"
                value={
                  data.results.filter((u) => u.approval_status === "pending").length
                }
                color="text-amber-400"
              />
              <MiniStat
                label="Suspended"
                value={data.results.filter((u) => !u.is_active).length}
                color="text-red-400"
              />
            </div>
          )}
        </div>

        {/* Table */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-280px)] min-h-[400px]">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-800 sticky top-0 z-20 shadow-md">
                <tr>
                  <th className="px-6 py-4 font-medium text-gray-300">Email</th>
               
                  <th className="px-6 py-4 font-medium text-gray-300">Type</th>
             
                  <th className="px-6 py-4 font-medium text-gray-300">Approval</th>
                  <th className="px-6 py-4 font-medium text-gray-300 text-center">Bids</th>
                  <th className="px-6 py-4 font-medium text-gray-300">Joined</th>
                  <th className="px-6 py-4 font-medium text-gray-300 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {isLoading && (
                  <tr>
                    <td colSpan={8} className="px-6 py-16 text-center">
                      <Loader2
                        size={24}
                        className="text-emerald-400 animate-spin mx-auto"
                      />
                    </td>
                  </tr>
                )}
                {isError && (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-6 py-16 text-center text-red-400"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <AlertCircle size={18} />
                        Failed to load users. Check your connection or login.
                      </div>
                    </td>
                  </tr>
                )}
                {data?.results.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-800/40 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-200">
                        {user.email}
                      </div>
                      <div className="text-xs text-gray-500">ID #{user.id}</div>
                    </td>
                  
                    <td className="px-6 py-4 text-gray-400 capitalize">
                      {user.user_type}
                    </td>
                 
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${statusColor(user.approval_status)}`}
                      >
                        {user.approval_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-gray-300">
                      {user.total_bids}
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-xs">
                      {fmt(user.created_at)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <RowActions
                        user={user}
                        onView={() => setSelectedUserId(user.id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {data && totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-800 text-sm text-gray-400">
              <div>
                Showing page {page} of {totalPages} ({data.count} users)
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={!data.previous}
                  className="p-1.5 bg-gray-800 rounded-lg hover:bg-gray-700 disabled:opacity-40"
                >
                  <ChevronLeft size={15} />
                </button>
                <span className="px-3 py-1 bg-gray-700 rounded-lg">{page}</span>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!data.next}
                  className="p-1.5 bg-gray-800 rounded-lg hover:bg-gray-700 disabled:opacity-40"
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* User Detail Modal */}
      {selectedUserId !== null && (
        <UserDetailModal
          userId={selectedUserId}
          onClose={() => setSelectedUserId(null)}
        />
      )}
    </div>
  );
}

function MiniStat({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 flex items-center gap-3">
      <div>
        <div className={`text-xl font-bold ${color}`}>{value}</div>
        <div className="text-xs text-gray-500">{label}</div>
      </div>
    </div>
  );
}