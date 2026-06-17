import React, { useRef, useState, useEffect } from "react";
import { Move, AlignLeft, AlignCenter, AlignRight, Settings, Bold, Italic } from "lucide-react";

export interface FieldConfig {
  column: string;
  x: number;
  y: number;
  fontSize: number; // as ratio of height (e.g., 0.035 = 3.5% of height)
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

  // Update container dimensions on resize or load
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

  // Handle Dragging
  const handleMouseDown = (fieldKey: string, e: React.MouseEvent) => {
    e.preventDefault();
    setActiveField(fieldKey);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      
      // Calculate relative coordinates (0 to 1)
      let x = (moveEvent.clientX - rect.left) / rect.width;
      let y = (moveEvent.clientY - rect.top) / rect.height;

      // Clamp values between 0.02 and 0.98 to avoid overflowing margins
      x = Math.max(0.01, Math.min(0.99, x));
      y = Math.max(0.01, Math.min(0.99, y));

      const updatedFields = {
        ...fields,
        [fieldKey]: {
          ...fields[fieldKey],
          x,
          y,
        },
      };
      onChange(updatedFields);
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const updateFieldProperty = (fieldKey: string, key: keyof FieldConfig, value: any) => {
    const updatedFields = {
      ...fields,
      [fieldKey]: {
        ...fields[fieldKey],
        [key]: value,
      },
    };
    onChange(updatedFields);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Visual Canvas Designer (Left 8 Columns) */}
      <div className="lg:col-span-8 flex flex-col gap-4">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f5f5f0", padding: "14px 16px", border: "2px solid #000", borderRadius: 2 }}>
          <div>
            <h3 style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontSize: 13, fontWeight: 800, color: "#000" }}>Interactive Canvas</h3>
            <p style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontSize: 11, fontWeight: 500, color: "#555", marginTop: 2 }}>Drag tags on the certificate to reposition them.</p>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button 
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className={isPreviewMode ? "brut-btn brut-btn-yellow" : "brut-btn brut-btn-white"}
              style={{ fontSize: 11, padding: "6px 14px" }}
            >
              {isPreviewMode ? "Preview: ON" : "Preview: OFF"}
            </button>
            <div className="brut-mono" style={{ display: "none" }}>
              {fields[activeField].label}
            </div>
          </div>
        </div>

        <div
          style={{
            border: "3px solid #000",
            boxShadow: "6px 6px 0 #000",
            overflow: "hidden",
            position: "relative",
            userSelect: "none",
            lineHeight: 0,
          }}
        >
          <img
            ref={containerRef as any}
            src={templateUrl}
            alt="Certificate Template"
            onLoad={updateDimensions}
            style={{
              display: "block",
              width: "100%",
              height: "auto",
              maxHeight: 600,
              objectFit: "contain",
              pointerEvents: "none",
            }}
          />

          {/* Render overlay fields */}
          {Object.entries(fields).map(([key, field]) => {
            const isActive = activeField === key;
            
            // Align offsets for absolute position positioning
            let transformClass = "-translate-y-1/2";
            if (field.align === "left") {
              transformClass += " translate-x-0";
            } else if (field.align === "center") {
              transformClass += " -translate-x-1/2";
            } else if (field.align === "right") {
              transformClass += " -translate-x-full";
            }

            // Estimate font style
            // using inline styles for dynamic fonts
            
            let displayText = field.column ? `[${field.column}]` : field.previewText;
            if (isPreviewMode) {
              if (field.column && sampleData && sampleData[field.column] !== undefined) {
                // Show sample data, fallback to placeholder text if empty
                displayText = sampleData[field.column] || field.previewText;
              } else {
                displayText = field.previewText;
              }
            }

            return (
              <div
                key={key}
                onMouseDown={(e) => handleMouseDown(key, e)}
                style={{
                  position: "absolute",
                  left: `${field.x * 100}%`,
                  top: `${field.y * 100}%`,
                  color: field.color,
                  fontSize: `${Math.max(10, field.fontSize * containerDimensions.height)}px`,
                  fontFamily: field.font,
                  fontWeight: field.isBold ? 'bold' : 'normal',
                  fontStyle: field.isItalic ? 'italic' : 'normal',
                  border: isActive ? "2px solid #FFD60A" : "2px solid rgba(255,255,255,0.6)",
                  background: isActive ? "rgba(0,0,0,0.85)" : "rgba(0,0,0,0.65)",
                  boxShadow: isActive ? "3px 3px 0 #FFD60A" : "2px 2px 0 #000",
                  zIndex: isActive ? 20 : 10,
                  padding: "4px 8px",
                  borderRadius: 0,
                  cursor: "move",
                  userSelect: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  whiteSpace: "nowrap",
                  lineHeight: 1,
                }}
                className={transformClass}
              >
                {/* Drag Handle Indicator */}
                <div style={{ color: "#FFD60A" }}>
                  <Move className="w-3.5 h-3.5" />
                </div>
                <span>{displayText}</span>
              </div>
            );
          })}
        </div>
      </div>

        {/* Editor Controls (Right 4 Columns) */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        {/* Field List & Dropdown Mapping */}
        <div style={{ background: "#fff", border: "3px solid #000", boxShadow: "4px 4px 0 #000", borderRadius: 2, padding: "18px 16px" }}>
          <h3 style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontSize: 14, fontWeight: 800, color: "#000", display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <Settings style={{ width: 16, height: 16, color: "#000" }} />
            Field Properties
          </h3>

          <div className="flex flex-col gap-2">
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
                    border: isActive ? "2px solid #000" : "2px solid #ddd",
                    borderRadius: 2,
                    textAlign: "left",
                    background: isActive ? "#FFD60A" : "#f5f5f0",
                    boxShadow: isActive ? "3px 3px 0 #000" : "none",
                    cursor: "pointer",
                    transition: "all 150ms ease",
                    marginBottom: 6,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ background: isActive ? "#000" : "#e5e5e5", border: "2px solid #000", padding: 6, display: "flex", borderRadius: 0, color: isActive ? "#FFD60A" : "#555" }}>
                      {field.icon}
                    </div>
                    <div>
                      <div style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontSize: 12, fontWeight: 700, color: "#000" }}>{field.label}</div>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: field.column ? "#000" : "#888", marginTop: 2 }}>
                        {field.column ? field.column : "Unmapped"}
                      </div>
                    </div>
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "#555" }}>
                    {Math.round(field.x * 100)}%,{Math.round(field.y * 100)}%
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Field Customizer */}
        <div style={{ background: "#fff", border: "3px solid #000", boxShadow: "4px 4px 0 #000", borderRadius: 2, padding: "18px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, borderBottom: "2px solid #000", paddingBottom: 12, marginBottom: 16 }}>
            <div style={{ background: "#FFD60A", border: "2px solid #000", padding: 6, display: "flex", borderRadius: 0 }}>
              {fields[activeField].icon}
            </div>
            <div>
              <h4 style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontSize: 13, fontWeight: 800, color: "#000" }}>Configure {fields[activeField].label}</h4>
              <p style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontSize: 11, color: "#555", marginTop: 2 }}>Formatting and data source.</p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {/* Column Mapping Selector */}
            <div>
              <label style={{ display: "block", fontFamily: "'Space Grotesk', system-ui, sans-serif", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#000", marginBottom: 6 }}>
                Excel Column Source
              </label>
              <select
                value={fields[activeField].column}
                onChange={(e) => updateFieldProperty(activeField, "column", e.target.value)}
                className="brut-select"
              >
                <option value="">-- Do Not Render --</option>
                {columns.map((col) => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>

            {/* Typography Section */}
            <div className="grid grid-cols-2 gap-4">
              {/* Font Family */}
              <div>
                <label style={{ display: "block", fontFamily: "'Space Grotesk', system-ui, sans-serif", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#000", marginBottom: 6 }}>
                  Font Family
                </label>
                <select
                  value={fields[activeField].font}
                  onChange={(e) => updateFieldProperty(activeField, "font", e.target.value)}
                  className="brut-select"
                >
                  <option value="Inter">Inter</option>
                  <option value="Outfit">Outfit</option>
                  <option value="Playfair Display">Playfair Display</option>
                  <option value="Montserrat">Montserrat</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Open Sans">Open Sans</option>
                  <option value="Lato">Lato</option>
                  <option value="Oswald">Oswald</option>
                  <option value="Raleway">Raleway</option>
                  <option value="Ubuntu">Ubuntu</option>
                  <option value="Poppins">Poppins</option>
                  <option value="Merriweather">Merriweather</option>
                  <option value="Lora">Lora</option>
                </select>
              </div>

              {/* Text Alignment & Style */}
              <div>
                <label style={{ display: "block", fontFamily: "'Space Grotesk', system-ui, sans-serif", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#000", marginBottom: 6 }}>
                  Style & Align
                </label>
                <div style={{ display: "flex", gap: 6 }}>
                  <div style={{ display: "flex", border: "2px solid #000", borderRadius: 2 }}>
                    <button
                      type="button"
                      onClick={() => updateFieldProperty(activeField, "isBold", !fields[activeField].isBold)}
                      style={{ padding: "6px 10px", background: fields[activeField].isBold ? "#FFD60A" : "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center" }}
                    >
                      <Bold style={{ width: 14, height: 14 }} />
                    </button>
                    <button
                      type="button"
                      onClick={() => updateFieldProperty(activeField, "isItalic", !fields[activeField].isItalic)}
                      style={{ padding: "6px 10px", background: fields[activeField].isItalic ? "#FFD60A" : "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center" }}
                    >
                      <Italic style={{ width: 14, height: 14 }} />
                    </button>
                  </div>

                  <div style={{ display: "flex", flex: 1, border: "2px solid #000", borderRadius: 2 }}>
                    {(["left", "center", "right"] as const).map((align) => {
                      const isSelected = fields[activeField].align === align;
                      return (
                        <button
                          key={align}
                          type="button"
                          onClick={() => updateFieldProperty(activeField, "align", align)}
                          style={{ flex: 1, display: "flex", justifyContent: "center", padding: "6px", background: isSelected ? "#FFD60A" : "transparent", border: "none", cursor: "pointer" }}
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
            </div>

            {/* Font Size & Color */}
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12, alignItems: "end" }}>
              {/* Font Size Slider */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <label style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#000" }}>
                    Font Size
                  </label>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, color: "#555" }}>
                    {Math.round(fields[activeField].fontSize * 1000)}px
                  </span>
                </div>
                <input
                  type="range"
                  min="0.01"
                  max="0.1"
                  step="0.001"
                  value={fields[activeField].fontSize}
                  onChange={(e) => updateFieldProperty(activeField, "fontSize", parseFloat(e.target.value))}
                  style={{ width: "100%", accentColor: "#FFD60A", cursor: "pointer" }}
                />
              </div>

              {/* Text Color Picker */}
              <div>
                <label style={{ display: "block", fontFamily: "'Space Grotesk', system-ui, sans-serif", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#000", marginBottom: 6 }}>
                  Color
                </label>
                <div style={{ display: "flex", gap: 8, alignItems: "center", background: "#f5f5f0", border: "2px solid #000", borderRadius: 2, padding: "6px 8px" }}>
                  <input
                    type="color"
                    value={fields[activeField].color}
                    onChange={(e) => updateFieldProperty(activeField, "color", e.target.value)}
                    style={{ width: 28, height: 28, border: "none", cursor: "pointer", background: "transparent" }}
                    aria-label="Text color picker"
                  />
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700, color: "#555", textTransform: "uppercase" }}>
                    {fields[activeField].color}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
