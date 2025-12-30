import { useContext, useState } from "react";
import { AuthContext } from "../auth/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, LogIn, UserPlus, AlertCircle, Eye, EyeOff, Shield, User, CheckCircle2 } from "lucide-react";

export default function Signup() {
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const passwordStrength = () => {
    const pwd = form.password || "";
    if (pwd.length < 6) return { label: "Weak", color: "text-red-400", bgColor: "bg-red-500/20", borderColor: "border-red-500/40" };
    if (/[A-Z]/.test(pwd) && /\d/.test(pwd) && /[^A-Za-z0-9]/.test(pwd))
      return { label: "Strong", color: "text-green-400", bgColor: "bg-green-500/20", borderColor: "border-green-500/40" };
    return { label: "Medium", color: "text-amber-400", bgColor: "bg-amber-500/20", borderColor: "border-amber-500/40" };
  };

  const isFormValid = () => {
    return (
      form.full_name?.trim().length >= 3 &&
      /^\S+@\S+\.\S+$/.test(form.email || "") &&
      (form.password || "").length >= 6
    );
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.full_name || !form.email || !form.password) {
      setError("Please fill in all fields");
      return;
    }

    if (!isFormValid()) {
      setError("Please ensure all fields are valid");
      return;
    }

    try {
      setLoading(true);
      await signup(form);
      navigate("/profile");
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const strength = passwordStrength();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="text-center mb-10">
          <div className="inline-flex p-5 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-3xl shadow-2xl mb-6">
            <Shield className="w-14 h-14 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-3">
            Create Account
          </h1>
          <p className="text-slate-400 text-lg">Join us and get started today</p>
        </div>

        {/* Signup Form Card */}
        <div className="bg-slate-800/70 backdrop-blur-lg border border-slate-700 rounded-3xl p-8 shadow-2xl">
          <div className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/40 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            {/* Full Name Input */}
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
                  disabled={loading}
                />
              </div>
              {form.full_name && form.full_name.trim().length > 0 && form.full_name.trim().length < 3 && (
                <p className="text-red-400 text-sm mt-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Name must be at least 3 characters
                </p>
              )}
              {form.full_name && form.full_name.trim().length >= 3 && (
                <p className="text-green-400 text-sm mt-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Looks good!
                </p>
              )}
            </div>

            {/* Email Input */}
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
                  disabled={loading}
                />
              </div>
              {form.email && form.email.length > 0 && !/^\S+@\S+\.\S+$/.test(form.email) && (
                <p className="text-red-400 text-sm mt-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Please enter a valid email address
                </p>
              )}
              {form.email && /^\S+@\S+\.\S+$/.test(form.email) && (
                <p className="text-green-400 text-sm mt-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Valid email
                </p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  onKeyDown={e => e.key === "Enter" && submit(e)}
                  className="w-full pl-14 pr-14 py-4 bg-slate-700/60 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 text-base placeholder:text-slate-400 transition-all"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {form.password && form.password.length > 0 && (
                <div className="mt-3 space-y-2">
                  <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold ${strength.bgColor} ${strength.color} border ${strength.borderColor}`}>
                    Password Strength: {strength.label}
                  </span>
                  {form.password.length < 6 && (
                    <p className="text-slate-400 text-sm flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Password must be at least 6 characters
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Signup Button */}
            <button
              onClick={submit}
              disabled={loading || !isFormValid()}
              className="w-full px-10 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl font-semibold text-base hover:from-cyan-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating account...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Create Account
                </>
              )}
            </button>

            {/* Password Requirements */}
            <div className="bg-slate-700/30 border border-slate-600 rounded-xl p-4">
              <p className="text-slate-300 text-sm font-semibold mb-2">Password Requirements:</p>
              <ul className="text-slate-400 text-sm space-y-1">
                <li className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${form.password && form.password.length >= 6 ? 'bg-green-400' : 'bg-slate-500'}`}></div>
                  At least 6 characters
                </li>
                <li className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${form.password && /[A-Z]/.test(form.password) ? 'bg-green-400' : 'bg-slate-500'}`}></div>
                  One uppercase letter (recommended)
                </li>
                <li className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${form.password && /\d/.test(form.password) ? 'bg-green-400' : 'bg-slate-500'}`}></div>
                  One number (recommended)
                </li>
                <li className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${form.password && /[^A-Za-z0-9]/.test(form.password) ? 'bg-green-400' : 'bg-slate-500'}`}></div>
                  One special character (recommended)
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Login Link */}
        <div className="mt-8 text-center">
          <p className="text-slate-400 text-base">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors inline-flex items-center gap-2"
            >
              Sign In
              <LogIn className="w-4 h-4" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}