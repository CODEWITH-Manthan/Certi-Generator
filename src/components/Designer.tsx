"use client";
import React, { useRef, useState, useEffect } from "react";
import {
  Move,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Eye,
  EyeOff,
  Layers,
  Sliders,
} from "lucide-react";

export interface FieldConfig {
  column: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  font: string;
  isBold: boolean;
  isItalic: boolean;
  align: "left" | "center" | "right";
  label: string;
  previewText: string;
  icon: React.ReactNode;
}

interface DesignerProps {
  templateUrl: string;
  columns: string[];
  fields: Record<string, FieldConfig>;
  sampleData?: Record<string, string>;
  onChange: (fields: Record<string, FieldConfig>) => void;
}

/* ── Font catalogue with categories ───────────────────── */
const FONT_GROUPS = [
  {
    group: "✦ Calligraphy & Script",
    fonts: [
      { value: "Great Vibes", label: "Great Vibes" },
      { value: "Dancing Script", label: "Dancing Script" },
      { value: "Pacifico", label: "Pacifico" },
      { value: "Sacramento", label: "Sacramento" },
      { value: "Pinyon Script", label: "Pinyon Script" },
      { value: "Alex Brush", label: "Alex Brush" },
      { value: "Allura", label: "Allura" },
      { value: "Tangerine", label: "Tangerine" },
      { value: "Italianno", label: "Italianno" },
      { value: "Parisienne", label: "Parisienne" },
    ],
  },
  {
    group: "✦ Elegant Serif",
    fonts: [
      { value: "Playfair Display", label: "Playfair Display" },
      { value: "Cormorant Garamond", label: "Cormorant Garamond" },
      { value: "Cinzel", label: "Cinzel" },
      { value: "Lora", label: "Lora" },
      { value: "Merriweather", label: "Merriweather" },
      { value: "EB Garamond", label: "EB Garamond" },
      { value: "Libre Baskerville", label: "Libre Baskerville" },
      { value: "Crimson Text", label: "Crimson Text" },
    ],
  },
  {
    group: "✦ Modern Sans-Serif",
    fonts: [
      { value: "Inter", label: "Inter" },
      { value: "Poppins", label: "Poppins" },
      { value: "Outfit", label: "Outfit" },
      { value: "Montserrat", label: "Montserrat" },
      { value: "Raleway", label: "Raleway" },
      { value: "Nunito", label: "Nunito" },
      { value: "DM Sans", label: "DM Sans" },
      { value: "Plus Jakarta Sans", label: "Plus Jakarta Sans" },
    ],
  },
  {
    group: "✦ Display & Decorative",
    fonts: [
      { value: "Josefin Sans", label: "Josefin Sans" },
      { value: "Oswald", label: "Oswald" },
      { value: "Bebas Neue", label: "Bebas Neue" },
      { value: "Abril Fatface", label: "Abril Fatface" },
      { value: "Righteous", label: "Righteous" },
    ],
  },
  {
    group: "✦ Classic",
    fonts: [
      { value: "Roboto", label: "Roboto" },
      { value: "Open Sans", label: "Open Sans" },
      { value: "Lato", label: "Lato" },
      { value: "Ubuntu", label: "Ubuntu" },
      { value: "Source Sans 3", label: "Source Sans 3" },
    ],
  },
];

/* Google Fonts import string for UI previews */
const GOOGLE_FONTS_URL =
  "https://fonts.googleapis.com/css2?family=Great+Vibes&family=Dancing+Script:wght@400;700&family=Pacifico&family=Sacramento&family=Pinyon+Script&family=Alex+Brush&family=Allura&family=Tangerine:wght@400;700&family=Italianno&family=Parisienne&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Cinzel:wght@400;600;700&family=Lora:ital,wght@0,400;0,700;1,400&family=Merriweather:wght@400;700&family=EB+Garamond:ital,wght@0,400;0,600;1,400&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Crimson+Text:ital,wght@0,400;0,600;1,400&family=Inter:wght@400;600;700&family=Poppins:wght@400;600;700&family=Outfit:wght@400;600;700&family=Montserrat:wght@400;600;700&family=Raleway:wght@400;600;700&family=Nunito:wght@400;600;700&family=DM+Sans:wght@400;600;700&family=Plus+Jakarta+Sans:wght@400;600;700&family=Josefin+Sans:wght@400;600;700&family=Oswald:wght@400;600;700&family=Bebas+Neue&family=Abril+Fatface&family=Righteous&family=Roboto:wght@400;700&family=Open+Sans:wght@400;700&family=Lato:wght@400;700&family=Ubuntu:wght@400;700&family=Source+Sans+3:wght@400;700&display=swap";

