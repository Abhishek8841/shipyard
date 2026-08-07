import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as api from "../services/api";
import type { Deployment } from "../types";
import DeploymentTable from "../components/DeploymentTable";
import Navbar from "../components/Navbar";
import "./DashboardPage.css";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [gitUrl, setGitUrl] = useState("");
  const [projectName, setProjectName] = useState("");
  const [directory, setDirectory] = useState("");
  const [envVars, setEnvVars] = useState("");
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    fetchDeployments();
  }, []);

  async function fetchDeployments() {
    setLoading(true);
    try {
      const data = await api.getDeployments();
      setDeployments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch deployments");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    setCreating(true);

    try {
      const payload: { url: string; projectName: string; directory?: string; env?: Record<string, any> } = {
        url: gitUrl,
        projectName,
      };
      if (directory.trim()) payload.directory = directory.trim();

      const rawEnv = envVars.trim();
      if (rawEnv) {
        if (rawEnv.startsWith("{")) {
          try {
            payload.env = JSON.parse(rawEnv);
          } catch (e) {
            setFormError('Invalid JSON format for environment variables. Example: {"PORT": "3000"}');
            setCreating(false);
            return;
          }
        } else if (rawEnv.includes("=")) {
          const parsedEnv: Record<string, string> = {};
          const lines = rawEnv.split("\n");
          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith("#")) continue;
            const eqIdx = trimmed.indexOf("=");
            if (eqIdx !== -1) {
              const key = trimmed.slice(0, eqIdx).trim();
              const val = trimmed.slice(eqIdx + 1).trim();
              if (key) parsedEnv[key] = val;
            }
          }
          payload.env = parsedEnv;
        } else {
          try {
            payload.env = JSON.parse(rawEnv);
          } catch (e) {
            setFormError('Invalid environment variables. Provide valid JSON (e.g. {"KEY":"VAL"}) or KEY=VALUE lines.');
            setCreating(false);
            return;
          }
        }
      }

      const result = await api.createDeployment(payload);

      setGitUrl("");
      setProjectName("");
      setDirectory("");
      setEnvVars("");
      setShowForm(false);

      navigate(`/deployment/${result.id}`);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to create deployment");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div>
      <Navbar />
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Deployments</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary"
          >
            {showForm ? "Cancel" : "+ New Deployment"}
          </button>
        </div>

        {showForm && (
          <div className="new-deploy-form">
            <h3>New Deployment</h3>
            <form onSubmit={handleCreate}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="projectName">Project Name</label>
                  <input
                    id="projectName"
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    required
                    placeholder="my-project"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="gitUrl">Git URL</label>
                  <input
                    id="gitUrl"
                    type="text"
                    value={gitUrl}
                    onChange={(e) => setGitUrl(e.target.value)}
                    required
                    placeholder="https://github.com/user/repo"
                  />
                </div>
              </div>
              <div className="form-group full-width">
                <label htmlFor="directory">Root Directory (optional)</label>
                <input
                  id="directory"
                  type="text"
                  value={directory}
                  onChange={(e) => setDirectory(e.target.value)}
                  placeholder="."
                />
              </div>

              <div className="form-group full-width">
                <div className="label-with-hint">
                  <label htmlFor="envVars">Environment Variables (optional)</label>
                  <span className="hint-text">JSON format or KEY=VALUE lines</span>
                </div>
                <textarea
                  id="envVars"
                  rows={4}
                  value={envVars}
                  onChange={(e) => setEnvVars(e.target.value)}
                  placeholder={`{\n  "PORT": "3000",\n  "NODE_ENV": "production"\n}`}
                  className="env-textarea"
                />
              </div>

              {formError && <p className="form-error">{formError}</p>}

              <button type="submit" disabled={creating} className="btn-primary">
                {creating ? "Creating..." : "Deploy"}
              </button>
            </form>
          </div>
        )}

        {loading && <div className="loading">Loading deployments...</div>}
        {error && <div className="error-msg">{error}</div>}
        {!loading && !error && <DeploymentTable deployments={deployments} />}
      </div>
    </div>
  );
}
