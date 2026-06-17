import React from "react";
import { Plus, Trash2 } from "lucide-react";

interface DataEditorProps {
  columns: string[];
  data: Record<string, string>[];
  onChange: (data: Record<string, string>[]) => void;
}

export const DataEditor: React.FC<DataEditorProps> = ({ columns, data, onChange }) => {
  const handleCellChange = (rowIndex: number, column: string, value: string) => {
    const newData = [...data];
    newData[rowIndex] = { ...newData[rowIndex], [column]: value };
    onChange(newData);
  };

  const addRow = () => {
    const newRow: Record<string, string> = {};
    columns.forEach(col => newRow[col] = "");
    onChange([...data, newRow]);
  };

  const removeRow = (rowIndex: number) => {
    const newData = data.filter((_, i) => i !== rowIndex);
    onChange(newData);
  };

  if (!columns.length) return null;

  return (
    <div className="flex flex-col gap-4 mt-12">
      <div className="flex items-center justify-between">
        <div>
          <h3 style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontSize: 20, fontWeight: 900, color: "#000" }}>
            Live Data Editor
          </h3>
          <p style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontSize: 13, fontWeight: 600, color: "#444", marginTop: 4 }}>
            Edit the data extracted from your Excel file directly. Changes here will be used to generate the certificates.
          </p>
        </div>
        <button
          onClick={addRow}
          className="brut-btn brut-btn-yellow"
          style={{ padding: "8px 16px", fontSize: 12, gap: 6 }}
        >
          <Plus style={{ width: 14, height: 14 }} />
          ADD ROW
        </button>
      </div>

      <div style={{ border: "3px solid #000", boxShadow: "6px 6px 0 #000", background: "#fff", maxHeight: 400, overflowX: "auto", overflowY: "auto", borderRadius: 0 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead style={{ position: "sticky", top: 0, zIndex: 10, background: "#000", color: "#FFD60A" }}>
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} style={{ padding: "12px 16px", fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 800, textTransform: "uppercase", borderRight: "2px solid #333", borderBottom: "3px solid #000", whiteSpace: "nowrap" }}>
                  {col}
                </th>
              ))}
              <th style={{ padding: "12px 16px", width: 40, borderBottom: "3px solid #000" }}></th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="group" style={{ borderBottom: "2px solid #000", transition: "background 0.2s" }}>
                {columns.map((col, colIndex) => (
                  <td key={colIndex} style={{ padding: 0, borderRight: "2px solid #000" }}>
                    <input
                      type="text"
                      value={row[col] || ""}
                      onChange={(e) => handleCellChange(rowIndex, col, e.target.value)}
                      style={{
                        width: "100%",
                        background: "transparent",
                        padding: "12px 16px",
                        outline: "none",
                        fontFamily: "'Space Grotesk', system-ui, sans-serif",
                        fontSize: 14,
                        fontWeight: 600,
                        color: "#000",
                        border: "none"
                      }}
                      className="focus:bg-yellow-50 transition-colors"
                    />
                  </td>
                ))}
                <td style={{ padding: "0 16px", textAlign: "center" }}>
                  <button
                    onClick={() => removeRow(rowIndex)}
                    style={{ background: "#FF4D6D", border: "2px solid #000", color: "#fff", padding: 6, cursor: "pointer", borderRadius: 0, boxShadow: "2px 2px 0 #000", transition: "transform 0.1s" }}
                    className="hover:-translate-y-1 hover:shadow-[3px_3px_0_#000] active:translate-y-0.5 active:shadow-[1px_1px_0_#000]"
                    title="Remove Row"
                  >
                    <Trash2 style={{ width: 14, height: 14 }} />
                  </button>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={columns.length + 1} style={{ padding: "40px", textAlign: "center", fontFamily: "'Space Grotesk', system-ui, sans-serif", fontSize: 14, fontWeight: 600, color: "#666" }}>
                  No data available. Add a row to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, color: "#000", textAlign: "right" }}>
        TOTAL ROWS: {data.length}
      </div>
    </div>
  );
};