export const Designer: React.FC<DesignerProps> = ({
  templateUrl,
  columns,
  fields,
  sampleData,
  onChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeField, setActiveField] = useState<string>("name");
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });

  // Inject Google Fonts into document head once
  useEffect(() => {
    if (!document.getElementById("designer-gfonts")) {
      const link = document.createElement("link");
      link.id = "designer-gfonts";
      link.rel = "stylesheet";
      link.href = GOOGLE_FONTS_URL;
      document.head.appendChild(link);
    }
  }, []);

  const updateDimensions = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setContainerDimensions({ width: rect.width, height: rect.height });
    }
  };

  useEffect(() => {
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [templateUrl]);

  const handleMouseDown = (fieldKey: string, e: React.MouseEvent) => {
    e.preventDefault();
    setActiveField(fieldKey);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      let x = (moveEvent.clientX - rect.left) / rect.width;
      let y = (moveEvent.clientY - rect.top) / rect.height;
      x = Math.max(0.01, Math.min(0.99, x));
      y = Math.max(0.01, Math.min(0.99, y));
      onChange({ ...fields, [fieldKey]: { ...fields[fieldKey], x, y } });
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const updateFieldProperty = (fieldKey: string, key: keyof FieldConfig, value: any) => {
    onChange({ ...fields, [fieldKey]: { ...fields[fieldKey], [key]: value } });
  };

  const activeF = fields[activeField];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 24, alignItems: "start" }}>
      {/* ── Left: Canvas ───────────────────────────────── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {/* Canvas toolbar */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
          padding: "12px 18px",
          borderRadius: "12px 12px 0 0",
          border: "1.5px solid #2d2d54",
          borderBottom: "none",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 8, height: 8, borderRadius: "50%",
              background: "linear-gradient(135deg, #a78bfa, #7c3aed)",
              boxShadow: "0 0 8px rgba(167,139,250,0.6)",
            }} />
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, fontWeight: 700, color: "#e2e8f0", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Interactive Canvas
            </span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#64748b", background: "#1e293b", padding: "2px 8px", borderRadius: 4, border: "1px solid #334155" }}>
              Drag to reposition
            </span>
          </div>
          <button
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "6px 14px",
              background: isPreviewMode ? "linear-gradient(135deg, #fbbf24, #f59e0b)" : "rgba(255,255,255,0.06)",
              border: isPreviewMode ? "1.5px solid #f59e0b" : "1.5px solid rgba(255,255,255,0.12)",
              borderRadius: 8,
              cursor: "pointer",
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 12,
              fontWeight: 700,
              color: isPreviewMode ? "#000" : "#cbd5e1",
              transition: "all 200ms ease",
              boxShadow: isPreviewMode ? "0 0 12px rgba(251,191,36,0.4)" : "none",
            }}
          >
            {isPreviewMode ? <Eye style={{ width: 13, height: 13 }} /> : <EyeOff style={{ width: 13, height: 13 }} />}
            {isPreviewMode ? "Preview ON" : "Preview OFF"}
          </button>
        </div>

        {/* Canvas */}
        <div style={{
          border: "1.5px solid #2d2d54",
          borderTop: "none",
          borderRadius: "0 0 12px 12px",
          overflow: "hidden",
          position: "relative",
          userSelect: "none",
          lineHeight: 0,
          background: "#0f0f1a",
          boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
        }}>
          <img
            ref={containerRef as any}
            src={templateUrl}
            alt="Certificate Template"
            onLoad={updateDimensions}
            style={{ display: "block", width: "100%", height: "auto", maxHeight: 600, objectFit: "contain", pointerEvents: "none" }}
          />

          {Object.entries(fields).map(([key, field]) => {
            const isActive = activeField === key;
            let transformX = "0";
            if (field.align === "center") transformX = "-50%";
            else if (field.align === "right") transformX = "-100%";

            let displayText = field.column ? `[${field.column}]` : field.previewText;
            if (isPreviewMode) {
              displayText = (field.column && sampleData?.[field.column]) || field.previewText;
            }

            return (
              <div
                key={key}
                onMouseDown={(e) => handleMouseDown(key, e)}
                style={{
                  position: "absolute",
                  left: `${field.x * 100}%`,
                  top: `${field.y * 100}%`,
                  transform: `translateX(${transformX}) translateY(-50%)`,
                  color: field.color,
                  fontSize: `${Math.max(10, field.fontSize * containerDimensions.height)}px`,
                  fontFamily: field.font,
                  fontWeight: field.isBold ? "bold" : "normal",
                  fontStyle: field.isItalic ? "italic" : "normal",
                  border: isActive ? "2px solid #a78bfa" : "1.5px solid rgba(255,255,255,0.3)",
                  background: isActive ? "rgba(124,58,237,0.85)" : "rgba(15,15,26,0.72)",
                  backdropFilter: "blur(6px)",
                  boxShadow: isActive ? "0 0 0 3px rgba(167,139,250,0.35), 0 4px 16px rgba(0,0,0,0.4)" : "0 2px 8px rgba(0,0,0,0.3)",
                  zIndex: isActive ? 20 : 10,
                  padding: "4px 10px",
                  borderRadius: 6,
                  cursor: "move",
                  userSelect: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  whiteSpace: "nowrap",
                  lineHeight: 1,
                  transition: "border 100ms ease, box-shadow 100ms ease",
                }}
              >
                <div style={{ color: isActive ? "#fbbf24" : "#94a3b8" }}>
                  <Move style={{ width: 12, height: 12 }} />
                </div>
                <span style={{ color: isActive ? "#f1f5f9" : "#e2e8f0", fontSize: "0.85em" }}>{displayText}</span>
              </div>
            );
          })}
        </div>

        {/* Canvas legend */}
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 12 }}>
          {Object.entries(fields).map(([key, field]) => (
            <button
              key={key}
              onClick={() => setActiveField(key)}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "5px 12px",
                background: activeField === key ? "linear-gradient(135deg, #7c3aed, #4f46e5)" : "#f8fafc",
                border: activeField === key ? "1.5px solid #7c3aed" : "1.5px solid #e2e8f0",
                borderRadius: 20,
                cursor: "pointer",
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 11,
                fontWeight: 700,
                color: activeField === key ? "#fff" : "#475569",
                transition: "all 150ms ease",
                boxShadow: activeField === key ? "0 2px 8px rgba(124,58,237,0.3)" : "none",
              }}
            >
              <span style={{ display: "flex" }}>{field.icon}</span>
              {field.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Right: Editor Panel ────────────────────────── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

        {/* Field Selector */}
        <div style={{
          background: "#fff",
          border: "1.5px solid #e2e8f0",
          borderRadius: 16,
          padding: "18px 16px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <div style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)", padding: 7, borderRadius: 8, display: "flex" }}>
              <Layers style={{ width: 14, height: 14, color: "#fff" }} />
            </div>
            <div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: 800, color: "#0f172a" }}>Field Layers</div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: "#94a3b8", marginTop: 1 }}>Click to select & configure</div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {Object.entries(fields).map(([key, field]) => {
              const isActive = activeField === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveField(key)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 12px",
                    border: isActive ? "2px solid #7c3aed" : "1.5px solid #e2e8f0",
                    borderRadius: 10,
                    textAlign: "left",
                    background: isActive ? "linear-gradient(135deg, #f5f3ff, #ede9fe)" : "#fafafa",
                    cursor: "pointer",
                    transition: "all 150ms ease",
                    boxShadow: isActive ? "0 2px 12px rgba(124,58,237,0.2)" : "none",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                      background: isActive ? "linear-gradient(135deg, #7c3aed, #4f46e5)" : "#f1f5f9",
                      padding: 7, borderRadius: 8, display: "flex",
                      color: isActive ? "#fff" : "#64748b",
                    }}>
                      {field.icon}
                    </div>
                    <div>
                      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, fontWeight: 700, color: "#0f172a" }}>{field.label}</div>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: field.column ? "#7c3aed" : "#94a3b8", marginTop: 1 }}>
                        {field.column ? `← ${field.column}` : "Unmapped"}
                      </div>
                    </div>
                  </div>
                  <div style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "#94a3b8",
                    background: "#f1f5f9", padding: "2px 6px", borderRadius: 4,
                  }}>
                    {Math.round(field.x * 100)}%,{Math.round(field.y * 100)}%
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Field Property Editor */}
        <div style={{
          background: "#fff",
          border: "1.5px solid #e2e8f0",
          borderRadius: 16,
          padding: "18px 16px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
        }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, borderBottom: "1.5px solid #f1f5f9", paddingBottom: 14, marginBottom: 18 }}>
            <div style={{ background: "linear-gradient(135deg, #0ea5e9, #0284c7)", padding: 7, borderRadius: 8, display: "flex" }}>
              <Sliders style={{ width: 14, height: 14, color: "#fff" }} />
            </div>
            <div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: 800, color: "#0f172a" }}>
                Configure — {activeF.label}
              </div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: "#94a3b8", marginTop: 1 }}>
                Data source · Typography · Style
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Column Source */}
            <div>
              <label style={labelStyle}>
                <span style={dotStyle("#10b981")} /> Data Source Column
              </label>
              <select
                value={activeF.column}
                onChange={(e) => updateFieldProperty(activeField, "column", e.target.value)}
                style={selectStyle}
              >
                <option value="">— Do Not Render —</option>
                {columns.map((col) => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>

            {/* Font Family */}
            <div>
              <label style={labelStyle}>
                <span style={dotStyle("#8b5cf6")} /> Font Family
              </label>
              <div style={{ position: "relative" }}>
                <select
                  value={activeF.font}
                  onChange={(e) => updateFieldProperty(activeField, "font", e.target.value)}
                  style={{
                    ...selectStyle,
                    fontFamily: activeF.font,
                    fontSize: 14,
                    paddingTop: 10,
                    paddingBottom: 10,
                    fontWeight: 500,
                    color: "#0f172a",
                    height: 46,
                  }}
                >
                  {FONT_GROUPS.map((group) => (
                    <optgroup key={group.group} label={group.group}>
                      {group.fonts.map((f) => (
                        <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>
                          {f.label}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
              {/* Live preview of selected font */}
              <div style={{
                marginTop: 8,
                padding: "10px 14px",
                background: "linear-gradient(135deg, #f8fafc, #f1f5f9)",
                border: "1.5px solid #e2e8f0",
                borderRadius: 10,
                fontFamily: activeF.font,
                fontSize: 20,
                fontWeight: activeF.isBold ? "bold" : "normal",
                fontStyle: activeF.isItalic ? "italic" : "normal",
                color: activeF.color,
                textAlign: "center",
                letterSpacing: "0.02em",
                minHeight: 48,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                wordBreak: "break-word",
              }}>
                {activeF.previewText || "Preview Text"}
              </div>
            </div>

            {/* Style & Alignment Row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {/* Bold / Italic */}
              <div>
                <label style={labelStyle}>
                  <span style={dotStyle("#f59e0b")} /> Style
                </label>
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    type="button"
                    onClick={() => updateFieldProperty(activeField, "isBold", !activeF.isBold)}
                    style={styleToggleBtn(activeF.isBold, "#7c3aed")}
                    title="Bold"
                  >
                    <Bold style={{ width: 14, height: 14 }} />
                    <span style={{ fontSize: 10, fontWeight: 700 }}>Bold</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => updateFieldProperty(activeField, "isItalic", !activeF.isItalic)}
                    style={styleToggleBtn(activeF.isItalic, "#0ea5e9")}
                    title="Italic"
                  >
                    <Italic style={{ width: 14, height: 14 }} />
                    <span style={{ fontSize: 10, fontWeight: 700, fontStyle: "italic" }}>Italic</span>
                  </button>
                </div>
              </div>

              {/* Alignment */}
              <div>
                <label style={labelStyle}>
                  <span style={dotStyle("#f43f5e")} /> Alignment
                </label>
                <div style={{ display: "flex", gap: 4, background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: 10, padding: 3 }}>
                  {(["left", "center", "right"] as const).map((align) => {
                    const isSelected = activeF.align === align;
                    return (
                      <button
                        key={align}
                        type="button"
                        onClick={() => updateFieldProperty(activeField, "align", align)}
                        style={{
                          flex: 1,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          padding: "7px 4px",
                          background: isSelected ? "#7c3aed" : "transparent",
                          border: "none",
                          borderRadius: 8,
                          cursor: "pointer",
                          color: isSelected ? "#fff" : "#64748b",
                          transition: "all 150ms ease",
                        }}
                      >
                        {align === "left" && <AlignLeft style={{ width: 14, height: 14 }} />}
                        {align === "center" && <AlignCenter style={{ width: 14, height: 14 }} />}
                        {align === "right" && <AlignRight style={{ width: 14, height: 14 }} />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Font Size */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <label style={labelStyle}>
                  <span style={dotStyle("#06b6d4")} /> Font Size
                </label>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#7c3aed",
                  background: "#f5f3ff",
                  padding: "2px 8px",
                  borderRadius: 6,
                  border: "1px solid #ede9fe",
                }}>
                  {(activeF.fontSize * 100).toFixed(1)}% h
                </span>
              </div>
              <div style={{ position: "relative" }}>
                <input
                  type="range"
                  min="0.01"
                  max="0.1"
                  step="0.001"
                  value={activeF.fontSize}
                  onChange={(e) => updateFieldProperty(activeField, "fontSize", parseFloat(e.target.value))}
                  style={{ width: "100%", cursor: "pointer", accentColor: "#7c3aed", height: 4, borderRadius: 4 }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "#94a3b8" }}>Small</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "#94a3b8" }}>Large</span>
                </div>
              </div>
            </div>

            {/* Color */}
            <div>
              <label style={labelStyle}>
                <span style={dotStyle("#ec4899")} /> Text Color
              </label>
              {/* Preset palette */}
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                {["#000000","#1e3a5f","#7c3aed","#0ea5e9","#10b981","#f59e0b","#ef4444","#831843","#ffffff","#c8a96e","#6b21a8","#1e40af"].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => updateFieldProperty(activeField, "color", c)}
                    title={c}
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      background: c,
                      border: activeF.color === c ? "3px solid #7c3aed" : "2px solid #e2e8f0",
                      cursor: "pointer",
                      boxShadow: activeF.color === c ? "0 0 0 2px rgba(124,58,237,0.3)" : "none",
                      transition: "all 120ms ease",
                      flexShrink: 0,
                    }}
                  />
                ))}
              </div>
              {/* Custom color picker */}
              <div style={{ display: "flex", gap: 10, alignItems: "center", background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: 10, padding: "8px 12px" }}>
                <input
                  type="color"
                  value={activeF.color}
                  onChange={(e) => updateFieldProperty(activeField, "color", e.target.value)}
                  style={{ width: 36, height: 36, border: "none", cursor: "pointer", background: "transparent", borderRadius: 6 }}
                  aria-label="Custom text color picker"
                />
                <div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 700, color: "#0f172a", textTransform: "uppercase" }}>
                    {activeF.color}
                  </div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 10, color: "#94a3b8", marginTop: 1 }}>
                    Custom color
                  </div>
                </div>
                <div style={{ marginLeft: "auto", width: 28, height: 28, borderRadius: 8, background: activeF.color, border: "2px solid #e2e8f0", boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Position Info Card */}
        <div style={{
          background: "linear-gradient(135deg, #0f172a, #1e293b)",
          border: "1.5px solid #334155",
          borderRadius: 14,
          padding: "14px 16px",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Position
            </span>
            <div style={{ display: "flex", gap: 12 }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#a78bfa" }}>
                X: {Math.round(activeF.x * 100)}%
              </span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#38bdf8" }}>
                Y: {Math.round(activeF.y * 100)}%
              </span>
            </div>
          </div>
          <div style={{ marginTop: 8, height: 2, background: "#1e293b", borderRadius: 2, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${activeF.x * 100}%`, background: "linear-gradient(90deg, #7c3aed, #a78bfa)", transition: "width 100ms ease" }} />
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Shared inline style helpers ─────────────────────── */
const labelStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 6,
  fontFamily: "'Space Grotesk', sans-serif",
  fontSize: 11,
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.07em",
  color: "#475569",
  marginBottom: 8,
};

const dotStyle = (color: string): React.CSSProperties => ({
  width: 6,
  height: 6,
  borderRadius: "50%",
  background: color,
  display: "inline-block",
  flexShrink: 0,
});

const selectStyle: React.CSSProperties = {
  appearance: "none",
  width: "100%",
  fontFamily: "'Space Grotesk', sans-serif",
  fontSize: 13,
  fontWeight: 600,
  padding: "10px 36px 10px 12px",
  background: `#f8fafc url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%237c3aed' stroke-width='2.5'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E") no-repeat right 10px center`,
  border: "1.5px solid #e2e8f0",
  borderRadius: 10,
  color: "#0f172a",
  cursor: "pointer",
  outline: "none",
  transition: "all 150ms ease",
};

const styleToggleBtn = (isActive: boolean, color: string): React.CSSProperties => ({
  flex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 4,
  padding: "8px 6px",
  background: isActive ? color : "#f8fafc",
  border: isActive ? `2px solid ${color}` : "1.5px solid #e2e8f0",
  borderRadius: 10,
  cursor: "pointer",
  color: isActive ? "#fff" : "#64748b",
  fontFamily: "'Space Grotesk', sans-serif",
  transition: "all 150ms ease",
  boxShadow: isActive ? `0 2px 8px ${color}55` : "none",
});
