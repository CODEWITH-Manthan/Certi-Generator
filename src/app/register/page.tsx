"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FileBadge } from "lucide-react";
import { signIn } from "next-auth/react";

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (res.ok) {
        router.push("/login");
      } else {
        const data = await res.json();
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f0] flex items-center justify-center p-4">
      <div className="brut-card max-w-md w-full p-8 border-4">
        <div className="flex justify-center mb-8">
          <div className="bg-[#00E5FF] border-4 border-black p-2">
            <FileBadge className="w-8 h-8" />
          </div>
        </div>
        <h2 className="text-3xl font-black uppercase text-center mb-6">Register</h2>
        {error && (
          <div className="bg-[#FF4D6D] text-white p-3 font-bold border-2 border-black mb-4 uppercase text-sm">
            {error}
          </div>
        )}

        <button
          type="button"
          onClick={() => signIn("google", { redirectTo: "/dashboard" })}
          className="brut-btn bg-white text-black w-full py-3 text-lg border-2 border-black flex items-center justify-center gap-2 mb-4"
        >
          <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Sign up with Google
        </button>

        <div className="flex items-center my-4">
          <div className="flex-grow border-t-2 border-black"></div>
          <span className="px-4 font-bold text-sm uppercase">or</span>
          <div className="flex-grow border-t-2 border-black"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-bold mb-2 uppercase text-sm">Name</label>
            <input
              type="text"
              className="brut-input border-2 border-black"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block font-bold mb-2 uppercase text-sm">Email</label>
            <input
              type="email"
              className="brut-input border-2 border-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block font-bold mb-2 uppercase text-sm">Password</label>
            <input
              type="password"
              className="brut-input border-2 border-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="brut-btn brut-btn-cyan w-full mt-6 py-3 text-lg border-2 border-black">
            Create Account
          </button>
        </form>
        <p className="text-center mt-6 font-medium">
          Already have an account?{" "}
          <Link href="/login" className="font-bold underline decoration-2 decoration-yellow-400 underline-offset-4">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
