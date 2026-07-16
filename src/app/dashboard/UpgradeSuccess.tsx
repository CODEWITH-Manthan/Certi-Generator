"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

/**
 * Client component: detects ?session_id=... on the dashboard URL after a
 * Stripe checkout redirect, calls /api/stripe/verify-session to confirm and
 * update the plan, then reloads the page so the new plan badge appears.
 */
export default function UpgradeSuccess() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const calledRef = useRef(false);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (!sessionId || calledRef.current) return;
    calledRef.current = true;

    (async () => {
      try {
        const res = await fetch("/api/stripe/verify-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });

        if (res.ok) {
          const data = await res.json();
          console.log("[UpgradeSuccess] Plan confirmed:", data.plan);
        } else {
          const err = await res.json();
          console.warn("[UpgradeSuccess] verify-session returned error:", err);
        }
      } catch (e) {
        console.error("[UpgradeSuccess] fetch error:", e);
      } finally {
        // Remove session_id from URL and refresh the server-side data
        router.replace("/dashboard");
        router.refresh();
      }
    })();
  }, [searchParams, router]);

  return null;
}
