import { Navbar } from "./components/Navbar";
import { Dashboard } from "./components/Dashboard";

function App() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background: "#f5f5f0",
      }}
    >
      <Navbar />
      <Dashboard />

      {/* Footer */}
      <footer
        style={{
          width: "100%",
          background: "#000",
          borderTop: "3px solid #000",
          padding: "20px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div
          style={{
            fontFamily: "'Space Grotesk', system-ui, sans-serif",
            fontSize: 12,
            fontWeight: 600,
            color: "#555",
          }}
        >
          © {new Date().getFullYear()}{" "}
          <span style={{ color: "#FFD60A", fontWeight: 800 }}>CertiGen</span> — Powered by React
          &amp; FastAPI
        </div>
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            fontWeight: 600,
            color: "#333",
          }}
        >
          Local Processing · No Database · No Uploads
        </div>
      </footer>
    </div>
  );
}

export default App;
