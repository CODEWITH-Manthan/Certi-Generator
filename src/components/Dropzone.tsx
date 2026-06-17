import React, { useRef, useState } from "react";
import { Upload, FileImage, FileSpreadsheet, Trash2 } from "lucide-react";

interface DropzoneProps {
  type: "template" | "excel";
  title: string;
  subtitle: string;
  accept: string;
  file: File | null;
  onFileSelect: (file: File | null) => void;
}

const formatSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
};

export const Dropzone: React.FC<DropzoneProps> = ({
  type,
  title,
  subtitle,
  accept,
  file,
  onFileSelect,
}) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setIsDragActive(true);
    else if (e.type === "dragleave") setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      const dropped = e.dataTransfer.files[0];
      if (accept.includes(dropped.name.split(".").pop()?.toLowerCase() || "")) {
        onFileSelect(dropped);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) onFileSelect(e.target.files[0]);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileSelect(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const isTemplate = type === "template";
  const accentColor = isTemplate ? "#FFD60A" : "#00E5FF";
  const accentShadow = isTemplate ? "8px 8px 0 #FFD60A" : "8px 8px 0 #00E5FF";

  if (file) {
    return (
      <div
        style={{
          background: "#fff",
          border: "3px solid #000",
          boxShadow: accentShadow,
          borderRadius: 4,
          padding: "28px 24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          position: "relative",
          minHeight: 200,
          justifyContent: "center",
        }}
      >
        {/* Status badge */}
        <div
          style={{
            position: "absolute",
            top: -2,
            right: -2,
            background: "#000",
            border: "3px solid #000",
            color: accentColor,
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            padding: "4px 10px",
            fontFamily: "'Space Grotesk', system-ui, sans-serif",
          }}
        >
          Loaded
        </div>

        {/* File icon */}
        <div
          style={{
            background: accentColor,
            border: "3px solid #000",
            padding: 16,
            boxShadow: "4px 4px 0 #000",
          }}
        >
          {isTemplate ? (
            <FileImage style={{ width: 28, height: 28, color: "#000" }} />
          ) : (
            <FileSpreadsheet style={{ width: 28, height: 28, color: "#000" }} />
          )}
        </div>

        {/* File name */}
        <div style={{ textAlign: "center", maxWidth: "90%" }}>
          <p
            style={{
              fontFamily: "'Space Grotesk', system-ui, sans-serif",
              fontSize: 14,
              fontWeight: 700,
              color: "#000",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "100%",
            }}
          >
            {file.name}
          </p>
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              fontWeight: 600,
              color: "#555",
              marginTop: 4,
            }}
          >
            {formatSize(file.size)}
          </p>
        </div>

        {/* Remove button */}
        <button
          onClick={handleRemove}
          className="brut-btn brut-btn-red"
          style={{ fontSize: 12, padding: "8px 16px" }}
          aria-label="Remove file"
        >
          <Trash2 style={{ width: 14, height: 14 }} />
          <span>Remove File</span>
        </button>
      </div>
    );
  }

  return (
    <div
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      className={`brut-dropzone ${isDragActive ? "brut-dropzone-active" : ""}`}
      style={{
        padding: "36px 24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
        minHeight: 200,
        textAlign: "center",
        background: isDragActive ? "#fff9d6" : "#fff",
        boxShadow: isDragActive ? `8px 8px 0 ${accentColor}` : "none",
      }}
      role="button"
      aria-label={`Upload ${title}`}
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        style={{ display: "none" }}
        aria-label={`File input for ${title}`}
      />

      {/* Upload icon */}
      <div
        style={{
          background: isDragActive ? "#000" : "#f5f5f0",
          border: "3px solid #000",
          padding: 16,
          transition: "all 150ms ease",
        }}
      >
        <Upload
          style={{
            width: 28,
            height: 28,
            color: isDragActive ? accentColor : "#000",
          }}
        />
      </div>

      {/* Labels */}
      <div>
        <p
          style={{
            fontFamily: "'Space Grotesk', system-ui, sans-serif",
            fontSize: 15,
            fontWeight: 700,
            color: "#000",
          }}
        >
          {title}
        </p>
        <p
          style={{
            fontFamily: "'Space Grotesk', system-ui, sans-serif",
            fontSize: 12,
            fontWeight: 500,
            color: "#555",
            marginTop: 6,
          }}
        >
          {subtitle}
        </p>
      </div>

      {/* CTA pill */}
      <div
        style={{
          background: "#000",
          color: accentColor,
          fontFamily: "'Space Grotesk', system-ui, sans-serif",
          fontSize: 11,
          fontWeight: 800,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          padding: "6px 16px",
          border: "2px solid #000",
          borderRadius: 2,
        }}
      >
        Drag & Drop or Click
      </div>
    </div>
  );
};
