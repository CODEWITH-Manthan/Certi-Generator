import React from "react";
import { FileBadge, Shield, Zap } from "lucide-react";
import Link from "next/link";
import { auth } from "@/lib/auth";

export default async function Navbar() {
  const session = await auth();

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        width: "100%",
        background: "#000",
        borderBottom: "3px solid #000",
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "64px",
      }}
    >
      {/* Logo */}
      <Link href="/" style={{ textDecoration: "none" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              background: "#FFD60A",
              border: "3px solid #000",
              padding: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FileBadge style={{ width: 22, height: 22, color: "#000" }} />
          </div>
          <div>
            <h1
              style={{
                fontFamily: "'Space Grotesk', system-ui, sans-serif",
                fontSize: 20,
                fontWeight: 800,
                color: "#FFD60A",
                letterSpacing: "-0.02em",
                lineHeight: 1,
                margin: 0,
              }}
            >
              CertiGen
            </h1>
            <p
              style={{
                fontFamily: "'Space Grotesk', system-ui, sans-serif",
                fontSize: 10,
                fontWeight: 600,
                color: "#888",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                margin: 0,
              }}
            >
              Certificate Engine
            </p>
          </div>
        </div>
      </Link>

      {/* Right side */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {session ? (
          <Link href="/dashboard" className="brut-btn brut-btn-yellow" style={{ padding: "8px 16px" }}>
            Dashboard
          </Link>
        ) : (
          <Link href="/login" className="brut-btn brut-btn-white" style={{ padding: "8px 16px" }}>
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
}
