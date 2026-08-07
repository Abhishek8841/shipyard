import { useEffect, useRef } from "react";
import type { Log } from "../types";
import "./LogTerminal.css";

interface Props {
  logs: Log[];
  liveLogs: string[];
}

export default function LogTerminal({ logs, liveLogs }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs.length, liveLogs.length]);

  const hasLogs = logs.length > 0 || liveLogs.length > 0;

  return (
    <div className="terminal">
      {!hasLogs && (
        <div className="terminal-empty">No logs available</div>
      )}

      {logs.map((log, i) => (
        <div key={log.id} className="terminal-line">
          <span className="line-number">{i + 1}</span>
          <span className="line-text">{log.message}</span>
        </div>
      ))}

      {liveLogs.map((msg, i) => (
        <div key={`live-${i}`} className="terminal-line terminal-live">
          <span className="line-number">{logs.length + i + 1}</span>
          <span className="line-text">{msg}</span>
        </div>
      ))}

      <div ref={bottomRef} />
    </div>
  );
}
