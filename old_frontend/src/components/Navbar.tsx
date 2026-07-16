import React from "react";
import { FileBadge, Shield, Zap } from "lucide-react";

export const Navbar: React.FC = () => {
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

      {/* Right side */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 14px",
            border: "2px solid #333",
            borderRadius: 2,
            background: "#111",
            color: "#00E5FF",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            fontFamily: "'Space Grotesk', system-ui, sans-serif",
          }}
        >
          <Shield style={{ width: 12, height: 12 }} />
          <span>Local Only</span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 14px",
            border: "2px solid #FFD60A",
            borderRadius: 2,
            background: "transparent",
            color: "#FFD60A",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.05em",
            fontFamily: "'Space Grotesk', system-ui, sans-serif",
          }}
        >
          <Zap style={{ width: 12, height: 12 }} />
          <span>v2.0</span>
        </div>
      </div>
    </header>
  );
};
