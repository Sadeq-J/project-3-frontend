import { useState } from "react";
import { Link, useNavigate } from "react-router";
import maidanLogo from "../assets/maidan-logo.svg";
import { signIn } from "../services/authService";
import { useAuth } from "../context/AuthContext";

const SignInForm = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  function handleChange(event) {
    setError("");
    setFormData({ ...formData, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSubmitting(true);
      const signedInUser = await signIn(formData);
      setUser(signedInUser);
      navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to sign in. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-[calc(100vh-92px)] bg-slate-100 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.08)] lg:grid-cols-[1.1fr_0.9fr]">
        <section className="relative overflow-hidden bg-slate-950 px-6 py-8 sm:px-8 lg:px-10 lg:py-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.24),transparent_22%)]" />
          <div className="relative flex h-full flex-col justify-between gap-10">
            <div className="flex items-center gap-4">
              <img src={maidanLogo} alt="MAIDAN logo" className="h-16 w-auto rounded-2xl bg-white/90 p-2 shadow-lg ring-1 ring-slate-200" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-slate-300">Sports booking</p>
                <h1 className="mt-2 text-3xl font-black tracking-[-0.06em] text-white sm:text-4xl">Manage every matchday.</h1>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-700/80 bg-slate-900/50 p-4 backdrop-blur-sm">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Live bookings</p>
                <p className="mt-3 text-3xl font-black tracking-[-0.06em] text-white">1,280</p>
              </div>
              <div className="rounded-2xl border border-slate-700/80 bg-slate-900/50 p-4 backdrop-blur-sm">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Avg. occupancy</p>
                <p className="mt-3 text-3xl font-black tracking-[-0.06em] text-white">82%</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-50 px-6 py-8 sm:px-8 lg:px-10 lg:py-10">
          <div className="mx-auto max-w-md">
            <div className="mb-7">
              <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-slate-500">Welcome back</p>
              <h2 className="mt-3 text-3xl font-black tracking-[-0.06em] text-slate-900">Sign in to MAIDAN</h2>
            </div>

            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            <form autoComplete="off" onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="username" className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-700">Username</label>
                <input
                  className="field-input"
                  type="text"
                  autoComplete="off"
                  id="username"
                  value={formData.username}
                  name="username"
                  onChange={handleChange}
                  placeholder="Enter your username"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-700">Password</label>
                <input
                  className="field-input"
                  type="password"
                  autoComplete="off"
                  id="password"
                  value={formData.password}
                  name="password"
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button type="submit" className="primary-button w-full" disabled={submitting}>
                {submitting ? "Signing in..." : "Sign in"}
              </button>

              <button type="button" onClick={() => navigate("/")} className="secondary-button w-full">
                Cancel
              </button>

              <p className="pt-1 text-center text-sm text-slate-500">
                Need an account? <Link to="/sign-up" className="font-semibold text-slate-900 underline-offset-4 hover:underline">Create one</Link>
              </p>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
};

export default SignInForm;

