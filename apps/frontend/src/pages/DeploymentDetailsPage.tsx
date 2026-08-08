import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import * as api from "../services/api";
import type { Deployment } from "../types";
import Navbar from "../components/Navbar";
import StatusBadge from "../components/StatusBadge";
import "./DeploymentDetailsPage.css";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function maskValue(val: string): string {
  if (val.length <= 4) return "••••";
  return val.slice(0, 2) + "••••" + val.slice(-2);
}

export default function DeploymentDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [deployment, setDeployment] = useState<Deployment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showEnv, setShowEnv] = useState(false);

  useEffect(() => {
    if (!id) return;

    api
      .getDeploymentDetails(id)
      .then((d) => setDeployment(d))
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load details")
      )
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="detail-container">
          <div className="loading">Loading...</div>
        </div>
      </div>
    );
  }

  if (error || !deployment) {
    return (
      <div>
        <Navbar />
        <div className="detail-container">
          <div className="error-msg">{error || "Deployment not found"}</div>
          <Link to="/" className="back-link">← Back to deployments</Link>
        </div>
      </div>
    );
  }

  const envEntries = deployment.env ? Object.entries(deployment.env) : [];
  const deployUrl = import.meta.env.VITE_DEPLOY_URL || "http://localhost:3020";
  const deployedUrl = deployUrl.replace("://", `://${deployment.projectName}.`);

  return (
    <div>
      <Navbar />
      <div className="detail-container">
        <Link to="/" className="back-link">← Back to deployments</Link>

        <div className="detail-header">
          <h1 className="detail-title">{deployment.projectName}</h1>
          <StatusBadge status={deployment.status} />
        </div>

        <div className="url-banner">
          <div className="url-banner-header">
            <span className="url-banner-label">DEPLOYMENT URL</span>
            {deployment.status === "READY" && (
              <span className="url-live-tag">● Live</span>
            )}
          </div>
          <div className="url-banner-body">
            <a
              href={deployedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="deployed-url-link"
            >
              {deployedUrl}
              <span className="external-icon">↗</span>
            </a>
          </div>
        </div>

        <div className="detail-grid">
          <div className="detail-card">
            <h3>Project Info</h3>
            <div className="info-item">
              <span className="info-label">Deployment ID</span>
              <span className="info-value mono">{deployment.id}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Project Name</span>
              <span className="info-value font-medium">{deployment.projectName}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Root Directory</span>
              <span className="info-value mono">{deployment.directory}</span>
            </div>
          </div>

          <div className="detail-card">
            <h3>Build & Repository Info</h3>
            <div className="info-item">
              <span className="info-label">Git Repository URL</span>
              <a
                href={deployment.gitUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="info-value git-url-link mono"
              >
                {deployment.gitUrl} ↗
              </a>
            </div>
            <div className="info-item">
              <span className="info-label">Status</span>
              <div className="info-value">
                <StatusBadge status={deployment.status} />
              </div>
            </div>
            <div className="info-item">
              <span className="info-label">Created At</span>
              <span className="info-value">{formatDate(deployment.createdAt)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Updated At</span>
              <span className="info-value">{formatDate(deployment.updatedAt)}</span>
            </div>
          </div>
        </div>

        {envEntries.length > 0 && (
          <div className="detail-card env-card">
            <div className="env-header">
              <h3>Environment Variables</h3>
              <button
                onClick={() => setShowEnv(!showEnv)}
                className="env-toggle"
              >
                {showEnv ? "Hide values" : "Show values"}
              </button>
            </div>
            <div className="env-table">
              {envEntries.map(([key, val]) => (
                <div key={key} className="env-row">
                  <span className="env-key">{key}</span>
                  <span className="env-val">
                    {showEnv ? String(val) : maskValue(String(val))}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="detail-actions">
          <Link to={`/deployment/${deployment.id}/logs`} className="btn-primary">
            View Logs →
          </Link>
        </div>
      </div>
    </div>
  );
}
