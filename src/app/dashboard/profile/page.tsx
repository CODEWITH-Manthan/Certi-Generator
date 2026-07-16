"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Shield,
  BarChart3,
  Calendar,
  Edit3,
  Check,
  X,
  ArrowLeft,
  Zap,
  Crown,
  Star,
} from "lucide-react";
import Link from "next/link";

interface UserProfile {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  plan: string;
  certificatesGenerated: number;
  createdAt: string;
}

const PLAN_META: Record<
  string,
  { label: string; accent: string; shadow: string; limit: string }
> = {
  FREE: {
    label: "Free",
    accent: "#f5f5f0",
    shadow: "6px 6px 0 #000",
    limit: "100 certificates / billing period",
  },
  PRO: {
    label: "Pro",
    accent: "#FFD60A",
    shadow: "6px 6px 0 #FFD60A",
    limit: "10,000 certificates / billing period",
  },
  EXPERT: {
    label: "Expert",
    accent: "#00E5FF",
    shadow: "6px 6px 0 #00E5FF",
    limit: "Unlimited certificates",
  },
};

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((data) => {
        setUser(data);
        setNameInput(data.name ?? "");
      })
      .catch(() => setError("Failed to load profile."))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!nameInput.trim()) return;
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nameInput }),
      });
      if (!res.ok) throw new Error("Update failed");
      const updated = await res.json();
      setUser(updated);
      setEditing(false);
      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(""), 3500);
    } catch {
      setError("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleManageSubscription = async () => {
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      if (!res.ok) throw new Error("Portal error");
      const { url } = await res.json();
      window.location.href = url;
    } catch {
      setError("Failed to open subscription portal. Please try again later.");
    }
  };

  const handleCancel = () => {
    setNameInput(user?.name ?? "");
    setEditing(false);
    setError("");
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "80vh",
          background: "#f5f5f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontFamily: "'Space Grotesk', system-ui, sans-serif",
            fontSize: 16,
            fontWeight: 700,
            color: "#000",
          }}
        >
          Loading profile…
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ minHeight: "80vh", background: "#f5f5f0", padding: "48px 24px" }}>
        <p
          style={{
            fontFamily: "'Space Grotesk', system-ui, sans-serif",
            color: "#FF4D6D",
            fontWeight: 700,
          }}
        >
          {error || "Failed to load profile."}
        </p>
      </div>
    );
  }

  const planMeta = PLAN_META[user.plan] ?? PLAN_META.FREE;

  const joinDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const initials = (user.name ?? user.email ?? "?")
    .split(/\s+/)
    .map((w: string) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f0", padding: "40px 24px 80px" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>

        {/* Back link */}
        <Link
          href="/dashboard"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontFamily: "'Space Grotesk', system-ui, sans-serif",
            fontSize: 12,
            fontWeight: 700,
            color: "#000",
            textDecoration: "none",
            marginBottom: 36,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            borderBottom: "2px solid transparent",
          }}
        >
          <ArrowLeft style={{ width: 15, height: 15 }} />
          Back to Dashboard
        </Link>

        {/* Page header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <span
              style={{
                display: "inline-block",
                background: "#000",
                color: "#FFD60A",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "4px 10px",
                fontFamily: "'Space Grotesk', system-ui, sans-serif",
              }}
            >
              My Account
            </span>
          </div>
          <h1
            style={{
              fontFamily: "'Space Grotesk', system-ui, sans-serif",
              fontSize: "clamp(28px, 5vw, 42px)",
              fontWeight: 900,
              color: "#000",
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              marginBottom: 8,
            }}
          >
            Profile &amp;{" "}
            <span style={{ background: "#FFD60A", paddingLeft: 4, paddingRight: 4 }}>
              Settings
            </span>
          </h1>
          <p
            style={{
              fontFamily: "'Space Grotesk', system-ui, sans-serif",
              fontSize: 14,
              fontWeight: 500,
              color: "#555",
            }}
          >
            View and manage your account information.
          </p>
        </div>

        {/* ── Personal Information Card ── */}
        <div
          style={{
            background: "#fff",
            border: "3px solid #000",
            boxShadow: "8px 8px 0 #000",
            borderRadius: 4,
            marginBottom: 20,
          }}
        >
          {/* Card header */}
          <div
            style={{
              background: "#FFD60A",
              borderBottom: "3px solid #000",
              padding: "12px 24px",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <User style={{ width: 16, height: 16, color: "#000" }} />
            <span
              style={{
                fontFamily: "'Space Grotesk', system-ui, sans-serif",
                fontSize: 12,
                fontWeight: 800,
                color: "#000",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              Personal Information
            </span>
          </div>

          <div style={{ padding: "28px 24px" }}>
            {/* Avatar + fields */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 24, flexWrap: "wrap" }}>

              {/* Avatar */}
              <div
                style={{
                  width: 76,
                  height: 76,
                  background: "#000",
                  border: "3px solid #000",
                  boxShadow: "4px 4px 0 #FFD60A",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  overflow: "hidden",
                }}
              >
                {user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.image}
                    alt="Profile avatar"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <span
                    style={{
                      fontFamily: "'Space Grotesk', system-ui, sans-serif",
                      fontSize: 26,
                      fontWeight: 900,
                      color: "#FFD60A",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {initials}
                  </span>
                )}
              </div>

              {/* Fields */}
              <div style={{ flex: 1, minWidth: 220 }}>

                {/* Display Name */}
                <div style={{ marginBottom: 24 }}>
                  <label
                    style={{
                      display: "block",
                      fontFamily: "'Space Grotesk', system-ui, sans-serif",
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "#555",
                      marginBottom: 8,
                    }}
                  >
                    Display Name
                  </label>

                  {editing ? (
                    <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                      <input
                        className="brut-input"
                        style={{ maxWidth: 260, flex: "1 1 200px" }}
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSave();
                          if (e.key === "Escape") handleCancel();
                        }}
                        autoFocus
                        placeholder="Your display name"
                        aria-label="Display name input"
                        id="profile-name-input"
                      />
                      <button
                        onClick={handleSave}
                        disabled={saving || !nameInput.trim()}
                        className="brut-btn brut-btn-yellow"
                        style={{ padding: "9px 18px", fontSize: 13 }}
                        aria-label="Save display name"
                        id="profile-save-btn"
                      >
                        <Check style={{ width: 14, height: 14 }} />
                        {saving ? "Saving…" : "Save"}
                      </button>
                      <button
                        onClick={handleCancel}
                        className="brut-btn brut-btn-white"
                        style={{ padding: "9px 14px", fontSize: 13 }}
                        aria-label="Cancel editing"
                        id="profile-cancel-btn"
                      >
                        <X style={{ width: 14, height: 14 }} />
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span
                        style={{
                          fontFamily: "'Space Grotesk', system-ui, sans-serif",
                          fontSize: 22,
                          fontWeight: 800,
                          color: "#000",
                          letterSpacing: "-0.02em",
                        }}
                      >
                        {user.name || <span style={{ color: "#aaa", fontWeight: 500, fontSize: 18 }}>Not set</span>}
                      </span>
                      <button
                        onClick={() => { setEditing(true); }}
                        className="brut-btn brut-btn-white"
                        style={{ padding: "6px 14px", fontSize: 12 }}
                        aria-label="Edit display name"
                        id="profile-edit-btn"
                      >
                        <Edit3 style={{ width: 12, height: 12 }} />
                        Edit
                      </button>
                    </div>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontFamily: "'Space Grotesk', system-ui, sans-serif",
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "#555",
                      marginBottom: 8,
                    }}
                  >
                    Email Address
                  </label>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      flexWrap: "wrap",
                      background: "#f5f5f0",
                      border: "2px solid #000",
                      padding: "10px 14px",
                    }}
                  >
                    <Mail style={{ width: 15, height: 15, color: "#555", flexShrink: 0 }} />
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 14,
                        fontWeight: 600,
                        color: "#000",
                        letterSpacing: "0.01em",
                      }}
                    >
                      {user.email}
                    </span>
                    <span
                      style={{
                        background: "#00E5FF",
                        border: "2px solid #000",
                        fontSize: 10,
                        fontWeight: 800,
                        padding: "2px 8px",
                        fontFamily: "'Space Grotesk', system-ui, sans-serif",
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        marginLeft: "auto",
                        flexShrink: 0,
                      }}
                    >
                      Verified
                    </span>
                  </div>
                  <p
                    style={{
                      fontFamily: "'Space Grotesk', system-ui, sans-serif",
                      fontSize: 11,
                      fontWeight: 500,
                      color: "#888",
                      marginTop: 6,
                    }}
                  >
                    Email cannot be changed. Contact support if needed.
                  </p>
                </div>
              </div>
            </div>

            {/* Feedback */}
            {success && (
              <div
                style={{
                  marginTop: 20,
                  background: "#d4f7d4",
                  border: "2px solid #000",
                  padding: "10px 16px",
                  fontFamily: "'Space Grotesk', system-ui, sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#000",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
                role="alert"
              >
                <Check style={{ width: 14, height: 14 }} />
                {success}
              </div>
            )}
            {error && (
              <div
                style={{
                  marginTop: 20,
                  background: "#ffe0e6",
                  border: "2px solid #FF4D6D",
                  padding: "10px 16px",
                  fontFamily: "'Space Grotesk', system-ui, sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#000",
                }}
                role="alert"
              >
                {error}
              </div>
            )}
          </div>
        </div>

        {/* ── Subscription Plan Card ── */}
        <div
          style={{
            background: "#fff",
            border: "3px solid #000",
            boxShadow: planMeta.shadow,
            borderRadius: 4,
            marginBottom: 20,
          }}
        >
          <div
            style={{
              background: planMeta.accent,
              borderBottom: "3px solid #000",
              padding: "12px 24px",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <Shield style={{ width: 16, height: 16, color: "#000" }} />
            <span
              style={{
                fontFamily: "'Space Grotesk', system-ui, sans-serif",
                fontSize: 12,
                fontWeight: 800,
                color: "#000",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              Subscription Plan
            </span>
          </div>

          <div style={{ padding: "24px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 20,
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                  <div
                    style={{
                      background: planMeta.accent,
                      border: "3px solid #000",
                      padding: "6px 14px",
                      fontFamily: "'Space Grotesk', system-ui, sans-serif",
                      fontSize: 13,
                      fontWeight: 900,
                      color: "#000",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                    }}
                  >
                    {planMeta.label}
                  </div>
                  <span
                    style={{
                      fontFamily: "'Space Grotesk', system-ui, sans-serif",
                      fontSize: 26,
                      fontWeight: 900,
                      color: "#000",
                      letterSpacing: "-0.03em",
                    }}
                  >
                    Plan
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Zap style={{ width: 14, height: 14, color: "#555" }} />
                  <p
                    style={{
                      fontFamily: "'Space Grotesk', system-ui, sans-serif",
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#555",
                    }}
                  >
                    {planMeta.limit}
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                {user.plan !== "EXPERT" && (
                  <Link
                    href="/pricing"
                    className="brut-btn brut-btn-black"
                    style={{ fontSize: 13 }}
                    aria-label="Upgrade your plan"
                    id="profile-upgrade-btn"
                  >
                    <Zap style={{ width: 14, height: 14 }} />
                    Upgrade Plan
                  </Link>
                )}
                {user.plan === "EXPERT" && (
                  <div
                    style={{
                      background: "#00E5FF",
                      border: "3px solid #000",
                      padding: "8px 16px",
                      fontFamily: "'Space Grotesk', system-ui, sans-serif",
                      fontSize: 12,
                      fontWeight: 800,
                      color: "#000",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <Crown style={{ width: 14, height: 14 }} />
                    Max Tier
                  </div>
                )}
                {user.plan !== "FREE" && (
                  <button
                    onClick={handleManageSubscription}
                    className="brut-btn brut-btn-white"
                    style={{ fontSize: 13, border: "2px solid #000" }}
                    aria-label="Manage Subscription"
                    id="profile-manage-btn"
                  >
                    Manage Subscription
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Account Stats Card ── */}
        <div
          style={{
            background: "#fff",
            border: "3px solid #000",
            boxShadow: "8px 8px 0 #000",
            borderRadius: 4,
          }}
        >
          <div
            style={{
              background: "#00E5FF",
              borderBottom: "3px solid #000",
              padding: "12px 24px",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <BarChart3 style={{ width: 16, height: 16, color: "#000" }} />
            <span
              style={{
                fontFamily: "'Space Grotesk', system-ui, sans-serif",
                fontSize: 12,
                fontWeight: 800,
                color: "#000",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              Account Statistics
            </span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            }}
          >
            <div
              style={{
                padding: "24px 28px",
                borderRight: "3px solid #000",
              }}
            >
              <div
                style={{
                  fontFamily: "'Space Grotesk', system-ui, sans-serif",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#555",
                  marginBottom: 8,
                }}
              >
                Certificates Generated
              </div>
              <div
                style={{
                  fontFamily: "'Space Grotesk', system-ui, sans-serif",
                  fontSize: 44,
                  fontWeight: 900,
                  color: "#000",
                  letterSpacing: "-0.04em",
                  lineHeight: 1,
                }}
              >
                {user.certificatesGenerated.toLocaleString()}
              </div>
            </div>

            <div style={{ padding: "24px 28px" }}>
              <div
                style={{
                  fontFamily: "'Space Grotesk', system-ui, sans-serif",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#555",
                  marginBottom: 8,
                }}
              >
                Member Since
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 6 }}>
                <Calendar style={{ width: 22, height: 22, color: "#000" }} />
                <span
                  style={{
                    fontFamily: "'Space Grotesk', system-ui, sans-serif",
                    fontSize: 17,
                    fontWeight: 800,
                    color: "#000",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {joinDate}
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
