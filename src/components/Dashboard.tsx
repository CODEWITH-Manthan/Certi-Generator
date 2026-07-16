"use client";
import React, { useState, useEffect } from "react";
import { Dropzone } from "./Dropzone";
import { Designer, type FieldConfig } from "./Designer";
import { DataEditor } from "./DataEditor";
import { ProgressModal, type ProgressStep } from "./ProgressModal";
import { Notification, type ToastProps } from "./Notification";
import {
  Type,
  BookOpen,
  Calendar,
  Fingerprint,
  RefreshCw,
  Zap,
  FileText,
  BarChart3,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const API_BASE = "/api";

/* ── Stat Card ──────────────────────────────────────── */
interface StatCardProps {
  label: string;
  value: string | number;
  accent: string;
  shadow: string;
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, accent, shadow, icon }) => (
  <div
    className="brut-stat"
    style={{
      borderTop: `6px solid ${accent}`,
      boxShadow: shadow,
    }}
  >
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
      <div>
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
          {label}
        </div>
        <div
          style={{
            fontFamily: "'Space Grotesk', system-ui, sans-serif",
            fontSize: 36,
            fontWeight: 800,
            color: "#000",
            lineHeight: 1,
            letterSpacing: "-0.03em",
          }}
        >
          {value}
        </div>
      </div>
      <div
        style={{
          background: accent,
          border: "2px solid #000",
          padding: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </div>
    </div>
  </div>
);

/* ── Step Badge ──────────────────────────────────────── */
interface WorkflowStepProps {
  number: number;
  label: string;
  desc: string;
  accent: string;
  isLast?: boolean;
}

const WorkflowStep: React.FC<WorkflowStepProps> = ({ number, label, desc, accent, isLast }) => (
  <div style={{ display: "flex", alignItems: "flex-start", gap: 16, flex: 1 }}>
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div
        style={{
          width: 40,
          height: 40,
          background: accent,
          border: "3px solid #000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Space Grotesk', system-ui, sans-serif",
          fontSize: 16,
          fontWeight: 900,
          color: "#000",
          flexShrink: 0,
          boxShadow: "3px 3px 0 #000",
        }}
      >
        {number}
      </div>
    </div>
    <div style={{ flex: 1, paddingTop: 4 }}>
      <div
        style={{
          fontFamily: "'Space Grotesk', system-ui, sans-serif",
          fontSize: 14,
          fontWeight: 800,
          color: "#000",
          letterSpacing: "-0.01em",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: "'Space Grotesk', system-ui, sans-serif",
          fontSize: 12,
          fontWeight: 500,
          color: "#555",
          marginTop: 4,
          lineHeight: 1.5,
        }}
      >
        {desc}
      </div>
    </div>
    {!isLast && (
      <ArrowRight
        style={{
          width: 20,
          height: 20,
          color: "#000",
          flexShrink: 0,
          marginTop: 10,
          display: "none",
        }}
        className="workflow-arrow"
      />
    )}
  </div>
);

/* ── Dashboard ───────────────────────────────────────── */
export const Dashboard: React.FC = () => {
  /* Files State */
  const [templateFile, setTemplateFile] = useState<File | null>(null);
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [templateUrl, setTemplateUrl] = useState<string>("");
  const [columns, setColumns] = useState<string[]>([]);
  const [excelData, setExcelData] = useState<Record<string, string>[]>([]);
  const [sampleData, setSampleData] = useState<Record<string, string>>({});
  const [isLoadingColumns, setIsLoadingColumns] = useState(false);
  const [certsGenerated, setCertsGenerated] = useState(0);

  const [fields, setFields] = useState<Record<string, FieldConfig>>({
    name: {
      column: "",
      x: 0.5,
      y: 0.42,
      fontSize: 0.045,
      color: "#0f172a",
      font: "Inter",
      isBold: true,
      isItalic: false,
      align: "center",
      label: "Recipient Name",
      previewText: "Jane Doe",
      icon: <Type className="w-4 h-4" />,
    },
    course: {
      column: "",
      x: 0.5,
      y: 0.54,
      fontSize: 0.03,
      color: "#4f46e5",
      font: "Inter",
      isBold: false,
      isItalic: false,
      align: "center",
      label: "Course Title",
      previewText: "Certified Artificial Intelligence Professional",
      icon: <BookOpen className="w-4 h-4" />,
    },
    date: {
      column: "",
      x: 0.32,
      y: 0.72,
      fontSize: 0.022,
      color: "#475569",
      font: "Inter",
      isBold: false,
      isItalic: false,
      align: "center",
      label: "Issue Date",
      previewText: "June 8, 2026",
      icon: <Calendar className="w-4 h-4" />,
    },
    cert_id: {
      column: "",
      x: 0.68,
      y: 0.72,
      fontSize: 0.022,
      color: "#475569",
      font: "Inter",
      isBold: false,
      isItalic: false,
      align: "center",
      label: "Certificate ID",
      previewText: "CERT-ID: 987654",
      icon: <Fingerprint className="w-4 h-4" />,
    },
  });

  const [toast, setToast] = useState<ToastProps | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [zipBlob, setZipBlob] = useState<Blob | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [progressSteps, setProgressSteps] = useState<ProgressStep[]>([
    { label: "Preparing upload package", status: "waiting" },
    { label: "Validating spreadsheet columns", status: "waiting" },
    { label: "Drawing text overlays on certificates", status: "waiting" },
    { label: "Compiling PDFs and building ZIP", status: "waiting" },
  ]);

  useEffect(() => {
    if (templateFile) {
      const url = URL.createObjectURL(templateFile);
      setTemplateUrl(url);
      showToast("Template image loaded.", "info");
      return () => URL.revokeObjectURL(url);
    } else {
      setTemplateUrl("");
    }
  }, [templateFile]);

  useEffect(() => {
    if (excelFile) {
      fetchColumns(excelFile);
    } else {
      setColumns([]);
      setExcelData([]);
      setSampleData({});
    }
  }, [excelFile]);

  const showToast = (message: string, type: "success" | "error" | "info") => {
    setToast({ id: Math.random().toString(), message, type });
  };

  const fetchColumns = async (file: File) => {
    setIsLoadingColumns(true);
    const formData = new FormData();
    formData.append("excel", file);
    try {
      const response = await fetch(`${API_BASE}/parse-excel`, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Unable to parse Excel file columns.");
      const data = await response.json();
      setColumns(data.columns);
      if (data.data) setExcelData(data.data);
      if (data.sample_data) setSampleData(data.sample_data);
      showToast(`Excel loaded: ${data.columns.length} columns detected.`, "success");

      const newFields = { ...fields };
      const colLower = data.columns.map((c: string) => c.toLowerCase());
      const mapHelper = (fieldKey: string, synonyms: string[]) => {
        const index = colLower.findIndex((c: string) => {
          /* split column name into words to avoid substring matches like "candidate" containing "date" */
          const words = c.split(/[^a-z0-9]/).filter(Boolean);
          return synonyms.some((syn) =>
            words.includes(syn) || c === syn /* also allow exact match */
          );
        });
        if (index !== -1) newFields[fieldKey].column = data.columns[index];
      };
      mapHelper("name", ["name", "recipient", "student", "candidate", "participant"]);
      mapHelper("course", ["course", "program", "class", "subject", "event", "competition"]);
      mapHelper("date", ["date", "issue", "award", "completed", "time"]);
      mapHelper("cert_id", ["id", "uuid", "cert", "number", "code", "reference"]);
      setFields(newFields);
    } catch (err: any) {
      showToast(err.message || "Failed to load columns.", "error");
      setExcelFile(null);
    } finally {
      setIsLoadingColumns(false);
    }
  };

  const handleGenerate = async () => {
    if (!templateFile || excelData.length === 0) {
      showToast("Please upload both template and spreadsheet files with data.", "error");
      return;
    }
    const hasMapping = Object.values(fields).some((f) => f.column !== "");
    if (!hasMapping) {
      showToast("Please map at least one field to an Excel column.", "error");
      return;
    }

    setIsGenerating(true);
    setProgress(10);
    setZipBlob(null);
    setErrorMsg("");

    const steps: ProgressStep[] = [
      { label: "Preparing upload package", status: "running" },
      { label: "Validating spreadsheet columns", status: "waiting" },
      { label: "Drawing text overlays on certificates", status: "waiting" },
      { label: "Compiling PDFs and building ZIP", status: "waiting" },
    ];
    setProgressSteps(steps);

    const formData = new FormData();
    formData.append("template", templateFile);
    formData.append("excel_data", JSON.stringify(excelData));

    const mappingsToSend = Object.entries(fields).reduce((acc, [key, f]) => {
      acc[key] = {
        column: f.column,
        x: f.x,
        y: f.y,
        fontSize: f.fontSize,
        color: f.color,
        font: f.font,
        align: f.align,
        isBold: f.isBold,
        isItalic: f.isItalic,
      };
      return acc;
    }, {} as Record<string, any>);

    formData.append("mapping", JSON.stringify(mappingsToSend));

    try {
      setProgress(30);
      updateStep(0, "completed");
      updateStep(1, "running");

      const response = await fetch(`${API_BASE}/generate`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({ detail: "Generation failed." }));
        throw new Error(errData.detail || "Server error occurred during PDF generation.");
      }

      setProgress(60);
      updateStep(1, "completed");
      updateStep(2, "running");

      await new Promise((resolve) => setTimeout(resolve, 800));

      setProgress(85);
      updateStep(2, "completed");
      updateStep(3, "running");

      const blob = await response.blob();
      setZipBlob(blob);
      setProgress(100);
      updateStep(3, "completed");
      setCertsGenerated((prev) => prev + excelData.length);
      showToast("Certificates compiled successfully!", "success");
    } catch (err: any) {
      setProgressSteps((prev) =>
        prev.map((s) => (s.status === "running" ? { ...s, status: "failed" as const } : s))
      );
      setErrorMsg(err.message || "Failed to generate certificates.");
      showToast("Failed to compile certificates.", "error");
    }
  };

  const updateStep = (idx: number, status: ProgressStep["status"]) => {
    setProgressSteps((prev) =>
      prev.map((s, i) =>
        i === idx
          ? { ...s, status }
          : i === idx + 1 && status === "completed"
          ? { ...s, status: "running" as const }
          : s
      )
    );
  };

  const triggerDownload = () => {
    if (!zipBlob) return;
    const url = window.URL.createObjectURL(zipBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Certificates_${new Date().toISOString().slice(0, 10)}.zip`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    showToast("ZIP archive downloaded.", "success");
  };

  const canGenerate = templateFile && excelData.length > 0;

  return (
    <main
      style={{
        flex: 1,
        width: "100%",
        maxWidth: 1280,
        margin: "0 auto",
        padding: "0 24px 64px",
      }}
    >
      {/* ── Hero Section ───────────────────────────────── */}
      <section
        style={{
          borderBottom: "3px solid #000",
          padding: "56px 0 48px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background accent blocks */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 320,
            height: "100%",
            background: "#FFD60A",
            clipPath: "polygon(60% 0, 100% 0, 100% 100%, 30% 100%)",
            opacity: 0.08,
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative" }}>
          {/* Tag line */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <span className="brut-label brut-label-yellow">Certificate Automation</span>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                fontWeight: 700,
                color: "#555",
              }}
            >
              v2.0 — Powered by FastAPI
            </span>
          </div>

          {/* Headline */}
          <h2
            style={{
              fontFamily: "'Space Grotesk', system-ui, sans-serif",
              fontSize: "clamp(32px, 5vw, 60px)",
              fontWeight: 900,
              color: "#000",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              maxWidth: 700,
              marginBottom: 20,
            }}
          >
            Generate Hundreds of{" "}
            <span
              style={{
                background: "#FFD60A",
                paddingLeft: 4,
                paddingRight: 4,
              }}
            >
              Certificates
            </span>{" "}
            in Seconds
          </h2>

          <p
            style={{
              fontFamily: "'Space Grotesk', system-ui, sans-serif",
              fontSize: 16,
              fontWeight: 500,
              color: "#444",
              maxWidth: 560,
              lineHeight: 1.6,
              marginBottom: 32,
            }}
          >
            Upload a certificate template, import your Excel list, position the text fields, and export print-ready PDFs in bulk — no design software needed.
          </p>

          {/* CTA Buttons */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
            <button
              onClick={() =>
                document
                  .getElementById("upload-section")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="brut-btn brut-btn-black"
              style={{ fontSize: 15 }}
              aria-label="Start generating certificates"
            >
              <Zap style={{ width: 16, height: 16 }} />
              Start Generating
            </button>
            <button
              onClick={() =>
                document
                  .getElementById("workflow-section")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="brut-btn brut-btn-white"
              style={{ fontSize: 15 }}
              aria-label="Learn how it works"
            >
              How It Works
            </button>
          </div>
        </div>
      </section>

      {/* ── Stats Row ───────────────────────────────────── */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16,
          padding: "32px 0",
          borderBottom: "3px solid #000",
        }}
      >
        <StatCard
          label="Templates Loaded"
          value={templateFile ? 1 : 0}
          accent="#FFD60A"
          shadow="6px 6px 0 #FFD60A"
          icon={<FileText style={{ width: 18, height: 18, color: "#000" }} />}
        />
        <StatCard
          label="Certs Generated"
          value={certsGenerated}
          accent="#00E5FF"
          shadow="6px 6px 0 #00E5FF"
          icon={<BarChart3 style={{ width: 18, height: 18, color: "#000" }} />}
        />
        <StatCard
          label="Records Loaded"
          value={excelData.length}
          accent="#FF4D6D"
          shadow="6px 6px 0 #FF4D6D"
          icon={<CheckCircle2 style={{ width: 18, height: 18, color: "#000" }} />}
        />
      </section>

      {/* ── Workflow Steps ──────────────────────────────── */}
      <section
        id="workflow-section"
        style={{
          padding: "36px 0",
          borderBottom: "3px solid #000",
        }}
      >
        <div style={{ marginBottom: 24 }}>
          <span className="brut-label">How It Works</span>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 24,
          }}
        >
          <WorkflowStep
            number={1}
            label="Upload Template"
            desc="Drop your certificate PNG/JPG background image"
            accent="#FFD60A"
          />
          <WorkflowStep
            number={2}
            label="Upload Excel"
            desc="Import your .xlsx spreadsheet with recipient data"
            accent="#00E5FF"
          />
          <WorkflowStep
            number={3}
            label="Map & Position"
            desc="Drag fields onto your template, style with fonts & colors"
            accent="#FF4D6D"
          />
          <WorkflowStep
            number={4}
            label="Generate & Download"
            desc="Click Generate — download a ZIP of all PDFs instantly"
            accent="#FFD60A"
            isLast
          />
        </div>
      </section>

      {/* ── Upload Section ──────────────────────────────── */}
      <section
        id="upload-section"
        style={{ padding: "40px 0", borderBottom: "3px solid #000" }}
      >
        {/* Section header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
            marginBottom: 28,
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div className="brut-step brut-step-yellow">1</div>
              <span className="brut-label">Upload Files</span>
            </div>
            <h3
              style={{
                fontFamily: "'Space Grotesk', system-ui, sans-serif",
                fontSize: 22,
                fontWeight: 800,
                color: "#000",
                letterSpacing: "-0.02em",
              }}
            >
              Upload Your Template & Spreadsheet
            </h3>
          </div>

          {canGenerate && (
            <button
              onClick={handleGenerate}
              className="brut-btn brut-btn-black"
              style={{ fontSize: 15 }}
              aria-label="Generate all certificates"
            >
              <Zap style={{ width: 16, height: 16 }} />
              Generate All Certificates ({excelData.length})
            </button>
          )}
        </div>

        {/* Dropzones grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 20,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "'Space Grotesk', system-ui, sans-serif",
                fontSize: 12,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "#000",
                marginBottom: 10,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span
                style={{
                  background: "#FFD60A",
                  border: "2px solid #000",
                  width: 18,
                  height: 18,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  fontWeight: 900,
                }}
              >
                A
              </span>
              Certificate Template
            </div>
            <Dropzone
              type="template"
              title="Certificate Graphic Template"
              subtitle="Supports PNG or JPG images up to 5MB"
              accept=".png,.jpg,.jpeg"
              file={templateFile}
              onFileSelect={setTemplateFile}
            />
          </div>

          <div style={{ position: "relative" }}>
            <div
              style={{
                fontFamily: "'Space Grotesk', system-ui, sans-serif",
                fontSize: 12,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "#000",
                marginBottom: 10,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span
                style={{
                  background: "#00E5FF",
                  border: "2px solid #000",
                  width: 18,
                  height: 18,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  fontWeight: 900,
                }}
              >
                B
              </span>
              Recipient Spreadsheet
            </div>
            <Dropzone
              type="excel"
              title="Student Spreadsheet Database"
              subtitle="Supports standard .xlsx Excel files"
              accept=".xlsx"
              file={excelFile}
              onFileSelect={setExcelFile}
            />
            {/* Loading overlay */}
            {isLoadingColumns && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(255,255,255,0.9)",
                  border: "3px solid #000",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  marginTop: 32, /* account for label */
                }}
              >
                <RefreshCw
                  style={{ width: 18, height: 18, color: "#000", animation: "spin 1s linear infinite" }}
                />
                <span
                  style={{
                    fontFamily: "'Space Grotesk', system-ui, sans-serif",
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#000",
                  }}
                >
                  Reading columns...
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Designer / Field Mapper ─────────────────────── */}
      {templateUrl ? (
        <section style={{ padding: "40px 0" }}>
          {/* Header */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div className="brut-step brut-step-yellow">2</div>
              <span className="brut-label">Field Designer</span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 16,
              }}
            >
              <div>
                <h3
                  style={{
                    fontFamily: "'Space Grotesk', system-ui, sans-serif",
                    fontSize: 22,
                    fontWeight: 800,
                    color: "#000",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Map & Position Certificate Fields
                </h3>
                <p
                  style={{
                    fontFamily: "'Space Grotesk', system-ui, sans-serif",
                    fontSize: 13,
                    fontWeight: 500,
                    color: "#555",
                    marginTop: 6,
                  }}
                >
                  Select which Excel column populates each field, then drag to position on your template.
                </p>
              </div>
              {canGenerate && (
                <button
                  onClick={handleGenerate}
                  className="brut-btn brut-btn-yellow"
                  style={{ fontSize: 14 }}
                  aria-label="Generate certificates"
                >
                  <Zap style={{ width: 15, height: 15 }} />
                  Generate {excelData.length} Certificates
                </button>
              )}
            </div>
          </div>

          {/* Designer card */}
          <div
            style={{
              background: "#fff",
              border: "3px solid #000",
              boxShadow: "8px 8px 0 #000",
              borderRadius: 4,
              padding: 24,
            }}
          >
            <Designer
              templateUrl={templateUrl}
              columns={columns}
              fields={fields}
              sampleData={sampleData}
              onChange={setFields}
            />

            {columns.length > 0 && (
              <div style={{ marginTop: 24, paddingTop: 24, borderTop: "2px solid #000" }}>
                <div style={{ marginBottom: 16 }}>
                  <div className="brut-step brut-step-yellow" style={{ marginBottom: 8, display: "inline-flex" }}>
                    3
                  </div>
                  <h4
                    style={{
                      fontFamily: "'Space Grotesk', system-ui, sans-serif",
                      fontSize: 16,
                      fontWeight: 800,
                      color: "#000",
                      marginTop: 8,
                    }}
                  >
                    Review Recipient Data
                  </h4>
                  <p
                    style={{
                      fontFamily: "'Space Grotesk', system-ui, sans-serif",
                      fontSize: 12,
                      fontWeight: 500,
                      color: "#555",
                      marginTop: 4,
                    }}
                  >
                    Edit individual records before generation.
                  </p>
                </div>
                <DataEditor
                  columns={columns}
                  data={excelData}
                  onChange={(newData) => {
                    setExcelData(newData);
                    if (newData.length > 0) setSampleData(newData[0]);
                  }}
                />
              </div>
            )}
          </div>
        </section>
      ) : (
        /* Empty state for Designer */
        <section style={{ padding: "40px 0" }}>
          <div
            style={{
              background: "#f5f5f0",
              border: "3px dashed #ccc",
              borderRadius: 4,
              padding: "48px 24px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
              textAlign: "center",
            }}
          >
            <div
              style={{
                background: "#fff",
                border: "3px solid #000",
                padding: 16,
                boxShadow: "4px 4px 0 #000",
              }}
            >
              <Type style={{ width: 28, height: 28, color: "#000" }} />
            </div>
            <div>
              <p
                style={{
                  fontFamily: "'Space Grotesk', system-ui, sans-serif",
                  fontSize: 16,
                  fontWeight: 800,
                  color: "#000",
                }}
              >
                Upload a template to open the designer
              </p>
              <p
                style={{
                  fontFamily: "'Space Grotesk', system-ui, sans-serif",
                  fontSize: 13,
                  fontWeight: 500,
                  color: "#555",
                  marginTop: 6,
                }}
              >
                Once you upload a certificate template above, you'll see the field positioning editor here.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ── Generate CTA (sticky bottom) ─────────────────── */}
      {canGenerate && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            background: "#000",
            borderTop: "3px solid #FFD60A",
            padding: "16px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
            zIndex: 40,
          }}
        >
          <div
            style={{
              fontFamily: "'Space Grotesk', system-ui, sans-serif",
              fontSize: 13,
              fontWeight: 600,
              color: "#888",
            }}
          >
            <span style={{ color: "#FFD60A", fontWeight: 800 }}>{excelData.length} records</span> ready · Template loaded
          </div>
          <button
            onClick={handleGenerate}
            className="brut-btn brut-btn-yellow"
            style={{ fontSize: 14 }}
            aria-label="Generate all certificates now"
          >
            <Zap style={{ width: 15, height: 15 }} />
            Generate {excelData.length} Certificates Now
          </button>
        </div>
      )}

      {/* Modals */}
      <ProgressModal
        isOpen={isGenerating}
        steps={progressSteps}
        progress={progress}
        errorMsg={errorMsg}
        onDownload={triggerDownload}
        onClose={() => setIsGenerating(false)}
      />
      <Notification toast={toast} onClose={() => setToast(null)} />

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 640px) {
          section > div[style*="grid-template-columns: repeat(3"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
};

export default Dashboard;
