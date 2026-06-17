import React from "react";
import { Loader2, CheckCircle2, AlertTriangle, Download, X } from "lucide-react";

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

  const statusConfig = {
    completed: { label: "Done!", bg: "#FFD60A", text: "#000" },
    failed: { label: "Failed", bg: "#FF4D6D", text: "#fff" },
    running: { label: "Generating...", bg: "#000", text: "#FFD60A" },
  };

  const currentStatus = isCompleted ? "completed" : isFailed ? "failed" : "running";
  const sc = statusConfig[currentStatus];

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
          background: "rgba(0,0,0,0.75)",
        }}
        onClick={isCompleted || isFailed ? onClose : undefined}
      />

      {/* Modal */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 460,
          background: "#fff",
          border: "4px solid #000",
          boxShadow: "12px 12px 0 #000",
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        {/* Header bar */}
        <div
          style={{
            background: sc.bg,
            borderBottom: "3px solid #000",
            padding: "14px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {isCompleted ? (
              <CheckCircle2 style={{ width: 20, height: 20, color: sc.text }} />
            ) : isFailed ? (
              <AlertTriangle style={{ width: 20, height: 20, color: sc.text }} />
            ) : (
              <Loader2 style={{ width: 20, height: 20, color: sc.text, animation: "spin 1s linear infinite" }} />
            )}
            <span
              style={{
                fontFamily: "'Space Grotesk', system-ui, sans-serif",
                fontSize: 15,
                fontWeight: 800,
                color: sc.text,
                letterSpacing: "-0.01em",
              }}
            >
              {isCompleted ? "Certificates Ready!" : isFailed ? "Generation Failed" : "Generating Certificates"}
            </span>
          </div>
          {(isCompleted || isFailed) && (
            <button
              onClick={onClose}
              style={{
                background: "transparent",
                border: "2px solid",
                borderColor: sc.text,
                color: sc.text,
                cursor: "pointer",
                padding: 4,
                display: "flex",
                alignItems: "center",
                borderRadius: 2,
                transition: "all 150ms ease",
              }}
              aria-label="Close modal"
            >
              <X style={{ width: 14, height: 14 }} />
            </button>
          )}
        </div>

        {/* Body */}
        <div style={{ padding: "24px 20px", display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Progress bar */}
          {!isCompleted && !isFailed && (
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <span
                  style={{
                    fontFamily: "'Space Grotesk', system-ui, sans-serif",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#000",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  Progress
                </span>
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#000",
                  }}
                >
                  {Math.round(progress)}%
                </span>
              </div>
              <div className="brut-progress-track">
                <div
                  className="brut-progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Steps */}
          <div
            style={{
              background: "#f5f5f0",
              border: "2px solid #000",
              borderRadius: 2,
              padding: 16,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {steps.map((step, idx) => {
              const isRunning = step.status === "running";
              const isDone = step.status === "completed";
              const isBad = step.status === "failed";

              return (
                <div key={idx} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  {/* Step indicator */}
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      border: "2px solid #000",
                      borderRadius: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      background: isDone
                        ? "#FFD60A"
                        : isBad
                        ? "#FF4D6D"
                        : isRunning
                        ? "#000"
                        : "#fff",
                      transition: "all 150ms ease",
                    }}
                  >
                    {isRunning ? (
                      <Loader2
                        style={{
                          width: 12,
                          height: 12,
                          color: "#FFD60A",
                          animation: "spin 1s linear infinite",
                        }}
                      />
                    ) : isDone ? (
                      <CheckCircle2 style={{ width: 12, height: 12, color: "#000" }} />
                    ) : isBad ? (
                      <X style={{ width: 12, height: 12, color: "#fff" }} />
                    ) : (
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 800,
                          color: "#888",
                          fontFamily: "'JetBrains Mono', monospace",
                        }}
                      >
                        {idx + 1}
                      </span>
                    )}
                  </div>

                  {/* Step label */}
                  <span
                    style={{
                      fontFamily: "'Space Grotesk', system-ui, sans-serif",
                      fontSize: 13,
                      fontWeight: isRunning || isDone ? 700 : 500,
                      color: isDone ? "#000" : isBad ? "#FF4D6D" : isRunning ? "#000" : "#888",
                    }}
                  >
                    {step.label}
                  </span>

                  {/* Running badge */}
                  {isRunning && (
                    <span
                      style={{
                        marginLeft: "auto",
                        background: "#000",
                        color: "#FFD60A",
                        fontSize: 9,
                        fontWeight: 800,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        padding: "2px 8px",
                        borderRadius: 0,
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      Running
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Error message */}
          {isFailed && errorMsg && (
            <div
              style={{
                background: "#fff0f2",
                border: "3px solid #FF4D6D",
                boxShadow: "4px 4px 0 #FF4D6D",
                borderRadius: 2,
                padding: "12px 16px",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12,
                fontWeight: 600,
                color: "#FF4D6D",
              }}
            >
              {errorMsg}
            </div>
          )}

          {/* Actions */}
          {(isCompleted || isFailed) && (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 12,
                borderTop: "2px solid #000",
                paddingTop: 16,
              }}
            >
              <button
                onClick={onClose}
                className="brut-btn brut-btn-white"
                style={{ fontSize: 13 }}
              >
                Close
              </button>

              {isCompleted && onDownload && (
                <button
                  onClick={onDownload}
                  className="brut-btn brut-btn-yellow"
                  style={{ fontSize: 13 }}
                >
                  <Download style={{ width: 16, height: 16 }} />
                  <span>Download ZIP</span>
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
