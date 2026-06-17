import React, { useEffect } from "react";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";

export interface ToastProps {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

interface NotificationProps {
  toast: ToastProps | null;
  onClose: () => void;
}

export const Notification: React.FC<NotificationProps> = ({ toast, onClose }) => {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  if (!toast) return null;

  const { message, type } = toast;

  const config = {
    success: {
      bg: "#000",
      border: "#FFD60A",
      text: "#FFD60A",
      shadow: "6px 6px 0 #FFD60A",
      icon: <CheckCircle2 style={{ width: 18, height: 18, color: "#FFD60A", flexShrink: 0 }} />,
      label: "SUCCESS",
    },
    error: {
      bg: "#000",
      border: "#FF4D6D",
      text: "#FF4D6D",
      shadow: "6px 6px 0 #FF4D6D",
      icon: <XCircle style={{ width: 18, height: 18, color: "#FF4D6D", flexShrink: 0 }} />,
      label: "ERROR",
    },
    info: {
      bg: "#000",
      border: "#00E5FF",
      text: "#00E5FF",
      shadow: "6px 6px 0 #00E5FF",
      icon: <Info style={{ width: 18, height: 18, color: "#00E5FF", flexShrink: 0 }} />,
      label: "INFO",
    },
  };

  const c = config[type];

  return (
    <div
      style={{
        position: "fixed",
        bottom: 28,
        right: 28,
        zIndex: 100,
        animation: "slideUp 200ms ease",
      }}
    >
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
      <div
        style={{
          background: c.bg,
          border: `3px solid ${c.border}`,
          boxShadow: c.shadow,
          borderRadius: 4,
          padding: "14px 18px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          maxWidth: 360,
          minWidth: 260,
        }}
      >
        {c.icon}
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontFamily: "'Space Grotesk', system-ui, sans-serif",
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: c.text,
              marginBottom: 2,
            }}
          >
            {c.label}
          </div>
          <div
            style={{
              fontFamily: "'Space Grotesk', system-ui, sans-serif",
              fontSize: 13,
              fontWeight: 600,
              color: "#fff",
              lineHeight: 1.4,
            }}
          >
            {message}
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "#555",
            padding: 4,
            display: "flex",
            alignItems: "center",
            transition: "color 150ms ease",
          }}
          aria-label="Close notification"
          onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#555")}
        >
          <X style={{ width: 16, height: 16 }} />
        </button>
      </div>
    </div>
  );
};
