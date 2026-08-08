import { Link } from "react-router-dom";
import type { Deployment } from "../types";
import StatusBadge from "./StatusBadge";
import "./DeploymentTable.css";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function shortId(id: string): string {
  return id.slice(0, 10);
}

interface Props {
  deployments: Deployment[];
}

export default function DeploymentTable({ deployments }: Props) {
  if (deployments.length === 0) {
    return (
      <div className="empty-state">
        No deployments yet.
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table className="deploy-table">
        <thead>
          <tr>
            <th>Project</th>
            <th>ID</th>
            <th>Status</th>
            <th>Deployment URL</th>
            <th>Created</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {deployments.map((d) => {
            const deployDomain = import.meta.env.VITE_DEPLOY_DOMAIN || "localhost";
            const deployPort = import.meta.env.VITE_DEPLOY_PORT || "3001";
            const url = `http://${d.projectName}.${deployDomain}:${deployPort}`;
            return (
              <tr key={d.id}>
                <td className="cell-project">{d.projectName}</td>
                <td className="cell-id">{shortId(d.id)}</td>
                <td>
                  <StatusBadge status={d.status} />
                </td>
                <td className="cell-url">
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="url-link-sm"
                  >
                    {d.projectName}.{deployDomain}:{deployPort} ↗
                  </a>
                </td>
                <td className="cell-date">{formatDate(d.createdAt)}</td>
                <td className="cell-action">
                  <Link to={`/deployment/${d.id}`} className="view-link">
                    View →
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
