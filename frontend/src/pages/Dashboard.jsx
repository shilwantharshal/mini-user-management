import { useEffect, useState, useContext } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";
import { AuthContext } from "../auth/AuthContext";
import {
  Search,
  Filter,
  Users,
  ChevronLeft,
  ChevronRight,
  Shield,
  UserX,
  UserCheck,
  Mail,
} from "lucide-react";

export default function Dashboard() {
  const { user: currentUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchEmail, setSearchEmail] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/users", {
        params: { page, limit, email: searchEmail, status: statusFilter, role: roleFilter },
      });
      setUsers(res.data.users);
      setTotal(res.data.total);
      setSelected([]);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, limit, statusFilter, roleFilter]);

  const toggleStatus = async (user, action) => {
    if (user.id === currentUser.id && action === "deactivate") {
      toast.error("You cannot deactivate yourself");
      return;
    }
    if (!window.confirm(`Are you sure you want to ${action} this user?`)) return;

    try {
      await api.put(`/admin/users/${user.id}/${action}`);
      toast.success(`User ${action}d successfully`);
      fetchUsers();
    } catch {
      toast.error("Action failed");
    }
  };

  const changeRole = async (id, newRole) => {
    const roleText = newRole === "admin" ? "Admin" : "User";
    if (!window.confirm(`Change role to ${roleText}?`)) return;
    try {
      await api.put(`/admin/users/${id}/role`, { role: newRole });
      toast.success(`Role updated to ${roleText}`);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update role");
    }
  };

  const bulkAction = async (action) => {
    if (selected.length === 0) return toast.error("No users selected");
    if (selected.includes(currentUser.id) && action === "deactivate") {
      return toast.error("You cannot deactivate yourself");
    }
    if (!window.confirm(`Apply ${action} to ${selected.length} users?`)) return;

    try {
      await api.put("/admin/users/bulk", { user_ids: selected, action });
      toast.success("Bulk action completed");
      fetchUsers();
    } catch {
      toast.error("Bulk action failed");
    }
  };

  const totalPages = Math.ceil(total / limit);
  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };
  const toggleSelectAll = () => {
    setSelected(selected.length === users.length ? [] : users.map((u) => u.id));
  };

  const activeUsers = users.filter((u) => u.status === "active").length;
  const adminUsers = users.filter((u) => u.role === "admin").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="flex flex-col h-screen">
        {/* Header */}
        <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-xl">
          <div className="px-12 py-8">
            <div className="flex items-center gap-6">
              <div className="p-4 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-3xl shadow-2xl">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-slate-400 text-xl mt-2">Manage users and permissions</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto px-12 py-10">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-slate-800/70 backdrop-blur-lg border border-slate-700 rounded-3xl p-8 shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-3">Total Users</p>
                  <p className="text-6xl font-bold text-white">{total}</p>
                </div>
                <div className="p-5 bg-blue-500/20 rounded-2xl border border-blue-500/30">
                  <Users className="w-12 h-12 text-blue-400" />
                </div>
              </div>
            </div>

            <div className="bg-slate-800/70 backdrop-blur-lg border border-slate-700 rounded-3xl p-8 shadow-2xl hover:shadow-green-500/10 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-3">Active Users</p>
                  <p className="text-6xl font-bold text-white">{activeUsers}</p>
                </div>
                <div className="p-5 bg-green-500/20 rounded-2xl border border-green-500/30">
                  <UserCheck className="w-12 h-12 text-green-400" />
                </div>
              </div>
            </div>

            <div className="bg-slate-800/70 backdrop-blur-lg border border-slate-700 rounded-3xl p-8 shadow-2xl hover:shadow-purple-500/10 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-3">Admins</p>
                  <p className="text-6xl font-bold text-white">{adminUsers}</p>
                </div>
                <div className="p-5 bg-purple-500/20 rounded-2xl border border-purple-500/30">
                  <Shield className="w-12 h-12 text-purple-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-slate-800/70 backdrop-blur-lg border border-slate-700 rounded-3xl p-8 mb-10 shadow-2xl">
            <div className="flex items-center gap-4 mb-6">
              <Filter className="w-7 h-7 text-cyan-400" />
              <h2 className="text-2xl font-bold">Filters</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="lg:col-span-2 relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by email..."
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && fetchUsers()}
                  className="w-full pl-14 pr-6 py-4 bg-slate-700/60 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 text-base placeholder:text-slate-400 transition-all"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-5 py-4 bg-slate-700/60 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 text-base transition-all cursor-pointer"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-5 py-4 bg-slate-700/60 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 text-base transition-all cursor-pointer"
              >
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>

            <div className="mt-6">
              <button
                onClick={fetchUsers}
                className="px-10 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl font-semibold text-base hover:from-cyan-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
              >
                Apply Filters
              </button>
            </div>
          </div>

          {/* Bulk Actions */}
          {selected.length > 0 && (
            <div className="bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/40 rounded-2xl p-6 mb-10 flex flex-col md:flex-row items-center justify-between gap-5 shadow-xl">
              <p className="text-cyan-200 text-lg font-semibold">
                {selected.length} user{selected.length > 1 ? "s" : ""} selected
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => bulkAction("activate")}
                  className="px-8 py-3 bg-green-600 hover:bg-green-700 rounded-xl text-white font-semibold text-sm flex items-center gap-3 transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                >
                  <UserCheck className="w-5 h-5" /> Activate
                </button>
                <button
                  onClick={() => bulkAction("deactivate")}
                  className="px-8 py-3 bg-red-600 hover:bg-red-700 rounded-xl text-white font-semibold text-sm flex items-center gap-3 transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                >
                  <UserX className="w-5 h-5" /> Deactivate
                </button>
              </div>
            </div>
          )}

          {/* Users Table */}
          <div className="bg-slate-800/70 backdrop-blur-lg border border-slate-700 rounded-3xl overflow-hidden shadow-2xl">
            {loading ? (
              <div className="py-32 text-center">
                <div className="inline-block w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-8 text-slate-400 text-xl">Loading users...</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-900/80 border-b border-slate-700">
                      <tr>
                        <th className="px-8 py-5 text-left w-20">
                          <input
                            type="checkbox"
                            checked={selected.length === users.length && users.length > 0}
                            onChange={toggleSelectAll}
                            className="w-5 h-5 rounded border-slate-600 bg-slate-700 text-cyan-500 focus:ring-cyan-500 cursor-pointer"
                          />
                        </th>
                        <th className="px-8 py-5 text-left text-sm font-semibold text-slate-300 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-8 py-5 text-center text-sm font-semibold text-slate-300 uppercase tracking-wider w-44">
                          Role
                        </th>
                        <th className="px-8 py-5 text-center text-sm font-semibold text-slate-300 uppercase tracking-wider w-44">
                          Status
                        </th>
                        <th className="px-8 py-5 text-center text-sm font-semibold text-slate-300 uppercase tracking-wider w-96">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                      {users.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-24 text-center text-slate-500 text-xl">
                            No users found
                          </td>
                        </tr>
                      ) : (
                        users.map((u) => (
                          <tr key={u.id} className="hover:bg-slate-700/30 transition-all duration-200">
                            <td className="px-8 py-6">
                              <input
                                type="checkbox"
                                checked={selected.includes(u.id)}
                                onChange={() => toggleSelect(u.id)}
                                className="w-5 h-5 rounded border-slate-600 bg-slate-700 text-cyan-500 focus:ring-cyan-500 cursor-pointer"
                              />
                            </td>
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg flex-shrink-0">
                                  {u.full_name?.[0]?.toUpperCase() || u.email[0].toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                  <p className="text-base font-semibold text-white truncate">{u.full_name || "Unnamed User"}</p>
                                  <p className="text-slate-400 text-sm flex items-center gap-2 mt-1 truncate">
                                    <Mail className="w-4 h-4 flex-shrink-0" />
                                    <span className="truncate">{u.email}</span>
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <div className="flex justify-center">
                                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${u.role === "admin" ? "bg-purple-500/20 text-purple-300 border border-purple-500/40" : "bg-slate-600/60 text-slate-300 border border-slate-500/40"}`}>
                                  <Shield className="w-4 h-4" />
                                  {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                                </span>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <div className="flex justify-center">
                                <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${u.status === "active" ? "bg-green-500/20 text-green-300 border border-green-500/40" : "bg-red-500/20 text-red-300 border border-red-500/40"}`}>
                                  {u.status.charAt(0).toUpperCase() + u.status.slice(1)}
                                </span>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <div className="flex justify-center items-center gap-3">
                                {u.status === "active" ? (
                                  <button
                                    onClick={() => toggleStatus(u, "deactivate")}
                                    className="px-6 py-2.5 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 rounded-lg text-red-300 font-medium text-sm transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
                                  >
                                    Deactivate
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => toggleStatus(u, "activate")}
                                    className="px-6 py-2.5 bg-green-500/20 hover:bg-green-500/30 border border-green-500/40 rounded-lg text-green-300 font-medium text-sm transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
                                  >
                                    Activate
                                  </button>
                                )}
                                {u.role === "user" ? (
                                  <button
                                    onClick={() => changeRole(u.id, "admin")}
                                    className="px-6 py-2.5 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 rounded-lg text-purple-300 font-medium text-sm transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
                                  >
                                    Make Admin
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => changeRole(u.id, "user")}
                                    className="px-6 py-2.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 rounded-lg text-amber-300 font-medium text-sm transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
                                  >
                                    Remove Admin
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {users.length > 0 && (
                  <div className="border-t border-slate-700 bg-slate-900/60 px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <span className="text-slate-300 text-base font-medium">Rows per page:</span>
                      <select
                        value={limit}
                        onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
                        className="px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500 text-base cursor-pointer transition-all"
                      >
                        {[5, 10, 20, 50].map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>

                    <div className="flex items-center gap-8">
                      <p className="text-slate-300 text-base">
                        Page <span className="font-bold text-white">{page}</span> of <span className="font-bold text-white">{totalPages}</span>
                      </p>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setPage(p => Math.max(1, p - 1))}
                          disabled={page === 1}
                          className="p-3 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg hover:scale-[1.05] active:scale-[0.95]"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                          disabled={page === totalPages}
                          className="p-3 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg hover:scale-[1.05] active:scale-[0.95]"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}