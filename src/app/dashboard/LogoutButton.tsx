"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="brut-btn bg-[#FF4D6D] text-white text-xs py-2 px-4 shadow-[2px_2px_0_#000]"
    >
      <LogOut className="w-4 h-4 mr-2" /> Logout
    </button>
  );
}
