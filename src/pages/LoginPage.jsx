import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRightIcon,
  CalendarDaysIcon,
  ChartBarSquareIcon,
  CheckCircleIcon,
  EyeIcon,
  EyeSlashIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { setCredentials } from '../features/auth/authSlice';
import { login } from '../api/adminApi';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login({ email: email.trim(), password });

      if (data.role !== 'ADMIN') {
        setError('This account does not have administrator access.');
        setLoading(false);
        return;
      }

      dispatch(setCredentials(data));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to sign in. Check your email and password, then try again.');
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen overflow-hidden bg-[#f7f8f5] text-[#202820]">
      <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-[#e7eee5] blur-3xl" />

      {/* Brand panel */}
      <section className="relative hidden w-[52%] flex-col justify-between overflow-hidden bg-[#183b2b] px-12 py-10 text-white lg:flex xl:px-16">
        <div className="absolute inset-0 opacity-[0.08]" aria-hidden="true">
          <div className="absolute -right-28 top-24 h-[30rem] w-[30rem] rounded-full border border-white" />
          <div className="absolute -right-12 top-40 h-[26rem] w-[26rem] rounded-full border border-white" />
          <div className="absolute -right-[-4rem] top-56 h-[22rem] w-[22rem] rounded-full border border-white" />
          <div className="absolute bottom-0 left-0 h-72 w-full bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#d9e8d8] text-[#183b2b]">
            <CalendarDaysIcon className="h-6 w-6" />
          </div>
          <div>
            <p className="font-[Manrope] text-lg font-extrabold tracking-tight">Workshop</p>
            <p className="-mt-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/55">Management platform</p>
          </div>
        </div>

        <div className="relative z-10 max-w-xl pb-8">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-3 py-1.5 text-xs font-medium tracking-wide text-[#d7e6d6]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#b8d6a9]" />
            YOUR WORKSHOP, IN CONTROL
          </span>
          <h1 className="font-[Manrope] text-5xl font-extrabold leading-[1.12] tracking-[-0.045em] xl:text-[3.65rem]">
            Make every
            <br />
            workshop count<span className="text-[#b8d6a9]">.</span>
          </h1>
          <p className="mt-6 max-w-md text-base leading-7 text-white/65">
            One clear view of your bookings, workshops, and performance. Spend less time coordinating and more time creating great experiences.
          </p>

          <div className="mt-10 grid max-w-lg grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-4 backdrop-blur-sm">
              <div className="mb-5 flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-[#c8dfbd]">
                <ChartBarSquareIcon className="h-5 w-5" />
              </div>
              <p className="text-sm font-semibold">Live insights</p>
              <p className="mt-1 text-xs leading-5 text-white/50">Understand performance at a glance.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-4 backdrop-blur-sm">
              <div className="mb-5 flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-[#c8dfbd]">
                <CheckCircleIcon className="h-5 w-5" />
              </div>
              <p className="text-sm font-semibold">Simpler operations</p>
              <p className="mt-1 text-xs leading-5 text-white/50">Keep every booking organized.</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-5 text-xs text-white/40">
          <span>Workshop Booking · Admin</span>
          <span>Built for better experiences</span>
        </div>
      </section>

      {/* Login panel */}
      <section className="relative z-10 flex w-full items-center justify-center px-5 py-12 sm:px-8 lg:w-[48%]">
        <div className="w-full max-w-[420px]">
          <div className="mb-10 flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#183b2b] text-white">
              <CalendarDaysIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="font-[Manrope] text-base font-extrabold">Workshop</p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#778276]">Management platform</p>
            </div>
          </div>

          <div className="mb-8">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e8efe6] text-[#315b40]">
              <ShieldCheckIcon className="h-6 w-6" />
            </div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#6e866f]">Administrator access</p>
            <h2 className="font-[Manrope] text-3xl font-extrabold tracking-[-0.04em] text-[#202820] sm:text-[2.15rem]">
              Welcome back
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#788177]">
              Sign in with your administrator account to manage your workshops and bookings.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div role="alert" className="flex gap-3 rounded-xl border border-[#f0d2ce] bg-[#fff5f3] px-4 py-3 text-sm leading-5 text-[#a13d32]">
                <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-[#c85b4e]" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-semibold text-[#344136]">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="username"
                autoFocus
                placeholder="you@company.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={loading}
                className="h-12 w-full rounded-xl border border-[#dfe5dc] bg-white px-4 text-sm text-[#263329] outline-none transition placeholder:text-[#a3aca1] hover:border-[#b8c7b6] focus:border-[#527b58] focus:ring-4 focus:ring-[#527b58]/10 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-semibold text-[#344136]">
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  disabled={loading}
                  className="h-12 w-full rounded-xl border border-[#dfe5dc] bg-white px-4 pr-12 text-sm text-[#263329] outline-none transition placeholder:text-[#a3aca1] hover:border-[#b8c7b6] focus:border-[#527b58] focus:ring-4 focus:ring-[#527b58]/10 disabled:cursor-not-allowed disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-xl text-[#899489] transition hover:text-[#315b40] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#527b58]"
                >
                  {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !email.trim() || !password}
              className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#244b35] px-5 text-sm font-semibold text-white shadow-[0_5px_14px_rgba(36,75,53,0.16)] transition hover:-translate-y-0.5 hover:bg-[#193c29] hover:shadow-[0_8px_20px_rgba(36,75,53,0.2)] focus:outline-none focus:ring-4 focus:ring-[#527b58]/20 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-55 disabled:shadow-none"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/35 border-t-white" />
                  Signing in…
                </>
              ) : (
                <>
                  Sign in to dashboard
                  <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 flex items-start gap-2.5 border-t border-[#e7ebe4] pt-6 text-xs leading-5 text-[#879084]">
            <ShieldCheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-[#6d8a6d]" />
            <p>Secure administrator sign-in. Access is restricted to authorized accounts.</p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default LoginPage;
