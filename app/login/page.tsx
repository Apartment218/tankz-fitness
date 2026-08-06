"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setLoading(true);
    setError("");

    const { error: loginError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    setLoading(false);

    if (loginError) {
      setError(loginError.message);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-950 px-4 py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(220,38,38,0.25),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.06),transparent_25%)]" />

      <div className="relative w-full max-w-md rounded-[2rem] border border-zinc-800 bg-zinc-900/95 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-600 text-xl font-black text-white shadow-lg shadow-red-950/40">
            T
          </span>

          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-red-500">
              Secure admin access
            </p>

            <h1 className="mt-1 text-3xl font-black tracking-tight text-white">
              Tankz HQ
            </h1>
          </div>
        </div>

        <p className="mt-6 leading-7 text-zinc-400">
          Sign in with your authorised Tankz Fitness admin
          account.
        </p>

        <form
          onSubmit={handleLogin}
          className="mt-8 space-y-5"
        >
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-zinc-200">
              Email address
            </span>

            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="you@tankzfitness.co.uk"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3.5 text-white outline-none transition placeholder:text-zinc-600 focus:border-red-500 focus:ring-4 focus:ring-red-950/40"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-zinc-200">
              Password
            </span>

            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="Enter your password"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3.5 text-white outline-none transition placeholder:text-zinc-600 focus:border-red-500 focus:ring-4 focus:ring-red-950/40"
            />
          </label>

          {error ? (
            <div className="rounded-xl border border-red-900/70 bg-red-950/50 px-4 py-3">
              <p className="text-sm font-bold text-red-300">
                {error}
              </p>
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center rounded-xl bg-red-600 px-5 py-3.5 text-sm font-black uppercase tracking-wider text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="mt-7 border-t border-zinc-800 pt-6">
          <p className="text-center text-xs leading-6 text-zinc-500">
            Access is restricted to authorised Tankz Fitness
            administrators.
          </p>
        </div>
      </div>
    </main>
  );
}