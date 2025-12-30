import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  Shield,
  Lock,
  Save,
  LogOut,
  LayoutDashboard,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Key,
} from "lucide-react";

import api from "../api/axios";
import { AuthContext } from "../auth/AuthContext";

export default function Profile() {
  const { logout, refreshUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ full_name: "", email: "" });

  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: ""
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  /* ------------------ Load Profile ------------------ */
  useEffect(() => {
    api.get("/users/me")
      .then(res => {
        setUser(res.data);
        setForm({
          full_name: res.data.full_name,
          email: res.data.email
        });
      })
      .catch(() => toast.error("Failed to load profile"))
      .finally(() => setLoading(false));
  }, []);

  /* ------------------ Validation ------------------ */
  const isProfileValid =
    form.full_name.trim().length >= 3 &&
    /^\S+@\S+\.\S+$/.test(form.email);

  const passwordStrength = () => {
    const pwd = passwordForm.new_password;
    if (pwd.length < 6) return { label: "Weak", color: "text-red-400", bgColor: "bg-red-500/20", borderColor: "border-red-500/40" };
    if (/[A-Z]/.test(pwd) && /\d/.test(pwd) && /[^A-Za-z0-9]/.test(pwd))
      return { label: "Strong", color: "text-green-400", bgColor: "bg-green-500/20", borderColor: "border-green-500/40" };
    return { label: "Medium", color: "text-amber-400", bgColor: "bg-amber-500/20", borderColor: "border-amber-500/40" };
  };

  const isPasswordValid =
    passwordForm.current_password.length >= 6 &&
    passwordForm.new_password.length >= 6 &&
    passwordForm.new_password === passwordForm.confirm_password;

  /* ------------------ Profile Update ------------------ */
  const saveProfile = async () => {
    if (!isProfileValid) {
      toast.error("Invalid name or email");
      return;
    }

    try {
      setSaving(true);
      await api.put("/users/me", form);
      toast.success("Profile updated");
      refreshUser();
    } catch (e) {
      toast.error(e.response?.data?.error || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  /* ------------------ Password Change ------------------ */
  const changePassword = async () => {
    if (!isPasswordValid) {
      toast.error("Passwords do not match or are invalid");
      return;
    }

    try {
      setSaving(true);
      await api.put("/users/change-password", {
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password
      });

      toast.success("Password changed. Please login again.");

      logout();
      navigate("/login");

    } catch (e) {
      toast.error(e.response?.data?.error || "Password update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-6 text-slate-400 text-xl">Loading profile...</p>
        </div>
      </div>
    );
  }

  const strength = passwordStrength();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-6 mb-4">
            <div className="p-4 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-3xl shadow-2xl">
              <User className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Profile Settings
              </h1>
              <p className="text-slate-400 text-xl mt-2">Manage your account information and security</p>
            </div>
          </div>
        </div>

        {/* User Info Card */}
        <div className="bg-slate-800/70 backdrop-blur-lg border border-slate-700 rounded-3xl p-8 mb-8 shadow-2xl">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg">
              {user?.full_name?.[0]?.toUpperCase() || user?.email[0].toUpperCase()}
            </div>
            <div>
              <h2 className="text-3xl font-bold">{user?.full_name || "Unnamed User"}</h2>
              <div className="flex items-center gap-3 mt-2">
                <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold ${user?.role === "admin" ? "bg-purple-500/20 text-purple-300 border border-purple-500/40" : "bg-slate-600/60 text-slate-300 border border-slate-500/40"}`}>
                  <Shield className="w-4 h-4" />
                  {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="bg-slate-800/70 backdrop-blur-lg border border-slate-700 rounded-3xl p-8 mb-8 shadow-2xl">
          <div className="flex items-center gap-4 mb-6">
            <User className="w-7 h-7 text-cyan-400" />
            <h2 className="text-2xl font-bold">Profile Information</h2>
          </div>

          <div className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={form.full_name}
                  onChange={e => setForm({ ...form, full_name: e.target.value })}
                  className="w-full pl-14 pr-6 py-4 bg-slate-700/60 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 text-base placeholder:text-slate-400 transition-all"
                />
              </div>
              {form.full_name.trim().length > 0 && form.full_name.trim().length < 3 && (
                <p className="text-red-400 text-sm mt-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Name must be at least 3 characters
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full pl-14 pr-6 py-4 bg-slate-700/60 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 text-base placeholder:text-slate-400 transition-all"
                />
              </div>
              {form.email.length > 0 && !/^\S+@\S+\.\S+$/.test(form.email) && (
                <p className="text-red-400 text-sm mt-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Please enter a valid email address
                </p>
              )}
            </div>

            {/* Save Button */}
            <div className="pt-2">
              <button
                onClick={saveProfile}
                disabled={saving || !isProfileValid}
                className="px-10 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl font-semibold text-base hover:from-cyan-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-3"
              >
                <Save className="w-5 h-5" />
                {saving ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="bg-slate-800/70 backdrop-blur-lg border border-slate-700 rounded-3xl p-8 mb-8 shadow-2xl">
          <div className="flex items-center gap-4 mb-6">
            <Lock className="w-7 h-7 text-cyan-400" />
            <h2 className="text-2xl font-bold">Change Password</h2>
          </div>

          <div className="space-y-6">
            {/* Current Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">
                Current Password
              </label>
              <div className="relative">
                <Key className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="Enter current password"
                  value={passwordForm.current_password}
                  onChange={e => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                  className="w-full pl-14 pr-14 py-4 bg-slate-700/60 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 text-base placeholder:text-slate-400 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                >
                  {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={passwordForm.new_password}
                  onChange={e => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                  className="w-full pl-14 pr-14 py-4 bg-slate-700/60 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 text-base placeholder:text-slate-400 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                >
                  {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {passwordForm.new_password.length > 0 && (
                <div className="mt-3">
                  <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold ${strength.bgColor} ${strength.color} border ${strength.borderColor}`}>
                    Password Strength: {strength.label}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={passwordForm.confirm_password}
                  onChange={e => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })}
                  className="w-full pl-14 pr-14 py-4 bg-slate-700/60 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 text-base placeholder:text-slate-400 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {passwordForm.confirm_password.length > 0 && passwordForm.new_password !== passwordForm.confirm_password && (
                <p className="text-red-400 text-sm mt-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Passwords do not match
                </p>
              )}
              {passwordForm.confirm_password.length > 0 && passwordForm.new_password === passwordForm.confirm_password && (
                <p className="text-green-400 text-sm mt-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Passwords match
                </p>
              )}
            </div>

            {/* Change Password Button */}
            <div className="pt-2">
              <button
                onClick={changePassword}
                disabled={saving || !isPasswordValid}
                className="px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold text-base hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-3"
              >
                <Key className="w-5 h-5" />
                {saving ? "Changing..." : "Change Password"}
              </button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          {user?.role === "admin" && (
            <Link
              to="/admin"
              className="flex-1 px-10 py-4 bg-slate-700/60 hover:bg-slate-700 border border-slate-600 rounded-xl font-semibold text-base transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
            >
              <LayoutDashboard className="w-5 h-5" />
              Admin Dashboard
            </Link>
          )}
          <button
            onClick={logout}
            className="flex-1 px-10 py-4 bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 rounded-xl text-red-300 font-semibold text-base transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}