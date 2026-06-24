import React from "react";
import { Loader2, CheckCircle2, AlertTriangle, Download, X, Sparkles } from "lucide-react";

export interface ProgressStep {
  label: string;
  status: "waiting" | "running" | "completed" | "failed";
}

interface ProgressModalProps {
  isOpen: boolean;
  steps: ProgressStep[];
  progress: number;
  errorMsg?: string;
  onDownload?: () => void;
  onClose: () => void;
}

export const ProgressModal: React.FC<ProgressModalProps> = ({
  isOpen,
  steps,
  progress,
  errorMsg,
  onDownload,
  onClose,
}) => {
  if (!isOpen) return null;

  const isCompleted = steps.every((s) => s.status === "completed");
  const isFailed = steps.some((s) => s.status === "failed");
  const isRunning = !isCompleted && !isFailed;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      {/* Backdrop */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(15,23,42,0.82)",
          backdropFilter: "blur(10px)",
        }}
        onClick={isCompleted || isFailed ? onClose : undefined}
      />

      {/* Modal */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 480,
          background: "#fff",
          borderRadius: 20,
          overflow: "hidden",
          boxShadow: "0 32px 80px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.08)",
        }}
      >
        {/* Top gradient header */}
        <div
          style={{
            background: isCompleted
              ? "linear-gradient(135deg, #059669, #10b981)"
              : isFailed
              ? "linear-gradient(135deg, #be123c, #f43f5e)"
              : "linear-gradient(135deg, #1a1a2e, #16213e)",
            padding: "24px 24px 20px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Decorative circle */}
          <div style={{
            position: "absolute", top: -30, right: -30,
            width: 140, height: 140, borderRadius: "50%",
            background: "rgba(255,255,255,0.05)",
            pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", top: 10, right: 20,
            width: 60, height: 60, borderRadius: "50%",
            background: "rgba(255,255,255,0.04)",
            pointerEvents: "none",
          }} />

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              {/* Icon bubble */}
              <div style={{
                width: 48, height: 48, borderRadius: 14,
                background: isCompleted ? "rgba(255,255,255,0.2)" : isFailed ? "rgba(255,255,255,0.15)" : "rgba(167,139,250,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                border: "1.5px solid rgba(255,255,255,0.15)",
              }}>
                {isCompleted ? (
                  <CheckCircle2 style={{ width: 24, height: 24, color: "#fff" }} />
                ) : isFailed ? (
                  <AlertTriangle style={{ width: 24, height: 24, color: "#fff" }} />
                ) : (
                  <Loader2 style={{ width: 24, height: 24, color: "#a78bfa", animation: "spin 1s linear infinite" }} />
                )}
              </div>
              <div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 17, fontWeight: 800, color: "#fff", letterSpacing: "-0.01em" }}>
                  {isCompleted ? "Certificates Ready!" : isFailed ? "Generation Failed" : "Generating Certificates"}
                </div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>
                  {isCompleted ? "All PDFs compiled successfully" : isFailed ? "An error occurred" : "Processing your batch…"}
                </div>
              </div>
            </div>

            {(isCompleted || isFailed) && (
              <button
                onClick={onClose}
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "1.5px solid rgba(255,255,255,0.2)",
                  borderRadius: 10,
                  cursor: "pointer",
                  padding: 8,
                  display: "flex",
                  alignItems: "center",
                  color: "#fff",
                  transition: "all 150ms ease",
                }}
                aria-label="Close modal"
              >
                <X style={{ width: 16, height: 16 }} />
              </button>
            )}
          </div>

          {/* Progress bar */}
          {isRunning && (
            <div style={{ marginTop: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Progress
                </span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 700, color: "#a78bfa" }}>
                  {Math.round(progress)}%
                </span>
              </div>
              <div style={{ height: 6, background: "rgba(255,255,255,0.1)", borderRadius: 6, overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    width: `${progress}%`,
                    background: "linear-gradient(90deg, #7c3aed, #a78bfa)",
                    borderRadius: 6,
                    transition: "width 400ms ease",
                    boxShadow: "0 0 8px rgba(167,139,250,0.5)",
                  }}
                />
              </div>
            </div>
          )}

          {/* Completed visual */}
          {isCompleted && (
            <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 6 }}>
              <Sparkles style={{ width: 14, height: 14, color: "rgba(255,255,255,0.7)" }} />
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.7)" }}>
                Ready to download as ZIP archive
              </span>
            </div>
          )}
        </div>

        {/* Body */}
        <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Steps list */}
          <div style={{
            background: "#f8fafc",
            border: "1.5px solid #e2e8f0",
            borderRadius: 14,
            padding: "14px 16px",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}>
            {steps.map((step, idx) => {
              const isStepRunning = step.status === "running";
              const isDone = step.status === "completed";
              const isBad = step.status === "failed";

              return (
                <div key={idx} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "8px 10px",
                  borderRadius: 10,
                  background: isStepRunning ? "linear-gradient(135deg, #f5f3ff, #ede9fe)" : isDone ? "#f0fdf4" : "transparent",
                  border: isStepRunning ? "1.5px solid #c4b5fd" : isDone ? "1.5px solid #bbf7d0" : "1.5px solid transparent",
                  transition: "all 200ms ease",
                }}>
                  {/* Indicator */}
                  <div style={{
                    width: 28, height: 28, borderRadius: 8,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                    background: isDone ? "#10b981" : isBad ? "#f43f5e" : isStepRunning ? "#7c3aed" : "#e2e8f0",
                    transition: "all 200ms ease",
                  }}>
                    {isStepRunning ? (
                      <Loader2 style={{ width: 14, height: 14, color: "#fff", animation: "spin 1s linear infinite" }} />
                    ) : isDone ? (
                      <CheckCircle2 style={{ width: 14, height: 14, color: "#fff" }} />
                    ) : isBad ? (
                      <X style={{ width: 14, height: 14, color: "#fff" }} />
                    ) : (
                      <span style={{ fontSize: 10, fontWeight: 800, color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace" }}>
                        {idx + 1}
                      </span>
                    )}
                  </div>

                  {/* Label */}
                  <span style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: 13,
                    fontWeight: isStepRunning || isDone ? 700 : 500,
                    color: isDone ? "#059669" : isBad ? "#be123c" : isStepRunning ? "#5b21b6" : "#94a3b8",
                    flex: 1,
                  }}>
                    {step.label}
                  </span>

                  {/* Badge */}
                  {isStepRunning && (
                    <span style={{
                      background: "#7c3aed",
                      color: "#fff",
                      fontSize: 9,
                      fontWeight: 800,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      padding: "3px 8px",
                      borderRadius: 20,
                      fontFamily: "'JetBrains Mono', monospace",
                    }}>
                      Running
                    </span>
                  )}
                  {isDone && (
                    <span style={{
                      background: "#dcfce7",
                      color: "#059669",
                      fontSize: 9,
                      fontWeight: 800,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      padding: "3px 8px",
                      borderRadius: 20,
                      fontFamily: "'JetBrains Mono', monospace",
                    }}>
                      Done
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Error message */}
          {isFailed && errorMsg && (
            <div style={{
              background: "#fff1f2",
              border: "1.5px solid #fecdd3",
              borderRadius: 12,
              padding: "12px 16px",
              display: "flex",
              gap: 10,
              alignItems: "flex-start",
            }}>
              <AlertTriangle style={{ width: 16, height: 16, color: "#f43f5e", flexShrink: 0, marginTop: 1 }} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600, color: "#be123c", lineHeight: 1.5 }}>
                {errorMsg}
              </span>
            </div>
          )}

          {/* Actions */}
          {(isCompleted || isFailed) && (
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button
                onClick={onClose}
                style={{
                  padding: "10px 20px",
                  background: "#f8fafc",
                  border: "1.5px solid #e2e8f0",
                  borderRadius: 10,
                  cursor: "pointer",
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#475569",
                  transition: "all 150ms ease",
                }}
              >
                Close
              </button>

              {isCompleted && onDownload && (
                <button
                  onClick={onDownload}
                  style={{
                    padding: "10px 22px",
                    background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                    border: "none",
                    borderRadius: 10,
                    cursor: "pointer",
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    boxShadow: "0 4px 16px rgba(124,58,237,0.4)",
                    transition: "all 150ms ease",
                  }}
                >
                  <Download style={{ width: 15, height: 15 }} />
                  Download ZIP
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};
