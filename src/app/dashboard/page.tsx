import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Dashboard } from "@/components/Dashboard";
import Link from "next/link";
import LogoutButton from "./LogoutButton";
import { User } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();

  if (!session || !session.user || !session.user.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    redirect("/login");
  }

  let limit = 100;
  if (user.plan === "PRO") limit = 10000;
  if (user.plan === "EXPERT") limit = Infinity;

  const remaining = limit === Infinity ? "Unlimited" : limit - user.certificatesGenerated;

  return (
    <div className="min-h-screen bg-[#f5f5f0] flex flex-col">

      <header className="bg-black text-white p-4 flex justify-between items-center border-b-4 border-black sticky top-16 z-40">
        <div className="flex gap-3 items-center flex-wrap">
          <span className="font-bold text-yellow-400 uppercase tracking-widest text-sm">Dashboard</span>
          <span className="bg-yellow-400 text-black px-2 py-1 text-xs font-bold uppercase rounded-sm border-2 border-black">
            Plan: {user.plan}
          </span>
          <span className="bg-cyan-400 text-black px-2 py-1 text-xs font-bold uppercase rounded-sm border-2 border-black">
            Remaining: {remaining}
          </span>
        </div>
        <div className="flex gap-3 items-center">
          {user.plan !== "EXPERT" && (
            <Link href="/pricing" className="brut-btn bg-white text-black text-xs py-2 px-4 shadow-[2px_2px_0_#FFD60A]">
              Upgrade Plan
            </Link>
          )}
          <Link
            href="/dashboard/profile"
            className="brut-btn bg-white text-black text-xs py-2 px-4 shadow-[2px_2px_0_#000]"
            aria-label="My Profile"
            id="profile-link"
          >
            <User className="w-3.5 h-3.5" />
            Profile
          </Link>
          <LogoutButton />
        </div>
      </header>

      <Dashboard />
    </div>
  );
}
