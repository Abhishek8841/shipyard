import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import * as api from "../services/api";
import type { Log } from "../types";
import Navbar from "../components/Navbar";
import LogTerminal from "../components/LogTerminal";
import "./LogsPage.css";

export default function LogsPage() {
  const { id } = useParams<{ id: string }>();
  const [logs, setLogs] = useState<Log[]>([]);
  const [liveLogs, setLiveLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [wsStatus, setWsStatus] = useState<"connecting" | "connected" | "disconnected">("disconnected");
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!id) return;

    api
      .getLogs(id)
      .then((data) => setLogs(data))
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load logs")
      )
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!id) return;

    const wsBase = import.meta.env.VITE_WS_URL || "ws://localhost:3010";
    const wsUrl = `${wsBase}/${id}`;

    setWsStatus("connecting");
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setWsStatus("connected");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.log) {
          setLiveLogs((prev) => [...prev, data.log]);
        }
      } catch {
        setLiveLogs((prev) => [...prev, event.data]);
      }
    };

    ws.onerror = () => {
      setWsStatus("disconnected");
    };

    ws.onclose = () => {
      setWsStatus("disconnected");
    };

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [id]);

  return (
    <div>
      <Navbar />
      <div className="logs-container">
        <Link to={`/deployment/${id}`} className="back-link">
          ← Back to details
        </Link>

        <div className="logs-header">
          <h1 className="logs-title">Build Logs</h1>
          <span className={`ws-status ws-${wsStatus}`}>
            {wsStatus === "connected"
              ? "● Live"
              : wsStatus === "connecting"
              ? "○ Connecting..."
              : "○ Disconnected"}
          </span>
        </div>

        {loading && <div className="loading">Loading logs...</div>}
        {error && <div className="error-msg">{error}</div>}
        {!loading && !error && (
          <LogTerminal logs={logs} liveLogs={liveLogs} />
        )}
      </div>
    </div>
  );
}
